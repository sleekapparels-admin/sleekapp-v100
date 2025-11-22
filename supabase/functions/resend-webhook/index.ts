import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
};

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce_reason?: string;
    delivery_status?: string;
    opened_at?: string;
    clicked_at?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Verify webhook signature from Resend
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error(`[${new Date().toISOString()}] ❌ RESEND_WEBHOOK_SECRET not configured`);
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const signature = req.headers.get('svix-signature');
    const timestamp = req.headers.get('svix-timestamp');
    const svixId = req.headers.get('svix-id');

    if (!signature || !timestamp || !svixId) {
      console.error(`[${new Date().toISOString()}] ❌ Missing webhook signature headers`);
      return new Response(
        JSON.stringify({ error: 'Missing signature headers' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature using HMAC SHA-256
    const payloadString = await req.text();
    const signedContent = `${svixId}.${timestamp}.${payloadString}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedContent)
    );
    
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));
    
    // Svix sends multiple signatures separated by spaces, check if any match
    const signatures = signature.split(' ');
    const isValid = signatures.some(sig => {
      const [, sigValue] = sig.split(',');
      return sigValue === expectedSignature;
    });

    if (!isValid) {
      console.error(`[${new Date().toISOString()}] ❌ Invalid webhook signature`);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse verified payload
    const payload: ResendWebhookPayload = JSON.parse(payloadString);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, data } = payload;
    const emailId = data.email_id;
    
    if (!emailId) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Webhook received without email_id - Type: ${type}`);
      return new Response(
        JSON.stringify({ received: true, warning: 'No email_id provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${new Date().toISOString()}] 📬 Webhook received - Type: ${type}, Email ID: ${emailId}`);

    // Handle different webhook events
    switch (type) {
      case 'email.delivered':
        console.log(`[${new Date().toISOString()}] ✅ Email delivered - ID: ${emailId}`);
        await supabase
          .from('email_verification_otps')
          .update({ delivery_status: 'delivered' })
          .eq('resend_email_id', emailId);
        break;
        
      case 'email.bounced':
        const bounceReason = data.bounce_reason || 'Email bounced';
        console.log(`[${new Date().toISOString()}] ❌ Email bounced - ID: ${emailId}, Reason: ${bounceReason}`);
        await supabase
          .from('email_verification_otps')
          .update({ 
            delivery_status: 'bounced',
            delivery_error: bounceReason
          })
          .eq('resend_email_id', emailId);
        break;
        
      case 'email.delivery_delayed':
        console.warn(`[${new Date().toISOString()}] ⏳ Email delivery delayed - ID: ${emailId}`);
        // Don't update status, just log for monitoring
        break;

      case 'email.complained':
        console.warn(`[${new Date().toISOString()}] ⚠️ Email complaint (spam report) - ID: ${emailId}`);
        await supabase
          .from('email_verification_otps')
          .update({ 
            delivery_error: 'Marked as spam by recipient'
          })
          .eq('resend_email_id', emailId);
        break;

      case 'email.opened':
        console.log(`[${new Date().toISOString()}] 👀 Email opened - ID: ${emailId}`);
        // Optional: Track email opens for analytics
        break;

      case 'email.clicked':
        console.log(`[${new Date().toISOString()}] 🔗 Email link clicked - ID: ${emailId}`);
        // Optional: Track link clicks for analytics
        break;

      default:
        console.log(`[${new Date().toISOString()}] ℹ️ Unhandled webhook type: ${type}`);
    }

    return new Response(
      JSON.stringify({ received: true, type, email_id: emailId }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] ❌ Webhook processing error:`, error);
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
