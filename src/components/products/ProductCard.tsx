import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Heart, ArrowRight } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export const ProductCard = ({ product, variant = "grid" }: ProductCardProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 hover:border-primary/20">
      {/* Image Container with Enhanced Hover Overlay */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
        
        {/* Featured Badge */}
        {product.featured && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg z-10">
            Featured
          </Badge>
        )}

        {/* Quick Actions Overlay - Appears on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Quick Action Buttons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 transform -translate-x-20 group-hover:translate-x-0 transition-transform duration-300 delay-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
              asChild
            >
              <Link to={`/design-studio?product=${product.id}`} title="Quick View">
                <Eye className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white hover:text-destructive"
              title="Add to Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              variant="secondary" 
              className="w-full bg-white hover:bg-white/90 text-foreground font-semibold shadow-xl" 
              asChild
            >
              <Link to={`/design-studio?product=${product.id}`}>
                Quick Customize
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Card Header */}
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {product.category.replace(/_/g, ' ')}
            </p>
          </div>
          
          {/* MOQ Badge */}
          <Badge variant="outline" className="shrink-0 font-medium">
            MOQ: {product.moq || 50}
          </Badge>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="space-y-3 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Technical Specifications */}
        {(product.gauge || product.yarn) && (
          <div className="flex flex-wrap gap-2 text-sm">
            {product.gauge && (
              <Badge variant="secondary" className="font-normal">
                Gauge: {product.gauge}
              </Badge>
            )}
            {product.yarn && (
              <Badge variant="secondary" className="font-normal">
                {product.yarn}
              </Badge>
            )}
          </div>
        )}

        {/* Color Palette */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium">Colors:</span>
            <div className="flex gap-1.5">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-border shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                  +{product.colors.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lead Time Indicator */}
        {product.lead_time_days && (
          <div className="flex items-center gap-2 text-sm pt-1">
            <span className="text-muted-foreground">Lead Time:</span>
            <span className="font-medium text-foreground">{product.lead_time_days} days</span>
          </div>
        )}
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex gap-2 pt-0 pb-4">
        <Button 
          variant="default" 
          className="flex-1 font-semibold shadow-sm hover:shadow-md transition-shadow" 
          asChild
        >
          <Link to={`/design-studio?product=${product.id}`}>
            Design Now
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 font-semibold hover:bg-secondary/80 transition-colors" 
          asChild
        >
          <Link to={`/contact?product=${product.title}`}>
            Get Quote
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
