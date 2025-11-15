import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary text-secondary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-up">
          Start Your Project Today
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-95 animate-fade-up leading-relaxed" style={{ animationDelay: "150ms" }}>
          Our merchandising team is ready to help bring your apparel vision to life. Get a detailed quote with pricing, lead times, and recommendations within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="gold"
              size="lg"
              className="animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link to="/quote-generator">
                Get Instant AI Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="animate-fade-up border-2 border-white/30 text-white hover:bg-white/10"
            style={{ animationDelay: "400ms" }}
          >
            <Link to="/portfolio">
              View Our Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
