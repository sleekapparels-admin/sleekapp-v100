import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Wind, Zap, Shield, Sparkles } from "lucide-react";

const HoodiesManufacturer = () => {
  const productSchema = generateProductSchema({
    name: "Custom Hoodie Manufacturing",
    description: "Premium hoodie and sweatshirt manufacturing from Bangladesh. Fleece, French terry, pullover and zip-up styles. MOQ 100 pieces. Screen printing and embroidery available.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "HOODIE-CUSTOM-MOQ100",
    brand: "Sleek Apparels",
    category: "Apparel Manufacturing",
    offers: {
      price: "12.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });

  return (
    <>
      <SEO 
        title="Custom Hoodie Manufacturer Bangladesh | Sweatshirts MOQ 100 | Fleece & French Terry"
        description="Leading Bangladesh hoodie and sweatshirt manufacturer. Custom hoodies from 100 pieces. Pullover, zip-up, crewneck styles. Fleece, French terry fabrics. Screen printing, embroidery. Fast sampling 5-7 days. Serving US, EU, worldwide."
        canonical="https://sleekapparels.com/hoodies-manufacturer"
        keywords="hoodie manufacturer Bangladesh, custom hoodies low MOQ, sweatshirt manufacturing Bangladesh, fleece hoodie manufacturer, French terry sweatshirts, custom embroidered hoodies Bangladesh"
        includeOrganizationSchema
        includeServiceSchema
      />
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Custom Hoodie & Sweatshirt Manufacturer Bangladesh | MOQ 100
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium hoodie and sweatshirt manufacturing for global brands. Custom pullover hoodies, zip-ups, crewneck sweatshirts from 100 pieces minimum order. Fleece (280-450gsm), French terry, brushed interior fabrics. Screen printing, embroidery, heat transfer. Fast sampling 5-7 days, bulk production 15-20 days.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 100 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  5-7 Day Sampling
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Premium Fleece
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Branding
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Hoodie Styles */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Hoodie & Sweatshirt Styles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Wind className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Pullover Hoodies</h3>
                <p className="text-muted-foreground mb-4">Classic pullover design with kangaroo pocket. Fleece or French terry construction.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Heavyweight fleece (320-450gsm)</li>
                  <li>• Kangaroo pocket, drawstring hood</li>
                  <li>• Ribbed cuffs and waistband</li>
                  <li>• MOQ: 100 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Zip-Up Hoodies</h3>
                <p className="text-muted-foreground mb-4">Full-zip hoodie with YKK zippers. Perfect for layering and custom branding.</p>
                <ul className="space-y-2 text-sm">
                  <li>• YKK or premium zipper options</li>
                  <li>• Side pockets or kangaroo pocket</li>
                  <li>• Fashion and athletic fits</li>
                  <li>• MOQ: 150 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Crewneck Sweatshirts</h3>
                <p className="text-muted-foreground mb-4">Classic crewneck design. Perfect for screen printing and embroidery.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Fleece or French terry fabrics</li>
                  <li>• Ribbed collar, cuffs, waistband</li>
                  <li>• Ideal for large chest prints</li>
                  <li>• MOQ: 100 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Fashion Hoodies</h3>
                <p className="text-muted-foreground mb-4">Oversized, cropped, and fashion-forward styles. Premium retail quality.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Oversized fits, cropped lengths</li>
                  <li>• Unique design details and trims</li>
                  <li>• Premium fabric blends</li>
                  <li>• MOQ: 150-300 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Wind className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Performance Hoodies</h3>
                <p className="text-muted-foreground mb-4">Athletic performance hoodies with moisture-wicking and stretch properties.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Poly-cotton or technical blends</li>
                  <li>• Moisture-wicking properties</li>
                  <li>• Athletic and slim fits</li>
                  <li>• MOQ: 150 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Organic Hoodies</h3>
                <p className="text-muted-foreground mb-4">GOTS certified organic cotton hoodies. Sustainable and eco-friendly.</p>
                <ul className="space-y-2 text-sm">
                  <li>• GOTS certified organic cotton</li>
                  <li>• Eco-friendly dyes and processes</li>
                  <li>• Heavyweight premium quality</li>
                  <li>• MOQ: 200 pieces per style</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric Options */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Hoodie & Sweatshirt Fabrics</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Fleece Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Standard Fleece (280-320gsm)</strong>
                      <span className="text-sm text-muted-foreground">Soft, comfortable, affordable. Perfect for basic hoodies.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Premium Fleece (350-450gsm)</strong>
                      <span className="text-sm text-muted-foreground">Heavyweight, luxurious feel, excellent warmth.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Brushed Fleece Interior</strong>
                      <span className="text-sm text-muted-foreground">Extra soft interior, superior comfort and warmth.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Cotton-Poly Fleece Blends</strong>
                      <span className="text-sm text-muted-foreground">80/20 or 70/30 blends. Soft, durable, affordable.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">French Terry & Specialty</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">French Terry (280-320gsm)</strong>
                      <span className="text-sm text-muted-foreground">Lighter weight, looped interior, excellent drape.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Organic Cotton Fleece (GOTS)</strong>
                      <span className="text-sm text-muted-foreground">Sustainable, chemical-free, premium eco-friendly option.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Performance Fleece</strong>
                      <span className="text-sm text-muted-foreground">Moisture-wicking, quick-dry, athletic applications.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Sherpa Lined (Premium)</strong>
                      <span className="text-sm text-muted-foreground">Ultra-warm, premium retail quality, fashion hoodies.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Details */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Hoodie Construction & Features</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Hood & Drawstrings</h4>
                <p className="text-sm text-muted-foreground">Double-layered hood, metal eyelets, flat or round drawstrings.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Pockets</h4>
                <p className="text-sm text-muted-foreground">Kangaroo, side pockets, zippered options, interior pockets.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Ribbing</h4>
                <p className="text-sm text-muted-foreground">1x1 or 2x2 ribbed cuffs and waistband for shape retention.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Zippers</h4>
                <p className="text-sm text-muted-foreground">YKK or premium zippers, metal or nylon options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & MOQ */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Hoodie Manufacturing Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$12-$16</div>
                  <div className="font-semibold mb-2">Basic Hoodies (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Standard fleece, single color print</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$16-$22</div>
                  <div className="font-semibold mb-2">Premium Hoodies (MOQ 150)</div>
                  <div className="text-sm text-muted-foreground">Heavy fleece, zip-up, multi-color prints</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$22-$30</div>
                  <div className="font-semibold mb-2">Organic/Fashion (MOQ 200)</div>
                  <div className="text-sm text-muted-foreground">GOTS organic, oversized fits, complex designs</div>
                </div>
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

export default HoodiesManufacturer;
