import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Heart, Users, Award, TrendingUp } from "lucide-react";

import factoryFloor from "@/assets/factory/wide-factory-floor.webp";
import teamwork from "@/assets/factory/teamwork-production.webp";

const values = [
  {
    icon: Heart,
    title: "Ethical Manufacturing",
    description: "Fair wages, safe conditions, and respect for every worker in our supply chain."
  },
  {
    icon: Users,
    title: "Partnership Approach",
    description: "We treat every client as a long-term partner, not just a transaction."
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description: "Uncompromising standards in materials, craftsmanship, and finished products."
  },
  {
    icon: TrendingUp,
    title: "Flexible Growth",
    description: "Low MOQs and scalable production to grow alongside your brand."
  }
];

const OurStory = () => {
  return (
    <>
      <SEO config={getPageSEO('about')} />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Our Story: Crafting Quality, Building Trust
            </h1>
            <p className="text-xl text-muted-foreground">
              Pioneering ethical apparel manufacturing through strategic innovation, combining China's technical excellence with Bangladesh's manufacturing expertise to serve quality-conscious brands worldwide.
            </p>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-foreground text-center">Kh Raj Rahman</h2>
                <p className="text-xl text-primary mb-6 text-center">Founder & Managing Director</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap justify-center mb-6">
                  <Award className="h-4 w-4" />
                  Apparel Manufacturing Consultant | Knitwear Specialist
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg font-semibold text-foreground">
                    "I founded Sleek Apparels with a vision to address a fundamental injustice in Bangladesh's garment industry."
                  </p>
                  <p>
                    Countless small RMG suppliers in Bangladesh have tremendous potential, but decades of exploitation have prevented investment in worker training and modern facilities. While they could compete globally with proper support, they remain systematically excluded from international markets due to banking credit barriers, L/C requirements, and minimum order inflexibility—compounded by a lack of skills and infrastructure development.
                  </p>
                  <p>
                    These manufacturers are trapped in a devastating cycle: relegated to low-margin local markets or accepting rock-bottom subcontract pricing from large export houses serving fast-fashion giants like H&M, Inditex, and Marks & Spencer. The margins are so compressed they can barely cover operational costs, let alone invest in equipment upgrades or worker training.
                  </p>
                  <p>
                    Meanwhile, fashion startups, D2C brands, and quality-focused smaller buyers struggle to source from Bangladesh. These innovative brands need accessible minimums (50-250 pieces), not the 1,000+ piece requirements of volume manufacturers. They're willing to pay fair prices—significantly better than fast-fashion rates—because they compete on quality and innovation, not just cost.
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    The perfect market match exists. It just needs proper connection infrastructure.
                  </p>
                  <p>
                    My background at Nankai University in international trade and supply chain management revealed how technical excellence, proper communication infrastructure, and transparent operations could transform manufacturing partnerships. But these capabilities were only accessible to brands placing massive orders.
                  </p>
                  <p>
                    Sleek Apparels aims to bridge this gap. Our goal is to provide small manufacturers with professional management infrastructure, technical communication capabilities, skills development support, and the digital market presence they need to engage international buyers directly. We work to eliminate exploitative middlemen while addressing legitimate buyer concerns about reliability and transparency.
                  </p>
                  <p>
                    That's why we developed LoopTrace™ and integrated AI-powered tools—providing real-time production visibility and intelligent quality insights that address Bangladesh's reputation challenges while showcasing these manufacturers' true capabilities.
                  </p>
                  <p>
                    I personally evaluate every partnership inquiry. Not because we're small, but because alignment matters. We're selective about both the manufacturers we work with and the buyers we serve. This ensures sustainable, fair relationships where quality and ethics aren't compromised for volume.
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    We're not competing with giants serving fast fashion. Our vision is to build something fundamentally different: a manufacturing ecosystem where quality, fairness, and innovation can replace exploitation, opacity, and volume-at-any-cost mentality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What Drives Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src={factoryFloor} 
                  alt="Modern knitwear production facility at Sleek Apparels"
                  className="rounded-lg shadow-2xl w-full h-auto"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Facilities</h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  Our 45,000 sq ft production facility in Dhaka, Bangladesh houses state-of-the-art knitting machines, linking equipment, washing facilities, and quality control labs. We employ over 200 skilled workers who are paid fair wages and work in safe, climate-controlled conditions.
                </p>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  We specialize in:
                </p>
                <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2 mb-4">
                  <li>Premium knitwear (sweaters, cardigans, polo shirts)</li>
                  <li>Cut & sew garments (t-shirts, hoodies, jackets)</li>
                  <li>Custom uniforms (corporate, school, sports)</li>
                  <li>Sustainable and organic collections</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Culture */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Team & Culture</h2>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  At Sleek Apparels, we believe our people are our greatest asset. We invest heavily in training, skills development, and worker welfare programs. Our team includes experienced pattern makers, quality controllers, production managers, and skilled machine operators—many who have been with us since the beginning.
                </p>
                <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                  We maintain a collaborative, respectful workplace culture where every voice matters. Regular feedback sessions, fair grievance mechanisms, and transparent communication ensure our team feels valued and empowered.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This commitment to our people translates directly to the quality and consistency you see in every garment we produce.
                </p>
              </div>
              <div>
                <img 
                  src={teamwork} 
                  alt="Sleek Apparels team collaborating on garment production"
                  className="rounded-lg shadow-2xl w-full h-auto"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Certifications & Compliance</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We don't just talk about ethics and quality—we back it up with internationally recognized certifications:
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 border rounded-lg">
                <p className="font-bold">ISO 9001</p>
                <p className="text-sm text-muted-foreground">Quality Management</p>
              </div>
              <div className="p-6 border rounded-lg">
                <p className="font-bold">WRAP</p>
                <p className="text-sm text-muted-foreground">Ethical Production</p>
              </div>
              <div className="p-6 border rounded-lg">
                <p className="font-bold">GOTS</p>
                <p className="text-sm text-muted-foreground">Organic Textiles</p>
              </div>
              <div className="p-6 border rounded-lg">
                <p className="font-bold">Oeko-Tex</p>
                <p className="text-sm text-muted-foreground">Product Safety</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey With Us?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of brands who trust Sleek Apparels for ethical, quality manufacturing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-foreground text-base font-medium rounded-md text-primary-foreground hover:bg-primary-foreground hover:text-primary transition"
              >
                Request a Quote
              </a>
              <a 
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-foreground text-base font-medium rounded-md bg-primary-foreground text-primary hover:bg-transparent hover:text-primary-foreground transition"
              >
                View Our Work
              </a>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default OurStory;
