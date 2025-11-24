import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { generateProductSchema } from "@/lib/structuredData";
import { Briefcase, GraduationCap, Stethoscope, Utensils, HardHat, ShieldCheck } from "lucide-react";

const UniformsManufacturer = () => {
  const productSchema = generateProductSchema({
    name: "Custom Corporate & Industrial Uniforms Manufacturing",
    description: "Professional uniform manufacturing from Bangladesh. Corporate uniforms, school uniforms, medical scrubs, hospitality wear, industrial workwear. MOQ 100 pieces. Custom branding and embroidery.",
    image: "https://sleekapparels.com/og-image.jpg",
    sku: "UNIFORMS-CUSTOM-MOQ100",
    brand: "Sleek Apparels",
    category: "Apparel Manufacturing",
    offers: {
      price: "15.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    }
  });

  return (
    <>
      <SEO 
        title="Custom Uniform Manufacturer Bangladesh | Corporate, Medical, School Uniforms MOQ 100"
        description="Leading Bangladesh uniform manufacturer. Corporate uniforms, medical scrubs, school uniforms, hospitality wear, industrial workwear from 100 pieces. Custom embroidery, durable fabrics. Fast sampling 7-10 days. Serving businesses worldwide."
        canonical="https://sleekapparels.com/uniforms-manufacturer"
        keywords="uniform manufacturer Bangladesh, corporate uniforms low MOQ, medical scrubs manufacturer, school uniform supplier, hospitality uniforms Bangladesh, workwear manufacturer"
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
                Custom Corporate & Industrial Uniform Manufacturer Bangladesh | MOQ 100
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Professional uniform manufacturing for businesses, schools, hospitals, hotels, and industrial sectors. Custom corporate uniforms, medical scrubs, school uniforms, hospitality wear, and safety workwear from 100 pieces minimum order. Durable fabrics, custom embroidery, logo application. Fast sampling 7-10 days, bulk production 20-25 days. Serving companies worldwide.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  MOQ 100 Pieces
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Durable Fabrics
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Custom Branding
                </span>
                <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  7-10 Day Sampling
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Uniform Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Custom Uniform Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Corporate Uniforms</h3>
                <p className="text-muted-foreground mb-4">Professional office wear, dress shirts, blazers, trousers, skirts for corporate branding.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Custom dress shirts and blouses</li>
                  <li>• Tailored blazers and suit jackets</li>
                  <li>• Dress trousers and skirts</li>
                  <li>• MOQ: 100 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Stethoscope className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Medical Scrubs & Healthcare</h3>
                <p className="text-muted-foreground mb-4">Medical scrubs, lab coats, nurse uniforms. Antimicrobial fabrics, easy-care materials.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Scrub tops and pants</li>
                  <li>• Lab coats and medical jackets</li>
                  <li>• Antimicrobial treatments available</li>
                  <li>• MOQ: 150 pieces per color</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">School Uniforms</h3>
                <p className="text-muted-foreground mb-4">School shirts, pants, skirts, PE uniforms. Durable, comfortable, easy-care fabrics.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Polo shirts and dress shirts</li>
                  <li>• Trousers, skirts, shorts</li>
                  <li>• PE uniforms and tracksuits</li>
                  <li>• MOQ: 100 pieces per item</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <Utensils className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Hospitality & Food Service</h3>
                <p className="text-muted-foreground mb-4">Chef coats, server uniforms, hotel staff wear. Stain-resistant and breathable fabrics.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Chef coats and aprons</li>
                  <li>• Server shirts and vests</li>
                  <li>• Hotel reception uniforms</li>
                  <li>• MOQ: 100 pieces per design</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <HardHat className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Industrial Workwear</h3>
                <p className="text-muted-foreground mb-4">Safety workwear, coveralls, high-visibility clothing. Durable, compliant with safety standards.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Coveralls and boiler suits</li>
                  <li>• High-visibility safety vests</li>
                  <li>• Flame-retardant options</li>
                  <li>• MOQ: 150 pieces per style</li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl shadow-card-hover">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Security & Emergency Services</h3>
                <p className="text-muted-foreground mb-4">Security guard uniforms, paramedic wear, police uniforms. Professional and functional designs.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Security guard shirts and pants</li>
                  <li>• Tactical cargo pants</li>
                  <li>• Reflective striping and badges</li>
                  <li>• MOQ: 100 pieces per uniform</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric Options */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Uniform Fabric Options</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Professional & Corporate Fabrics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Poly-Cotton Blends (65/35, 70/30)</strong>
                      <span className="text-sm text-muted-foreground">Durable, wrinkle-resistant, easy-care, professional appearance.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Oxford Cloth & Poplin</strong>
                      <span className="text-sm text-muted-foreground">Professional dress shirts, crisp finish, breathable.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Twill Weave (Cotton & Poly-Cotton)</strong>
                      <span className="text-sm text-muted-foreground">Durable, diagonal rib pattern, wrinkle-resistant.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Performance Stretch Fabrics</strong>
                      <span className="text-sm text-muted-foreground">Added spandex for mobility and comfort, modern fit.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-secondary">Industrial & Safety Fabrics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Canvas & Duck Cloth</strong>
                      <span className="text-sm text-muted-foreground">Heavy-duty workwear, durable, abrasion-resistant.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">High-Visibility Reflective Materials</strong>
                      <span className="text-sm text-muted-foreground">ANSI/ISEA certified, fluorescent colors, reflective tapes.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Flame-Retardant (FR) Fabrics</strong>
                      <span className="text-sm text-muted-foreground">NFPA 2112 compliant, arc-rated, industrial safety.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl">•</span>
                    <div>
                      <strong className="block mb-1">Antimicrobial & Stain-Resistant</strong>
                      <span className="text-sm text-muted-foreground">For medical, food service, hospitality uniforms.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Uniform Customization Options</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Embroidery</h4>
                <p className="text-sm text-muted-foreground">Company logos, name tags, badges. Left chest, sleeve, back embroidery.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Screen Printing</h4>
                <p className="text-sm text-muted-foreground">Large logo placement, multi-color designs, durable prints.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Custom Colors</h4>
                <p className="text-sm text-muted-foreground">Pantone color matching, brand-specific colors, color-blocking.</p>
              </div>
              <div className="p-6 bg-card rounded-xl text-center">
                <h4 className="font-bold text-lg mb-2">Features</h4>
                <p className="text-sm text-muted-foreground">ID badge loops, utility pockets, reinforced stitching, custom buttons.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Uniform Manufacturing Pricing</h2>
            <div className="bg-card border border-border rounded-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$15-$22</div>
                  <div className="font-semibold mb-2">Basic Uniforms (MOQ 100)</div>
                  <div className="text-sm text-muted-foreground">Polo shirts, simple work shirts, basic pants</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$22-$35</div>
                  <div className="font-semibold mb-2">Professional Wear (MOQ 150)</div>
                  <div className="text-sm text-muted-foreground">Corporate shirts, scrubs, tailored designs</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-3">$35-$55</div>
                  <div className="font-semibold mb-2">Premium/Safety (MOQ 200)</div>
                  <div className="text-sm text-muted-foreground">Blazers, flame-retardant, high-visibility safety wear</div>
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

export default UniformsManufacturer;
