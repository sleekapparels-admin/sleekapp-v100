import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import knitwearImage from "@/assets/bangladesh-knitwear-production.webp";
import uniformsImage from "@/assets/bangladesh-uniforms-production.webp";
import cutsewImage from "@/assets/bangladesh-cutsew-production.webp";

const services = [
  {
    title: "Knitwear Manufacturing",
    description: "Precision flat-knit production (7–14 GG) using Stoll & Cixing machines. From sweaters to polos, crafted with quality for retailers and brands.",
    image: knitwearImage,
    href: "/knitwear",
  },
  {
    title: "Cut & Sew Apparel",
    description: "Full-package woven garment production for retailers, wholesalers, and organizations. Shirts, jackets, and more.",
    image: cutsewImage,
    href: "/cut-and-sew",
  },
  {
    title: "Uniforms & Teamwear",
    description: "Custom uniforms for educational institutions, corporate organizations, and sports teams with embroidery and decoration options.",
    image: uniformsImage,
    href: "/uniforms-teamwear",
  },
];

export const ServiceCards = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-secondary">
            Comprehensive Apparel Manufacturing Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From concept to delivery, we provide end-to-end manufacturing solutions for retailers, wholesalers, and organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-fade-up border bg-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  loading={index > 0 ? "lazy" : "eager"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width="1920"
                  height="1080"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-secondary">{service.title}</h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{service.description}</p>
                <Button asChild variant="link" className="p-0 h-auto text-primary font-semibold">
                  <Link to={service.href}>
                    Learn More →
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
