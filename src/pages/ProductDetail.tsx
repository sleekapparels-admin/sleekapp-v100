import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  ShoppingCart, 
  Palette, 
  Ruler, 
  Package, 
  Clock, 
  CheckCircle,
  Heart,
  Share2,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts({ category: product?.category });
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Related products (same category, exclude current)
  const relatedProducts = allProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  // Standard sizes for apparel
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  return (
    <>
      <SEO 
        config={{
          title: `${product.title} - Sleek Apparels`,
          description: product.description || `Premium ${product.category} manufacturing with low MOQ. ${product.gauge || ''} ${product.yarn || ''}`.trim(),
          canonical: `https://sleek-apparels.com/products/${product.id}`,
          keywords: `${product.category}, ${product.materials?.join(', ')}, custom apparel, low MOQ`,
          ogTitle: `${product.title} - Sleek Apparels`,
          ogDescription: product.description || `Premium ${product.category} manufacturing`,
          ogImage: product.image_url,
          ogType: 'product',
        }}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground">Products</Link>
            <span>/</span>
            <span className="text-foreground capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>

          {/* Product Detail Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={product.image_url} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery Placeholder */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted/50 border-2 border-border hover:border-primary cursor-pointer transition">
                    <img 
                      src={product.image_url} 
                      alt={`${product.title} view ${i}`}
                      className="w-full h-full object-cover opacity-75"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3 capitalize">{product.category}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">{product.title}</h1>
                
                {/* Rating Placeholder */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(48 reviews)</span>
                </div>

                {product.price && (
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-muted-foreground">per unit</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <Separator />

              {/* Key Specifications */}
              <div className="grid grid-cols-2 gap-4">
                {product.gauge && (
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="font-semibold">{product.gauge}</div>
                    </div>
                  </div>
                )}
                
                {product.moq && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">MOQ</div>
                      <div className="font-semibold">{product.moq} units</div>
                    </div>
                  </div>
                )}
                
                {product.lead_time_days && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Lead Time</div>
                      <div className="font-semibold">{product.lead_time_days} days</div>
                    </div>
                  </div>
                )}
                
                {product.materials && product.materials.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Material</div>
                      <div className="font-semibold">{product.materials[0]}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Available Colors ({product.colors.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[80px]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Size
                </Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="w-14 h-14"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-12 text-lg" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Get Quote
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="lg" className="h-12">
                    <Palette className="mr-2 h-5 w-5" />
                    Quick Customize
                  </Button>
                  <Button variant="secondary" size="lg" className="h-12">
                    Design Now
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Custom Branding Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bulk Discounts Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="specifications" className="mb-16">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="size-chart">Size Chart</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Complete Specifications</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Product Details</h4>
                    <dl className="space-y-2">
                      {product.gauge && (
                        <>
                          <dt className="text-sm text-muted-foreground inline">Fabric Weight:</dt>
                          <dd className="text-sm font-medium inline ml-2">{product.gauge}</dd>
                        </>
                      )}
                      {product.materials && (
                        <div>
                          <dt className="text-sm text-muted-foreground">Materials:</dt>
                          <dd className="text-sm font-medium mt-1">
                            {product.materials.map(m => (
                              <Badge key={m} variant="secondary" className="mr-2 mb-2">{m}</Badge>
                            ))}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-sm text-muted-foreground inline">Category:</dt>
                        <dd className="text-sm font-medium inline ml-2 capitalize">{product.category}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Order Information</h4>
                    <dl className="space-y-2">
                      {product.moq && (
                        <div>
                          <dt className="text-sm text-muted-foreground inline">Minimum Order:</dt>
                          <dd className="text-sm font-medium inline ml-2">{product.moq} units</dd>
                        </div>
                      )}
                      {product.lead_time_days && (
                        <div>
                          <dt className="text-sm text-muted-foreground inline">Production Time:</dt>
                          <dd className="text-sm font-medium inline ml-2">{product.lead_time_days} days</dd>
                        </div>
                      )}
                      {product.price && (
                        <div>
                          <dt className="text-sm text-muted-foreground inline">Unit Price:</dt>
                          <dd className="text-sm font-medium inline ml-2">${product.price}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="size-chart" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Size Chart (Inches)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Size</th>
                        <th className="text-left py-3 px-4">Chest</th>
                        <th className="text-left py-3 px-4">Length</th>
                        <th className="text-left py-3 px-4">Shoulder</th>
                        <th className="text-left py-3 px-4">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-3 px-4">XS</td><td className="py-3 px-4">32-34</td><td className="py-3 px-4">26</td><td className="py-3 px-4">15.5</td><td className="py-3 px-4">23</td></tr>
                      <tr className="border-b"><td className="py-3 px-4">S</td><td className="py-3 px-4">34-36</td><td className="py-3 px-4">27</td><td className="py-3 px-4">16</td><td className="py-3 px-4">23.5</td></tr>
                      <tr className="border-b"><td className="py-3 px-4">M</td><td className="py-3 px-4">38-40</td><td className="py-3 px-4">28</td><td className="py-3 px-4">17</td><td className="py-3 px-4">24</td></tr>
                      <tr className="border-b"><td className="py-3 px-4">L</td><td className="py-3 px-4">42-44</td><td className="py-3 px-4">29</td><td className="py-3 px-4">18</td><td className="py-3 px-4">24.5</td></tr>
                      <tr className="border-b"><td className="py-3 px-4">XL</td><td className="py-3 px-4">46-48</td><td className="py-3 px-4">30</td><td className="py-3 px-4">19</td><td className="py-3 px-4">25</td></tr>
                      <tr className="border-b"><td className="py-3 px-4">2XL</td><td className="py-3 px-4">50-52</td><td className="py-3 px-4">31</td><td className="py-3 px-4">20</td><td className="py-3 px-4">25.5</td></tr>
                      <tr><td className="py-3 px-4">3XL</td><td className="py-3 px-4">54-56</td><td className="py-3 px-4">32</td><td className="py-3 px-4">21</td><td className="py-3 px-4">26</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  * All measurements are approximate. Custom sizing available on request for orders above MOQ.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Customization Options</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Branding & Printing</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Screen printing (1-6 colors)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Digital printing / DTG
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Embroidery (logo, text, custom designs)
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Heat transfer vinyl
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Label & Tags</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Custom woven labels
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Printed care labels
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Hang tags with your branding
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Tag-free / tear-away labels
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Packaging</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Individual poly bags
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Custom branded boxes
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Eco-friendly packaging options
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Be the first to review this product</p>
                  <Button variant="outline" className="mt-4">Write a Review</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition group">
                      <div className="aspect-[4/5] overflow-hidden bg-muted">
                        <img 
                          src={relatedProduct.image_url} 
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-1">{relatedProduct.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedProduct.description}</p>
                        {relatedProduct.price && (
                          <p className="text-primary font-bold mt-2">${relatedProduct.price}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
}

// Missing Label import
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
