import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { DollarSign, Ship, Clock, Shield } from "lucide-react";

const USABuyers = () => {
  return (
    <>
      <SEO 
        title="Bangladesh Apparel Manufacturer for USA Brands | Custom Clothing MOQ 50 | Sleek Apparels"
        description="Bangladesh garment manufacturer serving US brands. Custom t-shirts, hoodies, joggers, activewear from 50 pieces. DDP USA shipping, compliance documentation, fast production 10-20 days. Ethical manufacturing, LoopTrace™ tracking. Serving NYC, LA, Chicago, nationwide."
        canonical="https://sleekapparels.com/usa-buyers"
        keywords="Bangladesh manufacturer USA, USA clothing manufacturer, custom apparel USA brands, garment sourcing USA, Bangladesh to USA shipping, ethical manufacturing USA, low MOQ USA brands, DDP USA apparel"
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
                Bangladesh Apparel Manufacturer for USA Brands | MOQ 50
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium garment manufacturing from Bangladesh to USA. Custom t-shirts, hoodies, joggers, activewear from 50 pieces minimum order. DDP USA shipping, compliance documentation, ethical production. Fast sampling 3-7 days, bulk production 10-20 days. Serving NYC, Los Angeles, Chicago, and nationwide US brands.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 50 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  DDP USA Shipping
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Pricing in USD
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Compliance Support
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Bangladesh for USA Brands */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Why Bangladesh Manufacturing for USA Brands?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">Cost Competitive</h3>
                <p className="text-muted-foreground text-sm">
                  30-40% cost savings vs USA domestic production. Transparent USD pricing. No hidden fees.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">Fast Production</h3>
                <p className="text-muted-foreground text-sm">
                  Samples in 3-7 days. Bulk production 10-20 days. Faster than China, competitive with domestic.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Ship className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">DDP USA Shipping</h3>
                <p className="text-muted-foreground text-sm">
                  Delivered duty paid to your US warehouse. We handle customs, duties, freight forwarding.
                </p>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">USA Compliance</h3>
                <p className="text-muted-foreground text-sm">
                  WRAP certified, OEKO-TEX fabrics, ethical labor standards. Full documentation for US import.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* USA-Specific Services */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Services for USA Brands</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Shipping & Logistics to USA</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    DDP (Delivered Duty Paid) to USA warehouses - we handle customs clearance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Air freight express (5-7 days) or sea freight economy (30-40 days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Direct shipping to Amazon FBA warehouses supported
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Tracking with LoopTrace™ platform - real-time visibility from factory to USA
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">USA Compliance & Documentation</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Certificate of Origin for duty-free import under GSP (Generalized System of Preferences)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    WRAP (Worldwide Responsible Accredited Production) certification
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    OEKO-TEX Standard 100 fabric certification for textile safety
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Commercial invoice, packing list, bill of lading for US customs
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Payment Methods for USA Buyers</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    USD pricing - transparent quotes in US dollars
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    Wire transfer (ACH or SWIFT) to US or Bangladesh bank accounts
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
                <h3 className="text-2xl font-bold mb-4 text-secondary">USA Time Zone Communication</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    English-speaking team - direct communication, no language barriers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    EST/PST overlap hours for real-time calls (7 AM - 12 PM EST overlap with Bangladesh)
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

        {/* Products for USA Market */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Popular Products for USA Brands</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">T-Shirts for USA Market</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Basic tees, fashion fits, organic cotton. Perfect for USA streetwear, retail, promotional merchandise.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 50 pieces | Price: $5-$12 USD</p>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">Hoodies for USA Brands</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Pullover, zip-up, crewneck sweatshirts. Popular for USA collegiate, sports teams, lifestyle brands.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 100 pieces | Price: $12-$22 USD</p>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h4 className="font-bold text-lg mb-3">Activewear for USA Athletes</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Performance tees, joggers, athletic pants. Moisture-wicking, quick-dry for USA fitness brands.
                </p>
                <p className="text-sm font-semibold text-primary">MOQ: 100 pieces | Price: $10-$20 USD</p>
              </div>
            </div>
          </div>
        </section>

        {/* USA Case Studies */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">USA Brand Success Stories</h2>
            <div className="space-y-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">Los Angeles Streetwear Brand</h3>
                <p className="text-muted-foreground mb-4">
                  150-piece custom hoodie order. Oversized fits, heavy fleece, custom embroidery. Delivered to LA warehouse in 18 days via air freight.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Custom hoodies | MOQ: 150 | Lead Time: 18 days door-to-door</p>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">NYC Sustainable Fashion Startup</h3>
                <p className="text-muted-foreground mb-4">
                  200-piece organic cotton t-shirt collection. GOTS certified fabrics. Screen printed with water-based inks. DDP shipping to NYC.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Organic tees | MOQ: 200 | Compliance: GOTS, OEKO-TEX</p>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-xl font-bold mb-2 text-secondary">Chicago Corporate Uniforms</h3>
                <p className="text-muted-foreground mb-4">
                  500-piece corporate polo shirt order for Chicago-based company. Custom embroidery, consistent sizing, bulk production in 15 days.
                </p>
                <p className="text-sm text-primary font-semibold">Product: Polo shirts | MOQ: 500 | Use Case: Corporate uniforms</p>
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

export default USABuyers;
