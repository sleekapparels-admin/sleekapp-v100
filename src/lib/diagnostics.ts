import { supabase } from "@/integrations/supabase/client";
import { generateAIQuote, AIQuoteRequest } from "./api/aiQuote";

export interface DiagnosticResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  fix?: string;
}

/**
 * Test basic Supabase connectivity by querying a simple table.
 */
export const testSupabaseConnection = async (): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.from('ai_quotes').select('id').limit(1);
    if (error) throw error;
    return {
      status: 'success',
      message: 'Supabase connection successful',
      details: { hasData: data && data.length > 0 }
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Supabase connection failed',
      details: error,
      fix: 'Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local'
    };
  }
};

/**
 * Test if an edge function is deployed and accessible by calling it with a test payload.
 */
export const testEdgeFunction = async (functionName: string): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { test: true }
    });
    if (error) throw error;
    return {
      status: 'success',
      message: `${functionName} is deployed and accessible`,
      details: data
    };
  } catch (error: any) {
    if (error.message && error.message.includes('404')) {
      return {
        status: 'error',
        message: `${functionName} not deployed`,
        details: error,
        fix: 'Deploy the edge function to Lovable Cloud. See EDGE_FUNCTION_DEPLOYMENT_GUIDE.md'
      };
    } else {
      return {
        status: 'error',
        message: `${functionName} error`,
        details: error,
        fix: 'Check function logs in Lovable dashboard'
      };
    }
  }
};

/**
 * Query quote_configurations table and return list of configured product types.
 */
export const checkQuoteConfigurations = async (): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.from('quote_configurations').select('product_category');
    if (error) throw error;
    const configured = data ? data.map(d => d.product_category) : [];
    const expected = ['knitwear', 'cut_and_sew', 'uniforms', 'polo_shirt', 't_shirt', 'hoodie'];
    const missing = expected.filter(e => !configured.includes(e));
    if (missing.length === 0) {
      return {
        status: 'success',
        message: 'All quote configurations present',
        details: { configured }
      };
    } else {
      return {
        status: 'warning',
        message: `Missing configurations for: ${missing.join(', ')}`,
        details: { configured, missing },
        fix: 'Run database seed script from DATABASE_SEED_GUIDE.md'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Failed to check quote configurations',
      details: error,
      fix: 'Ensure quote_configurations table exists and RLS policies allow access'
    };
  }
};

/**
 * Verify all required frontend environment variables are set.
 */
export const checkEnvironmentVariables = async (): Promise<DiagnosticResult> => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  if (missing.length === 0) {
    return {
      status: 'success',
      message: 'All required environment variables set',
      details: { set: required }
    };
  } else {
    return {
      status: 'error',
      message: `Missing environment variables: ${missing.join(', ')}`,
      details: { missing },
      fix: 'Add missing variables to .env.local'
    };
  }
};

/**
 * Simulate OTP flow with a test email to verify send-quote-otp and verify-quote-otp functions.
 */
export const testOTPFlow = async (): Promise<DiagnosticResult> => {
  try {
    const testEmail = 'test@example.com';
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { type: 'email-quote', email: testEmail }
    });
    if (error) throw error;
    return {
      status: 'success',
      message: 'OTP send function working',
      details: { email: testEmail, response: data },
      fix: 'Note: Verification test requires manual OTP from email'
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: 'OTP flow failed',
      details: error,
      fix: 'Check RESEND_API_KEY in edge function environment'
    };
  }
};

/**
 * Compile all diagnostic results into a formatted report (markdown).
 */
export const generateDiagnosticReport = async (): Promise<DiagnosticResult> => {
  const results = await Promise.all([
    testSupabaseConnection(),
    testEdgeFunction('send-otp'),
    testEdgeFunction('verify-otp'),
    testEdgeFunction('ai-quote-generator'),
    checkQuoteConfigurations(),
    checkEnvironmentVariables(),
    testOTPFlow(),
    checkDatabaseTables(),
    testAIQuoteGeneration()
  ]);
  const report = results.map(r => `- ${r.status.toUpperCase()}: ${r.message}${r.fix ? ` (Fix: ${r.fix})` : ''}`).join('\n');
  return {
    status: results.every(r => r.status === 'success') ? 'success' : results.some(r => r.status === 'error') ? 'error' : 'warning',
    message: 'Diagnostic report generated',
    details: { report, results },
    fix: 'See individual results for specific fixes'
  };
};

/**
 * Verify all required tables exist in the database.
 */
export const checkDatabaseTables = async (): Promise<DiagnosticResult> => {
  const tables = ['ai_quotes', 'quote_configurations', 'timeline_predictions', 'quote_otps'];
  const missing: string[] = [];
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table as any).select('*').limit(1);
      if (error && error.message && error.message.includes('does not exist')) {
        missing.push(table);
      }
    } catch (error: any) {
      if (error?.message && error.message.includes('does not exist')) {
        missing.push(table);
      }
    }
  }
  if (missing.length === 0) {
    return {
      status: 'success',
      message: 'All required tables exist',
      details: { tables }
    };
  } else {
    return {
      status: 'error',
      message: `Missing tables: ${missing.join(', ')}`,
      details: { missing },
      fix: 'Run database migrations'
    };
  }
};

/**
 * Test the complete quote generation flow with sample data.
 */
export const testAIQuoteGeneration = async (): Promise<DiagnosticResult> => {
  const testRequest: AIQuoteRequest = {
    productType: 't_shirt',
    quantity: 100,
    customerEmail: 'test@example.com'
  };
  try {
    const result = await generateAIQuote(testRequest);
    return {
      status: 'success',
      message: 'AI quote generation working',
      details: result
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'AI quote generation failed',
      details: error,
      fix: 'Check ai-quote-generator function deployment and LOVABLE_API_KEY'
    };
  }
};

/**
 * Run all diagnostics and return results as a keyed object.
 */
export const runAllDiagnostics = async (): Promise<Record<string, DiagnosticResult>> => {
  const [
    supabaseConn,
    sendOtpFunc,
    verifyOtpFunc,
    aiQuoteFunc,
    quoteConfigs,
    envVars,
    otpFlow,
    dbTables,
    aiQuote
  ] = await Promise.all([
    testSupabaseConnection(),
    testEdgeFunction('send-otp'),
    testEdgeFunction('verify-otp'),
    testEdgeFunction('ai-quote-generator'),
    checkQuoteConfigurations(),
    checkEnvironmentVariables(),
    testOTPFlow(),
    checkDatabaseTables(),
    testAIQuoteGeneration()
  ]);

  return {
    'Supabase Connection': supabaseConn,
    'Send OTP Function': sendOtpFunc,
    'Verify OTP Function': verifyOtpFunc,
    'AI Quote Function': aiQuoteFunc,
    'Quote Configurations': quoteConfigs,
    'Environment Variables': envVars,
    'OTP Flow': otpFlow,
    'Database Tables': dbTables,
    'AI Quote Generation': aiQuote
  };
};