const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return new Response(
      JSON.stringify({ 
        ok: true, 
        timestamp: new Date().toISOString(),
        service: 'edge-functions'
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Health check failed' }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 500 
      }
    );
  }
});
