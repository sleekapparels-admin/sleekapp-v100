import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  ChevronDown,
  Package,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePendingApprovalProducts } from '@/hooks/useMarketplace';
import { pageTransition, staggerContainer, staggerItem, hoverLift } from '@/lib/animations';
import type { MarketplaceProduct } from '@/types/marketplace';
import { Helmet } from 'react-helmet';

export default function ProductApproval() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = usePendingApprovalProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.suppliers?.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'price_high':
          return (b.final_price || 0) - (a.final_price || 0);
        case 'price_low':
          return (a.final_price || 0) - (b.final_price || 0);
        default:
          return 0;
      }
    });

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const stats = {
    pending: products.length,
    avgPrice: products.reduce((sum, p) => sum + (p.final_price || 0), 0) / (products.length || 1),
    avgQuality: products.reduce((sum, p) => sum + p.quality_score, 0) / (products.length || 1),
    suppliers: new Set(products.map((p) => p.supplier_id)).size,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Product Approval Queue - Admin Dashboard</title>
        <meta name="description" content="Review and approve marketplace product submissions" />
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
              Product Approval Queue
            </h1>
            <p className="text-muted-foreground">
              Review and manage marketplace product submissions
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <motion.div variants={staggerItem}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Price</p>
                      <p className="text-2xl font-bold">${stats.avgPrice.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Quality</p>
                      <p className="text-2xl font-bold">{stats.avgQuality.toFixed(1)}/100</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Suppliers</p>
                      <p className="text-2xl font-bold">{stats.suppliers}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products or suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedProducts.size > 0 && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedProducts.size === filteredProducts.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedProducts.size} selected
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Approve All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'All products have been reviewed'}
              </p>
            </Card>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={staggerItem}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={hoverLift}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Selection Checkbox */}
                          <div className="flex items-start pt-1">
                            <Checkbox
                              checked={selectedProducts.has(product.id)}
                              onCheckedChange={() => toggleProductSelection(product.id)}
                            />
                          </div>

                          {/* Product Image */}
                          <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{product.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  by {product.suppliers?.company_name || 'Unknown Supplier'}
                                </p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {product.category}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {product.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">Price:</span>{' '}
                                <span className="font-semibold">${product.final_price}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">MOQ:</span>{' '}
                                <span className="font-medium">{product.moq} {product.unit}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Stock:</span>{' '}
                                <span className="font-medium">{product.available_quantity}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Quality:</span>{' '}
                                <span className="font-medium">{product.quality_score}/100</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Submitted{' '}
                              {new Date(product.created_at || '').toLocaleDateString()}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/products/${product.id}/review`)
                              }
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Review
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
