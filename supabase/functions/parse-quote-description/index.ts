import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // System prompt for parsing quote descriptions
    const systemPrompt = `You are a B2B apparel manufacturing quote parser for Sleek Apparels, a Bangladesh-based garment factory.

Your task: Extract structured information from customer descriptions for manufacturing quotes.

EXTRACT THESE FIELDS:
- productType: One of: sweater, cardigan, polo-shirt, hoodie, t-shirt, jacket, blazer, uniform, activewear, other
- quantity: Number of pieces (minimum 50)
- fabricType: Material/fabric mentioned (cotton, organic cotton, wool, merino, bamboo, polyester, etc.)
- complexityLevel: simple (basic items), medium (moderate customization), or complex (heavy customization/technical)
- additionalRequirements: Any customizations, features, or special requests

RULES:
1. If productType is not one of the specific types listed, use "other"
2. If quantity is not mentioned, do not include it in the output
3. If fabric/material is not mentioned, do not include fabricType
4. For complexityLevel:
   - simple: basic garments with no or minimal customization
   - medium: standard customizations (prints, embroidery, labels)
   - complex: technical features, multiple customizations, special construction
5. Put anything about customizations, logos, prints, labels, timeline, destination in additionalRequirements

Return ONLY a JSON object with the extracted fields. Do not include fields that weren't mentioned.

Example input: "I need 200 organic cotton hoodies with embroidered logo on chest, shipped to USA"
Example output: {"productType":"hoodie","quantity":"200","fabricType":"organic cotton","complexityLevel":"medium","additionalRequirements":"Embroidered logo on chest. Ship to USA"}`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI parsing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from AI
    let parsed;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      return new Response(
        JSON.stringify({ success: false, error: 'AI response was not valid JSON' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        parsed,
        rawDescription: description
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-quote-description:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
