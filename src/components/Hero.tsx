import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import heroBackground from "@/assets/hero-knitwear-bg.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground}
          alt="Premium knitwear textile manufacturing quality"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="text-h1-mobile md:text-h1 font-heading font-bold text-white mb-6 leading-tight">
            Premium Custom Apparel Manufacturing from 50 Pieces
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
