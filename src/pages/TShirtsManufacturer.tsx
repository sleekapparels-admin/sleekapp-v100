import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Shirt, Package, Clock, Award } from "lucide-react";

const TShirtsManufacturer = () => {
  const productSchema = generateProductSchema({
    name: "Custom T-Shirt Manufacturing",
    description: "Premium custom t-shirt manufacturing from Bangladesh. Ring-spun cotton, organic options, MOQ 50 pieces. Screen printing, embroidery, DTG printing available.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "TSHIRT-CUSTOM-MOQ50",
    brand: "Sleek Apparels",
    category: "Apparel Manufacturing",
    offers: {
      price: "5.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });

  return (
    <>
      <SEO 
        title="Custom T-Shirt Manufacturer Bangladesh | MOQ 50 Pieces | Ring-Spun Cotton"
        description="Leading Bangladesh t-shirt manufacturer. Custom tees from 50 pieces. Ring-spun cotton, organic, tri-blends. Screen print, embroidery, DTG. Fast sampling 3-7 days. Serving US, EU, worldwide brands."
        canonical="https://sleekapparels.com/t-shirts-manufacturer"
        keywords="t-shirt manufacturer Bangladesh, custom t-shirts low MOQ, Bangladesh tee manufacturer, ring-spun cotton t-shirts, organic t-shirt manufacturing, custom tee printing Bangladesh"
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
                Custom T-Shirt Manufacturer Bangladesh | MOQ 50 Pieces
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Premium t-shirt manufacturing for US, European, and worldwide brands. Custom tees from 50 pieces minimum order. Ring-spun cotton, organic cotton, tri-blends. Screen printing, embroidery, direct-to-garment printing. Fast sampling 3-7 days, bulk production 10-15 days.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 50 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  3-7 Day Sampling
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Ring-Spun Cotton
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Branding
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* T-Shirt Styles */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">T-Shirt Styles We Manufacture</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Shirt className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Basic Crew Neck</h3>
                <p className="text-muted-foreground mb-4">Classic crew neck tees. 145-180gsm ring-spun cotton. Perfect for screen printing and embroidery.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Ring-spun 100% cotton or cotton-poly blends</li>
                  <li>• Side-seamed construction</li>
                  <li>• Taped neck and shoulders</li>
                  <li>• MOQ: 50 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Shirt className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">V-Neck & Fashion Fits</h3>
                <p className="text-muted-foreground mb-4">Modern fashion-forward styles. Slim fit, relaxed fit, oversized options available.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Fashion-forward cuts and fits</li>
                  <li>• V-neck, scoop neck, henley styles</li>
                  <li>• Tri-blend fabrics (cotton/poly/rayon)</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Premium Organic Cotton</h3>
                <p className="text-muted-foreground mb-4">GOTS certified organic cotton t-shirts. Sustainable and eco-friendly manufacturing.</p>
                <ul className="space-y-2 text-sm">
                  <li>• GOTS certified organic cotton</li>
                  <li>• Eco-friendly dyes and processes</li>
                  <li>• Heavyweight options (200-220gsm)</li>
                  <li>• MOQ: 100-200 pieces</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Package className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Performance Tees</h3>
                <p className="text-muted-foreground mb-4">Moisture-wicking athletic tees. Quick-dry polyester or poly-cotton blends.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Moisture-wicking fabrics</li>
                  <li>• Quick-dry, breathable construction</li>
                  <li>• Athletic and slim fits</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Long Sleeve Tees</h3>
                <p className="text-muted-foreground mb-4">Long sleeve crew neck and fashion styles. Perfect for layering and cooler seasons.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Ring-spun cotton or blends</li>
                  <li>• Ribbed cuffs and neck</li>
                  <li>• Fashion and basic fits</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Shirt className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Pocket Tees</h3>
                <p className="text-muted-foreground mb-4">Classic pocket t-shirts. Chest pocket detail for casual and workwear applications.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Chest pocket construction</li>
                  <li>• Heavyweight cotton options</li>
                  <li>• Perfect for embroidery branding</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric Options */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">T-Shirt Fabrics & Materials</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Cotton Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Ring-Spun Cotton (145-180gsm)</strong>
                      <span className="text-sm text-muted-foreground">Soft, smooth, durable. Perfect for printing and embroidery.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Organic Cotton (GOTS Certified)</strong>
                      <span className="text-sm text-muted-foreground">Sustainable, eco-friendly, chemical-free farming practices.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Combed Cotton (Premium)</strong>
                      <span className="text-sm text-muted-foreground">Ultra-soft, long-staple fibers. Premium feel and durability.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Heavyweight Cotton (200-220gsm)</strong>
                      <span className="text-sm text-muted-foreground">Durable, structured feel. Premium retail quality.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Blend & Performance Fabrics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Cotton-Poly Blends (50/50, 60/40)</strong>
                      <span className="text-sm text-muted-foreground">Affordable, wrinkle-resistant, moisture-wicking properties.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Tri-Blends (Cotton/Poly/Rayon)</strong>
                      <span className="text-sm text-muted-foreground">Super soft, retail fashion quality, excellent drape.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Performance Polyester</strong>
                      <span className="text-sm text-muted-foreground">Moisture-wicking, quick-dry, athletic and activewear applications.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Recycled Polyester (Sustainable)</strong>
                      <span className="text-sm text-muted-foreground">Eco-friendly recycled materials. GRS certified options.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Branding Options */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Custom T-Shirt Branding Options</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Screen Printing</h4>
                <p className="text-sm text-muted-foreground">Multi-color prints, water-based or plastisol inks, oversized designs.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Embroidery</h4>
                <p className="text-sm text-muted-foreground">Chest logos, sleeve embroidery, 3D puff, custom thread colors.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">DTG Printing</h4>
                <p className="text-sm text-muted-foreground">Full-color photo-realistic prints, no MOQ per design.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Heat Transfer</h4>
                <p className="text-sm text-muted-foreground">Vinyl transfers, full-color transfers, custom labels and tags.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & MOQ */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">T-Shirt Manufacturing Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$5-$8</div>
                  <div className="font-semibold mb-2">Basic Tees (MOQ 50)</div>
                  <div className="text-sm text-muted-foreground">Ring-spun cotton, single color print</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$8-$12</div>
                  <div className="font-semibold mb-2">Fashion Tees (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Tri-blends, multi-color prints, premium fabrics</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$12-$18</div>
                  <div className="font-semibold mb-2">Organic/Premium (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">GOTS organic, heavyweight, complex branding</div>
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

export default TShirtsManufacturer;
