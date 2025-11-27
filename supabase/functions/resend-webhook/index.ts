import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('RESEND_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Svix headers
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing Svix webhook headers');
      return new Response(JSON.stringify({ error: 'Missing webhook headers' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();

    // Verify webhook signature
    const signedContent = `${svixId}.${svixTimestamp}.${body}`;
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(signedContent)
      .digest('base64');

    const signatures = svixSignature.split(' ');
    const validSignature = signatures.some(sig => {
      const [version, signature] = sig.split(',');
      return version === 'v1' && signature === expectedSignature;
    });

    if (!validSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(body);
    console.log('Resend webhook event:', event.type);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle email delivery events
    switch (event.type) {
      case 'email.delivered': {
        const { error } = await supabase
          .from('email_verification_otps')
          .update({
            delivery_status: 'delivered',
            delivery_error: null,
          })
          .eq('resend_email_id', event.data.email_id);

        if (error) {
          console.error('Error updating delivery status:', error);
        }
        break;
      }

      case 'email.bounced':
      case 'email.delivery_delayed': {
        const { error } = await supabase
          .from('email_verification_otps')
          .update({
            delivery_status: event.type === 'email.bounced' ? 'bounced' : 'delayed',
            delivery_error: JSON.stringify(event.data),
          })
          .eq('resend_email_id', event.data.email_id);

        if (error) {
          console.error('Error updating delivery status:', error);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
