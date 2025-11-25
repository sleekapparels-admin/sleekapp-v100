import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { BrochureDownload } from "@/components/BrochureDownload";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Globe, Award, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Brochure = () => {
  return (
    <>
      <SEO 
        config={{
          title: "Company Brochure - Sleek Apparels | Manufacturing Overview & Capabilities",
          description: "Download our comprehensive company brochure. Learn about our business operations, unique selling points, manufacturing capabilities, certifications, quality standards, and global reach.",
          keywords: "company brochure, manufacturing overview, business capabilities, apparel manufacturer Bangladesh, knitwear production guide, ethical manufacturing documentation",
          canonical: "https://sleekapparels.com/brochure",
          ogTitle: "Company Brochure | Sleek Apparels Manufacturing",
          ogDescription: "Comprehensive overview of our manufacturing operations, capabilities, and unique selling points.",
          ogImage: "https://sleekapparels.com/og-image.jpg",
          ogType: "website",
        }} 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-secondary/20 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">Company Resources</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Download Our Company Brochure
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive guide to Sleek Apparels' business operations, manufacturing capabilities, unique selling points, and value proposition.
            </p>
          </div>
        </section>

        {/* Main Download Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <BrochureDownload variant="card" />
          </div>
        </section>

        {/* What's Inside */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Inside</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about working with Sleek Apparels
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "About Sleek Apparels",
                  description: "Company history, mission, vision, and the problems we solve for brands globally"
                },
                {
                  icon: TrendingUp,
                  title: "Unique Selling Points",
                  description: "Low MOQ, LoopTrace™ transparency, fast production, technical excellence, ethical manufacturing"
                },
                {
                  icon: CheckCircle,
                  title: "How It Works",
                  description: "3-step process from quote to delivery with real-time tracking at every stage"
                },
                {
                  icon: Award,
                  title: "Quality & Certifications",
                  description: "ISO 9001, WRAP, GOTS, Fair Trade certifications with AQL 2.5 quality standards"
                },
                {
                  icon: Globe,
                  title: "Product Capabilities",
                  description: "Knitwear, custom apparel, uniforms, private label with technical specifications"
                },
                {
                  icon: Users,
                  title: "Success Metrics",
                  description: "50+ brands served, 10,000+ products delivered, 15+ countries, 98.5% on-time delivery"
                },
              ].map((item, idx) => (
                <Card key={idx} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Highlights */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Highlights</h2>
              <p className="text-lg text-muted-foreground">
                Why global brands choose Sleek Apparels
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Revolutionary low MOQ starting from 50 pieces",
                "Industry-first LoopTrace™ AI-powered real-time tracking",
                "Fast 10-20 day production timeline",
                "Advanced flat knitting with multi-gauge capabilities",
                "Certified ethical manufacturing (ISO 9001, WRAP, GOTS)",
                "Direct access to founder and decision-makers",
                "Bangladesh efficiency + China sourcing excellence",
                "Serving 15+ countries with 98.5% on-time delivery",
              ].map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect For</h2>
              <p className="text-lg text-muted-foreground">
                Who should download this brochure?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Business Decision Makers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Procurement managers evaluating suppliers</li>
                    <li>• Brand owners seeking manufacturing partners</li>
                    <li>• Investors assessing business capabilities</li>
                    <li>• Supply chain directors exploring options</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Design & Merchandising Teams</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Fashion designers planning collections</li>
                    <li>• Technical designers reviewing capabilities</li>
                    <li>• Merchandisers evaluating production options</li>
                    <li>• Sustainability teams checking certifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-16 px-4 bg-secondary text-secondary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Learn More?
            </h2>
            <p className="text-lg mb-8 opacity-95">
              Download our comprehensive company brochure and discover why 50+ brands across 15+ countries trust Sleek Apparels for their manufacturing needs.
            </p>
            <BrochureDownload variant="inline" className="border-2 border-white/30 text-white hover:bg-white/10" />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Brochure;
