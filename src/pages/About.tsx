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
            Built to Solve What Bangladesh Gets Wrong
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
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Photo & Contact */}
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={founderPhoto} 
                  alt="Kh Raj Rahman - Founder & Managing Director"
                  className="w-full rounded-lg shadow-xl"
                  onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                />
              </div>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Connect With Our Founder</h3>
                  
                  <div className="space-y-3">
                    <a 
                      href="mailto:raj@sleekapparels.com"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>raj@sleekapparels.com</span>
                    </a>
                    
                    <a 
                      href="https://wa.me/8801711071684?text=Hi%20Raj%2C%20I%27d%20like%20to%20schedule%20a%20consultation%20regarding%20apparel%20manufacturing."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>WhatsApp</span>
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/md-sleekbd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                  
                  <Button asChild className="w-full mt-4">
                    <a 
                      href="https://wa.me/8801711071684?text=Hi%20Raj%2C%20I%27d%20like%20to%20schedule%20a%20consultation%20to%20discuss%20my%20project%20requirements%20and%20technical%20specifications.%20When%20would%20be%20a%20good%20time%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Schedule Consultation
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Limited availability—project evaluation required
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Story */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Kh Raj Rahman</h2>
                <p className="text-xl text-primary mb-3">Founder & Managing Director</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                  <Award className="h-4 w-4" />
                  Nankai University • 5+ Years Manufacturing Leadership • International Trade Specialist
                </p>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Sleek Apparels was born from a fundamental gap I observed in the apparel manufacturing industry. The market had split into two extremes: massive fast-fashion manufacturers handling volume orders with compressed margins, and a vast underserved segment of quality-conscious brands unable to access premium production due to inflexible minimum order requirements.
                </p>

                <p>
                  This opportunity crystallized during my graduate studies at Nankai University in Tianjin, one of China&apos;s leading institutions for international commerce and supply chain management. Embedded within China&apos;s vertically integrated textile ecosystem, I cultivated expertise in garment engineering, production planning, and quality systems while establishing strategic vendor partnerships with Tier 1 OEM facilities and specialized fabric converters—supply chain access typically unavailable through traditional sourcing channels.
                </p>

                <p>
                  The concept was straightforward yet untested: leverage China's material sourcing excellence and technical sophistication while executing production in Bangladesh's cost-efficient manufacturing environment. This hybrid model would enable us to serve the premium-quality segment at accessible minimums—typically 50-100 pieces versus the industry standard of 500-1000.
                </p>

                <p>
                  What distinguishes Sleek Apparels is not just reduced minimums, but our fundamental operating philosophy. We've eliminated the conventional sales team structure. Instead, I personally evaluate and engage with each potential partnership, ensuring alignment between client expectations and our production capabilities before commitment.
                </p>

                <p>
                  This selective approach creates a foundation of transparency and accountability. Our clients work directly with decision-makers who understand both the technical requirements and strategic implications of their projects. There are no intermediaries diluting communication or obscuring production realities.
                </p>

                <p>
                  The introduction of LoopTrace™ represents the logical evolution of this transparency commitment. Rather than periodic updates filtered through account managers, our clients access real-time production visibility, AI-powered quality insights, and granular tracking from raw materials through final shipment.
                </p>

                <p>
                  We've deliberately positioned ourselves between conventional manufacturing and full-service development partnerships. For brands seeking a responsive production partner who can execute sophisticated designs at reasonable minimums without sacrificing quality or standards—Sleek Apparels offers a proven alternative to the traditional volume-or-nothing paradigm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
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
