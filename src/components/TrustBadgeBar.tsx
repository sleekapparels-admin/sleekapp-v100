import { Shield, Award, Globe, Package, Zap, CheckCircle2 } from "lucide-react";

export const TrustBadgeBar = () => {
  const badges = [
    { 
      icon: Package, 
      label: "Low MOQ",
      value: "From 50 Pcs",
      color: "text-blue-500"
    },
    { 
      icon: Zap, 
      label: "Fast Production",
      value: "10-20 Days",
      color: "text-amber-500"
    },
    { 
      icon: Shield, 
      label: "ISO Certified",
      value: "Quality Assured",
      color: "text-green-500"
    },
    { 
      icon: Globe, 
      label: "Global Reach",
      value: "15+ Countries",
      color: "text-purple-500"
    },
    { 
      icon: Award, 
      label: "WRAP Verified",
      value: "Ethical Standards",
      color: "text-emerald-500"
    },
    { 
      icon: CheckCircle2, 
      label: "On-Time Delivery",
      value: "98.5% Rate",
      color: "text-orange-500"
    },
  ];

  return (
    <section className="py-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-1.5 p-3 group"
              >
                <Icon className={`w-6 h-6 ${badge.color} group-hover:scale-110 transition-transform`} />
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">
                    {badge.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {badge.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
