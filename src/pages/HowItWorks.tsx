import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageSquare, Package, Truck, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const timeline = [
    {
      day: "Day 1-2",
      stage: "Quote & Specifications",
      description: "Get instant AI quote or book consultation. Finalize materials, colors, and tech specs.",
      icon: MessageSquare
    },
    {
      day: "Day 3-10",
      stage: "Sample Production",
      description: "We create prototype samples for your approval. Iterate until perfect.",
      icon: Package
    },
    {
      day: "Day 11-20",
      stage: "Bulk Production",
      description: "Full production with real-time LoopTrace™ tracking. See live updates at every stage.",
      icon: Package
    },
    {
      day: "Day 21-25",
      stage: "QC & Shipping",
      description: "AQL 2.5 inspection, professional packing, and international shipping.",
      icon: Truck
    },
    {
      day: "Day 26-35",
      stage: "Delivery & Support",
      description: "Receive your products with full documentation and after-sales support.",
      icon: CheckCircle
    }
  ];

  const processSteps = [
    {
      title: "1. Get Your Quote",
      options: [
        {
          name: "Loop AI Quote Generator",
          duration: "2 minutes",
          bestFor: "Quick estimates, standard products",
          features: ["Instant pricing", "Material suggestions", "MOQ calculations"]
        },
        {
          name: "Expert Consultation",
          duration: "15-90 minutes",
          bestFor: "Complex orders, material guidance",
          features: ["5-10 material alternatives", "Cost optimization", "Personalized advice"]
        }
      ]
    },
    {
      title: "2. Sample Development",
      description: "We create samples for your approval before bulk production",
      timeline: [
        "Day 1-2: Material sourcing",
        "Day 3-5: Sample production",
        "Day 6-7: Quality check & photos",
        "Day 8-10: Shipping to you (if needed)"
      ],
      note: "Samples typically cost $30-80 per piece. Refunded if you place bulk order."
    },
    {
      title: "3. Bulk Production",
      description: "Once samples approved, we move to full production",
      stages: [
        { name: "Knitting/Cutting", duration: "3-5 days", tracking: "Live photos & progress %" },
        { name: "Linking/Assembly", duration: "2-4 days", tracking: "Stage completion updates" },
        { name: "Washing/Finishing", duration: "2-3 days", tracking: "Quality predictions" },
        { name: "QC Inspection", duration: "1-2 days", tracking: "AQL 2.5 reports" },
        { name: "Packing", duration: "1 day", tracking: "Final photos" }
      ]
    }
  ];

  return (
    <>
      <SEO config={{
        title: "How It Works - Manufacturing Process Explained | Sleek Apparels",
        description: "Understand our simple 3-step manufacturing process: Get quote → We produce → Receive products. Full transparency with LoopTrace™ tracking. 10-20 day production from Bangladesh.",
        keywords: "manufacturing process, how it works, production timeline, bangladesh manufacturing steps",
        canonical: "https://sleek-apparels.com/how-it-works"
      }} />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How It Works</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Simple, Transparent Manufacturing Process
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From quote to delivery in 3 simple steps. Track everything in real-time with LoopTrace™
              </p>
            </div>

            {/* Timeline Overview */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Production Timeline</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block" />
                
                <div className="space-y-12">
                  {timeline.map((item, idx) => (
                    <div key={idx} className={`flex gap-8 items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <Card className="flex-1 p-6 hover:shadow-lg transition-all">
                        <Badge variant="outline" className="mb-3">{item.day}</Badge>
                        <h3 className="text-xl font-bold mb-2">{item.stage}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </Card>
                      
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 relative z-10">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-1 hidden md:block" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Process */}
            <div className="space-y-16">
              {processSteps.map((step, idx) => (
                <div key={idx}>
                  <h2 className="text-3xl font-bold mb-8">{step.title}</h2>
                  
                  {step.options && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {step.options.map((option, oIdx) => (
                        <Card key={oIdx} className="p-6">
                          <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {option.duration} • {option.bestFor}
                          </p>
                          <ul className="space-y-2">
                            {option.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {step.timeline && (
                    <Card className="p-6">
                      <p className="text-muted-foreground mb-6">{step.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {step.timeline.map((item, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-2">
                            <span className="text-primary">▸</span>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                      {step.note && (
                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                          <strong>Note:</strong> {step.note}
                        </div>
                      )}
                    </Card>
                  )}
                  
                  {step.stages && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground mb-6">{step.description}</p>
                      {step.stages.map((stage, sIdx) => (
                        <Card key={sIdx} className="p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                            <h3 className="text-lg font-bold">{stage.name}</h3>
                            <Badge variant="secondary">{stage.duration}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Tracking:</strong> {stage.tracking}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold mb-2">Can you rush production?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! For urgent orders, we can fast-track production (additional 15-20% fee). Minimum turnaround: 10 days for simple products.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-bold mb-2">What if I don't like the samples?</h3>
                  <p className="text-sm text-muted-foreground">
                    No problem! We'll iterate until you're satisfied. Sample revisions are free for the first 2 rounds.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-bold mb-2">How do I track my order?</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your LoopTrace™ dashboard for real-time updates, photos, and AI quality predictions at every production stage.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-bold mb-2">What if there are quality issues?</h3>
                  <p className="text-sm text-muted-foreground">
                    AQL 2.5 inspection catches defects before shipping. If issues arise, we replace defective pieces at no charge.
                  </p>
                </Card>
              </div>
            </div>

            {/* CTA */}
            <Card className="mt-16 p-8 text-center bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Order?</h2>
              <p className="text-muted-foreground mb-6">
                Get a quote in 2 minutes or book a free consultation to discuss your project
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/quote-generator">Get AI Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/consultation">Book Free Call</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default HowItWorks;
