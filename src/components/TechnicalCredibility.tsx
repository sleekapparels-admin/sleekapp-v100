import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, ShieldCheck, Zap, Award } from "lucide-react";
import { FactoryIcon, OrderIcon } from "@/components/CustomIcons";

export const TechnicalCredibility = () => {
  const specs = [
    {
      icon: FactoryIcon,
      label: "Technology",
      value: "Advanced Knitting",
      detail: "State-of-the-art automated flat knitting machines",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Cpu,
      label: "Knit Range",
      value: "Fine to Chunky",
      detail: "Multi-gauge with intarsia capabilities",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: OrderIcon,
      label: "Monthly Capacity",
      value: "50,000 pcs",
      detail: "Knitwear production with quality control",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: ShieldCheck,
      label: "Quality Standard",
      value: "AQL 2.5",
      detail: "Every shipment inspected",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      icon: Zap,
      label: "Sample Speed",
      value: "3–7 days",
      detail: "Proto to approved sample",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-600",
    },
    {
      icon: Award,
      label: "Compliance",
      value: "Quality Standards",
      detail: "Fair wages, safe conditions",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <Badge variant="outline" className="mb-4">Technical Specifications</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Manufacturing Excellence by the Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our facility combines advanced machinery with skilled craftsmanship to deliver 
            consistent quality and competitive pricing for retailers and organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, index) => (
            <Card
              key={spec.label}
              className="p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${spec.bgColor}`}>
                  <spec.icon className={`h-6 w-6 ${spec.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">{spec.label}</div>
                  <div className="text-xl font-bold mb-1">{spec.value}</div>
                  <div className="text-sm text-muted-foreground">{spec.detail}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-8 animate-fade-up" style={{ animationDelay: "600ms" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Years in Business</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Clients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98.5%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};