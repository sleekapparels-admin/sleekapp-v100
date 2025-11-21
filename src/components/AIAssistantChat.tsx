import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickQuestion {
  question: string;
  category: 'pricing' | 'moq' | 'timeline' | 'looptrace' | 'general';
}

const quickQuestions: QuickQuestion[] = [
  { question: "What's your minimum order quantity?", category: 'moq' },
  { question: "How long does production take?", category: 'timeline' },
  { question: "What is LoopTrace™?", category: 'looptrace' },
  { question: "How much do custom t-shirts cost?", category: 'pricing' },
  { question: "What product types do you offer?", category: 'general' },
];

// Knowledge base with answers (in production, this would come from RAG pipeline)
const knowledgeBase: Record<string, string> = {
  moq: "Our minimum order quantity (MOQ) is just **50 pieces** for all product types! This is significantly lower than the industry standard of 500-5,000 pieces. Whether you need t-shirts, hoodies, uniforms, or custom apparel, we can accommodate orders starting at 50 units. This makes us perfect for:\n\n• Small businesses and startups\n• Fashion brands testing new designs\n• Educational institutions\n• Corporate events\n• Boutique retailers\n\nWould you like to get a quote for your order?",
  
  timeline: "Our **typical production timeline is 10-20 days** from order confirmation to delivery! This is 2-3x faster than the industry standard of 45-90 days.\n\nHere's the breakdown:\n• Pre-production (sampling & approval): 2-3 days\n• Production: 7-12 days\n• Quality check: 1-2 days\n• Packaging & shipping prep: 1-2 days\n\nWe also offer **Rush Production** (10-14 days) for urgent orders. Every step is tracked in real-time with our LoopTrace™ technology, so you always know exactly where your order is!\n\nNeed something faster? Let me know your deadline!",
  
  looptrace: "**LoopTrace™** is our revolutionary AI-powered production tracking system - think of it as a \"live GPS\" for your manufacturing order!\n\n✨ **What makes it special:**\n• **Real-time photo & video updates** at every production stage\n• **AI predictions** for potential delays before they happen\n• **8-stage tracking**: From fabric sourcing to final delivery\n• **24/7 visibility** - check your order anytime, anywhere\n• **Automatic alerts** when milestones are reached\n\n📸 **You'll see:**\n1. Fabric Sourcing & Inspection\n2. Cutting Stage\n3. Sewing Progress\n4. Quality Control Checks\n5. Finishing & Washing\n6. Final Inspection\n7. Packaging\n8. Shipping\n\nNo more wondering \"where's my order?\" - you'll have full transparency from yarn to finished garment!\n\nWant to see it in action? Sign up and place your first order!",
  
  pricing: "Great question! Our pricing is **highly competitive** thanks to our direct relationships with Bangladesh manufacturers.\n\n**Example Pricing (per piece, 100+ units):**\n• Basic T-shirts: $4-7\n• Polo Shirts: $8-12\n• Hoodies: $12-18\n• Uniforms: $10-15\n• Custom designs: +$1-3 per piece\n\n💡 **Pricing factors:**\n• Quantity (bulk discounts available)\n• Fabric type (cotton, polyester, blends)\n• Customization (embroidery, screen print, etc.)\n• Rush production (+15-20% premium)\n\n**Want an exact quote?** I can connect you with our quote system that gives you an instant preliminary estimate in 30 seconds! Just let me know:\n1. Product type (t-shirts, hoodies, etc.)\n2. Quantity\n3. Any customization needs\n\nReady to get your quote?",
  
  products: "We manufacture a **wide range of apparel products** through our network of verified Bangladesh suppliers:\n\n**👕 Everyday Wear:**\n• T-shirts (crew neck, V-neck, polo)\n• Hoodies & Sweatshirts\n• Tank tops & Activewear\n• Casual shirts\n\n**🎓 Uniforms & Corporate:**\n• School uniforms\n• Corporate workwear\n• Sports team uniforms\n• Healthcare scrubs\n• Security & service uniforms\n\n**👔 Specialty Items:**\n• Custom jerseys\n• Promotional apparel\n• Fashion collections\n• Private label clothing\n\n**🧵 Customization Options:**\n• Screen printing\n• Embroidery\n• Digital printing (DTG)\n• Sublimation\n• Heat transfer\n\nAll products start at our low **50-piece MOQ**! What type of product are you interested in?",
  
  quality: "Quality is our **#1 priority**! Here's how we ensure exceptional standards:\n\n**🏭 Certified Manufacturers:**\n• ISO 9001 certified facilities\n• WRAP (Worldwide Responsible Accredited Production) compliant\n• GOTS (Global Organic Textile Standard) available\n• Fair Trade certified options\n\n**✅ Quality Control Process:**\n1. **Pre-production samples** - Approve before bulk production\n2. **In-process QC** - Inspections at every stage (tracked via LoopTrace™)\n3. **Final inspection** - 100% quality check before shipping\n4. **Third-party QC** - Optional independent inspection available\n\n**📊 Our Track Record:**\n• 98.5% on-time delivery rate\n• <2% defect rate (industry avg: 5-10%)\n• 4.8/5 average buyer satisfaction\n\n**🛡️ Quality Guarantee:**\nIf any defects are found, we'll remake the items at no extra cost. Your satisfaction is guaranteed!\n\nHave specific quality requirements? Let me know!",
  
  contact: "I'd be happy to connect you with our team! Here are the best ways to reach us:\n\n**📧 Email:**\nsupport@sleekapparels.com (General inquiries)\nsales@sleekapparels.com (Quote requests)\n\n**💬 Live Support:**\nChat with me here anytime, or register for direct access to your account manager\n\n**🚀 Fastest Way:**\n1. Sign up for free (takes 2 minutes)\n2. Submit a quote request (instant preliminary estimate)\n3. Our team responds within 2-4 hours with detailed quote\n\n**📱 WhatsApp:**\n+880-XXX-XXXXX (Coming soon!)\n\n**⏰ Response Times:**\n• Chat inquiries: Instant (during business hours)\n• Email quotes: 2-4 hours\n• Complex questions: Within 24 hours\n\nWhat would you like help with? I can assist you right now!",
  
  shipping: "We offer **flexible shipping options** to over 15 countries worldwide!\n\n**🌍 Shipping Methods:**\n• **Air Freight** (7-10 days) - Recommended for most orders\n• **Sea Freight** (30-45 days) - Cost-effective for bulk orders\n• **Express Courier** (3-5 days) - DHL/FedEx for urgent orders\n\n**📦 Shipping Costs:**\n• Calculated based on: Weight, destination, method\n• Typical air freight: $3-5 per kg\n• We provide exact quotes before order confirmation\n\n**🚚 Tracking:**\n• Full tracking number provided\n• LoopTrace™ continues tracking through delivery\n• Real-time updates on shipping status\n\n**🌎 Countries We Ship To:**\nUSA, Canada, UK, Australia, Germany, France, Spain, Italy, UAE, Saudi Arabia, and more!\n\n**🛃 Customs & Duties:**\n• All documents prepared by us\n• HS codes provided\n• You're responsible for import duties (varies by country)\n\nNeed a shipping estimate for your order? Let me know your location and order details!",
};

// Simple AI response generator (in production, this would use GPT-4 + RAG)
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Intent classification (simple keyword matching)
  if (lowerMessage.includes('moq') || lowerMessage.includes('minimum') || lowerMessage.includes('minimum order')) {
    return knowledgeBase.moq;
  }
  
  if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('production time') || lowerMessage.includes('delivery')) {
    return knowledgeBase.timeline;
  }
  
  if (lowerMessage.includes('looptrace') || lowerMessage.includes('track') || lowerMessage.includes('tracking')) {
    return knowledgeBase.looptrace;
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pricing')) {
    return knowledgeBase.pricing;
  }
  
  if (lowerMessage.includes('product') || lowerMessage.includes('what do you make') || lowerMessage.includes('what can you') || lowerMessage.includes('types')) {
    return knowledgeBase.products;
  }
  
  if (lowerMessage.includes('quality') || lowerMessage.includes('certification') || lowerMessage.includes('defect')) {
    return knowledgeBase.quality;
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('talk to')) {
    return knowledgeBase.contact;
  }
  
  if (lowerMessage.includes('shipping') || lowerMessage.includes('deliver') || lowerMessage.includes('freight')) {
    return knowledgeBase.shipping;
  }
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return "Hello! 👋 I'm Sleek AI, your apparel manufacturing assistant. I can help you with:\n\n• Instant price quotes\n• MOQ and timeline questions\n• LoopTrace™ tracking system\n• Product capabilities\n• Quality standards\n• Shipping information\n\nWhat would you like to know?";
  }
  
  // Quote request
  if (lowerMessage.includes('quote') || lowerMessage.includes('get started') || lowerMessage.includes('place order')) {
    return "Great! I'd love to help you get a quote. 🎯\n\nFor the fastest service, I can redirect you to our **Instant Quote Calculator** where you'll get a preliminary estimate in 30 seconds!\n\nOr, I can help you here. Just tell me:\n1. What product type? (t-shirts, hoodies, uniforms, etc.)\n2. How many pieces?\n3. Any special customization?\n\nWhat works best for you?";
  }
  
  // Default response
  return "Thanks for your question! While I'm still learning, I might not have the perfect answer yet. 😅\n\nHere's what I **can** help with:\n• Pricing & quotes\n• MOQ (minimum 50 pieces!)\n• Production timelines (10-20 days)\n• LoopTrace™ tracking system\n• Product types & capabilities\n• Quality & certifications\n• Shipping information\n\nCould you rephrase your question, or would you like to speak with our team directly? I can connect you!";
};

export const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm Sleek AI, your apparel manufacturing assistant!\n\nI can instantly help you with:\n• Quick quotes & pricing\n• MOQ & timeline questions  \n• LoopTrace™ tracking info\n• Product capabilities\n\nWhat can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time (300-800ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    // Generate AI response
    const aiResponse = generateAIResponse(message);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return `<li key=${i} class="ml-4">${line.substring(1)}</li>`;
        }
        
        // Headers (lines starting with ##)
        if (line.trim().startsWith('##')) {
          return `<h3 key=${i} class="font-semibold mt-2 mb-1">${line.replace('##', '').trim()}</h3>`;
        }
        
        return line ? `<p key=${i} class="mb-2">${line}</p>` : '<br />';
      })
      .join('');
  };

  return (
    <>
      {/* Chat Button - Fixed bottom right */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 bg-gradient-to-r from-primary to-accent"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
            AI
          </span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl z-50 flex flex-col border-2 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Sleek AI Assistant
                  <Sparkles className="h-4 w-4" />
                </h3>
                <p className="text-xs text-white/80">Usually replies instantly</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border'
                  }`}
                >
                  <div 
                    className="text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(message.content) 
                    }}
                  />
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="h-5 w-5 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-background border border-border rounded-2xl px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (show only at start) */}
          {messages.length <= 2 && (
            <div className="p-3 border-t border-border bg-background/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(q.question)}
                    className="text-xs h-7 rounded-full"
                  >
                    {q.question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by Sleek AI • Instant responses
            </p>
          </div>
        </Card>
      )}
    </>
  );
};
