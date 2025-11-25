import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { order_id, status, notes } = await req.json();

    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'order_id and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify order belongs to user or user is admin/supplier
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*, suppliers(user_id)')
      .eq('id', order_id)
      .single();

    if (fetchError) throw fetchError;

    // Check authorization
    const isOwner = order.buyer_id === user.id;
    const isSupplier = order.suppliers?.user_id === user.id;
    
    // Check if user is admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    const isAdmin = !!roles;

    if (!isOwner && !isSupplier && !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Not authorized to update this order' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ 
        workflow_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log status change if notes provided
    if (notes) {
      await supabase
        .from('order_status_history')
        .insert({
          order_id,
          old_status: order.workflow_status,
          new_status: status,
          changed_by: user.id,
          notes
        });
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedOrder }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
