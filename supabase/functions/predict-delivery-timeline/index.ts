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

    console.log("Predicting delivery timeline for:", supplier_order_id);

    // Fetch production stages
    const { data: stages, error: stagesError } = await supabaseClient
      .from('production_stages')
      .select('*')
      .eq('supplier_order_id', supplier_order_id)
      .order('stage_number');

    if (stagesError) throw stagesError;

    // Fetch supplier and order details
    const { data: supplierOrder, error: orderError } = await supabaseClient
      .from('supplier_orders')
      .select('*, suppliers(lead_time_days, on_time_delivery_rate)')
      .eq('id', supplier_order_id)
      .single();

    if (orderError) throw orderError;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const completedStages = stages?.filter(s => s.status === 'completed').length || 0;
    const totalStages = stages?.length || 0;
    const overallProgress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

    const systemPrompt = `You are an expert production timeline analyst for apparel manufacturing.
Predict realistic delivery dates based on current progress, supplier performance, and manufacturing complexity.`;

    const userPrompt = `Production Timeline Analysis:

Current Progress:
- Overall: ${overallProgress.toFixed(1)}%
- Completed Stages: ${completedStages}/${totalStages}
- Stages: ${stages?.map(s => `${s.stage_name} (${s.completion_percentage}%)`).join(', ')}

Supplier Performance:
- Standard Lead Time: ${supplierOrder.suppliers?.lead_time_days || 'N/A'} days
- On-Time Delivery Rate: ${supplierOrder.suppliers?.on_time_delivery_rate || 'N/A'}%

Order Details:
- Product: ${supplierOrder.product_type}
- Quantity: ${supplierOrder.quantity}
- Target Date: ${supplierOrder.target_date || 'Not set'}

Predict:
1. Realistic completion date
2. Confidence level (high/medium/low)
3. Potential delays or risks
4. Days until completion`;

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
            name: "predict_timeline",
            parameters: {
              type: "object",
              properties: {
                predicted_date: { type: "string", description: "YYYY-MM-DD" },
                confidence_level: { type: "string", enum: ["high", "medium", "low"] },
                days_remaining: { type: "number" },
                risk_factors: { type: "array", items: { type: "string" } }
              },
              required: ["predicted_date", "confidence_level", "days_remaining"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "predict_timeline" } }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const prediction = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    // Store prediction
    if (prediction) {
      await supabaseClient.from('timeline_predictions').upsert({
        supplier_order_id,
        predicted_completion_date: prediction.predicted_date,
        confidence_level: prediction.confidence_level,
        risk_factors: prediction.risk_factors || []
      });
    }

    return new Response(
      JSON.stringify({ success: true, prediction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error predicting timeline:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});