import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Job types
type JobType = 'orchestrate' | 'process-order';

interface BatchProcessorRequest {
  jobType: JobType;
  data?: OrchestrationData | OrderProcessingData;
}

// OrchestrationData intentionally empty - orchestration uses no params
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface OrchestrationData {
  // Empty - orchestration uses no params
}

interface OrderProcessingData {
  productCategory: string;
  productVariantBase: string;
  quantity: number;
  styleDetails: Record<string, unknown>;
  buyerId: string;
}

interface BatchResult {
  batchId: string;
  action: string;
  fillPercentage: number;
  message?: string;
  ordersCancelled?: number;
}

interface ProductionBatch {
  id: string;
  product_category: string;
  product_variant_base: string;
  target_quantity: number;
  current_quantity: number;
  current_style_count: number;
  max_styles: number;
  supplier_id: string;
  unit_price_base: number;
  complexity_multiplier: number;
  estimated_start_date: string;
  batch_status?: string;
  window_closes_at?: string;
  actual_start_date?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobType, data }: BatchProcessorRequest = await req.json();

    switch (jobType) {
      case 'orchestrate':
        return await handleOrchestration(req);
      case 'process-order':
        return await handleOrderProcessing(req, data as OrderProcessingData);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid job type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Error in batch-processor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function handleOrchestration(_req: Request): Promise<Response> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  console.log('Starting batch orchestration...');

  // Find batches that need attention
  const { data: batches, error: batchError } = await supabase
    .from('production_batches')
    .select('*, batch_contributions(*)')
    .eq('batch_status', 'filling')
    .lt('window_closes_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

  if (batchError) throw batchError;

  const results: BatchResult[] = [];

  for (const batch of batches || []) {
    const fillPercentage = (batch.current_quantity / batch.target_quantity) * 100;
    const windowClosed = new Date(batch.window_closes_at) < new Date();

    console.log(`Processing batch ${batch.id}: ${fillPercentage.toFixed(1)}% filled`);

    // Auto-complete batches >= 75% filled
    if (fillPercentage >= 75) {
      const { error: updateError } = await supabase
        .from('production_batches')
        .update({
          batch_status: 'confirmed',
          actual_start_date: new Date().toISOString(),
        })
        .eq('id', batch.id);

      if (!updateError) {
        // Create supplier order
        await supabase
          .from('supplier_orders')
          .insert({
            supplier_id: batch.supplier_id,
            order_number: `BATCH-${batch.id.substring(0, 8)}`,
            quantity: batch.target_quantity,
            product_type: batch.product_category,
            status: 'pending',
            supplier_price: batch.unit_price_base,
            created_by: batch.supplier_id,
          });

        results.push({
          batchId: batch.id,
          action: 'confirmed',
          fillPercentage,
        });

        console.log(`✅ Batch ${batch.id} auto-confirmed`);
      }
    }
    // Handle batches with window closed
    else if (windowClosed) {
      // 50-74% filled: Admin decides, or auto-complete with Sleek absorbing cost
      if (fillPercentage >= 50 && fillPercentage < 75) {
        console.log(`⚠️ Batch ${batch.id} at ${fillPercentage.toFixed(1)}% - needs admin review`);
        
        results.push({
          batchId: batch.id,
          action: 'needs_review',
          fillPercentage,
          message: 'Batch 50-75% filled, window closed',
        });
      }
      // < 50% filled: Cancel and refund
      else if (fillPercentage < 50) {
        const { error: updateError } = await supabase
          .from('production_batches')
          .update({ batch_status: 'cancelled' })
          .eq('id', batch.id);

        if (!updateError) {
          // Update all orders in this batch to cancelled
          const orderIds = batch.batch_contributions.map((c: { order_id: string }) => c.order_id);
          await supabase
            .from('orders')
            .update({ workflow_status: 'cancelled' })
            .in('id', orderIds);

          results.push({
            batchId: batch.id,
            action: 'cancelled',
            fillPercentage,
            ordersCancelled: orderIds.length,
          });

          console.log(`❌ Batch ${batch.id} cancelled - insufficient fill`);
        }
      }
    }
    // Batches still within window but approaching deadline
    else if (fillPercentage >= 60) {
      results.push({
        batchId: batch.id,
        action: 'nearing_target',
        fillPercentage,
        message: 'Batch nearing target - consider promotion',
      });
    }
  }

  console.log('Orchestration complete:', results);

  return new Response(
    JSON.stringify({
      success: true,
      processed: results.length,
      results,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleOrderProcessing(req: Request, orderRequest: OrderProcessingData): Promise<Response> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  console.log('Processing order:', orderRequest);

  // Step 1: Find compatible existing batch
  const { data: existingBatches, error: batchError } = await supabase
    .from('production_batches')
    .select('*, supplier_mou_terms(*)')
    .eq('product_category', orderRequest.productCategory)
    .eq('batch_status', 'filling')
    .lt('current_style_count', 4)
    .gte('target_quantity', orderRequest.quantity)
    .order('current_quantity', { ascending: false });

  if (batchError) throw batchError;

  let selectedBatch: ProductionBatch | null = null;
  let isNewBatch = false;

  // Check style compatibility with existing batches
  if (existingBatches && existingBatches.length > 0) {
    for (const batch of existingBatches as ProductionBatch[]) {
      const { data: contributions } = await supabase
        .from('batch_contributions')
        .select('style_details')
        .eq('batch_id', batch.id);

      const currentStyles = contributions?.map(c => c.style_details.variant) || [];
      const wouldExceedLimit = !currentStyles.includes(orderRequest.styleDetails.variant) &&
        currentStyles.length >= (batch.max_styles - 1);

      const hasSpace = (batch.current_quantity + orderRequest.quantity) <= batch.target_quantity;

      if (!wouldExceedLimit && hasSpace) {
        selectedBatch = batch;
        break;
      }
    }
  }

  // Step 2: Create new batch if no compatible batch found
  if (!selectedBatch) {
    // Find best supplier for this product
    const { data: suppliers } = await supabase
      .from('supplier_mou_terms')
      .select('*, suppliers(*)')
      .eq('status', 'active')
      .gte('moq_per_batch', orderRequest.quantity)
      .order('base_price', { ascending: true })
      .limit(1);

    if (!suppliers || suppliers.length === 0) {
      throw new Error('No suitable supplier found');
    }

    const supplier = suppliers[0];

    // Create new batch
    const { data: newBatch, error: createError } = await supabase
      .from('production_batches')
      .insert({
        product_category: orderRequest.productCategory,
        product_variant_base: orderRequest.productVariantBase,
        target_quantity: supplier.moq_per_batch,
        current_quantity: 0,
        current_style_count: 0,
        max_styles: supplier.max_styles_allowed,
        supplier_id: supplier.supplier_id,
        unit_price_base: supplier.base_price,
        complexity_multiplier: 1.0,
        estimated_start_date: new Date(Date.now() + (supplier.lead_time_days * 24 * 60 * 60 * 1000)),
      })
      .select()
      .single();

    if (createError) throw createError;
    selectedBatch = newBatch;
    isNewBatch = true;
  }

  // Step 3: Calculate pricing
  const { data: pricingData } = await supabase.functions.invoke('pricing-calculator', {
    body: {
      batchId: selectedBatch?.id || '',
      quantity: orderRequest.quantity,
      styleDetails: orderRequest.styleDetails,
    },
  });

  if (!pricingData?.success) {
    throw new Error('Pricing calculation failed');
  }

  // Step 4: Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: orderRequest.buyerId,
      product_type: orderRequest.productCategory,
      quantity: orderRequest.quantity,
      unit_price: pricingData.pricing.unitPrice,
      total_price: pricingData.pricing.totalPrice,
      workflow_status: 'payment_pending',
      is_batch_order: true,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Step 5: Add contribution to batch
  const { error: contributionError } = await supabase
    .from('batch_contributions')
    .insert({
      batch_id: selectedBatch?.id || '',
      order_id: order.id,
      quantity_contributed: orderRequest.quantity,
      style_details: orderRequest.styleDetails,
      unit_price: pricingData.pricing.unitPrice,
    });

  if (contributionError) throw contributionError;

  // Step 6: Update batch quantities
  if (selectedBatch) {
    const currentStyles = await supabase
      .from('batch_contributions')
      .select('style_details')
      .eq('batch_id', selectedBatch.id);

    const uniqueStyles = new Set(currentStyles.data?.map(c => c.style_details.variant) || []);

    await supabase
      .from('production_batches')
      .update({
        current_quantity: selectedBatch.current_quantity + orderRequest.quantity,
        current_style_count: uniqueStyles.size,
      })
      .eq('id', selectedBatch.id);
  }

  console.log('Order processed successfully:', {
    orderId: order.id,
    batchId: selectedBatch?.id || '',
    isNewBatch,
  });

  return new Response(
    JSON.stringify({
      success: true,
      orderId: order.id,
      batchId: selectedBatch?.id || '',
      isNewBatch,
      pricing: pricingData.pricing,
      batchFillPercentage: selectedBatch 
        ? ((selectedBatch.current_quantity + orderRequest.quantity) / selectedBatch.target_quantity) * 100
        : 0,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

serve(handler);
