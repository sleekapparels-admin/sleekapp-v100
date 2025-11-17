import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
          // @ts-ignore - fetchpriority is valid but not in TypeScript types yet
          fetchpriority="high"
        >
          <source src="/videos/homepage-hero.webm" type="video/webm" />
          <source src="/videos/homepage-hero.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Dark gradient overlay from left for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40"></div>
        {/* Additional subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        {/* Top fade overlay to ensure dark area under navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="text-h1-mobile md:text-h1 font-heading font-bold text-white mb-6 leading-tight">
            Bangladesh Garment Manufacturer | Low MOQ Custom Apparel from 50 Pieces
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            T-shirts, Hoodies, Sweatshirts & Joggers | AI-Tracked, Ethically Made, Delivered Fast
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
              <Link to="/quote-generator">
                Get Instant Quote in 60 Seconds
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-2 border-white/30 text-white hover:bg-white/10">
              <Link to="/contact">
                Schedule Expert Consultation
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-sm md:text-base font-medium">
              Trusted by 100+ brands worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
