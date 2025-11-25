import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { celebrateSuccess, triggerHaptic } from '@/lib/microInteractions';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface NewsletterSignupProps {
  variant?: 'default' | 'minimal' | 'hero' | 'footer';
  className?: string;
}

const emailSchema = z.string().email('Please enter a valid email address');

/**
 * NewsletterSignup - Email Capture with Confetti Celebration
 * 
 * Features:
 * - Email validation with Zod
 * - Supabase integration for storage
 * - Confetti animation on success
 * - Haptic feedback
 * - Multiple visual variants
 * - Loading states
 * - Error handling
 * - Already subscribed detection
 */
export const NewsletterSignup = ({
  variant = 'default',
  className,
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      emailSchema.parse(email);

      // Check if already subscribed
      const { data: existing, error: checkError } = await supabase
        .from('newsletter_subscribers' as any)
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existing) {
        setError('You are already subscribed!');
        setIsLoading(false);
        triggerHaptic('warning');
        return;
      }

      // Subscribe to newsletter
      const { error: insertError } = await supabase
        .from('newsletter_subscribers' as any)
        .insert({
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          source: 'website',
          status: 'active',
        });

      if (insertError) {
        throw insertError;
      }

      // Success!
      setIsSuccess(true);
      triggerHaptic('success');
      
      if (buttonRef.current) {
        celebrateSuccess(buttonRef.current);
      }

      toast({
        title: '🎉 Welcome to the family!',
        description: 'You\'re now subscribed to our newsletter.',
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 3000);

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('Something went wrong. Please try again.');
        console.error('Newsletter signup error:', err);
      }
      triggerHaptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Variant styles
  const variants = {
    default: {
      container: 'bg-card border border-border',
      title: 'text-2xl font-bold mb-2',
      description: 'text-muted-foreground mb-6',
      form: 'flex gap-2',
    },
    minimal: {
      container: 'bg-transparent',
      title: 'text-lg font-semibold mb-1',
      description: 'text-sm text-muted-foreground mb-3',
      form: 'flex gap-2',
    },
    hero: {
      container: 'bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20',
      title: 'text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent',
      description: 'text-lg text-muted-foreground mb-6',
      form: 'flex gap-2 max-w-md mx-auto',
    },
    footer: {
      container: 'bg-transparent',
      title: 'text-xl font-bold mb-2 text-white',
      description: 'text-white/80 mb-4',
      form: 'flex gap-2',
    },
  };

  const currentVariant = variants[variant];

  return (
    <Card className={cn('p-6 rounded-lg', currentVariant.container, className)}>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className={currentVariant.title}>
                  Stay Updated
                </h3>
              </div>
            </div>
            
            <p className={currentVariant.description}>
              Get the latest updates on new products, manufacturing tips, and exclusive offers.
            </p>

            <form onSubmit={handleSubmit} className={currentVariant.form}>
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                  className={cn(
                    'h-12',
                    error && 'border-destructive focus-visible:ring-destructive'
                  )}
                  required
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive mt-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                ref={buttonRef}
                type="submit"
                variant="gold"
                size="lg"
                disabled={isLoading || !email}
                className="h-12 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2">
              🎉 You're In!
            </h3>
            
            <p className="text-muted-foreground">
              Check your inbox for a welcome email.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

/**
 * NewsletterInline - Compact inline version for sidebars
 */
export const NewsletterInline = ({ className }: { className?: string }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      emailSchema.parse(email);

      const { error } = await supabase
        .from('newsletter_subscribers' as any)
        .insert({
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          source: 'website_inline',
          status: 'active',
        });

      if (error) throw error;

      setIsSuccess(true);
      triggerHaptic('success');
      
      toast({
        title: '✅ Subscribed!',
        description: 'Welcome to our newsletter.',
      });

      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
      }, 3000);

    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof z.ZodError ? err.errors[0].message : 'Failed to subscribe',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn('flex items-center gap-2 text-green-600', className)}
      >
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">Subscribed!</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="h-9 text-sm"
        required
      />
      <Button
        type="submit"
        size="sm"
        disabled={isLoading || !email}
        className="min-w-[80px]"
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Subscribe'}
      </Button>
    </form>
  );
};
