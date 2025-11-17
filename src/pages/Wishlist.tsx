import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/products/ProductCard";
import { useWishlistContext } from "@/contexts/WishlistContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  notes: string | null;
  products: {
    id: string;
    title: string;
    description: string | null;
    price: number | null;
    image_url: string;
    category: string;
    moq: number | null;
    lead_time_days: number | null;
    colors: string[] | null;
    materials: string[] | null;
    featured: boolean | null;
  };
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refetchWishlist, wishlistCount } = useWishlistContext();
  const { toast } = useToast();

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('wishlist-get');

      if (error) {
        console.error('Error fetching wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to load wishlist items",
          variant: "destructive",
        });
        return;
      }

      setWishlistItems(data?.items || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleClearAll = async () => {
    try {
      // Remove all items from wishlist
      for (const item of wishlistItems) {
        await supabase.functions.invoke('wishlist-remove', {
          body: { productId: item.product_id }
        });
      }

      setWishlistItems([]);
      await refetchWishlist();

      toast({
        title: "Wishlist cleared",
        description: "All items removed from your wishlist",
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });
    }
  };

  const EmptyWishlistState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Heart className="h-24 w-24 text-muted-foreground/20 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Save your favorite products to easily find them later and get notified about special offers
      </p>
      <Button asChild>
        <Link to="/products">Browse Products</Link>
      </Button>
    </div>
  );

  return (
    <>
      <SEO 
        config={{
          title: "My Wishlist - Sleek Apparels",
          description: "View your saved products and favorite apparel items",
          canonical: `${window.location.origin}/wishlist`,
        }}
      />
      <Navbar />
      
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span>{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved</span>
                )}
              </p>
            </div>
            
            {wishlistItems.length > 0 && !isLoading && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Clear All</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear entire wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all {wishlistItems.length} items from your wishlist. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : wishlistItems.length === 0 ? (
            <EmptyWishlistState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map(item => (
                <ProductCard 
                  key={item.id} 
                  product={item.products} 
                  variant="grid"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;
