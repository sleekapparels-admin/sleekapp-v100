import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Package,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplaceProducts } from '@/hooks/useMarketplace';
import { staggerContainer, staggerItem, hoverLift, fadeIn } from '@/lib/animations';
import type { MarketplaceProduct } from '@/types/marketplace';
import { getRandomImages } from '@/lib/aiGeneratedProductImages';
import OptimizedImage from '@/components/OptimizedImage';

const PRODUCT_CATEGORIES = [
  { value: 'fabric', label: 'Fabrics', icon: '🧵', color: 'from-blue-500 to-cyan-500' },
  { value: 'garment', label: 'Garments', icon: '👕', color: 'from-purple-500 to-pink-500' },
  { value: 'yarn', label: 'Yarn', icon: '🧶', color: 'from-orange-500 to-red-500' },
  { value: 'accessories', label: 'Accessories', icon: '📌', color: 'from-green-500 to-emerald-500' },
  { value: 'stock_lot', label: 'Stock Lots', icon: '📦', color: 'from-yellow-500 to-orange-500' },
  { value: 'sample', label: 'Samples', icon: '✨', color: 'from-indigo-500 to-purple-500' },
];

export function FeaturedMarketplace() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch featured products
  const { data: featuredProducts = [] } = useMarketplaceProducts({
    featured: true,
    limit: 8,
  });

  // Fetch products by category
  const { data: categoryProducts = [] } = useMarketplaceProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 4,
  });

  const productsPerSlide = 4;
  const totalSlides = Math.ceil(featuredProducts.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentProducts = featuredProducts.slice(
    currentSlide * productsPerSlide,
    (currentSlide + 1) * productsPerSlide
  );

  const ProductCard = ({ product }: { product: MarketplaceProduct }) => (
    <motion.div variants={staggerItem} whileHover={hoverLift}>
      <Card
        className="overflow-hidden cursor-pointer h-full group"
        onClick={() => navigate(`/marketplace/${product.id}`)}
      >
        {/* Image */}
        <div className="aspect-square relative bg-gray-100 overflow-hidden">
          {product.primary_image || product.images?.[0] ? (
            <OptimizedImage
              src={product.primary_image || product.images[0]}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Featured Badge */}
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>

          {/* Quick Action */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <Button
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/marketplace/${product.id}`);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Supplier */}
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="text-xs">
                {product.suppliers?.tier || 'BRONZE'}
              </Badge>
              <span className="text-muted-foreground truncate">
                {product.suppliers?.company_name}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Price & Rating */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-primary">${product.final_price}</p>
                <p className="text-xs text-muted-foreground">
                  MOQ: {product.moq} {product.unit}
                </p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{product.rating || 0}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
              <MapPin className="h-3 w-3" />
              {product.shipping_from || 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600">
            <Sparkles className="h-3 w-3 mr-1" />
            Marketplace
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover premium quality products from our verified suppliers
          </p>
        </motion.div>

        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Hot Deals
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  disabled={totalSlides <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentSlide + 1} / {totalSlides}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  disabled={totalSlides <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="mb-16">
            <div className="text-center py-8 mb-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-1">Marketplace coming soon!</p>
              <p className="text-sm text-muted-foreground">Check out our product showcase below</p>
            </div>

            {/* Fallback: Show AI-generated product showcase */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {getRandomImages(8).map((img) => (
                <motion.div key={img.id} variants={staggerItem} whileHover={hoverLift}>
                  <Card className="overflow-hidden cursor-pointer h-full group">
                    <div className="aspect-square relative bg-gray-100 overflow-hidden">
                      <OptimizedImage
                        src={img.url}
                        alt={img.alt}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary z-10">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{img.category.toUpperCase()}</p>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {img.alt}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {img.color} • {img.style}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Category Showcase */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Browse by Category</h3>
            <Button variant="link" onClick={() => navigate('/marketplace')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Category Pills */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <motion.div key={category.value} variants={staggerItem}>
                <Card
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedCategory === category.value
                      ? 'ring-2 ring-primary shadow-lg'
                      : ''
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <p className="font-semibold text-sm">{category.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Category Products */}
          {categoryProducts.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {categoryProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </div>

        {/* New Arrivals */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              New Arrivals
            </h3>
            <Button variant="link" onClick={() => navigate('/marketplace')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/marketplace')}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
          >
            Explore Full Marketplace
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
