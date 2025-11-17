import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Activity, Bell, Camera, TrendingUp, Eye, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LoopTraceTechnology = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Production Tracking",
      description: "See exactly where your order is in the production pipeline. From cutting to packing, live updates every step of the way.",
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Automated photo capture at key milestones: pattern approval, first piece, mid-production, and final inspection.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get instant alerts when your order moves to the next stage or if any delays are anticipated. No more guessing.",
    },
    {
      icon: TrendingUp,
      title: "Quality Prediction AI",
      description: "Our AI analyzes historical data to predict potential quality issues before they happen, reducing defect rates by 40%.",
    },
    {
      icon: Eye,
      title: "Transparency Reports",
      description: "Detailed audit trails showing material sourcing, labor compliance, and environmental impact for each order.",
    },
    {
      icon: Lock,
      title: "Secure Client Portal",
      description: "Your own dashboard with order history, invoices, and direct messaging with production team. All data encrypted.",
    },
  ];

  const benefits = [
    {
      metric: "73%",
      label: "Faster Communication",
      description: "Reduce email back-and-forth with instant dashboard updates",
    },
    {
      metric: "40%",
      label: "Fewer Defects",
      description: "AI-powered quality prediction catches issues early",
    },
    {
      metric: "2.5x",
      label: "More Transparency",
      description: "Compared to traditional manufacturing communication",
    },
    {
      metric: "100%",
      label: "Order Visibility",
      description: "Know exactly where your production stands, 24/7",
    },
  ];

  return (
    <>
      <SEO 
        config={{
          title: "LoopTrace™ Technology | AI Production Tracking",
          description: "Real-time order tracking with AI quality prediction. Photo documentation, smart alerts, transparency reports. See your production live.",
          canonical: "/looptrace-technology"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <Badge variant="secondary" className="mb-4">Technology</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                LoopTrace™: AI-Powered Production Visibility
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-8">
                Stop wondering where your order is. LoopTrace™ gives you real-time insights into your production with AI-powered quality prediction and full transparency.
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-6 w-6 text-green-400" />
                      <span className="font-semibold">Order #SLK-2047</span>
                    </div>
                    <Badge className="bg-green-500 text-white">In Production</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-400">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">✓</div>
                      <span>Materials sourced — Organic cotton, 12GG</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-400">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">✓</div>
                      <span>Cutting complete — 500 pieces</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-400">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">↻</div>
                      <span className="font-semibold">Knitting in progress — 67% complete</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">◯</div>
                      <span>Linking & finishing — Pending</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">◯</div>
                      <span>Quality inspection — Pending</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-700 text-sm">
                    <p className="text-slate-300">Estimated completion: <span className="text-green-400 font-semibold">3 days ahead of schedule</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">Powerful Features, Simple Interface</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="animate-fade-up hover-scale" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary inline-block">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-secondary">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Stats */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-secondary">Proven Results for Our Clients</h2>
              <p className="text-xl text-muted-foreground">Data from 500+ tracked orders in 2024</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.label} className="text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-8">
                    <div className="text-5xl font-bold text-primary mb-2">{benefit.metric}</div>
                    <div className="text-lg font-semibold mb-2 text-secondary">{benefit.label}</div>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center text-secondary">How It Works</h2>
            <div className="space-y-8">
              <Card className="animate-fade-up">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-secondary">Order Confirmed</h3>
                      <p className="text-muted-foreground">As soon as your order is confirmed, you receive login credentials to your secure LoopTrace™ dashboard.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "100ms" }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-secondary">Automated Updates</h3>
                      <p className="text-muted-foreground">Our factory floor sensors and manager inputs trigger automatic status updates. You see progress in real-time.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-secondary">AI Quality Check</h3>
                      <p className="text-muted-foreground">Our AI compares your order against historical data to predict and prevent quality issues before they escalate.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="animate-fade-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-secondary">Delivery & Archive</h3>
                      <p className="text-muted-foreground">Once shipped, full production records are archived in your account for future reorders and compliance audits.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-2xl font-semibold text-secondary mb-6">
              "LoopTrace™ transformed how we work with overseas manufacturers. We went from weekly status emails to daily automated updates. Game changer for our small team."
            </blockquote>
            <p className="text-muted-foreground">
              — <span className="font-semibold">Emma Lindström</span>, Founder of Nordic Knitwear Co. (Stockholm)
            </p>
          </div>
        </section>

        <CTASection />
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default LoopTraceTechnology;
