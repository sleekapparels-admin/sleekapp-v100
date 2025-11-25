import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { orderId, paymentType } = await req.json();

    if (!orderId || !paymentType) {
      throw new Error('Order ID and payment type are required');
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*,profiles!buyer_id(full_name,company_name,email:id)`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    const orders = await supabaseResponse.json();
    const order = orders[0];

    if (!order) {
      throw new Error('Order not found');
    }

    // Security: Validate price integrity before payment processing
    const orderPrice = order.buyer_price || order.total_price;
    
    if (!orderPrice || orderPrice <= 0) {
      console.error(`[${new Date().toISOString()}] ❌ Invalid order price - Order: ${orderId}, Price: ${orderPrice}`);
      throw new Error('Invalid order price - payment cannot be processed');
    }

    // SECURITY FIX: Validate payment amount against original quote
    if (order.quote_id) {
      const quoteResponse = await fetch(`${supabaseUrl}/rest/v1/quotes?id=eq.${order.quote_id}&select=total_price`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const quotes = await quoteResponse.json();
      const quote = quotes[0];

      if (quote) {
        // Allow small variance for currency rounding (0.5%)
        const maxAllowedPrice = quote.total_price * 1.005;
        const minAllowedPrice = quote.total_price * 0.995;

        if (orderPrice < minAllowedPrice || orderPrice > maxAllowedPrice) {
          console.error(`[${new Date().toISOString()}] ❌ Price mismatch - Order: ${orderId}, Order price: ${orderPrice}, Quote price: ${quote.total_price}`);
          throw new Error('Order price does not match quote. Please refresh and try again.');
        }
      }
    }

    // Log if order was recently modified (potential tampering detection)
    if (order.updated_at) {
      const updatedAt = new Date(order.updated_at);
      const createdAt = new Date(order.created_at);
      const timeSinceUpdate = Date.now() - updatedAt.getTime();
      const timeSinceCreation = Date.now() - createdAt.getTime();
      
      // Alert if order was modified within 5 minutes before payment
      if (timeSinceUpdate < 5 * 60 * 1000 && timeSinceCreation > timeSinceUpdate) {
        console.warn(`[${new Date().toISOString()}] ⚠️ Order recently modified - Order: ${orderId}, Updated: ${order.updated_at}`);
      }
    }

    // Verify order is in valid state for payment
    if (order.payment_status === 'paid') {
      console.error(`[${new Date().toISOString()}] ❌ Order already paid - Order: ${orderId}`);
      throw new Error('Order has already been paid');
    }

    // Calculate amount based on payment type
    let amount: number;
    let description: string;

    if (paymentType === 'deposit') {
      amount = Math.round(orderPrice * 0.30 * 100); // 30% deposit in cents
      description = `Deposit payment for order ${order.order_number}`;
    } else if (paymentType === 'balance') {
      amount = Math.round(orderPrice * 0.70 * 100); // 70% balance in cents
      description = `Balance payment for order ${order.order_number}`;
    } else {
      amount = Math.round(orderPrice * 100); // Full payment in cents
      description = `Payment for order ${order.order_number}`;
    }

    // Final validation: ensure amount is reasonable
    if (amount < 100) { // Minimum $1.00
      console.error(`[${new Date().toISOString()}] ❌ Payment amount too low - Order: ${orderId}, Amount: ${amount}`);
      throw new Error('Payment amount is too low');
    }

    console.log(`[${new Date().toISOString()}] 💳 Creating payment intent - Order: ${orderId}, Amount: $${(amount/100).toFixed(2)}, Type: ${paymentType}`);

    // Create or retrieve Stripe customer
    let customerId = order.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: order.profiles?.email || order.customer_email,
        name: order.profiles?.full_name || order.customer_name,
        metadata: {
          orderId: order.id,
          orderNumber: order.order_number,
        },
      });
      customerId = customer.id;

      // Update order with customer ID
      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      description,
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
        paymentType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    const updateData: any = {
      stripe_payment_intent_id: paymentIntent.id,
    };

    if (paymentType === 'deposit') {
      updateData.deposit_amount = amount / 100;
    } else if (paymentType === 'balance') {
      updateData.balance_amount = amount / 100;
    }

    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    // Create invoice record
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    await fetch(`${supabaseUrl}/rest/v1/invoices`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        order_id: orderId,
        invoice_number: invoiceNumber,
        amount: amount / 100,
        payment_type: paymentType,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
    });

    console.log('Payment intent created:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});