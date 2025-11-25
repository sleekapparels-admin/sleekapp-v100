import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { CTASection } from "@/components/CTASection";
import { SEO } from "@/components/SEO";
import { Leaf, Thermometer, DollarSign, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MaterialsGuide = () => {
  const [selectedClimate, setSelectedClimate] = useState<string | null>(null);

  const materials = [
    {
      name: "Organic Cotton",
      description: "Soft, breathable, GOTS certified. Perfect for everyday wear.",
      climate: ["tropical", "temperate"],
      sustainability: "High",
      price: "$$",
      bestFor: "T-shirts, polos, casual knitwear",
      properties: ["Breathable", "Soft", "Eco-friendly", "Durable"],
    },
    {
      name: "Merino Wool",
      description: "Premium natural fiber. Temperature regulating, odor resistant.",
      climate: ["cold", "temperate"],
      sustainability: "High",
      price: "$$$",
      bestFor: "Sweaters, cardigans, performance wear",
      properties: ["Temperature control", "Moisture wicking", "Odor resistant", "Luxurious"],
    },
    {
      name: "Bamboo Viscose",
      description: "Silky smooth, hypoallergenic, sustainable fast-growing resource.",
      climate: ["tropical", "temperate"],
      sustainability: "Very High",
      price: "$$",
      bestFor: "Athleisure, base layers, soft knitwear",
      properties: ["Silky smooth", "Hypoallergenic", "Breathable", "Sustainable"],
    },
    {
      name: "Cashmere",
      description: "Ultra-premium luxury fiber. Incredibly soft and warm.",
      climate: ["cold"],
      sustainability: "Medium",
      price: "$$$$",
      bestFor: "Luxury sweaters, premium cardigans",
      properties: ["Ultra soft", "Lightweight warmth", "Prestigious", "Delicate"],
    },
    {
      name: "RPET Recycled Polyester",
      description: "Made from recycled plastic bottles. Durable and sustainable.",
      climate: ["tropical", "temperate", "cold"],
      sustainability: "Very High",
      price: "$",
      bestFor: "Activewear, outerwear, performance gear",
      properties: ["Recycled", "Durable", "Quick dry", "Cost-effective"],
    },
    {
      name: "Cotton/Polyester Blend",
      description: "Best of both worlds. Comfort meets durability and easy care.",
      climate: ["tropical", "temperate"],
      sustainability: "Medium",
      price: "$",
      bestFor: "Uniforms, workwear, team jerseys",
      properties: ["Wrinkle resistant", "Durable", "Easy care", "Affordable"],
    },
  ];

  const climateOptions = [
    { id: "tropical", label: "Tropical / Hot Climate", icon: "☀️" },
    { id: "temperate", label: "Temperate / Mild", icon: "🌤️" },
    { id: "cold", label: "Cold / Winter", icon: "❄️" },
  ];

  const filteredMaterials = selectedClimate
    ? materials.filter((m) => m.climate.includes(selectedClimate))
    : materials;

  return (
    <>
      <SEO 
        config={{
          title: "Fabric & Materials Guide | Choose the Right Yarn",
          description: "Complete guide to apparel fabrics: organic cotton, merino wool, bamboo, cashmere, RPET. Climate recommendations, sustainability, pricing.",
          canonical: "/materials-guide"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl animate-fade-up">
              <Badge variant="secondary" className="mb-4">Materials Guide</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-secondary leading-tight">
                Which Fabric Is Right for Your Product?
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Choose the perfect material for your climate, budget, and sustainability goals. We work with premium sustainable yarns and fabrics.
              </p>
            </div>
          </div>
        </section>

        {/* Climate Selector */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Thermometer className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2 text-secondary">Filter by Climate</h2>
              <p className="text-muted-foreground">Show materials best suited for your target market</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant={selectedClimate === null ? "default" : "outline"}
                onClick={() => setSelectedClimate(null)}
              >
                All Materials
              </Button>
              {climateOptions.map((climate) => (
                <Button
                  key={climate.id}
                  variant={selectedClimate === climate.id ? "default" : "outline"}
                  onClick={() => setSelectedClimate(climate.id)}
                >
                  {climate.icon} {climate.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Materials Grid */}
        <section className="py-12 bg-muted/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaterials.map((material, index) => (
                <Card key={material.name} className="animate-fade-up hover-scale" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-secondary">{material.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Sustainability:</span>
                        <Badge variant={material.sustainability === "Very High" ? "default" : "secondary"}>
                          {material.sustainability}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Price Range:</span>
                        <span className="text-primary font-bold">{material.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Best For:</span>
                        <span className="text-sm text-muted-foreground">{material.bestFor}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-semibold mb-2">Key Properties:</p>
                      <div className="flex flex-wrap gap-2">
                        {material.properties.map((prop) => (
                          <Badge key={prop} variant="outline" className="text-xs">
                            {prop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Price vs Quality Spectrum */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Price vs Quality Spectrum</h2>
              <p className="text-xl text-muted-foreground">Understanding the cost-quality tradeoff</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Budget-Friendly ($)</h3>
                    <p className="text-muted-foreground">RPET Recycled Polyester, Cotton/Poly Blends — Great for high-volume uniforms, promotional wear</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Mid-Range ($$)</h3>
                    <p className="text-muted-foreground">Organic Cotton, Bamboo Viscose — Perfect balance for fashion brands and quality-conscious buyers</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Premium ($$$)</h3>
                    <p className="text-muted-foreground">Merino Wool — High-performance, luxury feel, justifies premium retail pricing</p>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Ultra-Luxury ($$$$)</h3>
                    <p className="text-muted-foreground">Cashmere — Ultimate luxury, prestige brands, highest retail margins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sustainability Comparison */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4 text-secondary">Sustainability Comparison</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="font-semibold">RPET Recycled Polyester</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-bold">Highest Impact</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="font-semibold">Bamboo Viscose</span>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-bold">Very High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="font-semibold">Organic Cotton</span>
                    <span className="text-primary font-bold">High</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="font-semibold">Merino Wool</span>
                    <span className="text-primary font-bold">High (Natural)</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="font-semibold">Cotton/Poly Blend</span>
                    <span className="text-muted-foreground">Medium</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <CTASection />
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default MaterialsGuide;
