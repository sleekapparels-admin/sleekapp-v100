import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, stylePreferences, colorPalette, complexity } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Invalid prompt. Must be at least 10 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Build enhanced prompt for design generation
    const styleHint = stylePreferences?.length > 0 
      ? ` Style preferences: ${stylePreferences.join(', ')}.` 
      : '';
    const colorHint = colorPalette?.length > 0 
      ? ` Use colors: ${colorPalette.join(', ')}.` 
      : '';
    
    const enhancedPrompt = `Create a high-quality, print-ready design for apparel/garment printing. ${prompt}${styleHint}${colorHint} The design should be clean, professional, and suitable for screen printing or DTG printing on clothing. Ultra high resolution, commercial quality.`;

    console.log('Generating design with prompt:', enhancedPrompt);

    // Call Lovable AI Gateway for image generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please contact support.' }),
          { status: 402, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate design' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image URL in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('✓ Design generated successfully');

    return new Response(
      JSON.stringify({
        pattern: {
          imageUrl,
          prompt,
          stylePreferences: stylePreferences || [],
          colorPalette: colorPalette || [],
          complexity: complexity || 'medium'
        }
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Design generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
