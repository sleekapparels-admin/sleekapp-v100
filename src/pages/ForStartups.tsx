import { useState } from "react";
import { ArrowRight, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Clock, Users, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SEO } from "@/components/SEO";

export default function ForStartups() {
  // Cost Calculator State
  const [quantity, setQuantity] = useState(100);
  const [productType, setProductType] = useState("t-shirt");
  
  const calculateCost = () => {
    const basePrices: Record<string, number> = {
      "t-shirt": 8.5,
      "polo": 12,
      "hoodie": 22,
      "joggers": 16,
      "sweatshirt": 18
    };
    
    const basePrice = basePrices[productType] || 10;
    
    // Volume discounts
    let discount = 0;
    if (quantity >= 200) discount = 0.15;
    else if (quantity >= 100) discount = 0.10;
    else if (quantity >= 50) discount = 0.05;
    
    const pricePerUnit = basePrice * (1 - discount);
    const totalCost = pricePerUnit * quantity;
    const savingsVs1000 = ((basePrice * 0.8) - pricePerUnit) * quantity;
    
    return {
      pricePerUnit: pricePerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      savingsVs1000: savingsVs1000 > 0 ? savingsVs1000.toFixed(2) : "0.00",
      discount: (discount * 100).toFixed(0)
    };
  };
  
  const costs = calculateCost();

  return (
    <div className="min-h-screen bg-background">
      <SEO config={{
        title: "For Startups - Low MOQ Clothing Manufacturer (50 Pieces) | Sleek Apparels",
        description: "Starting a clothing brand? Get started with just 50 pieces. Low MOQ manufacturer in Bangladesh helping startups launch successful apparel brands since 2018.",
        keywords: [
          "clothing manufacturer for startups",
          "low MOQ clothing manufacturer",
          "how to start a clothing brand",
          "startup clothing manufacturer",
          "50 piece MOQ manufacturer",
          "first time clothing order",
          "new clothing brand manufacturer",
          "small batch clothing production",
          "clothing startup Bangladesh",
          "apparel manufacturer for new brands"
        ],
        canonical: "https://sleekapparels.com/for-startups"
      }} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-600">For Startups & New Brands</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Starting a Clothing Brand?<br />Here's How We Help
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Launch your apparel brand with confidence. <strong>Start with just 50 pieces</strong> and scale 
              as you grow. No huge upfront investment. No complicated minimums. Just quality manufacturing 
              designed for new brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/contact'}>
                Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
                Calculate Your Costs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Startup Challenges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Startup Struggle is Real</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We've worked with hundreds of startups. These are the challenges they face before finding us.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: AlertTriangle,
                  title: "High Minimum Order Quantities",
                  problem: "Most manufacturers demand 1,000+ units per style. That's $15,000-$30,000 upfront for an unproven product.",
                  color: "text-red-600"
                },
                {
                  icon: DollarSign,
                  title: "Massive Capital Requirements",
                  problem: "Need $50,000+ to place your first order? Ties up all your capital before you've made a single sale.",
                  color: "text-orange-600"
                },
                {
                  icon: AlertTriangle,
                  title: "No Manufacturing Experience",
                  problem: "First-time founders struggle with tech packs, fabric selection, sizing, and quality standards.",
                  color: "text-amber-600"
                },
                {
                  icon: Clock,
                  title: "Long Lead Times & Delays",
                  problem: "6-month production timelines? By the time your product arrives, trends have changed.",
                  color: "text-yellow-600"
                },
                {
                  icon: Shield,
                  title: "Quality & Reliability Concerns",
                  problem: "How do you know the factory won't cut corners? Who ensures quality control?",
                  color: "text-blue-600"
                },
                {
                  icon: Users,
                  title: "Finding Trustworthy Partners",
                  problem: "Alibaba messages ignored. Factories ghosting after sample approval. Zero accountability.",
                  color: "text-purple-600"
                }
              ].map((challenge, index) => (
                <Card key={index} className="border-l-4 border-l-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <challenge.icon className={`h-8 w-8 ${challenge.color} flex-shrink-0`} />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                        <p className="text-muted-foreground">{challenge.problem}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How Sleek Apparels Solves These */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-600">Our Solution</Badge>
              <h2 className="text-3xl font-bold mb-4">How Sleek Apparels Solves Every Challenge</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We built our business specifically for startups and new brands. Here's what makes us different.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: "50-Piece Minimum Order Quantity",
                  solution: "Start with just 50 pieces per style. Test your market with $500-$1,500 instead of $30,000.",
                  benefit: "95% less capital required vs. traditional manufacturers"
                },
                {
                  icon: DollarSign,
                  title: "Flexible Payment Terms",
                  solution: "30% deposit, 70% before shipment. We work with your cash flow, not against it.",
                  benefit: "Manage inventory without breaking the bank"
                },
                {
                  icon: CheckCircle,
                  title: "Free Tech Pack Creation",
                  solution: "Don't have a tech pack? We'll create one for you at no charge for bulk orders (100+ units).",
                  benefit: "Save $150+ per style + eliminate confusion"
                },
                {
                  icon: Clock,
                  title: "Fast 15-25 Day Production",
                  solution: "Samples in 7-10 days. Bulk orders in 15-25 days. No 6-month waits.",
                  benefit: "Get to market 3-5x faster than competitors"
                },
                {
                  icon: Shield,
                  title: "Transparent Quality Control",
                  solution: "AQL 2.5 inspection standard. Photo/video updates. Pre-shipment inspection reports.",
                  benefit: "Sleep well knowing quality is guaranteed"
                },
                {
                  icon: Users,
                  title: "Dedicated Account Manager",
                  solution: "One point of contact from quote to delivery. WhatsApp, email, or video call support.",
                  benefit: "Never wonder about order status again"
                }
              ].map((solution, index) => (
                <Card key={index} className="border-l-4 border-l-green-400 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <solution.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                        <p className="text-muted-foreground mb-2">{solution.solution}</p>
                        <p className="text-sm text-green-700 font-semibold">✓ {solution.benefit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your First Order: Step-by-Step</h2>
              <p className="text-xl text-muted-foreground">
                Never ordered from a manufacturer before? Here's exactly what happens, start to finish.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Free Consultation (Day 1)",
                  description: "Schedule a call or video chat. We'll discuss your brand, budget, timeline, and product ideas. No commitment required.",
                  duration: "30-45 minutes"
                },
                {
                  step: 2,
                  title: "Tech Pack Creation (Days 2-3)",
                  description: "Don't have a tech pack? Send us sketches, reference photos, or detailed descriptions. We'll create a professional tech pack for free (100+ units).",
                  duration: "1-2 business days"
                },
                {
                  step: 3,
                  title: "Sample Production (Days 4-13)",
                  description: "We produce 1-3 samples of your design. $25 per sample (refunded on bulk orders). See and feel the quality before committing.",
                  duration: "7-10 days"
                },
                {
                  step: 4,
                  title: "Sample Approval & Adjustments",
                  description: "Review samples. Need changes? We'll adjust sizing, fabric, or construction at no extra charge (first revision free).",
                  duration: "Your timeline"
                },
                {
                  step: 5,
                  title: "Bulk Order Placement",
                  description: "Choose your quantity (minimum 50 pieces). Pay 30% deposit to start production. Lock in pricing and timeline.",
                  duration: "Same day"
                },
                {
                  step: 6,
                  title: "Production & Quality Control (Days 14-38)",
                  description: "We manufacture your order with AQL 2.5 inspection. Receive photo/video updates at key milestones. Pre-shipment inspection report.",
                  duration: "15-25 days"
                },
                {
                  step: 7,
                  title: "Shipping & Delivery",
                  description: "DHL/FedEx express (5-7 days) or sea freight (20-30 days). We handle customs paperwork. Pay remaining 70% before shipment.",
                  duration: "5-30 days depending on method"
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-lg flex-shrink-0">
                      {step.step}
                    </div>
                    {index < 6 && (
                      <div className="w-0.5 h-full bg-purple-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="ml-2">{step.duration}</Badge>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold mb-2">Total Timeline: 4-7 Weeks (Sample to Delivery)</h3>
              <p className="text-muted-foreground">
                Compare this to the 16-24 week timelines most manufacturers require. We get you to market 3-5x faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-600">Success Stories</Badge>
              <h2 className="text-3xl font-bold mb-4">Startups We've Helped Launch</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real results from real brands (names changed for privacy). These founders started exactly where you are now.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  brand: "Urban Thread Co.",
                  location: "Toronto, Canada",
                  category: "Streetwear",
                  challenge: "First-time founder with $5,000 budget. Other manufacturers wanted $25,000 minimum.",
                  order: "100 heavyweight hoodies with custom embroidery",
                  timeline: "Sample approved in 2 weeks, bulk order delivered in 5 weeks",
                  result: "Sold out first batch in 3 weeks. Placed 2nd order for 250 units within 60 days.",
                  quote: "I was ready to give up on my brand dream until I found Sleek Apparels. The 50-piece MOQ meant I could actually afford to start. Now we're doing $15K/month in revenue.",
                  founder: "Alex M., Founder"
                },
                {
                  brand: "Flow Active",
                  location: "San Francisco, USA",
                  category: "Activewear / Yoga",
                  challenge: "Needed performance fabric expertise. Previous manufacturer couldn't source moisture-wicking materials.",
                  order: "200 high-waisted leggings in 4 colors (50 per color)",
                  timeline: "3 sample iterations to get fit perfect. Production completed in 18 days.",
                  result: "Launched on Instagram Shop. Generated $12,000 in first month. Featured in local yoga studios.",
                  quote: "The team helped me understand fabric GSM, compression levels, and gusset construction. I learned so much. The leggings are better quality than some $80 retail brands.",
                  founder: "Sarah L., Founder"
                },
                {
                  brand: "Executive Basics",
                  location: "London, UK",
                  category: "Corporate Casual",
                  challenge: "B2B model targeting small businesses. Needed flexibility for custom logo embroidery on small orders.",
                  order: "300 polo shirts across 3 corporate clients (100 each)",
                  timeline: "Each client got samples first. Staggered production over 2 months.",
                  result: "Secured 5 corporate accounts within 6 months. Now ordering 500+ units per quarter.",
                  quote: "Sleek Apparels understood our B2B model. The ability to do 100-piece orders per client let us grow without massive inventory risk. Game changer.",
                  founder: "James T., Co-Founder"
                },
                {
                  brand: "EcoThreads",
                  location: "New York, USA",
                  category: "Sustainable Fashion",
                  challenge: "Committed to organic cotton and eco-friendly production. Needed certifications and transparency.",
                  order: "150 organic cotton t-shirts with water-based ink printing",
                  timeline: "Sourced GOTS-certified fabric. Production in 20 days with full transparency.",
                  result: "Brand story resonated with eco-conscious consumers. Featured in sustainable fashion blogs. Repeat orders every 6 weeks.",
                  quote: "I visited the factory via video call. Saw the organic fabric certificates. Watched quality inspections happen. This level of transparency is rare. They care about sustainability as much as I do.",
                  founder: "Maya P., Founder"
                },
                {
                  brand: "Stride Athletics",
                  location: "Sydney, Australia",
                  category: "Athleisure",
                  challenge: "Wanted to launch with 3 styles simultaneously but couldn't afford 1000 units per style.",
                  order: "250 total units: 100 joggers, 100 zip hoodies, 50 shorts",
                  timeline: "All 3 styles sampled together. Bulk production in 22 days.",
                  result: "Launched full collection at once. Joggers sold out first. Reordered 200 more. Now a 6-figure brand.",
                  quote: "Other manufacturers wanted me to order 1000 joggers alone. I would've had $30K in joggers and nothing else. The 50-piece MOQ let me launch a complete collection and see what sold. Smart business.",
                  founder: "Tom R., Founder"
                }
              ].map((story, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="md:w-1/3">
                        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg">
                          <h3 className="text-2xl font-bold mb-2">{story.brand}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{story.location}</p>
                          <Badge className="bg-purple-600">{story.category}</Badge>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-red-700 mb-1">The Challenge:</h4>
                            <p className="text-muted-foreground">{story.challenge}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-1">The Order:</h4>
                            <p className="text-muted-foreground">{story.order}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-700 mb-1">The Result:</h4>
                            <p className="text-muted-foreground">{story.result}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="text-muted-foreground italic mb-2">"{story.quote}"</p>
                            <p className="text-sm font-semibold">— {story.founder}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Timeline: {story.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                <strong>Note:</strong> Brand names and founder names have been changed to protect client privacy. 
                Order details and results are accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section id="calculator" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Startup-Friendly Pricing Calculator</h2>
              <p className="text-xl text-muted-foreground">
                See exactly what your first order will cost. No hidden fees. No surprises.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Product Type</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                    >
                      <option value="t-shirt">T-Shirt / Tank Top</option>
                      <option value="polo">Polo Shirt</option>
                      <option value="hoodie">Hoodie (Pullover)</option>
                      <option value="sweatshirt">Sweatshirt / Crewneck</option>
                      <option value="joggers">Joggers / Sweatpants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Order Quantity</label>
                    <input 
                      type="number"
                      min="50"
                      step="50"
                      className="w-full p-3 border rounded-lg"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 50)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minimum: 50 pieces</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Your Estimated Costs:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price Per Unit</p>
                      <p className="text-3xl font-bold text-purple-600">${costs.pricePerUnit}</p>
                      {costs.discount !== "0" && (
                        <Badge className="mt-2 bg-green-600">{costs.discount}% Volume Discount</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Order Cost</p>
                      <p className="text-3xl font-bold">${costs.totalCost}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        30% deposit: ${(parseFloat(costs.totalCost) * 0.3).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">vs. 1000-Unit MOQ</p>
                      <p className="text-3xl font-bold text-green-600">Save ${costs.savingsVs1000}</p>
                      <p className="text-xs text-muted-foreground mt-2">Capital not tied up in inventory</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <p>✓ <strong>Included:</strong> Manufacturing, quality control, basic packaging (polybags)</p>
                  <p>✓ <strong>Free:</strong> Tech pack creation (100+ units), first sample revision</p>
                  <p>✓ <strong>Additional Costs:</strong> Samples ($25 each, refunded on bulk), shipping, custom labels/tags</p>
                  <p>✓ <strong>Payment Terms:</strong> 30% deposit to start, 70% before shipment</p>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/quote-generator'}>
                    Get Detailed Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">5 Mistakes New Brands Make (And How to Avoid Them)</h2>
              <p className="text-xl text-muted-foreground">
                Learn from others' expensive mistakes. Here's what NOT to do.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  mistake: "Ordering Too Much Inventory Too Soon",
                  why: "You think: 'Bulk discounts! Better economics!' Reality: You tie up $30K in inventory for a product you haven't validated.",
                  solution: "Start with 50-100 pieces. Validate demand. Then scale. Your per-unit cost might be $2 higher, but you save $20,000 in unsold inventory risk.",
                  icon: AlertTriangle
                },
                {
                  mistake: "Skipping the Sample Stage",
                  why: "Some founders order bulk immediately to save time and money. Then the fit is wrong, fabric feels cheap, or colors don't match.",
                  solution: "Always order samples ($25 each). Test them yourself. Send to friends. Get real feedback. 7-10 extra days can save you months of returns and refunds.",
                  icon: AlertTriangle
                },
                {
                  mistake: "Not Having a Tech Pack (Or Having a Bad One)",
                  why: "You send sketches and hope for the best. The factory guesses. What arrives doesn't match your vision.",
                  solution: "Invest in a professional tech pack (we create free with bulk orders). Includes measurements, construction details, fabric specs. Zero ambiguity.",
                  icon: AlertTriangle
                },
                {
                  mistake: "Choosing Manufacturers by Price Alone",
                  why: "You find a quote for $5/unit vs. our $8.50/unit. You save $350 on 100 units. Then products arrive with crooked seams and color bleeding.",
                  solution: "Quality matters more than price. A $3.50 difference per unit is nothing compared to brand damage from poor quality. Your customers won't re-order cheap products.",
                  icon: AlertTriangle
                },
                {
                  mistake: "Underestimating Lead Times & Logistics",
                  why: "You plan to launch in 4 weeks. But: samples take 2 weeks, revisions 1 week, production 3 weeks, shipping 1 week. That's 7 weeks minimum.",
                  solution: "Add buffer time to every stage. Plan for 8-10 weeks from first contact to products in hand. Rush orders cost 20-30% more. Patience saves money.",
                  icon: AlertTriangle
                }
              ].map((mistake, index) => (
                <Card key={index} className="bg-white border-l-4 border-l-red-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <mistake.icon className="h-8 w-8 text-red-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Mistake #{index + 1}: {mistake.mistake}</h3>
                        <p className="text-muted-foreground mb-3"><strong>Why It Happens:</strong> {mistake.why}</p>
                        <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm"><strong className="text-green-700">✓ How to Avoid:</strong> {mistake.solution}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOQ Explanation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Understanding MOQ (Minimum Order Quantity)</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">What is MOQ?</h3>
                  <p className="text-muted-foreground mb-4">
                    MOQ stands for <strong>Minimum Order Quantity</strong> — the smallest number of units 
                    a manufacturer will produce in a single order.
                  </p>
                  <p className="text-muted-foreground">
                    Industry standard: <strong>1,000-3,000 units per style</strong><br />
                    Sleek Apparels: <strong>50 units per style</strong>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Why Do Manufacturers Have MOQs?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Setup costs (cutting tables, sewing lines, quality checks)</li>
                    <li>• Fabric minimums from mills (usually 500-1000 yards)</li>
                    <li>• Economies of scale (labor efficiency at higher volumes)</li>
                    <li>• Time investment (small orders take almost same effort)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Why We Offer 50-Piece MOQ</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold mb-2">We Believe in Startups</h4>
                    <p className="text-sm text-muted-foreground">
                      Every major brand started small. We want to be there from day one, not after you've already succeeded.
                    </p>
                  </div>
                  <div>
                    <Zap className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold mb-2">Efficient Operations</h4>
                    <p className="text-sm text-muted-foreground">
                      We've optimized our production lines for smaller batches. Digital cutting, modular sewing cells, lean inventory.
                    </p>
                  </div>
                  <div>
                    <Users className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold mb-2">Long-Term Partnerships</h4>
                    <p className="text-sm text-muted-foreground">
                      Your first 50-piece order is an investment. When you grow to 500, 1,000, 5,000 pieces — we grow with you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                How to Calculate Your Ideal First Order Quantity
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>1. Estimate your first 30-day sales:</strong> Be conservative. 20-50 units?</li>
                <li><strong>2. Add 30% buffer for unexpected demand:</strong> 50 × 1.3 = 65 units</li>
                <li><strong>3. Account for samples and QC:</strong> Order 5-10 extra for testing/photos</li>
                <li><strong>4. Round to nearest 50:</strong> Our MOQ tiers: 50, 100, 150, 200, etc.</li>
                <li><strong>Result:</strong> For most startups, 50-100 pieces is the perfect first order.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Startup FAQ</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "I've never started a clothing brand. Can you really help me?",
                  a: "Absolutely. Over 60% of our clients are first-time founders. We guide you through every step: tech pack creation (free for 100+ units), sample approval, production, quality control, and shipping. You'll have a dedicated account manager who answers questions via WhatsApp, email, or video call."
                },
                {
                  q: "What if I only want to test with 25 pieces, not 50?",
                  a: "We occasionally make exceptions for innovative products or strong brand concepts. Contact us to discuss. However, 50 pieces is already 95% lower than industry standard (1000 pieces), and the per-unit cost difference between 25 and 50 is significant."
                },
                {
                  q: "How much should I budget for my first order?",
                  a: "Budget breakdown for 100 t-shirts: Manufacturing ($850), Samples ($75 for 3 samples, refunded), Shipping ($150-300 depending on method), Custom labels/tags ($50-100 optional). Total: ~$1,075-1,325. Compare this to $8,500+ at traditional manufacturers (1000-unit MOQ)."
                },
                {
                  q: "Can I mix sizes in a 50-piece order?",
                  a: "Yes! Common size breakdown for 50 pieces: 5 XS, 10 S, 15 M, 12 L, 8 XL. Or customize based on your target market. For 100 pieces, we recommend a full size run (XS-XXL)."
                },
                {
                  q: "What happens if my product doesn't sell?",
                  a: "This is exactly why our 50-piece MOQ exists. You're risking $500-1,500 instead of $15,000-30,000. If it doesn't work, you've learned cheaply. Pivot to a new design, different color, or adjusted fit. Many successful brands tested 3-5 products before finding their winner."
                },
                {
                  q: "Do you offer payment plans or financing?",
                  a: "Standard terms are 30% deposit, 70% before shipment. For established relationships (repeat orders), we can discuss Net 15 or Net 30 terms. We don't offer direct financing, but many founders use business credit cards or startup loans for the deposit."
                },
                {
                  q: "How do I know the quality will be good?",
                  a: "1) Order samples first ($25 each, refunded). 2) We use AQL 2.5 inspection standard (industry benchmark). 3) Receive photo/video updates during production. 4) Pre-shipment inspection report with detailed photos. 5) If quality doesn't meet approved sample, we'll remake at our cost."
                },
                {
                  q: "Can I visit the factory?",
                  a: "Yes, but we understand most startups can't afford international travel. We offer: 1) Video factory tours (live via WhatsApp/Zoom). 2) Virtual production updates with photos/videos. 3) Live quality inspection via video call. 4) In-person visits welcome with advance notice (2 weeks)."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Clothing Brand?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join hundreds of successful startups who launched with Sleek Apparels. 
              <strong> Start with just 50 pieces.</strong> No massive investment. No complicated contracts. 
              Just quality manufacturing designed for new brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/contact'}>
                Book Free Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
                onClick={() => window.location.href = '/samples'}
              >
                Order Samples First
              </Button>
            </div>
            <p className="mt-6 text-sm text-purple-200">
              Average response time: Under 4 hours | Free tech pack with 100+ unit orders
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
