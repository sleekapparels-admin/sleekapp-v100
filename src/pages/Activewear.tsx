import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Zap, Droplets, Wind, Shield } from "lucide-react";

const Activewear = () => {
  return (
    <>
      <SEO 
        config={{
          title: "Activewear & Performance Apparel Manufacturing | MOQ 100 | Bangladesh",
          description: "Custom activewear, joggers, and performance wear manufacturing. Moisture-wicking fabrics, athletic construction. MOQ from 100 pieces. Fast production from Bangladesh.",
          keywords: "activewear manufacturer, performance wear, joggers manufacturer, athletic apparel, moisture wicking, Bangladesh manufacturer",
          canonical: "https://sleekapparels.com/activewear",
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Activewear & Joggers Manufacturing | Performance Apparel Bangladesh
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Premium activewear and performance wear manufacturing. Joggers, athletic pants, performance t-shirts, and sports basics. Moisture-wicking fabrics, stretch materials, durable construction. MOQ from 100-500 pieces. Fast sampling and production from Bangladesh.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 100-500 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Performance Fabrics
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Athletic Construction
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">
              Performance Fabrics & Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-card rounded-xl text-center">
                <Droplets className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Moisture-Wicking</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced fabric technology pulls sweat away from skin for comfort during activity
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">4-Way Stretch</h3>
                <p className="text-sm text-muted-foreground">
                  Flexible materials allow full range of motion for athletic performance
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl text-center">
                <Wind className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quick-Dry</h3>
                <p className="text-sm text-muted-foreground">
                  Fast-drying fabrics keep you comfortable and ready for the next workout
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Durable Build</h3>
                <p className="text-sm text-muted-foreground">
                  Reinforced stitching and quality construction for long-lasting performance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">
              Activewear Product Categories
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Joggers */}
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Joggers & Athletic Pants</h3>
                <p className="text-muted-foreground mb-6">
                  Comfortable joggers for lifestyle and performance. Various fits and fabric options.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Fleece joggers, French terry, performance polyester</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Tapered fit, slim fit, relaxed fit options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Elastic waistband, drawstring, zippered pockets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">MOQ: 100-500 pieces per style/color</span>
                  </li>
                </ul>
              </div>

              {/* Performance Tops */}
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Performance Tops</h3>
                <p className="text-muted-foreground mb-6">
                  Athletic t-shirts and performance tops with moisture management and stretch.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Moisture-wicking t-shirts, tank tops, long sleeve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Performance poly, poly-spandex, mesh panels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Flatlock stitching, anti-odor, UV protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">MOQ: 100-300 pieces per style/color</span>
                  </li>
                </ul>
              </div>

              {/* Athletic Shorts */}
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Athletic Shorts</h3>
                <p className="text-muted-foreground mb-6">
                  Performance shorts for training, running, and general athletic activities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Training shorts, running shorts, basketball shorts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Lightweight performance fabrics with stretch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Elastic waistband, mesh lining, side pockets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">MOQ: 100-500 pieces per style/color</span>
                  </li>
                </ul>
              </div>

              {/* Compression Wear */}
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">Compression & Base Layers</h3>
                <p className="text-muted-foreground mb-6">
                  Compression garments and base layers for enhanced performance and support.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Compression tops, leggings, shorts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">High-stretch nylon-spandex blends (80/20)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">Flatlock seams, compression support panels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">MOQ: 200-500 pieces per style/color</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric Technology */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">
              Performance Fabric Technology
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Polyester Blends</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  High-performance polyester and polyester-spandex blends for maximum stretch and moisture management.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>• 100% polyester performance</li>
                  <li>• 90/10 poly-spandex for stretch</li>
                  <li>• Moisture-wicking treatments</li>
                  <li>• Quick-dry properties</li>
                </ul>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Stretch Materials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced stretch fabrics with 4-way stretch for unrestricted movement during athletic activities.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>• Nylon-spandex blends</li>
                  <li>• 4-way mechanical stretch</li>
                  <li>• Shape retention</li>
                  <li>• Compression support</li>
                </ul>
              </div>

              <div className="p-6 bg-card rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Sustainable Options</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Eco-friendly performance fabrics made from recycled materials without compromising performance.
                </p>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>• Recycled polyester (RPET)</li>
                  <li>• Organic cotton blends</li>
                  <li>• Water-saving dyeing</li>
                  <li>• Certified sustainable</li>
                </ul>
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

export default Activewear;
