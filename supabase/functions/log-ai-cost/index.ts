import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cost estimates per 1M tokens (in USD)
const COST_PER_MILLION_TOKENS = {
  'google/gemini-2.5-flash': { input: 0.075, output: 0.30 },
  'google/gemini-2.5-pro': { input: 1.25, output: 5.00 },
  'perplexity/sonar-small': { input: 0.20, output: 0.20 },
  'perplexity/sonar-large': { input: 1.00, output: 1.00 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { function_name, model, request_tokens, response_tokens, session_id, user_id } = await req.json();

    // Calculate estimated cost
    const costConfig = COST_PER_MILLION_TOKENS[model as keyof typeof COST_PER_MILLION_TOKENS];
    let estimated_cost = 0;
    
    if (costConfig) {
      const inputCost = (request_tokens / 1_000_000) * costConfig.input;
      const outputCost = (response_tokens / 1_000_000) * costConfig.output;
      estimated_cost = inputCost + outputCost;
    }

    // Insert cost tracking record
    const { error } = await supabase
      .from('ai_cost_tracking')
      .insert({
        function_name,
        model,
        request_tokens,
        response_tokens,
        estimated_cost,
        session_id,
        user_id,
      });

    if (error) {
      console.error('Error logging AI cost:', error);
      throw error;
    }

    console.log(`AI cost logged: ${function_name} - ${model} - $${estimated_cost.toFixed(6)}`);

    // Check for cost alerts (>$1 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentCosts } = await supabase
      .from('ai_cost_tracking')
      .select('estimated_cost')
      .gte('created_at', oneHourAgo);

    const hourlyCost = recentCosts?.reduce((sum, record) => sum + Number(record.estimated_cost), 0) || 0;

    if (hourlyCost > 1.0) {
      // Log cost alert
      await supabase.from('security_events').insert({
        event_type: 'cost_alert',
        severity: hourlyCost > 5 ? 'critical' : 'high',
        source: 'ai-cost-monitoring',
        details: {
          hourly_cost: hourlyCost,
          function_name,
          model,
          threshold_exceeded: true,
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, estimated_cost, hourly_cost: hourlyCost }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in log-ai-cost:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
