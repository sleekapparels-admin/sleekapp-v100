import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Ship, Zap, Package, MapPin, Weight, DollarSign, Clock, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/microInteractions';

interface ShippingMethod {
  id: string;
  name: string;
  icon: typeof Plane;
  baseRate: number; // USD per kg
  days: string;
  description: string;
  color: string;
}

interface Country {
  name: string;
  code: string;
  zone: 'asia' | 'europe' | 'americas' | 'oceania' | 'africa' | 'middle-east';
  multiplier: number;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'express',
    name: 'Express Courier',
    icon: Zap,
    baseRate: 8.5,
    days: '3-5 days',
    description: 'DHL/FedEx - Fastest delivery',
    color: 'text-orange-500',
  },
  {
    id: 'air',
    name: 'Air Freight',
    icon: Plane,
    baseRate: 4.5,
    days: '7-10 days',
    description: 'Standard air shipping',
    color: 'text-blue-500',
  },
  {
    id: 'sea',
    name: 'Sea Freight',
    icon: Ship,
    baseRate: 1.2,
    days: '30-45 days',
    description: 'Most economical for bulk',
    color: 'text-teal-500',
  },
];

const COUNTRIES: Country[] = [
  { name: 'United States', code: 'US', zone: 'americas', multiplier: 1.0 },
  { name: 'Canada', code: 'CA', zone: 'americas', multiplier: 1.1 },
  { name: 'United Kingdom', code: 'GB', zone: 'europe', multiplier: 0.9 },
  { name: 'Germany', code: 'DE', zone: 'europe', multiplier: 0.9 },
  { name: 'France', code: 'FR', zone: 'europe', multiplier: 0.9 },
  { name: 'Spain', code: 'ES', zone: 'europe', multiplier: 0.95 },
  { name: 'Italy', code: 'IT', zone: 'europe', multiplier: 0.95 },
  { name: 'Australia', code: 'AU', zone: 'oceania', multiplier: 1.15 },
  { name: 'New Zealand', code: 'NZ', zone: 'oceania', multiplier: 1.2 },
  { name: 'Japan', code: 'JP', zone: 'asia', multiplier: 0.7 },
  { name: 'South Korea', code: 'KR', zone: 'asia', multiplier: 0.7 },
  { name: 'Singapore', code: 'SG', zone: 'asia', multiplier: 0.6 },
  { name: 'UAE', code: 'AE', zone: 'middle-east', multiplier: 1.0 },
  { name: 'Saudi Arabia', code: 'SA', zone: 'middle-east', multiplier: 1.05 },
  { name: 'India', code: 'IN', zone: 'asia', multiplier: 0.75 },
  { name: 'China', code: 'CN', zone: 'asia', multiplier: 0.65 },
];

/**
 * ShippingCalculator - Real-time Shipping Cost Estimation
 * 
 * Features:
 * - Multi-country support (15+ countries)
 * - 3 shipping methods (Express, Air, Sea)
 * - Real-time cost calculation
 * - Weight-based pricing
 * - Zone multipliers
 * - Visual comparison
 * - Customs estimate
 * - Interactive sliders
 */
export const ShippingCalculator = () => {
  const [country, setCountry] = useState<string>('US');
  const [weight, setWeight] = useState<number>(25);
  const [orderValue, setOrderValue] = useState<number>(1000);
  const [selectedMethod, setSelectedMethod] = useState<string>('air');

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === country) || COUNTRIES[0],
    [country]
  );

  // Calculate shipping costs
  const shippingEstimates = useMemo(() => {
    return SHIPPING_METHODS.map((method) => {
      const baseShipping = method.baseRate * weight * selectedCountry.multiplier;
      
      // Add handling fee (5% of order value, min $20, max $100)
      const handlingFee = Math.min(Math.max(orderValue * 0.05, 20), 100);
      
      // Add insurance (1% of order value)
      const insurance = orderValue * 0.01;
      
      const totalCost = baseShipping + handlingFee + insurance;
      
      // Estimate customs duty (average 10% for most countries)
      const customsDuty = orderValue * 0.1;

      return {
        method,
        shippingCost: Math.round(baseShipping * 100) / 100,
        handlingFee: Math.round(handlingFee * 100) / 100,
        insurance: Math.round(insurance * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        customsDuty: Math.round(customsDuty * 100) / 100,
        grandTotal: Math.round((totalCost + customsDuty) * 100) / 100,
      };
    });
  }, [weight, selectedCountry, orderValue]);

  const selectedEstimate = shippingEstimates.find((e) => e.method.id === selectedMethod);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    triggerHaptic('light');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Input Controls */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Shipping Calculator</h2>
            <p className="text-sm text-muted-foreground">
              Get instant shipping cost estimates from Bangladesh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination Country
            </Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Value */}
          <div className="space-y-2">
            <Label htmlFor="orderValue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Order Value (USD)
            </Label>
            <Input
              id="orderValue"
              type="number"
              value={orderValue}
              onChange={(e) => setOrderValue(Number(e.target.value))}
              min={100}
              max={100000}
              step={100}
            />
          </div>

          {/* Package Weight */}
          <div className="space-y-3 md:col-span-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Package Weight: {weight} kg
            </Label>
            <Slider
              id="weight"
              value={[weight]}
              onValueChange={(value) => setWeight(value[0])}
              min={1}
              max={500}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 kg</span>
              <span>250 kg</span>
              <span>500 kg</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Shipping Methods Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shippingEstimates.map((estimate, index) => {
          const Icon = estimate.method.icon;
          const isSelected = estimate.method.id === selectedMethod;

          return (
            <motion.div
              key={estimate.method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all duration-300 hover:shadow-lg',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => handleMethodSelect(estimate.method.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-full bg-muted', estimate.method.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{estimate.method.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {estimate.method.days}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${estimate.shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Handling</span>
                    <span className="font-medium">${estimate.handlingFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="font-medium">${estimate.insurance}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-lg text-primary">${estimate.totalCost}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3 text-center text-xs text-primary font-semibold"
                  >
                    ✓ Selected
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {selectedEstimate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Complete Cost Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Shipping Cost</span>
                  <span className="font-medium">${selectedEstimate.shippingCost}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Handling Fee (5%)</span>
                  <span className="font-medium">${selectedEstimate.handlingFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Insurance (1%)</span>
                  <span className="font-medium">${selectedEstimate.insurance}</span>
                </div>
                <div className="flex justify-between py-2 border-b font-semibold">
                  <span>Subtotal (Shipping)</span>
                  <span>${selectedEstimate.totalCost}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-orange-600">
                  <span className="flex items-center gap-2">
                    Estimated Customs Duty (10%)
                    <Info className="h-4 w-4" />
                  </span>
                  <span className="font-medium">${selectedEstimate.customsDuty}</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-bold bg-primary/10 px-4 rounded-lg">
                  <span>Grand Total</span>
                  <span className="text-primary text-2xl">${selectedEstimate.grandTotal}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Important Notes:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Customs duties vary by country and product type</li>
                      <li>Actual costs may vary based on package dimensions</li>
                      <li>Express delivery includes door-to-door service</li>
                      <li>All prices are in USD and subject to change</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button variant="gold" className="flex-1">
                  Request Formal Quote
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Support
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
