import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Product3DCarousel } from '@/components/Product3DCarousel';
import { SmartProductSearch } from '@/components/SmartProductSearch';
import { BlurImage } from '@/components/BlurImage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { allProductImages, getRandomImages } from '@/lib/aiGeneratedProductImages';
import { 
  triggerHaptic, 
  celebrateSuccess, 
  createRipple, 
  shakeElement,
  pulseElement,
  smoothScroll,
  buttonTap,
  cardHover,
  fadeInUp,
  staggerContainer
} from '@/lib/microInteractions';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Layers, 
  Eye, 
  Search,
  MousePointer2,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ProductImage } from '@/lib/aiGeneratedProductImages';

const InnovationShowcase = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);

  const handleProductSelect = (product: ProductImage) => {
    setSelectedProduct(product);
    toast({
      title: "Product Selected!",
      description: product.alt,
    });
  };

  const handleSuccessClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic('success');
    celebrateSuccess(e.currentTarget);
    toast({
      title: "🎉 Success!",
      description: "Check out that celebration animation!",
    });
  };

  const handleHapticClick = (type: 'light' | 'medium' | 'heavy') => {
    triggerHaptic(type);
    toast({
      title: `Haptic ${type}`,
      description: "Feel the feedback!",
    });
  };

  const handleErrorShake = (e: React.MouseEvent<HTMLButtonElement>) => {
    shakeElement(e.currentTarget);
    triggerHaptic('error');
    toast({
      variant: "destructive",
      title: "Error Animation",
      description: "Did you see that shake?",
    });
  };

  const handlePulse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await pulseElement(e.currentTarget, 3);
    triggerHaptic('warning');
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Innovation Showcase</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
              >
                Experience the Future
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Discover our cutting-edge UI innovations: Progressive image loading, 3D product carousels, 
                intelligent search, and delightful micro-interactions that make every click feel amazing.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={() => smoothScroll('#features', 100)}
                  className="gap-2"
                >
                  Explore Features <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => smoothScroll('#carousel', 100)}
                >
                  See 3D Carousel
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
          </div>
        </section>

        {/* Features Overview */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Innovation Features</h2>
              <p className="text-lg text-muted-foreground">
                Each feature designed to enhance user experience and delight
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Layers,
                  title: "Progressive Image Loading",
                  description: "Blur-up effect with lazy loading for optimal performance",
                  color: "text-blue-500"
                },
                {
                  icon: Eye,
                  title: "3D Product Carousel",
                  description: "Interactive showcase with parallax and perspective transforms",
                  color: "text-purple-500"
                },
                {
                  icon: Search,
                  title: "Smart Fuzzy Search",
                  description: "Intelligent product search with Levenshtein distance algorithm",
                  color: "text-green-500"
                },
                {
                  icon: MousePointer2,
                  title: "Micro-Interactions",
                  description: "Delightful feedback with haptics, ripples, and celebrations",
                  color: "text-orange-500"
                },
                {
                  icon: Zap,
                  title: "Performance Optimized",
                  description: "Intersection observers and debounced updates",
                  color: "text-yellow-500"
                },
                {
                  icon: Smartphone,
                  title: "Touch & Gesture Support",
                  description: "Full mobile support with swipe gestures and haptic feedback",
                  color: "text-pink-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card className="p-6 h-full cursor-pointer">
                    <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart Search Demo */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Smart Product Search</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Try our fuzzy search - it understands what you mean, even with typos!
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <SmartProductSearch
                products={allProductImages}
                onProductSelect={handleProductSelect}
              />
            </div>

            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto"
              >
                <Card className="p-4">
                  <BlurImage
                    src={selectedProduct.url}
                    alt={selectedProduct.alt}
                    className="rounded-lg mb-4"
                    aspectRatio="square"
                  />
                  <h3 className="font-semibold text-lg">{selectedProduct.alt}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.color} • {selectedProduct.style}
                  </p>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        {/* 3D Carousel Demo */}
        <section id="carousel" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">3D Product Carousel</h2>
              <p className="text-lg text-muted-foreground">
                Hover and interact - experience smooth 3D transforms and parallax effects
              </p>
            </div>

            <Product3DCarousel 
              products={getRandomImages(12)} 
              autoplay={true}
              autoplayDelay={6000}
            />
          </div>
        </section>

        {/* Progressive Image Loading Demo */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Progressive Image Loading</h2>
              <p className="text-lg text-muted-foreground">
                Notice the smooth blur-up effect as images load
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getRandomImages(8).map((product) => (
                <BlurImage
                  key={product.id}
                  src={product.url}
                  alt={product.alt}
                  className="rounded-lg"
                  aspectRatio="square"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Micro-Interactions Demo */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Micro-Interactions</h2>
              <p className="text-lg text-muted-foreground">
                Click these buttons to experience delightful feedback
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Haptic Feedback</h3>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleHapticClick('light')}
                    className="w-full"
                  >
                    Light Haptic
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleHapticClick('medium')}
                    className="w-full"
                  >
                    Medium Haptic
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleHapticClick('heavy')}
                    className="w-full"
                  >
                    Heavy Haptic
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Animations</h3>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="default" 
                    onClick={handleSuccessClick}
                    className="w-full"
                  >
                    🎉 Success Celebration
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleErrorShake}
                    className="w-full"
                  >
                    ⚠️ Error Shake
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handlePulse}
                    className="w-full"
                  >
                    💫 Pulse Animation
                  </Button>
                </div>
              </Card>

              <Card className="p-6 md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Ripple Effect</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click anywhere on this button to see the ripple
                </p>
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={createRipple}
                  className="w-full relative overflow-hidden"
                >
                  Click Me for Ripple Effect
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Experience More?</h2>
              <p className="text-xl mb-8 opacity-90">
                These innovations are integrated throughout our entire platform. 
                Explore our products and see them in action!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.location.href = '/'}
                >
                  Explore Products
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Add ripple styles */}
      <style>{`
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.6);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default InnovationShowcase;
