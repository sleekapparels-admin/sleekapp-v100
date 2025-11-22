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

    const { order_id, product_type, quantity, requirements } = await req.json();

    console.log("AI Supplier Assignment for:", { order_id, product_type, quantity });

    // Fetch all active suppliers with their capabilities
    const { data: suppliers, error: suppliersError } = await supabaseClient
      .from('suppliers')
      .select('id, company_name, specializations, monthly_capacity, performance_score, lead_time_days')
      .eq('verification_status', 'verified')
      .eq('active', true);

    if (suppliersError) throw suppliersError;

    console.log(`Found ${suppliers?.length || 0} verified suppliers`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Use Lovable AI to analyze and recommend suppliers
    const systemPrompt = `You are an expert at matching manufacturing orders with optimal suppliers. 
Analyze the order requirements and supplier capabilities to recommend the top 3 best matches.
Consider: specialization match, capacity, performance score, lead time, and overall fit.`;

    const userPrompt = `Order Details:
- Product: ${product_type}
- Quantity: ${quantity} pieces
- Requirements: ${requirements || 'Standard quality'}

Available Suppliers:
${suppliers?.map((s, idx) => `
${idx + 1}. ${s.company_name}
   - Specializations: ${s.specializations?.join(', ') || 'General'}
   - Monthly Capacity: ${s.monthly_capacity || 'N/A'}
   - Performance Score: ${s.performance_score || 0}/100
   - Lead Time: ${s.lead_time_days || 'N/A'} days
`).join('\n')}

Recommend the top 3 suppliers with reasoning for each.`;

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
            name: "recommend_suppliers",
            description: "Recommend top suppliers for an order",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      supplier_id: { type: "string" },
                      rank: { type: "number" },
                      confidence_score: { type: "number", description: "0-100" },
                      reasoning: { type: "string" }
                    },
                    required: ["supplier_id", "rank", "confidence_score", "reasoning"]
                  }
                }
              },
              required: ["recommendations"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "recommend_suppliers" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response:", JSON.stringify(aiData));

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recommendations = toolCall ? JSON.parse(toolCall.function.arguments).recommendations : [];

    // Enrich recommendations with supplier details
    const enrichedRecommendations = recommendations.map((rec: any) => {
      const supplier = suppliers?.find(s => s.id === rec.supplier_id);
      return {
        ...rec,
        supplier_name: supplier?.company_name,
        supplier_details: supplier
      };
    });

    return new Response(
      JSON.stringify({ success: true, recommendations: enrichedRecommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in ai-supplier-assignment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});