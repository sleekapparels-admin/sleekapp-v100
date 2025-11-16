import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FounderMessage = () => {
  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Founder Photo */}
          <div className="relative">
            <div className="aspect-square rounded-image overflow-hidden shadow-card">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
                alt="Khondaker Rajiur Rahman, Managing Director"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Message Content */}
          <div>
            <p className="text-body text-primary font-semibold mb-4">
              From Nankai University to Bangladesh's Textile Innovation
            </p>
            
            <blockquote className="text-h4-mobile md:text-h4 font-accent italic text-foreground leading-relaxed mb-6 border-l-4 border-primary pl-6">
              "I founded Sleek Apparels with a vision: bring international manufacturing standards and digital transparency to Bangladesh's textile industry. Every brand deserves a manufacturing partner they can trust."
            </blockquote>

            <div className="mb-6">
              <p className="text-body font-semibold mb-1">
                — Khondaker Rajiur Rahman, Managing Director
              </p>
              <p className="text-body-sm text-muted-foreground">
                BBA, Nankai University (China) | Xero Certified | IAB Digital Marketing
              </p>
            </div>

            <Button asChild variant="outline">
              <Link to="/about">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
