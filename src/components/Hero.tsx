import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Eye, Sparkles, Users, TrendingUp } from "lucide-react";
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
          {/* Left: Main Message */}
          <div className="max-w-2xl">
            {/* Beta Participation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-white">
                🎯 Help Us Build the Future - Beta Access Open
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Connect Buyers & Manufacturers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Worldwide
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed font-medium">
              Join our beta program and help train our AI to make apparel sourcing smarter
            </p>

            <p className="text-base md:text-lg text-white/75 mb-8 leading-relaxed">
              We're building AI-powered tools to revolutionize how buyers find manufacturers and how suppliers get orders. 
              <span className="text-white font-semibold"> We need your data to make it better.</span>
            </p>

            {/* Dual Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Users className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">For Buyers</div>
                  <div className="text-white/70 text-xs">Access verified manufacturers with transparent pricing</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">For Suppliers</div>
                  <div className="text-white/70 text-xs">Get connected with global brands and buyers</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20"
                onClick={() => {
                  handleCTAClick('join_beta_primary');
                  setShowLeadForm(true);
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Join Beta Program (Free)
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-white/20 text-white hover:bg-white/10"
              >
                <Link 
                  to="/quote-generator"
                  onClick={() => handleCTAClick('get_quote_secondary')}
                >
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-sm md:text-base font-medium">
                  Limited Beta Spots Available
                </span>
              </div>
              <div className="text-sm md:text-base text-white/70">
                <span className="font-semibold text-white">100%</span> Free Until Launch
              </div>
            </div>
          </div>

          {/* Right: Lead Capture Form */}
          <div className="lg:block">
            {showLeadForm ? (
              <LeadCaptureForm 
                source="hero_section"
                onSuccess={() => {
                  setTimeout(() => navigate('/auth?intent=beta'), 2000);
                }}
              />
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Why Join Our Beta?</h3>
                    <p className="text-white/70 text-sm">Help us build features that actually work for you</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">Free Platform Access</div>
                        <div className="text-white/60 text-xs">Until December 31, 2025 - No credit card needed</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">Shape the Product</div>
                        <div className="text-white/60 text-xs">Your feedback directly influences what we build</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-white font-semibold text-sm">Early Access Benefits</div>
                        <div className="text-white/60 text-xs">Exclusive features & lifetime discounts</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => {
                      handleCTAClick('join_beta_sidebar');
                      setShowLeadForm(true);
                    }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Started - It's Free
                  </Button>

                  <p className="text-xs text-white/50 text-center">
                    No credit card • Cancel anytime • Your data is safe
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
