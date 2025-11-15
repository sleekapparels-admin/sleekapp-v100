import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Globe, Truck, Package, Clock, DollarSign, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ShippingLogistics = () => {
  const shippingMethods = [
    {
      title: "DDP (Delivered Duty Paid)",
      description: "We handle all customs, duties, and taxes. You receive goods at your door with no surprise costs.",
      bestFor: "Fashion brands, first-time importers, hassle-free experience",
      icon: Package,
    },
    {
      title: "DDU (Delivered Duty Unpaid)",
      description: "Lower upfront cost. You handle customs clearance and duties at destination.",
      bestFor: "Experienced importers with customs broker relationships",
      icon: Truck,
    },
  ];

  const countriesServed = [
    { region: "Nordic Countries", countries: "Sweden, Norway, Denmark, Finland", delivery: "7-12 days" },
    { region: "Western Europe", countries: "UK, Germany, France, Netherlands, Spain", delivery: "8-14 days" },
    { region: "North America", countries: "USA, Canada", delivery: "10-16 days" },
    { region: "Asia Pacific", countries: "Australia, Singapore, Thailand, Indonesia", delivery: "5-10 days" },
    { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar", delivery: "6-11 days" },
  ];

  const faqs = [
    {
      question: "Who pays customs duties?",
      answer: "DDP: We pay all duties and taxes. DDU: You pay duties upon arrival. We provide detailed documentation either way.",
    },
    {
      question: "Can I track my shipment?",
      answer: "Yes! You'll receive tracking numbers for all shipments with real-time updates via our LoopTrace™ system.",
    },
    {
      question: "What about shipping insurance?",
      answer: "All shipments are insured. DDP includes insurance in the quote. DDU insurance can be added at 2% of order value.",
    },
    {
      question: "Do you handle samples differently?",
      answer: "Samples ship via DHL Express (3-5 days). First sample shipping often included in bulk order commitment.",
    },
  ];

  return (
    <>
      <SEO 
        config={{
          title: "International Shipping & Logistics | Bangladesh to EU & NA",
          description: "DDP and DDU shipping from Bangladesh to Europe and North America. 7-16 day delivery. Customs clearance support. Track every shipment.",
          canonical: "/shipping-logistics"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <Badge variant="secondary" className="mb-4">Global Logistics</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Seamless Shipping from Bangladesh to Your Doorstep
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                We handle the complexity of international logistics so you can focus on selling. DDP and DDU options available with full tracking and documentation support.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Choose Your Shipping Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {shippingMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={method.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2 text-secondary">{method.title}</h3>
                          <p className="text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Best For:</p>
                        <p className="text-sm text-muted-foreground">{method.bestFor}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Countries & Delivery Times */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">We Ship Worldwide</h2>
              <p className="text-xl text-muted-foreground">Typical delivery times from our facility in Bangladesh</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countriesServed.map((region, index) => (
                <Card key={region.region} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-secondary">{region.region}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{region.countries}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">{region.delivery}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Cost Guide */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Transparent Shipping Costs</h2>
              <p className="text-xl text-muted-foreground">Typical shipping costs (included in final quote)</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="font-semibold">Europe (50-200 pcs)</span>
                    <span className="text-primary">$1.50 - $3.00 per piece</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="font-semibold">Europe (200-500 pcs)</span>
                    <span className="text-primary">$1.00 - $2.00 per piece</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="font-semibold">North America (50-200 pcs)</span>
                    <span className="text-primary">$2.00 - $4.00 per piece</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="font-semibold">North America (200-500 pcs)</span>
                    <span className="text-primary">$1.50 - $3.00 per piece</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold">Sample Shipment (DHL Express)</span>
                    <span className="text-primary">$30 - $80 (often waived)</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  * Final costs depend on weight, dimensions, and destination. All quotes include detailed shipping breakdown.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Customs & Shipping FAQs</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-secondary">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
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

export default ShippingLogistics;
