import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { Users, Leaf, Zap, TrendingUp } from "lucide-react";
import sustainableMaterialsImg from "@/assets/sustainable-materials.webp";
import workerSafetyImg from "@/assets/worker-safety.webp";
import qcInspectionImg from "@/assets/qc-inspection.webp";
import fabricTextureImg from "@/assets/backgrounds/fabric-texture-sustainable.webp";

const principles = [
  {
    icon: Users,
    title: "Worker Safety & Fair Compensation",
    description:
      "We maintain safe working conditions with proper ventilation, ergonomic workstations, and fair wages above industry standards. Our team members receive regular training and health support.",
  },
  {
    icon: Leaf,
    title: "Yarn Traceability & Waste Minimization",
    description:
      "We source traceable yarns from verified suppliers and implement cutting optimization to minimize fabric waste. Offcuts are repurposed or recycled whenever possible.",
  },
  {
    icon: Zap,
    title: "Energy Efficiency & Machine Maintenance",
    description:
      "Our computerized machines are regularly maintained for optimal efficiency, reducing energy consumption and ensuring consistent quality with minimal rework.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement & Transparency",
    description:
      "We document our processes, track our improvements, and share progress openly with our clients. Sustainability is a journey, not a destination.",
  },
];

const materials = [
  { name: "Organic Cotton", description: "GOTS-certified organic cotton yarns" },
  { name: "Bamboo", description: "Renewable bamboo fibers" },
  { name: "RPET", description: "Recycled polyester from post-consumer bottles" },
  { name: "Responsible Wool", description: "Ethically sourced merino wool" },
];

const Sustainability = () => {
  return (
    <>
      <SEO config={getPageSEO('sustainability')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Ethical Manufacturing & Responsible Production in Practice
              </h1>
              <p className="text-xl text-muted-foreground">
                Sustainability isn't just a buzzword for us — it's woven into every step of our manufacturing process, from yarn selection to final shipment.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.title}
                    className="bg-card border border-border rounded-lg p-8 hover:shadow-card-hover transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{principle.title}</h3>
                        <p className="text-muted-foreground">{principle.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sustainable Materials */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={fabricTextureImg} 
              alt="Sustainable fabric texture" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/85"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Sustainable Materials We Work With</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We partner with verified suppliers to source eco-friendly yarns without compromising on quality or performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {materials.map((material, index) => (
                <div
                  key={material.name}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-card hover:border-primary/30 transition-all animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{material.name}</h3>
                  <p className="text-sm text-muted-foreground">{material.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Evidence Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">See Our Commitment in Action</h2>
              <p className="text-muted-foreground">Real images from our facilities and processes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative h-80 rounded-lg overflow-hidden group">
                <img src={sustainableMaterialsImg} alt="Sustainable materials" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Eco-Friendly Materials</h3>
                    <p className="text-sm text-muted-foreground">Organic cotton, bamboo, and recycled yarns</p>
                  </div>
                </div>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden group">
                <img src={workerSafetyImg} alt="Worker safety" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Worker Safety First</h3>
                    <p className="text-sm text-muted-foreground">Training, protective equipment, fair conditions</p>
                  </div>
                </div>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden group">
                <img src={qcInspectionImg} alt="Quality control" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Rigorous Quality Checks</h3>
                    <p className="text-sm text-muted-foreground">Every garment inspected to AQL 2.5 standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Commitment */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Transparency Commitment</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We believe in open communication and accountability. When you work with Sleek Apparels, you're not just getting a product — you're getting a partner who's committed to ethical practices and continuous improvement.
            </p>
            <div className="bg-card border border-border rounded-lg p-8 text-left">
              <p className="text-foreground italic">
                "We document our processes, maintain records of our yarn sources, and welcome questions about our practices. Transparency builds trust, and trust builds lasting partnerships."
              </p>
              <p className="text-sm text-muted-foreground mt-4">— Sleek Apparels Team</p>
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

export default Sustainability;
