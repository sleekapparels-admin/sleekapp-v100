import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { GraduationCap, Briefcase, Trophy, Palette } from "lucide-react";
import uniformSchoolImage from "@/assets/portfolio/uniform-school-collection.webp";
import uniformSoccerImage from "@/assets/portfolio/uniform-sports-soccer.webp";
import uniformCorporateImage from "@/assets/portfolio/uniform-corporate-polo.webp";
import uniformBasketballImage from "@/assets/portfolio/uniform-sports-basketball.webp";
import productUniforms from "@/assets/factory/product-uniforms-display.webp";
import uniformsProduction from "@/assets/bangladesh-uniforms-production.webp";

const categories = [
  {
    icon: GraduationCap,
    title: "School & Institutional Programs",
    description:
      "Durable, comfortable uniforms for schools, colleges, and institutions. We handle large-volume orders with consistent quality and color matching across reorders.",
    features: ["Blazers & cardigans", "Shirts & polos", "Sweaters & vests", "Custom embroidery"],
  },
  {
    icon: Briefcase,
    title: "Corporate & Promotional Apparel",
    description:
      "Professional branded clothing for corporate teams, events, and promotional campaigns. From polos to jackets, we deliver cohesive corporate identity.",
    features: ["Branded polos", "Business shirts", "Jackets & outerwear", "Logo placement"],
  },
  {
    icon: Trophy,
    title: "Sports Kits & Jerseys",
    description:
      "Performance teamwear for sports clubs, leagues, and athletic programs. Moisture-wicking fabrics and durable construction for active use.",
    features: ["Team jerseys", "Training kits", "Track suits", "Number printing"],
  },
  {
    icon: Palette,
    title: "Decoration Options",
    description:
      "Multiple decoration methods available to bring your branding to life with precision and durability.",
    features: ["Embroidery", "DTF printing", "Screen printing", "Woven labels"],
  },
];

const UniformsTeamwear = () => {
  return (
    <>
      <SEO config={getPageSEO('uniforms')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                  Corporate & School Uniform Manufacturing | Custom Teamwear Bangladesh
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  From educational institutions to corporate teams and sports clubs, we deliver quality uniforms with
                  precision decoration and reliable reorder capability.
                </p>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-1">Bulk Pricing (200+ pieces):</p>
                  <p className="text-2xl font-bold text-secondary">$12 - $35 per piece</p>
                  <p className="text-xs text-muted-foreground mt-1">Volume discounts available for institutional orders</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
                <img src={uniformSchoolImage} alt="School uniforms collection" className="rounded-lg shadow-card-hover" />
                <img src={uniformCorporateImage} alt="Corporate branded apparel" className="rounded-lg shadow-card-hover" />
                <img src={uniformSoccerImage} alt="Sports team jerseys" className="rounded-lg shadow-card-hover" />
                <img src={uniformBasketballImage} alt="Basketball team uniforms" className="rounded-lg shadow-card-hover" />
              </div>
            </div>
          </div>
        </section>

        {/* Factory Showcase */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 opacity-5">
            <img src={uniformsProduction} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Custom Uniforms Production</h2>
                <p className="text-muted-foreground text-lg">
                  Specialized in bulk uniform orders with custom decoration and consistent quality across large quantities.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-card-hover">
                <img src={productUniforms} alt="Uniforms production display" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">
              Uniform Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    className="bg-card border border-border rounded-lg p-8 hover:shadow-card-hover transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{category.title}</h4>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-4">
                      {category.features.map((feature, idx) => (
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

        {/* Reorder Assurance */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Reorder Assurance</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We maintain detailed records of all yarn batches, colors, and specifications to ensure perfect color
              matching and consistency across multiple orders — essential for institutions with ongoing uniform needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Color matching accuracy</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">Record</div>
                <div className="text-sm text-muted-foreground">Batch documentation</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">Easy</div>
                <div className="text-sm text-muted-foreground">Reorder process</div>
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

export default UniformsTeamwear;
