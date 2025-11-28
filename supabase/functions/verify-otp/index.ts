import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createLogger, sanitizeEmail as maskEmail, sanitizePhone as maskPhone } from '../_shared/logger.ts';

const logger = createLogger('verify-otp');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type OTPType = 'phone' | 'email-quote' | 'email-supplier';

interface VerifyRequest {
  type: OTPType;
  phone?: string;
  email?: string;
  otp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, phone, email, otp }: VerifyRequest = await req.json();

    if (!type || !['phone', 'email-quote', 'email-supplier'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Valid type (phone, email-quote, email-supplier) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({ error: 'Valid 6-digit code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = type === 'phone' 
      ? Deno.env.get('SUPABASE_ANON_KEY')!
      : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, 
      type === 'phone' ? {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      } : {}
    );

    // Determine identifier and type for rate limiting
    const identifier = type === 'phone' ? phone : email;
    const identifierType = type === 'phone' ? 'phone' : 'email';
    
    if (!identifier) {
      return new Response(
        JSON.stringify({ error: 'Identifier (phone or email) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit (3 attempts per hour)
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_otp_rate_limit', {
        p_identifier: identifier,
        p_identifier_type: identifierType
      });

    if (rateLimitError) {
      logger.error('Rate limit check error', rateLimitError);
    } else if (rateLimitData && !rateLimitData.allowed) {
      const sanitizedId = identifierType === 'phone' ? maskPhone(identifier) : maskEmail(identifier);
      logger.warn('Rate limit exceeded', { identifierType, identifier: sanitizedId });
      return new Response(
        JSON.stringify({ 
          error: 'Too many verification attempts. Please try again in 1 hour.',
          verified: false,
          rateLimitExceeded: true,
          attemptsRemaining: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Phone OTP verification
    if (type === 'phone') {
      if (!phone) {
        return new Response(
          JSON.stringify({ error: 'Phone number is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: otpRecord, error: fetchError } = await supabase
        .from('phone_verification_otps')
        .select('*')
        .eq('phone', phone)
        .eq('otp', otp)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpRecord) {
        // Log failed attempt
        await supabase.rpc('log_otp_attempt', {
          p_identifier: phone,
          p_identifier_type: 'phone',
          p_success: false,
          p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        });

        return new Response(
          JSON.stringify({ error: 'Invalid or expired verification code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark as verified
      const { error: updateError } = await supabase
        .from('phone_verification_otps')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      if (updateError) {
        logger.error('Phone OTP update error', updateError, { phone: maskPhone(phone) });
        
        // Log failed attempt
        await supabase.rpc('log_otp_attempt', {
          p_identifier: phone,
          p_identifier_type: 'phone',
          p_success: false,
          p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        });

        return new Response(
          JSON.stringify({ error: 'Failed to verify code' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log successful attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: phone,
        p_identifier_type: 'phone',
        p_success: true,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      // Update user profile if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            phone: phone,
            phone_verified: true,
            phone_verified_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          verified: true,
          phoneVerified: true,
          message: 'Phone verified successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email OTP verification (both quote and supplier)
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch OTP record
    const now = new Date();
    const { data: otpRecords, error: fetchError } = await supabase
      .from('email_verification_otps')
      .select('*')
      .eq('email', email)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      // Log failed attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: false,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      return new Response(
        JSON.stringify({ 
          error: 'No pending verification code found. Please request a new one.',
          verified: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const otpRecord = otpRecords[0];

    // Check expiration
    if (new Date(otpRecord.expires_at) < now) {
      // Log failed attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: false,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      return new Response(
        JSON.stringify({ 
          error: 'Verification code has expired. Please request a new one.',
          verified: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check max attempts per OTP record (5 attempts)
    if (otpRecord.attempt_count >= 5) {
      // Log failed attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: false,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      return new Response(
        JSON.stringify({ 
          error: 'Maximum verification attempts reached. Please request a new code.',
          verified: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment attempt count
    await supabase
      .from('email_verification_otps')
      .update({ attempt_count: otpRecord.attempt_count + 1 })
      .eq('id', otpRecord.id);

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Log failed attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: false,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      return new Response(
        JSON.stringify({ 
          error: 'Invalid verification code. Please try again.',
          verified: false,
          attemptsRemaining: 5 - (otpRecord.attempt_count + 1)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('email_verification_otps')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      logger.error('Email OTP update error', updateError, { email: maskEmail(email) });
      
      // Log failed attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: false,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });
    } else {
      // Log successful attempt
      await supabase.rpc('log_otp_attempt', {
        p_identifier: email,
        p_identifier_type: 'email',
        p_success: true,
        p_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });
    }

    // Type-specific response
    let additionalData = {};
    
    if (type === 'email-quote') {
      // Check daily quote limit
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const { count: quotesUsedToday } = await supabase
        .from('email_verification_otps')
        .select('*', { count: 'exact', head: true })
        .eq('email', email)
        .gte('created_at', todayStart.toISOString())
        .eq('verified', true);

      const maxQuotesPerDay = 3;
      additionalData = {
        quotesUsedToday: quotesUsedToday || 0,
        quotesRemaining: Math.max(0, maxQuotesPerDay - (quotesUsedToday || 0))
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        verified: true,
        message: 'Email verified successfully',
        ...additionalData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    logger.error('Error in verify-otp function', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
