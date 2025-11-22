import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WhySleekApparels = () => {
  const comparisonPoints = [
    {
      feature: "Minimum Order Quantity",
      sleek: "50 pieces",
      traditional: "500-1,000 pieces",
      chinese: "1,000-5,000 pieces",
    },
    {
      feature: "Sampling Speed",
      sleek: "3-7 days",
      traditional: "2-4 weeks",
      chinese: "3-6 weeks",
    },
    {
      feature: "Communication",
      sleek: "Direct English, LoopTrace™ dashboard",
      traditional: "Email chains, language barriers",
      chinese: "Time zone delays, translators",
    },
    {
      feature: "Transparency",
      sleek: "LoopTrace™ Platform",
      traditional: "Weekly status updates",
      chinese: "Limited visibility",
    },
    {
      feature: "Quality Control",
      sleek: "AQL 2.5, photo documentation",
      traditional: "Variable, limited reporting",
      chinese: "Third-party required",
    },
    {
      feature: "Ethical Standards",
      sleek: "WRAP certified, auditable",
      traditional: "Self-reported",
      chinese: "Variable compliance",
    },
    {
      feature: "Lead Time (Bulk)",
      sleek: "10-20 days knitwear",
      traditional: "30-45 days",
      chinese: "45-90 days + shipping",
    },
    {
      feature: "Pricing",
      sleek: "Mid-range, transparent",
      traditional: "Mid-high range",
      chinese: "Lower but hidden costs",
    },
  ];

  const objections = [
    {
      objection: "Isn't Bangladesh quality poor?",
      answer: "This is a common misconception from outdated information. Bangladesh is now the world's 2nd largest apparel exporter, serving premium brands like H&M, Zara, and Uniqlo. We use OEKO-TEX certified materials and maintain AQL 2.5 inspection standards—the same as European factories. Our LoopTrace™ system provides photo documentation at every stage so you can verify quality yourself.",
    },
    {
      objection: "How do I trust a manufacturer I've never met?",
      answer: "We provide video factory tours, customer references, and third-party audit reports (WRAP certification). Our LoopTrace™ dashboard gives you more visibility than most local manufacturers. Plus, we protect your first order with a satisfaction guarantee: if samples don't meet specs, we redo them at no charge.",
    },
    {
      objection: "What if there are delays or quality issues?",
      answer: "Our AI prediction system catches 40% of potential delays before they happen, giving us time to adjust. If issues arise, you see them immediately via dashboard—not weeks later. We maintain 2% production margin for replacements and have never shipped a late order without client approval to extend deadline.",
    },
    {
      objection: "Isn't working with China cheaper?",
      answer: "Upfront pricing may appear lower, but hidden costs add up: MOQ lock-in (forcing you to order 5-10x more), longer lead times (tying up cash), communication delays (costly mistakes), and shipping costs from Asia. Our Bangladesh-to-EU shipping is 30-40% cheaper than China-to-EU, and smaller MOQs mean less inventory risk.",
    },
    {
      objection: "What about ethical manufacturing?",
      answer: "We're WRAP (Worldwide Responsible Accredited Production) certified and undergo annual third-party audits. Our workers earn 25% above minimum wage with paid overtime, health insurance, and safe working conditions. We're proud to open our factory to client visits—many manufacturers won't allow this.",
    },
  ];

  return (
    <>
      <SEO 
        config={{
          title: "Why Choose Sleek Apparels? | Compare Us vs Traditional Factories",
          description: "Direct comparison: Sleek vs traditional factories vs Chinese manufacturers. Lower MOQ, faster sampling, ethical production, transparent pricing.",
          canonical: "/why-sleek-apparels"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <Badge variant="secondary" className="mb-4">Comparison</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Why Fashion Brands Choose Sleek Apparels
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Not all manufacturers are created equal. See how we compare to traditional factories and Chinese competitors.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Head-to-Head Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="p-4 text-left font-bold text-secondary">Feature</th>
                    <th className="p-4 text-center font-bold text-primary bg-primary/5">Sleek Apparels</th>
                    <th className="p-4 text-center font-bold text-muted-foreground">Traditional Factory</th>
                    <th className="p-4 text-center font-bold text-muted-foreground">Chinese Factory</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonPoints.map((point, index) => (
                    <tr key={point.feature} className={`border-b border-border ${index % 2 === 0 ? "bg-muted/10" : ""}`}>
                      <td className="p-4 font-semibold">{point.feature}</td>
                      <td className="p-4 text-center bg-primary/5">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-primary">{point.sleek}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">{point.traditional}</td>
                      <td className="p-4 text-center text-muted-foreground">{point.chinese}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Addressing Objections */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-secondary">Common Concerns Answered</h2>
              <p className="text-xl text-muted-foreground">We understand you might have questions. Here's our honest take.</p>
            </div>
            <div className="space-y-6">
              {objections.map((item, index) => (
                <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3 text-secondary flex items-start gap-3">
                      <span className="text-primary">Q:</span>
                      {item.objection}
                    </h3>
                    <p className="text-muted-foreground pl-8">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="animate-fade-up">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-4">
                    "We switched from a Chinese factory to Sleek Apparels and cut our MOQ from 2,000 to 200 pieces. Game changer for testing new designs."
                  </p>
                  <p className="font-semibold text-secondary">— Lars Hansen, Copenhagen Streetwear</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-4">
                    "The LoopTrace™ dashboard meant I could see my production live. No more 'your order is in progress' emails. Actual transparency."
                  </p>
                  <p className="font-semibold text-secondary">— Sarah Mitchell, UK Sustainable Fashion Brand</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-4">
                    "Quality exceeded expectations. We were skeptical about Bangladesh manufacturing, but the AQL reports and photo documentation proved us wrong."
                  </p>
                  <p className="font-semibold text-secondary">— Alex Rodriguez, Barcelona Activewear</p>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground mb-4">
                    "Ethical production was non-negotiable for our brand. Sleek's WRAP certification and factory transparency aligned perfectly with our values."
                  </p>
                  <p className="font-semibold text-secondary">— Emma Lindström, Stockholm Knitwear</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-secondary">Still Not Convinced?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book a 30-minute consultation with our expert. We'll discuss your specific needs, share factory video tour, and provide custom pricing—no commitment required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/consultation" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Book Expert Consultation
              </a>
              <a href="/contact" className="inline-block px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                Request Factory Tour
              </a>
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

export default WhySleekApparels;
