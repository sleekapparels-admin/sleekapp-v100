import { Check, X } from "lucide-react";

export const ComparisonTable = () => {
  const comparisons = [
    { feature: "Minimum Order", sleek: "50 pieces", traditional: "500-1000 pieces", isBetter: true },
    { feature: "Production Tracking", sleek: "LoopTrace™ Platform", traditional: "Manual email updates", isBetter: true },
    { feature: "Sampling Time", sleek: "5-10 days", traditional: "3-4 weeks", isBetter: true },
    { feature: "Digital Integration", sleek: "Full ERP System", traditional: "Excel sheets", isBetter: true },
    { feature: "Founder Background", sleek: "Internationally Educated", traditional: "Local only", isBetter: true },
    { feature: "Response Time", sleek: "Under 2 hours", traditional: "24-48 hours", isBetter: true }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            How We Compare to Traditional Manufacturers
          </h2>
        </div>

        <div className="bg-background rounded-card shadow-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-muted/20 border-b border-border">
            <div className="font-heading font-semibold text-body">Feature</div>
            <div className="font-heading font-semibold text-body text-primary">Sleek Apparels</div>
            <div className="font-heading font-semibold text-body text-muted-foreground">Traditional Manufacturers</div>
          </div>

          {/* Table Rows */}
          {comparisons.map((item, index) => (
            <div 
              key={index}
              className={`grid grid-cols-3 gap-4 p-6 ${index !== comparisons.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="text-body font-medium">{item.feature}</div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-body">{item.sleek}</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-body text-muted-foreground">{item.traditional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
