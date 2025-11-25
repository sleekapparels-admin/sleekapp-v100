import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Analysis types
type AnalysisType = 'order-insights' | 'quality-analysis';

interface AnalyticsRequest {
  analysisType: AnalysisType;
  data: OrderInsightsData | QualityAnalysisData;
}

interface OrderInsightsData {
  orderData: any;
  updates: any[];
  qcChecks: any[];
}

interface QualityAnalysisData {
  defects: any[];
  qcChecks: any[];
  orderType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysisType, data }: AnalyticsRequest = await req.json();

    switch (analysisType) {
      case 'order-insights':
        return await handleOrderInsights(data as OrderInsightsData);
      case 'quality-analysis':
        return await handleQualityAnalysis(data as QualityAnalysisData);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid analysis type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Error in analytics-service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function handleOrderInsights(data: OrderInsightsData): Promise<Response> {
  const { orderData, updates, qcChecks } = data;
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  const prompt = `Analyze this apparel manufacturing order for Sleek Apparels and provide actionable insights relevant to our business operations:

Order Details:
- Order Number: ${orderData.order_number}
- Product Type: ${orderData.product_type}
- Quantity: ${orderData.quantity} pieces
- Current Status: ${orderData.status}
- Target Delivery Date: ${orderData.target_date}

Customer Information:
- Company: ${orderData.buyer?.company_name}
- Contact: ${orderData.buyer?.full_name}

Production Updates: ${updates.length} updates
Latest Update: ${updates[0]?.message || 'No updates yet'}

Quality Control Checks: ${qcChecks.length} checks performed
${qcChecks.length > 0 ? `Latest QC Results: ${qcChecks[0]?.passed_pieces || 0}/${qcChecks[0]?.total_pieces_checked || 0} pieces passed (${qcChecks.length > 0 ? ((qcChecks[0]?.passed_pieces / qcChecks[0]?.total_pieces_checked) * 100).toFixed(1) : 0}%)` : ''}

As a manufacturing expert for Sleek Apparels, a Bangladesh-based ethical apparel manufacturer specializing in low MOQ production (50-300 pieces), provide:
1. Delivery prediction (on-time/delayed) with reasoning based on current progress
2. Quality forecast based on QC trends and industry standards
3. Top 3 specific recommendations for the production team
4. Risk assessment (low/medium/high) with specific factors
5. Summary of key insights for management

Format as JSON: { "deliveryPrediction": "...", "qualityForecast": "...", "recommendations": ["...", "...", "..."], "riskLevel": "...", "summary": "..." }

Focus on practical insights that help our team improve production efficiency, maintain quality standards, and ensure customer satisfaction. Consider our specialization in knitwear, cut & sew, and uniform production with ethical manufacturing practices.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
          content: 'You are an expert apparel manufacturing analyst for Sleek Apparels, a Bangladesh-based ethical apparel manufacturer. You specialize in providing insights for low MOQ production (50-300 pieces) across knitwear, cut & sew, and uniform production. Focus on practical, actionable insights that help production teams and management make better decisions. Provide insights in valid JSON format only.' 
        },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limits exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error('Failed to get AI insights');
  }

  const responseData = await response.json();
  const aiResponse = responseData.choices[0].message.content;
  
  // Extract JSON from response
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: aiResponse };

  return new Response(JSON.stringify(insights), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleQualityAnalysis(data: QualityAnalysisData): Promise<Response> {
  const { defects, qcChecks, orderType } = data;
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  const defectSummary = defects.map((d: any) => 
    `${d.defect_type} (${d.severity}): ${d.quantity} pieces`
  ).join('\n');

  const prompt = `Analyze quality control data for ${orderType} manufacturing:

QC Checks Performed: ${qcChecks.length}
Total Defects Found: ${defects.length}

Defect Details:
${defectSummary}

Average Pass Rate: ${(qcChecks.reduce((acc: number, qc: any) => 
  acc + (qc.passed_pieces / qc.total_pieces_checked * 100), 0) / qcChecks.length).toFixed(1)}%

Provide:
1. Root cause analysis of defects
2. Process improvement suggestions
3. Quality trend prediction
4. Recommended preventive actions

Format as JSON: { "rootCauses": ["...", "..."], "improvements": ["...", "..."], "trend": "...", "preventiveActions": ["...", "..."], "summary": "..." }`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
          content: 'You are a quality control expert in apparel manufacturing. Provide actionable insights in valid JSON format.' 
        },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Rate limits exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    throw new Error('Failed to get quality analysis');
  }

  const responseData = await response.json();
  const aiResponse = responseData.choices[0].message.content;
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: aiResponse };

  return new Response(JSON.stringify(analysis), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(handler);
