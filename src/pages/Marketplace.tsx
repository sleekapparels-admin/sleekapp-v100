import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  Star,
  MapPin,
  Package,
  DollarSign,
  TrendingUp,
  Heart,
  Eye,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useMarketplaceProducts } from '@/hooks/useMarketplace';
import { pageTransition, staggerContainer, staggerItem, hoverLift } from '@/lib/animations';
import type { ProductSearchFilters, MarketplaceProduct } from '@/types/marketplace';
import { Helmet } from 'react-helmet';

const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'fabric', label: 'Fabrics & Materials' },
  { value: 'garment', label: 'Finished Garments' },
  { value: 'yarn', label: 'Yarn & Thread' },
  { value: 'accessories', label: 'Trims & Accessories' },
  { value: 'stock_lot', label: 'Stock Lots' },
  { value: 'sample', label: 'Sample Collections' },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductSearchFilters>({
    sortBy: 'newest',
    page: 1,
    limit: 20,
  });

  // Temporary filters state for the filter sheet
  const [tempFilters, setTempFilters] = useState({
    category: filters.category || 'all',
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 10000,
    minMoq: filters.minMoq || 0,
    maxMoq: filters.maxMoq || 10000,
    inStock: filters.inStock || false,
    featured: filters.featured || false,
  });

  const { data: products = [], isLoading } = useMarketplaceProducts(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, searchQuery, page: 1 });
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      category: tempFilters.category === 'all' ? undefined : tempFilters.category,
      minPrice: tempFilters.minPrice,
      maxPrice: tempFilters.maxPrice,
      minMoq: tempFilters.minMoq,
      maxMoq: tempFilters.maxMoq,
      inStock: tempFilters.inStock,
      featured: tempFilters.featured,
      page: 1,
    });
  };

  const clearFilters = () => {
    setTempFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      minMoq: 0,
      maxMoq: 10000,
      inStock: false,
      featured: false,
    });
    setFilters({
      sortBy: 'newest',
      page: 1,
      limit: 20,
    });
  };

  const ProductCard = ({ product }: { product: MarketplaceProduct }) => (
    <motion.div variants={staggerItem} whileHover={hoverLift}>
      <Card
        className="overflow-hidden cursor-pointer h-full group"
        onClick={() => navigate(`/marketplace/${product.id}`)}
      >
        {/* Image */}
        <div className="aspect-square relative bg-gray-100">
          {product.primary_image || product.images?.[0] ? (
            <img
              src={product.primary_image || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.available_quantity > 0 && (
              <Badge variant="secondary">In Stock</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/marketplace/${product.id}`);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Supplier */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {product.suppliers?.tier || 'BRONZE'}
              </Badge>
              <span className="truncate">{product.suppliers?.company_name}</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Price & MOQ */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">${product.final_price}</p>
                <p className="text-xs text-muted-foreground">
                  MOQ: {product.moq} {product.unit}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{product.rating || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.views || 0} views
                </p>
              </div>
            </div>

            {/* Location & Lead Time */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.shipping_from || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.lead_time_days}d lead time
              </div>
            </div>

            {/* Action Button */}
            <Button
              className="w-full mt-2"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/marketplace/${product.id}`);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Marketplace - Browse Quality Textile Products | LoopTrace</title>
        <meta
          name="description"
          content="Discover quality fabrics, garments, and textile products from verified suppliers"
        />
      </Helmet>

      <Navbar />

      <motion.div
        {...pageTransition}
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-16"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Browse quality textile products from verified suppliers worldwide
            </p>
          </motion.div>

          {/* Search and Filters Bar */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products, suppliers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Category Quick Select */}
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      category: value === 'all' ? undefined : value,
                      page: 1,
                    })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Advanced Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {(filters.minPrice ||
                        filters.maxPrice ||
                        filters.minMoq ||
                        filters.maxMoq ||
                        filters.inStock ||
                        filters.featured) && (
                        <Badge className="ml-2" variant="secondary">
                          Active
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                      <SheetDescription>
                        Refine your search with advanced filters
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      {/* Price Range */}
                      <div className="space-y-2">
                        <Label>Price Range (USD)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={tempFilters.minPrice}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                minPrice: Number(e.target.value),
                              })
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={tempFilters.maxPrice}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                maxPrice: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* MOQ Range */}
                      <div className="space-y-2">
                        <Label>Minimum Order Quantity</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={tempFilters.minMoq}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                minMoq: Number(e.target.value),
                              })
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={tempFilters.maxMoq}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
                                maxMoq: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="inStock"
                            checked={tempFilters.inStock}
                            onCheckedChange={(checked) =>
                              setTempFilters({
                                ...tempFilters,
                                inStock: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="inStock">In Stock Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={tempFilters.featured}
                            onCheckedChange={(checked) =>
                              setTempFilters({
                                ...tempFilters,
                                featured: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="featured">Featured Products</Label>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button onClick={clearFilters} variant="outline" className="flex-1">
                          Clear All
                        </Button>
                        <Button onClick={applyFilters} className="flex-1">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters({ ...filters, sortBy: value as any, page: 1 })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </Card>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}

          {/* Load More / Pagination */}
          {products.length > 0 && products.length >= (filters.limit || 20) && (
            <div className="mt-8 text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
