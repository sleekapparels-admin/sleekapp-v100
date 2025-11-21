import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-section-mobile md:py-section bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2-mobile md:text-h2 font-heading font-bold mb-4">
          🚀 Get Free Access to LoopTrace™ Platform
        </h2>
        
        <p className="text-body-lg mb-4 opacity-90">
          Experience AI-powered quotes and real-time order tracking — free until December 31, 2025
        </p>
        
        <p className="text-base mb-8 opacity-75">
          LoopTrace™ Growth & Scale tiers launching Jan 2026 • Beta users get lifetime discounts
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/auth?intent=beta">
              Get Free LoopTrace™ Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 h-auto border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/contact">
              Schedule a Call
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
