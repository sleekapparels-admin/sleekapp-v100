import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface QuoteRequestData {
  customer_name: string;
  customer_email: string;
  phone_number?: string;
  company?: string;
  product_type: string;
  quantity: number;
  fabric_type?: string;
  additional_requirements?: string;
  country?: string;
  source?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      customer_name,
      customer_email,
      phone_number,
      company,
      product_type,
      quantity,
      fabric_type,
      additional_requirements,
      country,
      source = 'next-js-website'
    }: QuoteRequestData = await req.json();

    // Input validation
    if (!customer_name || !customer_email || !product_type || !quantity) {
      return new Response(
        JSON.stringify({ error: 'Name, email, product type, and quantity are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Quantity validation (minimum 50 units)
    if (quantity < 50) {
      return new Response(
        JSON.stringify({ error: 'Minimum order quantity is 50 units' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Estimate pricing (basic calculation)
    const basePricePerUnit = getBasePriceForProduct(product_type);
    const estimatedPrice = basePricePerUnit * quantity;
    const estimatedDeliveryDays = getEstimatedDeliveryDays(product_type, quantity);

    // Store in ai_quotes table
    const { data: quote, error: dbError } = await supabase
      .from('ai_quotes')
      .insert({
        customer_name,
        customer_email,
        phone_number,
        product_type,
        quantity,
        fabric_type,
        additional_requirements: `${company ? `Company: ${company}\n` : ''}${additional_requirements || ''}`,
        country,
        total_price: estimatedPrice,
        estimated_delivery_days: estimatedDeliveryDays,
        status: 'draft',
        lead_status: 'new',
        quote_data: {
          base_price_per_unit: basePricePerUnit,
          estimated_total: estimatedPrice,
          delivery_days: estimatedDeliveryDays,
          source: source,
          company: company
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save quote request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'Sleek Apparels <notifications@sleekapparels.com>',
        to: ['inquiry@sleekapparels.com'],
        subject: `New Quote Request - ${product_type} (${quantity} units)`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Customer:</strong> ${customer_name}</p>
          <p><strong>Email:</strong> ${customer_email}</p>
          ${phone_number ? `<p><strong>Phone:</strong> ${phone_number}</p>` : ''}
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          ${country ? `<p><strong>Country:</strong> ${country}</p>` : ''}
          <hr>
          <p><strong>Product:</strong> ${product_type}</p>
          <p><strong>Quantity:</strong> ${quantity} units</p>
          ${fabric_type ? `<p><strong>Fabric:</strong> ${fabric_type}</p>` : ''}
          ${additional_requirements ? `<p><strong>Requirements:</strong> ${additional_requirements}</p>` : ''}
          <hr>
          <p><strong>Estimated Price:</strong> $${estimatedPrice.toFixed(2)}</p>
          <p><strong>Estimated Delivery:</strong> ${estimatedDeliveryDays} days</p>
          <p><strong>Quote ID:</strong> ${quote.id}</p>
        `,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: 'Sleek Apparels <notifications@sleekapparels.com>',
        to: [customer_email],
        subject: 'Quote Request Received - Sleek Apparels',
        html: `
          <h2>Thank you for your quote request!</h2>
          <p>Hi ${customer_name},</p>
          <p>We have received your quote request for <strong>${quantity} units of ${product_type}</strong>.</p>
          <p><strong>Preliminary Estimate:</strong></p>
          <ul>
            <li>Estimated Price: $${estimatedPrice.toFixed(2)} (${basePricePerUnit.toFixed(2)} per unit)</li>
            <li>Estimated Delivery: ${estimatedDeliveryDays} days</li>
          </ul>
          <p>Our team will review your requirements and send you a detailed quote within 2 business hours.</p>
          <p><strong>Quote Reference:</strong> ${quote.id}</p>
          <br>
          <p>Best regards,<br>Sleek Apparels Team</p>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Quote request submitted successfully',
        quote: {
          id: quote.id,
          estimated_price: estimatedPrice,
          estimated_delivery_days: estimatedDeliveryDays,
          price_per_unit: basePricePerUnit
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in submit-quote-request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to get base price for product type
function getBasePriceForProduct(productType: string): number {
  const priceMap: Record<string, number> = {
    't-shirt': 3.50,
    't-shirts': 3.50,
    'hoodie': 12.00,
    'hoodies': 12.00,
    'sweatshirt': 10.00,
    'sweatshirts': 10.00,
    'polo': 5.50,
    'polo-shirt': 5.50,
    'joggers': 9.00,
    'activewear': 8.00,
    'leggings': 7.50,
    'uniform': 6.50,
    'uniforms': 6.50,
  };

  const normalizedType = productType.toLowerCase().replace(/[^a-z-]/g, '');
  return priceMap[normalizedType] || 5.00; // Default price
}

// Helper function to estimate delivery days
function getEstimatedDeliveryDays(productType: string, quantity: number): number {
  let baseDays = 20; // Default lead time

  // Adjust based on product complexity
  const normalizedType = productType.toLowerCase();
  if (normalizedType.includes('hoodie') || normalizedType.includes('sweatshirt')) {
    baseDays = 22;
  } else if (normalizedType.includes('activewear') || normalizedType.includes('leggings')) {
    baseDays = 25;
  } else if (normalizedType.includes('uniform')) {
    baseDays = 18;
  }

  // Adjust based on quantity
  if (quantity > 1000) {
    baseDays += 5;
  } else if (quantity > 500) {
    baseDays += 3;
  }

  return baseDays;
}
