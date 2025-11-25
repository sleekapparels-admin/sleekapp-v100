import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GarmentSelector, type Garment } from "@/components/design-studio/GarmentSelector";
import { GarmentPreviewSkeleton } from "@/components/design-studio/GarmentPreviewSkeleton";
import { DesignEditorSkeleton } from "@/components/design-studio/DesignEditorSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ShoppingCart, Palette } from "lucide-react";

// Lazy load heavy 3D components for better Core Web Vitals
const DesignEditor = lazy(() => import("@/components/design-studio/DesignEditor").then(m => ({ default: m.DesignEditor })));
const GarmentPreview = lazy(() => import("@/components/design-studio/GarmentPreview").then(m => ({ default: m.GarmentPreview })));

const PRESET_COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Gray", value: "#6b7280" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
  { name: "Blue", value: "#2563eb" },
  { name: "Yellow", value: "#eab308" },
];

const DesignStudio = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [baseColor, setBaseColor] = useState("#FFFFFF");
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState<{ text: string; fontSize: number; color: string } | null>(null);

  const handleDesignGenerated = (design: { imageUrl: string; type: 'ai' | 'text' | 'upload' }) => {
    setDesignImage(design.imageUrl);
    setTextOverlay(null); // Clear text when AI design is added
  };

  const handleTextChange = (text: string, fontSize: number, color: string) => {
    setTextOverlay({ text, fontSize, color });
    setDesignImage(null); // Clear image when text is added
  };

  const handleRequestQuote = () => {
    if (!selectedGarment) {
      toast({
        title: "No Garment Selected",
        description: "Please select a garment type first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Redirecting to Contact",
      description: "Taking you to request a quote...",
    });

    // Navigate to contact page
    navigate('/contact');
  };

  return (
    <>
      <SEO config={getPageSEO('design')} />

      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Sparkles className="h-10 w-10 text-primary" />
                AI Design Studio
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Create custom print-on-demand garments. Choose your style, add AI-generated designs or text, and get instant quotes.
              </p>
            </div>

            {/* Garment Selection */}
            <div className="mb-8">
              <GarmentSelector
                selectedGarment={selectedGarment}
                onSelectGarment={setSelectedGarment}
              />
            </div>

            {selectedGarment && (
              <>
                <Separator className="my-8" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Panel - Design Tools */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Color Selection */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Palette className="h-5 w-5" />
                          Garment Color
                        </CardTitle>
                        <CardDescription>Choose the base color</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-3">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setBaseColor(color.value)}
                              className={`h-12 rounded-lg border-2 transition-all ${
                                baseColor === color.value
                                  ? 'border-primary scale-110 shadow-lg'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label>Custom Color</Label>
                          <input
                            type="color"
                            value={baseColor}
                            onChange={(e) => setBaseColor(e.target.value)}
                            className="w-full h-12 rounded-lg cursor-pointer"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Design Editor */}
                    <Suspense fallback={<DesignEditorSkeleton />}>
                      <DesignEditor
                        onDesignGenerated={handleDesignGenerated}
                        onTextChange={handleTextChange}
                      />
                    </Suspense>
                  </div>

                  {/* Right Panel - Preview and Actions */}
                  <div className="lg:col-span-2 space-y-6">
                    <Suspense fallback={<GarmentPreviewSkeleton />}>
                      <GarmentPreview
                        garmentType={selectedGarment.type}
                        baseColor={baseColor}
                        designImage={designImage}
                        textOverlay={textOverlay}
                      />
                    </Suspense>

                    {/* Action Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ready to Order?</CardTitle>
                        <CardDescription>
                          Get an instant AI-powered quote for your custom design
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground">Garment</p>
                            <p className="font-semibold">{selectedGarment.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Base Price</p>
                            <p className="font-semibold">${selectedGarment.basePrice}/pc</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Color</p>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: baseColor }}
                              />
                              <span className="font-semibold text-sm">{baseColor}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">MOQ</p>
                            <p className="font-semibold">{selectedGarment.moq} pcs</p>
                          </div>
                        </div>

                        <Button 
                          onClick={handleRequestQuote}
                          className="w-full"
                          size="lg"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Request Quote for This Design
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          You'll be able to specify quantity and additional requirements in the next step
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DesignStudio;