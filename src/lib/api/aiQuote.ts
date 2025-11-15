/**
 * Enhanced AI Quote Generation API
 * Integrates with Bangladesh manufacturing standards
 */

import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { calculatePricing, calculateTimeline, calculateTotalPrice } from "@/lib/bangladeshManufacturing";

export interface AIQuoteRequest {
  productType: string;
  quantity: number;
  complexityLevel?: 'simple' | 'medium' | 'complex';
  fabricType?: string;
  additionalRequirements?: string;
  customerEmail: string;
  customerName?: string;
  targetDate?: string;
  files?: Array<{
    name: string;
    type: string;
    data: string;
  }>;
}

export interface AIQuoteResponse {
  success: boolean;
  quote: {
    id: string;
    total_price: number;
    estimated_delivery_days: number;
    quote_data: any;
    ai_suggestions: string;
  };
  timeline: Array<{
    stage: string;
    days: number;
    startDate: string;
    endDate: string;
  }>;
  aiInsights: string;
}

/**
 * Generate an AI-powered quote with Bangladesh manufacturing intelligence
 */
export const generateAIQuote = async (request: AIQuoteRequest): Promise<AIQuoteResponse> => {
  // Get or create session ID
  let sessionId = localStorage.getItem('quote_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('quote_session_id', sessionId);
  }

  console.log('Generating AI quote with request:', request);

  try {
    const { data, error } = await supabase.functions.invoke('ai-quote-generator', {
      body: {
        ...request,
        sessionId,
        // Provide local pricing context to help AI
        context: {
          localCalculations: getLocalPricingEstimate(request),
        }
      }
    });

    if (error) {
      console.error('AI Quote Generator error:', error);
      throw new Error(error.message || 'Failed to generate quote');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Invalid response from quote generator');
    }

    return data as AIQuoteResponse;
  } catch (error) {
    console.error('Quote generation failed:', error);
    throw error;
  }
};

/**
 * Get local pricing estimate to provide context for AI
 */
function getLocalPricingEstimate(request: AIQuoteRequest) {
  const complexity = request.complexityLevel || 'medium';
  const fabric = request.fabricType || 'cotton';
  const customizations = parseCustomizations(request.additionalRequirements || '');

  const pricingFactors = calculatePricing({
    productType: request.productType,
    quantity: request.quantity,
    fabric,
    complexity,
    customizations,
  });

  const pricing = calculateTotalPrice(pricingFactors, request.quantity);
  const timeline = calculateTimeline({
    quantity: request.quantity,
    complexity,
  });

  return {
    pricing: {
      unitPrice: pricing.unitPrice.toFixed(2),
      totalPrice: pricing.totalPrice.toFixed(2),
      savings: pricing.savings.toFixed(2),
    },
    timeline: {
      samplingDays: timeline.samplingDays,
      productionDays: timeline.productionDays,
      bufferDays: timeline.bufferDays,
      totalDays: timeline.samplingDays + timeline.productionDays + timeline.bufferDays,
    },
    factors: {
      volumeDiscount: ((1 - pricingFactors.volumeDiscount) * 100).toFixed(0) + '%',
      moqPremium: (pricingFactors.moqPremium * 100).toFixed(0) + '%',
    }
  };
}

/**
 * Parse customizations from additional requirements
 */
function parseCustomizations(requirements: string): string[] {
  const customizations: string[] = [];
  const lower = requirements.toLowerCase();

  if (lower.includes('embroid')) customizations.push('embroidery');
  if (lower.includes('print')) {
    if (lower.includes('screen')) customizations.push('screen printing');
    else if (lower.includes('dtg')) customizations.push('dtg printing');
    else customizations.push('printing');
  }
  if (lower.includes('patch')) customizations.push('patches');
  if (lower.includes('label')) customizations.push('labels');
  if (lower.includes('tag')) customizations.push('custom tags');

  return customizations;
}

/**
 * Get user's historical quotes
 */
export const getUserQuotes = async (): Promise<any[]> => {
  try {
    const sessionData = await supabase.auth.getSession();
    const session = sessionData.data.session;
    
    if (session?.user?.id) {
      // Authenticated user - get their quotes
      const { data, error } = await supabase
        .from('ai_quotes')
        .select('*')
        .eq('customer_email', session.user.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } else {
      // Anonymous user - get quotes by session ID
      const sessionId = localStorage.getItem('quote_session_id');
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('ai_quotes')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

/**
 * Convert quote to order (requires authentication)
 */
export const convertQuoteToOrder = async (quoteId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required to place order');
  }

  const { data, error } = await supabase
    .from('ai_quotes')
    .update({ status: 'converted' })
    .eq('id', quoteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
