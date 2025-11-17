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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Filter, Grid3x3, List, ChevronRight, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [moqFilter, setMoqFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  // Filter panel open states
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [moqOpen, setMoqOpen] = useState(true);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categoryFilter, searchQuery, sortBy],
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

      // Add sorting
      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "popular":
          query = query.order("featured", { ascending: false });
          break;
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

  // Filter products
  const filteredProducts = products?.filter((product: any) => {
    const moq = product.moq || 50;
    const price = product.price || 0;
    
    // MOQ filter
    if (moq < moqFilter) return false;
    
    // Price range filter (if price data exists)
    if (price > 0 && (price < priceRange[0] || price > priceRange[1])) return false;
    
    // Material filter
    if (selectedMaterials.length > 0 && product.materials) {
      const hasMatchingMaterial = selectedMaterials.some(mat => 
        product.materials.includes(mat)
      );
      if (!hasMatchingMaterial) return false;
    }
    
    // Color filter
    if (selectedColors.length > 0 && product.colors) {
      const hasMatchingColor = selectedColors.some(color => 
        product.colors.includes(color)
      );
      if (!hasMatchingColor) return false;
    }
    
    return true;
  });

  // Available materials and colors (for filter options)
  const availableMaterials = ["Cotton", "Polyester", "Wool", "Cashmere", "Acrylic", "Blended"];
  const availableColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Navy", value: "#000080" },
    { name: "Gray", value: "#808080" },
    { name: "Red", value: "#DC2626" },
    { name: "Blue", value: "#3B82F6" },
  ];

  // Calculate active filter count
  const activeFilterCount = 
    (categoryFilter !== "all" ? 1 : 0) +
    (moqFilter > 0 ? 1 : 0) +
    (selectedMaterials.length) +
    (selectedColors.length);

  // Clear all filters
  const clearAllFilters = () => {
    setCategoryFilter("all");
    setMoqFilter(0);
    setPriceRange([0, 1000]);
    setSelectedMaterials([]);
    setSelectedColors([]);
  };

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2">{activeFilterCount}</Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-8 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-1">
        {/* Category Filter */}
        <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
            <span className="text-sm font-semibold">Category</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 px-2 space-y-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
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
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* MOQ Filter */}
        <Collapsible open={moqOpen} onOpenChange={setMoqOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
            <span className="text-sm font-semibold">Minimum Order Quantity</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${moqOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 px-2 space-y-2">
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
                <SelectItem value="1000">1000+ pieces</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range Filter */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
            <span className="text-sm font-semibold">Price Range</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 px-2 space-y-3">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Material Filter */}
        <Collapsible open={materialOpen} onOpenChange={setMaterialOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
            <span className="text-sm font-semibold">Material</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${materialOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 px-2 space-y-3">
            {availableMaterials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={material}
                  checked={selectedMaterials.includes(material)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMaterials([...selectedMaterials, material]);
                    } else {
                      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
                    }
                  }}
                />
                <Label htmlFor={material} className="text-sm font-normal cursor-pointer">
                  {material}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Color Filter */}
        <Collapsible open={colorOpen} onOpenChange={setColorOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
            <span className="text-sm font-semibold">Color</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${colorOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 px-2">
            <div className="grid grid-cols-3 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    if (selectedColors.includes(color.value)) {
                      setSelectedColors(selectedColors.filter(c => c !== color.value));
                    } else {
                      setSelectedColors([...selectedColors, color.value]);
                    }
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors ${
                    selectedColors.includes(color.value) ? 'bg-muted' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColors.includes(color.value) ? 'border-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs">{color.name}</span>
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* View Mode Toggle */}
        <div className="pt-4 px-2">
          <Label className="text-sm font-semibold mb-2 block">View</Label>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO config={getPageSEO("services")} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Product Catalog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Browse our complete range of custom manufacturing capabilities
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products by name, material, or style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg shadow-lg border-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <FilterSidebar />
              </div>

              {/* Product Grid */}
              <div className="lg:col-span-3">
                {/* Mobile Filter Button & Results Header */}
                <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Sheet */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="lg" className="lg:hidden relative">
                          <Filter className="h-5 w-5 mr-2" />
                          Filters
                          {activeFilterCount > 0 && (
                            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {activeFilterCount}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Filter Products</SheetTitle>
                          <SheetDescription>
                            Refine your search with filters below
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>

                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredProducts?.length || 0}</span> products found
                    </p>
                  </div>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                  <div className="mb-6 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {categoryFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        {categoryFilter}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setCategoryFilter("all")}
                        />
                      </Badge>
                    )}
                    {moqFilter > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        MOQ: {moqFilter}+
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setMoqFilter(0)}
                        />
                      </Badge>
                    )}
                    {selectedMaterials.map(mat => (
                      <Badge key={mat} variant="secondary" className="gap-1">
                        {mat}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setSelectedMaterials(selectedMaterials.filter(m => m !== mat))}
                        />
                      </Badge>
                    ))}
                    {selectedColors.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedColors.length} color{selectedColors.length > 1 ? 's' : ''}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setSelectedColors([])}
                        />
                      </Badge>
                    )}
                  </div>
                )}

                {/* Products Display */}
                {isLoading ? (
                  <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-t-lg" />
                        <CardContent className="pt-4 space-y-2">
                          <div className="h-5 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} variant={viewMode} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold">No products found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                      {activeFilterCount > 0 && (
                        <Button onClick={clearAllFilters} variant="outline">
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </Card>
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
