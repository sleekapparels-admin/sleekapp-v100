import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Activity, Zap, Wind, Target } from "lucide-react";

const JoggersManufacturer = () => {
  const productSchema = generateProductSchema({
    name: "Custom Joggers Manufacturing",
    description: "Premium joggers and athletic pants manufacturing from Bangladesh. Fleece, French terry, performance fabrics. MOQ 100 pieces. Custom branding and fit options available.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "JOGGERS-CUSTOM-MOQ100",
    brand: "Sleek Apparels",
    category: "Apparel Manufacturing",
    offers: {
      price: "10.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });

  return (
    <>
      <SEO 
        title="Custom Joggers Manufacturer Bangladesh | Athletic Pants MOQ 100 | Fleece & Performance"
        description="Leading Bangladesh joggers and athletic pants manufacturer. Custom joggers from 100 pieces. Fleece, French terry, performance fabrics. Tapered fit, slim fit options. Screen printing, embroidery. Fast sampling 5-7 days. Serving US, EU, worldwide brands."
        canonical="https://sleekapparels.com/joggers-manufacturer"
        keywords="joggers manufacturer Bangladesh, custom athletic pants low MOQ, fleece joggers manufacturing, performance joggers Bangladesh, custom sweatpants manufacturer, athletic wear Bangladesh"
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
                Custom Joggers & Athletic Pants Manufacturer Bangladesh | MOQ 100
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium joggers and athletic pants manufacturing for global activewear brands. Custom fleece joggers, French terry, performance fabrics from 100 pieces minimum order. Tapered fit, straight fit, slim fit options. Elastic waistband, drawstring, zippered pockets. Fast sampling 5-7 days, bulk production 15-20 days.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 100 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  5-7 Day Sampling
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Multiple Fits
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Features
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Jogger Styles */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Joggers & Athletic Pants Styles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Fleece Joggers</h3>
                <p className="text-muted-foreground mb-4">Classic fleece joggers with soft interior. Perfect for loungewear and casual athleisure.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Heavyweight fleece (280-320gsm)</li>
                  <li>• Elastic waistband with drawstring</li>
                  <li>• Ribbed or elasticated cuffs</li>
                  <li>• MOQ: 100 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">French Terry Joggers</h3>
                <p className="text-muted-foreground mb-4">Lighter weight French terry construction. Excellent drape and comfort.</p>
                <ul className="space-y-2 text-sm">
                  <li>• French terry fabric (260-300gsm)</li>
                  <li>• Looped interior, smooth exterior</li>
                  <li>• Year-round wear comfort</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Wind className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Performance Joggers</h3>
                <p className="text-muted-foreground mb-4">Technical performance fabrics. Moisture-wicking, quick-dry, stretch.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Performance poly or poly-cotton blends</li>
                  <li>• 4-way stretch, moisture-wicking</li>
                  <li>• Athletic and slim fits</li>
                  <li>• MOQ: 150 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Tapered Joggers</h3>
                <p className="text-muted-foreground mb-4">Modern tapered fit from hip to ankle. Fashion-forward athleisure style.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Slim through leg, tapered to ankle</li>
                  <li>• Elasticated or ribbed cuffs</li>
                  <li>• Side or zippered pockets</li>
                  <li>• MOQ: 150 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Athletic Sweatpants</h3>
                <p className="text-muted-foreground mb-4">Classic athletic sweatpants. Straight leg or slightly tapered fit.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Fleece or French terry construction</li>
                  <li>• Straight or relaxed fit</li>
                  <li>• Side pockets, back pocket options</li>
                  <li>• MOQ: 100 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Cargo Joggers</h3>
                <p className="text-muted-foreground mb-4">Utility-inspired cargo joggers. Multiple pockets and functional design.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Cargo pockets on thighs</li>
                  <li>• Ripstop or durable fabrics</li>
                  <li>• Tapered fit with adjustable cuffs</li>
                  <li>• MOQ: 200 pieces per style</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric Options */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Joggers Fabrics & Materials</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Cotton & Fleece Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Standard Fleece (280-320gsm)</strong>
                      <span className="text-sm text-muted-foreground">Soft, warm, comfortable. Perfect for basic joggers.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">French Terry (260-300gsm)</strong>
                      <span className="text-sm text-muted-foreground">Lightweight, looped interior, year-round comfort.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Brushed Fleece Interior</strong>
                      <span className="text-sm text-muted-foreground">Extra soft, maximum warmth and comfort.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Cotton-Poly Blends (80/20, 70/30)</strong>
                      <span className="text-sm text-muted-foreground">Durable, shape-retaining, affordable.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Performance & Technical Fabrics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Performance Polyester</strong>
                      <span className="text-sm text-muted-foreground">Moisture-wicking, quick-dry, lightweight, breathable.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Stretch Fabrics (Spandex/Elastane)</strong>
                      <span className="text-sm text-muted-foreground">4-way stretch, freedom of movement, athletic fit.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Ripstop Fabrics</strong>
                      <span className="text-sm text-muted-foreground">Durable, tear-resistant, cargo and utility joggers.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Recycled Polyester (Sustainable)</strong>
                      <span className="text-sm text-muted-foreground">Eco-friendly, GRS certified, performance properties.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Customization */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Joggers Features & Customization</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Waistband Options</h4>
                <p className="text-sm text-muted-foreground">Elastic waistband, drawstring, adjustable fits, comfort stretch.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Pocket Styles</h4>
                <p className="text-sm text-muted-foreground">Side pockets, zippered, cargo pockets, back pockets, hidden pockets.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Cuff Options</h4>
                <p className="text-sm text-muted-foreground">Ribbed cuffs, elastic cuffs, open hem, adjustable ankle zippers.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Branding</h4>
                <p className="text-sm text-muted-foreground">Screen printing, embroidery, heat transfer, woven labels, hang tags.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & MOQ */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Joggers Manufacturing Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$10-$14</div>
                  <div className="font-semibold mb-2">Basic Joggers (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Standard fleece or French terry</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$14-$20</div>
                  <div className="font-semibold mb-2">Performance Joggers (MOQ 150)</div>
                  <div className="text-sm text-muted-foreground">Technical fabrics, multiple features</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$20-$28</div>
                  <div className="font-semibold mb-2">Premium/Cargo (MOQ 200)</div>
                  <div className="text-sm text-muted-foreground">Complex designs, cargo pockets, premium fabrics</div>
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

export default JoggersManufacturer;
