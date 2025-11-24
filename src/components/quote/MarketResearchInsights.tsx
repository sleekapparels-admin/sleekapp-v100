import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, DollarSign, Clock, Package } from "lucide-react";

interface MarketResearchInsightsProps {
  research: {
    averageUnitCost: number;
    materialCostPerUnit: number;
    leadTimeDays: number;
    markupPercentage: number;
    comparableProducts: Array<{
      name: string;
      price: number;
      source: string;
    }>;
    sources: string[];
    confidenceScore: number;
  };
}

export const MarketResearchInsights = ({ research }: MarketResearchInsightsProps) => {
  const getConfidenceBadge = (score: number) => {
    if (score >= 85) return { variant: "default" as const, label: "High Confidence", color: "text-green-600" };
    if (score >= 70) return { variant: "secondary" as const, label: "Medium Confidence", color: "text-yellow-600" };
    return { variant: "outline" as const, label: "Estimated", color: "text-orange-600" };
  };

  const confidence = getConfidenceBadge(research.confidenceScore);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Market Research Results
          </CardTitle>
          <Badge variant={confidence.variant} className={confidence.color}>
            {confidence.label} ({research.confidenceScore}%)
          </Badge>
        </div>
        <CardDescription>
          Real-time data from {research.sources.length} verified sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Avg Unit Cost</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${research.averageUnitCost.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span className="text-sm">Material Cost</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${research.materialCostPerUnit.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Lead Time</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {research.leadTimeDays} days
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Market Markup</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {research.markupPercentage}%
            </p>
          </div>
        </div>

        {/* Comparable Products */}
        {research.comparableProducts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Comparable Products</h4>
            <div className="space-y-2">
              {research.comparableProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.source}</p>
                  </div>
                  <Badge variant="secondary" className="text-foreground">
                    ${product.price.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {research.sources.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
              {research.sources.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Source {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            💡 <strong className="text-foreground">Note:</strong> These prices are based on real-time market research from Bangladesh manufacturers. Your final quote will be calculated using this data plus your specific requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
