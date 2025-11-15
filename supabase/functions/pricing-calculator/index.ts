import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PricingRequest {
  batchId: string;
  quantity: number;
  basePrice: number;
  currentStyleCount: number;
  isNewStyle: boolean;
  batchFillPercentage?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: PricingRequest = await req.json();
    console.log('Calculating pricing:', request);

    // Base pricing logic
    let factoryPrice = request.basePrice;
    
    // Apply complexity premium (5% per additional style)
    const styleCount = request.isNewStyle ? request.currentStyleCount + 1 : request.currentStyleCount;
    const complexityMultiplier = 1 + ((styleCount - 1) * 0.05);
    factoryPrice = factoryPrice * complexityMultiplier;

    // Calculate buyer price (20% markup base + urgency premium)
    let buyerMarkup = 1.20; // Base 20% markup
    
    // Apply urgency discount if batch is nearly full (incentivize completion)
    if (request.batchFillPercentage && request.batchFillPercentage >= 80) {
      buyerMarkup = 1.15; // Reduced to 15% if batch almost full
    } else if (request.batchFillPercentage && request.batchFillPercentage < 30) {
      buyerMarkup = 1.25; // Increased to 25% for new/empty batches
    }

    const buyerPrice = factoryPrice * buyerMarkup;
    
    // Calculate savings vs solo order (solo order would be ~50% more expensive)
    const soloOrderPrice = request.basePrice * 1.5;
    const savings = soloOrderPrice - buyerPrice;
    const savingsPercentage = (savings / soloOrderPrice) * 100;

    // Calculate margins
    const unitMargin = buyerPrice - factoryPrice;
    const totalMargin = unitMargin * request.quantity;

    return new Response(
      JSON.stringify({
        success: true,
        pricing: {
          factoryPrice: parseFloat(factoryPrice.toFixed(2)),
          buyerPrice: parseFloat(buyerPrice.toFixed(2)),
          soloOrderPrice: parseFloat(soloOrderPrice.toFixed(2)),
          unitMargin: parseFloat(unitMargin.toFixed(2)),
          totalMargin: parseFloat(totalMargin.toFixed(2)),
        },
        savings: {
          perUnit: parseFloat(savings.toFixed(2)),
          total: parseFloat((savings * request.quantity).toFixed(2)),
          percentage: parseFloat(savingsPercentage.toFixed(1)),
        },
        details: {
          styleCount,
          complexityMultiplier: parseFloat(complexityMultiplier.toFixed(2)),
          buyerMarkup: parseFloat(buyerMarkup.toFixed(2)),
          batchFillPercentage: request.batchFillPercentage || 0,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calculating pricing:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
