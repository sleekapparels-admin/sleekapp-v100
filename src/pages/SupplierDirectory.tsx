import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuppliers, type SupplierFilters } from "@/hooks/useSuppliers";
import { Search, MapPin, Star, Factory, Building2, Package } from "lucide-react";
import { Link } from "react-router-dom";

const SupplierDirectory = () => {
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { data: suppliers, isLoading } = useSuppliers(filters);

  const handleSearch = () => {
    setFilters({ ...filters, location: searchTerm });
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'gold': return 'bg-yellow-500 text-yellow-950';
      case 'silver': return 'bg-gray-400 text-gray-950';
      case 'bronze': return 'bg-orange-600 text-orange-950';
      default: return 'bg-gray-500 text-gray-950';
    }
  };

  const calculateAverageRating = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.overall_score || 0), 0);
    return sum / ratings.length;
  };

  return (
    <>
      <SEO 
        config={{
          title: "Our Manufacturing Network | Verified Bangladesh Production Facilities",
          description: "Direct access to our curated manufacturing partners in Bangladesh. Premium facilities specializing in custom apparel production with transparent tracking.",
          canonical: "/suppliers",
        }} 
      />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our Manufacturing Network
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Direct access to verified production facilities in Bangladesh. We carefully curate manufacturing partners to ensure quality, reliability, and ethical practices for every order.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Partner Network Growing - New Facilities Being Verified
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 flex gap-2">
                    <Input
                      placeholder="Search by location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <Select 
                    value={filters.product_category || "all"}
                    onValueChange={(value) => 
                      setFilters({ ...filters, product_category: value === "all" ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Product Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="knitwear">Knitwear</SelectItem>
                      <SelectItem value="cut_and_sew">Cut & Sew</SelectItem>
                      <SelectItem value="uniforms">Uniforms</SelectItem>
                      <SelectItem value="activewear">Activewear</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.tier || "all"}
                    onValueChange={(value) => 
                      setFilters({ ...filters, tier: value === "all" ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Partner Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Partners Grid or Showcase */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading manufacturing partners...</p>
              </div>
            ) : suppliers && suppliers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier: any) => (
                  <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{supplier.company_name}</CardTitle>
                        <Badge className={getTierColor(supplier.tier || 'bronze')}>
                          {supplier.tier || 'Bronze'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <MapPin className="w-4 h-4" />
                        {supplier.factory_location}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            MOQ
                          </span>
                          <span className="font-medium">{supplier.moq_minimum}+ pieces</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            Lead Time
                          </span>
                          <span className="font-medium">{supplier.lead_time_days} days</span>
                        </div>

                        {supplier.supplier_ratings && supplier.supplier_ratings.length > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              Rating
                            </span>
                            <span className="font-medium">
                              {calculateAverageRating(supplier.supplier_ratings).toFixed(1)}/5 
                              ({supplier.supplier_ratings.length})
                            </span>
                          </div>
                        )}

                        {supplier.supplier_capabilities && supplier.supplier_capabilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {supplier.supplier_capabilities.slice(0, 3).map((cap: any, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cap.product_category}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/suppliers/${supplier.id}`} className="w-full">
                        <Button className="w-full" variant="outline">
                          View Partner Profile
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Primary Manufacturing Partner - Sleek Apparels */}
                <Card className="mb-8 border-2 border-primary/20 shadow-xl">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl">Sleek Atelier</CardTitle>
                      <Badge className="bg-yellow-500 text-yellow-950 font-semibold">
                        Gold Partner
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Dhaka, Bangladesh
                    </p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">
                        Our flagship manufacturing facility specializing in premium knitwear, uniforms, and custom apparel. Direct production with full LoopTrace™ transparency and real-time tracking.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold block">MOQ: 50 pieces</span>
                            <span className="text-xs text-muted-foreground">Lowest in network</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="font-semibold block">Lead Time: 10-20 days</span>
                            <span className="text-xs text-muted-foreground">Fast turnaround</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          <div>
                            <span className="font-semibold block">Rating: 4.9/5.0</span>
                            <span className="text-xs text-muted-foreground">Based on 120+ orders</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge variant="secondary">Knitwear</Badge>
                        <Badge variant="secondary">Uniforms</Badge>
                        <Badge variant="secondary">T-Shirts</Badge>
                        <Badge variant="secondary">Hoodies</Badge>
                        <Badge variant="secondary">Polo Shirts</Badge>
                        <Badge variant="secondary">Custom Apparel</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/quote-generator">
                        Get Instant Quote
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Coming Soon Partners */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-center">Expanding Partner Network</h2>
                  <p className="text-center text-muted-foreground mb-6">
                    We're currently verifying additional manufacturing partners to expand our capabilities
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="opacity-90 hover:opacity-100 transition-opacity">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">Loop&Fiber</CardTitle>
                          <Badge variant="outline" className="border-primary text-primary">
                            Verification in Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Gazipur, Bangladesh
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Specializing in sustainable cotton manufacturing and eco-friendly dyeing processes.
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Projected MOQ:</span>
                            <span>100 pieces</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Est. Lead Time:</span>
                            <span>15-25 days</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="secondary">Sustainable Cotton</Badge>
                            <Badge variant="secondary">Eco-Friendly</Badge>
                            <Badge variant="secondary">Large Volume</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" disabled className="w-full">
                          Coming Soon
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="opacity-90 hover:opacity-100 transition-opacity">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">KnitCraft Labs</CardTitle>
                          <Badge variant="outline" className="border-primary text-primary">
                            Verification in Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Chittagong, Bangladesh
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            High-end knitwear specialist with advanced circular knitting technology.
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Projected MOQ:</span>
                            <span>200 pieces</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Est. Lead Time:</span>
                            <span>20-30 days</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Badge variant="secondary">Premium Knitwear</Badge>
                            <Badge variant="secondary">Technical Fabrics</Badge>
                            <Badge variant="secondary">Advanced Tech</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" disabled className="w-full">
                          Coming Soon
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center py-12 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <Factory className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Interested in Partnering?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    We're actively seeking verified manufacturing partners to join our network. Benefit from our buyer network, LoopTrace™ technology, and streamlined operations.
                  </p>
                  <Button asChild size="lg">
                    <Link to="/become-supplier">
                      Apply as Manufacturing Partner
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SupplierDirectory;