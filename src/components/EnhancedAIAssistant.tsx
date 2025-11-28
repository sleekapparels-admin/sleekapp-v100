import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User as UserIcon, Loader2, Sparkles, DollarSign, Clock, Shield, BookOpen, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  visualContent?: VisualContent;
}

interface QuickReply {
  text: string;
  value: string;
  action?: string;
  icon?: string;
}

interface VisualContent {
  type: 'infographic' | 'photo' | 'photo-carousel' | 'video' | 'chart';
  src?: string;
  sources?: string[];
  alt?: string;
  caption?: string;
}

interface ExtractedData {
  name?: string;
  email?: string;
  productType?: string;
  quantity?: number;
  customization_level?: string;
  stage?: string;
  painPoints?: string[];
  buyerSegment?: 'startup' | 'corporate' | 'sustainable' | 'retail';
}

const PAIN_POINT_QUICK_REPLIES: QuickReply[] = [
  { text: "💰 High minimums & cost", value: "high-moq", icon: "💰" },
  { text: "⏱️ Long timelines", value: "long-timelines", icon: "⏱️" },
  { text: "🔍 Finding trustworthy factories", value: "trust-quality", icon: "🔍" },
  { text: "🌱 Ethical & sustainable production", value: "sustainability", icon: "🌱" },
  { text: "📚 I'm new to this", value: "lack-knowledge", icon: "📚" }
];

const PAIN_POINT_RESPONSES: Record<string, { text: string; visualContent?: VisualContent; followUpQuestions?: QuickReply[] }> = {
  'high-moq': {
    text: "I completely understand! 💰 High minimums are the #1 barrier for small brands.\n\n**Here's how Sleek solves this:**\n\n• **50-piece minimum** (vs. industry 1,000-5,000)\n• **94% less capital** tied up upfront\n• Test market demand before scaling\n• $850 investment vs. $15,000+ traditional\n\n📊 Let me show you a quick comparison...",
    visualContent: {
      type: 'infographic',
      src: '/content/infographics/pain-points/moq-comparison.svg',
      alt: 'MOQ Comparison Chart',
      caption: 'Sleek 50-piece MOQ vs. Traditional 1,000-piece minimum'
    },
    followUpQuestions: [
      { text: "Show me a quote example", value: "quote-example" },
      { text: "How does small MOQ work?", value: "explain-moq" },
      { text: "See customer success stories", value: "success-stories" }
    ]
  },
  'long-timelines': {
    text: "Absolutely! ⏱️ Speed to market can make or break your success.\n\n**Sleek's Timeline:**\n\n• **10-20 days total** (vs. 45-90 industry average)\n• Samples in 3-7 days\n• Production in 12-15 days\n• LoopTrace™ real-time tracking\n\n⚡ That's **3x faster** than traditional sourcing!",
    visualContent: {
      type: 'infographic',
      src: '/content/infographics/pain-points/timeline-comparison.svg',
      alt: 'Timeline Comparison',
      caption: 'Sleek 10-20 days vs. Traditional 45-90 days'
    },
    followUpQuestions: [
      { text: "How is LoopTrace different?", value: "looptrace-explain" },
      { text: "Can you rush production?", value: "rush-production" },
      { text: "Show timeline breakdown", value: "timeline-detail" }
    ]
  },
  'trust-quality': {
    text: "Trust is everything! 🔍 You're right to be careful.\n\n**How we build trust:**\n\n• **LoopTrace™** - Real-time factory photos at every stage\n• **WRAP certified** - Ethical manufacturing verified\n• **AQL 2.5 quality standard** - Industry-leading\n• **Video factory tours** - See before you commit\n• **100% transparency** - No surprises, ever\n\n📸 Take a look at our quality control process...",
    visualContent: {
      type: 'photo-carousel',
      sources: [
        '/content/photos/factory/qc/inspection-1.jpg',
        '/content/photos/factory/qc/inspection-2.jpg',
        '/content/photos/factory/sewing/quality-check.jpg'
      ],
      caption: 'Our quality control stations and inspection process'
    },
    followUpQuestions: [
      { text: "Show me supplier profiles", value: "supplier-profiles" },
      { text: "Explain LoopTrace™", value: "looptrace-demo" },
      { text: "Can I visit the factory?", value: "factory-visit" }
    ]
  },
  'sustainability': {
    text: "Love that you prioritize ethics! 🌱 Sustainability is core to what we do.\n\n**Our Commitments:**\n\n• **WRAP & GOTS certified** factories\n• **25% above minimum wage** guaranteed\n• **Small factory support** - We empower local manufacturers\n• **Fair pricing model** - Suppliers earn 30% more than traditional\n• **Full transparency** - Know exactly where your money goes\n\n🏭 Meet some of our supplier partners...",
    visualContent: {
      type: 'photo-carousel',
      sources: [
        '/content/photos/suppliers/profiles/supplier-1.jpg',
        '/content/photos/suppliers/profiles/supplier-2.jpg',
        '/content/photos/factory/sewing/workers-team.jpg'
      ],
      caption: 'Our ethical manufacturing partners'
    },
    followUpQuestions: [
      { text: "Show certifications", value: "certifications" },
      { text: "Fair wage breakdown", value: "fair-pricing" },
      { text: "Supplier success stories", value: "supplier-stories" }
    ]
  },
  'lack-knowledge': {
    text: "No worries! 📚 60% of our clients are first-timers. We'll guide you every step.\n\n**We'll help you with:**\n\n• **Tech pack creation** - Free for 100+ orders\n• **Fabric selection guide** - Visual comparisons\n• **Quality standards** - What to look for\n• **Manufacturing terms** - Easy glossary\n• **Sample review** - How to check quality\n\n📖 Let's start with the basics...",
    visualContent: {
      type: 'infographic',
      src: '/content/infographics/education/manufacturing-101.svg',
      alt: 'Manufacturing Process Guide',
      caption: 'Your apparel manufacturing journey, step-by-step'
    },
    followUpQuestions: [
      { text: "What is a tech pack?", value: "tech-pack-explain" },
      { text: "How do I choose fabric?", value: "fabric-guide" },
      { text: "Walk me through the process", value: "process-walkthrough" }
    ]
  }
};

export const EnhancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [leadScore, setLeadScore] = useState(0);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showPainPointSelector, setShowPainPointSelector] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation with pain point detection
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: "Hey there! 👋 I'm Loop AI, your manufacturing guide at Sleek Apparels.\n\nI notice you're exploring custom apparel manufacturing. **What's your biggest concern right now?**\n\nI'm here to show you how we solve these exact challenges for small-batch buyers like you!",
        timestamp: new Date(),
        quickReplies: PAIN_POINT_QUICK_REPLIES
      };
      setMessages([welcomeMessage]);
      setQuickReplies(PAIN_POINT_QUICK_REPLIES);
      setShowPainPointSelector(true);
    }
  }, [isOpen]);

  const handlePainPointSelection = (painPointId: string) => {
    // User selected a pain point
    const painPointReply = PAIN_POINT_QUICK_REPLIES.find(r => r.value === painPointId);
    if (!painPointReply) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: painPointReply.text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Get pain point response
    const response = PAIN_POINT_RESPONSES[painPointId];
    if (response) {
      setIsTyping(true);
      setShowPainPointSelector(false);
      
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.text,
          timestamp: new Date(),
          quickReplies: response.followUpQuestions,
          visualContent: response.visualContent
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setQuickReplies(response.followUpQuestions || []);
        setExtractedData(prev => ({
          ...prev,
          painPoints: [...(prev.painPoints || []), painPointId],
          stage: 'pain_point_identified'
        }));
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setQuickReplies([]);
    setIsTyping(true);

    try {
      // Build message history for AI context
      const messageHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Include pain point context
      const contextualHistory = [
        {
          role: 'system',
          content: `User pain points identified: ${(extractedData.painPoints || []).join(', ')}. Tailor responses to address these concerns with visual content when possible.`
        },
        ...messageHistory
      ];

      // Call the conversational assistant
      const { data, error } = await supabase.functions.invoke('conversational-assistant', {
        body: {
          messages: contextualHistory,
          sessionId,
          conversationId,
          painPoints: extractedData.painPoints
        }
      });

      if (error) {
        console.error('AI Assistant error:', error);
        throw error;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        quickReplies: data.quickReplies || []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuickReplies(data.quickReplies || []);
      setExtractedData(data.extractedData || {});
      setLeadScore(data.leadScore || 0);
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! I'm having trouble connecting right now 😅\n\nBut don't worry - you can still reach our team:\n📧 Email: support@sleekapparels.com\n💬 WhatsApp: +880-1711-071684",
        timestamp: new Date(),
        quickReplies: [
          { text: "🔄 Try Again", value: message },
          { text: "📧 Email Team", value: "contact_team" }
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setQuickReplies(errorMessage.quickReplies ?? []);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    // Check if it's a pain point selection
    if (PAIN_POINT_QUICK_REPLIES.some(r => r.value === reply.value)) {
      handlePainPointSelection(reply.value);
      return;
    }

    if (reply.action === 'redirect_to_quote') {
      const quoteData = {
        productType: extractedData.productType,
        quantity: extractedData.quantity,
        customization: extractedData.customization_level,
      };
      sessionStorage.setItem('quote_prefill', JSON.stringify(quoteData));
      window.location.href = '/instant-quote';
      return;
    }

    handleSendMessage(reply.value);
  };

  const formatMessageContent = (content: string) => {
    const formatted = content
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return `<li key=${i} class="ml-4 mb-1">${line.substring(1).trim()}</li>`;
        }
        
        if (/^[🎯📧💬🚀💪🏷️🎨🌈🧵💵💰💎🤷✅❌👕🧥👔🧶📊📸🏭⚡]/.test(line.trim())) {
          return `<li key=${i} class="ml-4 mb-2 font-medium">${line}</li>`;
        }
        
        return line ? `<p key=${i} class="mb-2">${line}</p>` : '<br />';
      })
      .join('');

    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'li', 'h3', 'span'],
      ALLOWED_ATTR: ['class', 'key']
    });
  };

  const getProgressSteps = () => {
    const stages = ['greeting', 'pain_point_identified', 'name_collected', 'product_identified', 'quantity_collected', 'email_collected'];
    const currentStageIndex = stages.indexOf(extractedData.stage || 'greeting');
    return {
      current: currentStageIndex + 1,
      total: stages.length,
      percentage: ((currentStageIndex + 1) / stages.length) * 100
    };
  };

  const progress = getProgressSteps();

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-r from-primary via-purple-600 to-accent relative overflow-hidden group"
            size="icon"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
            
            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white text-xs font-bold px-2 py-1 shadow-lg">
              AI
            </Badge>
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="fixed bottom-6 right-6 w-[420px] h-[650px] shadow-2xl z-50 flex flex-col border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary via-purple-600 to-accent text-white p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <Bot className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-lg">
                        Loop AI
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      </h3>
                      <p className="text-xs text-white/90">Pain Point-Solving Assistant</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress indicator */}
                {extractedData.stage && extractedData.stage !== 'greeting' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80">Understanding your needs</span>
                      <span className="font-semibold">{progress.current}/{progress.total}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className="bg-white h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Lead score badge */}
                {leadScore > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {leadScore >= 70 ? '🔥 Hot Lead' : leadScore >= 40 ? '⚡ Warm Lead' : '👋 New Lead'}
                    </span>
                  </div>
                )}
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 max-w-[85%]">
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3 shadow-sm',
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-primary to-purple-600 text-white'
                              : 'bg-white border border-slate-200'
                          )}
                        >
                          <div 
                            className={cn(
                              'text-sm leading-relaxed',
                              message.role === 'user' ? 'text-white' : 'text-slate-700'
                            )}
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessageContent(message.content) 
                            }}
                          />
                          <p className={cn(
                            'text-xs mt-2',
                            message.role === 'user' ? 'text-white/70' : 'text-slate-400'
                          )}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* Visual Content */}
                        {message.visualContent && (
                          <div className="bg-white border-2 border-primary/20 rounded-lg p-2">
                            {message.visualContent.type === 'infographic' && message.visualContent.src && (
                              <div className="space-y-2">
                                <img 
                                  src={message.visualContent.src} 
                                  alt={message.visualContent.alt}
                                  className="w-full rounded"
                                />
                                {message.visualContent.caption && (
                                  <p className="text-xs text-center text-muted-foreground">
                                    {message.visualContent.caption}
                                  </p>
                                )}
                              </div>
                            )}
                            {message.visualContent.type === 'photo-carousel' && message.visualContent.sources && (
                              <div className="space-y-2">
                                <div className="flex gap-2 overflow-x-auto">
                                  {message.visualContent?.sources?.map((src, idx) => (
                                    <img 
                                      key={idx}
                                      src={src} 
                                      alt={message.visualContent?.alt ? `${message.visualContent.alt} ${idx + 1}` : `Image ${idx + 1}`}
                                      className="h-32 rounded flex-shrink-0"
                                    />
                                  ))}
                                </div>
                                {message.visualContent.caption && (
                                  <p className="text-xs text-center text-muted-foreground">
                                    {message.visualContent.caption}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 rounded-full bg-purple-600"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 rounded-full bg-accent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {quickReplies.length > 0 && !isTyping && (
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
                  <p className="text-xs font-medium text-slate-600 mb-2">Quick replies:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs h-8 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all"
                        >
                          {reply.text}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-200 bg-white">
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
                    placeholder="Type your message..."
                    className="flex-1 border-2 border-slate-200 focus:border-primary rounded-full"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 rounded-full h-10 w-10 flex-shrink-0"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Powered by AI • Pain Point-Focused • Visual Responses
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
