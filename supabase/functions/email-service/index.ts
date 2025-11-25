import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

// Comprehensive email validation
const EMAIL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Common disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'maildrop.cc', 'trashmail.com', 'yopmail.com',
  'temp-mail.org', 'fakeinbox.com', 'sharklasers.com', 'getnada.com'
];

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

// Email template types
type EmailType = "quote" | "lead-followup" | "supplier-status";
type FollowupTemplateType = "gentle" | "discount" | "urgent";
type SupplierStatus = "verified" | "rejected" | "suspended";

interface EmailRequest {
  type: EmailType;
  data: QuoteEmailData | LeadFollowupData | SupplierStatusData;
}

interface QuoteEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  wantSwatchKit: boolean;
  subscribeNewsletter: boolean;
  quote: {
    quoteId: string;
    country: string;
    productType: string;
    quantity: number;
    fabricType?: string;
    complexityLevel: string;
    additionalRequirements?: string;
    unitPrice: number;
    totalPrice: number;
    timeline: number;
  };
}

interface LeadFollowupData {
  quoteId: string;
  templateType: FollowupTemplateType;
  customMessage?: string;
}

interface SupplierStatusData {
  supplierId: string;
  status: SupplierStatus;
  reason?: string;
}

// Email templates
const FOLLOWUP_TEMPLATES = {
  gentle: {
    subject: "Following up on your quote request",
    getBody: (quote: any) => `
      <h2>Hi ${quote.customer_name},</h2>
      <p>I wanted to follow up on the quote we sent you for <strong>${quote.quantity} ${quote.product_type}</strong>.</p>
      
      <h3>Your Quote Summary:</h3>
      <ul>
        <li><strong>Total Price:</strong> $${quote.total_price.toFixed(2)}</li>
        <li><strong>Per Unit:</strong> $${(quote.total_price / quote.quantity).toFixed(2)}</li>
        <li><strong>Delivery Time:</strong> ${quote.estimated_delivery_days} days</li>
      </ul>
      
      <p>Do you have any questions about the quote? I'd be happy to discuss your requirements in more detail or adjust the specifications to better fit your needs.</p>
      
      <p>Looking forward to hearing from you!</p>
      
      <p>Best regards,<br>Your Manufacturing Team</p>
    `,
  },
  discount: {
    subject: "Special offer on your quote - Limited time!",
    getBody: (quote: any) => `
      <h2>Hi ${quote.customer_name},</h2>
      <p>We noticed you were interested in our <strong>${quote.product_type}</strong> and wanted to extend a special offer!</p>
      
      <h3>Your Original Quote:</h3>
      <ul>
        <li><strong>Quantity:</strong> ${quote.quantity} pieces</li>
        <li><strong>Original Price:</strong> $${quote.total_price.toFixed(2)}</li>
        <li><strong>Per Unit:</strong> $${(quote.total_price / quote.quantity).toFixed(2)}</li>
      </ul>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #0070f3; margin: 20px 0;">
        <h3 style="margin-top: 0;">🎉 Special Limited-Time Offer</h3>
        <p><strong>Get 10% off</strong> if you place your order within the next 48 hours!</p>
        <p style="font-size: 24px; color: #0070f3; margin: 10px 0;">
          New Price: <strong>$${(quote.total_price * 0.9).toFixed(2)}</strong>
        </p>
      </div>
      
      <p>This is a perfect opportunity to move forward with your project at a great price. Simply reply to this email to confirm your order!</p>
      
      <p>Best regards,<br>Your Manufacturing Team</p>
    `,
  },
  urgent: {
    subject: "Last chance to secure your quote pricing",
    getBody: (quote: any) => `
      <h2>Hi ${quote.customer_name},</h2>
      <p>I wanted to reach out one more time about your quote for <strong>${quote.quantity} ${quote.product_type}</strong>.</p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0;">
        <h3 style="margin-top: 0;">⚠️ Quote Expiring Soon</h3>
        <p>The pricing we quoted is based on current material costs and production schedules. Due to market fluctuations, we can only guarantee this pricing for a limited time.</p>
      </div>
      
      <h3>Your Quote Details:</h3>
      <ul>
        <li><strong>Product:</strong> ${quote.product_type}</li>
        <li><strong>Quantity:</strong> ${quote.quantity} pieces</li>
        <li><strong>Total Price:</strong> $${quote.total_price.toFixed(2)}</li>
        <li><strong>Delivery:</strong> ${quote.estimated_delivery_days} days</li>
      </ul>
      
      <p>If you'd like to move forward or have any questions, please let me know as soon as possible so we can secure this pricing for you.</p>
      
      <p>Looking forward to working with you!</p>
      
      <p>Best regards,<br>Your Manufacturing Team</p>
    `,
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

    const { type, data }: EmailRequest = await req.json();

    switch (type) {
      case "quote":
        return await handleQuoteEmail(data as QuoteEmailData);
      case "lead-followup":
        return await handleLeadFollowup(data as LeadFollowupData, supabase);
      case "supplier-status":
        return await handleSupplierStatus(data as SupplierStatusData, supabase);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid email type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in email-service:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

async function handleQuoteEmail(data: QuoteEmailData): Promise<Response> {
  const { name, email, company, phone, wantSwatchKit, subscribeNewsletter, quote } = data;

  // Validate email before processing
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return new Response(
      JSON.stringify({ error: emailValidation.error }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const quoteDetails = `
Quote ID: ${quote.quoteId}
Customer: ${name}${company ? ` (${company})` : ''}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Country: ${quote.country}

PRODUCT DETAILS:
- Type: ${quote.productType}
- Quantity: ${quote.quantity} pieces
- Material: ${quote.fabricType || 'Standard'}
- Complexity: ${quote.complexityLevel}
${quote.additionalRequirements ? `- Requirements: ${quote.additionalRequirements}` : ''}

PRICING:
- Unit Price: $${quote.unitPrice.toFixed(2)}
- Total Price: $${quote.totalPrice.toFixed(2)}
- Timeline: ${quote.timeline} days

ADDITIONAL REQUESTS:
${wantSwatchKit ? '✓ Free fabric swatch kit requested' : ''}
${subscribeNewsletter ? '✓ Newsletter subscription requested' : ''}
  `.trim();

  // Send email to customer
  await resend.emails.send({
    from: 'Sleek Apparels <quotes@sleekapparels.com>',
    to: [email],
    subject: `Your Manufacturing Quote #${quote.quoteId.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Your Custom Manufacturing Quote</h2>
        <p>Hi ${name},</p>
        <p>Thank you for requesting a quote from Sleek Apparels! Here's your detailed manufacturing estimate:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Quote Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Product:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${quote.productType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${quote.quantity} pieces</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Unit Price:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${quote.unitPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Total Price:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #3b82f6; font-size: 18px;"><strong>$${quote.totalPrice.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
              <td style="padding: 8px 0;">${quote.timeline} days</td>
            </tr>
          </table>
        </div>

        ${wantSwatchKit ? '<p>✓ We\'ll send you a free fabric swatch kit to help you choose the perfect material.</p>' : ''}
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Our team will review your requirements and contact you within 24 hours</li>
          <li>We'll discuss final pricing, MOQ, and any customizations</li>
          <li>Once agreed, we'll send samples for your approval</li>
          <li>Production begins after sample approval</li>
        </ol>

        <p><strong>This quote is valid for 30 days.</strong></p>

        <p>Questions? Reply to this email or contact us:<br>
        📧 inquiry@sleekapparels.com<br>
        📱 WhatsApp: +880-186-1011-367</p>

        <p>Best regards,<br>
        <strong>Sleek Apparels Team</strong><br>
        Bangladesh's Premium Apparel Manufacturer</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Quote Reference: ${quote.quoteId}</p>
          <p>This is an AI-generated reference quote. Final pricing may vary based on detailed specifications.</p>
        </div>
      </div>
    `,
  });

  // Send notification to company
  await resend.emails.send({
    from: 'Sleek Apparels Quotes <quotes@sleekapparels.com>',
    to: ['inquiry@sleekapparels.com'],
    subject: `🔔 New Quote Request - ${name}${company ? ` (${company})` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Quote Request Received</h2>
        <p><strong>Action Required:</strong> Follow up within 24 hours</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <pre style="white-space: pre-wrap; font-family: monospace; font-size: 14px;">${quoteDetails}</pre>
        </div>

        <p><strong>Customer Contact:</strong><br>
        Email: <a href="mailto:${email}">${email}</a><br>
        ${phone ? `Phone: ${phone}<br>` : ''}
        ${company ? `Company: ${company}<br>` : ''}
        </p>

        <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          ⏰ <strong>Follow-up Timeline:</strong> Contact customer within 24 hours to discuss final pricing and requirements.
        </p>
      </div>
    `,
  });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleLeadFollowup(data: LeadFollowupData, supabase: any): Promise<Response> {
  const { quoteId, templateType, customMessage } = data;

  // Fetch the quote
  const { data: quote, error: quoteError } = await supabase
    .from("ai_quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (quoteError || !quote) {
    return new Response(
      JSON.stringify({ error: "Quote not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate customer email
  if (!quote.customer_email) {
    return new Response(
      JSON.stringify({ error: "Quote has no customer email" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const emailValidation = validateEmail(quote.customer_email);
  if (!emailValidation.valid) {
    return new Response(
      JSON.stringify({ error: `Invalid customer email: ${emailValidation.error}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Get email template
  const template = FOLLOWUP_TEMPLATES[templateType];
  const emailBody = customMessage || template.getBody(quote);

  // Send follow-up email
  await resend.emails.send({
    from: "Sales Team <leads@sleekapparels.com>",
    to: [quote.customer_email],
    subject: template.subject,
    html: emailBody,
  });

  // Update lead status
  await supabase
    .from("ai_quotes")
    .update({
      lead_status: "contacted",
    })
    .eq("id", quoteId);

  return new Response(
    JSON.stringify({ success: true, message: "Follow-up email sent successfully" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleSupplierStatus(data: SupplierStatusData, supabase: any): Promise<Response> {
  const { supplierId, status, reason } = data;

  // Fetch supplier details
  const { data: supplier, error: fetchError } = await supabase
    .from('suppliers')
    .select('company_name, contact_email, contact_person')
    .eq('id', supplierId)
    .single();

  if (fetchError || !supplier) {
    return new Response(
      JSON.stringify({ error: "Supplier not found" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Validate supplier email
  if (!supplier.contact_email) {
    return new Response(
      JSON.stringify({ error: "Supplier has no contact email" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const emailValidation = validateEmail(supplier.contact_email);
  if (!emailValidation.valid) {
    return new Response(
      JSON.stringify({ error: `Invalid supplier email: ${emailValidation.error}` }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  // Prepare email content based on status
  let subject = "";
  let htmlContent = "";

  if (status === 'verified') {
    subject = "🎉 Your Supplier Application Has Been Approved!";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Congratulations, ${supplier.contact_person || supplier.company_name}!</h1>
        <p>We're excited to inform you that your supplier application has been <strong>approved</strong>!</p>
        
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>You can now receive order assignments from Sleek Apparels</li>
            <li>Complete your profile with factory photos and certifications</li>
            <li>Update your capacity calendar regularly</li>
            <li>Respond promptly to order requests</li>
          </ul>
        </div>

        <p>
          <a href="${Deno.env.get("SUPABASE_URL")?.replace('supabase.co', 'lovable.app')}/supplier-dashboard" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
            Go to Dashboard
          </a>
        </p>

        <p>We look forward to a successful partnership!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          Sleek Apparels - Quality Manufacturing Solutions<br>
          If you have any questions, please contact our team.
        </p>
      </div>
    `;
  } else if (status === 'rejected') {
    subject = "Update on Your Supplier Application";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Application Status Update</h1>
        <p>Dear ${supplier.contact_person || supplier.company_name},</p>
        <p>Thank you for your interest in partnering with Sleek Apparels.</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;">After careful review, we are unable to proceed with your application at this time.</p>
          ${reason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
        </div>

        <p>We encourage you to:</p>
        <ul>
          <li>Review our supplier requirements</li>
          <li>Address any gaps in certifications or capacity</li>
          <li>Reapply in the future when ready</li>
        </ul>

        <p>We appreciate your understanding and wish you success in your business endeavors.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          Sleek Apparels - Quality Manufacturing Solutions
        </p>
      </div>
    `;
  } else if (status === 'suspended') {
    subject = "Important: Your Supplier Account Status";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Account Suspension Notice</h1>
        <p>Dear ${supplier.contact_person || supplier.company_name},</p>
        
        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;">Your supplier account has been temporarily suspended.</p>
          ${reason ? `<p style="margin: 10px 0 0 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
        </div>

        <p>Please contact our team to resolve this matter and restore your account access.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #666; font-size: 12px;">
          Sleek Apparels - Quality Manufacturing Solutions
        </p>
      </div>
    `;
  }

  // Send email
  if (supplier.contact_email) {
    await resend.emails.send({
      from: "Sleek Apparels <onboarding@resend.dev>",
      to: [supplier.contact_email],
      subject,
      html: htmlContent,
    });
    console.log(`Status notification sent to ${supplier.contact_email}`);
  }

  return new Response(
    JSON.stringify({ 
      success: true,
      message: "Notification sent successfully"
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}

serve(handler);
