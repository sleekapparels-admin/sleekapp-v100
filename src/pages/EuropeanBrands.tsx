import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Euro, Ship, Clock, Award } from "lucide-react";

const EuropeanBrands = () => {
  return (
    <>
      <SEO 
        title="Bangladesh Manufacturer for European Brands | Custom Apparel MOQ 50 | EU Compliance"
        description="Bangladesh garment manufacturer serving European brands. Custom t-shirts, hoodies, knitwear from 50 pieces. DDP Europe shipping, EU compliance, fast production 10-20 days. Ethical manufacturing, LoopTrace™ tracking. Serving UK, Germany, Spain, Nordic countries, Europe-wide."
        canonical="https://sleekapparels.com/european-brands"
        keywords="Bangladesh manufacturer Europe, European clothing manufacturer, custom apparel EU brands, garment sourcing Europe, Bangladesh to EU shipping, ethical manufacturing Europe, low MOQ European brands, REACH compliance Bangladesh"
        includeOrganizationSchema
        includeServiceSchema
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Bangladesh Manufacturer for European Brands | MOQ 50 | EU Compliance
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium garment manufacturing from Bangladesh to Europe. Custom t-shirts, hoodies, knitwear, uniforms from 50 pieces minimum order. DDP Europe shipping, REACH compliance, ethical production. Fast sampling 3-7 days, bulk production 10-20 days. Serving UK, Germany, Spain, Nordic countries, Netherlands, France, and Europe-wide brands.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 50 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  DDP EU Shipping
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Pricing in EUR
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  EU Compliance
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Bangladesh for European Brands */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Why Bangladesh Manufacturing for European Brands?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Euro className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">Cost Advantage</h3>
                <p className="text-muted-foreground text-sm">
                  30-40% cost savings vs European domestic production. Transparent EUR/GBP pricing.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">Fast Lead Times</h3>
                <p className="text-muted-foreground text-sm">
                  Samples in 3-7 days. Bulk production 10-20 days. Competitive with European suppliers.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Ship className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">DDP EU Shipping</h3>
                <p className="text-muted-foreground text-sm">
                  Delivered duty paid to UK, Germany, Nordic countries. We handle customs, VAT, logistics.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">EU Compliance</h3>
                <p className="text-muted-foreground text-sm">
                  REACH, OEKO-TEX, BSCI certified. Ethical labor standards. Full EU import documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EU-Specific Services */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Services for European Brands</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Shipping & Logistics to Europe</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    DDP (Delivered Duty Paid) to UK, Germany, Spain, Nordic countries, Netherlands, France
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Air freight express (5-7 days) or sea freight economy (30-45 days) to European ports
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    VAT handling for EU imports - IOSS registration available
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Tracking with LoopTrace™ platform - real-time visibility from factory to Europe
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">EU Compliance & Certifications</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    REACH (Registration, Evaluation, Authorization of Chemicals) compliance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    BSCI (Business Social Compliance Initiative) ethical audit certification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    OEKO-TEX Standard 100 fabric certification for textile safety
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Certificate of Origin, commercial invoice, EUR1 form for duty-free import (EBA)
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Payment Methods for EU Buyers</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    EUR or GBP pricing - transparent quotes in European currencies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    SEPA wire transfer for Eurozone buyers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Credit card payments accepted for deposits and small orders
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Letter of Credit (LC) for large bulk orders
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">European Time Zone Communication</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    English-speaking team - direct communication with UK, Nordic, EU brands
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    CET/GMT overlap hours for real-time calls (8 AM - 1 PM CET overlap with Bangladesh)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    24-hour response time guarantee via email and WhatsApp
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Video calls, factory tours, production updates via Zoom/Google Meet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Products for European Market */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Popular Products for European Brands</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">T-Shirts for European Market</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Organic cotton, sustainable fabrics. Perfect for EU sustainable fashion, retail, promotional merchandise.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 50 pieces | Price: €5-€12 EUR</p>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">Knitwear for Nordic Countries</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Sweaters, cardigans, knitted garments. Popular for Nordic, UK, German lifestyle brands.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 50 pieces | Price: €15-€35 EUR</p>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">Corporate Uniforms for EU</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Polo shirts, button-ups, workwear. Perfect for corporate uniforms across Europe.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 100 pieces | Price: €10-€20 EUR</p>
              </div>
            </div>
          </div>
        </section>

        {/* EU Case Studies */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">European Brand Success Stories</h2>
            <div className="space-y-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">London Sustainable Fashion Brand</h3>
                <p className="text-muted-foreground mb-4">
                  300-piece organic cotton t-shirt collection. GOTS certified fabrics, water-based prints. Delivered to London warehouse in 16 days via air freight.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Organic tees | MOQ: 300 | Compliance: GOTS, REACH</p>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">Nordic Knitwear Brand (Sweden)</h3>
                <p className="text-muted-foreground mb-4">
                  150-piece custom sweater order. Merino wool blend, cable knit. DDP shipping to Stockholm. OEKO-TEX certified.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Sweaters | MOQ: 150 | Lead Time: 20 days door-to-door</p>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">German Corporate Uniforms</h3>
                <p className="text-muted-foreground mb-4">
                  600-piece corporate polo shirt order for German company. Custom embroidery, BSCI certified production, bulk shipping to Hamburg.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Polo shirts | MOQ: 600 | Use Case: Corporate uniforms</p>
              </div>
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

export default EuropeanBrands;
