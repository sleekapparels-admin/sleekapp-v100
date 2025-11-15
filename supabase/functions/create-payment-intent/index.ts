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

    // Calculate amount based on payment type
    let amount: number;
    let description: string;

    if (paymentType === 'deposit') {
      amount = Math.round((order.buyer_price || order.total_price) * 0.30 * 100); // 30% deposit in cents
      description = `Deposit payment for order ${order.order_number}`;
    } else if (paymentType === 'balance') {
      amount = Math.round((order.buyer_price || order.total_price) * 0.70 * 100); // 70% balance in cents
      description = `Balance payment for order ${order.order_number}`;
    } else {
      amount = Math.round((order.buyer_price || order.total_price) * 100); // Full payment in cents
      description = `Payment for order ${order.order_number}`;
    }

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