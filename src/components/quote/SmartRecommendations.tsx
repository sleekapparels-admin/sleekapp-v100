import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Package, Clock, Sparkles } from "lucide-react";

interface SmartRecommendationsProps {
  quantity: number;
  material?: string;
  complexityLevel: string;
  unitPrice: number;
  timeline: number;
  onRecalculate: (updates: {
    quantity?: number;
    material?: string;
    complexityLevel?: string;
  }) => void;
}

export const SmartRecommendations = ({
  quantity,
  material,
  complexityLevel,
  unitPrice,
  timeline,
  onRecalculate
}: SmartRecommendationsProps) => {
  const recommendations = [];

  // Volume Discount Opportunity
  if (quantity < 200) {
    const newQuantity = Math.ceil(quantity / 50) * 50 + 50;
    const potentialSavings = unitPrice * 0.05; // 5% discount
    recommendations.push({
      icon: TrendingUp,
      title: "Volume Discount Opportunity",
      description: `Order ${newQuantity} pieces instead of ${quantity} and save $${potentialSavings.toFixed(2)} per piece`,
      savings: `$${(potentialSavings * newQuantity).toFixed(2)} total savings`,
      action: "Update Quantity",
      variant: "default" as const,
      onClick: () => onRecalculate({ quantity: newQuantity })
    });
  }

  // Material Alternative (if premium material)
  if (material && (material.toLowerCase().includes('organic') || material.toLowerCase().includes('merino') || material.toLowerCase().includes('bamboo'))) {
    const standardMaterial = material.toLowerCase().includes('cotton') ? 'cotton' : 'polyester';
    const savingsPercent = 15;
    const potentialSavings = unitPrice * (savingsPercent / 100);
    recommendations.push({
      icon: Sparkles,
      title: "Material Alternative",
      description: `Consider standard ${standardMaterial} - similar quality, ${savingsPercent}% less expensive`,
      savings: `Save $${potentialSavings.toFixed(2)}/piece`,
      action: "Switch Material",
      variant: "outline" as const,
      onClick: () => onRecalculate({ material: standardMaterial })
    });
  }

  // Timeline Trade-off (if complex or fast timeline implied)
  if (complexityLevel === 'complex' || timeline < 30) {
    const standardTimeline = 35;
    const savingsAmount = unitPrice * 0.08; // 8% savings
    recommendations.push({
      icon: Clock,
      title: "Timeline Flexibility",
      description: `Choose standard timeline (${standardTimeline} days) and save $${savingsAmount.toFixed(2)} per piece`,
      savings: `$${(savingsAmount * quantity).toFixed(2)} total savings`,
      action: "Switch to Standard",
      variant: "outline" as const,
      onClick: () => onRecalculate({ complexityLevel: 'medium' })
    });
  }

  // Sample Kit Suggestion (always show for new customers)
  recommendations.push({
    icon: Package,
    title: "Risk-Free Sample Kit",
    description: "Add 5-piece sample kit for only $249 (credited towards bulk order)",
    savings: "Perfect for first-time orders",
    action: "Add Samples",
    variant: "secondary" as const,
    onClick: () => {
      // This would typically open a modal or navigate to sample order
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  if (recommendations.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-secondary/30 to-background animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          💡 Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {rec.savings}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant={rec.variant}
                    size="sm"
                    className="w-full"
                    onClick={rec.onClick}
                  >
                    {rec.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
