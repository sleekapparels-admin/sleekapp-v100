import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export const ProductCard = ({ product, variant = "grid" }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-primary">
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" asChild>
              <Link to={`/design-studio?product=${product.id}`}>
                Quick Customize
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {product.category.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        {(product.gauge || product.yarn) && (
          <div className="flex flex-wrap gap-2 text-sm">
            {product.gauge && (
              <Badge variant="outline">Gauge: {product.gauge}</Badge>
            )}
            {product.yarn && (
              <Badge variant="outline">Yarn: {product.yarn}</Badge>
            )}
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        <Button variant="default" className="flex-1" asChild>
          <Link to={`/design-studio?product=${product.id}`}>
            Design Now
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/contact?product=${product.title}`}>
            Get Quote
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
