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
    const category = url.searchParams.get('category');
    const supplier_id = url.searchParams.get('supplier_id');
    const featured = url.searchParams.get('featured');
    const min_price = url.searchParams.get('min_price');
    const max_price = url.searchParams.get('max_price');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabase
      .from('marketplace_products')
      .select('*, suppliers(company_name, verification_status)')
      .eq('status', 'approved')
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (supplier_id) {
      query = query.eq('supplier_id', supplier_id);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (min_price) {
      query = query.gte('base_price', parseFloat(min_price));
    }

    if (max_price) {
      query = query.lte('base_price', parseFloat(max_price));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching marketplace products:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
