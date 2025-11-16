import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: 'Missing email or token' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Verify bootstrap token
    const ADMIN_BOOTSTRAP_TOKEN = Deno.env.get('ADMIN_BOOTSTRAP_TOKEN');
    if (!ADMIN_BOOTSTRAP_TOKEN || token !== ADMIN_BOOTSTRAP_TOKEN) {
      console.error('Invalid bootstrap token provided');
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 403 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if any admin exists
    const { data: existingAdmins, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing admins:', checkError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Admin already exists. Bootstrap disabled for security.' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 403 }
      );
    }

    // Find user by email
    const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return new Response(
        JSON.stringify({ error: 'Failed to find user' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    const targetUser = users.users.find(u => u.email === email);
    
    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: 'User not found with that email' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 404 }
      );
    }

    // Assign admin role
    const { error: insertError } = await supabaseClient
      .from('user_roles')
      .insert({ user_id: targetUser.id, role: 'admin' });

    if (insertError) {
      console.error('Error assigning admin role:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to assign admin role' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    console.log(`✓ Admin role assigned to user: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin role assigned successfully',
        userId: targetUser.id 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );

  } catch (error) {
    console.error('Bootstrap admin error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
