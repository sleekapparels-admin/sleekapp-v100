import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Users, DollarSign } from "lucide-react";

const SuccessStories = () => {
  const caseStudies = [
    {
      title: "School Uniform: Thailand Buyer",
      client: "International School, Bangkok",
      category: "Education",
      challenge: "Needed 200 custom school uniforms with specific tropical-friendly fabric requirements and tight budget constraints.",
      solution: "Our CEO recommended switching from 100% cotton to a moisture-wicking cotton-poly blend better suited for Bangkok's climate. This alternative saved $700 on the order while improving comfort.",
      results: [
        "35% cost savings ($700 on 200 units)",
        "Better fabric for tropical climate",
        "Reordered 500 more units next semester",
        "Now a recurring client for 3 years"
      ],
      metrics: {
        savings: "$700",
        reorderRate: "3x larger",
        satisfaction: "5/5 stars"
      }
    },
    {
      title: "Fashion Startup: Cashmere Alternative",
      client: "LA-based Fashion Brand",
      category: "Fashion",
      challenge: "Startup couldn't afford $120/pc cashmere cardigans for their launch collection but wanted luxury hand feel.",
      solution: "We showed microfiber cashmere-feel yarn at $55/pc with 90% same hand feel. Helped them launch on budget while maintaining perceived quality.",
      results: [
        "54% cost reduction per piece",
        "Successfully launched with 100 units",
        "Positive customer feedback on quality",
        "Came back for 1000-unit reorder"
      ],
      metrics: {
        savings: "54%",
        growth: "100 → 1000 units",
        satisfaction: "5/5 stars"
      }
    },
    {
      title: "Corporate Wear: Logo Consistency",
      client: "Multinational Corporation",
      category: "Corporate",
      challenge: "Needed 2000 company uniforms with perfect logo consistency across all batches. Previous supplier had color matching issues.",
      solution: "Recommended premium embroidery thread and implemented batch-by-batch color approval process. Used LoopTrace™ for real-time quality monitoring.",
      results: [
        "Zero complaints on logo quality",
        "Perfect color consistency across batches",
        "Now orders quarterly (8000+ units/year)",
        "Recommended us to sister companies"
      ],
      metrics: {
        defectRate: "0%",
        retention: "Quarterly reorders",
        satisfaction: "5/5 stars"
      }
    },
    {
      title: "Nordic Fashion Brand: MOQ Flexibility",
      client: "Stockholm-based Boutique",
      category: "Fashion",
      challenge: "Wanted to test 5 new designs but couldn't meet 500-piece MOQs at other factories. Limited capital for large inventory risk.",
      solution: "Our 50-piece MOQ allowed them to test 75 pieces per design (375 total). Iterative approach let them refine designs based on customer feedback.",
      results: [
        "Successfully tested 5 designs",
        "2 designs became bestsellers",
        "Scaled successful styles to 500+ units",
        "Avoided $15k in dead inventory"
      ],
      metrics: {
        moqSavings: "90% lower MOQ",
        inventoryRisk: "$15k avoided",
        satisfaction: "5/5 stars"
      }
    },
    {
      title: "Sports Team: Custom Jerseys Rush Order",
      client: "Dublin-based Heritage Sports",
      category: "Sports",
      challenge: "Needed 150 custom team jerseys in 20 days for championship season. Previous supplier said impossible.",
      solution: "Fast-tracked production with dedicated line. Used Loop AI for instant quote and specifications. Delivered in 18 days with perfect quality.",
      results: [
        "Delivered 2 days early",
        "Team won championship wearing jerseys",
        "Now orders all team apparel from us",
        "Referred 3 other sports teams"
      ],
      metrics: {
        speed: "18 days",
        defectRate: "0%",
        satisfaction: "5/5 stars"
      }
    },
    {
      title: "Ethical Brand: Compliance Documentation",
      client: "Berlin-based Conscious Clothing",
      category: "Sustainable Fashion",
      challenge: "Needed verifiable ethical sourcing proof for EU market. Skeptical about Bangladesh factories' claims.",
      solution: "Provided full ISO 9001, WRAP, GOTS certification documentation. Offered factory tour via video call. Used LoopTrace™ for real-time compliance tracking.",
      results: [
        "Successfully passed EU compliance audits",
        "Featured our partnership in marketing",
        "Orders increased 200% in 1 year",
        "Became brand ambassador for us"
      ],
      metrics: {
        growth: "200%",
        compliance: "100% verified",
        satisfaction: "5/5 stars"
      }
    }
  ];

  return (
    <>
      <SEO config={{
        title: "Success Stories - Real Client Case Studies | Sleek Apparels",
        description: "Read real success stories from fashion brands, schools, and corporate clients who used our low-MOQ manufacturing. See how we helped save 30-40% while maintaining quality.",
        keywords: "case studies, success stories, client testimonials, manufacturing results, fashion brand stories",
        canonical: "https://sleek-apparels.com/success-stories"
      }} />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Success Stories</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Real Results from Real Clients
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From fashion startups to multinational corporations - see how we've helped brands succeed with low-MOQ manufacturing from Bangladesh
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Brands Served</div>
              </Card>
              <Card className="p-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </Card>
              <Card className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">35%</div>
                <div className="text-sm text-muted-foreground">Avg Cost Savings</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Reorder Rate</div>
              </Card>
            </div>

            {/* Case Studies */}
            <div className="space-y-8">
              {caseStudies.map((study, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">{study.category}</Badge>
                        <h2 className="text-2xl font-bold">{study.title}</h2>
                        <p className="text-muted-foreground">{study.client}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-bold mb-3 text-destructive">Challenge:</h3>
                        <p className="text-muted-foreground mb-6">{study.challenge}</p>
                        
                        <h3 className="font-bold mb-3 text-primary">Our Solution:</h3>
                        <p className="text-muted-foreground mb-6">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-3">Results:</h3>
                        <ul className="space-y-2 mb-6">
                          {study.results.map((result, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <span className="text-primary text-xl">✓</span>
                              <span className="text-muted-foreground">{result}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-bold mb-3 text-sm">Key Metrics:</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {Object.entries(study.metrics).map(([key, value]) => (
                              <div key={key}>
                                <div className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="font-bold text-primary">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <Card className="mt-16 p-8 text-center bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join 50+ brands who've transformed their manufacturing with our low-MOQ approach. Get started with a free quote or consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/quote-generator">Get AI Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/consultation">Book Free Consultation</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default SuccessStories;
