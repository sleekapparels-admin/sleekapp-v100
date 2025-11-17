import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Clock, Truck, Palette, Loader2, Package, ArrowRight } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useProductAnalytics } from "@/hooks/useProductAnalytics";
import { useWishlistContext } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export const ProductCard = ({ product, variant = "grid" }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const isListView = variant === "list";
  const { trackHover, trackQuickView, trackWishlist, trackColorSwatch, trackDesignClick, trackQuoteClick, trackViewDetails } = useProductAnalytics();
  const { isWishlisted, toggleWishlist } = useWishlistContext();
  const { toast } = useToast();

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
      });
      return;
    }
    
    setIsWishlistLoading(true);
    
    try {
      await toggleWishlist(product.id);
      
      // Track analytics
      trackWishlist(product.id);
      
      // Show success toast
      toast({
        title: isWishlisted(product.id) ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted(product.id) 
          ? `${product.title} removed from your wishlist` 
          : `${product.title} saved to your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 border-border/50 hover:border-primary/30 hover:shadow-2xl",
        isListView ? "flex flex-row" : ""
      )}
      onMouseEnter={() => trackHover(product.id)}
    >
      {/* Image Container with Enhanced Hover Overlay */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        isListView ? "w-64 flex-shrink-0" : "aspect-square"
      )}>
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
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg z-10 animate-pulse">
            Featured
          </Badge>
        )}

        {/* Quick Actions Overlay - Appears on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Quick Action Buttons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 transform -translate-x-20 group-hover:translate-x-0 transition-transform duration-300 delay-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-110 transition-all"
              onClick={() => trackQuickView(product.id)}
              asChild
            >
              <Link to={`/design-studio?product=${product.id}`} title="Quick View">
                <Eye className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg backdrop-blur-sm transition-all",
                isWishlisted(product.id)
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/90 hover:bg-white hover:text-red-500"
              )}
              title={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleWishlistClick}
              disabled={isWishlistLoading}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all",
                  isWishlisted(product.id) && "fill-current"
                )} 
              />
              {isWishlistLoading && <Loader2 className="h-4 w-4 animate-spin absolute" />}
            </Button>
          </div>

          {/* MOQ Badge Overlay */}
          <div className="absolute top-4 right-4 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300 delay-150">
            <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-foreground font-semibold shadow-lg">
              <Package className="h-3 w-3 mr-1" />
              MOQ: {product.moq || 50}
            </Badge>
          </div>

          {/* Bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <Button 
              variant="secondary" 
              className="w-full bg-white hover:bg-primary hover:text-primary-foreground text-foreground font-semibold shadow-xl transition-all duration-300" 
              onClick={() => trackDesignClick(product.id)}
              asChild
            >
              <Link to={`/design-studio?product=${product.id}`}>
                Quick Customize
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Card Header */}
      <CardHeader className={cn("pb-3 pt-4", isListView && "pb-2")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="outline" className="text-xs font-medium capitalize">
                {product.category.replace(/_/g, ' ')}
              </Badge>
              {/* Show price if available */}
              {product.price && (
                <Badge variant="secondary" className="text-xs font-semibold">
                  ${product.price}/unit
                </Badge>
              )}
            </div>
          </div>
          
          {/* MOQ Badge - Only show in list view since grid view shows in overlay */}
          {isListView && (
            <Badge variant="outline" className="shrink-0 font-medium">
              <Package className="h-3 w-3 mr-1" />
              MOQ: {product.moq || 50}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className={cn("space-y-3 pb-4", isListView && "flex-1")}>
        <p className={cn(
          "text-sm text-muted-foreground leading-relaxed",
          isListView ? "line-clamp-3" : "line-clamp-2"
        )}>
          {product.description}
        </p>

        {/* Technical Specifications */}
        {(product.gauge || product.yarn) && (
          <div className="flex flex-wrap gap-2 text-sm">
            {product.gauge && (
              <Badge variant="secondary" className="font-normal text-xs hover:bg-secondary/80 transition-colors">
                Gauge: {product.gauge}
              </Badge>
            )}
            {product.yarn && (
              <Badge variant="secondary" className="font-normal text-xs hover:bg-secondary/80 transition-colors">
                {product.yarn}
              </Badge>
            )}
          </div>
        )}

        {/* Color Palette */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium">Available Colors:</span>
            <div className="flex gap-1.5 flex-wrap">
              {product.colors.slice(0, isListView ? 8 : 5).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-border shadow-sm hover:scale-125 hover:shadow-md transition-all cursor-pointer ring-offset-2 hover:ring-2 hover:ring-primary"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={() => trackColorSwatch(product.id, color)}
                />
              ))}
              {product.colors.length > (isListView ? 8 : 5) && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs text-muted-foreground font-semibold hover:bg-muted/80 transition-colors">
                  +{product.colors.length - (isListView ? 8 : 5)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lead Time & Additional Info */}
        <div className="flex items-center gap-4 text-sm pt-1 flex-wrap">
          {product.lead_time_days && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>⏱️</span>
              <span className="font-medium text-foreground">{product.lead_time_days} days</span>
            </div>
          )}
          {product.materials && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>🧵</span>
              <span className="font-medium text-foreground capitalize">{product.materials}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className={cn(
        "flex gap-2 pt-0 pb-4",
        isListView && "items-end"
      )}>
        <Button 
          variant="default" 
          className="flex-1 font-semibold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200" 
          onClick={() => trackDesignClick(product.id)}
          asChild
        >
          <Link to={`/design-studio?product=${product.id}`}>
            {isListView ? "Customize Design" : "Design Now"}
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 font-semibold hover:bg-secondary/80 hover:scale-105 active:scale-95 hover:border-primary/50 transition-all duration-200" 
          onClick={() => trackQuoteClick(product.id)}
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
