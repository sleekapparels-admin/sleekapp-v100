import { Settings, Package, Shield } from "lucide-react";

const features = [
  {
    icon: Settings,
    title: "LoopTrace™ Platform: Production Visibility",
    description: "Proprietary AI platform for real-time tracking from cutting to shipping. Get AI quality predictions, compliance alerts, and live photo documentation. Full transparency with your exclusive production dashboard.",
  },
  {
    icon: Package,
    title: "Industry-Lowest MOQ: 50 Pieces",
    description: "Perfect for fashion startups, boutique brands, schools, and private labels. Test designs without massive commitments. Scale from 50 to 50,000 pieces with the same quality and service.",
  },
  {
    icon: Shield,
    title: "Certified Quality & Ethical Manufacturing",
    description: "AQL 2.5 inspection standards. OEKO-TEX certified materials. Fair wages, safe working conditions, and full compliance transparency. Quality you can trust, ethics you can verify.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-secondary">
            Why Fashion Brands Worldwide Choose Sleek Apparels
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Breaking the traditional Bangladesh sourcing barriers with AI-driven transparency, flexible minimums, and innovative design capabilities. Trusted by fashion startups, boutique brands, schools, and private labels globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="text-center p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` } as React.CSSProperties}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 text-primary mb-4 sm:mb-6">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-secondary">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
