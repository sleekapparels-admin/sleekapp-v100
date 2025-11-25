import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatchProgressIndicator } from "@/components/aggregation/BatchProgressIndicator";
import { PricingSavingsCard } from "@/components/aggregation/PricingSavingsCard";
import { useActiveBatches, useMyBatchContributions } from "@/hooks/useAggregation";
import { Sparkles, TrendingUp, Users, Clock } from "lucide-react";

const SmartOrdering = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: activeBatches, isLoading } = useActiveBatches(
    selectedCategory === "all" ? undefined : selectedCategory
  );
  const { data: myContributions } = useMyBatchContributions();

  const categories = ["all", "T-Shirts", "Hoodies", "Polo Shirts", "Tank Tops"];

  return (
    <>
      <SEO
        config={{
          title: "Smart Ordering - Wholesale Prices for Small Orders | Sleek Apparels",
          description: "Order 50 pieces and pay wholesale prices through shared production batching. Join other brands and save 20% or more.",
          canonical: "/smart-ordering",
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-green-600">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart Production Batching
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Order 50 Pieces. Pay Wholesale Prices.
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Shared production makes small orders affordable. Join other brands in production batches 
                  and save up to 20% compared to solo orders.
                </p>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">Brands This Month</p>
                </Card>
                <Card className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">20%</p>
                  <p className="text-sm text-muted-foreground">Average Savings</p>
                </Card>
                <Card className="p-6 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">14 Days</p>
                  <p className="text-sm text-muted-foreground">Avg. Lead Time</p>
                </Card>
                <Card className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">50pc</p>
                  <p className="text-sm text-muted-foreground">Minimum Order</p>
                </Card>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Tabs defaultValue="active-batches" className="space-y-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="active-batches">Active Batches</TabsTrigger>
                  <TabsTrigger value="my-orders">My Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="active-batches" className="space-y-8">
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                        size="sm"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>

                  {/* Active Batches Grid */}
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading batches...</p>
                    </div>
                  ) : activeBatches && activeBatches.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeBatches.map((batch) => (
                        <Card key={batch.id} className="p-6 space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {batch.product_category}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {batch.product_variant_base}
                            </p>
                          </div>

                          <BatchProgressIndicator
                            currentQuantity={batch.current_quantity}
                            targetQuantity={batch.target_quantity}
                            currentStyleCount={batch.current_style_count}
                            maxStyles={batch.max_styles}
                            estimatedStartDate={batch.estimated_start_date}
                            windowClosesAt={batch.window_closes_at}
                            showDetails={true}
                          />

                          <PricingSavingsCard
                            soloPrice={batch.unit_price_base * 1.5}
                            aggregatedPrice={batch.unit_price_base * 1.2}
                            quantity={50}
                          />

                          <Button className="w-full" size="lg">
                            Join This Batch - $600
                          </Button>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Active Batches</h3>
                      <p className="text-muted-foreground mb-6">
                        Be the first to start a batch in this category!
                      </p>
                      <Button size="lg">Start New Batch</Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="my-orders" className="space-y-6">
                  {myContributions && myContributions.length > 0 ? (
                    <div className="space-y-4">
                      {myContributions.map((contribution: any) => (
                        <Card key={contribution.id} className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">
                                Order #{contribution.order_id.substring(0, 8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {contribution.quantity} pieces
                              </p>
                            </div>
                            <Badge>
                              {contribution.production_batches.batch_status}
                            </Badge>
                          </div>
                          <BatchProgressIndicator
                            currentQuantity={contribution.production_batches.current_quantity}
                            targetQuantity={contribution.production_batches.target_quantity}
                            currentStyleCount={contribution.production_batches.current_style_count}
                            maxStyles={contribution.production_batches.max_styles}
                            estimatedStartDate={contribution.production_batches.estimated_start_date}
                            windowClosesAt={contribution.production_batches.window_closes_at}
                            showDetails={true}
                          />
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <p className="text-muted-foreground">No orders yet</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Place Your Order</h3>
                  <p className="text-sm text-muted-foreground">
                    Order just 50 pieces of your chosen style. We'll automatically find or create 
                    the best production batch for you.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Batch Fills Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Other brands join the same batch. Once we reach 200 pieces (or 75%+ within 7 days), 
                    production starts automatically.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Track & Receive</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch your order progress with LoopTrace™. Receive your 50 pieces 14-18 days 
                    after production starts.
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SmartOrdering;
