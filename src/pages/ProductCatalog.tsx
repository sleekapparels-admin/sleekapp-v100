import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search, Filter, Grid3x3, List, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [moqFilter, setMoqFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categoryFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*");

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products?.filter((product: any) => {
    const moq = product.moq || 50;
    return moq >= moqFilter;
  });

  return (
    <>
      <SEO config={getPageSEO("services")} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Product Catalog</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Browse our complete range of custom manufacturing capabilities
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filter Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      <h3 className="font-bold">Filters</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.slug}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* MOQ Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Order Quantity</label>
                      <Select value={moqFilter.toString()} onValueChange={(v) => setMoqFilter(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Any MOQ</SelectItem>
                          <SelectItem value="50">50+ pieces</SelectItem>
                          <SelectItem value="100">100+ pieces</SelectItem>
                          <SelectItem value="200">200+ pieces</SelectItem>
                          <SelectItem value="500">500+ pieces</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1"
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product Grid */}
              <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredProducts?.length || 0} products found
                  </p>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-muted" />
                        <CardContent className="pt-4">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                  }>
                    {filteredProducts?.map((product: any) => (
                      <Card key={product.id} className="group hover:shadow-card-hover transition-shadow">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== '/placeholder.svg') {
                                target.src = '/placeholder.svg';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.featured && (
                            <Badge className="absolute top-2 right-2">Featured</Badge>
                          )}
                        </div>
                        <CardHeader>
                          <h3 className="font-bold text-lg">{product.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">MOQ:</span>
                            <span className="font-medium">{product.moq || 50} pieces</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-muted-foreground">Lead Time:</span>
                            <span className="font-medium">{product.lead_time_days || 30} days</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button variant="default" className="flex-1" asChild>
                            <Link to={`/design-studio?product=${product.id}`}>
                              Customize
                            </Link>
                          </Button>
                          <Button variant="outline" className="flex-1" asChild>
                            <Link to={`/contact`}>
                              Get Quote
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default ProductCatalog;
