import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { AnimatedSection } from "@/components/AnimatedSection";
import { LazyImage } from "@/components/LazyImage";
import { Link } from "react-router-dom";

import { getPhotorealisticImage } from "@/lib/portfolioImagesPhotorealistic";

interface Product {
  id: string;
  title: string;
  category: string;
  gauge: string | null;
  yarn: string | null;
  colors: string[] | null;
  image_url: string;
  description: string | null;
  featured: boolean;
}

const categories = [
  { id: "all", label: "All Products" },
  { id: "Knitwear", label: "Knitwear" },
  { id: "Cut & Sew", label: "Cut & Sew" },
  { id: "Uniforms", label: "Uniforms" },
  { id: "Accessories", label: "Accessories" },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    activeCategory === "all" 
      ? products 
      : products.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <SEO config={getPageSEO('portfolio')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <AnimatedSection>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">Our Work in Action — Knitwear, Wovens & Uniforms</h1>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                  Explore our portfolio of precision-manufactured apparel across various styles, knit structures, and applications.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Filter Buttons */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <AnimatedSection 
                  key={category.id}
                  delay={index * 0.05}
                  variant="fadeUp"
                >
                  <Button
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => setActiveCategory(category.id)}
                    className="transition-all"
                  >
                    {category.label}
                  </Button>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, index) => (
                  <AnimatedSection
                    key={item.id}
                    delay={index * 0.1}
                    variant="fadeUp"
                  >
                    <div
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1"
                      onClick={() => setSelectedProduct(item)}
                    >
                       <div className="aspect-[4/5] overflow-hidden bg-white">
                        <LazyImage
                          src={getPhotorealisticImage(item.image_url) || getPhotorealisticImage(item.title) || getPhotorealisticImage(item.category) || '/placeholder.svg'}
                          alt={item.title}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-bold mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                          <Button size="sm" className="w-full">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogTitle className="sr-only">
              {selectedProduct?.title || 'Product Details'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              View detailed information about {selectedProduct?.title || 'this product'}
            </DialogDescription>
            {selectedProduct && (
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-square bg-white">
                  <LazyImage
                    src={getPhotorealisticImage(selectedProduct.image_url) || getPhotorealisticImage(selectedProduct.title) || getPhotorealisticImage(selectedProduct.category) || '/placeholder.svg'}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-8"
                    priority
                  />
                </div>
                <div className="p-8">
                  <AnimatedSection>
                    <h2 className="text-3xl font-bold mb-4">{selectedProduct.title}</h2>
                  </AnimatedSection>
                  {selectedProduct.description && (
                    <AnimatedSection delay={0.1}>
                      <p className="text-muted-foreground mb-6">{selectedProduct.description}</p>
                    </AnimatedSection>
                  )}
                  <AnimatedSection delay={0.2}>
                    <div className="space-y-4">
                      {selectedProduct.gauge && (
                        <div>
                          <span className="font-semibold">Gauge:</span>{" "}
                          <span className="text-muted-foreground">{selectedProduct.gauge}</span>
                        </div>
                      )}
                      {selectedProduct.yarn && (
                        <div>
                          <span className="font-semibold">Yarn:</span>{" "}
                          <span className="text-muted-foreground">{selectedProduct.yarn}</span>
                        </div>
                      )}
                      {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <div>
                          <span className="font-semibold">Colors:</span>{" "}
                          <span className="text-muted-foreground">{selectedProduct.colors.join(", ")}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Category:</span>{" "}
                        <span className="text-muted-foreground capitalize">{selectedProduct.category}</span>
                      </div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.3}>
                    <Button asChild className="w-full mt-8">
                      <Link to="/quote-generator">Request Quote</Link>
                    </Button>
                  </AnimatedSection>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <CTASection />
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default Portfolio;