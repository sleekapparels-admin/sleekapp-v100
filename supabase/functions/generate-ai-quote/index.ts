import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      productType,
      quantity,
      fabricType,
      complexity,
      additionalRequirements,
      customerEmail,
      customerName,
      country,
      phoneNumber,
      captchaToken,
      sessionId
    } = await req.json();

    // SECURITY: Verify reCAPTCHA
    if (!captchaToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.error('CAPTCHA verification failed:', recaptchaResult);
      return new Response(
        JSON.stringify({ success: false, error: 'CAPTCHA verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
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
      return new Response(
        JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build comprehensive system prompt with Bangladesh manufacturing knowledge
    const systemPrompt = `You are an expert apparel manufacturing consultant specializing in Bangladesh garment production. Generate accurate, market-based quotes using the following knowledge:

**BANGLADESH MANUFACTURING COSTS (2024-2025)**:
- Average Labor Cost: $95-120/month (worker)
- Factory Overhead: 15-20% of production cost
- Standard Profit Margin: 15-25%

**PRODUCT TYPE BASE COSTS (per unit)**:
T-Shirts:
- Basic Crew Neck: $2.50-3.50
- Fashion/Custom Print: $3.50-4.50
- Performance/Technical: $4.50-6.00

Hoodies:
- Basic Pullover: $8.00-10.00
- Zip-Up: $10.00-12.00
- Heavyweight/Premium: $12.00-15.00

Polo Shirts:
- Basic Pique: $4.50-5.50
- Performance: $5.50-7.00
- Ladies Fit: $5.00-6.50

Joggers/Activewear:
- Basic Joggers: $7.00-9.00
- Athletic Leggings: $6.00-8.00
- Shorts: $4.50-6.00

Uniforms:
- School Uniform Set: $8.00-10.00
- Corporate Uniform: $10.00-12.00
- Industrial Workwear: $9.00-14.00

**FABRIC TYPE MODIFIERS**:
- Cotton (100%): +$0.50
- Polyester: -$0.30
- Cotton/Poly Blend: Base price
- Fleece: +$1.00
- French Terry: +$0.50
- Performance Fabric: +$1.50

**COMPLEXITY MULTIPLIERS**:
- Simple (basic design, 1 color): 1.0x
- Medium (2-3 colors, basic custom): 1.15x
- Complex (multi-color, intricate design): 1.3x

**QUANTITY DISCOUNT TIERS**:
- 50-99 units: Base price (0% discount)
- 100-499 units: -10% discount
- 500-999 units: -18% discount
- 1000-2499 units: -25% discount
- 2500+ units: -30% discount

**LEAD TIME CALCULATIONS**:
- 50-100 units: 14-21 days
- 100-500 units: 21-30 days
- 500-1000 units: 30-45 days
- 1000-2500 units: 45-60 days
- 2500+ units: 60-75 days

**CUSTOMIZATION ADD-ONS**:
- Screen Printing: +$0.50-1.50/unit
- Embroidery: +$1.00-3.00/unit
- Custom Labels: +$0.20-0.50/unit
- Custom Packaging: +$0.30-0.80/unit

Generate a quote with:
1. Accurate unit price calculation
2. Total price
3. Detailed price breakdown (materials, labor, overhead, margin)
4. Lead time estimate
5. 2-3 comparable market examples
6. Price justification explaining the calculation
7. AI suggestions for cost optimization
8. Confidence score (85-95% for standard products, 70-84% for custom/complex)

Be realistic and competitive while maintaining quality standards.`;

    const userPrompt = `Generate a manufacturing quote for:
- Product: ${productType}
- Quantity: ${quantity} units
- Fabric: ${fabricType || 'Standard blend'}
- Complexity: ${complexity || 'medium'}
${additionalRequirements ? `- Special Requirements: ${additionalRequirements}` : ''}

Provide a detailed quote with pricing breakdown, lead time, and market comparison.`;

    console.log('Generating quote with Lovable AI...');

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    console.log('AI Response received, parsing...');

    // Parse AI response to extract structured quote data
    const quoteData = parseAIQuote(aiContent, productType, quantity);

    // Save quote to database
    const { data: savedQuote, error: dbError } = await supabase
      .from('ai_quotes')
      .insert({
        product_type: productType,
        quantity,
        fabric_type: fabricType,
        complexity_level: complexity,
        additional_requirements: additionalRequirements,
        customer_email: customerEmail,
        customer_name: customerName,
        country,
        phone_number: phoneNumber,
        session_id: sessionId,
        total_price: quoteData.totalPrice,
        estimated_delivery_days: quoteData.estimatedDeliveryDays,
        confidence_score: quoteData.confidenceScore,
        price_justification: quoteData.priceJustification,
        ai_suggestions: quoteData.suggestions,
        quote_data: {
          unitPrice: quoteData.unitPrice,
          priceBreakdown: quoteData.priceBreakdown,
          comparableProducts: quoteData.comparableProducts,
        },
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Update rate limit
    await supabase.from('ai_quote_rate_limits').upsert({
      identifier: ip,
      identifier_type: 'ip',
      request_count: (rateLimitData?.request_count || 0) + 1,
      window_start: rateLimitData?.window_start || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Log AI usage
    await supabase.from('ai_usage_logs').insert({
      function_name: 'generate-ai-quote',
      estimated_cost: 0.02,
      request_data: { productType, quantity },
    });

    return new Response(
      JSON.stringify({
        success: true,
        quote: {
          id: savedQuote.id,
          unitPrice: quoteData.unitPrice,
          totalPrice: quoteData.totalPrice,
          estimatedDeliveryDays: quoteData.estimatedDeliveryDays,
          confidenceScore: quoteData.confidenceScore,
          priceBreakdown: quoteData.priceBreakdown,
          priceJustification: quoteData.priceJustification,
          comparableProducts: quoteData.comparableProducts,
          suggestions: quoteData.suggestions,
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
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseAIQuote(aiContent: string, productType: string, quantity: number) {
  try {
    // Extract numeric values from AI response using regex patterns
    const unitPriceMatch = aiContent.match(/unit price[:\s]*\$?(\d+\.?\d*)/i);
    const totalPriceMatch = aiContent.match(/total price[:\s]*\$?(\d+\.?\d*)/i);
    const leadTimeMatch = aiContent.match(/lead time[:\s]*(\d+)[\s-]*(\d+)?\s*days/i);
    const confidenceMatch = aiContent.match(/confidence[:\s]*(\d+)%?/i);

    // Extract price breakdown
    const materialsMatch = aiContent.match(/materials?[:\s]*\$?(\d+\.?\d*)/i);
    const laborMatch = aiContent.match(/labor[:\s]*\$?(\d+\.?\d*)/i);
    const overheadMatch = aiContent.match(/overhead[:\s]*\$?(\d+\.?\d*)/i);
    const marginMatch = aiContent.match(/margin[:\s]*\$?(\d+\.?\d*)/i);

    const unitPrice = unitPriceMatch ? parseFloat(unitPriceMatch[1]) : 5.0;
    const totalPrice = totalPriceMatch ? parseFloat(totalPriceMatch[1]) : unitPrice * quantity;
    const leadTime = leadTimeMatch ? parseInt(leadTimeMatch[1]) : calculateDefaultLeadTime(quantity);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 80;

    return {
      unitPrice,
      totalPrice,
      estimatedDeliveryDays: leadTime,
      confidenceScore: confidence,
      priceBreakdown: {
        materials: materialsMatch ? parseFloat(materialsMatch[1]) : unitPrice * 0.4,
        labor: laborMatch ? parseFloat(laborMatch[1]) : unitPrice * 0.25,
        overhead: overheadMatch ? parseFloat(overheadMatch[1]) : unitPrice * 0.15,
        margin: marginMatch ? parseFloat(marginMatch[1]) : unitPrice * 0.2,
      },
      priceJustification: extractSection(aiContent, ['justification', 'why', 'explanation']) || 
        `Based on Bangladesh manufacturing standards for ${productType} in ${quantity} unit quantities.`,
      comparableProducts: extractComparableProducts(aiContent),
      suggestions: extractSection(aiContent, ['suggestions', 'recommendations', 'tips']) || 
        'Consider ordering in larger quantities for better per-unit pricing.',
    };
  } catch (error) {
    console.error('Error parsing AI quote:', error);
    // Return fallback values
    const unitPrice = 5.0;
    return {
      unitPrice,
      totalPrice: unitPrice * quantity,
      estimatedDeliveryDays: calculateDefaultLeadTime(quantity),
      confidenceScore: 75,
      priceBreakdown: {
        materials: unitPrice * 0.4,
        labor: unitPrice * 0.25,
        overhead: unitPrice * 0.15,
        margin: unitPrice * 0.2,
      },
      priceJustification: `Based on Bangladesh manufacturing standards for ${productType} in ${quantity} unit quantities.`,
      comparableProducts: [],
      suggestions: 'Consider ordering in larger quantities for better per-unit pricing.',
    };
  }
}

function extractSection(text: string, keywords: string[]): string | null {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[:\\s]*([^\\n]+(?:\\n(?!\\n)[^\\n]+)*)`, 'i');
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return null;
}

function extractComparableProducts(text: string) {
  const products = [];
  const productRegex = /\-?\s*([^:\n]+):\s*\$?(\d+\.?\d*)[^\n]*/gi;
  let match;
  let count = 0;
  
  while ((match = productRegex.exec(text)) !== null && count < 3) {
    products.push({
      name: match[1].trim(),
      price: parseFloat(match[2]),
      supplier: 'Bangladesh Manufacturer',
    });
    count++;
  }
  
  return products;
}

function calculateDefaultLeadTime(quantity: number): number {
  if (quantity <= 100) return 18;
  if (quantity <= 500) return 25;
  if (quantity <= 1000) return 37;
  if (quantity <= 2500) return 52;
  return 67;
}
