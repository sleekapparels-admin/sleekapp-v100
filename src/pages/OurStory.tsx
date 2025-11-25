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
                <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mb-6">
                  <Award className="h-4 w-4" />
                  Nankai University, Tianjin • International Trade & RMG Specialist • 5+ Years in Apparel Manufacturing
                </p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I started Sleek Apparels after seeing too many small brands hit the same wall: 500-1,000 piece MOQs that killed their ability to test designs or manage cash flow. The RMG industry in Bangladesh is built for volume players—big retailers placing orders in the tens of thousands. But there's a massive gap for emerging brands who need quality production without betting their entire budget on one style.
                  </p>
                  <p>
                    My background in international trade gave me exposure to global supply chains and quality standards. I saw how proper tech pack development, fabric inspection protocols, and construction specifications could elevate production quality—but these were only accessible to brands placing massive orders. We built Sleek Apparels to bring that same rigor to low-MOQ production runs.
                  </p>
                  <p>
                    I personally review every inquiry that comes in. Not because we're small, but because fit matters. Some buyers want FOB pricing and minimal touchpoints. Others need help with grading, sampling iterations, or WRAP compliance documentation. I'd rather turn down work that doesn't match our capabilities than deliver something mediocre. Every tech pack, every pre-production sample, every shipment—it has my name on it.
                  </p>
                  <p>
                    Our approach isn't revolutionary—it's just focused. We run 50-100 piece production runs with the same attention to construction details, stitch consistency, and fabric testing that factories normally reserve for 5,000-piece orders. We've built relationships with mills that'll accommodate smaller fabric minimums. And we maintain GOTS and Oeko-Tex certifications so brands don't have to compromise on sustainability or compliance just because they're starting small.
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
