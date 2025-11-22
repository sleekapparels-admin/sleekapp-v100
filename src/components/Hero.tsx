import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Eye, Zap, Shield, Calculator } from "lucide-react";
export const Hero = () => {
  return <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
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
            Break free from high MOQs and zero visibility. Watch your order progress through every stage with our revolutionary LoopTrace™ technology. From yarn to finished garment, full transparency guaranteed.
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
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20">
              <Link to="/instant-quote">
                <Calculator className="mr-2 h-5 w-5" />
                Get Instant Quote (30s)
              </Link>
            </Button>
            
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
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
      </div>
    </section>;
};