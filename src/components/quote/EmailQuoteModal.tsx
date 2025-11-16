import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: {
    quoteId: string;
    productType: string;
    quantity: number;
    totalPrice: number;
    unitPrice: number;
    timeline: number;
    customerName: string;
    customerEmail: string;
    country: string;
    fabricType?: string;
    complexityLevel: string;
    additionalRequirements?: string;
  };
}

export const EmailQuoteModal = ({ open, onOpenChange, quoteData }: EmailQuoteModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: quoteData.customerName,
    email: quoteData.customerEmail,
    company: "",
    phone: "",
    wantSwatchKit: false,
    subscribeNewsletter: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone format if provided
    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('email-service', {
        body: {
          type: 'quote',
          data: {
            ...formData,
            quote: quoteData,
          }
        }
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Quote Sent! ✅",
        description: "Check your email in 2-3 minutes. We'll also reach out within 24 hours.",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error sending quote:', error);
      toast({
        title: "Failed to send quote",
        description: error instanceof Error ? error.message : "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Quote Sent Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Check your email for the detailed quote.
                <br />
                Our team will contact you within 24 hours.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Get This Quote in Your Inbox
          </DialogTitle>
          <DialogDescription>
            We'll send you a detailed PDF quote and follow up within 24 hours
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pre-filled Quote Summary */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold">Quote Summary (Read-only)</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Product: {quoteData.productType}</p>
              <p>• Quantity: {quoteData.quantity} pieces</p>
              <p>• Total: ${quoteData.totalPrice.toFixed(2)} (${quoteData.unitPrice.toFixed(2)}/pc)</p>
              <p>• Timeline: {quoteData.timeline} days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name (Optional)</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company or brand name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              disabled={loading}
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="swatch"
                checked={formData.wantSwatchKit}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, wantSwatchKit: checked as boolean })
                }
                disabled={loading}
              />
              <div className="space-y-1">
                <Label htmlFor="swatch" className="text-sm font-medium cursor-pointer">
                  Send me a fabric swatch kit (Free, first kit)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get physical samples of our materials
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="newsletter"
                checked={formData.subscribeNewsletter}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, subscribeNewsletter: checked as boolean })
                }
                disabled={loading}
              />
              <div className="space-y-1">
                <Label htmlFor="newsletter" className="text-sm font-medium cursor-pointer">
                  Subscribe to manufacturing tips newsletter
                </Label>
                <p className="text-xs text-muted-foreground">
                  Monthly insights on apparel production
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Quote...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Email My Quote
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to receive quotes and updates. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
