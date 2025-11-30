import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InteractiveQuoteDisplay } from "./InteractiveQuoteDisplay";

interface QuoteData {
  id: string;
  unitPrice: number;
  totalPrice: number;
  estimatedDeliveryDays: number;
  confidenceScore: number;
  priceBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
    margin: number;
  };
  priceJustification: string;
  comparableProducts: Array<{
    name: string;
    price: number;
    supplier: string;
  }>;
  suggestions: string;
}

export const ConversationalQuoteBuilder = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Form state
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fabricType, setFabricType] = useState("");
  const [complexity, setComplexity] = useState("medium");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Results state
  const [quote, setQuote] = useState<QuoteData | null>(null);

  const handleGenerateQuote = async () => {
    // Validation
    if (!productType || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please provide product type and quantity",
        variant: "destructive",
      });
      return;
    }

    const qty = parseInt(quantity);
    if (qty < 50) {
      toast({
        title: "Minimum Order Quantity",
        description: "Sleek Apparels requires a minimum order of 50 units",
        variant: "destructive",
      });
      return;
    }

    if (!customerEmail) {
      toast({
        title: "Email Required",
        description: "Please provide your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const captchaToken = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      const sessionId = localStorage.getItem('quote_session_id') || crypto.randomUUID();
      localStorage.setItem('quote_session_id', sessionId);

      const { data, error } = await supabase.functions.invoke('generate-ai-quote', {
        body: {
          productType,
          quantity: qty,
          fabricType: fabricType || undefined,
          complexity: complexity || undefined,
          additionalRequirements: additionalRequirements || undefined,
          customerEmail,
          customerName: customerName || undefined,
          country: country || undefined,
          phoneNumber: phoneNumber || undefined,
          sessionId,
          captchaToken,
        },
      });

      if (error) throw error;

      if (data.success) {
        setQuote(data.quote);
        toast({
          title: "✨ Quote Generated",
          description: `$${data.quote.unitPrice.toFixed(2)}/unit • ${data.quote.confidenceScore}% confidence`,
        });
      }
    } catch (error) {
      console.error('Quote generation error:', error);
      toast({
        title: "Quote Generation Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNew = () => {
    setQuote(null);
    setProductType("");
    setQuantity("");
    setFabricType("");
    setComplexity("medium");
    setAdditionalRequirements("");
    setCustomerEmail("");
    setCustomerName("");
    setCountry("");
    setPhoneNumber("");
  };

  if (quote) {
    return (
      <InteractiveQuoteDisplay
        quote={quote}
        productType={productType}
        quantity={parseInt(quantity)}
        onStartNew={handleStartNew}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Get Your Instant AI Quote
          </CardTitle>
          <CardDescription>
            Tell us about your product and we'll generate a detailed, market-researched quote instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Product Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Input
                  id="productType"
                  placeholder="e.g., T-shirts, Hoodies, Polo Shirts"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity * <span className="text-xs text-muted-foreground">(Min: 50 units)</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="50"
                  placeholder="e.g., 500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabricType">Fabric Type</Label>
                <Input
                  id="fabricType"
                  placeholder="e.g., 100% Cotton, Polyester Blend"
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complexity">Design Complexity</Label>
                <select
                  id="complexity"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                >
                  <option value="simple">Simple (1 color, basic design)</option>
                  <option value="medium">Medium (2-3 colors)</option>
                  <option value="complex">Complex (Multi-color, intricate)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalRequirements">Special Requirements</Label>
              <Input
                id="additionalRequirements"
                placeholder="e.g., Custom embroidery, eco-friendly packaging"
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Your Contact Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey="6LcP_RMsAAAAAAyzUVk22XySYyE5zhKuWMotskop"
          />

          <Button
            onClick={handleGenerateQuote}
            disabled={loading || !productType || !quantity || !customerEmail}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Your AI Quote...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Instant Quote
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your quote will be generated using real-time market data and Bangladesh manufacturing expertise
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
