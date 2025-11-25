import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingBag, Factory, ArrowRight, CheckCircle2, Zap, Shield, Eye, TrendingUp, Users, Package } from "lucide-react";
import { Helmet } from "react-helmet";

export default function GetStarted() {
  return (
    <>
      <Helmet>
        <title>Join LoopTrace™ Platform - Choose Your Role | Sleek Apparels</title>
        <meta name="description" content="Join LoopTrace™ as a buyer or supplier. Get AI-powered quotes, real-time tracking, and access to Bangladesh's first AI-powered apparel sourcing platform. Free until December 31, 2025." />
        <meta name="keywords" content="LoopTrace registration, apparel buyer signup, supplier registration, B2B manufacturing platform, Bangladesh apparel sourcing" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full mb-6">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              🚀 Free Access Until December 31, 2025
            </span>
          </div>

          <h1 className="text-h1-mobile md:text-h1 font-heading font-bold text-foreground mb-6">
            Join LoopTrace™ Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Bangladesh's First AI-Powered Apparel Sourcing Platform
          </p>

          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose your role to get started with instant AI quotes, real-time production tracking, and full transparency
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Buyer Card */}
            <Card className="p-8 text-left hover:shadow-xl transition-all duration-300 border-2 hover:border-primary group">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
                I Need Manufacturing Services
              </h2>

              <p className="text-muted-foreground mb-6">
                Get instant quotes, track production in real-time, and source from verified manufacturers
              </p>

              {/* Buyer Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Get instant AI-powered quotes in seconds</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Track orders in real-time with LoopTrace™</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Access verified supplier network across Bangladesh</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Low MOQ from 50 pieces for all product types</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Fast 10-20 day production timelines</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Full transparency from yarn to finished garment</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full text-base">
                <Link to="/auth?intent=beta&role=buyer">
                  Register as Buyer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </Card>

            {/* Supplier Card */}
            <Card className="p-8 text-left hover:shadow-xl transition-all duration-300 border-2 hover:border-accent group">
              <div className="flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-colors">
                <Factory className="h-8 w-8 text-accent" />
              </div>

              <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
                I Manufacture Apparel
              </h2>

              <p className="text-muted-foreground mb-6">
                Connect with global buyers, manage orders efficiently, and grow your manufacturing business
              </p>

              {/* Supplier Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Connect with global buyers seeking manufacturers</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Manage orders with LoopTrace™ dashboard</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Fill production capacity with low-MOQ orders</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Get verified badge and build reputation ratings</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Real-time communication with buyers</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Automated workflow and production tracking</span>
                </div>
              </div>

              <Button asChild size="lg" variant="secondary" className="w-full text-base">
                <Link to="/become-supplier">
                  Register as Supplier
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </Card>
          </div>

          {/* Trust Bar */}
          <div className="border-t border-border pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="text-2xl font-bold text-foreground">50+</div>
                </div>
                <div className="text-sm text-muted-foreground">Active Brands</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <div className="text-2xl font-bold text-foreground">98.5%</div>
                </div>
                <div className="text-sm text-muted-foreground">On-Time Delivery</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-primary" />
                  <div className="text-2xl font-bold text-foreground">15+</div>
                </div>
                <div className="text-sm text-muted-foreground">Countries Served</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-accent" />
                  <div className="text-2xl font-bold text-foreground">ISO</div>
                </div>
                <div className="text-sm text-muted-foreground">Certified & Compliant</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
