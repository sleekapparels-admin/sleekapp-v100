import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { FileText, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FirstTimeOrdering = () => {
  const steps = [
    {
      title: "Define Your Product",
      description: "Start with clarity on what you're ordering",
      checklist: [
        "Product type (sweater, polo, jacket, etc.)",
        "Approximate quantity (our MOQ is 50 pcs)",
        "Target delivery date",
        "Budget per piece (helps us recommend materials)",
      ],
    },
    {
      title: "Gather Reference Materials",
      description: "Help us understand your vision",
      checklist: [
        "Photos of similar products you like",
        "Tech pack (if you have one—not required)",
        "Color preferences (Pantone codes ideal but not essential)",
        "Any specific material preferences",
      ],
    },
    {
      title: "Request a Quote",
      description: "Use our AI quote generator or contact us directly",
      checklist: [
        "Fill out our online quote form",
        "Upload reference images",
        "Specify any special requirements",
        "Receive quote within 24-48 hours",
      ],
    },
    {
      title: "Review & Approve Sample",
      description: "See and feel the quality before committing",
      checklist: [
        "Order production sample ($30-$80)",
        "Receive sample in 7-10 days",
        "Provide feedback for revisions if needed",
        "Approve final sample before bulk",
      ],
    },
    {
      title: "Place Bulk Order",
      description: "Finalize details and begin production",
      checklist: [
        "Confirm final quantity and delivery date",
        "Pay deposit (typically 50%)",
        "Track production via LoopTrace™ dashboard",
        "Pay balance before shipment",
      ],
    },
    {
      title: "Receive & Grow",
      description: "Your products arrive, ready to sell",
      checklist: [
        "Receive shipment with all documentation",
        "Inspect against sample and specs",
        "Provide feedback for future orders",
        "Reorder seamlessly using saved specs",
      ],
    },
  ];

  const commonMistakes = [
    {
      mistake: "Skipping the Sample",
      why: "Samples catch 90% of issues before bulk production. Always order a sample unless reordering an approved design.",
    },
    {
      mistake: "Unclear Specifications",
      why: "Vague descriptions lead to unexpected results. Be specific about measurements, colors, and materials.",
    },
    {
      mistake: "Unrealistic Timelines",
      why: "Quality manufacturing takes time. Plan for 3-4 weeks minimum from sample to delivery.",
    },
    {
      mistake: "Ignoring MOQ",
      why: "Ordering below our MOQ (50 pcs) isn't possible. If testing demand, start with 50-100 pieces.",
    },
    {
      mistake: "Not Reading the Quote",
      why: "Our quotes include detailed breakdowns. Review lead times, payment terms, and shipping costs carefully.",
    },
  ];

  const preparationChecklist = [
    "Product name and description",
    "Desired materials (or ask for recommendations)",
    "Quantity needed",
    "Budget range per piece",
    "Target delivery date",
    "Reference images (at least 2-3 photos)",
    "Size range (XS-XL, kids sizes, etc.)",
    "Any branding requirements (logos, labels, tags)",
    "Shipping destination country",
    "Questions or special requests",
  ];

  return (
    <>
      <SEO 
        config={{
          title: "First-Time Ordering Guide | How to Order Custom Apparel",
          description: "Step-by-step guide for first-time apparel buyers. Avoid common mistakes, prepare the right info, and order with confidence.",
          canonical: "/first-time-ordering"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <Badge variant="secondary" className="mb-4">Beginner's Guide</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Ordering Custom Apparel for the First Time
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Never ordered custom clothing before? No problem. This guide walks you through the entire process, from idea to delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/quote-generator">Get Your First Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Ask a Question</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">6-Step Process to Your First Order</h2>
            </div>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-secondary">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.checklist.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Common Mistakes to Avoid</h2>
              <p className="text-xl text-muted-foreground">Learn from others' experiences</p>
            </div>
            <div className="space-y-6">
              {commonMistakes.map((item, index) => (
                <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-secondary flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      {item.mistake}
                    </h3>
                    <p className="text-muted-foreground pl-7">{item.why}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Preparation Checklist */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <Download className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2 text-secondary">Pre-Quote Checklist</h2>
                  <p className="text-muted-foreground">Have this information ready before requesting a quote</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preparationChecklist.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button asChild size="lg">
                    <Link to="/quote-generator">I'm Ready — Get Quote</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Quick Hits */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-secondary">Quick Answers for Beginners</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-1">Do I need a tech pack?</h3>
                  <p className="text-sm text-muted-foreground">Not required! Reference photos and descriptions are enough. We can create a simple tech pack for you.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-1">What's the smallest quantity I can order?</h3>
                  <p className="text-sm text-muted-foreground">Our minimum is 50 pieces for knitwear, 300 for cut & sew wovens.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-1">How long does it take?</h3>
                  <p className="text-sm text-muted-foreground">Sampling: 3-7 days. Bulk production: 10-20 days for knitwear, 15-25 days for cut & sew.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-1">What if I don't like the sample?</h3>
                  <p className="text-sm text-muted-foreground">We'll revise it at no extra production cost (material costs may apply). Your satisfaction is critical.</p>
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

export default FirstTimeOrdering;
