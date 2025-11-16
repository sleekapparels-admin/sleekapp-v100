import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ScrollRevealSection } from "@/components/ScrollRevealSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import { usePerformanceMonitoring, useResourcePreloading } from "@/hooks/usePerformance";
import { Factory, TrendingUp, Package, Globe, Video, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { BrochureDownload } from "@/components/BrochureDownload";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

// Lazy load AI assistant for better initial page load
const ConversationalAssistant = lazy(() => import("@/components/ConversationalAssistant").then(m => ({ default: m.ConversationalAssistant })));

function Index() {
  // Performance and analytics tracking
  usePageTracking('home');
  
  // Performance monitoring (hooks handle dev/prod logic internally)
  usePerformanceMonitoring();
  useResourcePreloading();
  
  return (
    <>
      <SEO 
        config={getPageSEO('home')} 
        includeOrganizationSchema 
        includeLocalBusinessSchema 
        includeServiceSchema 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        
        {/* Section 2: Social Proof - Visual with Interactive Map */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Trusted Globally</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Brands Across 15+ Countries</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From fashion startups in Stockholm to schools in Bangkok, we deliver quality apparel worldwide
                </p>
              </div>

              {/* Animated Stats Counter */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-6 hover-scale">
                  <CardContent className="pt-6">
                    <AnimatedCounter 
                      value={50} 
                      suffix="+" 
                      className="text-5xl font-bold text-primary mb-2"
                    />
                    <div className="text-muted-foreground">Brands Served</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6 hover-scale">
                  <CardContent className="pt-6">
                    <AnimatedCounter 
                      value={10000} 
                      suffix="+" 
                      className="text-5xl font-bold text-primary mb-2"
                    />
                    <div className="text-muted-foreground">Products Delivered</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6 hover-scale">
                  <CardContent className="pt-6">
                    <AnimatedCounter 
                      value={15} 
                      suffix="+" 
                      className="text-5xl font-bold text-primary mb-2"
                    />
                    <div className="text-muted-foreground">Countries Worldwide</div>
                  </CardContent>
                </Card>
              </div>

              {/* Country Flags / Testimonials */}
              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { country: "🇺🇸 USA", testimonial: "Amazing quality!" },
                  { country: "🇬🇧 UK", testimonial: "Fast delivery" },
                  { country: "🇸🇪 Sweden", testimonial: "Low MOQ perfect" },
                  { country: "🇹🇭 Thailand", testimonial: "Great service" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-2">{item.country}</div>
                    <p className="text-sm text-muted-foreground italic">"{item.testimonial}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>


        {/* Section 3: How It Works - 3 Step Timeline with Scroll Animations */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Simple Process</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From quote to delivery in 3 simple steps
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Timeline connector line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-primary/20" style={{ width: '80%', left: '10%' }} />
              
              {[
                {
                  step: "01",
                  icon: Package,
                  title: "Get Quote",
                  description: "Chat with Loop AI or book a consultation. Get instant pricing for your custom apparel.",
                  cta: "Start Quote",
                  link: "/quote-generator"
                },
                {
                  step: "02",
                  icon: Factory,
                  title: "We Produce",
                  description: "Track your order in real-time with LoopTrace™. See photos & updates at every stage.",
                  cta: "See Tracking Demo",
                  link: "/how-it-works"
                },
                {
                  step: "03",
                  icon: TrendingUp,
                  title: "Receive Quality Products",
                  description: "Fast delivery to 15+ countries. Quality-checked before shipping. 10-20 day production.",
                  cta: "View Success Stories",
                  link: "/success-stories"
                },
              ].map((item, idx) => (
                <ScrollRevealSection key={idx} className="relative z-10" parallaxSpeed={30 + idx * 10}>
                  <Card className="h-full hover-scale">
                    <CardContent className="p-6">
                      <motion.div 
                        className="text-5xl font-bold text-primary/20 mb-4"
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                      >
                        {item.step}
                      </motion.div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <Button asChild variant="link" className="p-0">
                        <Link to={item.link} className="flex items-center gap-2">
                          {item.cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </ScrollRevealSection>
              ))}
            </div>

            <AnimatedSection className="text-center mt-12">
              <Button asChild size="lg" variant="gold">
                <Link to="/quote-generator">Start Your Order →</Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>

        {/* Section 4: LoopTrace™ Feature - Visual Demo with Parallax */}
        <section className="py-16 bg-muted/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollRevealSection parallaxSpeed={40}>
                <Badge variant="secondary" className="mb-4">Industry First</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  LoopTrace™ Real-Time Order Tracking
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  See exactly where your order is at every production stage. Photos, videos, and live updates - no more wondering "where's my order?"
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Live production stage updates",
                    "Photo & video evidence at each milestone",
                    "Quality check reports with defect tracking",
                    "Estimated delivery countdown"
                  ].map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button asChild>
                  <Link to="/how-it-works">See Real-Time Tracking Demo →</Link>
                </Button>
              </ScrollRevealSection>

              {/* Animated Demo Mockup */}
              <ScrollRevealSection parallaxSpeed={-30}>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Order #SL-2024-001</span>
                      <Badge>In Production</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { stage: "Fabric Received", progress: 100, status: "completed" },
                        { stage: "Cutting & Sewing", progress: 100, status: "completed" },
                        { stage: "Printing & Branding", progress: 75, status: "in_progress" },
                        { stage: "Quality Check", progress: 0, status: "pending" },
                        { stage: "Packing & Shipping", progress: 0, status: "pending" },
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex justify-between text-sm mb-1">
                            <span className={item.status === "completed" ? "text-primary" : ""}>{item.stage}</span>
                            <span className="text-muted-foreground">{item.progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full ${item.status === "completed" ? "bg-primary" : item.status === "in_progress" ? "bg-primary/70" : "bg-muted"}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 + 0.2, duration: 0.6 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Video className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">3 photos • 1 video available</span>
                    </div>
                  </div>
                </Card>
              </ScrollRevealSection>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Us - 4 Icon Cards */}
        <AnimatedSection>
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Why Sleek Apparels</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We're different from traditional manufacturers
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Package,
                    title: "Low MOQ (50 pieces)",
                    description: "Perfect for startups & small brands. Test designs without massive inventory risk."
                  },
                  {
                    icon: Factory,
                    title: "Fast Production (10-20 days)",
                    description: "Industry-leading turnaround times. Get your products faster than competitors."
                  },
                  {
                    icon: Video,
                    title: "Real-Time Tracking (LoopTrace™)",
                    description: "See your order progress live. Photos & videos at every production stage."
                  },
                  {
                    icon: Globe,
                    title: "Trusted Globally (15+ countries)",
                    description: "From Bangkok to Stockholm. Reliable quality for brands worldwide."
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Section 6: Download Brochure */}
        <AnimatedSection>
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">Company Resources</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn More About Sleek Apparels</h2>
                <p className="text-lg text-muted-foreground">
                  Download our comprehensive company brochure for a detailed overview of our operations, capabilities, and unique value proposition.
                </p>
              </div>
              <BrochureDownload />
            </div>
          </section>
        </AnimatedSection>

        {/* Section 7: Final CTA Section */}
        <AnimatedSection>
          <section className="py-16 bg-primary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Order?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                50-piece minimum • 10-20 day production • Real-time tracking
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="gold">
                  <Link to="/quote-generator">Get AI Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/consultation">Book Free Consultation</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Join 50+ brands worldwide • Free consultation with CEO
              </p>
            </div>
          </section>
        </AnimatedSection>
        
        <Footer />
        <FloatingContactWidget />
        <Suspense fallback={null}>
          <ConversationalAssistant />
        </Suspense>
      </div>
    </>
  );
}

export default Index;
