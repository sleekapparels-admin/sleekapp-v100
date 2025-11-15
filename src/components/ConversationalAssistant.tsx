import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversation } from '@/hooks/useConversation';
import { SmartReplyButtons } from '@/components/SmartReplyButtons';
import { ConversationProgressIndicator } from '@/components/ConversationProgressIndicator';
import { InChatQuoteDisplay } from '@/components/InChatQuoteDisplay';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const ConversationalAssistant = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { messages, sendMessage, isLoading, sendInitialGreeting, generatedQuote, conversationId } = useConversation();

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (messages.length === 0) sendInitialGreeting();
  }, [sendInitialGreeting, messages.length]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) sendInitialGreeting();
  }, [messages.length, sendInitialGreeting]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSendMessage = useCallback((content?: string) => {
    const messageToSend = content || inputValue.trim();
    if (!messageToSend) return;
    sendMessage(messageToSend);
    setInputValue('');
  }, [inputValue, sendMessage]);

  const handleQuickReply = useCallback((reply: string | { text: string; value: string; action?: string }) => {
    // Handle action-based quick replies
    if (typeof reply === 'object' && reply.action) {
      if (reply.action === 'redirect_to_quote') {
        // Save all collected data and redirect to quote generator
        const lastMessage = messages[messages.length - 1];
        const extractedData = lastMessage?.extractedData || {};
        
        localStorage.setItem('prefilledQuoteData', JSON.stringify({
          name: extractedData.name,
          email: extractedData.email,
          phone: extractedData.phone,
          productType: extractedData.productType,
          quantity: extractedData.quantity,
          customization: extractedData.customization_level,
          budget: extractedData.budget_range,
          conversationId: conversationId,
        }));
        
        navigate('/quote-generator');
        setIsOpen(false);
        return;
      } else if (reply.action === 'submit_lead') {
        // Send message to trigger lead submission
        handleSendMessage(reply.value);
        return;
      }
    }
    
    // Regular quick reply
    const messageValue = typeof reply === 'string' ? reply : reply.value;
    handleSendMessage(messageValue);
  }, [handleSendMessage, messages, conversationId, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleProceedToOrder = useCallback(() => {
    // Save quote data to localStorage and navigate to quote generator
    if (generatedQuote) {
      localStorage.setItem('prefilledQuote', JSON.stringify({
        ...generatedQuote,
        conversationId,
      }));
    }
    navigate('/quote-generator');
    setIsOpen(false);
  }, [generatedQuote, conversationId, navigate]);

  const handleEmailQuote = useCallback(() => {
    handleSendMessage('Please email me the quote');
  }, [handleSendMessage]);

  const handleContinueChat = useCallback(() => {
    handleSendMessage('I have some questions about the quote');
  }, [handleSendMessage]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 cursor-pointer"
            onClick={handleOpen}
          >
            <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
              <div>
                <span className="font-bold text-sm">Loop AI</span>
                <span className="text-xs block opacity-90">Get instant quotes ✨</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed z-50 bg-background border shadow-2xl",
              "md:bottom-6 md:right-6 md:w-[450px] md:h-[650px] md:rounded-2xl",
              "bottom-0 left-0 right-0 w-full h-[75vh] rounded-t-3xl flex flex-col"
            )}
          >
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Loop AI</h3>
                  <p className="text-xs opacity-90">Your fashion guide</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-primary-foreground hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {messages.length > 1 && messages[messages.length - 1]?.extractedData && (
              <div className="px-4 pt-3 bg-muted/30">
                <ConversationProgressIndicator extractedData={messages[messages.length - 1].extractedData} />
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", message.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                    )}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>

                  {message.quote && index === messages.length - 1 && (
                    <div className="mt-4">
                      <InChatQuoteDisplay
                        quote={message.quote}
                        onProceedToOrder={handleProceedToOrder}
                        onEmailQuote={handleEmailQuote}
                        onContinueChat={handleContinueChat}
                      />
                    </div>
                  )}

                  {message.quickReplies && message.quickReplies.length > 0 && index === messages.length - 1 && !message.quote && (
                    <div className="mt-2">
                      <SmartReplyButtons onSelect={handleQuickReply} replies={message.quickReplies} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isLoading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Powered by GPT-5 Mini</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});