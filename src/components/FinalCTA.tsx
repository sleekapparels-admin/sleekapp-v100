import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-section-mobile md:py-section bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2-mobile md:text-h2 font-heading font-bold mb-4">
          Ready to Start Your Custom Apparel Project?
        </h2>
        
        <p className="text-body-lg mb-8 opacity-90">
          Get an instant quote in 60 seconds or schedule a consultation with our team
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/quote-generator">
              Get Instant AI Quote
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
