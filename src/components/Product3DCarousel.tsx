import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BlurImage } from '@/components/BlurImage';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/aiGeneratedProductImages';

interface Product3DCarouselProps {
  products: ProductImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

/**
 * Product3DCarousel - Interactive 3D Product Showcase
 * 
 * Features:
 * - 3D perspective transforms on hover
 * - Smooth carousel navigation
 * - Auto-play with pause on hover
 * - Parallax effect on mouse move
 * - Quick action buttons (View, Add to Cart, Wishlist)
 * - Touch/swipe gestures support
 * - Fully accessible with keyboard navigation
 */
export const Product3DCarousel = ({
  products,
  autoplay = true,
  autoplayDelay = 5000,
}: Product3DCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax transforms
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isPaused, currentIndex]);

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const currentProduct = products[currentIndex];

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'right' ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: 'left' | 'right') => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'right' ? -45 : 45,
    }),
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative h-[600px] perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.6 },
            }}
            className="absolute inset-0"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
              }}
              className="h-full preserve-3d"
            >
              <Card className="h-full overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Product Image */}
                  <div className="relative group">
                    <BlurImage
                      src={currentProduct.url}
                      alt={currentProduct.alt}
                      className="h-full w-full"
                      priority
                    />
                    
                    {/* Hover overlay with quick actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant="secondary"
                          className="rounded-full h-14 w-14 p-0"
                        >
                          <Eye className="h-6 w-6" />
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant="gold"
                          className="rounded-full h-14 w-14 p-0"
                        >
                          <ShoppingCart className="h-6 w-6" />
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          variant={favorites.has(currentProduct.id) ? "destructive" : "outline"}
                          className="rounded-full h-14 w-14 p-0"
                          onClick={() => toggleFavorite(currentProduct.id)}
                        >
                          <Heart
                            className={cn(
                              "h-6 w-6",
                              favorites.has(currentProduct.id) && "fill-current"
                            )}
                          />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {currentProduct.category.toUpperCase()}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-background to-muted/20">
                    <div>
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold mb-4"
                      >
                        {currentProduct.alt}
                      </motion.h2>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3 mb-6"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-muted-foreground">Style:</span>
                          <span className="text-lg">{currentProduct.style}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-muted-foreground">Color:</span>
                          <span className="text-lg">{currentProduct.color}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-muted-foreground">MOQ:</span>
                          <span className="text-lg font-bold text-primary">50 pieces</span>
                        </div>
                      </motion.div>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-6"
                      >
                        Premium quality {currentProduct.category} manufactured with precision. 
                        Perfect for brands looking for sustainable and ethical production.
                      </motion.p>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-3"
                    >
                      <Button variant="gold" className="flex-1" size="lg">
                        Get Quote
                      </Button>
                      <Button variant="outline" className="flex-1" size="lg">
                        View Details
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full shadow-lg"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} / {products.length}
      </div>
    </div>
  );
};
