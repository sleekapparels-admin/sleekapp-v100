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

    const { order_id } = await req.json();

    if (!order_id) {
      throw new Error('order_id is required');
    }

    // Fetch order with supplier and buyer details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        buyer:profiles!orders_buyer_id_fkey (
          full_name,
          company_name,
          email,
          phone
        ),
        supplier:suppliers!orders_supplier_id_fkey (
          company_name,
          contact_email,
          contact_phone,
          factory_location
        )
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    if (!order.supplier) {
      throw new Error('Supplier not assigned to this order');
    }

    // Generate work order number
    const workOrderNumber = `WO-${new Date().getFullYear()}-${order.order_number}`;

    // Generate work order document using Lovable AI
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
            content: 'You are an expert at generating detailed work order documents for garment manufacturing. Generate comprehensive, clear work orders with all technical specifications.'
          },
          {
            role: 'user',
            content: `Generate a detailed work order HTML document with the following information:

Work Order Number: ${workOrderNumber}
Date: ${new Date().toLocaleDateString()}
Target Delivery: ${order.target_date || 'To be confirmed'}

Buyer Information:
${order.buyer.company_name || order.buyer.full_name}
${order.buyer.email}
${order.buyer.phone}

Supplier Information:
${order.supplier.company_name}
${order.supplier.factory_location}
${order.supplier.contact_email}
${order.supplier.contact_phone}

Production Requirements:
Order Number: ${order.order_number}
Product Type: ${order.product_type}
Quantity: ${order.quantity} units
Agreed Price: $${order.supplier_price?.toFixed(2) || 'TBD'}

${order.notes ? `Special Instructions:\n${order.notes}` : ''}

Include sections for:
- Quality specifications
- Delivery requirements
- Packaging instructions
- Inspection checkpoints
- Approval signatures
- Production timeline milestones

Generate a professional, print-ready HTML document with clear sections and proper formatting. Return ONLY the complete HTML document.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate work order document');
    }

    const aiData = await aiResponse.json();
    const workOrderHtml = aiData.choices[0].message.content;

    // Store work order in storage
    const fileName = `work-orders/${workOrderNumber}.html`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, new Blob([workOrderHtml], { type: 'text/html' }), {
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

    // Store work order record in database
    const { error: docError } = await supabase
      .from('order_documents')
      .insert({
        order_id: order_id,
        document_type: 'work_order',
        file_name: `${workOrderNumber}.html`,
        file_type: 'text/html',
        file_url: urlData.publicUrl,
        uploaded_by: 'system',
      });

    if (docError) {
      console.error('Error storing document record:', docError);
    }

    // Send work order email to supplier
    const emailResult = await resend.emails.send({
      from: 'Sleek Apparels <operations@sleekapparels.com>',
      to: [order.supplier.contact_email],
      cc: ['inquiry@sleekapparels.com'],
      subject: `Work Order ${workOrderNumber} - Order #${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Work Order Assignment</h2>
          <p>Dear ${order.supplier.company_name} Team,</p>
          <p>You have been assigned a new production order. Please review the work order document carefully.</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Order Summary</h3>
            <p><strong>Work Order:</strong> ${workOrderNumber}</p>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Product:</strong> ${order.product_type}</p>
            <p><strong>Quantity:</strong> ${order.quantity} units</p>
            <p><strong>Target Date:</strong> ${order.target_date || 'TBD'}</p>
            <p><strong>Supplier Price:</strong> $${order.supplier_price?.toFixed(2) || 'TBD'}</p>
          </div>
          
          <p><a href="${urlData.publicUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">View Work Order</a></p>
          
          <p>Please confirm receipt and review all specifications. Contact us immediately if you have any questions or concerns.</p>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review all technical specifications</li>
            <li>Confirm material sourcing timeline</li>
            <li>Setup production stages in LoopTrace</li>
            <li>Begin production as per schedule</li>
          </ul>
          
          <p>Best regards,<br>Sleek Apparels Operations Team</p>
        </div>
      `,
    });

    console.log('Work order email sent:', emailResult);

    // Also notify the buyer
    await resend.emails.send({
      from: 'Sleek Apparels <operations@sleekapparels.com>',
      to: [order.buyer.email],
      subject: `Production Started - Order #${order.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Production Order Confirmed</h2>
          <p>Dear ${order.buyer.full_name || order.buyer.company_name},</p>
          <p>Great news! Your order has been assigned to our manufacturing partner and production is ready to begin.</p>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Product:</strong> ${order.product_type}</p>
            <p><strong>Quantity:</strong> ${order.quantity} units</p>
            <p><strong>Expected Delivery:</strong> ${order.target_date || 'TBD'}</p>
          </div>
          
          <p>You can track production progress in real-time using LoopTrace™ technology.</p>
          
          <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/orders/${order_id}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Your Order</a></p>
          
          <p>Best regards,<br>Sleek Apparels Team</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        work_order_url: urlData.publicUrl,
        work_order_number: workOrderNumber,
        email_id: emailResult.data?.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error generating work order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
