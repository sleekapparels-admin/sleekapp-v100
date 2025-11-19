import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Comprehensive email validation
const EMAIL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Common disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'trashmail.com', 'yopmail.com',
  'temp-mail.org', 'fakeinbox.com', 'sharklasers.com', 'getnada.com'
];

// TypeScript interfaces for type safety
interface ResendEmailResponse {
  data?: {
    id: string;
  };
  error?: {
    message: string;
    name: string;
  };
}

type OTPType = 'phone' | 'email-quote' | 'email-supplier';

interface OTPRequest {
  type: OTPType;
  phone?: string;
  email?: string;
  country?: string;
}

// Sanitize email to prevent header injection attacks
function sanitizeEmail(email: string): string {
  return email.replace(/[\r\n]/g, '').trim().toLowerCase();
}

function validateEmail(email: string): { valid: boolean; error?: string } {
  // Check if email exists
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  // Trim whitespace
  email = email.trim().toLowerCase();

  // Check length constraints
  if (email.length < 5) {
    return { valid: false, error: 'Email address is too short' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email address is too long (max 254 characters)' };
  }

  // Check format with comprehensive regex
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format. Please provide a valid email address' };
  }

  // Extract domain
  const domain = email.split('@')[1];
  
  // Check for disposable email domains
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed. Please use a permanent email address' };
  }

  // Additional validation: check for consecutive dots
  if (email.includes('..')) {
    return { valid: false, error: 'Invalid email format (consecutive dots not allowed)' };
  }

  // Check local part (before @) length
  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return { valid: false, error: 'Email local part is too long (max 64 characters)' };
  }

  return { valid: true };
}

// Retry logic for transient email delivery failures
function isRetryableError(error: any): boolean {
  if (!error?.message) return false;
  const retryableMessages = ['rate_limit', 'timeout', 'service_unavailable', 'temporarily unavailable'];
  const message = error.message.toLowerCase();
  return retryableMessages.some(msg => message.includes(msg));
}

async function sendEmailWithRetry(
  emailData: any,
  maxRetries: number = 2
): Promise<ResendEmailResponse> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData) as ResendEmailResponse;
      
      // If no error or non-retryable error, return immediately
      if (!response.error || !isRetryableError(response.error)) {
        return response;
      }
      
      // Wait before retry with exponential backoff
      if (attempt < maxRetries) {
        console.log(`[${new Date().toISOString()}] ⏳ Retrying email send (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Email send attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Failed to send email after retries');
}

serve(async (req) => {
  if (!Deno.env.get('RESEND_API_KEY')) {
    console.error(`[${new Date().toISOString()}] ❌ RESEND_API_KEY not configured`);
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable', code: 'EMAIL_001' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, phone, email, country }: OTPRequest = await req.json();

    if (!type || !['phone', 'email-quote', 'email-supplier'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Valid type (phone, email-quote, email-supplier) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validation and processing based on type
    if (type === 'phone') {
      if (!phone) {
        return new Response(
          JSON.stringify({ error: 'Phone number is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[${new Date().toISOString()}] 📱 Phone OTP request - Phone: ${phone.substring(0, 4)}***`);

      // Rate limiting for phone
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: recentOTPs } = await supabase
        .from('phone_verification_otps')
        .select('id')
        .eq('phone', phone)
        .gt('created_at', fiveMinutesAgo)
        .limit(1);

      if (recentOTPs && recentOTPs.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Please wait 5 minutes before requesting another code',
            retryAfter: 300
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Store OTP
      const { error: insertError } = await supabase
        .from('phone_verification_otps')
        .insert({
          phone,
          otp,
          expires_at: expiresAt.toISOString(),
          verified: false
        });

      if (insertError) {
        console.error(`[${new Date().toISOString()}] ❌ Phone OTP insert error:`, insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to generate verification code' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In production, integrate with SMS service here
      console.log(`[${new Date().toISOString()}] ✅ Phone OTP generated for ${phone}: ${otp}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          expiresAt: expiresAt.toISOString(),
          message: 'Verification code sent'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email OTP processing (both quote and supplier)
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${new Date().toISOString()}] 📧 Email OTP request - Type: ${type}, Email: ${email.substring(0, 3)}***`);

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ error: emailValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize email to prevent header injection
    const sanitizedEmail = sanitizeEmail(email);

    // Check for supplier-specific validation
    if (type === 'email-supplier') {
      const { data: existingSupplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('contact_email', sanitizedEmail)
        .maybeSingle();

      if (existingSupplier) {
        return new Response(
          JSON.stringify({ error: 'A supplier with this email already exists' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rate limiting for email
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentOTPs } = await supabase
      .from('email_verification_otps')
      .select('id')
      .eq('email', sanitizedEmail)
      .gt('created_at', fiveMinutesAgo)
      .limit(1);

    if (recentOTPs && recentOTPs.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Please wait 5 minutes before requesting another code',
          retryAfter: 300
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check daily quote limit for email-quote type
    if (type === 'email-quote') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const { count: quotesUsedToday, error: countError } = await supabase
        .from('email_verification_otps')
        .select('*', { count: 'exact', head: true })
        .eq('email', sanitizedEmail)
        .gte('created_at', todayStart.toISOString())
        .eq('verified', true);

      if (countError) {
        console.error(`[${new Date().toISOString()}] ⚠️ Error checking daily limit:`, countError);
      }

      const maxQuotesPerDay = 3;
      if (quotesUsedToday !== null && quotesUsedToday >= maxQuotesPerDay) {
        return new Response(
          JSON.stringify({ 
            error: `Daily quote limit reached. You can request ${maxQuotesPerDay} quotes per day.`,
            code: 'DAILY_LIMIT_REACHED'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP with delivery tracking
    const { data: insertedOTP, error: insertError } = await supabase
      .from('email_verification_otps')
      .insert({
        email: sanitizedEmail,
        otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempt_count: 0,
        delivery_status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error(`[${new Date().toISOString()}] ❌ Email OTP insert error:`, insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email with retry logic
    const emailSubject = type === 'email-supplier' 
      ? 'Verify Your Supplier Registration'
      : `${otp} is your Sleek Apparels verification code`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Sleek Apparels</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
            <p style="font-size: 16px; color: #666;">Enter this code to ${type === 'email-quote' ? 'verify your email and get your quote' : 'complete your registration'}:</p>
            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</div>
            </div>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #999;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Sleek Apparels. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const emailResponse = await sendEmailWithRetry({
        from: 'Sleek Apparels <noreply@notifications.sleekapparels.com>',
        to: [sanitizedEmail],
        subject: emailSubject,
        html: emailHtml,
      });

      // Check for Resend API errors
      if (emailResponse.error) {
        console.error(`[${new Date().toISOString()}] ❌ Resend API error:`, emailResponse.error);
        
        // Update OTP record with failure
        await supabase
          .from('email_verification_otps')
          .update({
            delivery_status: 'failed',
            delivery_error: emailResponse.error.message
          })
          .eq('email', sanitizedEmail)
          .eq('otp', otp);
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send verification email. Please try again.',
            code: 'EMAIL_DELIVERY_FAILED'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update OTP record with successful delivery
      await supabase
        .from('email_verification_otps')
        .update({
          resend_email_id: emailResponse.data?.id,
          email_sent_at: new Date().toISOString(),
          delivery_status: 'sent'
        })
        .eq('email', sanitizedEmail)
        .eq('otp', otp);

      console.log(`[${new Date().toISOString()}] ✅ Email sent successfully - Resend ID: ${emailResponse.data?.id}, To: ${sanitizedEmail.substring(0, 3)}***`);

      return new Response(
        JSON.stringify({ 
          success: true,
          expiresAt: expiresAt.toISOString(),
          message: 'Verification code sent to your email'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (emailError: any) {
      console.error(`[${new Date().toISOString()}] ❌ Email sending error:`, emailError);
      
      // Update OTP record with failure
      await supabase
        .from('email_verification_otps')
        .update({
          delivery_status: 'failed',
          delivery_error: emailError.message || 'Unknown error'
        })
        .eq('email', sanitizedEmail)
        .eq('otp', otp);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send verification email. Please try again.',
          code: 'EMAIL_DELIVERY_FAILED'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] ❌ Error in send-otp function:`, error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
