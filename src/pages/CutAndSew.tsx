import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shirt, CheckCircle, Clock, Package, Network, Shield } from "lucide-react";
import cutAndSewImage from "@/assets/cut-and-sew.webp";
import productCutsew from "@/assets/factory/product-cutsew-display.webp";
import cutsewProduction from "@/assets/bangladesh-cutsew-production.webp";

const CutAndSew = () => {
  const capabilities = [
    {
      icon: Shirt,
      title: "Woven Garments",
      items: ["Button-up Shirts", "Blouses", "Dress Shirts", "Casual Shirts"],
    },
    {
      icon: Package,
      title: "Bottom Wear",
      items: ["Denim Jeans", "Chino Pants", "Twill Trousers", "Shorts"],
    },
    {
      icon: Shield,
      title: "Outerwear",
      items: ["Jackets", "Windbreakers", "Parkas", "Vests"],
    },
  ];

  const process = [
    {
      step: "1. Sourcing Inquiry",
      description: "Share your tech pack, fabric preferences, and quantity requirements with our merchandising team.",
      timeline: "Day 1-2",
    },
    {
      step: "2. Factory Selection",
      description: "We match your project with the most suitable partner factory from our vetted network based on specialization and capacity.",
      timeline: "Day 3-5",
    },
    {
      step: "3. Quotation & Sampling",
      description: "Receive detailed pricing breakdown. Approve sample development from selected factory.",
      timeline: "Day 5-15",
    },
    {
      step: "4. Bulk Production",
      description: "Production begins after sample and payment approval. Track progress via LoopTrace™.",
      timeline: "Day 16-90",
    },
    {
      step: "5. QC & Shipment",
      description: "In-line and final inspection conducted. Shipping arranged with full documentation support.",
      timeline: "Day 90+",
    },
  ];

  return (
    <>
      <SEO config={getPageSEO('cutandsew')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[500px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={cutAndSewImage}
              alt="Cut and Sew Manufacturing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl animate-fade-up">
              <Badge variant="outline" className="mb-4">Full-Package Sourcing</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Cut & Sew Apparel Sourcing via Vetted Partner Network
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                When your project requires woven garments, denim, or outerwear beyond our knitwear capabilities, 
                we connect you with trusted manufacturing partners while managing quality and timelines.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-primary" />
                  <span>MOQ: 300–1,000 pcs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Lead Time: 45–90 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Quality Managed</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary mb-1">Typical Pricing Range:</p>
                <p className="text-2xl font-bold text-secondary">$20 - $60 per piece</p>
                <p className="text-xs text-muted-foreground mt-1">Depending on complexity, fabric, and quantity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Factory Showcase */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 opacity-5">
            <img src={cutsewProduction} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Cut & Sew Partner Network</h2>
                <p className="text-muted-foreground text-lg">
                  Vetted manufacturing partners specializing in woven garments and outerwear with proven quality systems.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-card-hover">
                <img src={productCutsew} alt="Cut & sew production display" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Product Capabilities */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                What We Source
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our partner network specializes in a wide range of cut & sew garments with proven track records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {capabilities.map((category, index) => (
                <Card
                  key={category.title}
                  className="p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sourcing Process */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How Sourcing Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Transparent process from inquiry to delivery with full visibility via our platform.
              </p>
            </div>

            <div className="space-y-6">
              {process.map((phase, index) => (
                <Card
                  key={phase.step}
                  className="p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">{phase.step}</h3>
                        <Badge variant="outline">{phase.timeline}</Badge>
                      </div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Network */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Our Partner Vetting Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every factory in our network undergoes rigorous evaluation before collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center border-0 bg-card">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Compliance Audit</h3>
                <p className="text-sm text-muted-foreground">
                  BSCI, WRAP, or equivalent ethical certification verified
                </p>
              </Card>

              <Card className="p-6 text-center border-0 bg-card">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Quality Systems</h3>
                <p className="text-sm text-muted-foreground">
                  In-house QC team with documented inspection procedures
                </p>
              </Card>

              <Card className="p-6 text-center border-0 bg-card">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Capacity Check</h3>
                <p className="text-sm text-muted-foreground">
                  Verified production capacity and on-time delivery record
                </p>
              </Card>

              <Card className="p-6 text-center border-0 bg-card">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Trial Order</h3>
                <p className="text-sm text-muted-foreground">
                  Initial test production to validate quality standards
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need Woven Garments or Outerwear?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Share your tech pack and requirements. We'll match you with the right manufacturing partner.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/contact">Request Sourcing Quote</Link>
            </Button>
          </div>
        </section>

        <CTASection />
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default CutAndSew;
