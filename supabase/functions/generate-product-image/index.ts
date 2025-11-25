import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, title, category, description, colors, yarn, subcategory } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate detailed prompt for professional product photography
    const generatePrompt = () => {
      const baseStyle = "Professional product photography, studio lighting with soft shadows, pure white background (#FFFFFF), ultra-realistic fabric texture visible, 4K commercial fashion photography quality, high detail";
      
      const productType = subcategory || category;
      const displayStyle = category === 'Knitwear' ? 'invisible mannequin effect, ghost mannequin technique' : 'flat lay photography, perfectly aligned';
      
      const colorInfo = colors?.length > 0 ? `Colors: ${colors.join(', ')}.` : '';
      const fabricInfo = yarn ? `Fabric: ${yarn}.` : 'Premium quality fabric.';
      
      const detailFocus = "Show fabric texture, stitching details, collar and cuff details if applicable. Professional retail product presentation. No models, no lifestyle shots, pure product focus.";
      
      return `${baseStyle}. ${displayStyle}. ${title} - ${productType}. ${description || ''}. ${colorInfo} ${fabricInfo} ${detailFocus}`;
    };

    const prompt = generatePrompt();
    console.log('Generating image with prompt:', prompt);

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
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert base64 to blob and upload to storage
    const base64Data = imageUrl.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `${productId}-${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, binaryData, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // Update product record
    const { error: updateError } = await supabase
      .from('products')
      .update({
        image_url: publicUrl,
        ai_generated_image: true,
        image_generation_prompt: prompt,
        image_generation_date: new Date().toISOString(),
        image_approved_by_admin: false
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: publicUrl,
        prompt: prompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-product-image:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});