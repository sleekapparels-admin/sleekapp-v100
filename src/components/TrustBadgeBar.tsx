import { Shield, Award, Star, Users, Clock, CheckCircle2 } from "lucide-react";

export const TrustBadgeBar = () => {
  const badges = [
    { icon: Shield, label: "OEKO-TEX® Certified" },
    { icon: CheckCircle2, label: "BSCI Compliant" },
    { icon: Award, label: "WRAP Certified" },
    { icon: Star, label: "Alibaba Gold Supplier" },
    { icon: Users, label: "100+ Brands Served" },
    { icon: Clock, label: "10+ Years Experience" },
  ];

  return (
    <section className="py-8 bg-muted/20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background transition-all hover:scale-105 hover:shadow-md"
              >
                <Icon className="w-8 h-8 text-primary" />
                <span className="text-xs font-medium text-center text-foreground">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
