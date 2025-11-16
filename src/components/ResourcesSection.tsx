import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, BarChart3 } from "lucide-react";

export const ResourcesSection = () => {
  const resources = [
    {
      icon: FileText,
      title: "Custom Apparel Buyer's Guide",
      description: "Everything you need to know about manufacturing custom t-shirts, hoodies, and more. 25-page comprehensive guide.",
      buttonText: "Download Free Guide"
    },
    {
      icon: BarChart3,
      title: "Material Comparison Chart",
      description: "Compare cotton, poly-cotton, French terry, fleece and more. Make informed decisions about your fabrics.",
      buttonText: "Get the Chart"
    }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            Free Resources for Apparel Brands
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card key={index} className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-h3-mobile font-heading font-semibold mb-4 text-center">
                  {resource.title}
                </h3>
                
                <p className="text-body text-muted-foreground text-center mb-6 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="text-center">
                  <Button size="lg">
                    {resource.buttonText}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
