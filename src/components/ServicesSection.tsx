import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      title: "Casualwear Manufacturing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
      description: "T-shirts, hoodies, sweatshirts, polo shirts with MOQ from 50-300 pieces. Organic cotton, ring-spun cotton, poly-cotton blends, French terry, fleece.",
      link: "/services"
    },
    {
      title: "Activewear & Joggers",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop",
      description: "Performance wear, joggers, athletic basics. Moisture-wicking fabrics, stretch materials, French terry. MOQ from 100-500 pieces.",
      link: "/services"
    },
    {
      title: "Uniforms & Teamwear",
      image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop",
      description: "Corporate, school, and sports uniform manufacturing from 50-200 pieces. Custom branding: embroidery, screen print, heat transfer.",
      link: "/services"
    }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            Our Manufacturing Services
          </h2>
          <p className="text-body-lg text-muted-foreground">
            From design to delivery, we handle everything
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              </div>
              <div className="p-6">
                <h3 className="text-h3-mobile font-heading font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-body text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Button asChild variant="outline" className="group/btn">
                  <Link to={service.link}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
