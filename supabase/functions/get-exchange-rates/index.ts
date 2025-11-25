import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    const currencies = ['USD', 'EUR', 'CAD', 'AUD', 'GBP', 'BDT'];
    const baseCurrency = 'USD';

    // Check cache first
    const now = new Date();
    const { data: cached } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('base_currency', baseCurrency)
      .gte('valid_until', now.toISOString());

    if (cached && cached.length === currencies.length) {
      console.log('Using cached exchange rates');
      return new Response(
        JSON.stringify({ rates: cached }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch fresh rates from exchangerate-api.com (free tier: 1500 requests/month)
    const apiKey = Deno.env.get('EXCHANGE_RATE_API_KEY') || 'demo'; // Use 'demo' for testing
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rates = [];
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Cache for 24 hours

    // Delete old cached rates
    await supabase
      .from('exchange_rates')
      .delete()
      .eq('base_currency', baseCurrency);

    // Insert new rates
    for (const currency of currencies) {
      if (data.rates[currency]) {
        rates.push({
          base_currency: baseCurrency,
          target_currency: currency,
          rate: data.rates[currency],
          valid_until: validUntil.toISOString()
        });
      }
    }

    const { data: inserted, error } = await supabase
      .from('exchange_rates')
      .insert(rates)
      .select();

    if (error) throw error;

    console.log('Fetched and cached fresh exchange rates');
    return new Response(
      JSON.stringify({ rates: inserted }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});