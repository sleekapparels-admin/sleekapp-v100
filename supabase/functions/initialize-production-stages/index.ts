import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { supplier_order_id, product_type } = await req.json();

    console.log("Initializing production stages for:", { supplier_order_id, product_type });

    // Map product type to category
    const categoryMap: Record<string, string> = {
      't-shirt': 'casualwear',
      't-shirts': 'casualwear',
      'polo': 'casualwear',
      'polo shirt': 'casualwear',
      'hoodie': 'casualwear',
      'hoodies': 'casualwear',
      'sweatshirt': 'casualwear',
      'joggers': 'activewear',
      'leggings': 'activewear',
      'shorts': 'activewear',
      'sweater': 'knitwear',
      'cardigan': 'knitwear',
    };

    const productCategory = categoryMap[product_type.toLowerCase()] || 'casualwear';
    console.log("Mapped to category:", productCategory);

    // Fetch stage templates
    const { data: templates, error: templatesError } = await supabaseClient
      .from('production_stage_templates')
      .select('*')
      .eq('product_category', productCategory)
      .eq('active', true)
      .order('stage_number', { ascending: true });

    if (templatesError) {
      console.error("Error fetching templates:", templatesError);
      throw templatesError;
    }

    console.log(`Found ${templates?.length || 0} stage templates`);

    if (!templates || templates.length === 0) {
      console.log("No templates found, using default casualwear stages");
      // Create default stages if none exist
      const defaultStages = [
        { stage_number: 1, stage_name: 'Fabric Preparation', description: 'Fabric received and quality checked', estimated_days: 2 },
        { stage_number: 2, stage_name: 'Cutting', description: 'Pattern cutting and preparation', estimated_days: 3 },
        { stage_number: 3, stage_name: 'Sewing', description: 'Main garment assembly', estimated_days: 5 },
        { stage_number: 4, stage_name: 'Quality Control', description: 'Inspection and defect checking', estimated_days: 2 },
        { stage_number: 5, stage_name: 'Finishing', description: 'Ironing, tagging, and packaging', estimated_days: 2 },
      ];

      const stagesToInsert = defaultStages.map(stage => ({
        supplier_order_id,
        stage_name: stage.stage_name,
        stage_number: stage.stage_number,
        description: stage.description,
        status: 'not_started',
        completion_percentage: 0,
        target_date: null,
      }));

      const { data: insertedStages, error: insertError } = await supabaseClient
        .from('production_stages')
        .insert(stagesToInsert)
        .select();

      if (insertError) {
        console.error("Error inserting default stages:", insertError);
        throw insertError;
      }

      console.log(`Created ${insertedStages?.length || 0} default stages`);

      return new Response(
        JSON.stringify({ success: true, stages: insertedStages }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create stages from templates
    const stagesToInsert = templates.map(template => ({
      supplier_order_id,
      stage_name: template.stage_name,
      stage_number: template.stage_number,
      description: template.description || '',
      status: 'not_started',
      completion_percentage: 0,
      target_date: template.estimated_days 
        ? new Date(Date.now() + template.estimated_days * 24 * 60 * 60 * 1000).toISOString()
        : null,
    }));

    const { data: insertedStages, error: insertError } = await supabaseClient
      .from('production_stages')
      .insert(stagesToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting stages:", insertError);
      throw insertError;
    }

    console.log(`Successfully created ${insertedStages?.length || 0} production stages`);

    return new Response(
      JSON.stringify({ success: true, stages: insertedStages }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in initialize-production-stages:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});