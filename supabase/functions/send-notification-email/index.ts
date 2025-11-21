import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, event_type, data } = await req.json();

    console.log("Sending notification email:", { to, event_type });

    const emailTemplates: Record<string, { subject: string; html: (d: any) => string }> = {
      order_status_change: {
        subject: `Order Status Update - ${data.order_number}`,
        html: (d) => `
          <h1>Order Status Updated</h1>
          <p>Your order <strong>${d.order_number}</strong> status has been updated to: <strong>${d.new_status}</strong></p>
          <p>View order details: <a href="${d.order_url}">Click here</a></p>
        `
      },
      quote_approved: {
        subject: `Your Quote Has Been Approved`,
        html: (d) => `
          <h1>Quote Approved</h1>
          <p>Great news! Your quote for <strong>${d.product_type}</strong> has been approved.</p>
          <p>Final Price: <strong>$${d.final_price}</strong></p>
          <p>Proceed to payment: <a href="${d.payment_url}">Pay Now</a></p>
        `
      },
      supplier_assigned: {
        subject: `New Order Assignment - ${data.order_number}`,
        html: (d) => `
          <h1>New Order Assigned</h1>
          <p>You have been assigned order <strong>${d.order_number}</strong></p>
          <p>Product: ${d.product_type}</p>
          <p>Quantity: ${d.quantity} pieces</p>
          <p>View details: <a href="${d.order_url}">Dashboard</a></p>
        `
      },
      production_milestone: {
        subject: `Production Update - ${data.order_number}`,
        html: (d) => `
          <h1>Production Milestone Reached</h1>
          <p>Order <strong>${d.order_number}</strong> has completed stage: <strong>${d.stage_name}</strong></p>
          <p>Overall Progress: ${d.overall_progress}%</p>
          <p>Track order: <a href="${d.tracking_url}">View Progress</a></p>
        `
      },
      payment_received: {
        subject: `Payment Received - ${data.order_number}`,
        html: (d) => `
          <h1>Payment Confirmation</h1>
          <p>We have received your payment of <strong>$${d.amount}</strong></p>
          <p>Order Number: ${d.order_number}</p>
          <p>Invoice: <a href="${d.invoice_url}">Download</a></p>
        `
      },
      quality_risk_alert: {
        subject: `Quality Alert - ${data.order_number}`,
        html: (d) => `
          <h1>Quality Risk Detected</h1>
          <p>Our AI system has detected potential quality risks for order <strong>${d.order_number}</strong></p>
          <p>Risk Level: <strong>${d.risk_level}</strong></p>
          <p>Recommended Actions: ${d.recommendations?.join(', ')}</p>
          <p>View details: <a href="${d.order_url}">Dashboard</a></p>
        `
      },
    };

    const template = emailTemplates[event_type];
    if (!template) {
      throw new Error(`Unknown event type: ${event_type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "LoopTrace <notifications@sleekapparels.com>",
      to: [to],
      subject: template.subject,
      html: template.html(data),
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, email_response: emailResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});