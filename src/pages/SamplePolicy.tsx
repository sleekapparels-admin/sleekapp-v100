import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { CheckCircle, Clock, DollarSign, RefreshCcw, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SamplePolicy = () => {
  const process = [
    {
      step: "1. Submit Request",
      description: "Fill out our sample request form with your specifications, reference images, and target price.",
      timeline: "Day 0",
      icon: Package,
    },
    {
      step: "2. Quotation",
      description: "Receive detailed sample quotation including materials, labor, and shipping costs.",
      timeline: "1-2 business days",
      icon: DollarSign,
    },
    {
      step: "3. Production",
      description: "Upon payment approval, we begin sample production with your specified materials and details.",
      timeline: "3-7 business days",
      icon: Clock,
    },
    {
      step: "4. Shipping",
      description: "Samples ship via DHL Express with tracking. Delivery to EU/NA within 3-5 days.",
      timeline: "3-5 days shipping",
      icon: CheckCircle,
    },
  ];

  const pricing = [
    {
      category: "Knitwear Samples",
      items: [
        { item: "Basic sweater / cardigan", price: "$30 - $50" },
        { item: "Jacquard / cable knit", price: "$50 - $80" },
        { item: "Cashmere / luxury yarn", price: "$80 - $120" },
      ],
    },
    {
      category: "Cut & Sew Samples",
      items: [
        { item: "Basic shirt / polo", price: "$40 - $60" },
        { item: "Jacket / outerwear", price: "$70 - $100" },
        { item: "Complex multi-panel design", price: "$100 - $150" },
      ],
    },
    {
      category: "Uniforms Samples",
      items: [
        { item: "School polo / shirt", price: "$25 - $40" },
        { item: "Sports jersey", price: "$30 - $50" },
        { item: "Corporate blazer", price: "$60 - $90" },
      ],
    },
  ];

  return (
    <>
      <SEO 
        config={{
          title: "Sample Policy & Pricing | 3-7 Day Production",
          description: "Get production samples in 3-7 days. $25-$150 per sample depending on complexity. Credit applied to bulk orders 200+ pieces.",
          canonical: "/sample-policy"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <Badge variant="secondary" className="mb-4">Sample Policy</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                See, Touch, Approve — Before Bulk Production
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                We believe in "show, don't tell." Get production-quality samples in 7-10 days total. Sample costs credited against bulk orders of 200+ pieces.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/contact">Request Sample</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/quote-generator">Get Bulk Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Sample Development Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                          <Icon className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-secondary">{step.step}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <Badge variant="outline">{step.timeline}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Sample Pricing</h2>
              <p className="text-xl text-muted-foreground">Transparent costs — no hidden fees</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricing.map((category, index) => (
                <Card key={category.category} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-secondary">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <div key={item.item} className="flex justify-between items-start gap-2">
                          <span className="text-sm text-muted-foreground">{item.item}</span>
                          <span className="text-sm font-bold text-primary whitespace-nowrap">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                * Prices include production only. Shipping via DHL Express typically $30-$50 to EU/NA (often waived with bulk commitment).
              </p>
            </div>
          </div>
        </section>

        {/* Refund Policy */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-12 text-center">
                <RefreshCcw className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-secondary">Sample Cost Credit Policy</h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
                  When you place a bulk order of <span className="font-bold text-primary">200+ pieces</span>, we credit the full sample cost against your order value.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                  <div className="bg-background p-6 rounded-lg">
                    <h3 className="font-bold mb-2">✓ What's Included</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full sample production cost</li>
                      <li>• Material costs</li>
                      <li>• Labor and finishing</li>
                      <li>• Applied to bulk order invoice</li>
                    </ul>
                  </div>
                  <div className="bg-background p-6 rounded-lg">
                    <h3 className="font-bold mb-2">ℹ️ Good to Know</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Shipping costs not credited</li>
                      <li>• Valid for 90 days from sample approval</li>
                      <li>• Applies to same product/style</li>
                      <li>• One sample credit per order</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-secondary">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-lg">Can I order multiple samples before deciding?</h3>
                  <p className="text-muted-foreground">Yes! We recommend ordering samples in 2-3 material/color options to make informed decisions. Bulk discounts available for 5+ samples.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-lg">What if I don't like the sample?</h3>
                  <p className="text-muted-foreground">We'll work with you to revise the sample at no additional production cost (material cost may apply). Your satisfaction before bulk is critical.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-lg">Do you keep sample records for future orders?</h3>
                  <p className="text-muted-foreground">Yes! We archive approved sample specs for 2 years, making reorders seamless with consistent quality.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2 text-lg">Can I request modifications after seeing the sample?</h3>
                  <p className="text-muted-foreground">Absolutely. Common adjustments (fit, color, minor details) are included. Major redesigns quoted separately.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default SamplePolicy;
