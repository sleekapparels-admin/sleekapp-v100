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
    const { action, topic, outline } = await req.json();

    console.log("AI Blog Assistant:", { action, topic });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";
    let model = "google/gemini-2.5-flash";

    if (action === "generate_outline") {
      systemPrompt = "You are an expert content strategist for apparel manufacturing industry.";
      userPrompt = `Create a comprehensive blog post outline for: "${topic}"
      
Include:
- Engaging title
- Introduction hook
- 5-7 main sections with subpoints
- Conclusion
- SEO keywords to target`;
    } else if (action === "write_content") {
      model = "google/gemini-2.5-pro"; // Use Pro for longer content
      systemPrompt = "You are an expert content writer specializing in apparel manufacturing, creating comprehensive, SEO-optimized blog posts.";
      userPrompt = `Write a full blog post (1800-2500 words) based on this outline:

${outline}

Requirements:
- Professional yet engaging tone
- Include statistics and facts where relevant
- SEO-optimized with natural keyword placement
- Clear section headers
- Actionable insights for readers
- Strong conclusion with CTA`;
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ success: true, content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in ai-blog-assistant:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});