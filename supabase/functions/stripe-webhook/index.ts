import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log('Webhook event received:', event.type);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId, paymentType } = paymentIntent.metadata;

        console.log('Payment succeeded:', paymentIntent.id, 'for order:', orderId);

        // Fetch order to get buyer_id
        const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=buyer_id`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        });

        const orders = await orderResponse.json();
        const buyerId = orders?.[0]?.buyer_id;

        if (!buyerId) {
          console.error('Buyer ID not found for order:', orderId);
        }

        // Update order payment status
        const updateData: any = {
          payment_status: paymentType === 'deposit' ? 'deposit_paid' : 'paid',
        };

        if (paymentType === 'deposit') {
          updateData.deposit_paid_at = new Date().toISOString();
        } else if (paymentType === 'balance') {
          updateData.balance_paid_at = new Date().toISOString();
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

        // Update invoice status
        await fetch(`${supabaseUrl}/rest/v1/invoices?stripe_payment_intent_id=eq.${paymentIntent.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'paid',
            paid_at: new Date().toISOString(),
          }),
        });

        // Create notification for buyer (only if buyer_id was found)
        if (buyerId) {
          await fetch(`${supabaseUrl}/rest/v1/notifications`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              user_id: buyerId,
              title: 'Payment Confirmed',
              message: `Your ${paymentType} payment has been processed successfully`,
              type: 'payment_success',
              link: `/orders/${orderId}`,
            }),
          });
          console.log('Payment notification sent to buyer:', buyerId);
        }

        console.log('Order and invoice updated successfully');
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { orderId } = paymentIntent.metadata;

        console.log('Payment failed:', paymentIntent.id, 'for order:', orderId);

        // Update invoice status
        await fetch(`${supabaseUrl}/rest/v1/invoices?stripe_payment_intent_id=eq.${paymentIntent.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'failed',
          }),
        });

        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});