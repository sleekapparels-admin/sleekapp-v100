import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import casualwearImage from "@/assets/portfolio/knitwear-cardigan-red.webp";
import productDisplay from "@/assets/factory/product-knitwear-display.webp";

const Casualwear = () => {
  return (
    <>
      <SEO config={getPageSEO('casualwear')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                  Custom Casualwear Manufacturing | T-Shirts, Hoodies & More | MOQ 50
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  Premium casualwear manufacturing for global brands. Custom t-shirts, hoodies, sweatshirts, and polo shirts. MOQ from 50 pieces. Ring-spun cotton, organic fabrics, performance blends. Fast sampling 3-7 days. Serving Europe, North America, and worldwide.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    MOQ 50-300 Pieces
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Custom Branding
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    Fast Production
                  </span>
                  <span className="px-5 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    3-7 Day Sampling
                  </span>
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-1">Typical Pricing Range:</p>
                  <p className="text-2xl font-bold text-secondary">$5 - $25 per piece</p>
                  <p className="text-xs text-muted-foreground mt-1">Depending on style, fabric, and quantity</p>
                </div>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
                <img
                  src={casualwearImage}
                  alt="Premium casualwear sample"
                  className="rounded-2xl shadow-card-hover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center text-secondary">
              Product Categories
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* T-Shirts */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">T-Shirts</h3>
                <p className="text-muted-foreground mb-6">
                  Premium t-shirts in various styles and fabrics. Custom fits, colors, and branding options.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Basic crew neck, V-neck, henley, fashion fits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Ring-spun cotton, organic cotton, tri-blends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Weights: 145gsm - 220gsm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 50-200 pieces per style/color</span>
                  </li>
                </ul>
              </div>

              {/* Hoodies */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Hoodies & Sweatshirts</h3>
                <p className="text-muted-foreground mb-6">
                  Comfortable hoodies and sweatshirts with custom designs. Premium fleece and French terry.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Pullover hoodies, zip-up, crewneck sweatshirts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Fleece (280-450gsm), French terry, brushed interior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Features: Kangaroo pockets, ribbed cuffs, drawstrings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 100-300 pieces per style</span>
                  </li>
                </ul>
              </div>

              {/* Polo Shirts */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Polo Shirts</h3>
                <p className="text-muted-foreground mb-6">
                  Classic and performance polo shirts for corporate, casual, and sports applications.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Pique cotton, performance poly, cotton-poly blends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Classic fit, slim fit, ladies tailored fit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Features: Ribbed collar, placket with 2-4 buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 50-200 pieces per style/color</span>
                  </li>
                </ul>
              </div>

              {/* Joggers */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Joggers & Athletic Pants</h3>
                <p className="text-muted-foreground mb-6">
                  Comfortable joggers and athletic pants for lifestyle and performance wear.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Fleece joggers, French terry, athletic performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Tapered fit, straight fit, slim fit options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Features: Elastic waistband, drawstring, zippered pockets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 100-500 pieces per style</span>
                  </li>
                </ul>
              </div>

              {/* Activewear */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Performance Activewear</h3>
                <p className="text-muted-foreground mb-6">
                  Technical fabrics and athletic construction for performance wear and sports applications.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Moisture-wicking tees, athletic shorts, compression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Performance fabrics: Polyester, nylon, spandex blends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Features: 4-way stretch, quick-dry, anti-odor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 100-500 pieces per style</span>
                  </li>
                </ul>
              </div>

              {/* Uniforms */}
              <div className="p-8 bg-card rounded-2xl shadow-card-hover hover:shadow-card-hover transition-shadow">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Uniforms & Teamwear</h3>
                <p className="text-muted-foreground mb-6">
                  Corporate, school, and sports uniforms with custom branding and consistent quality.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Corporate polo shirts, team jerseys, PE kits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Custom branding: Embroidery, screen print, heat transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">Consistent sizing and color matching across orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">•</span>
                    <span className="text-sm">MOQ: 50-200 pieces depending on complexity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabric & Customization Options */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center text-secondary">
              Fabric & Customization Options
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Fabric Options */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-secondary">Available Fabrics</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Cotton & Natural Fibers</h4>
                    <p className="text-sm text-muted-foreground">Ring-spun cotton, organic cotton, combed cotton, cotton-poly blends</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Performance Fabrics</h4>
                    <p className="text-sm text-muted-foreground">Moisture-wicking polyester, stretch materials, quick-dry, anti-odor treatments</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Premium Finishes</h4>
                    <p className="text-sm text-muted-foreground">French terry, brushed fleece, heavyweight cotton, tri-blend fabrics</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Sustainable Options</h4>
                    <p className="text-sm text-muted-foreground">Organic certified cotton, recycled polyester, eco-friendly dyeing processes</p>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-secondary">Branding & Customization</h3>
                <div className="space-y-4">
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Screen Printing</h4>
                    <p className="text-sm text-muted-foreground">Multi-color prints, water-based inks, plastisol, discharge printing, oversized prints</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Embroidery</h4>
                    <p className="text-sm text-muted-foreground">Chest logos, sleeve embroidery, 3D puff, appliqué, custom thread colors</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Heat Transfer & DTG</h4>
                    <p className="text-sm text-muted-foreground">Full-color designs, photo-realistic prints, heat transfer vinyl, direct-to-garment</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">Labels & Tags</h4>
                    <p className="text-sm text-muted-foreground">Woven labels, printed labels, hang tags, size labels, care instructions</p>
                  </div>
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

export default Casualwear;
