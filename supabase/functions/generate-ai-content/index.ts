import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageGenerationRequest {
  type: 'product' | 'production_stage' | 'case_study' | 'marketing';
  prompt?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
  category?: string;
  productDetails?: string;
  stage?: string;
}

// Structured prompt templates for consistent, high-quality generation
const PROMPT_TEMPLATES = {
  product_knitwear: (details: string) => 
    `Professional product photography of ${details}. Studio lighting, pure white background, photorealistic fabric texture showing knit structure clearly. High resolution commercial fashion photography. Clean, sharp focus on garment details. Professional mannequin or flat lay presentation. Ultra-realistic, magazine quality.`,
  
  product_cutsew: (details: string) => 
    `Professional product photography of ${details}. Studio lighting, pure white background, photorealistic woven fabric texture. High resolution commercial fashion photography. Clean presentation showing construction details, stitching quality. Professional display. Ultra-realistic, catalog quality.`,
  
  product_uniform: (details: string) => 
    `Professional product photography of ${details}. Studio lighting, pure white background, photorealistic uniform garment. Shows embroidery areas, branding placement clearly. High resolution commercial photography. Professional presentation. Ultra-realistic, professional catalog quality.`,
  
  product_accessories: (details: string) => 
    `Professional product photography of ${details}. Studio lighting, pure white background, photorealistic accessory. High resolution commercial photography. Clean, detailed presentation. Ultra-realistic, e-commerce quality.`,
  
  production_factory_bangladesh: (stage: string, details: string) => 
    `Photorealistic modern garment factory in Bangladesh showing ${stage}. CRITICAL: South Asian workers with Bangladeshi appearance (brown skin, dark hair, South Asian facial features). NO white people, NO East Asian people, ONLY Bangladeshi/South Asian workers. Well-lit clean industrial environment, organized workstations. Modern sewing machines or quality control stations. Workers wearing appropriate safety equipment. Professional factory setting in Dhaka, Bangladesh. Natural lighting, realistic factory atmosphere. Ultra-realistic documentary photography style.`,
  
  case_study_lifestyle: (context: string) => 
    `Professional lifestyle photography showing ${context}. Photorealistic commercial photography. Natural lighting, authentic setting. People wearing the apparel in real-world context. High-end editorial quality. Ultra-realistic, magazine-worthy composition.`,
  
  marketing_hero: (theme: string) => 
    `Professional hero banner background image for ${theme}. Abstract textile textures, fabric patterns, or manufacturing theme. High resolution, suitable for web hero section. Professional commercial photography. Clean, modern aesthetic. Ultra-realistic texture details.`,
};

function generatePrompt(request: ImageGenerationRequest): string {
  const { type, category, productDetails, stage, prompt, metadata } = request;
  
  // If custom prompt provided, use it
  if (prompt && prompt.trim()) {
    return prompt;
  }
  
  // Generate structured prompt based on type and category
  switch (type) {
    case 'product':
      const cat = (category || metadata?.category || 'knitwear').toLowerCase();
      if (cat.includes('knit') || cat.includes('polo') || cat.includes('sweater') || cat.includes('cardigan')) {
        return PROMPT_TEMPLATES.product_knitwear(productDetails || 'knit garment');
      } else if (cat.includes('uniform')) {
        return PROMPT_TEMPLATES.product_uniform(productDetails || 'uniform garment');
      } else if (cat.includes('accessories') || cat.includes('beanie') || cat.includes('bag')) {
        return PROMPT_TEMPLATES.product_accessories(productDetails || 'accessory item');
      } else {
        return PROMPT_TEMPLATES.product_cutsew(productDetails || 'cut and sew garment');
      }
    
    case 'production_stage':
      return PROMPT_TEMPLATES.production_factory_bangladesh(
        stage || metadata?.stage || 'production process',
        productDetails || 'garment manufacturing'
      );
    
    case 'case_study':
      return PROMPT_TEMPLATES.case_study_lifestyle(
        productDetails || metadata?.context || 'apparel in use'
      );
    
    case 'marketing':
      return PROMPT_TEMPLATES.marketing_hero(
        productDetails || metadata?.theme || 'textile manufacturing'
      );
    
    default:
      return prompt || 'Professional product photography, photorealistic, high quality';
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { requests } = await req.json() as { requests: ImageGenerationRequest[] };

    if (!Array.isArray(requests) || requests.length === 0) {
      throw new Error("requests must be a non-empty array");
    }

    console.log(`Processing ${requests.length} image generation requests`);

    const results = await Promise.all(
      requests.map(async (request) => {
        try {
          const { type, width = 1024, height = 1024, metadata = {} } = request;

          // Generate structured prompt
          const finalPrompt = generatePrompt(request);
          
          console.log(`Generating ${type} image with prompt:`, finalPrompt.substring(0, 100) + '...');

          // Call Lovable AI to generate image
          const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: finalPrompt
                }
              ],
              modalities: ["image", "text"],
              width,
              height,
            }),
          });

          if (!aiResponse.ok) {
            throw new Error(`AI generation failed: ${aiResponse.statusText}`);
          }

          const aiData = await aiResponse.json();
          // Extract image from Lovable AI response format
          const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!imageUrl) {
            throw new Error("No image URL returned from AI");
          }

          // Download image
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.arrayBuffer();

          // Upload to Supabase Storage
          const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
          const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from("product-images")
            .upload(fileName, imageBlob, {
              contentType: "image/webp",
              cacheControl: "3600",
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabaseClient.storage
            .from("product-images")
            .getPublicUrl(fileName);

          console.log(`Generated and uploaded: ${publicUrl}`);

          return {
            success: true,
            url: publicUrl,
            type,
            metadata: {
              ...metadata,
              prompt_used: finalPrompt.substring(0, 200),
              generated_at: new Date().toISOString(),
            },
          };
        } catch (error: any) {
          console.error(`Error generating image:`, error);
          return {
            success: false,
            error: error.message || 'Unknown error',
            type: request.type,
          };
        }
      })
    );

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`Completed: ${successful.length} successful, ${failed.length} failed`);

    return new Response(
      JSON.stringify({
        results,
        summary: {
          total: requests.length,
          successful: successful.length,
          failed: failed.length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in generate-ai-content:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
