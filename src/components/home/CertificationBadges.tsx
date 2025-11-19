import { Shield, CheckCircle, Award, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    icon: Shield,
    name: "ISO 9001",
    description: "Quality Management Certified",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    icon: CheckCircle,
    name: "WRAP Certified",
    description: "Ethical Manufacturing",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    icon: Leaf,
    name: "GOTS Approved",
    description: "Organic Textile Standards",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    icon: Award,
    name: "Fair Trade Partner",
    description: "Worker Welfare Guaranteed",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  }
];

export const CertificationBadges = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-950 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            Verified & Certified
          </Badge>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Commitment to Quality & Ethics
          </h3>
          <p className="text-muted-foreground">
            Independently verified certifications you can trust
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <div
                key={index}
                className={`${cert.bgColor} rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${cert.color} mb-4`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AQL 2.5 Quality Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Fair Wages Above Market</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Safe Working Conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Environmental Responsibility</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
