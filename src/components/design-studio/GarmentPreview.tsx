import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, memo } from "react";
import tshirtMockup from "@/assets/mockups/tshirt-white.webp";
import poloMockup from "@/assets/mockups/polo-white.webp";
import sweaterMockup from "@/assets/mockups/sweater-white.webp";
import cardiganMockup from "@/assets/mockups/cardigan-white.webp";
import hoodieMockup from "@/assets/mockups/hoodie-white.webp";

interface GarmentPreviewProps {
  garmentType: 'tshirt' | 'polo' | 'sweater' | 'cardigan' | 'hoodie';
  baseColor: string;
  designImage?: string;
  textOverlay?: {
    text: string;
    fontSize: number;
    color: string;
  };
}

const MOCKUP_IMAGES = {
  tshirt: tshirtMockup,
  polo: poloMockup,
  sweater: sweaterMockup,
  cardigan: cardiganMockup,
  hoodie: hoodieMockup,
};

export const GarmentPreview = memo(({
  garmentType,
  baseColor,
  designImage,
  textOverlay
}: GarmentPreviewProps) => {
  const [rotation, setRotation] = useState(0);
  const mockupImage = MOCKUP_IMAGES[garmentType];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-secondary/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            3D Preview
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Rotate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-secondary/20 to-background">
          {/* Main Mockup Container */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div 
              className="relative w-full h-full max-w-2xl transition-transform duration-500 ease-out"
              style={{ 
                transform: `perspective(1200px) rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Base Garment Mockup with Color Overlay */}
              <div className="relative w-full h-full">
                <img
                  src={mockupImage}
                  alt={`${garmentType} mockup`}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    filter: `drop-shadow(0 20px 60px rgba(0,0,0,0.3))`,
                  }}
                />
                
                {/* Color Tint Overlay - blend with base white mockup */}
                {baseColor !== '#FFFFFF' && baseColor !== '#ffffff' && (
                  <div 
                    className="absolute inset-0 mix-blend-multiply opacity-60"
                    style={{ 
                      backgroundColor: baseColor,
                      maskImage: `url(${mockupImage})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: `url(${mockupImage})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                )}

                {/* Design Placement Area - chest position */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative"
                    style={{
                      width: '35%',
                      top: garmentType === 'cardigan' ? '-8%' : '-5%',
                      transform: 'perspective(800px) rotateY(0deg)',
                    }}
                  >
                    {/* Design Image */}
                    {designImage && (
                      <div className="w-full aspect-square">
                        <img
                          src={designImage}
                          alt="Custom design"
                          className="w-full h-full object-contain"
                          style={{
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                          }}
                        />
                      </div>
                    )}

                    {/* Text Overlay */}
                    {textOverlay && (
                      <div 
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center w-full px-4"
                        style={{ marginTop: designImage ? '100%' : '0' }}
                      >
                        <p
                          style={{
                            fontSize: `${textOverlay.fontSize}px`,
                            color: textOverlay.color,
                            fontWeight: 'bold',
                            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            wordBreak: 'break-word',
                            lineHeight: 1.2,
                          }}
                        >
                          {textOverlay.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm shadow-lg px-4 py-2">
              <span className="font-semibold">
                {garmentType === 'tshirt' && 'Premium Cotton T-Shirt'}
                {garmentType === 'polo' && 'Piqué Polo Shirt'}
                {garmentType === 'sweater' && 'Knit Sweater'}
                {garmentType === 'cardigan' && 'Knit Cardigan'}
                {garmentType === 'hoodie' && 'Fleece Hoodie'}
              </span>
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-background/95 backdrop-blur-sm shadow-lg px-4 py-2 border-2"
              style={{ borderColor: baseColor }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: baseColor }}
                />
                <span className="text-xs font-medium">Custom Color</span>
              </div>
            </Badge>
          </div>

          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>
        </div>

        {/* Additional Info */}
        <div className="p-4 bg-secondary/20 border-t">
          <p className="text-xs text-muted-foreground text-center">
            ✨ Professional 3D mockup with realistic fabric textures • Click rotate to view from different angles
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

GarmentPreview.displayName = 'GarmentPreview';