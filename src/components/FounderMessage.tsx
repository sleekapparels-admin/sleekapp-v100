import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FounderMessage = () => {
  return (
    <section className="py-section-mobile md:py-section bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-body text-primary font-semibold mb-6">
            Our Vision: Transforming Bangladesh's Garment Industry
          </p>
          
          <blockquote className="text-h4-mobile md:text-h3 font-accent italic text-foreground leading-relaxed mb-8 relative">
            <span className="text-primary text-6xl absolute -top-4 -left-2 opacity-20">"</span>
            <span className="relative z-10">
              Bangladesh's small RMG suppliers have untapped potential, but decades of exploitation and rock-bottom pricing have left them unable to invest in worker training or modern facilities. Sleek Apparels aims to break this cycle—connecting quality-focused fashion startups and D2C brands directly with these manufacturers, enabling fair margins that allow investment in skills development, while building the transparency and management infrastructure needed to compete globally.
            </span>
            <span className="text-primary text-6xl absolute -bottom-8 -right-2 opacity-20">"</span>
          </blockquote>

          <div className="mb-8">
            <p className="text-body font-bold mb-2 text-foreground">
              — Khondaker Rajiur Rahman
            </p>
            <p className="text-body-sm text-muted-foreground mb-1">
              Founder & Managing Director
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
