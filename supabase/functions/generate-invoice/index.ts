import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { invoice_id } = await req.json();

    if (!invoice_id) {
      throw new Error('invoice_id is required');
    }

    // Fetch invoice with order and buyer details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        orders (
          *,
          profiles:buyer_id (
            full_name,
            company_name,
            email,
            phone
          )
        )
      `)
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      throw new Error('Invoice not found');
    }

    const order = invoice.orders;
    const buyer = order.profiles;

    // Generate invoice HTML using Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at generating professional B2B invoice HTML documents. Generate clean, professional invoice HTML with proper styling.'
          },
          {
            role: 'user',
            content: `Generate a professional invoice HTML document with the following details:

Invoice Number: ${invoice.invoice_number}
Invoice Date: ${new Date(invoice.created_at).toLocaleDateString()}
Due Date: ${new Date(invoice.due_date).toLocaleDateString()}
Payment Type: ${invoice.payment_type}

Bill To:
${buyer.company_name || buyer.full_name}
${buyer.email}
${buyer.phone}

From:
Sleek Apparels Ltd.
Bangladesh Garment Manufacturer
inquiry@sleekapparels.com

Order Details:
Order Number: ${order.order_number}
Product Type: ${order.product_type}
Quantity: ${order.quantity} units
Amount: $${invoice.amount.toFixed(2)}

Include:
- Professional header with company logo placeholder
- Clean table layout
- Payment terms: Net 7 days
- Bank details section placeholder
- Footer with contact information
- Modern, clean styling with good spacing
- Print-friendly design

Return ONLY the complete HTML document, no explanations.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate invoice HTML');
    }

    const aiData = await aiResponse.json();
    const invoiceHtml = aiData.choices[0].message.content;

    // Store invoice HTML in storage
    const fileName = `invoices/${invoice.invoice_number}.html`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, new Blob([invoiceHtml], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // Update invoice with PDF URL
    await supabase
      .from('invoices')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', invoice_id);

    // Send invoice email
    const emailResult = await resend.emails.send({
      from: 'Sleek Apparels <invoices@sleekapparels.com>',
      to: [buyer.email],
      subject: `Invoice ${invoice.invoice_number} - Order #${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice ${invoice.invoice_number}</h2>
          <p>Dear ${buyer.full_name || buyer.company_name},</p>
          <p>Please find your invoice for Order #${order.order_number} attached.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Invoice Summary</h3>
            <p><strong>Invoice Number:</strong> ${invoice.invoice_number}</p>
            <p><strong>Amount:</strong> $${invoice.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
            <p><strong>Payment Type:</strong> ${invoice.payment_type}</p>
          </div>
          
          <p><a href="${urlData.publicUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Invoice</a></p>
          
          <p>Please process payment before the due date.</p>
          
          <p>Best regards,<br>Sleek Apparels Team</p>
        </div>
      `,
    });

    console.log('Invoice email sent:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice_url: urlData.publicUrl,
        email_id: emailResult.data?.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating invoice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
