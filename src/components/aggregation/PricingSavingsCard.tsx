import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Sparkles } from "lucide-react";

interface PricingSavingsCardProps {
  soloPrice: number;
  aggregatedPrice: number;
  quantity: number;
  showBreakdown?: boolean;
}

export const PricingSavingsCard = ({
  soloPrice,
  aggregatedPrice,
  quantity,
  showBreakdown = false,
}: PricingSavingsCardProps) => {
  const savingsPerUnit = soloPrice - aggregatedPrice;
  const totalSavings = savingsPerUnit * quantity;
  const savingsPercentage = (savingsPerUnit / soloPrice) * 100;

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Shared Production Savings</h3>
          </div>
          <Badge variant="secondary" className="bg-green-600 text-white">
            Save {savingsPercentage.toFixed(0)}%
          </Badge>
        </div>

        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Solo Order */}
          <div className="bg-white/50 rounded-lg p-3 border border-red-200">
            <p className="text-xs text-muted-foreground mb-1">Solo Order</p>
            <p className="text-lg font-bold text-red-600 line-through">
              ${soloPrice.toFixed(2)}/pc
            </p>
            <p className="text-xs text-muted-foreground">
              ${(soloPrice * quantity).toFixed(2)} total
            </p>
          </div>

          {/* Aggregated Order */}
          <div className="bg-white rounded-lg p-3 border-2 border-green-600">
            <p className="text-xs text-green-700 mb-1 font-medium">Shared Production</p>
            <p className="text-lg font-bold text-green-600">
              ${aggregatedPrice.toFixed(2)}/pc
            </p>
            <p className="text-xs text-green-700">
              ${(aggregatedPrice * quantity).toFixed(2)} total
            </p>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-white rounded-lg p-3 border-2 border-green-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">You Save</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              ${totalSavings.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        {showBreakdown && (
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs text-green-900">
              💡 <span className="font-medium">How it works:</span> By joining other brands in a shared production batch, 
              you get wholesale pricing even for small orders of {quantity} pieces.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
