import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema matching Contact.tsx
const quoteSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  company: z.string().trim().max(200).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  productType: z.string().trim().min(1, "Product type is required").max(100),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10000000),
  gauge: z.string().trim().max(50).optional(),
  targetDate: z.string().optional(),
  notes: z.string().trim().min(10, "Please provide more details").max(2000),
});

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetAt) {
    // Reset limit every hour
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  
  if (limit.count >= 10) {
    return false;
  }
  
  limit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    
    // Only enforce origin validation in production
    if (!isDevelopment && origin) {
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
    
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    console.log('Received quote request from:', body.email);
    
    const validated = quoteSchema.parse(body);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session ID from headers or body
    const sessionId = body.sessionId || req.headers.get('x-session-id') || crypto.randomUUID();
    
    // Get user ID if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (!authError && user) {
          userId = user.id;
        }
      } catch (e) {
        console.log('Auth token validation failed, treating as anonymous');
      }
    }

    // Insert quote request into database
    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        name: validated.name,
        email: validated.email,
        company: validated.company || null,
        whatsapp: validated.whatsapp || null,
        product_type: validated.productType,
        quantity: validated.quantity,
        gauge: validated.gauge || null,
        target_date: validated.targetDate || null,
        notes: validated.notes,
        status: 'pending',
        session_id: userId ? null : sessionId,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save quote request');
    }

    console.log('Quote request saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Quote request submitted successfully',
        id: data.id,
        sessionId: sessionId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in submit-quote function:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});