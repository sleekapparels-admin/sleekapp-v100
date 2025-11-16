import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  quickReplies?: QuickReply[];
  extractedData?: any;
  leadScore?: number;
  quote?: QuoteData;
}

export interface QuoteData {
  productType: string;
  quantity: number;
  customization: string;
  unitPrice: number;
  totalPrice: number;
  leadTime: string;
  moq: number;
  insights?: string[];
}

export interface QuickReply {
  text: string;
  value: string;
  action?: string;
}

export const useConversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [generatedQuote, setGeneratedQuote] = useState<QuoteData | null>(null);
  const { toast } = useToast();

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem(`conversation_${sessionId}`);
    if (savedConversation) {
      try {
        const { messages: savedMessages, conversationId: savedId } = JSON.parse(savedConversation);
        setMessages(savedMessages);
        setConversationId(savedId);
      } catch (error) {
        console.error('Failed to restore conversation:', error);
      }
    }
  }, [sessionId]);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `conversation_${sessionId}`,
        JSON.stringify({ messages, conversationId })
      );
    }
  }, [messages, conversationId, sessionId]);

  const sendMessage = useCallback(async (content: string, retryCount = 0) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to database first
      if (conversationId) {
        await supabase.from('conversation_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content,
        });
      }

      // Call AI assistant
      const { data, error } = await supabase.functions.invoke('conversational-assistant', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          sessionId,
          conversationId,
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        role: 'assistant',
        content: data.message || "I'm here to help! What would you like to know?",
        quickReplies: data.quickReplies || [],
        timestamp: Date.now(),
        extractedData: data.extractedData,
        leadScore: data.leadScore,
        quote: data.quote,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If quote was generated, save it
      if (data.quote) {
        setGeneratedQuote(data.quote);
      }
      
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Retry logic (max 3 attempts)
      if (retryCount < 2) {
        toast({
          title: "Retrying...",
          description: "Connection issue detected. Attempting to reconnect...",
        });
        setTimeout(() => sendMessage(content, retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again! 😊",
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId, conversationId, toast]);

  const sendInitialGreeting = useCallback(() => {
    const greeting: Message = {
      role: 'assistant',
      content: "👋 Hi! I'm Loop, your AI assistant. I'm here to help you get instant quotes for custom apparel manufacturing. What would you like to create today?",
      timestamp: Date.now(),
    };
    setMessages([greeting]);
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setGeneratedQuote(null);
    localStorage.removeItem(`conversation_${sessionId}`);
  }, [sessionId]);

  return {
    messages,
    sendMessage,
    isLoading,
    sendInitialGreeting,
    generatedQuote,
    clearConversation,
    conversationId,
  };
};