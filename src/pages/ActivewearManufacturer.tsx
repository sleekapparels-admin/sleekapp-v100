import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Activity, Zap, Wind, Target } from "lucide-react";

const ActivewearManufacturer = () => {
  const productSchema = generateProductSchema({
    name: "Custom Activewear Manufacturing",
    description: "Premium activewear and athletic apparel manufacturing from Bangladesh. Performance fabrics, moisture-wicking, 4-way stretch. MOQ 100 pieces. Custom branding for fitness brands worldwide.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "ACTIVEWEAR-CUSTOM-MOQ100",
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
        title="Custom Activewear Manufacturer Bangladesh | Performance Athletic Wear MOQ 100"
        description="Leading Bangladesh activewear manufacturer. Custom athletic wear from 100 pieces. Performance fabrics, moisture-wicking, 4-way stretch. Leggings, sports bras, tank tops, shorts. Fast sampling 5-7 days. Serving fitness brands worldwide."
        canonical="https://sleekapparels.com/activewear-manufacturer"
        keywords="activewear manufacturer Bangladesh, custom athletic wear low MOQ, performance wear manufacturing, fitness apparel Bangladesh, yoga wear manufacturer, gym clothing manufacturer"
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
                Custom Activewear & Performance Wear Manufacturer Bangladesh | MOQ 100
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium activewear manufacturing for fitness brands, yoga studios, gyms, and athletic apparel companies. Custom leggings, sports bras, tank tops, shorts, and performance wear from 100 pieces minimum order. Moisture-wicking fabrics, 4-way stretch, anti-odor treatments. Fast sampling 5-7 days, bulk production 15-20 days. Serving USA, EU, Australia fitness brands.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 100 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Performance Fabrics
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  5-7 Day Sampling
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Branding
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Activewear Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Custom Activewear Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Leggings & Tights</h3>
                <p className="text-muted-foreground mb-4">High-waisted, mid-rise, cropped, full-length. Squat-proof performance fabrics.</p>
                <ul className="space-y-2 text-sm">
                  <li>• 4-way stretch performance fabrics</li>
                  <li>• Moisture-wicking and quick-dry</li>
                  <li>• Hidden pockets, mesh panels</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Sports Bras</h3>
                <p className="text-muted-foreground mb-4">Low, medium, high impact support. Custom designs for all fitness activities.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Removable padding options</li>
                  <li>• Compression and encapsulation styles</li>
                  <li>• Seamless construction available</li>
                  <li>• MOQ: 150 pieces per design</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Wind className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Tank Tops & T-Shirts</h3>
                <p className="text-muted-foreground mb-4">Performance athletic tops. Racerback, muscle tanks, crop tops, workout tees.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Breathable mesh construction</li>
                  <li>• Anti-odor treatments</li>
                  <li>• Lightweight and quick-dry</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Athletic Shorts</h3>
                <p className="text-muted-foreground mb-4">Running shorts, cycling shorts, gym shorts. Compression and loose-fit options.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Built-in compression liners</li>
                  <li>• Zippered pockets, drawstrings</li>
                  <li>• Reflective details available</li>
                  <li>• MOQ: 100 pieces per design</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Activity className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Track Suits & Joggers</h3>
                <p className="text-muted-foreground mb-4">Matching sets, warm-up suits, athletic joggers for pre/post-workout wear.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Coordinating jacket and pants</li>
                  <li>• Fleece-lined or lightweight</li>
                  <li>• Zippered pockets, elastic cuffs</li>
                  <li>• MOQ: 100 sets (200 pieces)</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Yoga & Studio Wear</h3>
                <p className="text-muted-foreground mb-4">Yoga pants, biker shorts, crop tops, unitards. Soft, stretchy, comfortable fits.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Buttery-soft fabrics</li>
                  <li>• 4-way stretch and recovery</li>
                  <li>• Seamless and flatlock options</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Fabrics */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Performance Fabric Options</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Stretch & Moisture-Wicking</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">4-Way Stretch Poly-Spandex (80/20, 85/15)</strong>
                      <span className="text-sm text-muted-foreground">High stretch, shape retention, squat-proof construction.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Nylon-Spandex Blends (88/12, 90/10)</strong>
                      <span className="text-sm text-muted-foreground">Soft-touch, compression, moisture-wicking, quick-dry.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Supplex Nylon</strong>
                      <span className="text-sm text-muted-foreground">Cotton-like feel, breathable, lightweight, durable.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Recycled Polyester (RPET)</strong>
                      <span className="text-sm text-muted-foreground">Sustainable, GRS certified, performance properties.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Specialty Performance Fabrics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Seamless Knit (Circular Knit)</strong>
                      <span className="text-sm text-muted-foreground">No-seam construction, body-contouring, comfort zones.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Mesh Panels & Inserts</strong>
                      <span className="text-sm text-muted-foreground">Enhanced breathability, ventilation zones, laser-cut options.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Compression Fabrics (190-280gsm)</strong>
                      <span className="text-sm text-muted-foreground">Muscle support, graduated compression, recovery wear.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Anti-Odor & Anti-Bacterial Treatments</strong>
                      <span className="text-sm text-muted-foreground">Silver ion treatments, odor-control technology.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Activewear Customization Options</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Fit Options</h4>
                <p className="text-sm text-muted-foreground">Compression, relaxed fit, slim fit, oversized, athletic cut.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Branding</h4>
                <p className="text-sm text-muted-foreground">Sublimation printing, screen printing, heat transfer, embroidery, woven labels.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Features</h4>
                <p className="text-sm text-muted-foreground">Hidden pockets, mesh panels, reflective details, zippered closures.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Colorways</h4>
                <p className="text-sm text-muted-foreground">Solid colors, color-blocking, ombre, tie-dye, digital prints, custom patterns.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Activewear Manufacturing Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$12-$18</div>
                  <div className="font-semibold mb-2">Basic Activewear (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Tank tops, basic shorts, simple leggings</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$18-$28</div>
                  <div className="font-semibold mb-2">Performance Wear (MOQ 150)</div>
                  <div className="text-sm text-muted-foreground">Compression gear, sports bras, technical fabrics</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$28-$40</div>
                  <div className="font-semibold mb-2">Premium/Seamless (MOQ 200)</div>
                  <div className="text-sm text-muted-foreground">Seamless construction, complex designs, premium fabrics</div>
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

export default ActivewearManufacturer;
