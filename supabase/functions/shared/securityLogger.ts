// Shared utility for logging security events from edge functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface SecurityEventParams {
  event_type: 'captcha_failure' | 'rate_limit_violation' | 'suspicious_pattern' | 'cost_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  details?: any;
  user_id?: string;
  session_id?: string;
}

export async function logSecurityEvent(
  params: SecurityEventParams,
  req: Request
): Promise<void> {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const ip_address = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    await supabase.from('security_events').insert({
      ...params,
      ip_address,
      user_agent,
    });

    console.log(`Security event logged: ${params.event_type} - ${params.severity} from ${params.source}`);
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

export interface CostTrackingParams {
  function_name: string;
  model: string;
  request_tokens: number;
  response_tokens: number;
  session_id?: string;
  user_id?: string;
}

// Cost estimates per 1M tokens (in USD)
const COST_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
  'google/gemini-2.5-flash': { input: 0.075, output: 0.30 },
  'google/gemini-2.5-pro': { input: 1.25, output: 5.00 },
  'perplexity/sonar-small': { input: 0.20, output: 0.20 },
  'perplexity/sonar-large': { input: 1.00, output: 1.00 },
};

export async function logAICost(params: CostTrackingParams): Promise<number> {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate estimated cost
    const costConfig = COST_PER_MILLION_TOKENS[params.model];
    let estimated_cost = 0;
    
    if (costConfig) {
      const inputCost = (params.request_tokens / 1_000_000) * costConfig.input;
      const outputCost = (params.response_tokens / 1_000_000) * costConfig.output;
      estimated_cost = inputCost + outputCost;
    }

    // Insert cost tracking record
    await supabase.from('ai_cost_tracking').insert({
      ...params,
      estimated_cost,
    });

    console.log(`AI cost logged: ${params.function_name} - ${params.model} - $${estimated_cost.toFixed(6)}`);

    return estimated_cost;
  } catch (error) {
    console.error('Error logging AI cost:', error);
    return 0;
  }
}
