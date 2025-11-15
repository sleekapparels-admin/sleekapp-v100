import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, DollarSign, Sparkles, Mail, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface QuoteData {
  productType: string;
  quantity: number;
  customization: string;
  unitPrice: number;
  totalPrice: number;
  leadTime: string;
  moq: number;
  insights?: string[];
}

interface InChatQuoteDisplayProps {
  quote: QuoteData;
  onProceedToOrder: () => void;
  onEmailQuote: () => void;
  onContinueChat: () => void;
}

export const InChatQuoteDisplay = ({
  quote,
  onProceedToOrder,
  onEmailQuote,
  onContinueChat,
}: InChatQuoteDisplayProps) => {
  useEffect(() => {
    // Celebration confetti when quote appears
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto my-4"
    >
      <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h3 className="text-2xl font-bold">Your Custom Quote is Ready! 🎉</h3>
          </div>
        </div>

        {/* Quote Details */}
        <div className="p-6 space-y-4">
          {/* Product Info */}
          <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
            <Package className="w-6 h-6 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{quote.productType}</h4>
              <p className="text-sm text-muted-foreground">{quote.customization}</p>
              <Badge variant="secondary" className="mt-2">
                Quantity: {quote.quantity} units
              </Badge>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Pricing</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  ${quote.unitPrice.toFixed(2)}/unit
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">${quote.totalPrice.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Lead Time</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">{quote.leadTime}</p>
                <p className="text-sm text-muted-foreground">
                  MOQ: <span className="font-semibold text-foreground">{quote.moq} units</span>
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {quote.insights && quote.insights.length > 0 && (
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20">
              <h5 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Insights
              </h5>
              <ul className="space-y-1 text-sm">
                {quote.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <Button
              onClick={onProceedToOrder}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Proceed with Order
            </Button>
            
            <Button
              onClick={onEmailQuote}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Quote
            </Button>
            
            <Button
              onClick={onContinueChat}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              💬 Continue Chat
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground pt-2">
            This quote is valid for 30 days. Prices may vary based on final specifications.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
