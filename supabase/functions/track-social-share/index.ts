import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid social media platforms
const VALID_PLATFORMS = ['linkedin', 'facebook', 'twitter', 'whatsapp'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, platform } = await req.json();

    // Validate required fields
    if (!post_id || !platform) {
      return new Response(
        JSON.stringify({ error: 'post_id and platform are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate platform
    if (!VALID_PLATFORMS.includes(platform)) {
      return new Response(
        JSON.stringify({ error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Create Supabase client with service role for admin operations
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

    // Rate limiting: Max 10 shares per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentShares, error: rateCheckError } = await supabaseAdmin
      .from('social_shares')
      .select('id')
      .eq('ip_address', clientIP)
      .gte('shared_at', oneHourAgo);

    if (rateCheckError) {
      console.error('Rate limit check error:', rateCheckError);
    }

    if (recentShares && recentShares.length >= 10) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many share requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: 'Blog post not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert share record
    const { error: insertError } = await supabaseAdmin
      .from('social_shares')
      .insert({
        post_id,
        platform,
        ip_address: clientIP,
      });

    if (insertError) {
      console.error('Error inserting share:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to track share' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment share count on blog post
    const { error: rpcError } = await supabaseAdmin.rpc('increment_blog_post_shares', { 
      post_id_param: post_id 
    });

    if (rpcError) {
      console.error('Error incrementing share count:', rpcError);
      // Non-blocking - share was tracked, count increment can fail
    }

    console.log(`Share tracked: ${platform} for post ${post_id} from IP ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in track-social-share function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
