import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Eye, ShoppingCart, Heart, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlurImage } from '@/components/BlurImage';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/microInteractions';
import type { ProductImage } from '@/lib/aiGeneratedProductImages';
import { allProductImages } from '@/lib/aiGeneratedProductImages';

interface BrowsingHistoryItem {
  productId: string;
  category: string;
  timestamp: number;
  viewDuration: number;
}

interface RecommendationScore {
  product: ProductImage;
  score: number;
  reasons: string[];
}

/**
 * AIProductRecommendations - Smart Product Recommendations
 * 
 * Features:
 * - Tracks browsing history with localStorage
 * - AI-powered recommendation algorithm
 * - Category-based affinity scoring
 * - Recently viewed products
 * - Trending products
 * - Personalized recommendations
 * - Real-time updates
 */
export const AIProductRecommendations = ({
  currentProductId,
  limit = 6,
  className,
}: {
  currentProductId?: string;
  limit?: number;
  className?: string;
}) => {
  const [browsingHistory, setBrowsingHistory] = useState<BrowsingHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load browsing history and favorites from localStorage
  useEffect(() => {
    const history = localStorage.getItem('product_browsing_history');
    if (history) {
      setBrowsingHistory(JSON.parse(history));
    }

    const favs = localStorage.getItem('product_favorites');
    if (favs) {
      setFavorites(new Set(JSON.parse(favs)));
    }
  }, []);

  // Track current product view
  useEffect(() => {
    if (!currentProductId) return;

    const currentProduct = allProductImages.find(p => p.id === currentProductId);
    if (!currentProduct) return;

    const viewStartTime = Date.now();

    return () => {
      const viewDuration = Date.now() - viewStartTime;
      const newHistoryItem: BrowsingHistoryItem = {
        productId: currentProductId,
        category: currentProduct.category,
        timestamp: Date.now(),
        viewDuration,
      };

      const updatedHistory = [
        newHistoryItem,
        ...browsingHistory.filter(item => item.productId !== currentProductId)
      ].slice(0, 50); // Keep last 50 items

      setBrowsingHistory(updatedHistory);
      localStorage.setItem('product_browsing_history', JSON.stringify(updatedHistory));
    };
  }, [currentProductId]);

  // AI Recommendation Algorithm
  const recommendations = useMemo(() => {
    // Calculate category affinity scores
    const categoryScores = new Map<string, number>();
    
    browsingHistory.forEach((item, index) => {
      // Recent views have more weight
      const recencyWeight = 1 / (index + 1);
      // Longer view duration = more interest
      const durationWeight = Math.min(item.viewDuration / 10000, 1);
      const score = recencyWeight * durationWeight * 10;
      
      categoryScores.set(
        item.category,
        (categoryScores.get(item.category) || 0) + score
      );
    });

    // Score all products
    const productScores: RecommendationScore[] = allProductImages
      .filter(product => product.id !== currentProductId)
      .map(product => {
        let score = 0;
        const reasons: string[] = [];

        // Category affinity (40% weight)
        const categoryScore = categoryScores.get(product.category) || 0;
        if (categoryScore > 0) {
          score += categoryScore * 0.4;
          reasons.push(`Popular in ${product.category}`);
        }

        // Recently viewed similar products (30% weight)
        const recentSimilar = browsingHistory
          .filter(h => h.category === product.category)
          .length;
        if (recentSimilar > 0) {
          score += (recentSimilar / browsingHistory.length) * 30;
          reasons.push('Based on your recent views');
        }

        // Color matching (15% weight)
        const viewedColors = new Set(
          browsingHistory
            .map(h => {
              const p = allProductImages.find(img => img.id === h.productId);
              return p?.color;
            })
            .filter(Boolean)
        );
        if (viewedColors.has(product.color)) {
          score += 15;
          reasons.push(`You like ${product.color}`);
        }

        // Style matching (15% weight)
        const viewedStyles = new Set(
          browsingHistory
            .map(h => {
              const p = allProductImages.find(img => img.id === h.productId);
              return p?.style;
            })
            .filter(Boolean)
        );
        if (viewedStyles.has(product.style)) {
          score += 15;
          reasons.push(`Similar to ${product.style} style`);
        }

        // Boost if favorited (bonus)
        if (favorites.has(product.id)) {
          score *= 1.5;
          reasons.push('❤️ In your favorites');
        }

        // Random exploration factor (10% of time)
        if (Math.random() < 0.1) {
          score += Math.random() * 20;
          reasons.push('✨ Discover something new');
        }

        return { product, score, reasons };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return productScores;
  }, [browsingHistory, currentProductId, favorites, limit]);

  // Recently viewed products
  const recentlyViewed = useMemo(() => {
    return browsingHistory
      .slice(0, 6)
      .map(item => allProductImages.find(p => p.id === item.productId))
      .filter((p): p is ProductImage => p !== undefined);
  }, [browsingHistory]);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('product_favorites', JSON.stringify([...newFavorites]));
    triggerHaptic('light');
  };

  const ProductCard = ({ item, index }: { item: RecommendationScore | ProductImage, index: number }) => {
    const product = 'product' in item ? item.product : item;
    const reasons = 'reasons' in item ? item.reasons : [];
    const isFavorite = favorites.has(product.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden group cursor-pointer h-full">
          <div className="relative">
            <BlurImage
              src={product.url}
              alt={product.alt}
              aspectRatio="square"
              className="w-full"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={() => triggerHaptic('light')}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="gold"
                className="rounded-full"
                onClick={() => triggerHaptic('light')}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={isFavorite ? "destructive" : "outline"}
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
            </div>

            {/* AI Badge */}
            {reasons.length > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Pick
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.alt}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{product.color}</span>
              <span>•</span>
              <span>{product.style}</span>
            </div>

            {/* AI Reasons */}
            {reasons.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {reasons.slice(0, 2).map((reason, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <p className="text-sm text-muted-foreground">
                Personalized picks based on your browsing history
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((item, index) => (
              <ProductCard key={item.product.id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
              <p className="text-sm text-muted-foreground">
                Products you've checked out recently
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentlyViewed.map((product, index) => (
              <ProductCard key={product.id} item={product} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && recentlyViewed.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Start Exploring!</h3>
            <p className="text-muted-foreground mb-4">
              Browse our products and we'll suggest items you might like based on your interests.
            </p>
            <Button variant="gold">
              Browse Products
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

/**
 * AIRecommendationBadge - Small widget for product pages
 */
export const AIRecommendationBadge = ({ score }: { score: number }) => {
  if (score < 50) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
    >
      <Sparkles className="h-4 w-4" />
      {score >= 80 ? 'Perfect Match!' : score >= 65 ? 'Great Match' : 'Good Match'}
    </motion.div>
  );
};
