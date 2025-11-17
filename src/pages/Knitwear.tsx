import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import knitwearImage from "@/assets/portfolio/knitwear-cardigan-red.webp";
import productKnitwear from "@/assets/factory/product-knitwear-display.webp";
import knitwearProduction from "@/assets/bangladesh-knitwear-production.webp";

const Knitwear = () => {
  return (
    <>
      <SEO config={getPageSEO('knitwear')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                  Custom Knitwear Manufacturing | Europe & North America | MOQ 50
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  Precision knitwear for European and North American brands. Custom sweaters, cardigans, polos. MOQ 50 pieces. Fine gauge (12GG-14GG) to chunky (3GG-7GG). Organic cotton, merino wool, cashmere, bamboo. Fast sampling 3-7 days. Serving Nordic, UK, Germany, Spain, France, USA.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    MOQ 50 Pieces
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Fine to Chunky Gauge
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Wholesale Pricing
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    3-7 Day Sampling
                  </span>
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-1">Typical Pricing Range:</p>
                  <p className="text-2xl font-bold text-secondary">$15 - $45 per piece</p>
                  <p className="text-xs text-muted-foreground mt-1">Depending on gauge, yarn type, and quantity</p>
                </div>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
                <img
                  src={knitwearImage}
                  alt="Premium knitwear sample"
                  className="rounded-2xl shadow-card-hover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Factory Showcase */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 opacity-5">
            <img src={knitwearProduction} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-secondary">Knitwear Production Facility</h2>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  State-of-the-art automated flat knitting producing premium knitwear for European and North American brands. Consistent quality, ethical labor practices, international shipping expertise.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card-hover">
                <img src={productKnitwear} alt="Knitwear production display" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* What We Make */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center text-secondary">Custom Knitwear Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Custom Sweaters", "Cardigans", "Polo Shirts", "Hoodies", "Pullovers", "Vests", "Custom Uniforms", "Jacquard Knits"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 transition-all animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <p className="font-bold text-lg">{item}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-secondary">Manufacturing Capabilities</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Advanced flat knitting technology combined with skilled craftsmanship for premium custom knitwear production</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">Gauge Range</h3>
                <p className="text-muted-foreground">Fine 12GG-14GG for dress sweaters, standard 7GG-9GG for cardigans, chunky 3GG-5GG for fashion knitwear</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">Premium Yarns</h3>
                <p className="text-muted-foreground">Organic cotton, Merino wool, Bamboo fiber, Viscose, Cashmere blends, RPET recycled polyester</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">Knit Structures</h3>
                <p className="text-muted-foreground">Jersey, Milano rib, Full rib, Jacquard patterns, Intarsia colorwork, Cable knit textures</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">Finishing Services</h3>
                <p className="text-muted-foreground">Garment washing, precision steaming, professional pressing, seamless linking, ±1cm tolerance guarantee</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-secondary">Custom Knitwear Production Timeline for US Brands</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold mb-1">Quotation & Specifications Review</h4>
                  <p className="text-muted-foreground text-sm">
                    Share reference photos or tech pack, desired knit structure, yarn type preferences, quantity, and target price point for wholesale knitwear
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold mb-1">Sample Development & Approval</h4>
                  <p className="text-muted-foreground text-sm">3–7 business days after yarn confirmation. Samples shipped via DHL/FedEx to US address</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold mb-1">Bulk Production with Quality Control</h4>
                  <p className="text-muted-foreground text-sm">
                    10–20 days bulk knitwear production with multiple in-line QC checkpoints and AQL 2.5 final inspection
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold mb-1">Final Inspection & Shipping to USA</h4>
                  <p className="text-muted-foreground text-sm">Final AQL 2.5 inspection, professional packaging, and secure shipment to US destination</p>
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

export default Knitwear;
