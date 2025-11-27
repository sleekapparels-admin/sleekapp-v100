import { motion } from 'framer-motion';
import { TrendingDown, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MOQComparisonProps {
  quantity?: number;
  productType?: string;
  unitPrice?: number;
  className?: string;
}

export const MOQComparisonChart = ({ 
  quantity = 100, 
  productType = 't-shirts',
  unitPrice = 8.50,
  className 
}: MOQComparisonProps) => {
  // Calculate comparison data
  const sleekMOQ = Math.max(50, quantity);
  const traditionalMOQ = 1000;
  
  const sleekTotal = sleekMOQ * unitPrice;
  const sleekPricePerUnit = unitPrice;
  
  // Traditional manufacturers offer better per-unit price at high volume
  const traditionalPricePerUnit = unitPrice * 0.85; // ~15% discount at 1000+ pieces
  const traditionalTotal = traditionalMOQ * traditionalPricePerUnit;
  
  const capitalSaved = traditionalTotal - sleekTotal;
  const riskReduction = ((traditionalTotal - sleekTotal) / traditionalTotal * 100).toFixed(0);

  // Bar chart data
  const maxValue = traditionalTotal;
  const sleekBarHeight = (sleekTotal / maxValue) * 100;
  const traditionalBarHeight = 100;

  return (
    <Card className={cn('border-2 border-primary/20', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">MOQ Comparison: The Startup Advantage</CardTitle>
          <Badge className="bg-green-600">
            Save ${capitalSaved.toFixed(0)}+
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Lower upfront investment • Test market demand • Reduce inventory risk
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Visual Comparison */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional MOQ - Stressed Scenario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="font-bold text-lg text-red-900">Traditional Manufacturers</h3>
              </div>
              
              {/* Bar Chart */}
              <div className="relative h-64 bg-white rounded-lg p-4 flex flex-col justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${traditionalBarHeight}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg flex flex-col items-center justify-center text-white font-bold relative"
                >
                  <DollarSign className="h-8 w-8 mb-2" />
                  <span className="text-2xl">${traditionalTotal.toLocaleString()}</span>
                  <span className="text-xs mt-1">{traditionalMOQ} pieces</span>
                </motion.div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MOQ:</span>
                  <span className="font-semibold">{traditionalMOQ} pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price/unit:</span>
                  <span className="font-semibold">${traditionalPricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Total Investment:</span>
                  <span className="font-bold text-red-600">${traditionalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Pain Points */}
              <div className="bg-red-100 rounded p-3 space-y-1 text-xs">
                <p className="font-semibold text-red-900 mb-2">❌ The Risk:</p>
                <p className="text-red-800">• ${traditionalTotal.toLocaleString()} tied up before first sale</p>
                <p className="text-red-800">• What if your design doesn't sell?</p>
                <p className="text-red-800">• {traditionalMOQ} pieces of unsold inventory risk</p>
              </div>
            </div>
          </motion.div>

          {/* Sleek Apparels - Happy Scenario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h3 className="font-bold text-lg text-green-900">Sleek Apparels</h3>
              </div>
              
              {/* Bar Chart */}
              <div className="relative h-64 bg-white rounded-lg p-4 flex flex-col justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${sleekBarHeight}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg flex flex-col items-center justify-center text-white font-bold relative"
                >
                  <CheckCircle2 className="h-8 w-8 mb-2" />
                  <span className="text-2xl">${sleekTotal.toLocaleString()}</span>
                  <span className="text-xs mt-1">{sleekMOQ} pieces</span>
                </motion.div>
                
                {/* Faded comparison */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-red-300 opacity-20 rounded-t-lg"
                  style={{ height: `${traditionalBarHeight}%` }}
                />
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MOQ:</span>
                  <span className="font-semibold">{sleekMOQ} pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price/unit:</span>
                  <span className="font-semibold">${sleekPricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Total Investment:</span>
                  <span className="font-bold text-green-600">${sleekTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-green-100 rounded p-3 space-y-1 text-xs">
                <p className="font-semibold text-green-900 mb-2">✅ The Smart Way:</p>
                <p className="text-green-800">• Only ${sleekTotal.toLocaleString()} to test market</p>
                <p className="text-green-800">• Validate demand before scaling</p>
                <p className="text-green-800">• {riskReduction}% less capital risk</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Savings Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-2 border-primary rounded-lg p-6"
        >
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Capital Saved</h3>
            </div>
            
            <div className="text-5xl font-bold text-primary">
              ${capitalSaved.toFixed(0)}
            </div>
            
            <p className="text-lg text-muted-foreground">
              That's <strong>{riskReduction}% less risk</strong> to validate your {productType} design
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-xs text-muted-foreground">Less capital tied up</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{sleekMOQ}x</div>
                <div className="text-xs text-muted-foreground">Lower MOQ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">10-20</div>
                <div className="text-xs text-muted-foreground">Days production</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Explanation */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            💡 <strong>Smart Strategy:</strong> Start with {sleekMOQ} pieces at Sleek Apparels. 
            Once you validate demand, scale to larger orders with even better pricing.
          </p>
          <p className="text-xs">
            Note: Traditional manufacturers may offer slightly lower per-unit pricing at 1000+ pieces, 
            but Sleek's 50-piece MOQ lets you test market fit without massive upfront capital risk.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
