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

    const { stage_id, completion_percentage, notes, photo_url } = await req.json();

    if (!stage_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'stage_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get stage and verify access
    const { data: stage, error: stageError } = await supabase
      .from('production_stages')
      .select('*, orders(supplier_id)')
      .eq('id', stage_id)
      .single();

    if (stageError) throw stageError;

    // Verify user is the supplier for this order
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('user_id')
      .eq('id', stage.orders.supplier_id)
      .single();

    if (supplier?.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only the assigned supplier can update production stages' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update production stage
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (completion_percentage !== undefined) {
      updateData.completion_percentage = completion_percentage;
    }
    if (notes) {
      updateData.notes = notes;
    }
    if (photo_url) {
      updateData.photo_url = photo_url;
    }

    const { data: updatedStage, error: updateError } = await supabase
      .from('production_stages')
      .update(updateData)
      .eq('id', stage_id)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, data: updatedStage, message: 'Production stage updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error updating production stage:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
