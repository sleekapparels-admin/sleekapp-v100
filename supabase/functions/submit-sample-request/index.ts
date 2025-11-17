import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'trashmail.com', 'yopmail.com'
];

interface SampleRequest {
  name: string;
  email: string;
}

// Validate email format and check for disposable domains
function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  
  if (!email || email.length > 255) {
    return { valid: false, error: 'Email must be between 1 and 255 characters' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }
  
  return { valid: true };
}

// Check rate limit
async function checkRateLimit(
  supabase: any,
  identifier: string,
  identifierType: string
): Promise<{ allowed: boolean; remaining: number }> {
  const timeWindow = 60 * 60 * 1000; // 1 hour in milliseconds
  const maxRequests = 3;
  const now = new Date();
  const windowStart = new Date(now.getTime() - timeWindow);

  // Get or create rate limit record
  const { data: existing, error: fetchError } = await supabase
    .from('sample_request_rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Rate limit fetch error:', fetchError);
    return { allowed: true, remaining: maxRequests }; // Fail open
  }

  if (!existing) {
    // Create new rate limit record
    await supabase
      .from('sample_request_rate_limits')
      .insert({
        identifier,
        identifier_type: identifierType,
        request_count: 1,
        window_start: now.toISOString()
      });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  // Check if limit exceeded
  if (existing.request_count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  await supabase
    .from('sample_request_rate_limits')
    .update({
      request_count: existing.request_count + 1,
      updated_at: now.toISOString()
    })
    .eq('id', existing.id);

  return { allowed: true, remaining: maxRequests - existing.request_count - 1 };
}

// Check for duplicate requests in last 30 days
async function checkDuplicate(
  supabase: any,
  email: string
): Promise<boolean> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('exit_intent_sample_requests')
    .select('id')
    .eq('email', email.toLowerCase())
    .gte('created_at', thirtyDaysAgo.toISOString())
    .limit(1);

  if (error) {
    console.error('Duplicate check error:', error);
    return false; // Fail open
  }

  return data && data.length > 0;
}

// Send confirmation email to user
async function sendUserConfirmation(name: string, email: string) {
  try {
    await resend.emails.send({
      from: 'Sleek Apparels <inquiry@sleekapparels.com>',
      to: [email],
      subject: 'Your Free Sample Pack is on the Way! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #c85a3f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Thank You, ${name}!</h1>
            </div>
            <div class="content">
              <p>Great news! We've received your request for our free sample pack.</p>
              
              <p><strong>What's in your sample pack:</strong></p>
              <ul>
                <li>✅ Premium fabric swatches (cotton, polyester, blends)</li>
                <li>✅ Print quality samples</li>
                <li>✅ Construction detail examples</li>
                <li>✅ Color range cards</li>
                <li>✅ Manufacturing capabilities guide</li>
              </ul>
              
              <p>We'll prepare your samples and reach out within 24 hours to confirm shipping details.</p>
              
              <p><strong>In the meantime:</strong></p>
              <p>Explore our product catalog or get an instant quote for your custom apparel project.</p>
              
              <div style="text-align: center;">
                <a href="https://sleekapparels.com/products" class="button">Browse Products</a>
                <a href="https://sleekapparels.com/quote" class="button" style="background: #2d5016;">Get Instant Quote</a>
              </div>
              
              <p><strong>Questions?</strong> Reply to this email or WhatsApp us at +880 1861 011 367</p>
              
              <p>Best regards,<br>
              <strong>Kh Raj Rahman</strong><br>
              Founder, Sleek Apparels<br>
              📧 inquiry@sleekapparels.com<br>
              📱 +880 1861 011 367</p>
            </div>
            <div class="footer">
              <p>Sleek Apparels - Premium Custom Apparel Manufacturing<br>
              BSCIC Industrial Estate, Tongi, Gazipur, Bangladesh</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log('User confirmation email sent to:', email);
  } catch (error) {
    console.error('Failed to send user confirmation email:', error);
    throw error;
  }
}

// Send notification email to admin
async function sendAdminNotification(name: string, email: string, ipAddress?: string) {
  try {
    await resend.emails.send({
      from: 'Sleek Apparels Notifications <inquiry@sleekapparels.com>',
      to: ['inquiry@sleekapparels.com'],
      subject: `🎯 New Sample Request: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px; }
            .header { background: #2d5016; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .info-row { padding: 10px; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; color: #2d5016; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎯 New Sample Pack Request</h2>
            </div>
            <div style="padding: 20px; background: white; border-radius: 0 0 10px 10px;">
              <div class="info-row">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">Source:</span> Exit Intent Popup
              </div>
              <div class="info-row">
                <span class="label">Time:</span> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (GMT+6)
              </div>
              ${ipAddress ? `<div class="info-row"><span class="label">IP:</span> ${ipAddress}</div>` : ''}
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #c85a3f; border-radius: 5px;">
                <strong>📝 Action Required:</strong> Prepare sample pack and contact customer within 24 hours to confirm shipping details.
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log('Admin notification email sent');
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    // Don't throw - admin notification failure shouldn't block user experience
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request metadata
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Parse request body
    const { name, email }: SampleRequest = await req.json();

    // Validate inputs
    if (!name || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (name.length > 100) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name must be less than 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, message: emailValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit by IP
    const rateLimitCheck = await checkRateLimit(supabase, ipAddress, 'ip');
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again later.'
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for duplicate request in last 30 days
    const isDuplicate = await checkDuplicate(supabase, email);
    if (isDuplicate) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'You have already requested a sample pack recently. Check your email or contact us for updates.'
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert sample request
    const { data: sampleRequest, error: insertError } = await supabase
      .from('exit_intent_sample_requests')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        source: 'exit_intent_popup',
        status: 'pending',
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to save request. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sample request saved:', sampleRequest.id);

    // Send emails (user confirmation and admin notification)
    try {
      await Promise.all([
        sendUserConfirmation(name.trim(), email.toLowerCase().trim()),
        sendAdminNotification(name.trim(), email.toLowerCase().trim(), ipAddress)
      ]);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue - request was saved successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample pack request received! Check your email for details.',
        requestId: sampleRequest.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred. Please try again or contact us directly.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
