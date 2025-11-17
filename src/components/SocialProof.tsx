import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Star, TrendingUp } from "lucide-react";

export const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: "50+",
      label: "Fashion Brands Worldwide",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Package,
      value: "45K+",
      label: "Units Delivered This Month",
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Star,
      value: "98.5%",
      label: "Client Satisfaction Rate",
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: TrendingUp,
      value: "15",
      label: "Orders Currently Manufacturing",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Trusted by Fashion Brands Worldwide
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Real-time production stats from our facilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
