import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MarketResearchInsights } from "./MarketResearchInsights";
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

interface MarketResearch {
  averageUnitCost: number;
  materialCostPerUnit: number;
  leadTimeDays: number;
  markupPercentage: number;
  comparableProducts: Array<{ name: string; price: number; source: string }>;
  sources: string[];
  confidenceScore: number;
}

export const ConversationalQuoteBuilder = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [researchLoading, setResearchLoading] = useState(false);
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
  const [marketResearch, setMarketResearch] = useState<MarketResearch | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [marketResearchId, setMarketResearchId] = useState<string | null>(null);

  const handleMarketResearch = async () => {
    if (!productType || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please provide product type and quantity",
        variant: "destructive",
      });
      return;
    }

    setResearchLoading(true);
    try {
      const captchaToken = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

      const { data, error } = await supabase.functions.invoke('ai-market-research', {
        body: {
          productType,
          quantity: parseInt(quantity),
          fabricType: fabricType || undefined,
          complexity: complexity || undefined,
          additionalRequirements: additionalRequirements || undefined,
          captchaToken,
        },
      });

      if (error) throw error;

      if (data.success) {
        setMarketResearch(data.research);
        setMarketResearchId(data.cache_id);
        setStep(2);
        toast({
          title: data.cached ? "📊 Research Retrieved" : "🔍 Research Complete",
          description: data.cached 
            ? "Using recent market data" 
            : `Found data with ${data.confidence_score}% confidence`,
        });
      }
    } catch (error) {
      console.error('Market research error:', error);
      toast({
        title: "Research Failed",
        description: "Unable to gather market data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResearchLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
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

      const { data, error } = await supabase.functions.invoke('ai-conversational-quote', {
        body: {
          productType,
          quantity: parseInt(quantity),
          fabricType: fabricType || undefined,
          complexity: complexity || undefined,
          additionalRequirements: additionalRequirements || undefined,
          customerEmail,
          customerName: customerName || undefined,
          country: country || undefined,
          phoneNumber: phoneNumber || undefined,
          sessionId,
          marketResearchId,
          captchaToken,
        },
      });

      if (error) throw error;

      if (data.success) {
        setQuote(data.quote);
        setStep(3);
        toast({
          title: "✨ Quote Generated",
          description: `$${data.quote.unitPrice.toFixed(2)}/unit with ${data.quote.confidenceScore}% confidence`,
        });
      }
    } catch (error) {
      console.error('Quote generation error:', error);
      toast({
        title: "Quote Generation Failed",
        description: "Unable to generate quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step 1: Product Details */}
      {step === 1 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Tell Us About Your Product
            </CardTitle>
            <CardDescription>
              We'll research current market prices to give you the best quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type *</Label>
                <Input
                  id="productType"
                  placeholder="e.g., T-shirts, Hoodies, Uniforms"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabricType">Fabric Type</Label>
                <Input
                  id="fabricType"
                  placeholder="e.g., Cotton, Polyester"
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complexity">Complexity</Label>
                <select
                  id="complexity"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                >
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalRequirements">Additional Requirements</Label>
              <Input
                id="additionalRequirements"
                placeholder="e.g., Custom labels, specific packaging"
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey="6LcP_RMsAAAAAAyzUVk22XySYyE5zhKuWMotskop"
            />
            <Button
              onClick={handleMarketResearch}
              disabled={researchLoading || !productType || !quantity}
              className="w-full gap-2"
            >
              {researchLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Researching Market Prices...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Research Market & Continue
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Market Research Results + Contact Info */}
      {step === 2 && marketResearch && (
        <>
          <MarketResearchInsights research={marketResearch} />
          
          <Card>
            <CardHeader>
              <CardTitle>Your Contact Information</CardTitle>
              <CardDescription>
                We'll send your detailed quote to this email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleGenerateQuote}
                  disabled={loading || !customerEmail}
                  className="flex-1 gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Your Quote...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Final Quote
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 3: Final Quote */}
      {step === 3 && quote && marketResearch && (
        <InteractiveQuoteDisplay
          quote={quote}
          research={marketResearch}
          productType={productType}
          quantity={parseInt(quantity)}
          onStartNew={() => {
            setStep(1);
            setQuote(null);
            setMarketResearch(null);
            setMarketResearchId(null);
            setProductType("");
            setQuantity("");
            setFabricType("");
            setComplexity("medium");
            setAdditionalRequirements("");
            setCustomerEmail("");
            setCustomerName("");
            setCountry("");
            setPhoneNumber("");
          }}
        />
      )}
    </div>
  );
};
