import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit (100 adds per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: rateLimitData } = await supabase
      .from('wishlist_rate_limits')
      .select('action_count')
      .eq('user_id', user.id)
      .gte('window_start', oneHourAgo)
      .single();

    if (rateLimitData && rateLimitData.action_count >= 100) {
      return new Response(
        JSON.stringify({ success: false, message: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    if (rateLimitData) {
      await supabase
        .from('wishlist_rate_limits')
        .update({ action_count: rateLimitData.action_count + 1 })
        .eq('user_id', user.id)
        .gte('window_start', oneHourAgo);
    } else {
      await supabase
        .from('wishlist_rate_limits')
        .insert({ user_id: user.id, action_count: 1, window_start: new Date().toISOString() });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, title')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add to wishlist (UNIQUE constraint handles duplicates)
    const { error: insertError } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, product_id: productId });

    if (insertError) {
      // Check if it's a duplicate error
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ success: true, message: 'Product already in wishlist' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error adding to wishlist:', insertError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to add to wishlist' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: `${product.title} added to wishlist` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
