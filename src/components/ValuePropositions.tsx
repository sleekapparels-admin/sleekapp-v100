import { TrendingUp, Zap, Shield, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ValuePropositions = () => {
  const propositions = [
    {
      icon: TrendingUp,
      title: "Low MOQ: Start Small",
      description: "Begin with just 50 pieces. Perfect for startups, test launches, and small brands. No massive inventory risk."
    },
    {
      icon: Zap,
      title: "Lightning Fast Production",
      description: "5-10 day sampling, 10-20 day production. Get to market faster than competitors."
    },
    {
      icon: Shield,
      title: "Certified & Compliant",
      description: "OEKO-TEX®, BSCI, WRAP certified. Ethical manufacturing you can trust."
    },
    {
      icon: Monitor,
      title: "AI-Tracked Transparency",
      description: "Track your order 24/7 with real-time AI tracking. No more email chasing."
    }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            Why Global Brands Choose Sleek Apparels
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propositions.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card key={index} className="p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-h4-mobile font-heading font-medium mb-3">
                  {prop.title}
                </h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
