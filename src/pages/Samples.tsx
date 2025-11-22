import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Clock, DollarSign, Truck, RefreshCw, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Sample pricing data
const SAMPLE_BASE_PRICE = 25; // Base price per sample in USD

// DHL/FedEx shipping rates (estimated from Dhaka, Bangladesh)
const SHIPPING_RATES = {
  "North America": {
    "USA": { base: 45, perKg: 15 },
    "Canada": { base: 50, perKg: 16 }
  },
  "Europe": {
    "UK": { base: 40, perKg: 14 },
    "Germany": { base: 42, perKg: 14 },
    "France": { base: 42, perKg: 14 },
    "Italy": { base: 43, perKg: 14 },
    "Spain": { base: 43, perKg: 14 },
    "Netherlands": { base: 41, perKg: 14 }
  },
  "Asia Pacific": {
    "Australia": { base: 48, perKg: 16 },
    "Japan": { base: 38, perKg: 13 },
    "Singapore": { base: 35, perKg: 12 },
    "Hong Kong": { base: 35, perKg: 12 }
  },
  "Middle East": {
    "UAE": { base: 40, perKg: 13 },
    "Saudi Arabia": { base: 42, perKg: 14 }
  }
};

// Product weight estimates (in kg)
const PRODUCT_WEIGHTS = {
  "t-shirt": 0.2,
  "polo": 0.25,
  "hoodie": 0.6,
  "sweatshirt": 0.5,
  "joggers": 0.4,
  "activewear-top": 0.2,
  "activewear-bottom": 0.35
};

const Samples = () => {
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("");
  const [calculatedCost, setCalculatedCost] = useState<{
    sampleCost: number;
    shippingCost: number;
    totalCost: number;
  } | null>(null);

  useEffect(() => {
    if (productType && destination && quantity > 0) {
      calculateCost();
    }
  }, [productType, destination, quantity]);

  const calculateCost = () => {
    const weight = (PRODUCT_WEIGHTS[productType as keyof typeof PRODUCT_WEIGHTS] || 0.3) * quantity;
    
    let shippingRate = { base: 45, perKg: 15 }; // Default to USA rates
    
    // Find the shipping rate for the selected destination
    for (const region in SHIPPING_RATES) {
      const countries = SHIPPING_RATES[region as keyof typeof SHIPPING_RATES];
      if (destination in countries) {
        shippingRate = countries[destination as keyof typeof countries];
        break;
      }
    }

    const sampleCost = SAMPLE_BASE_PRICE * quantity;
    const shippingCost = shippingRate.base + (Math.ceil(weight) * shippingRate.perKg);
    const totalCost = sampleCost + shippingCost;

    setCalculatedCost({ sampleCost, shippingCost, totalCost });
  };

  return (
    <>
      <SEO 
        config={{
          title: "Sample Program - Order Apparel Samples Before Bulk | Sleek Apparels",
          description: "Order clothing samples before committing to bulk production. $25 per sample, 7-10 day turnaround, cost refunded on bulk orders. Try before you buy with confidence.",
          keywords: ["apparel samples", "clothing samples before bulk", "sample turnaround time", "manufacturer samples", "t-shirt samples", "hoodie samples", "sample refund policy"],
          canonical: "https://sleekapparels.com/samples"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4" variant="secondary">
                <Package className="h-3 w-3 mr-1" />
                Try Before You Buy
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Sample Program
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Order samples before committing to bulk production. Test quality, fit, and finish with confidence. Sample cost fully refunded on your bulk order.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>$25 per sample</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>7-10 day turnaround</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span>Cost refunded on bulk</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Cost Calculator */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Sample Cost Calculator</CardTitle>
                <CardDescription>
                  Calculate your sample cost including DHL/FedEx international shipping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-type">Product Type</Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger id="product-type">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t-shirt">T-Shirt (~0.2 kg)</SelectItem>
                        <SelectItem value="polo">Polo Shirt (~0.25 kg)</SelectItem>
                        <SelectItem value="hoodie">Hoodie (~0.6 kg)</SelectItem>
                        <SelectItem value="sweatshirt">Sweatshirt (~0.5 kg)</SelectItem>
                        <SelectItem value="joggers">Joggers (~0.4 kg)</SelectItem>
                        <SelectItem value="activewear-top">Activewear Top (~0.2 kg)</SelectItem>
                        <SelectItem value="activewear-bottom">Activewear Bottom (~0.35 kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      placeholder="1-10 samples"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination Country</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger id="destination">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">🇺🇸 USA</SelectItem>
                        <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                        <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                        <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                        <SelectItem value="France">🇫🇷 France</SelectItem>
                        <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
                        <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                        <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
                        <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                        <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                        <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                        <SelectItem value="Hong Kong">🇭🇰 Hong Kong</SelectItem>
                        <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                        <SelectItem value="Saudi Arabia">🇸🇦 Saudi Arabia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {calculatedCost && (
                  <div className="mt-6 p-6 bg-muted/50 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">Estimated Cost Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sample Cost ({quantity} × $25)</span>
                        <span className="font-semibold">${calculatedCost.sampleCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DHL/FedEx Shipping to {destination}</span>
                        <span className="font-semibold">${calculatedCost.shippingCost.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Cost</span>
                        <span className="font-bold text-primary">${calculatedCost.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-start gap-2 mt-4 p-3 bg-primary/10 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Sample cost will be refunded</strong> from your final invoice when you place a bulk order for the same product.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link to="/contact">
                      Order Samples
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/quote-generator">Get Bulk Quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Our Sample Program Works
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Product</h3>
                <p className="text-muted-foreground">
                  Select from t-shirts, hoodies, polos, or activewear. Just 1 piece minimum.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Place Order</h3>
                <p className="text-muted-foreground">
                  Contact us with your specifications. We'll confirm pricing and timeline.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Production</h3>
                <p className="text-muted-foreground">
                  We manufacture your sample with the same quality as bulk orders. 7-10 days.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ship & Refund</h3>
                <p className="text-muted-foreground">
                  Receive via DHL/FedEx. Order bulk? Sample cost refunded from final invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample vs Bulk Quality */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Sample Quality = Bulk Quality
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  What you see in your sample is exactly what you'll get in your bulk order. No surprises.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Same Materials</p>
                      <p className="text-sm text-muted-foreground">
                        Identical fabrics, trims, and construction methods
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Same Quality Standards</p>
                      <p className="text-sm text-muted-foreground">
                        AQL 2.5 inspection applied to both samples and bulk
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Pre-Production Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Your sample becomes the "golden sample" for bulk production
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Quality Guarantee</p>
                      <p className="text-sm text-muted-foreground">
                        Free replacement for any manufacturing defects
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Sample Policy Highlights</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <DollarSign className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Pricing</p>
                      <p className="text-sm text-muted-foreground">
                        $25 per sample + shipping. Transparent, no hidden fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Turnaround</p>
                      <p className="text-sm text-muted-foreground">
                        7-10 business days from order confirmation to shipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Truck className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Shipping</p>
                      <p className="text-sm text-muted-foreground">
                        DHL/FedEx Express worldwide. 3-5 days delivery after shipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <RefreshCw className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Refund Policy</p>
                      <p className="text-sm text-muted-foreground">
                        Sample cost deducted from bulk order final invoice.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Package className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Minimum Quantity</p>
                      <p className="text-sm text-muted-foreground">
                        Just 1 piece! No minimum order for samples.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Sample Program FAQ
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I order just 1 sample?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We have no minimum sample quantity. Order 1 piece to test quality, fit, and finish before committing to bulk production.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How long does sample production take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    7-10 business days from order confirmation. This includes production time. Shipping takes an additional 3-5 days via DHL/FedEx Express.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is the sample cost really refunded?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! When you place a bulk order for the same product you sampled, we deduct the sample cost from your final invoice. If you order samples of Product A and Product B, then place a bulk order for Product A, only Product A's sample cost is refunded.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I customize my sample?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Absolutely! Samples can include your custom colors, logos, labels, and branding. Just provide your specifications when ordering.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What if I don't like the sample?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No obligation to proceed with bulk orders. Samples help you make an informed decision. If adjustments are needed, we'll work with you to refine the product before bulk production.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you ship samples internationally?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! We ship samples worldwide via DHL/FedEx Express. Shipping costs vary by destination and weight. Use our calculator above for an estimate.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Order Your Sample?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Test our quality before committing. $25 per sample, refunded on bulk orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/contact">
                  Order Samples Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/quote-generator">Get Bulk Quote</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Samples;
