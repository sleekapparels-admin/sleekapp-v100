import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, wishlisted: {} }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product IDs array is required', wishlisted: {} }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Bulk check for wishlisted products
    const { data: wishlistItems, error: wishlistError } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id)
      .in('product_id', productIds);

    if (wishlistError) {
      console.error('Error checking wishlist:', wishlistError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to check wishlist', wishlisted: {} }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a map of productId -> boolean
    const wishlistedMap: Record<string, boolean> = {};
    productIds.forEach(id => {
      wishlistedMap[id] = wishlistItems?.some(item => item.product_id === id) || false;
    });

    return new Response(
      JSON.stringify({ success: true, wishlisted: wishlistedMap }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', wishlisted: {} }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
