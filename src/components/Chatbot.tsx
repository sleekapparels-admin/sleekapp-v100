import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { trackBusinessEvent } from "@/lib/analytics";
import factoryFloor from "@/assets/factory-knitting-floor-compressed.webp";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotState {
  step: 'greeting' | 'product_type' | 'quantity' | 'timeline' | 'contact' | 'qualified';
  data: {
    productType?: string;
    quantity?: number;
    timeline?: string;
    name?: string;
    email?: string;
  };
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [state, setState] = useState<ChatbotState>({
    step: 'greeting',
    data: {}
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        addBotMessage(
          "👋 Hi! I'm here to help you get a quote for your apparel manufacturing needs. What type of products are you looking to manufacture?",
          ['Knitwear (T-shirts, Polos)', 'Cut & Sew (Jackets, Pants)', 'Uniforms & Teamwear']
        );
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  const addMessage = (text: string, sender: 'user' | 'bot', suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (text: string, suggestions?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(text, 'bot', suggestions);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleUserMessage(suggestion);
  };

  const handleUserMessage = (message: string) => {
    addMessage(message, 'user');
    processUserMessage(message);
  };

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    switch (state.step) {
      case 'greeting':
        let productType = '';
        if (lowerMessage.includes('knitwear') || lowerMessage.includes('t-shirt') || lowerMessage.includes('polo')) {
          productType = 'knitwear';
        } else if (lowerMessage.includes('cut') || lowerMessage.includes('sew') || lowerMessage.includes('jacket')) {
          productType = 'cut_and_sew';
        } else if (lowerMessage.includes('uniform') || lowerMessage.includes('team')) {
          productType = 'uniforms';
        }
        
        setState(prev => ({ ...prev, step: 'quantity', data: { ...prev.data, productType } }));
        addBotMessage(
          "Great choice! What quantity are you looking to order? Our minimum order quantities start from 50 pieces.",
          ['50-100 pieces', '100-500 pieces', '500-1000 pieces', '1000+ pieces']
        );
        break;
        
      case 'quantity':
        const quantity = extractQuantity(message);
        setState(prev => ({ ...prev, step: 'timeline', data: { ...prev.data, quantity } }));
        addBotMessage(
          "Perfect! When do you need your order completed?",
          ['ASAP (Rush order)', '4-6 weeks', '8-12 weeks', 'Flexible timeline']
        );
        break;
        
      case 'timeline':
        setState(prev => ({ ...prev, step: 'contact', data: { ...prev.data, timeline: message } }));
        addBotMessage(
          "Excellent! I can get you a detailed quote. What's your name and email so I can send you the pricing?"
        );
        break;
        
      case 'contact':
        const email = extractEmail(message);
        const name = extractName(message);
        
        if (email && name) {
          setState(prev => ({ ...prev, step: 'qualified', data: { ...prev.data, name, email } }));
          trackBusinessEvent.quoteRequest(state.data.productType || 'unknown', state.data.quantity || 0);
          
          addBotMessage(
            `Thank you ${name}! I'll have our team prepare a detailed quote for ${state.data.quantity} ${state.data.productType} pieces and email it to ${email} within 2 hours. Would you like to schedule a call to discuss your project in detail?`,
            ['Yes, schedule a call', 'No, email is fine', 'Tell me more about LoopTrace™']
          );
        } else {
          addBotMessage("I need both your name and email address. Could you provide them like this: 'John Smith, john@company.com'?");
        }
        break;
        
      case 'qualified':
        if (lowerMessage.includes('schedule') || lowerMessage.includes('call')) {
          addBotMessage("Perfect! You can book a call at your convenience: [Calendly Link]. Our team will contact you within 2 hours with your quote. Thanks for choosing Sleek Apparels!");
        } else if (lowerMessage.includes('looptrace')) {
          addBotMessage("LoopTrace™ is our proprietary AI production platform that gives you real-time visibility into your order. See exactly when cutting starts, sewing progress, quality checks, and shipping updates. Access is included free for all clients - just register to unlock your dashboard!", ['Tell me more', 'How do I register?', 'Just the quote please']);
        } else {
          addBotMessage("Great! Keep an eye on your inbox for the detailed quote. Feel free to reach out if you have any questions. Have a wonderful day!");
        }
        break;
    }
  };

  const extractQuantity = (message: string): number => {
    const numbers = message.match(/\d+/g);
    if (numbers) {
      const num = parseInt(numbers[0]);
      return num > 50 ? num : 100; // Default to 100 if less than MOQ
    }
    return 100; // Default quantity
  };

  const extractEmail = (message: string): string | null => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = message.match(emailRegex);
    return match ? match[0] : null;
  };

  const extractName = (message: string): string | null => {
    // Simple name extraction - look for words before email or comma
    const parts = message.split(/[,@]/);
    if (parts.length > 0) {
      const nameCandidate = parts[0].trim();
      if (nameCandidate.length > 1 && nameCandidate.length < 50) {
        return nameCandidate;
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button - optimized */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        style={{ willChange: 'transform' }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          aria-label="Open chat for instant quote"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform, opacity' }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="message"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'transform, opacity' }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chatbot Window - optimized */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
            style={{ willChange: 'transform, opacity' }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              {/* Header */}
              <div className="relative bg-primary text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={factoryFloor} 
                    alt="Factory floor" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative p-4 flex items-center gap-3 backdrop-blur-sm bg-primary/80">
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Loop AI</h3>
                    <p className="text-xs opacity-90">Manufacturing Intelligence Assistant</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-2 text-xs bg-background border rounded hover:bg-muted transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 justify-start"
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};