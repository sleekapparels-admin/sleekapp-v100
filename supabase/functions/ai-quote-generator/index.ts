import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema - email is now REQUIRED
const quoteRequestSchema = z.object({
  productType: z.string().trim().min(1).max(100),
  quantity: z.number().int().min(50).max(100000),
  complexityLevel: z.enum(['simple', 'medium', 'complex']).optional(),
  fabricType: z.string().max(100).optional(),
  additionalRequirements: z.string().max(2000).optional(),
  customerEmail: z.string().email("Valid email is required").max(255),
  customerName: z.string().trim().max(100).optional(),
  targetDate: z.string().optional(),
  sessionId: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    type: z.string(),
    data: z.string()
  })).optional(),
});

interface QuoteRequest {
  productType: string;
  quantity: number;
  complexityLevel?: string;
  fabricType?: string;
  additionalRequirements?: string;
  customerEmail?: string;
  customerName?: string;
  targetDate?: string;
}

// Session-based rate limiting with tiered limits
async function checkAndUpdateRateLimit(
  supabaseClient: any,
  identifier: string,
  identifierType: 'session' | 'user' | 'ip',
  dailyLimit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setHours(0, 0, 0, 0); // Start of day
  
  // Check existing rate limit record
  const { data: existing, error: fetchError } = await supabaseClient
    .from('ai_quote_rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .gte('window_start', windowStart.toISOString())
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
    console.error('Rate limit check error:', fetchError);
    return { allowed: true, remaining: dailyLimit }; // Fail open
  }
  
  if (!existing) {
    // Create new rate limit record
    await supabaseClient
      .from('ai_quote_rate_limits')
      .insert({
        identifier,
        identifier_type: identifierType,
        request_count: 1,
        window_start: windowStart.toISOString()
      });
    return { allowed: true, remaining: dailyLimit - 1 };
  }
  
  // Check if limit exceeded
  if (existing.request_count >= dailyLimit) {
    return { allowed: false, remaining: 0 };
  }
  
  // Increment count
  await supabaseClient
    .from('ai_quote_rate_limits')
    .update({ 
      request_count: existing.request_count + 1,
      updated_at: now.toISOString()
    })
    .eq('id', existing.id);
  
  return { 
    allowed: true, 
    remaining: dailyLimit - existing.request_count - 1 
  };
}

// Log AI usage for cost tracking
async function logAIUsage(
  supabaseClient: any,
  sessionId: string,
  userId: string | null,
  estimatedCost: number,
  requestData: any
): Promise<void> {
  try {
    await supabaseClient
      .from('ai_usage_logs')
      .insert({
        session_id: sessionId,
        user_id: userId,
        function_name: 'ai-quote-generator',
        estimated_cost: estimatedCost,
        request_data: {
          product_type: requestData.productType,
          quantity: requestData.quantity,
          timestamp: new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

// Sanitize user input for AI prompts
function sanitizeForPrompt(input: string): string {
  return input
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\w\s.,!?-]/g, '')
    .slice(0, 500);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Generate unique request ID for logging
  const requestId = crypto.randomUUID();

  // Validate request origin for security
  const isDevelopment = Deno.env.get('DENO_ENV') === 'development';
  const allowedOrigins = [
    'https://sleekapparels.com',
    'https://www.sleekapparels.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  // Only enforce origin validation in production for POST requests
  if (!isDevelopment && req.method === 'POST' && origin) {
    const isAllowedOrigin = allowedOrigins.some(allowed => origin.startsWith(allowed));
    const isAllowedReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
    
    if (!isAllowedOrigin && !isAllowedReferer) {
      console.warn(`Blocked request from unauthorized origin: ${origin || referer}`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // Health check endpoint
  if (req.method === 'GET') {
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      // Simple database check
      const { error } = await supabaseClient.from('quote_configurations').select('id').limit(1);
      if (error) throw error;
      return new Response(JSON.stringify({ status: 'healthy', requestId }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error(`[${requestId}] Health check failed:`, error);
      return new Response(JSON.stringify({ status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error', requestId }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  try {
    // Environment variable validation
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'LOVABLE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !Deno.env.get(varName));
    if (missingVars.length > 0) {
      // Log error code only for debugging
      console.error(`[${requestId}] Configuration error: ENV_CONFIG_001`);
      // Generic client-facing error
      return new Response(
        JSON.stringify({
          error: 'Service temporarily unavailable',
          code: 'ENV_001',
          message: 'Please try again later or contact support.',
          supportContact: 'support@sleekapparels.com',
          requestId
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Validate input - email is required
    const validated = quoteRequestSchema.parse(body);
    const requestData: QuoteRequest = validated as QuoteRequest;
    const sessionId = validated.sessionId || crypto.randomUUID();
    
    console.log(`[${requestId}] Request received with sanitized payload:`, {
      productType: requestData.productType,
      quantity: requestData.quantity,
      complexityLevel: requestData.complexityLevel,
      customerEmail: requestData.customerEmail,
      sessionId: sessionId
    });

    // Check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let isAuthenticated = false;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseClient.auth.getUser(token);
        userId = user?.id || null;
        isAuthenticated = !!userId;
      } catch (error) {
        console.log(`[${requestId}] Auth check failed, treating as anonymous`);
      }
    }
    
    // IP-based rate limiting (applies to all requests)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Check IP rate limit first (15 quotes per IP per day)
    const ipRateLimit = await checkAndUpdateRateLimit(
      supabaseClient,
      ip,
      'ip',
      15
    );
    
    if (!ipRateLimit.allowed) {
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0);
      console.warn(`[${requestId}] Rate limit exceeded: IP`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          code: 'RATE_001',
          retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000),
          requestId
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString()
          } 
        }
      );
    }
    
    // Tiered rate limiting
    let dailyLimit: number;
    let identifier: string;
    let identifierType: 'session' | 'user' | 'ip';
    
    if (isAuthenticated && userId) {
      // Authenticated users: 20 quotes per day
      dailyLimit = 20;
      identifier = userId;
      identifierType = 'user';
    } else {
      // Anonymous users: 3 quotes per day per session
      dailyLimit = 3;
      identifier = sessionId;
      identifierType = 'session';
    }
    
    const rateLimitResult = await checkAndUpdateRateLimit(
      supabaseClient,
      identifier,
      identifierType,
      dailyLimit
    );
    
    if (!rateLimitResult.allowed) {
      const resetTime = new Date();
      resetTime.setHours(24, 0, 0, 0); // Next midnight
      console.warn(`[${requestId}] Rate limit exceeded for ${identifierType}: ${identifier}`);
      return new Response(
        JSON.stringify({ 
          error: isAuthenticated 
            ? `Daily quote limit reached (${dailyLimit}/day). Limit resets at midnight UTC. Sign up for higher limits or contact support@blueprintbuddy.com.`
            : `Daily quote limit reached (${dailyLimit}/day). Limit resets at midnight UTC. Sign up for more quotes or contact support@blueprintbuddy.com.`,
          limit: dailyLimit,
          remaining: 0,
          resetTime: resetTime.toISOString(),
          requestId
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': dailyLimit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString()
          } 
        }
      );
    }
    
    console.log(`[${requestId}] Quote request received for ${requestData.customerEmail} (${identifierType}, ${rateLimitResult.remaining} remaining)`);

    // Fetch active configuration for product type with robust normalization
    const normalizeCategory = (pt: string) => {
      const normalized = pt.toLowerCase().replace(/[\s-]+/g, '_').replace(/&/g, 'and');
      const map: Record<string, string> = {
        'polo_shirts': 'polo_shirt',
        't_shirts': 't_shirt',
        'hoodies': 'hoodie',
        'hoodies_&_sweatshirts': 'hoodie',
        'hoodies_and_sweatshirts': 'hoodie',
        'sports_team_uniforms': 'uniform',
        'corporate_uniforms': 'uniform',
        'school_uniforms': 'uniform',
        'tank_tops': 'tank_top',
        'jackets_&_outerwear': 'jackets',
        'athletic_&_performance_wear': 'athletic_wear'
      };
      return map[normalized] || normalized;
    };

    const tryFetchConfig = async (cat: string) => {
      return await supabaseClient
        .from('quote_configurations')
        .select('*')
        .eq('product_category', cat)
        .eq('is_active', true)
        .maybeSingle();
    };

    const productCategoryRaw = requestData.productType || '';
    const productCategory = normalizeCategory(productCategoryRaw);
    
    console.log(`[${requestId}] Searching for configuration: raw="${productCategoryRaw}", normalized="${productCategory}"`);

    let { data: config, error: configError } = await tryFetchConfig(productCategory);

    // Fallback: try singular form if ends with 's'
    if ((!config || configError) && productCategory.endsWith('s')) {
      const singular = productCategory.replace(/s$/, '');
      ({ data: config, error: configError } = await tryFetchConfig(singular));
      console.log(`[${requestId}] Tried singular fallback "${singular}": ${config ? 'found' : 'not found'}`);
    }

    // Final fallback to a generic category
    if (!config || configError) {
      const fallbackKeys = ['knitwear', 't_shirt', 'polo_shirt', 'uniform'];
      for (const key of fallbackKeys) {
        const { data: cfg } = await tryFetchConfig(key);
        if (cfg) {
          config = cfg;
          console.log(`[${requestId}] Used fallback configuration: "${key}"`);
          break;
        }
      }
    }

    if (!config) {
      // Detailed server-side logging for debugging
      const { data: allConfigs } = await supabaseClient
        .from('quote_configurations')
        .select('product_category')
        .eq('is_active', true);
      
      const availableCategories = allConfigs?.map(c => c.product_category) || [];
      const closestMatch = availableCategories.find(cat => 
        cat.includes(productCategory) || productCategory.includes(cat)
      );
      
      console.error(`[${requestId}] Configuration error: CONF_001`);
      
      // Generic client-facing error - no schema exposure
      return new Response(
        JSON.stringify({ 
          error: 'Product configuration unavailable',
          code: 'CONF_001',
          message: 'Please contact support for assistance.',
          supportContact: 'support@sleekapparels.com',
          requestId
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Configuration found: ${config.product_category}`);

    // Calculate base pricing
    const complexity = requestData.complexityLevel || 'medium';
    const complexityMultipliers = config.complexity_multiplier as Record<string, number>;
    const complexityFactor = complexityMultipliers[complexity] || 1.3;
    
    const baseUnitPrice = config.base_price_per_unit * complexityFactor;
    
    // Volume discount (higher quantity = lower per-unit cost)
    let volumeDiscount = 1.0;
    if (requestData.quantity >= 200) volumeDiscount = 0.90;
    else if (requestData.quantity >= 100) volumeDiscount = 0.95;
    
    const unitPrice = baseUnitPrice * volumeDiscount;
    const totalPrice = unitPrice * requestData.quantity;

    // Calculate timeline
    const samplingDays = config.sampling_days;
    const productionDays = Math.ceil(
      (requestData.quantity / 100) * config.production_days_per_100_units
    );
    const bufferDays = Math.ceil(productionDays * 0.1); // 10% buffer
    const totalDays = samplingDays + productionDays + bufferDays;

    // Generate AI insights using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    // Sanitize inputs before using in AI prompt
    const sanitizedProduct = sanitizeForPrompt(requestData.productType);
    const sanitizedFabric = requestData.fabricType ? sanitizeForPrompt(requestData.fabricType) : 'standard';
    const sanitizedRequirements = requestData.additionalRequirements ? sanitizeForPrompt(requestData.additionalRequirements) : 'none';
    
    // Build AI messages with optional image analysis
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are an expert garment manufacturing consultant from Bangladesh with deep knowledge of 2025 industry standards and design analysis.'
      }
    ];

    // If files are provided, include them in the AI analysis
    if (validated.files && validated.files.length > 0) {
      const userContent: any[] = [{
        type: 'text',
        text: `Analyze the uploaded design files and provide a manufacturing quote assessment.

CUSTOMER REQUEST:
- Product Type: ${sanitizedProduct}
- Quantity: ${requestData.quantity} pieces
- Complexity Level: ${complexity}
- Fabric Type: ${sanitizedFabric}
- Additional Requirements: ${sanitizedRequirements}

UPLOADED FILES: ${validated.files.length} file(s) - Please analyze these reference images or tech pack documents to:
1. Identify any specific design elements, patterns, or construction details
2. Assess manufacturing complexity based on visible design features
3. Recommend suitable fabric and production techniques
4. Flag any potential production challenges

CALCULATED ESTIMATE:
- Total Cost: $${totalPrice.toFixed(2)} (${(totalPrice / requestData.quantity).toFixed(2)} per unit)
- Production Timeline: ${totalDays} days

BANGLADESH MANUFACTURING CONTEXT (2025):
- MOQ Standards: 50-100 units minimum
- Base Costs: T-shirts $3-6, Polos $4-7, Hoodies $8-15
- Lead Times: 50-200 units (2-3 weeks), 201-500 (3-4 weeks)

PROVIDE A PROFESSIONAL ASSESSMENT:
1. Design Analysis (2-3 sentences): Based on the uploaded files, describe key design elements and their impact on manufacturing.
2. Cost Optimization (2 sentences): Analyze pricing and suggest specific adjustments.
3. Production Recommendations (2-3 points): Based on the design, recommend optimal manufacturing approach.
4. Risk Factors (2 points): Identify specific risks based on design complexity.

Keep response professional, specific, and actionable.`
      }];

      // Add images to the message
      validated.files.forEach(file => {
        if (file.type.startsWith('image/')) {
          userContent.push({
            type: 'image_url',
            image_url: {
              url: file.data
            }
          });
        }
      });

      messages.push({
        role: 'user',
        content: userContent
      });
    } else {
      // Standard prompt without files
      messages.push({
        role: 'user',
        content: `You are an expert garment manufacturing consultant from Bangladesh with deep knowledge of 2025 industry standards.

CUSTOMER REQUEST:
- Product Type: ${sanitizedProduct}
- Quantity: ${requestData.quantity} pieces
- Complexity Level: ${complexity}
- Fabric Type: ${sanitizedFabric}
- Additional Requirements: ${sanitizedRequirements}

CALCULATED ESTIMATE:
- Total Cost: $${totalPrice.toFixed(2)} (${(totalPrice / requestData.quantity).toFixed(2)} per unit)
- Production Timeline: ${totalDays} days
- Breakdown:
  * Sampling: ${samplingDays} days
  * Production: ${productionDays} days
  * Buffer/QC: ${bufferDays} days

BANGLADESH MANUFACTURING CONTEXT (2025):
- MOQ Standards: 50-100 units minimum, higher volumes get better pricing
- Base Costs: T-shirts $3-6, Polos $4-7, Hoodies $8-15, Uniforms $5-10
- Customization Costs: Embroidery +$1-3, Screen Print +$0.5-2, DTG +$2-4
- Volume Discounts: 101-500 units (-10%), 501-1000 (-20%), 1001+ (-25%)
- Lead Times: 50-200 units (2-3 weeks), 201-500 (3-4 weeks), 501+ (4-6 weeks)
- Fabric Premiums: Organic cotton +25%, Poly-cotton +12%, Tech fabrics +40%

PROVIDE A PROFESSIONAL ASSESSMENT:
1. Cost Optimization (2-3 sentences): Analyze if the quantity hits optimal pricing tiers. Suggest specific adjustments.
2. Alternative Options (1 option with specifics): Provide ONE concrete alternative that could save money or time.
3. Risk Factors (2-3 key points): Identify specific risks for this order.
4. Value-Add Suggestions (1-2 points): Recommend extras that improve ROI.

Keep response professional, specific to Bangladesh manufacturing, and actionable. Use exact numbers and percentages.`
      });
    }
    
    let aiSuggestions = '';
    let alternativeOptions = null;

    try {
      // Use more powerful model when analyzing images
      const aiModel = (validated.files && validated.files.length > 0) 
        ? 'google/gemini-2.5-pro'  // Better for visual analysis + reasoning
        : 'google/gemini-2.5-flash'; // Fast for text-only quotes
      
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: aiModel,
          messages: messages,
          max_completion_tokens: 1000
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        aiSuggestions = aiData.choices[0]?.message?.content || '';
        console.log(`[${requestId}] AI suggestions generated with`, validated.files?.length || 0, 'files analyzed');
        
        // Log AI usage for cost tracking
        const estimatedCost = validated.files && validated.files.length > 0 ? 0.05 : 0.01;
        await logAIUsage(supabaseClient, sessionId, userId, estimatedCost, requestData);
      } else {
        console.error(`[${requestId}] AI API error:`, await aiResponse.text());
        aiSuggestions = 'AI analysis temporarily unavailable. Using standard manufacturing recommendations.';
      }
    } catch (aiError) {
      console.error(`[${requestId}] AI generation error:`, aiError);
      aiSuggestions = 'AI analysis temporarily unavailable. Using standard manufacturing recommendations.';
    }

    // Build quote data
    const quoteData = {
      breakdown: {
        baseUnitPrice: config.base_price_per_unit,
        complexityFactor,
        volumeDiscount,
        finalUnitPrice: unitPrice,
        totalPrice
      },
      timeline: {
        samplingDays,
        productionDays,
        bufferDays,
        totalDays,
        estimatedDeliveryDate: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      moqRange: {
        min: config.moq_min,
        max: config.moq_max,
        requested: requestData.quantity
      }
    };

    // Save quote to database (using service role, so RLS doesn't apply)
    const { data: savedQuote, error: saveError } = await supabaseClient
      .from('ai_quotes')
      .insert({
        customer_email: requestData.customerEmail,
        customer_name: requestData.customerName,
        product_type: requestData.productType,
        quantity: requestData.quantity,
        complexity_level: complexity,
        fabric_type: requestData.fabricType,
        additional_requirements: requestData.additionalRequirements,
        quote_data: quoteData,
        total_price: totalPrice,
        estimated_delivery_days: totalDays,
        ai_suggestions: aiSuggestions,
        status: 'draft',
        session_id: sessionId
      })
      .select()
      .single();

    if (saveError) {
      console.error(`[${requestId}] Error saving quote:`, saveError);
      throw saveError;
    }

    console.log(`[${requestId}] Database write success: quote ID ${savedQuote.id}`);

    // Create timeline prediction
    const stages = [
      { stage: 'Sampling & Approval', days: samplingDays, order: 1 },
      { stage: 'Yarn Procurement', days: 3, order: 2 },
      { stage: 'Knitting', days: Math.ceil(productionDays * 0.4), order: 3 },
      { stage: 'Linking & Finishing', days: Math.ceil(productionDays * 0.3), order: 4 },
      { stage: 'Quality Control', days: Math.ceil(productionDays * 0.2), order: 5 },
      { stage: 'Packing & Shipping Prep', days: Math.ceil(productionDays * 0.1), order: 6 }
    ];

    let currentDate = new Date();
    const enrichedStages = stages.map(stage => {
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate.setDate(currentDate.getDate() + stage.days));
      return {
        ...stage,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
    });

    await supabaseClient
      .from('timeline_predictions')
      .insert({
        quote_id: savedQuote.id,
        stages: enrichedStages,
        total_days: totalDays,
        estimated_completion_date: quoteData.timeline.estimatedDeliveryDate,
        confidence_score: 0.85 // Initial confidence based on industry standards
      });

    console.log(`[${requestId}] Final response being sent`);

    return new Response(
      JSON.stringify({
        success: true,
        quote: savedQuote,
        timeline: enrichedStages,
        aiInsights: aiSuggestions,
        requestId
      }),
      {
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': dailyLimit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        }
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Error in ai-quote-generator:`, error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data. Please check your form and try again.',
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
          requestId
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generic error for security
    return new Response(
      JSON.stringify({ 
      error: 'Failed to generate quote. Please try again or contact support.',
      requestId
    }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});