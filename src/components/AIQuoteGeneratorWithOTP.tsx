import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Clock, DollarSign, Calendar, TrendingDown, Lightbulb, Upload, X, FileText, Image as ImageIcon, Mail, Shield } from "lucide-react";
import { generateAIQuote } from "@/lib/api/aiQuote";
import { supabase } from "@/integrations/supabase/client";
import { SmartFactoryMatcher } from "@/components/quote/SmartFactoryMatcher";
import { CurrencyDisplay } from "@/components/quote/CurrencyDisplay";
import { COUNTRIES } from "@/lib/countries";
import { NaturalLanguageQuoteInput } from "@/components/quote/NaturalLanguageQuoteInput";
import { QuoteLoadingStages } from "@/components/quote/QuoteLoadingStages";
import { QuoteSkeleton } from "@/components/quote/QuoteSkeleton";
import { PriceComparison } from "@/components/quote/PriceComparison";
import { SmartRecommendations } from "@/components/quote/SmartRecommendations";
import { EmailQuoteModal } from "@/components/quote/EmailQuoteModal";
import confetti from "canvas-confetti";

// Validation schema
const quoteFormSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  quantity: z.number().int().min(50, "Minimum quantity is 50 pieces").max(100000, "Maximum quantity is 100,000 pieces"),
  complexityLevel: z.enum(['simple', 'medium', 'complex']).optional(),
  fabricType: z.string().max(100, "Fabric type too long").optional(),
  additionalRequirements: z.string().max(2000, "Requirements too long (max 2000 characters)").optional(),
  customerName: z.string().trim().max(100, "Name too long"),
  customerEmail: z.string().email("Valid email is required").min(1, "Email is required").max(255, "Email too long"),
  country: z.string().min(1, "Country is required"),
});

interface QuoteResult {
  quote: {
    id: string;
    total_price: number;
    estimated_delivery_days: number;
    quote_data: any;
    ai_suggestions: string;
  };
  timeline: Array<{
    stage: string;
    days: number;
    startDate: string;
    endDate: string;
  }>;
  aiInsights: string;
}

export const AIQuoteGeneratorWithOTP = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [step, setStep] = useState<'form' | 'otp' | 'loading' | 'result'>('form');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    productType: "",
    quantity: "",
    complexityLevel: "medium",
    fabricType: "",
    additionalRequirements: "",
    customerName: "",
    customerEmail: "",
    country: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Pre-fill form data from conversational assistant
  useEffect(() => {
    // Check both old and new localStorage keys for backward compatibility
    const prefilledData = localStorage.getItem('prefilledQuoteData') || localStorage.getItem('prefilledQuote');
    if (prefilledData) {
      try {
        const quote = JSON.parse(prefilledData);
        setFormData(prev => ({
          ...prev,
          customerName: quote.name || '',
          customerEmail: quote.email || '',
          productType: quote.productType || '',
          quantity: quote.quantity?.toString() || '',
          additionalRequirements: quote.customization || '',
          fabricType: quote.fabric || '',
          complexityLevel: quote.complexityLevel || 'medium',
        }));
        
        // Show toast to inform user
        toast({
          title: "Welcome back! 👋",
          description: "We've pre-filled your details from Loop AI. Feel free to adjust anything!",
        });
        
        // Clear both possible localStorage keys
        localStorage.removeItem('prefilledQuoteData');
        localStorage.removeItem('prefilledQuote');
      } catch (error) {
        console.error('Error parsing prefilled data:', error);
      }
    }
  }, [toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isUnder20MB = file.size <= 20 * 1024 * 1024;
      return (isImage || isPDF) && isUnder20MB;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Only images and PDFs under 20MB are accepted",
        variant: "destructive"
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 3));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleParsedData = (parsed: any) => {
    setFormData(prev => ({
      ...prev,
      productType: parsed.productType || prev.productType,
      quantity: parsed.quantity || prev.quantity,
      fabricType: parsed.fabricType || prev.fabricType,
      complexityLevel: parsed.complexityLevel || prev.complexityLevel,
      additionalRequirements: parsed.additionalRequirements || prev.additionalRequirements,
    }));
  };

  const handleRecalculate = (updates: {
    quantity?: number;
    material?: string;
    complexityLevel?: string;
  }) => {
    // Update form data with new values
    setFormData(prev => ({
      ...prev,
      quantity: updates.quantity?.toString() || prev.quantity,
      fabricType: updates.material || prev.fabricType,
      complexityLevel: updates.complexityLevel || prev.complexityLevel,
    }));

    // Reset to form to allow re-generation
    setStep('form');
    setQuoteResult(null);
    setOtp('');
    setShowSkeleton(false);

    toast({
      title: "Quote Updated",
      description: "Please review the changes and generate a new quote",
    });

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const validated = quoteFormSchema.parse({
        ...formData,
        quantity: parseInt(formData.quantity),
        complexityLevel: formData.complexityLevel || 'medium',
        fabricType: formData.fabricType || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
      });

      // Store country and phone for lead tracking
      const phoneNumber = ""; // You can add phone input to form if needed
      
      // Send OTP
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          type: 'email-quote',
          email: validated.customerEmail,
          country: validated.country,
        }
      });

      if (error) throw error;
      
      if (data?.debug_otp) {
        toast({
          title: "OTP Sent (Debug Mode)",
          description: `Your OTP is: ${data.debug_otp}`,
          duration: 10000,
        });
      } else {
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        });
      }

      setStep('otp');
    } catch (error) {
      console.error('Error:', error);
      
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to send OTP',
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code sent to your email",
        variant: "destructive"
      });
      return;
    }

    setOtpLoading(true);

    try {
      // Verify OTP
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: {
          type: 'email-quote',
          email: formData.customerEmail,
          otp: otp
        }
      });

      if (verifyError || !verifyData?.verified) {
        throw new Error(verifyData?.error || 'Invalid OTP');
      }

      toast({
        title: "Email Verified!",
        description: "Generating your quote...",
      });

      // Show loading stages
      setStep('loading');

      // Generate quote
      const validated = {
        productType: formData.productType,
        quantity: parseInt(formData.quantity),
        complexityLevel: formData.complexityLevel as 'simple' | 'medium' | 'complex',
        fabricType: formData.fabricType || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
        customerEmail: formData.customerEmail,
        customerName: formData.customerName || undefined,
      };

      // Convert files to base64
      const fileData = await Promise.all(
        uploadedFiles.map(async (file) => {
          return new Promise<{ name: string; type: string; data: string }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                type: file.type,
                data: reader.result as string
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const result = await generateAIQuote({
        ...validated,
        files: fileData.length > 0 ? fileData : undefined,
      });

      setQuoteResult(result);
      
      // Show skeleton briefly before final result
      setShowSkeleton(true);
      setTimeout(() => {
        setShowSkeleton(false);
        setStep('result');
        
        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899']
        });
        
        toast({
          title: "Quote Generated!",
          description: `Your instant quote for ${validated.quantity} units is ready`,
        });
      }, 1000);

    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // Show friendly error with options
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate quote';
      
      toast({
        title: "Quote Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Return to form on error
      setStep('form');
    } finally {
      setOtpLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Verify Your Email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit code to {formData.customerEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
              />
            </div>
            
            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify & Generate Quote
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep('form')}
            >
              Back to Form
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code? Check your spam folder or try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading stages
  if (step === 'loading') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Generating Your Quote</h1>
          <p className="text-muted-foreground">
            Please wait while we calculate the best pricing for you
          </p>
        </div>
        <QuoteLoadingStages onComplete={() => setShowSkeleton(true)} />
      </div>
    );
  }

  // Show skeleton while finalizing
  if (showSkeleton) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Almost Ready...</h1>
          <p className="text-muted-foreground">Finalizing your quote details</p>
        </div>
        <QuoteSkeleton />
      </div>
    );
  }

  if (step === 'result' && quoteResult) {
    const quoteId = quoteResult.quote.id;
    const companyWhatsApp = "+8801712345678"; // Replace with actual company WhatsApp
    const companyEmail = "quotes@your-company.com"; // Replace with actual company email
    
    const formatQuoteMessage = () => {
      const message = `Quote Request - ID: ${quoteId}

Customer: ${formData.customerName}
Email: ${formData.customerEmail}
Country: ${formData.country}

Product: ${formData.productType}
Quantity: ${quoteResult.quote.quote_data.moqRange.requested} pcs
Complexity: ${formData.complexityLevel}
${formData.fabricType ? `Fabric: ${formData.fabricType}` : ''}

AI-GENERATED QUOTE (Reference Only)
Total: $${quoteResult.quote.total_price.toFixed(2)}
Per Unit: $${quoteResult.quote.quote_data.breakdown.finalUnitPrice.toFixed(2)}
Timeline: ${quoteResult.quote.estimated_delivery_days} days

${formData.additionalRequirements ? `Requirements: ${formData.additionalRequirements}` : ''}

I'm interested in proceeding with this order. Please provide final pricing and details.`;
      return message;
    };

    const handleSendToWhatsApp = () => {
      const message = formatQuoteMessage();
      const whatsappUrl = `https://wa.me/${companyWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    const handleSendToEmail = () => {
      const message = formatQuoteMessage();
      const subject = `Quote Request - ID: ${quoteId}`;
      const mailtoUrl = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(mailtoUrl, '_blank');
    };

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Disclaimer Alert */}
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Reference Quote Only - Not Final Pricing
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This AI-generated quote is for reference purposes. As a B2B manufacturer, our final pricing is always negotiable based on your specific requirements, order volume, and production schedule. Click "Send Quote to Company" below to discuss final pricing with our team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Your Instant Quote
              </CardTitle>
              <Badge variant="secondary" className="font-mono">
                ID: {quoteId.slice(0, 8)}
              </Badge>
            </div>
            <CardDescription>
              Reference quote generated for {formData.customerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <CurrencyDisplay usdAmount={quoteResult.quote.total_price} />
              <div className="text-sm text-muted-foreground mt-2">
                ${quoteResult.quote.quote_data.breakdown.finalUnitPrice.toFixed(2)} per unit
              </div>
              {quoteResult.quote.quote_data.breakdown.volumeDiscount < 1 && (
                <Badge variant="secondary" className="mt-2">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {((1 - quoteResult.quote.quote_data.breakdown.volumeDiscount) * 100).toFixed(0)}% Volume Discount
                </Badge>
              )}
            </div>

            {/* Shipping Estimate Placeholder */}
            <Card className="bg-secondary/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Shipping Estimate</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Express: 7-10 days | Economy: 15-20 days
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Real-time DHL/FedEx rates will be available soon. Contact us for accurate shipping quotes.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="text-xs text-muted-foreground">Quantity</div>
                <div className="text-lg font-semibold">{quoteResult.quote.quote_data.moqRange.requested} pcs</div>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="text-xs text-muted-foreground">Timeline</div>
                <div className="text-lg font-semibold">{quoteResult.quote.estimated_delivery_days} days</div>
              </div>
            </div>

            {quoteResult.aiInsights && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">AI Recommendations</div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {quoteResult.aiInsights}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { data, error } = await supabase.functions.invoke('convert-quote-to-order', {
                      body: { quoteId: quoteResult.quote.id }
                    });

                    if (error) throw error;

                    // Navigate to confirmation page with order details
                    const confirmationParams = new URLSearchParams({
                      orderNumber: data.order.orderNumber,
                      productType: formData.productType,
                      quantity: formData.quantity,
                      totalPrice: quoteResult.quote.total_price.toString(),
                      deliveryDays: quoteResult.quote.estimated_delivery_days.toString(),
                      trackingUrl: data.order.trackingUrl,
                      email: formData.customerEmail,
                    });
                    
                    window.location.href = `/order-confirmation?${confirmationParams.toString()}`;
                  } catch (error: any) {
                    console.error('Order placement error:', error);
                    toast({
                      title: "Failed to place order",
                      description: error.message || "Please try again or contact support",
                      variant: "destructive"
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Accept Quote & Place Order'
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Or share this quote:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleSendToWhatsApp}
                  variant="outline"
                  className="w-full"
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
                
                <Button
                  onClick={() => setEmailModalOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Quote
                </Button>
              </div>
            </div>

            <Separator className="my-4" />
          </CardContent>
        </Card>

        {/* Price Comparison Widget */}
        <PriceComparison 
          yourPrice={quoteResult.quote.quote_data.breakdown.finalUnitPrice}
          quantity={quoteResult.quote.quote_data.moqRange.requested}
        />

        {/* Smart Recommendations */}
        <SmartRecommendations
          quantity={quoteResult.quote.quote_data.moqRange.requested}
          material={formData.fabricType}
          complexityLevel={formData.complexityLevel}
          unitPrice={quoteResult.quote.quote_data.breakdown.finalUnitPrice}
          timeline={quoteResult.quote.estimated_delivery_days}
          onRecalculate={handleRecalculate}
        />

        {/* Smart Factory Matcher */}
        <SmartFactoryMatcher
          quantity={parseInt(formData.quantity)}
          targetDate={undefined}
          onSelectFactory={(factoryId) => {
            toast({
              title: "Factory Selected",
              description: "Redirecting to order placement...",
            });
            // Handle factory selection - could integrate with order placement
          }}
        />

        <Card>
          <CardContent className="pt-6">
            {/* Next Steps Section */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                What's Next?
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Share Quote with Our Team</p>
                    <p className="text-muted-foreground">Click "Send Quote to Company" above to start the discussion</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Negotiate Final Terms</p>
                    <p className="text-muted-foreground">Our team will contact you to discuss pricing, MOQ, and specifications</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Sample Approval</p>
                    <p className="text-muted-foreground">Review and approve samples before bulk production begins</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Track Production</p>
                    <p className="text-muted-foreground">Monitor your order in real-time through our dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setStep('form');
                  setQuoteResult(null);
                  setOtp('');
                  setShowSkeleton(false);
                }}
                variant="outline"
                className="w-full"
              >
                Generate Another Quote
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <a href="/quote-history">
                  <Clock className="w-4 h-4 mr-2" />
                  View All Quotes
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Quote Modal */}
        <EmailQuoteModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          quoteData={{
            quoteId: quoteResult.quote.id,
            productType: formData.productType,
            quantity: quoteResult.quote.quote_data.moqRange.requested,
            totalPrice: quoteResult.quote.total_price,
            unitPrice: quoteResult.quote.quote_data.breakdown.finalUnitPrice,
            timeline: quoteResult.quote.estimated_delivery_days,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            country: formData.country,
            fabricType: formData.fabricType,
            complexityLevel: formData.complexityLevel,
            additionalRequirements: formData.additionalRequirements,
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Quote Generator
        </h1>
        <p className="text-muted-foreground">
          Get instant pricing powered by AI • Email verification required
        </p>
      </div>

      {/* View Past Quotes Link */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Have quotes already?</p>
                <p className="text-sm text-muted-foreground">View and compare your past quotes</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <a href="/quote-history">View History</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Natural Language Input */}
      <NaturalLanguageQuoteInput 
        onParsedData={handleParsedData}
        disabled={loading || otpLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or fill out the form manually
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request a Quote</CardTitle>
          <CardDescription>Fill in your requirements for an instant AI-powered quote</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  maxLength={100}
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email * (for verification)</Label>
                <Input
                  id="email"
                  type="email"
                  maxLength={255}
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.label}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value) => setFormData({ ...formData, productType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sweaters">Sweaters & Cardigans</SelectItem>
                  <SelectItem value="polo-shirts">Polo Shirts</SelectItem>
                  <SelectItem value="t-shirts">T-Shirts</SelectItem>
                  <SelectItem value="hoodies">Hoodies & Sweatshirts</SelectItem>
                  <SelectItem value="corporate-uniforms">Corporate Uniforms</SelectItem>
                  <SelectItem value="school-uniforms">School Uniforms</SelectItem>
                  <SelectItem value="sports-uniforms">Sports Uniforms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (pieces) *</Label>
              <Input
                id="quantity"
                type="number"
                min="50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g., 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity Level</Label>
              <Select
                value={formData.complexityLevel}
                onValueChange={(value) => setFormData({ ...formData, complexityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (solid colors)</SelectItem>
                  <SelectItem value="medium">Medium (multi-color)</SelectItem>
                  <SelectItem value="complex">Complex (intricate designs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricType">Fabric Type (Optional)</Label>
              <Input
                id="fabricType"
                maxLength={50}
                value={formData.fabricType}
                onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                placeholder="e.g., 100% Cotton, Merino Wool"
              />
              <p className="text-xs text-muted-foreground">
                {formData.fabricType.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Additional Requirements</Label>
              <Textarea
                id="requirements"
                maxLength={2000}
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                placeholder="Special finishing, packaging, certifications..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {formData.additionalRequirements.length}/2000 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload Reference Images (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadedFiles.length >= 3}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images or PDF
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 3 files • 20MB each
                  </p>
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                      {file.type.startsWith('image/') ? (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Verification Code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We'll send a verification code to your email before generating the quote
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
