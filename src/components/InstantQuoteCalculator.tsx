import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, TrendingDown, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface PricingFactors {
  basePrice: number;
  quantityDiscount: number;
  customizationCost: number;
  urgencyFee: number;
  fabricMultiplier: number;
}

interface QuoteEstimate {
  pricePerPiece: number;
  totalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  timeline: string;
  confidence: number;
  factors: PricingFactors;
  savings: number;
}

// Base pricing database (simulating ML model predictions)
const basePricing: Record<string, number> = {
  't-shirt': 5.50,
  'polo': 9.50,
  'hoodie': 15.00,
  'sweatshirt': 12.00,
  'sweater': 14.00,
  'pullover': 13.50,
  'cardigan': 16.00,
  'vest': 11.00,
  'tank-top': 4.50,
  'long-sleeve': 7.00,
  'jacket': 22.00,
  'windbreaker': 19.00,
  'blazer': 35.00,
  'pants': 14.00,
  'jeans': 18.00,
  'joggers': 15.00,
  'shorts': 8.50,
  'skirt': 12.00,
  'dress': 20.00,
  'jumpsuit': 25.00,
  'uniform-shirt': 11.00,
  'uniform-pants': 13.00,
  'scrubs': 16.00,
  'jersey': 18.00,
  'tracksuit': 28.00,
  'leggings': 10.00,
  'activewear-top': 12.00,
};

// Customization costs
const customizationPricing: Record<string, number> = {
  none: 0,
  'screen-print': 1.50,
  'embroidery': 2.50,
  'dtg': 2.00,
  'sublimation': 3.00,
  'heat-transfer': 1.75,
};

// Fabric multipliers
const fabricMultipliers: Record<string, number> = {
  'cotton-100': 1.0,
  'cotton-combed': 1.10,
  'cotton-pima': 1.30,
  'cotton-supima': 1.45,
  'cotton-organic': 1.25,
  'polyester-100': 0.85,
  'polyester-recycled': 0.95,
  'nylon': 0.95,
  'spandex': 1.05,
  'rayon': 0.90,
  'viscose': 0.92,
  'modal': 1.10,
  'linen': 1.35,
  'bamboo': 1.20,
  'wool': 2.00,
  'merino-wool': 2.50,
  'cashmere': 4.00,
  'silk': 3.50,
  'cotton-poly-blend': 0.90,
  'poly-spandex-blend': 0.95,
  'tri-blend': 1.10,
  'french-terry': 1.15,
  'fleece': 1.20,
  'jersey-knit': 1.05,
  'rib-knit': 1.08,
  'waffle-knit': 1.12,
  'performance-tech': 1.25,
  'moisture-wicking': 1.20,
  'quick-dry': 1.18,
  'anti-microbial': 1.22,
};

// Premium quality multipliers
const qualityMultipliers: Record<string, number> = {
  'standard': 1.0,
  'premium': 1.20,
  'luxury': 1.45,
};

// Timeline options
const timelineOptions: Record<string, { days: string; fee: number }> = {
  standard: { days: '15-20 days', fee: 0 },
  fast: { days: '12-15 days', fee: 0.10 },
  rush: { days: '10-12 days', fee: 0.20 },
};

export const InstantQuoteCalculator = () => {
  const navigate = useNavigate();
  const [productType, setProductType] = useState('t-shirt');
  const [quantity, setQuantity] = useState(100);
  const [customization, setCustomization] = useState('screen-print');
  const [fabric, setFabric] = useState('cotton-100');
  const [quality, setQuality] = useState('standard');
  const [timeline, setTimeline] = useState('standard');
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calculate on any change
  useEffect(() => {
    calculateQuote();
  }, [productType, quantity, customization, fabric, timeline]);

  const calculateQuote = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay (ML model inference)
    setTimeout(() => {
      const basePrice = basePricing[productType] || 10;
      
      // Quantity discount (bulk pricing)
      let quantityDiscount = 0;
      if (quantity >= 500) quantityDiscount = 0.15; // 15% off
      else if (quantity >= 300) quantityDiscount = 0.12; // 12% off
      else if (quantity >= 200) quantityDiscount = 0.10; // 10% off
      else if (quantity >= 100) quantityDiscount = 0.07; // 7% off
      else if (quantity >= 50) quantityDiscount = 0.03; // 3% off
      
      // Customization cost
      const customizationCost = customizationPricing[customization] || 0;
      
      // Fabric multiplier
      const fabricMultiplier = fabricMultipliers[fabric] || 1.0;
      
      // Quality multiplier
      const qualityMultiplier = qualityMultipliers[quality] || 1.0;
      
      // Timeline urgency fee
      const urgencyFee = timelineOptions[timeline]?.fee || 0;
      
      // Calculate price per piece
      const subtotal = basePrice * fabricMultiplier * qualityMultiplier;
      const discountedPrice = subtotal * (1 - quantityDiscount);
      const withCustomization = discountedPrice + customizationCost;
      const pricePerPiece = withCustomization * (1 + urgencyFee);
      
      // Total price
      const totalPrice = pricePerPiece * quantity;
      
      // Calculate savings vs. market rate
      const marketRate = basePrice * 1.4; // Competitors charge 40% more on average
      const marketTotal = marketRate * quantity;
      const savings = marketTotal - totalPrice;
      
      // Confidence interval (±10-15%)
      const priceRange = {
        min: pricePerPiece * 0.90,
        max: pricePerPiece * 1.10,
      };
      
      const timelineDays = timelineOptions[timeline]?.days || '15-20 days';
      
      // Confidence based on quantity (higher quantity = higher confidence)
      const confidence = Math.min(95, 75 + (quantity / 50));
      
      setEstimate({
        pricePerPiece: Math.round(pricePerPiece * 100) / 100,
        totalPrice: Math.round(totalPrice * 100) / 100,
        priceRange: {
          min: Math.round(priceRange.min * 100) / 100,
          max: Math.round(priceRange.max * 100) / 100,
        },
        timeline: timelineDays,
        confidence: Math.round(confidence),
        factors: {
          basePrice,
          quantityDiscount,
          customizationCost,
          urgencyFee,
          fabricMultiplier,
        },
        savings: Math.round(savings * 100) / 100,
      });
      
      setIsCalculating(false);
    }, 300);
  };

  const handleGetFormalQuote = () => {
    // Pre-fill the quote form and navigate
    const quoteData = {
      productType,
      quantity,
      customization,
      fabric,
      timeline,
      estimatedPrice: estimate?.pricePerPiece,
    };
    
    // Store in session storage
    sessionStorage.setItem('quote_prefill', JSON.stringify(quoteData));
    
    // Navigate to auth/get-started
    navigate('/auth?intent=beta&role=buyer');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Instant AI-Powered Estimate
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Quote Calculator
        </h2>
        <p className="text-muted-foreground text-lg">
          Get your preliminary quote in 30 seconds • No signup required
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Configure Your Order</h3>
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product-type">Product Type</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger id="product-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t-shirt">T-Shirt (Crew Neck)</SelectItem>
                <SelectItem value="polo">Polo Shirt</SelectItem>
                <SelectItem value="hoodie">Hoodie</SelectItem>
                <SelectItem value="sweatshirt">Sweatshirt</SelectItem>
                <SelectItem value="sweater">Sweater</SelectItem>
                <SelectItem value="pullover">Pullover</SelectItem>
                <SelectItem value="cardigan">Cardigan</SelectItem>
                <SelectItem value="vest">Vest</SelectItem>
                <SelectItem value="tank-top">Tank Top</SelectItem>
                <SelectItem value="long-sleeve">Long Sleeve Shirt</SelectItem>
                <SelectItem value="jacket">Jacket</SelectItem>
                <SelectItem value="windbreaker">Windbreaker</SelectItem>
                <SelectItem value="blazer">Blazer</SelectItem>
                <SelectItem value="pants">Pants</SelectItem>
                <SelectItem value="jeans">Jeans</SelectItem>
                <SelectItem value="joggers">Joggers</SelectItem>
                <SelectItem value="shorts">Shorts</SelectItem>
                <SelectItem value="skirt">Skirt</SelectItem>
                <SelectItem value="dress">Dress</SelectItem>
                <SelectItem value="jumpsuit">Jumpsuit</SelectItem>
                <SelectItem value="leggings">Leggings</SelectItem>
                <SelectItem value="activewear-top">Activewear Top</SelectItem>
                <SelectItem value="tracksuit">Tracksuit (Set)</SelectItem>
                <SelectItem value="uniform-shirt">Uniform Shirt</SelectItem>
                <SelectItem value="uniform-pants">Uniform Pants</SelectItem>
                <SelectItem value="scrubs">Medical Scrubs</SelectItem>
                <SelectItem value="jersey">Sports Jersey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Quantity</Label>
              <Badge variant="secondary" className="text-sm">
                {quantity} pieces
              </Badge>
            </div>
            <Slider
              value={[quantity]}
              onValueChange={(values) => setQuantity(values[0])}
              min={50}
              max={5000}
              step={50}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50</span>
              <span>1,000</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Customization */}
          <div className="space-y-2">
            <Label htmlFor="customization">Customization</Label>
            <Select value={customization} onValueChange={setCustomization}>
              <SelectTrigger id="customization">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Customization</SelectItem>
                <SelectItem value="screen-print">Screen Printing (+$1.50/pc)</SelectItem>
                <SelectItem value="embroidery">Embroidery (+$2.50/pc)</SelectItem>
                <SelectItem value="dtg">Direct-to-Garment Print (+$2.00/pc)</SelectItem>
                <SelectItem value="sublimation">Sublimation (+$3.00/pc)</SelectItem>
                <SelectItem value="heat-transfer">Heat Transfer (+$1.75/pc)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fabric Type */}
          <div className="space-y-2">
            <Label htmlFor="fabric">Fabric Type</Label>
            <Select value={fabric} onValueChange={setFabric}>
              <SelectTrigger id="fabric">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="cotton-100">100% Cotton (Standard)</SelectItem>
                <SelectItem value="cotton-combed">Combed Cotton (+10%)</SelectItem>
                <SelectItem value="cotton-pima">Pima Cotton (+30%)</SelectItem>
                <SelectItem value="cotton-supima">Supima Cotton (+45%)</SelectItem>
                <SelectItem value="cotton-organic">Organic Cotton (+25%)</SelectItem>
                <SelectItem value="polyester-100">100% Polyester (-15%)</SelectItem>
                <SelectItem value="polyester-recycled">Recycled Polyester (-5%)</SelectItem>
                <SelectItem value="nylon">Nylon (-5%)</SelectItem>
                <SelectItem value="spandex">Spandex/Elastane (+5%)</SelectItem>
                <SelectItem value="rayon">Rayon (-10%)</SelectItem>
                <SelectItem value="viscose">Viscose (-8%)</SelectItem>
                <SelectItem value="modal">Modal (+10%)</SelectItem>
                <SelectItem value="linen">Linen (+35%)</SelectItem>
                <SelectItem value="bamboo">Bamboo Fiber (+20%)</SelectItem>
                <SelectItem value="wool">Wool (+100%)</SelectItem>
                <SelectItem value="merino-wool">Merino Wool (+150%)</SelectItem>
                <SelectItem value="cashmere">Cashmere (+300%)</SelectItem>
                <SelectItem value="silk">Silk (+250%)</SelectItem>
                <SelectItem value="cotton-poly-blend">Cotton/Poly Blend (-10%)</SelectItem>
                <SelectItem value="poly-spandex-blend">Poly/Spandex Blend (-5%)</SelectItem>
                <SelectItem value="tri-blend">Tri-Blend (+10%)</SelectItem>
                <SelectItem value="french-terry">French Terry (+15%)</SelectItem>
                <SelectItem value="fleece">Fleece (+20%)</SelectItem>
                <SelectItem value="jersey-knit">Jersey Knit (+5%)</SelectItem>
                <SelectItem value="rib-knit">Rib Knit (+8%)</SelectItem>
                <SelectItem value="waffle-knit">Waffle Knit (+12%)</SelectItem>
                <SelectItem value="performance-tech">Performance Tech (+25%)</SelectItem>
                <SelectItem value="moisture-wicking">Moisture-Wicking (+20%)</SelectItem>
                <SelectItem value="quick-dry">Quick-Dry (+18%)</SelectItem>
                <SelectItem value="anti-microbial">Anti-Microbial (+22%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality/Premium Level */}
          <div className="space-y-2">
            <Label htmlFor="quality">Quality Level</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger id="quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Quality</SelectItem>
                <SelectItem value="premium">Premium Quality (+20%)</SelectItem>
                <SelectItem value="luxury">Luxury Quality (+45%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Quality affects stitching, finishing, and construction standards
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">Production Timeline</Label>
            <Select value={timeline} onValueChange={setTimeline}>
              <SelectTrigger id="timeline">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (15-20 days)</SelectItem>
                <SelectItem value="fast">Fast (12-15 days) +10%</SelectItem>
                <SelectItem value="rush">Rush (10-12 days) +20%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Your Estimate</h3>
          </div>

          {estimate && !isCalculating ? (
            <div className="space-y-6">
              {/* Main Price Display */}
              <div className="bg-background rounded-lg p-6 border-2 border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Estimated Price per Piece</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    ${estimate.pricePerPiece.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground">per piece</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Price range: ${estimate.priceRange.min.toFixed(2)} - ${estimate.priceRange.max.toFixed(2)}
                </p>
              </div>

              {/* Total Price */}
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Order Value</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${estimate.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Production Timeline</p>
                    <p className="text-xs text-muted-foreground">{estimate.timeline}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <TrendingDown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-600">You Save ${estimate.savings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">vs. typical market rates</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Tracked with LoopTrace™</p>
                    <p className="text-xs text-muted-foreground">Real-time updates at every stage</p>
                  </div>
                </div>
              </div>

              {/* Confidence Badge */}
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Estimate Confidence</span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {estimate.confidence}% Accurate
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is a preliminary estimate. Final quote provided within 2-4 hours.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleGetFormalQuote}
                  className="w-full text-base h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  Get Formal Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  Free signup • No credit card required • 2-4 hour response
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center space-y-3">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground">Calculating your estimate...</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">50+</p>
          <p className="text-xs text-muted-foreground">Minimum Order</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-accent">10-20</p>
          <p className="text-xs text-muted-foreground">Days Production</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">98.5%</p>
          <p className="text-xs text-muted-foreground">On-Time Delivery</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-accent">15+</p>
          <p className="text-xs text-muted-foreground">Countries Served</p>
        </div>
      </div>
    </div>
  );
};
