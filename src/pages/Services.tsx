import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Scissors, Package2, Clock, Shield } from "lucide-react";
import cuttingRoomImg from "@/assets/cutting-room.webp";
import sewingFloorImg from "@/assets/sewing-floor.webp";
import finishedGoodsImg from "@/assets/finished-goods.webp";
import { LazyImage } from "@/components/LazyImage";
import { LazyVideo } from "@/components/LazyVideo";
import factoryPoster from "@/assets/factory/wide-factory-floor.webp";

const serviceDetails = [
  {
    icon: Package2,
    title: "Casualwear Manufacturing",
    description:
      "Custom t-shirts, hoodies, sweatshirts, and polo shirts for global brands. MOQ from 50-300 pieces depending on style. Ring-spun cotton, organic cotton, poly-cotton blends, French terry, fleece. Custom branding options: screen print, embroidery, heat transfer, DTG printing. Serving Europe, North America, and worldwide markets.",
    features: [
      "T-shirts: Basic crew neck, V-neck, fashion fits, heavyweight, organic cotton",
      "Hoodies & Sweatshirts: Pullover, zip-up, crewneck, French terry, fleece",
      "Polo Shirts: Pique cotton, performance poly, custom collar styles",
      "Fabrics: Ring-spun cotton, organic cotton, poly-cotton blends, moisture-wicking",
    ],
  },
  {
    icon: Scissors,
    title: "Activewear & Joggers",
    description:
      "Performance wear and athletic basics manufacturing. Joggers, athletic pants, performance t-shirts, and activewear essentials. Moisture-wicking fabrics, stretch materials, durable construction. MOQ from 100-500 pieces. Complete finishing including custom branding and labels.",
    features: [
      "Joggers: Fleece joggers, French terry, athletic fit, tapered, cuffed",
      "Performance wear: Moisture-wicking tees, athletic shorts, compression",
      "Fabrics: Stretch polyester, cotton-poly blends, performance knits",
      "Features: Elastic waistbands, drawstrings, zippered pockets, moisture management",
    ],
  },
  {
    icon: Clock,
    title: "Uniforms & Teamwear",
    description:
      "Corporate, school, and sports uniform manufacturing with custom branding. Complete service from design to delivery. Screen printing, embroidery, heat transfer, and woven labels available. MOQ from 50-200 pieces depending on complexity. Fast turnaround times with quality control.",
    features: [
      "Corporate uniforms: Polo shirts, button-ups, branded apparel",
      "School uniforms: T-shirts, hoodies, sports jerseys, PE kits",
      "Sports teams: Custom jerseys, practice wear, warm-up suits",
      "Branding options: Screen print, embroidery, heat transfer, patches, labels",
    ],
  },
  {
    icon: Shield,
    title: "Quality Assurance & Fast Production",
    description:
      "Industry-leading production times with AQL 2.5 quality standards. Complete quality control at every stage. First samples in 3-7 days. Bulk production in 10-20 days. LoopTrace™ Platform for complete transparency. OEKO-TEX certified materials available. International compliance documentation.",
    features: [
      "Fast sampling: 3-7 business days for first samples",
      "Quick production: 10-20 days bulk production after approval",
      "Quality control: AQL 2.5 inspection, measurement verification",
      "Tracking: LoopTrace™ Platform with real-time production visibility",
    ],
  },
];

const Services = () => {
  return (
    <>
      <SEO config={getPageSEO('services')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Full Package Apparel Manufacturing | Custom Clothing Bangladesh
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Complete apparel manufacturing services for global brands. T-shirts, hoodies, sweatshirts, joggers, activewear, and uniforms. MOQ from 50 pieces. Fast sampling 3-7 days. Serving Europe, North America, and worldwide markets. Ethical production, transparent pricing, AQL 2.5 quality.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">
              Our Manufacturing Capabilities
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {serviceDetails.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="bg-card border border-border rounded-2xl p-10 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold mb-3 text-secondary">{service.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MOQ Chart */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-secondary">Bangladesh Manufacturing MOQ & Production Timeline</h2>
              <p className="text-xl text-muted-foreground">Industry-lowest minimum order quantity with fast turnaround—perfect for emerging US brands, test runs, and wholesale orders</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-12 shadow-card-hover">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="text-5xl sm:text-6xl font-accent font-semibold text-primary mb-3">50+</div>
                  <div className="text-base text-muted-foreground">Pieces minimum order</div>
                </div>
                <div>
                  <div className="text-5xl sm:text-6xl font-accent font-semibold text-primary mb-3">3-7</div>
                  <div className="text-base text-muted-foreground">Days for samples</div>
                </div>
                <div>
                  <div className="text-5xl sm:text-6xl font-accent font-semibold text-primary mb-3">10-20</div>
                  <div className="text-base text-muted-foreground">Days bulk production</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Gallery */}
        <section className="relative py-20 overflow-hidden bg-slate-900">
          {/* Video Background (lazy, desktop only) */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <LazyVideo 
              src="/videos/production-facilities.mp4"
              className="w-full h-full"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={factoryPoster}
            />
          </div>
          {/* Mobile static image */}
          <div className="absolute inset-0 z-0 md:hidden" style={{ backgroundImage: `url(${factoryPoster})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Our Production Facilities</h2>
              <p className="text-xl text-white/80">State-of-the-art equipment and professional workspaces</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative h-80 rounded-2xl overflow-hidden group">
                <LazyImage src={cuttingRoomImg} alt="Cutting room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <p className="p-6 font-semibold text-white text-lg">Pattern Cutting & Preparation</p>
                </div>
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden group">
                <LazyImage src={sewingFloorImg} alt="Sewing floor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <p className="p-6 font-semibold text-white text-lg">Assembly & Production Floor</p>
                </div>
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden group">
                <LazyImage src={finishedGoodsImg} alt="Finished goods" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <p className="p-6 font-semibold text-white text-lg">Inventory & Warehousing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Comparison Section */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-secondary">Why Choose Sleek Apparels?</h2>
              <p className="text-xl text-muted-foreground">See how we compare to traditional options</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-background rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left font-bold">Feature</th>
                    <th className="p-4 text-center font-bold">Sleek Apparels</th>
                    <th className="p-4 text-center font-bold">Traditional Factory</th>
                    <th className="p-4 text-center font-bold">Chinese Factory</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold">Minimum Order Quantity</td>
                    <td className="p-4 text-center text-green-600 font-bold">50 pieces</td>
                    <td className="p-4 text-center text-muted-foreground">300-1,000 pieces</td>
                    <td className="p-4 text-center text-muted-foreground">500-2,000 pieces</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-4 font-semibold">Production Transparency</td>
                    <td className="p-4 text-center text-green-600 font-bold">LoopTrace™ Platform</td>
                    <td className="p-4 text-center text-muted-foreground">Weekly Updates</td>
                    <td className="p-4 text-center text-muted-foreground">Minimal Updates</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold">Lead Time (Knitwear)</td>
                    <td className="p-4 text-center text-green-600 font-bold">10-20 days</td>
                    <td className="p-4 text-center text-muted-foreground">20-40 days</td>
                    <td className="p-4 text-center text-muted-foreground">30-60 days</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-4 font-semibold">Communication</td>
                    <td className="p-4 text-center text-green-600 font-bold">English, Direct</td>
                    <td className="p-4 text-center text-muted-foreground">Via Agents</td>
                    <td className="p-4 text-center text-muted-foreground">Language Barrier</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold">Ethical Compliance</td>
                    <td className="p-4 text-center text-green-600 font-bold">WRAP, BSCI Certified</td>
                    <td className="p-4 text-center text-muted-foreground">Varies</td>
                    <td className="p-4 text-center text-muted-foreground">Often Unclear</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-4 font-semibold">Customization Flexibility</td>
                    <td className="p-4 text-center text-green-600 font-bold">High - Any Design</td>
                    <td className="p-4 text-center text-muted-foreground">Limited</td>
                    <td className="p-4 text-center text-muted-foreground">Template-Based</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Shipping Support</td>
                    <td className="p-4 text-center text-green-600 font-bold">DDP/DDU Full Service</td>
                    <td className="p-4 text-center text-muted-foreground">Basic FOB</td>
                    <td className="p-4 text-center text-muted-foreground">FOB Only</td>
                  </tr>
                </tbody>
              </table>
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

export default Services;
