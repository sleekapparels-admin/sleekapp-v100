import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FounderMessage = () => {
  return (
    <section className="py-section-mobile md:py-section bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-body text-primary font-semibold mb-6">
            From Nankai University to Bangladesh's Textile Innovation
          </p>
          
          <blockquote className="text-h4-mobile md:text-h3 font-accent italic text-foreground leading-relaxed mb-8 relative">
            <span className="text-primary text-6xl absolute -top-4 -left-2 opacity-20">"</span>
            <span className="relative z-10">
              I founded Sleek Apparels with a vision: bring international manufacturing standards and digital transparency to Bangladesh's textile industry. Every brand deserves a manufacturing partner they can trust.
            </span>
            <span className="text-primary text-6xl absolute -bottom-8 -right-2 opacity-20">"</span>
          </blockquote>

          <div className="mb-8">
            <p className="text-body font-bold mb-2 text-foreground">
              — Khondaker Rajiur Rahman
            </p>
            <p className="text-body-sm text-muted-foreground mb-1">
              Managing Director
            </p>
            <p className="text-body-sm text-muted-foreground">
              BBA, Nankai University (China) | Xero Certified | IAB Digital Marketing
            </p>
          </div>

          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <Link to="/about">
              Read Our Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
