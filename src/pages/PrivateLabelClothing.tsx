import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Package, Tag, ShoppingBag, Sparkles, Truck, ClipboardCheck } from "lucide-react";

const PrivateLabelClothing = () => {
  const productSchema = generateProductSchema({
    name: "Private Label Clothing Manufacturing",
    description: "Private label apparel manufacturing from Bangladesh. Launch your clothing brand with low MOQ 50 pieces. Complete white-label solutions: design, manufacturing, branding, packaging. Fast turnaround for startups and established brands.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "PRIVATE-LABEL-MOQ50",
    brand: "Sleek Apparels",
    category: "Apparel Manufacturing",
    offers: {
      price: "8.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });

  return (
    <>
      <SEO 
        title="Private Label Clothing Manufacturer Bangladesh | Launch Your Brand MOQ 50"
        description="Private label clothing manufacturer Bangladesh. Launch your apparel brand with low MOQ 50 pieces. Complete white-label solutions: design assistance, custom manufacturing, branding, packaging, dropshipping. Fast turnaround for startups and established brands."
        canonical="https://sleekapparels.com/private-label-clothing"
        keywords="private label clothing manufacturer, white label apparel Bangladesh, launch clothing brand low MOQ, custom clothing line manufacturer, private label fashion Bangladesh, startup clothing manufacturer"
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
                Private Label Clothing Manufacturer Bangladesh | Launch Your Brand from 50 Pieces
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Complete private label and white-label apparel manufacturing solutions for fashion entrepreneurs, startups, and established brands. Launch your clothing line with low minimum orders starting from 50 pieces. We handle everything: design assistance, pattern making, sampling, bulk production, custom branding, hang tags, packaging, and shipping. Fast turnaround 15-20 days. Serving USA, Europe, Australia clothing brands.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 50 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Full White-Label
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Design Support
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Packaging
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Private Label Services */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Complete Private Label Solutions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Design & Development</h3>
                <p className="text-muted-foreground mb-4">Turn your vision into reality with professional design and technical development.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Design consultation and refinement</li>
                  <li>• Tech pack creation and CAD services</li>
                  <li>• Fabric sourcing and recommendations</li>
                  <li>• Pattern making and grading</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Package className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Manufacturing & Production</h3>
                <p className="text-muted-foreground mb-4">High-quality production with flexible MOQs tailored for emerging brands.</p>
                <ul className="space-y-2 text-sm">
                  <li>• MOQ as low as 50 pieces per style</li>
                  <li>• Fast sampling 5-7 days</li>
                  <li>• Bulk production 15-20 days</li>
                  <li>• Quality control at every stage</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Tag className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Custom Branding</h3>
                <p className="text-muted-foreground mb-4">Complete branding solutions to establish your unique identity.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Custom woven/printed labels</li>
                  <li>• Hang tags and swing tags</li>
                  <li>• Screen printing and embroidery</li>
                  <li>• Heat transfer and sublimation</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <ShoppingBag className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Custom Packaging</h3>
                <p className="text-muted-foreground mb-4">Professional packaging that enhances your brand experience.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Custom poly bags with branding</li>
                  <li>• Branded boxes and mailers</li>
                  <li>• Tissue paper and inserts</li>
                  <li>• Stickers and thank you cards</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <ClipboardCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Quality Assurance</h3>
                <p className="text-muted-foreground mb-4">Rigorous quality control ensuring your brand maintains high standards.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Pre-production sample approval</li>
                  <li>• In-line quality inspections</li>
                  <li>• Final AQL 2.5 inspection</li>
                  <li>• Detailed QC reports provided</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Shipping & Logistics</h3>
                <p className="text-muted-foreground mb-4">Streamlined shipping solutions to get your products to market fast.</p>
                <ul className="space-y-2 text-sm">
                  <li>• DHL/FedEx express shipping</li>
                  <li>• Sea freight for bulk orders</li>
                  <li>• Dropshipping services available</li>
                  <li>• Customs documentation assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Private Label Product Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "T-Shirts & Tops",
                "Hoodies & Sweatshirts",
                "Activewear & Leggings",
                "Dresses & Skirts",
                "Joggers & Pants",
                "Jackets & Outerwear",
                "Loungewear Sets",
                "Kids Clothing"
              ].map((category) => (
                <div
                  key={category}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1 transition-all"
                >
                  <p className="font-bold text-lg">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-secondary">How Private Label Works</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold mb-1">Share Your Vision</h4>
                  <p className="text-muted-foreground text-sm">
                    Tell us about your brand concept, target audience, and design ideas. We'll provide guidance on fabrics, styles, and pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold mb-1">Design Development</h4>
                  <p className="text-muted-foreground text-sm">
                    We create tech packs, source fabrics, and develop samples. You approve the design before production begins.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold mb-1">Production & Branding</h4>
                  <p className="text-muted-foreground text-sm">
                    Bulk manufacturing begins with your custom labels, hang tags, and packaging applied to each garment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card border border-border rounded-lg p-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold mb-1">Quality Check & Shipping</h4>
                  <p className="text-muted-foreground text-sm">
                    Final inspection, professional packaging, and shipping to your warehouse or dropshipping directly to your customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Private Label Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center mb-8">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$8-$15</div>
                  <div className="font-semibold mb-2">Basic Apparel (MOQ 50)</div>
                  <div className="text-sm text-muted-foreground">T-shirts, tank tops, simple designs</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$15-$28</div>
                  <div className="font-semibold mb-2">Mid-Range (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Hoodies, joggers, dresses, moderate complexity</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$28-$50</div>
                  <div className="font-semibold mb-2">Premium (MOQ 150)</div>
                  <div className="text-sm text-muted-foreground">Jackets, complex designs, premium fabrics</div>
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  All prices include basic branding (woven labels + hang tags). Additional services like custom packaging and embroidery quoted separately.
                </p>
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

export default PrivateLabelClothing;
