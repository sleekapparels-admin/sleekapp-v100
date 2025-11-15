import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, CheckCircle2 } from "lucide-react";

interface PriceComparisonProps {
  yourPrice: number;
  quantity: number;
}

export const PriceComparison = ({ yourPrice, quantity }: PriceComparisonProps) => {
  const usPrice = yourPrice * 1.8;
  const chinaPrice = yourPrice * 1.3;
  
  const maxPrice = usPrice;
  const savings = {
    vsUS: usPrice - yourPrice,
    vsChina: chinaPrice - yourPrice
  };

  const getBarWidth = (price: number) => {
    return (price / maxPrice) * 100;
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          How We Compare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comparison Bars */}
        <div className="space-y-4">
          {/* US Manufacturers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">US Manufacturers</span>
              <span className="text-muted-foreground">${usPrice.toFixed(2)}/pc</span>
            </div>
            <div className="relative h-10 bg-secondary rounded-lg overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-red-500/20 border-r-2 border-red-500 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: `${getBarWidth(usPrice)}%` }}
              >
                <span className="text-xs font-medium text-red-700 dark:text-red-400">Premium domestic</span>
              </div>
            </div>
          </div>

          {/* China Competitors */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">China Competitors</span>
              <span className="text-muted-foreground">${chinaPrice.toFixed(2)}/pc</span>
            </div>
            <div className="relative h-10 bg-secondary rounded-lg overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-orange-500/20 border-r-2 border-orange-500 transition-all duration-1000 ease-out delay-150 flex items-center justify-end pr-3"
                style={{ width: `${getBarWidth(chinaPrice)}%` }}
              >
                <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Similar quality</span>
              </div>
            </div>
          </div>

          {/* Sleek Apparels (You) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">Sleek Apparels</span>
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Best Value
                </Badge>
              </div>
              <span className="font-bold text-primary">${yourPrice.toFixed(2)}/pc</span>
            </div>
            <div className="relative h-12 bg-secondary rounded-lg overflow-hidden ring-2 ring-primary">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out delay-300 flex items-center justify-end pr-3"
                style={{ width: `${getBarWidth(yourPrice)}%` }}
              >
                <span className="text-xs font-medium text-primary-foreground">Competitive pricing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Callouts */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="bg-primary/10 rounded-lg p-4 text-center space-y-1">
            <p className="text-2xl font-bold text-primary">
              ${savings.vsUS.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Saved vs US</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center space-y-1">
            <p className="text-2xl font-bold text-primary">
              ${savings.vsChina.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Saved vs China</p>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total order savings vs US manufacturers</p>
          <p className="text-3xl font-bold text-primary">
            ${(savings.vsUS * quantity).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            on {quantity.toLocaleString()} pieces
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          💡 Same quality standards, better pricing through Bangladesh manufacturing excellence
        </p>
      </CardContent>
    </Card>
  );
};
