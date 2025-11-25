import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_type, material, features, target_audience } = await req.json();

    console.log("Generating product description for:", product_type);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert copywriter specializing in apparel product descriptions.
Create compelling, SEO-optimized product descriptions that highlight quality, features, and benefits.`;

    const userPrompt = `Generate a complete product description for:

Product Type: ${product_type}
Material: ${material}
Key Features: ${features?.join(', ')}
Target Audience: ${target_audience}

Provide:
1. Product title (catchy, includes main keyword)
2. Full description (200-300 words, SEO-optimized)
3. Feature bullet points (5-7 points)
4. Meta description (150-160 characters for SEO)`;

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
            name: "generate_product_content",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                features: {
                  type: "array",
                  items: { type: "string" }
                },
                meta_description: { type: "string" }
              },
              required: ["title", "description", "features", "meta_description"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_product_content" } }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const content = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(
      JSON.stringify({ success: true, content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error generating product description:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});