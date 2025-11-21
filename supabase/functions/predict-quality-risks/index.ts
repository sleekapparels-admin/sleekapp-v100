import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { supplier_order_id } = await req.json();

    console.log("Predicting quality risks for:", supplier_order_id);

    // Fetch production stages
    const { data: stages, error: stagesError } = await supabaseClient
      .from('production_stages')
      .select('*')
      .eq('supplier_order_id', supplier_order_id)
      .order('stage_number');

    if (stagesError) throw stagesError;

    // Fetch supplier order details
    const { data: supplierOrder, error: orderError } = await supabaseClient
      .from('supplier_orders')
      .select('*, suppliers(performance_score, on_time_delivery_rate, total_orders_completed)')
      .eq('id', supplier_order_id)
      .single();

    if (orderError) throw orderError;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a quality control expert analyzing production data to predict potential quality risks.
Identify risk factors and provide actionable recommendations.`;

    const userPrompt = `Production Analysis:

Stages Progress:
${stages?.map(s => `- ${s.stage_name}: ${s.completion_percentage}% (Status: ${s.status})${s.target_date ? `, Target: ${s.target_date}` : ''}`).join('\n')}

Supplier Performance:
- Performance Score: ${supplierOrder.suppliers?.performance_score || 'N/A'}/100
- On-time Delivery Rate: ${supplierOrder.suppliers?.on_time_delivery_rate || 'N/A'}%
- Total Orders Completed: ${supplierOrder.suppliers?.total_orders_completed || 0}

Analyze for quality risks and provide:
1. Overall risk score (0-100, where 100 is highest risk)
2. Specific risk factors identified
3. Recommendations to mitigate risks`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "assess_quality_risk",
            description: "Assess quality risk for production order",
            parameters: {
              type: "object",
              properties: {
                risk_score: { type: "number", description: "0-100" },
                risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
                risk_factors: {
                  type: "array",
                  items: { type: "string" }
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["risk_score", "risk_level", "risk_factors", "recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "assess_quality_risk" } }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const assessment = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    // Store prediction
    if (assessment) {
      await supabaseClient.from('timeline_predictions').insert({
        supplier_order_id,
        predicted_completion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        confidence_level: assessment.risk_score < 30 ? 'high' : assessment.risk_score < 60 ? 'medium' : 'low',
        risk_factors: assessment.risk_factors
      });
    }

    return new Response(
      JSON.stringify({ success: true, assessment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in predict-quality-risks:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});