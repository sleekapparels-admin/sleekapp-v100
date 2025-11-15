import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import tshirtMockup from "@/assets/mockups/tshirt-white.webp";
import poloMockup from "@/assets/mockups/polo-white.webp";
import sweaterMockup from "@/assets/mockups/sweater-white.webp";
import cardiganMockup from "@/assets/mockups/cardigan-white.webp";
import hoodieMockup from "@/assets/mockups/hoodie-white.webp";

interface Garment {
  id: string;
  name: string;
  type: 'tshirt' | 'polo' | 'sweater' | 'cardigan' | 'hoodie';
  basePrice: number;
  moq: number;
}

const GARMENT_MOCKUPS: Record<string, string> = {
  tshirt: tshirtMockup,
  polo: poloMockup,
  sweater: sweaterMockup,
  cardigan: cardiganMockup,
  hoodie: hoodieMockup,
};

const GARMENTS: Garment[] = [
  { id: '1', name: 'T-Shirt', type: 'tshirt', basePrice: 8, moq: 50 },
  { id: '2', name: 'Polo Shirt', type: 'polo', basePrice: 12, moq: 50 },
  { id: '3', name: 'Sweater', type: 'sweater', basePrice: 18, moq: 50 },
  { id: '4', name: 'Cardigan', type: 'cardigan', basePrice: 22, moq: 50 },
  { id: '5', name: 'Hoodie', type: 'hoodie', basePrice: 20, moq: 50 },
];

interface GarmentSelectorProps {
  selectedGarment: Garment | null;
  onSelectGarment: (garment: Garment) => void;
}

export const GarmentSelector = memo(({ selectedGarment, onSelectGarment }: GarmentSelectorProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Garment Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {GARMENTS.map((garment) => (
          <Card
            key={garment.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGarment?.id === garment.id
                ? 'ring-2 ring-primary shadow-lg'
                : ''
            }`}
            onClick={() => onSelectGarment(garment)}
          >
            <CardContent className="p-4 text-center space-y-3">
              <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center p-4">
                <img 
                  src={GARMENT_MOCKUPS[garment.type]} 
                  alt={garment.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{garment.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ${garment.basePrice}/pc
                </p>
                <Badge variant="outline" className="text-xs mt-2">
                  MOQ: {garment.moq}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

GarmentSelector.displayName = 'GarmentSelector';

export type { Garment };