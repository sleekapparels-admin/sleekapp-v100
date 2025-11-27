import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Linkedin, MessageCircle, Award, Users, Globe, CheckCircle, Download } from "lucide-react";
import founderPhoto from "@/assets/founder-photo.jpg";
import { BrochureDownload } from "@/components/BrochureDownload";

const About = () => {
  return (
    <>
      <SEO 
        config={getPageSEO('about')} 
        includeOrganizationSchema 
        includeLocalBusinessSchema 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Sleek Apparels | Ethical Apparel Manufacturing Bangladesh
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Low MOQ. Real Transparency. Innovative Designs.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Bangladesh is the world's second-largest garment exporter, but it's broken for small brands. Sky-high minimums. Zero visibility. Basic designs only. Questionable ethics. We built Sleek Apparels to fix these problems—combining advanced manufacturing technology with genuine flexibility, AI-powered transparency, and design innovation that goes beyond basics.
          </p>
          <BrochureDownload variant="inline" />
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            {/* Founder Photo */}
            <div className="md:col-span-2">
              <div className="sticky top-24">
                <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={founderPhoto}
                    alt="Khondaker Rajiur Rahman - Founder & Managing Director of Sleek Apparels"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Kh Raj Rahman</h3>
                  <p className="text-primary font-semibold mb-3">Founder & Managing Director</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mb-4">
                    <Award className="h-4 w-4" />
                    BBA, Nankai University (China)
                  </p>
                  <div className="flex gap-3">
                    <a 
                      href="https://www.linkedin.com/in/khondaker-rajiur-rahman" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                    >
                      <Linkedin className="h-5 w-5 text-primary" />
                    </a>
                    <a 
                      href="mailto:inquiry@sleekapparels.com"
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                    </a>
                    <a 
                      href="https://wa.me/8801711071684"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
                    >
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Story */}
            <div className="md:col-span-3 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6">The Problem I Set Out to Solve</h2>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  <strong className="text-foreground">Bangladesh's garment industry has a systemic problem:</strong> Small RMG suppliers have tremendous untapped potential, but decades of exploitation have prevented them from developing the skills and facilities they need to compete globally. These manufacturers could deliver quality comparable to major factory groups, but face insurmountable barriers due to banking credit policies, L/C requirements, and back-to-back limitations—combined with a lack of investment in worker training and modern equipment.
                </p>

                <p>
                  The result? These exceptional manufacturers are forced into two equally devastating scenarios: catering exclusively to low-margin local markets, or accepting subcontract work from large export houses at rock-bottom prices that barely cover operational expenses—forget equipment upgrades or worker training programs.
                </p>

                <p>
                  Meanwhile, global fast-fashion giants like H&M, Inditex, Marks & Spencer, and Bestseller maintain their competitive edge through Bangladesh's major factory groups, who in turn exploit smaller subcontractors to maintain their margins. This exploitation creates a vicious cycle: small manufacturers operate on razor-thin margins, can't invest in modernization, and remain perpetually dependent on subcontract work.
                </p>

                <p className="text-lg font-semibold text-foreground">
                  Sleek Apparels aims to dismantle this broken system.
                </p>

                <p>
                  <strong className="text-foreground">Our mission is twofold:</strong> First, to connect quality-focused fashion startups, D2C brands, and smaller buyers directly with these small manufacturers—eliminating the exploitative middlemen. Second, to address the very real challenges that prevent these connections: language barriers, limited digital presence, inadequate management infrastructure, and licensing complexities that make direct export difficult for smaller operations.
                </p>

                <p>
                  These small manufacturers lack the resources for professional management teams, sophisticated English communication, or robust online presence needed to engage international buyers. Sleek Apparels aims to become the bridge—providing the commercial infrastructure, technical communication, skills development support, and market access these manufacturers need to thrive.
                </p>

                <p className="text-lg">
                  <strong className="text-foreground">Why does this matter for buyers?</strong> Fashion startups and emerging D2C brands face their own challenge: they need quality manufacturing at accessible minimums (50-250 pieces), not the 1,000-5,000 piece minimums demanded by volume manufacturers. They're willing to pay fair prices—significantly better than fast-fashion rates—because they compete on quality, innovation, and unique design rather than just price.
                </p>

                <p>
                  Corporate uniforms, school apparel, and team sportswear represent additional untapped opportunities. These segments offer reliable, repeating orders at good margins, but require minimum order flexibility that traditional Bangladeshi manufacturers won't accommodate due to cultural production line setups optimized for volume.
                </p>

                <p className="text-lg font-semibold text-foreground">
                  The perfect market match exists—it just needs proper connection infrastructure.
                </p>

                <p>
                  <strong className="text-foreground">But there's another critical problem:</strong> Bangladesh's garment industry carries a notorious reputation among international buyers for poor lead time adherence, inflexibility during production changes, and lack of transparency. This rigidity stems from technical inadequacy and communication gaps within traditional small manufacturers.
                </p>

                <p>
                  That's why I developed <strong className="text-foreground">LoopTrace™</strong> and integrated AI-powered tools into our platform. These technologies provide real-time production visibility, intelligent quality insights, and transparent communication that addresses legitimate buyer concerns while helping smaller manufacturers demonstrate their capabilities professionally.
                </p>

                <p>
                  Small fashion brands and startups in Western markets compete against major fashion corporations with significantly limited resources. They differentiate through innovation, superior materials, and unique design perspectives. They need manufacturing partners who genuinely understand their constraints, can adapt to their creative vision, and share their commitment to quality over volume.
                </p>

                <p className="text-lg">
                  <strong className="text-foreground">Sleek Apparels exists to serve both sides of this equation:</strong> empowering Bangladesh's exceptional small manufacturers with market access and fair pricing, while giving innovative brands reliable production partnerships that understand their business model and constraints.
                </p>

                <p className="text-muted-foreground italic">
                  We're not trying to compete with the giants serving fast fashion. We're building something fundamentally different: a manufacturing ecosystem where quality, fairness, and innovation replace exploitation, opacity, and volume-at-any-cost mentality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To democratize access to premium apparel manufacturing by eliminating traditional barriers while maintaining uncompromising standards in quality, responsibility, and transparency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become the global benchmark for transparent, technology-enabled apparel manufacturing that empowers emerging brands to compete on quality rather than just volume.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core principles guide every decision and partnership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Radical Transparency</h3>
                <p className="text-muted-foreground">
                  Real-time visibility into every production stage. No hidden processes, no filtered information—just complete clarity from order to delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Technical Excellence</h3>
                <p className="text-muted-foreground">
                  Combining advanced manufacturing technology with skilled craftsmanship to deliver consistent, superior quality across every production run.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Quality Foundation</h3>
                <p className="text-muted-foreground">
                  Fair labor practices, safe working conditions, and environmental responsibility aren't extras—they're baseline requirements for every operation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Sleek Difference
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We're not the right fit for everyone, and that's intentional. If you're seeking the absolute lowest cost regardless of conditions, we're not your manufacturer. If you need thousands of basic units with minimal oversight, there are more efficient options.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            But if you're a brand that values quality, ethics, and transparency—if you need sophisticated production capabilities at accessible minimums—if you want a partner invested in your success rather than just another order number—then Sleek Apparels might be exactly what you've been searching for.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <a 
              href="https://wa.me/8801711071684?text=Hi%20Raj%2C%20I%27d%20like%20to%20start%20a%20project%20with%20Sleek%20Apparels.%20Can%20we%20discuss%20the%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Your Project
            </a>
          </Button>
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
