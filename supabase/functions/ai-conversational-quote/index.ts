import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');

interface QuoteRequest {
  productType: string;
  quantity: number;
  fabricType?: string;
  complexity?: string;
  additionalRequirements?: string;
  customerEmail: string;
  customerName?: string;
  country?: string;
  phoneNumber?: string;
  sessionId?: string;
  marketResearchId?: string;
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

    const request: QuoteRequest = await req.json();
    
    // Get IP address early for rate limiting and logging
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    // SECURITY: Verify reCAPTCHA token
    if (!request.captchaToken) {
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
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${request.captchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.error('CAPTCHA verification failed:', recaptchaResult);
      
      // Log CAPTCHA failure
      await supabase.from('security_events').insert({
        event_type: 'captcha_failure',
        severity: 'medium',
        source: 'ai-conversational-quote',
        details: {
          score: recaptchaResult.score,
          email: request.customerEmail,
          error_codes: recaptchaResult['error-codes'],
        },
        session_id: request.sessionId,
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || 'unknown',
      });

      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: 5 requests per hour per IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: ipRateLimit } = await supabase
      .from('ai_quote_rate_limits')
      .select('request_count, window_start')
      .eq('identifier', ip)
      .eq('identifier_type', 'ip')
      .gte('window_start', oneHourAgo)
      .single();

    if (ipRateLimit && ipRateLimit.request_count >= 5) {
      console.log('IP rate limit exceeded:', ip);
      
      // Log rate limit violation
      await supabase.from('security_events').insert({
        event_type: 'rate_limit_violation',
        severity: 'high',
        source: 'ai-conversational-quote',
        details: { identifier_type: 'ip', identifier: ip, limit: 5 },
        session_id: request.sessionId,
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || 'unknown',
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Rate limit exceeded. Please try again in 1 hour.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Email-based rate limiting: 10 requests per day
    if (request.customerEmail) {
      const { data: emailRateLimit } = await supabase
        .from('ai_quote_rate_limits')
        .select('request_count, window_start')
        .eq('identifier', request.customerEmail)
        .eq('identifier_type', 'email')
        .gte('window_start', oneDayAgo)
        .single();

      if (emailRateLimit && emailRateLimit.request_count >= 10) {
        console.log('Email rate limit exceeded:', request.customerEmail);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Daily quote limit reached for this email address.' 
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
    console.log('Quote request:', request);

    // Get or create market research
    let marketResearch;
    let marketResearchId = request.marketResearchId;

    if (!marketResearchId) {
      // Call market research function
      const researchResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-market-research`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            productType: request.productType,
            quantity: request.quantity,
            fabricType: request.fabricType,
            complexity: request.complexity,
            additionalRequirements: request.additionalRequirements,
          }),
        }
      );

      const researchData = await researchResponse.json();
      
      if (!researchData.success) {
        throw new Error('Market research failed');
      }

      marketResearch = researchData.research;
      marketResearchId = researchData.cache_id;
    } else {
      // Fetch existing research
      const { data } = await supabase
        .from('market_research_cache')
        .select('*')
        .eq('id', marketResearchId)
        .single();
      
      if (data) {
        marketResearch = data.research_data;
      }
    }

    console.log('Market research data:', marketResearch);

    // Generate quote using Lovable AI (Gemini 2.5 Pro for quality)
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const quotePrompt = `You are an expert apparel manufacturing quote generator for a Bangladesh-based supplier network.

MARKET RESEARCH DATA:
${JSON.stringify(marketResearch, null, 2)}

CUSTOMER REQUEST:
- Product: ${request.productType}
- Quantity: ${request.quantity} units
- Fabric: ${request.fabricType || 'Standard'}
- Complexity: ${request.complexity || 'Medium'}
- Requirements: ${request.additionalRequirements || 'None'}
- Country: ${request.country || 'Not specified'}

Based on the market research, generate a comprehensive quote with:

1. UNIT PRICE: Calculate based on research data, quantity, and complexity
2. TOTAL PRICE: Unit price × quantity
3. LEAD TIME: Realistic production timeline
4. PRICE BREAKDOWN: Material costs, labor, overhead, profit margin
5. CONFIDENCE SCORE: 0-100 based on data quality
6. PRICE JUSTIFICATION: Explain pricing with sources
7. COMPARABLE PRODUCTS: List 3-5 similar products with prices

Consider:
- Bangladesh manufacturing costs are lower than Western markets
- Larger quantities get better per-unit pricing
- Complex customizations increase cost
- Standard fabrics are cheaper than premium

Return ONLY valid JSON with this structure:
{
  "unitPrice": number,
  "totalPrice": number,
  "estimatedDeliveryDays": number,
  "confidenceScore": number,
  "priceBreakdown": {
    "materials": number,
    "labor": number,
    "overhead": number,
    "margin": number
  },
  "priceJustification": "string (2-3 sentences)",
  "comparableProducts": [
    {"name": "string", "price": number, "supplier": "string"}
  ],
  "suggestions": "string (helpful tips for the buyer)"
}`;

    const quoteResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert quote generator. Return ONLY valid JSON.',
          },
          {
            role: 'user',
            content: quotePrompt,
          },
        ],
      }),
    });

    const quoteData = await quoteResponse.json();
    let quote;

    try {
      const content = quoteData.choices[0].message.content;
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      quote = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse quote:', parseError);
      throw new Error('Failed to generate quote');
    }

    console.log('Generated quote:', quote);

    // Save quote to database
    const { data: savedQuote, error: saveError } = await supabase
      .from('ai_quotes')
      .insert({
        product_type: request.productType,
        quantity: request.quantity,
        fabric_type: request.fabricType,
        complexity_level: request.complexity,
        additional_requirements: request.additionalRequirements,
        customer_email: request.customerEmail,
        customer_name: request.customerName,
        country: request.country,
        phone_number: request.phoneNumber,
        session_id: request.sessionId,
        total_price: quote.totalPrice,
        estimated_delivery_days: quote.estimatedDeliveryDays,
        quote_data: quote.priceBreakdown,
        market_research_id: marketResearchId,
        confidence_score: quote.confidenceScore,
        research_sources: marketResearch?.sources || [],
        price_justification: quote.priceJustification,
        comparable_products: quote.comparableProducts || [],
        conversation_history: [],
        status: 'active',
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save quote:', saveError);
      throw new Error('Failed to save quote');
    }

    // Update rate limit counters
    await supabase.from('ai_quote_rate_limits').upsert({
      identifier: ip,
      identifier_type: 'ip',
      request_count: (ipRateLimit?.request_count || 0) + 1,
      window_start: ipRateLimit?.window_start || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (request.customerEmail) {
      const { data: existingEmailLimit } = await supabase
        .from('ai_quote_rate_limits')
        .select('request_count, window_start')
        .eq('identifier', request.customerEmail)
        .eq('identifier_type', 'email')
        .gte('window_start', oneDayAgo)
        .single();

      await supabase.from('ai_quote_rate_limits').upsert({
        identifier: request.customerEmail,
        identifier_type: 'email',
        request_count: (existingEmailLimit?.request_count || 0) + 1,
        window_start: existingEmailLimit?.window_start || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Log usage
    await supabase.from('ai_usage_logs').insert({
      function_name: 'ai-conversational-quote',
      estimated_cost: 0.03,
      request_data: { productType: request.productType, quantity: request.quantity },
    });

    return new Response(
      JSON.stringify({
        success: true,
        quote: {
          id: savedQuote.id,
          unitPrice: quote.unitPrice,
          totalPrice: quote.totalPrice,
          estimatedDeliveryDays: quote.estimatedDeliveryDays,
          confidenceScore: quote.confidenceScore,
          priceBreakdown: quote.priceBreakdown,
          priceJustification: quote.priceJustification,
          comparableProducts: quote.comparableProducts,
          suggestions: quote.suggestions,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Quote generation error:', error);
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
