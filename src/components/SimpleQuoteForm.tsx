import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const simpleQuoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  productType: z.string().min(1, "Please select a product type"),
  quantity: z.number().min(50, "Minimum quantity is 50 pieces"),
});

export default function SimpleQuoteForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    productType: '', 
    quantity: 100,
    message: '',
    customization: '',
    timeline: 'standard'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Check for prefilled data from instant calculator
  useEffect(() => {
    const prefillData = sessionStorage.getItem('quote_prefill');
    if (prefillData) {
      try {
        const data = JSON.parse(prefillData);
        setFormData(prev => ({
          ...prev,
          productType: data.productType || prev.productType,
          quantity: data.quantity || prev.quantity,
          customization: data.customization || prev.customization,
          timeline: data.timeline || prev.timeline,
        }));
        sessionStorage.removeItem('quote_prefill'); // Clear after use
      } catch (e) {
        console.error('Failed to parse prefill data');
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      // Validate form data
      simpleQuoteSchema.parse(formData);
      setErrors({});
      setLoading(true);
      
      // Get or create session ID for anonymous users
      let sessionId = localStorage.getItem('quote_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('quote_session_id', sessionId);
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      // Prepare detailed notes
      const detailedNotes = `
Product Type: ${formData.productType}
Quantity: ${formData.quantity} pieces
Customization: ${formData.customization || 'None specified'}
Timeline: ${formData.timeline}
${formData.message ? `\nAdditional Details: ${formData.message}` : ''}
      `.trim();

      // Use the edge function for consistency
      const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          productType: formData.productType,
          quantity: formData.quantity,
          notes: detailedNotes,
          sessionId
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      // Store session ID for tracking
      if (data?.sessionId) {
        localStorage.setItem('quote_session_id', data.sessionId);
      }

      setSubmitted(true);
      toast({
        title: "Quote Request Submitted! 🎉",
        description: "We'll send you a detailed quote within 2-4 hours.",
      });
      
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        productType: '', 
        quantity: 100, 
        message: '',
        customization: '',
        timeline: 'standard'
      });
      setStep(1);
      
      // Reset after 5s
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Please fix the errors",
          description: "Check the highlighted fields",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit your request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep = (targetStep: number) => {
    if (targetStep === 2) {
      return formData.productType && formData.quantity >= 50;
    }
    if (targetStep === 3) {
      return formData.name.length >= 2 && formData.email.includes('@');
    }
    return true;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              s === step
                ? 'bg-primary text-primary-foreground scale-110'
                : s < step
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
          </div>
          {s < 4 && (
            <div
              className={`h-1 w-8 md:w-16 transition-all ${
                s < step ? 'bg-green-500' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
            <p className="text-muted-foreground mb-6">
              We've received your quote request and will send you a detailed quotation within 2-4 hours.
            </p>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium mb-2">What happens next?</p>
              <ul className="text-sm text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Our team reviews your requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>We match you with qualified suppliers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>You receive a detailed quote via email</span>
                </li>
              </ul>
            </div>
            <Button onClick={() => setSubmitted(false)}>
              Submit Another Quote
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Custom Quote</h2>
          <p className="text-muted-foreground text-lg">
            4 simple steps • 2-4 hour response time
          </p>
        </div>

        {renderStepIndicator()}
        
        <Card className="p-6 md:p-8">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What would you like to make?</h3>
                <p className="text-sm text-muted-foreground">Choose your product type and quantity</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-type">Product Type *</Label>
                <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                  <SelectTrigger id="product-type">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t-shirt">T-Shirts</SelectItem>
                    <SelectItem value="polo">Polo Shirts</SelectItem>
                    <SelectItem value="hoodie">Hoodies</SelectItem>
                    <SelectItem value="sweatshirt">Sweatshirts</SelectItem>
                    <SelectItem value="tank-top">Tank Tops</SelectItem>
                    <SelectItem value="long-sleeve">Long Sleeve Shirts</SelectItem>
                    <SelectItem value="jacket">Jackets</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="uniform">Uniforms</SelectItem>
                    <SelectItem value="scrubs">Medical Scrubs</SelectItem>
                    <SelectItem value="jersey">Sports Jerseys</SelectItem>
                    <SelectItem value="other">Other (Specify in details)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.productType && <p className="text-sm text-destructive">{errors.productType}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Quantity *</Label>
                  <Badge variant="secondary" className="text-base font-semibold">
                    {formData.quantity} pieces
                  </Badge>
                </div>
                <Slider
                  value={[formData.quantity]}
                  onValueChange={(values) => setFormData({ ...formData, quantity: values[0] })}
                  min={50}
                  max={5000}
                  step={50}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50 (Min)</span>
                  <span>1,000</span>
                  <span>5,000+</span>
                </div>
                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="w-full h-12 text-base"
                disabled={!canProceedToStep(2)}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Customization & Timeline */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Customization Details</h3>
                <p className="text-sm text-muted-foreground">Optional - Skip if you're not sure yet</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customization">Customization Type</Label>
                <Select value={formData.customization} onValueChange={(value) => setFormData({ ...formData, customization: value })}>
                  <SelectTrigger id="customization">
                    <SelectValue placeholder="Select customization (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Customization</SelectItem>
                    <SelectItem value="screen-print">Screen Printing</SelectItem>
                    <SelectItem value="embroidery">Embroidery</SelectItem>
                    <SelectItem value="dtg">Direct-to-Garment Print</SelectItem>
                    <SelectItem value="sublimation">Sublimation</SelectItem>
                    <SelectItem value="heat-transfer">Heat Transfer</SelectItem>
                    <SelectItem value="not-sure">Not Sure Yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Production Timeline</Label>
                <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
                  <SelectTrigger id="timeline">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (15-20 days)</SelectItem>
                    <SelectItem value="fast">Fast (12-15 days)</SelectItem>
                    <SelectItem value="rush">Rush (10-12 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">How can we reach you?</h3>
                <p className="text-sm text-muted-foreground">We'll send your quote to this email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name"
                  maxLength={100}
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  placeholder="John Doe"
                  className="h-12"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email"
                  maxLength={255}
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  required 
                  placeholder="john@company.com"
                  className="h-12"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  className="flex-1"
                  disabled={!canProceedToStep(3)}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Additional Details & Submit */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Any additional details?</h3>
                <p className="text-sm text-muted-foreground">Optional - Help us understand your needs better</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea 
                  id="message"
                  maxLength={500}
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  placeholder="Tell us about colors, sizes, design preferences, deadlines, or any special requirements..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold mb-3">Quote Summary</p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Product:</span> <span className="font-medium">{formData.productType}</span></p>
                  <p><span className="text-muted-foreground">Quantity:</span> <span className="font-medium">{formData.quantity} pieces</span></p>
                  <p><span className="text-muted-foreground">Timeline:</span> <span className="font-medium">{formData.timeline}</span></p>
                  {formData.customization && <p><span className="text-muted-foreground">Customization:</span> <span className="font-medium">{formData.customization}</span></p>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-accent"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quote Request
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to receive a quote via email. No spam, ever.
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
