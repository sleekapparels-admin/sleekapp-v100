import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { allProductImages } from "@/lib/aiGeneratedProductImages";

export const PortfolioGallery = () => {
  // Use first 12 AI-generated product images for gallery
  const portfolioImages = allProductImages.slice(0, 12).map(img => ({
    url: img.url,
    alt: img.alt
  }));

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
                loading="lazy"
                width="500"
                height="500"
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
