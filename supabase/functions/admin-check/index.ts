import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'No authorization header' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'User not found' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 401 }
      );
    }

    // Check user_roles for 'admin' role (enum app_role)
    const { data: roles, error } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .limit(1);

    if (error) {
      console.error('Error fetching roles:', error);
      return new Response(
        JSON.stringify({ isAdmin: false, error: 'Role check failed' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    const isAdmin = Array.isArray(roles) && roles.length > 0;

    return new Response(
      JSON.stringify({ isAdmin }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );
  } catch (error) {
    console.error('Admin check error:', error);
    return new Response(
      JSON.stringify({ isAdmin: false, error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
