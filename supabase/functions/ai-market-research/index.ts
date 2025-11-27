import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');

interface MarketResearchRequest {
  productType: string;
  quantity: number;
  fabricType?: string;
  complexity?: string;
  additionalRequirements?: string;
  captchaToken?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limiting: 10 requests per hour per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: rateLimitData } = await supabase
      .from('ai_quote_rate_limits')
      .select('request_count, window_start')
      .eq('identifier', ip)
      .eq('identifier_type', 'ip')
      .gte('window_start', oneHourAgo)
      .single();

    if (rateLimitData && rateLimitData.request_count >= 10) {
      console.log('Rate limit exceeded for IP:', ip);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { productType, quantity, fabricType, complexity, additionalRequirements, captchaToken }: MarketResearchRequest = await req.json();

    // SECURITY: Verify reCAPTCHA token
    if (!captchaToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.error('CAPTCHA verification failed:', recaptchaResult);
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Market research request:', { productType, quantity, fabricType, complexity });

    // Determine quantity range for caching
    let quantityRange = '0-100';
    if (quantity > 100 && quantity <= 500) quantityRange = '101-500';
    else if (quantity > 500 && quantity <= 1000) quantityRange = '501-1000';
    else if (quantity > 1000) quantityRange = '1000+';

    // Check cache first (24h validity)
    const { data: cachedResearch } = await supabase
      .from('market_research_cache')
      .select('*')
      .eq('product_category', productType.toLowerCase())
      .eq('quantity_range', quantityRange)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedResearch) {
      console.log('Using cached research data');
      return new Response(
        JSON.stringify({
          success: true,
          cached: true,
          research: cachedResearch.research_data,
          sources: cachedResearch.sources,
          confidence_score: cachedResearch.confidence_score,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Perform web search with Perplexity
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    // Build comprehensive search query
    const searchQuery = `
Current manufacturing costs for ${productType} in Bangladesh 2025:
- Quantity: ${quantity} units
${fabricType ? `- Fabric: ${fabricType}` : ''}
${complexity ? `- Complexity: ${complexity}` : ''}
${additionalRequirements ? `- Requirements: ${additionalRequirements}` : ''}

Provide:
1. Average unit cost from Bangladesh garment manufacturers
2. Material/fabric costs per unit
3. Typical lead times for this quantity
4. Industry standard markup rates
5. 3-5 comparable products with pricing
    `.trim();

    console.log('Perplexity search query:', searchQuery);

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a market research expert for apparel manufacturing. Provide detailed, factual pricing data with sources. Always cite specific sources and dates.',
          },
          {
            role: 'user',
            content: searchQuery,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', perplexityResponse.status, errorText);
      throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
    }

    const perplexityData = await perplexityResponse.json();
    const researchContent = perplexityData.choices[0].message.content;

    console.log('Research content received:', researchContent.substring(0, 200));

    // Use Lovable AI to structure the research data
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const structureResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a data structuring AI. Parse market research into JSON.',
          },
          {
            role: 'user',
            content: `Parse this market research into structured JSON:

${researchContent}

Return ONLY valid JSON with this structure:
{
  "averageUnitCost": number,
  "materialCostPerUnit": number,
  "leadTimeDays": number,
  "markupPercentage": number,
  "comparableProducts": [
    {"name": "string", "price": number, "source": "string"}
  ],
  "sources": ["url1", "url2"],
  "confidenceScore": number (0-100)
}`,
          },
        ],
      }),
    });

    const structuredData = await structureResponse.json();
    let researchData;

    try {
      const content = structuredData.choices[0].message.content;
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      researchData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse structured data:', parseError);
      // Fallback to basic structure
      researchData = {
        averageUnitCost: 8.5,
        materialCostPerUnit: 3.2,
        leadTimeDays: 30,
        markupPercentage: 20,
        comparableProducts: [],
        sources: [],
        confidenceScore: 50,
      };
    }

    console.log('Structured research data:', researchData);

    // Cache the research for 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data: cacheEntry, error: cacheError } = await supabase
      .from('market_research_cache')
      .insert({
        product_category: productType.toLowerCase(),
        quantity_range: quantityRange,
        research_data: researchData,
        sources: researchData.sources || [],
        confidence_score: researchData.confidenceScore || 70,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (cacheError) {
      console.error('Failed to cache research:', cacheError);
    }

    // Update rate limit counter
    await supabase.from('ai_quote_rate_limits').upsert({
      identifier: ip,
      identifier_type: 'ip',
      request_count: (rateLimitData?.request_count || 0) + 1,
      window_start: rateLimitData?.window_start || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Log usage
    await supabase.from('ai_usage_logs').insert({
      function_name: 'ai-market-research',
      estimated_cost: 0.05, // Approximate cost per research
      request_data: { productType, quantity },
    });

    return new Response(
      JSON.stringify({
        success: true,
        cached: false,
        research: researchData,
        sources: researchData.sources || [],
        confidence_score: researchData.confidenceScore || 70,
        cache_id: cacheEntry?.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Market research error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
