import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackingRequest {
  productId: string;
  interactionType: 'hover' | 'quick_view_click' | 'wishlist_click' | 'color_swatch_click' | 'design_click' | 'quote_click' | 'add_to_cart' | 'view_details';
  sessionId: string;
  additionalData?: Record<string, any>;
}

// Valid interaction types
const VALID_INTERACTION_TYPES = [
  'hover',
  'quick_view_click',
  'wishlist_click',
  'color_swatch_click',
  'design_click',
  'quote_click',
  'add_to_cart',
  'view_details'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request metadata
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || null;

    // Parse request body
    const { productId, interactionType, sessionId, additionalData }: TrackingRequest = await req.json();

    // Validate inputs
    if (!productId || !interactionType || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productId, interactionType, sessionId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate interaction type
    if (!VALID_INTERACTION_TYPES.includes(interactionType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid interaction type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate UUID format for productId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid product ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user ID if available
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (error) {
        console.log('No authenticated user, tracking as anonymous');
      }
    }

    // For hover events, check if already tracked in this session
    if (interactionType === 'hover') {
      const { data: existingHover } = await supabase
        .from('product_interactions')
        .select('id')
        .eq('product_id', productId)
        .eq('session_id', sessionId)
        .eq('interaction_type', 'hover')
        .limit(1)
        .single();

      // Already tracked hover for this product in this session
      if (existingHover) {
        return new Response(null, { status: 204, headers: corsHeaders });
      }
    }

    // Insert interaction record asynchronously
    const insertPromise = supabase
      .from('product_interactions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        product_id: productId,
        interaction_type: interactionType,
        additional_data: additionalData || {},
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      });

    // Don't wait for insert to complete - fire and forget for speed
    insertPromise.then(({ error }) => {
      if (error) {
        console.error('Failed to insert product interaction:', error);
      } else {
        console.log(`Tracked ${interactionType} for product ${productId}`);
      }
    });

    // Return immediately for better performance
    return new Response(null, { status: 204, headers: corsHeaders });

  } catch (error) {
    console.error('Unexpected error:', error);
    // Still return 204 to not block user experience
    return new Response(null, { status: 204, headers: corsHeaders });
  }
});
