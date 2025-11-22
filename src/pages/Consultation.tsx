import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Users, TrendingUp, Target, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Consultation = () => {
  const tiers = [
    {
      name: "Discovery Call",
      duration: "15 minutes",
      price: "FREE",
      bestFor: "Quick feasibility check",
      features: [
        "Initial project assessment",
        "Basic material guidance",
        "MOQ & timeline estimate",
        "Next steps roadmap"
      ],
      cta: "Book Free Call",
      href: "https://calendly.com/your-calendly/discovery-call",
      variant: "outline" as const
    },
    {
      name: "Material Intelligence Session",
      duration: "45 minutes",
      price: "$99",
      bestFor: "First-time importers & startups",
      features: [
        "5-10 material alternatives shown",
        "Cost-benefit analysis per option",
        "Purpose-fit recommendations",
        "Production process walkthrough",
        "Sample strategy planning",
        "Follow-up email summary"
      ],
      cta: "Book & Pay $99",
      href: "https://calendly.com/your-calendly/material-intelligence",
      variant: "default" as const,
      popular: true
    },
    {
      name: "Global Sourcing Consultation",
      duration: "60 minutes",
      price: "$149",
      bestFor: "Specialty techniques & complex orders",
      features: [
        "Access to specialty factory network across Asia",
        "Complex orders requiring niche techniques",
        "Cost-optimized production routes",
        "Multiple sourcing options comparison",
        "Advanced machinery capabilities review",
        "Hybrid production strategy planning",
        "Follow-up email summary"
      ],
      cta: "Book & Pay $149",
      href: "https://calendly.com/your-calendly/global-sourcing",
      variant: "default" as const
    },
    {
      name: "Deep Dive Consultation",
      duration: "90 minutes",
      price: "$199",
      bestFor: "Complex orders & multiple products",
      features: [
        "Everything in Material Intelligence",
        "Multi-product portfolio review",
        "Custom specification development",
        "Fabric sourcing strategy",
        "Quality control planning",
        "Cost optimization analysis",
        "Production timeline mapping",
        "PDF consultation report"
      ],
      cta: "Book & Pay $199",
      href: "https://calendly.com/your-calendly/deep-dive",
      variant: "default" as const
    },
    {
      name: "Monthly Retainer",
      duration: "2 hours/month",
      price: "$350/mo",
      bestFor: "Regular production clients",
      features: [
        "Ongoing material consultation",
        "Priority response times",
        "Production planning support",
        "Supplier relationship management",
        "Quality issue resolution",
        "Market intelligence updates"
      ],
      cta: "Contact Us",
      href: "mailto:contact@sleek-apparels.com?subject=Retainer Inquiry",
      variant: "outline" as const
    }
  ];

  const problems = [
    {
      problem: "Confused about production processes",
      solution: "Clear walkthrough of flat knitting vs circular knitting, embroidery vs printing, and all manufacturing steps"
    },
    {
      problem: "Limited material knowledge",
      solution: "See 5-10 fabric/yarn options you didn't know existed - often saving 30-40% while maintaining quality"
    },
    {
      problem: "Budget constraints",
      solution: "Cost optimization strategies: synthetic luxury fabrics, volume discounting, MOQ planning"
    },
    {
      problem: "Need purpose-specific solutions",
      solution: "Tailored recommendations for your use case: school uniforms need durability, fashion brands need aesthetics"
    }
  ];

  const caseStudies = [
    {
      title: "School Uniform: Thailand Buyer",
      summary: "International school saved $700 on 200-unit order by switching from 100% cotton to moisture-wicking cotton-poly blend - better for tropical climate!",
      result: "Reordered 500 more units"
    },
    {
      title: "Fashion Startup: Cashmere Alternative",
      summary: "LA-based brand couldn't afford $120/pc cashmere cardigans. We showed microfiber cashmere-feel at $55/pc with 90% same hand feel.",
      result: "Successfully launched, came back for 1000-unit order"
    },
    {
      title: "Corporate Wear: Logo Consistency",
      summary: "Multinational corporation ordering 2000 uniforms needed perfect logo consistency across all batches. Recommended premium embroidery thread.",
      result: "Zero complaints, now orders quarterly"
    }
  ];

  return (
    <>
      <SEO config={{
        title: "Manufacturing Consultation - Expert Material Guidance | Sleek Apparels",
        description: "Get personalized apparel manufacturing consultation from our expert. Discover material alternatives that save 30-40% while maintaining quality. Book your free discovery call today.",
        keywords: "apparel consultation, fabric consultation, manufacturing advice, material alternatives, textile expert",
        canonical: "https://sleek-apparels.com/consultation"
      }} />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Expert-Led Consultation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Manufacturing Intelligence Consultation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover material alternatives that could save you <span className="text-primary font-semibold">30-40% while maintaining quality</span>. Get expert guidance from our manufacturing specialist with 7+ years Bangladesh manufacturing experience.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>50+ brands consulted</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Average 35% cost savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Purpose-fit solutions</span>
                </div>
              </div>
            </div>

            {/* Problem-Solution Matrix */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">What You'll Get</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {problems.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">
                          ✗
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold mb-2 text-destructive">{item.problem}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mt-4 pl-9">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          ✓
                        </div>
                        <div className="flex-1">
                          <p className="text-muted-foreground">{item.solution}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Service Tiers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Choose Your Consultation</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiers.map((tier, idx) => (
                  <Card key={idx} className={tier.popular ? "border-primary shadow-lg" : ""}>
                    <CardHeader>
                      {tier.popular && (
                        <Badge className="mb-2 w-fit">Most Popular</Badge>
                      )}
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>
                        <Clock className="h-4 w-4 inline mr-1" />
                        {tier.duration}
                      </CardDescription>
                      <div className="text-3xl font-bold text-primary mt-2">
                        {tier.price}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tier.bestFor}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {tier.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild variant={tier.variant} className="w-full">
                        <a href={tier.href} target="_blank" rel="noopener noreferrer">
                          {tier.cta}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Case Studies */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {caseStudies.map((study, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{study.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{study.summary}</p>
                      <Badge variant="secondary">{study.result}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What if I don't have technical knowledge?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Perfect! That's exactly why this consultation exists. We explain everything in plain language and show you multiple material options you can actually see and compare.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I prepare for the call?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Just bring your product idea, target budget, and quantity in mind. If you have reference images or samples, even better! We'll handle the rest.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I get a discount if I place an order?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Yes! If you place an order within 30 days after a paid consultation, we'll credit the consultation fee toward your order.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-primary/5 rounded-xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold mb-4">Still Not Sure?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with a free 15-minute discovery call. No commitment, just honest advice about whether we're the right fit for your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="https://calendly.com/your-calendly/discovery-call" target="_blank" rel="noopener noreferrer">
                    Book Free Discovery Call
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/quote-generator">
                    Or Get AI Quote Instead
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default Consultation;