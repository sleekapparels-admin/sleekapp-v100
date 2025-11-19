import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { email, token } = await req.json();

    // Validate required fields
    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: 'Email and token are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Create client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // SECURITY FIX: Rate limiting FIRST - check before token validation to prevent bypass
    // Max 5 attempts per IP or email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentAttempts } = await supabaseAdmin
      .from('email_verification_otps')
      .select('id')
      .or(`ip_address.eq.${clientIP},email.eq.${email}`)
      .gte('created_at', oneHourAgo);

    if (recentAttempts && recentAttempts.length > 5) {
      console.error('Rate limit exceeded for IP/email:', clientIP, email);
      return new Response(
        JSON.stringify({ error: 'Too many confirmation attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Validate one-time token from database (AFTER rate limiting)
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('email_verification_otps')
      .select('*')
      .eq('email', email)
      .eq('session_id', token)
      .eq('verified', false) // Token must not have been used yet
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      console.error('Invalid or expired token:', otpError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired confirmation token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the user by email
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found for email:', email);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Auto-confirming email for supplier: ${email} (user: ${user.id})`);

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming email:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to confirm email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Email confirmed successfully for user: ${user.id}`);

    // SECURITY: Mark token as used (set verified to true to prevent reuse)
    await supabaseAdmin
      .from('email_verification_otps')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email confirmed successfully',
        userId: user.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in auto-confirm-supplier function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
