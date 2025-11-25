import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(5000, 'Message content must be 5000 characters or less')
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50, 'Maximum 50 messages allowed'),
  sessionId: z.string().optional(),
  conversationId: z.string().uuid().nullish()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input
    const validationResult = requestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: validationResult.error.issues.map(i => i.message).join(', ')
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages, sessionId, conversationId } = validationResult.data;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting - 10 conversations per identifier per hour
    const identifier = req.headers.get('x-forwarded-for')?.split(',')[0] || sessionId || 'unknown';
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

    const { data: rateLimitData } = await supabase
      .from('conversation_rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .gte('window_start', oneHourAgo)
      .single();

    if (rateLimitData) {
      if (rateLimitData.request_count >= 10) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: 3600
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      await supabase
        .from('conversation_rate_limits')
        .update({ 
          request_count: rateLimitData.request_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', rateLimitData.id);
    } else {
      await supabase
        .from('conversation_rate_limits')
        .insert({
          identifier,
          request_count: 1,
          window_start: new Date().toISOString()
        });
    }

    // Fetch industry knowledge for context
    const { data: knowledge } = await supabase
      .from('industry_knowledge')
      .select('category, subcategory, title, content')
      .order('category')
      .limit(100);

    // Build knowledge context
    const knowledgeByCategory = knowledge?.reduce((acc: Record<string, string[]>, k) => {
      const category = k.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(`**${k.title}:** ${k.content}`);
      return acc;
    }, {} as Record<string, string[]>) || {};

    const knowledgeContext = Object.entries(knowledgeByCategory)
      .map(([category, items]) => `\n### ${category.toUpperCase()}\n${items.join('\n\n')}`)
      .join('\n') || '';

    // Extract data from messages
    const extractedData = extractEnhancedData(messages);
    const calculatedLeadScore = calculateLeadScore(extractedData);

    // Check if user is asking about orders
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    const isOrderQuery = lastMessage.includes('order') || lastMessage.includes('quote') || lastMessage.includes('status');
    
    let orderContext = '';
    if (isOrderQuery && extractedData.email) {
      // Fetch user's orders and quotes
      const { data: quotes } = await supabase
        .from('ai_quotes')
        .select('*')
        .eq('customer_email', extractedData.email)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (quotes && quotes.length > 0) {
        orderContext = `\n**USER'S RECENT QUOTES/ORDERS:**\n${quotes.map(q => 
          `- Quote #${q.id.substring(0, 8)}: ${q.quantity} ${q.product_type} - $${q.total_price} - Status: ${q.status || 'pending'}`
        ).join('\n')}\n`;
      }
    }

    // Inject conversation summary for context
    const conversationSummary = `
**CONVERSATION CONTEXT:**
- User's name: ${extractedData.name || 'Not collected yet'}
- Product interest: ${extractedData.productType || 'Not specified yet'}
- Quantity: ${extractedData.quantity || 'Not specified yet'}
- Customization level: ${extractedData.customization_level || 'Not specified yet'}
- Email: ${extractedData.email || 'Not collected yet'}
- Current stage: ${extractedData.stage || 'greeting'}
- Lead score: ${calculatedLeadScore}/100
${orderContext}

**WHAT TO ASK NEXT:**
${getNextQuestion(extractedData)}
`;

    const systemPrompt = `You are Loop AI, a friendly B2B fashion manufacturing assistant for Sleek Apparels. You help buyers get custom apparel quotes and track orders.

**CRITICAL: FOLLOW THIS EXACT STATE MACHINE (No exceptions!):**

CURRENT STATE: ${extractedData.stage || 'greeting'}
USER JUST SAID: ${messages[messages.length - 1]?.content || ''}

**ORDER QUERIES:**
If user asks about their orders/quotes:
- Check the USER'S RECENT QUOTES/ORDERS section above
- Provide specific information about their quotes
- Use quote ID, product type, quantity, price, and status
- Example: "I see you requested a quote for 500 t-shirts at $2,500 (Quote #abc12345). It's currently pending review. Would you like me to connect you with our team?"

**STATE FLOW (Follow in order):**
1. GREETING → Ask their name warmly
2. NAME_COLLECTED → Ask "What brings you here today?" or "What would you like to create?"
3. INTENT_UNDERSTOOD → Ask about specific product type (t-shirts? hoodies? polos?)
4. PRODUCT_IDENTIFIED → Ask quantity with realistic ranges
5. QUANTITY_COLLECTED → Ask about customization (logo only? full custom design?)
6. CUSTOMIZATION_COLLECTED → Get email ("I'd love to send you reference images! What's your email?")
7. EMAIL_COLLECTED → Offer choice: "Generate quote now" OR "Talk to sourcing team"

**RESPONSE RULES (Mandatory):**
- Your response MUST match the current state (see above)
- Ask EXACTLY ONE question per response
- Keep responses under 35 words
- Use 1-2 emojis max
- Be conversational, not robotic
- Reference their previous answers naturally

**INDUSTRY KNOWLEDGE (Use this to answer questions confidently):**
${knowledgeContext}

**EXAMPLES OF CORRECT RESPONSES:**

Example 1 - Name Collection:
User: "Hi"
State: GREETING
Your Response: "Hey there! 👋 I'm Loop, your fashion manufacturing guide. What should I call you?"

Example 2 - Product Inquiry:
User: "I'm Sarah"
State: NAME_COLLECTED
Your Response: "Great to meet you, Sarah! 😊 What brings you here today - looking to create t-shirts, hoodies, or something else?"

Example 3 - Quantity:
User: "T-shirts"
State: PRODUCT_IDENTIFIED
Your Response: "T-shirts are perfect for branding! 👕 How many pieces are you thinking? Most start with 100-500 for their first order."

Example 4 - Customization:
User: "Around 500"
State: QUANTITY_COLLECTED
Your Response: "Nice! At 500 you'll get great bulk pricing 💰 What kind of customization - just your logo, or full custom design with colors?"

Example 5 - Email Collection:
User: "Just logo printing"
State: CUSTOMIZATION_COLLECTED
Your Response: "Perfect! I'd love to send you some reference images and pricing examples. What's your email address?"

Example 6 - Final Choice:
User: "sarah@company.com"
State: EMAIL_COLLECTED
Your Response: "Thanks Sarah! 🎯 What would you like to do next?

🎯 **Generate instant quote** - See detailed pricing & timeline now
📧 **Talk to sourcing team** - Get personalized help (24h response)
💬 **More questions** - I'm here to help!"

Example 7 - Order Query:
User: "What's the status of my order?"
State: ANY (if email collected)
Your Response: "Let me check! I see your quote for 500 t-shirts at $2,500 (Quote #abc12345) is pending review. Our team will respond within 24h. Want me to expedite this?"

**ANSWERING BUYER QUESTIONS:**
When they ask about MOQ, pricing, samples, certifications, etc., use the INDUSTRY KNOWLEDGE above to answer confidently. Then smoothly return to collecting missing data.

Example - MOQ Question:
User: "What's your MOQ?"
Your Response: "Our MOQ is just 50 pieces - perfect for testing! Most factories need 500+ minimum 😊 Are you looking to start with samples or ready for bulk?"

**VALIDATION RULES:**
- If user gives unclear answer, ask clarifying question
- If they go off-topic, gently guide back: "Great question! [answer]. Now, [next question in state machine]"
- Never skip states - collect data in order
- Never ask multiple questions in one message

**WHAT NOT TO DO:**
- Don't generate quotes yourself (offer redirect instead)
- Don't be pushy about email - frame as helpful
- Don't use industry jargon without explaining
- Don't send walls of text
- Don't ask "anything else?" - be specific

${conversationSummary}

**YOUR NEXT MESSAGE:**
Based on the current state (${extractedData.stage || 'greeting'}), respond with EXACTLY what's appropriate for that stage. Stay on track!`;

    // Call Lovable AI with GPT-5-mini
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let assistantMessage = aiData.choices[0].message.content;

    // Validate AI response matches expected state
    if (!validateAIResponse(assistantMessage, extractedData.stage)) {
      console.warn('AI gave off-topic response, using fallback');
      assistantMessage = getFallbackQuestion(extractedData.stage);
    }

    // Update extracted data based on AI response
    const updatedExtractedData = extractEnhancedData([...messages, { role: 'assistant', content: assistantMessage }]);
    updatedExtractedData.lead_score = calculatedLeadScore;

    // Create or update conversation context
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: newConversation } = await supabase
        .from('conversation_context')
        .insert({
          session_id: sessionId,
          intent: updatedExtractedData.intent,
          stage: updatedExtractedData.stage,
          extracted_data: updatedExtractedData,
          lead_score: calculatedLeadScore,
        })
        .select()
        .single();
      currentConversationId = newConversation?.id;
    } else {
      await supabase
        .from('conversation_context')
        .update({
          intent: updatedExtractedData.intent,
          stage: updatedExtractedData.stage,
          extracted_data: updatedExtractedData,
          lead_score: calculatedLeadScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    }

    // Save assistant message
    if (currentConversationId) {
      await supabase.from('conversation_messages').insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: assistantMessage,
        metadata: { extracted_data: updatedExtractedData, lead_score: calculatedLeadScore },
      });
    }

    // Generate context-aware quick replies based on AI's actual question
    const enhancedQuickReplies = generateContextualQuickReplies(assistantMessage, updatedExtractedData);
    
    // Check if user has provided all info and wants quote/team contact
    const shouldOfferOptions = updatedExtractedData.email && updatedExtractedData.productType && updatedExtractedData.quantity;
    
    let quote = null;
    let finalQuickReplies = enhancedQuickReplies;
    
    // If email collected and all data present, offer final options
    if (shouldOfferOptions && updatedExtractedData.stage === 'email_collected') {
      finalQuickReplies = [
        { text: "🎯 Generate Quote", value: "generate_quote", action: "redirect_to_quote" },
        { text: "📧 Talk to Team", value: "talk_to_team", action: "submit_lead" },
        { text: "💬 More Questions", value: "I have more questions" }
      ];
    }

    // Handle "Talk to Team" action - save lead
    if (messages[messages.length - 1]?.content.toLowerCase().includes('talk to team') || 
        messages[messages.length - 1]?.content.toLowerCase().includes('talk_to_team')) {
      await supabase.from('quote_requests').insert({
        email: updatedExtractedData.email,
        name: updatedExtractedData.name,
        product_type: updatedExtractedData.productType,
        quantity: updatedExtractedData.quantity,
        customization_details: updatedExtractedData.customization_level,
        budget_range: updatedExtractedData.budget_range,
        status: 'pending',
        lead_score: calculatedLeadScore,
      });
      
      assistantMessage = `Perfect! ✅ Our sourcing team has your details. We'll email you within 24 hours with personalized options, samples, and pricing.\n\nAnything else I can help with today?`;
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        extractedData: updatedExtractedData,
        quickReplies: finalQuickReplies,
        conversationId: currentConversationId,
        leadScore: calculatedLeadScore,
        quote,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in conversational-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "I'm having trouble connecting right now. Please try again in a moment! 😊"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to determine next question based on state
function getNextQuestion(extractedData: any): string {
  const stage = extractedData.stage || 'greeting';
  
  const stateQuestions: Record<string, string> = {
    'greeting': 'Ask for their name warmly',
    'name_collected': 'Ask what they want to create (product type)',
    'intent_understood': 'Ask specific product type (t-shirts? hoodies? polos?)',
    'product_identified': 'Ask quantity with realistic ranges (50-100? 500-1000?)',
    'quantity_collected': 'Ask customization level (logo only? full custom?)',
    'customization_collected': 'Get email naturally ("I\'d love to send you examples!")',
    'email_collected': 'Offer final choice: Generate quote OR Talk to team',
  };
  
  return stateQuestions[stage] || 'Ask for their name';
}

// Context-aware quick reply generation
function generateContextualQuickReplies(aiResponse: string, extractedData: any): any[] {
  const lowercaseResponse = aiResponse.toLowerCase();
  const stage = extractedData.stage || 'greeting';
  
  // No quick replies for name (freeform text)
  if (stage === 'greeting' || lowercaseResponse.includes('what should i call you') || 
      lowercaseResponse.includes('your name')) {
    return [];
  }
  
  // Product type inquiry
  if (stage === 'name_collected' || stage === 'intent_understood' || 
      lowercaseResponse.includes('what would you like to create') ||
      lowercaseResponse.includes('t-shirt') || lowercaseResponse.includes('hoodie') ||
      lowercaseResponse.includes('what brings you here')) {
    return [
      { text: "👕 T-shirts", value: "I want t-shirts" },
      { text: "🧥 Hoodies", value: "I want hoodies" },
      { text: "👔 Polo shirts", value: "I want polo shirts" },
      { text: "🧶 Sweaters", value: "I want sweaters" },
      { text: "💬 Other", value: "I want something else" },
    ];
  }
  
  // Quantity inquiry
  if (stage === 'product_identified' || lowercaseResponse.includes('how many') || 
      lowercaseResponse.includes('quantity') || lowercaseResponse.includes('pieces')) {
    return [
      { text: "🧪 50-100 (Testing)", value: "50-100 pieces" },
      { text: "🚀 100-500 (Launch)", value: "100-500 pieces" },
      { text: "📈 500-1000 (Growing)", value: "500-1000 pieces" },
      { text: "💪 1000+ (Bulk)", value: "Over 1000 pieces" },
    ];
  }
  
  // Customization level
  if (stage === 'quantity_collected' || lowercaseResponse.includes('customization') ||
      lowercaseResponse.includes('logo') || lowercaseResponse.includes('design')) {
    return [
      { text: "🏷️ Logo Only", value: "Just logo printing" },
      { text: "🎨 Custom Design", value: "Full custom design with colors" },
      { text: "🌈 Multi-Color", value: "Multi-color printing" },
      { text: "🧵 Embroidery", value: "Embroidered logo" },
      { text: "💬 Not Sure", value: "I need help deciding" },
    ];
  }
  
  // Email - no quick replies (freeform)
  if (stage === 'customization_collected' || lowercaseResponse.includes('email')) {
    return [];
  }
  
  // Budget inquiry (optional stage)
  if (lowercaseResponse.includes('budget') || lowercaseResponse.includes('price range')) {
    return [
      { text: "💵 $5-10 per piece", value: "$5-10 per piece" },
      { text: "💰 $10-20 per piece", value: "$10-20 per piece" },
      { text: "💎 $20+ per piece", value: "Over $20 per piece" },
      { text: "🤷 Not sure yet", value: "I'm not sure about budget" },
    ];
  }
  
  // Yes/No questions
  if (lowercaseResponse.includes('would you like') || lowercaseResponse.includes('are you interested')) {
    return [
      { text: "✅ Yes", value: "Yes" },
      { text: "❌ No", value: "No" },
      { text: "💬 Tell me more", value: "Tell me more about it" },
    ];
  }
  
  // Default: no quick replies (let user type freely)
  return [];
}

// Validate AI response matches expected state
function validateAIResponse(response: string, expectedStage: string): boolean {
  const lowercaseResponse = response.toLowerCase();
  
  if (expectedStage === 'greeting' && !lowercaseResponse.includes('name')) {
    return false;
  }
  if (expectedStage === 'name_collected' && 
      !lowercaseResponse.includes('what') && 
      !lowercaseResponse.includes('bring') &&
      !lowercaseResponse.includes('create')) {
    return false;
  }
  if (expectedStage === 'product_identified' && 
      !lowercaseResponse.includes('many') && 
      !lowercaseResponse.includes('quantity') &&
      !lowercaseResponse.includes('pieces')) {
    return false;
  }
  
  return true;
}

// Fallback questions for each state
function getFallbackQuestion(stage: string): string {
  const fallbacks: Record<string, string> = {
    'greeting': "Hey there! 👋 I'm Loop. What should I call you?",
    'name_collected': "Great to meet you! 😊 What would you like to create today?",
    'intent_understood': "What kind of product interests you - t-shirts, hoodies, or something else?",
    'product_identified': "How many pieces are you thinking? Most start with 100-500 for their first order.",
    'quantity_collected': "What kind of customization - just your logo, or full custom design?",
    'customization_collected': "Perfect! What's your email so I can send you some examples?",
    'email_collected': "What would you like to do next - generate a quote or talk to our team?",
  };
  
  return fallbacks[stage] || "How can I help you today?";
}

// Enhanced data extraction
function extractEnhancedData(messages: any[]): any {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const allText = userMessages.join(' ');
  const lastUserMessage = userMessages[userMessages.length - 1] || '';

  const extracted: any = {
    intent: 'buyer',
    stage: 'greeting',
    productType: null,
    quantity: null,
    email: null,
    phone: null,
    name: null,
    customization_level: null,
    budget_range: null,
  };

  // Extract name (usually in first 1-2 messages)
  if (userMessages.length > 0 && !allText.includes('t-shirt') && !allText.includes('hoodie')) {
    const nameMatch = userMessages[0].match(/^([a-z]{2,20})$/i) || userMessages[0].match(/i'?m\s+([a-z]{2,20})/i);
    if (nameMatch) {
      extracted.name = nameMatch[1];
      extracted.stage = 'name_collected';
    }
  }

  // Detect product type
  const productKeywords: Record<string, string[]> = {
    't-shirt': ['t-shirt', 'tshirt', 'tee', 't shirt'],
    'hoodie': ['hoodie', 'sweatshirt', 'pullover'],
    'polo': ['polo', 'polo shirt'],
    'sweater': ['sweater', 'knit', 'pullover sweater'],
  };

  for (const [product, keywords] of Object.entries(productKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      extracted.productType = product;
      extracted.stage = 'product_identified';
      break;
    }
  }

  // Extract quantity
  const quantityMatch = allText.match(/(\d+)\s*(?:pieces|pcs|units)?/) || 
                       allText.match(/(fifty|hundred|thousand|500|1000)/);
  if (quantityMatch) {
    const qtyText = quantityMatch[1].toLowerCase();
    if (qtyText === 'fifty') extracted.quantity = 50;
    else if (qtyText === 'hundred') extracted.quantity = 100;
    else if (qtyText === 'thousand') extracted.quantity = 1000;
    else extracted.quantity = parseInt(quantityMatch[1]);
    
    if (extracted.quantity) extracted.stage = 'quantity_collected';
  }

  // Extract customization level
  if (allText.includes('logo only') || allText.includes('just logo')) {
    extracted.customization_level = 'logo_only';
    extracted.stage = 'customization_collected';
  } else if (allText.includes('custom design') || allText.includes('full custom')) {
    extracted.customization_level = 'full_custom';
    extracted.stage = 'customization_collected';
  } else if (allText.includes('embroid')) {
    extracted.customization_level = 'embroidery';
    extracted.stage = 'customization_collected';
  }

  // Extract email
  const emailMatch = allText.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i);
  if (emailMatch) {
    extracted.email = emailMatch[1];
    extracted.stage = 'email_collected';
  }

  // Extract budget range
  const budgetMatch = allText.match(/\$(\d+)[-\s]?(\d+)?/);
  if (budgetMatch) {
    extracted.budget_range = budgetMatch[0];
  }

  return extracted;
}

// Calculate lead score
function calculateLeadScore(data: any): number {
  let score = 0;
  
  if (data.name) score += 15;
  if (data.email) score += 30;
  if (data.productType) score += 20;
  if (data.quantity) {
    score += 15;
    if (data.quantity >= 500) score += 10;
  }
  if (data.customization_level) score += 10;
  if (data.budget_range) score += 5;
  
  return Math.min(score, 100);
}
