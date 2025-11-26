import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

// Email validation
const EMAIL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'trashmail.com', 'yopmail.com',
];

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  email = email.trim().toLowerCase();

  if (email.length < 5 || email.length > 254) {
    return { valid: false, error: 'Invalid email length' };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const domain = email.split('@')[1];
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}

interface ResourceEmailRequest {
  email: string;
  fullName?: string;
  companyName?: string;
  resourceType: 'buyers_guide' | 'material_chart';
  source?: string;
}

const RESOURCE_DETAILS = {
  buyers_guide: {
    title: "Custom Apparel Buyer's Guide",
    description: "Everything you need to know about manufacturing custom t-shirts, hoodies, and more. 25-page comprehensive guide.",
    filename: "custom-apparel-buyers-guide.pdf",
    subject: "Your Custom Apparel Buyer's Guide is Ready",
  },
  material_chart: {
    title: "Material Comparison Chart",
    description: "Compare cotton, poly-cotton, French terry, fleece and more. Make informed decisions about your fabrics.",
    filename: "material-comparison-chart.pdf",
    subject: "Your Material Comparison Chart is Ready",
  },
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, fullName, companyName, resourceType, source = 'homepage' }: ResourceEmailRequest = await req.json();

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ error: emailValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate resource type
    if (!['buyers_guide', 'material_chart'].includes(resourceType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid resource type' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting: max 3 downloads per email per day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('resource_downloads')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase())
      .gte('created_at', oneDayAgo);

    if (count !== null && count >= 3) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again tomorrow.' }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client info
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Store download record
    const { data: downloadRecord, error: insertError } = await supabase
      .from('resource_downloads')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName || null,
        company_name: companyName || null,
        resource_type: resourceType,
        source,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing download record:', insertError);
      throw new Error('Failed to process request');
    }

    const resource = RESOURCE_DETAILS[resourceType];
    const downloadUrl = `${supabaseUrl.replace('supabase.co', 'lovable.app')}/resources/${resource.filename}`;

    // Send email with download link
    const emailResponse = await resend.emails.send({
      from: 'Sleek Apparels <resources@sleekapparels.com>',
      to: [email],
      subject: resource.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Your Resource is Ready!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hi${fullName ? ` ${fullName}` : ''},
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Thank you for your interest in ${resource.title}! Your download is ready.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h2 style="margin: 0 0 10px 0; color: #2d5016; font-size: 20px;">📄 ${resource.title}</h2>
              <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">${resource.description}</p>
              <a href="${downloadUrl}" 
                 style="display: inline-block; background: #2d5016; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Download Now
              </a>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background: #fff5e6; border-left: 4px solid #d97706; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #d97706; font-size: 18px;">🎯 Ready to Start Manufacturing?</h3>
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                Get instant AI-powered quotes for your custom apparel with our LoopTrace™ platform.
              </p>
              <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/get-started" 
                 style="color: #d97706; font-weight: 600; text-decoration: none;">
                Get Started Free →
              </a>
            </div>
            
            <h3 style="color: #2d5016; margin: 30px 0 15px 0;">Why Choose Sleek Apparels?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li><strong>Low MOQ:</strong> Start with just 50 pieces</li>
              <li><strong>Fast Production:</strong> 15-30 day turnaround</li>
              <li><strong>AI-Powered Tracking:</strong> Real-time order visibility</li>
              <li><strong>Certified Quality:</strong> OEKO-TEX, BSCI, WRAP certified</li>
            </ul>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Questions? Reply to this email or contact us at 
              <a href="mailto:inquiry@sleekapparels.com" style="color: #2d5016;">inquiry@sleekapparels.com</a>
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">
              Sleek Apparels - Premium B2B Apparel Manufacturing<br>
              Dhaka, Bangladesh
            </p>
          </div>
        </div>
      `,
    });

    // Update record with email sent status
    await supabase
      .from('resource_downloads')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('id', downloadRecord.id);

    console.log('Resource email sent:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Resource email sent successfully',
        downloadUrl 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error('Error in send-resource-email:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
