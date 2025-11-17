import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

interface ConvertQuoteRequest {
  quoteId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { quoteId }: ConvertQuoteRequest = await req.json();

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: "Quote ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Check if already converted
    if (quote.converted_to_order_id) {
      return new Response(
        JSON.stringify({ error: "Quote already converted to order", orderId: quote.converted_to_order_id }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    // Generate tracking token (secure random string)
    const trackingToken = crypto.randomUUID().replace(/-/g, '');

    // Calculate expected delivery date
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + quote.estimated_delivery_days);

    // Get or create buyer (anonymous user for now)
    let buyerId = quote.buyer_id;
    
    if (!buyerId) {
      // Check if user already exists with this email
      const { data: existingUser, error: userLookupError } = await supabase.auth.admin.listUsers();
      
      if (!userLookupError && existingUser.users) {
        const existing = existingUser.users.find(u => u.email === quote.customer_email);
        if (existing) {
          buyerId = existing.id;
        }
      }

      // If still no buyer, create new user
      if (!buyerId) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: quote.customer_email,
          email_confirm: true,
          user_metadata: {
            full_name: quote.customer_name,
          },
        });

        if (authError) {
          console.error("Error creating user:", authError);
          return new Response(
            JSON.stringify({ error: "Failed to create user account", details: authError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          buyerId = authData.user.id;
        }
      }
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        buyer_id: buyerId,
        product_type: quote.product_type,
        quantity: quote.quantity,
        status: "pending",
        production_status: "pending",
        quote_id: quoteId,
        tracking_token: trackingToken,
        expected_delivery_date: expectedDeliveryDate.toISOString().split('T')[0],
        notes: quote.additional_requirements,
      })
      .select()
      .single();

    if (orderError) {
      console.error("FULL ORDER ERROR:", {
        error: orderError,
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code,
        quoteId,
        buyerId,
        orderNumber,
      });
      return new Response(
        JSON.stringify({ 
          error: "Failed to create order", 
          details: orderError.message,
          hint: orderError.hint,
          code: orderError.code 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update quote status
    await supabase
      .from("ai_quotes")
      .update({
        status: "converted",
        converted_to_order_id: order.id,
      })
      .eq("id", quoteId);

    // Send confirmation email
    const trackingUrl = `${req.headers.get("origin") || "https://your-domain.com"}/track-order/${order.id}?token=${trackingToken}`;
    
    try {
      await resend.emails.send({
        from: "Sleek Apparels <support@sleekapparels.com>",
        to: [quote.customer_email],
        subject: `Order Confirmed - #${orderNumber}`,
        html: `
          <h1>Thank you for your order, ${quote.customer_name}!</h1>
          <p>Your order has been successfully placed and is now being processed.</p>
          
          <h2>Order Details:</h2>
          <ul>
            <li><strong>Order Number:</strong> ${orderNumber}</li>
            <li><strong>Product:</strong> ${quote.product_type}</li>
            <li><strong>Quantity:</strong> ${quote.quantity} pieces</li>
            <li><strong>Total Price:</strong> $${quote.total_price.toFixed(2)}</li>
            <li><strong>Expected Delivery:</strong> ${quote.estimated_delivery_days} days</li>
          </ul>
          
          <h2>Track Your Order:</h2>
          <p>You can track your order anytime using this link:</p>
          <a href="${trackingUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Order
          </a>
          
          <p style="margin-top: 20px;">
            <small>Tracking URL: ${trackingUrl}</small>
          </p>
          
          <p>We'll keep you updated on your order progress. If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>Your Manufacturing Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          orderNumber: orderNumber,
          trackingToken: trackingToken,
          trackingUrl: trackingUrl,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("FATAL ERROR in convert-quote-to-order:", {
      error,
      message: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
    });
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: "Check edge function logs for full stack trace"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
