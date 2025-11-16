import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const PortfolioGallery = () => {
  const portfolioImages = [
    { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2070&auto=format&fit=crop", alt: "Custom printed t-shirts" },
    { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop", alt: "Premium hoodie" },
    { url: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=2080&auto=format&fit=crop", alt: "Joggers and sweatpants" },
    { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2070&auto=format&fit=crop", alt: "Polo shirts" },
    { url: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=2070&auto=format&fit=crop", alt: "Sweatshirts" },
    { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2064&auto=format&fit=crop", alt: "Team uniforms" },
    { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2015&auto=format&fit=crop", alt: "Custom hoodies" },
    { url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop", alt: "T-shirt designs" },
    { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop", alt: "Athletic wear" },
    { url: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=2071&auto=format&fit=crop", alt: "Custom apparel" },
    { url: "https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=2073&auto=format&fit=crop", alt: "Branded clothing" },
    { url: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=2070&auto=format&fit=crop", alt: "Quality garments" }
  ];

  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            Featured Work
          </h2>
          <p className="text-body-lg text-muted-foreground">
            Quality that speaks for itself
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {portfolioImages.map((image, index) => (
            <div 
              key={index}
              className="relative aspect-square overflow-hidden rounded-image group cursor-pointer"
            >
              <img 
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/portfolio">
              View Full Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
