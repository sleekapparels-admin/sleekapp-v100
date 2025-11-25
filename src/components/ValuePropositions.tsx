import { TrendingUp, Zap, Shield, Monitor, Eye, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ValuePropositions = () => {
  const propositions = [
    {
      icon: TrendingUp,
      title: "Revolutionary Low MOQ",
      subtitle: "From 50 Pieces",
      description: "Break free from traditional 500-5,000 piece minimums. Test designs, launch collections, or order uniforms without massive inventory risk.",
      badge: "50+ pieces",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Lightning Fast Turnaround",
      subtitle: "10-20 Days Production",
      description: "While competitors take 45-90 days, we deliver in 10-20 days. Advanced automation and streamlined workflows mean faster time-to-market.",
      badge: "3x Faster",
      color: "text-accent"
    },
    {
      icon: Eye,
      title: "LoopTrace™ AI Tracking",
      subtitle: "Real-Time Transparency",
      description: "Watch your order progress through every stage. Photo evidence, quality reports, and predictive alerts. No more wondering 'where's my order?'",
      badge: "Industry First",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Verified Ethical Manufacturing",
      subtitle: "ISO • WRAP • GOTS • Fair Trade",
      description: "Independently certified for quality, ethics, and sustainability. Fair wages, safe conditions, and environmental responsibility—not just promises.",
      badge: "Certified",
      color: "text-green-500"
    }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            Our Competitive Advantages
          </Badge>
          <h2 className="text-h2-mobile md:text-h2 font-heading font-bold mb-4">
            Why Global Brands Choose Sleek Apparels
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Combining Bangladesh's manufacturing efficiency with China's sourcing excellence, 
            powered by cutting-edge AI transparency technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {propositions.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card 
                key={index} 
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 ${prop.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-heading font-bold mb-1">
                          {prop.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {prop.subtitle}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {prop.badge}
                      </Badge>
                    </div>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Value Statement */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            "We've eliminated traditional barriers that prevent small brands from accessing premium manufacturing. 
            No sales teams. No hidden fees. Just transparent, technology-enabled production at your fingertips."
          </p>
          <p className="mt-2 text-sm font-semibold">— Kh Raj Rahman, Founder</p>
        </div>
      </div>
    </section>
  );
};
