import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Eye, Zap, Shield, Calculator, Sparkles } from "lucide-react";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { useState } from "react";
import { trackCTAClick } from "@/lib/analyticsTracking";

export const Hero = () => {
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleCTAClick = (ctaName: string) => {
    trackCTAClick(ctaName, 'hero_section');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover"
      // @ts-ignore - fetchpriority is valid but not in TypeScript types yet
      fetchpriority="high">
          <source src="/videos/homepage-hero.webm" type="video/webm" />
          <source src="/videos/homepage-hero.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Dark gradient overlay from left for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40"></div>
        {/* Additional subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        {/* Top fade overlay to ensure dark area under navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Main Professional Message */}
          <div className="max-w-3xl">
            {/* Beta Launch Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full mb-6">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-white">
                🚀 LoopTrace™ BETA - Free Access Until December 31, 2025
              </span>
            </div>

            <h1 className="text-h1-mobile md:text-h1 font-heading font-bold text-white mb-6 leading-tight">
              Bangladesh's First AI Powered Apparel Sourcing Platform
             
              <span className="block text-primary mt-2 text-base md:text-lg">Powered by LoopTrace™ Technology</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed font-medium">
              Real-Time Production Tracking • AI-Powered Quotes • 10-20 Day Delivery
            </p>

            <p className="text-base md:text-lg text-white/75 mb-8 leading-relaxed">
              Premium private label clothing manufacturing with low MOQs and full visibility. Watch your order progress through every stage with our revolutionary LoopTrace™ technology. From yarn to finished garment, full transparency guaranteed.
            </p>

            {/* Key Features - Quick Scan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">Low MOQ</div>
                  <div className="text-white/70 text-xs">From 50 pieces</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">Live Tracking</div>
                  <div className="text-white/70 text-xs">LoopTrace™ AI</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Shield className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">Certified</div>
                  <div className="text-white/70 text-xs">ISO • WRAP • GOTS</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20"
                onClick={() => handleCTAClick('get_instant_quote')}
              >
                <Link to="/instant-quote">
                  <Calculator className="mr-2 h-5 w-5" />
                  Get Instant Quote (30s)
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                onClick={() => handleCTAClick('start_your_project')}
              >
                <Link to="/get-started">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-sm md:text-base font-medium">
                  50+ Brands • 15+ Countries
                </span>
              </div>
              <div className="text-sm md:text-base text-white/70">
                <span className="font-semibold text-white">98.5%</span> On-Time Delivery Rate
              </div>
            </div>
          </div>

          {/* Right: Optional Subtle Lead Capture - Hidden by default on mobile */}
          <div className="hidden lg:block">
            {showLeadForm ? (
              <LeadCaptureForm 
                compact={true}
                source="hero_sidebar"
                onSuccess={() => {
                  setTimeout(() => navigate('/auth?intent=beta'), 2000);
                }}
              />
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Get Early Access</h3>
                      <p className="text-sm text-white/70 mb-4">
                        Join our beta program and be among the first to experience our AI-powered platform. Free until December 2025.
                      </p>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => {
                          handleCTAClick('early_access_sidebar');
                          setShowLeadForm(true);
                        }}
                      >
                        Join Beta Program
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3 text-xs text-white/60">
                    <p>✓ Free platform access until Dec 31, 2025</p>
                    <p>✓ AI-powered instant quotes</p>
                    <p>✓ Real-time production tracking</p>
                    <p>✓ Priority support access</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
