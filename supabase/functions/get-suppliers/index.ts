import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const country = url.searchParams.get('country');
    const specialization = url.searchParams.get('specialization');
    const verified_only = url.searchParams.get('verified_only');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('suppliers')
      .select('id, company_name, country, specializations, certifications, verification_status, performance_score, total_orders_completed, on_time_delivery_rate, lead_time_days')
      .range(offset, offset + limit - 1);

    if (country) {
      query = query.eq('country', country);
    }

    if (verified_only === 'true') {
      query = query.eq('verification_status', 'verified');
    }

    if (specialization) {
      query = query.contains('specializations', [specialization]);
    }

    const { data, error } = await query.order('performance_score', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
