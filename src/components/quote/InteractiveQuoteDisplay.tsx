import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Package,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface QuoteDisplayProps {
  quote: {
    id: string;
    unitPrice: number;
    totalPrice: number;
    estimatedDeliveryDays: number;
    confidenceScore: number;
    priceBreakdown: {
      materials: number;
      labor: number;
      overhead: number;
      margin: number;
    };
    priceJustification: string;
    comparableProducts: Array<{
      name: string;
      price: number;
      supplier: string;
    }>;
    suggestions: string;
  };
  research: {
    sources: string[];
  };
  productType: string;
  quantity: number;
  onStartNew: () => void;
}

export const InteractiveQuoteDisplay = ({
  quote,
  research,
  productType,
  quantity,
  onStartNew,
}: QuoteDisplayProps) => {
  const getConfidenceBadge = (score: number) => {
    if (score >= 85) return { variant: "default" as const, label: "High Confidence" };
    if (score >= 70) return { variant: "secondary" as const, label: "Medium Confidence" };
    return { variant: "outline" as const, label: "Estimated" };
  };

  const confidence = getConfidenceBadge(quote.confidenceScore);

  return (
    <div className="space-y-6">
      {/* Main Quote Card */}
      <Card className="border-2 border-primary">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Your Custom Quote
            </CardTitle>
            <Badge variant={confidence.variant}>
              {confidence.label} ({quote.confidenceScore}%)
            </Badge>
          </div>
          <CardDescription>
            {productType} • {quantity.toLocaleString()} units
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Price Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Unit Price</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                ${quote.unitPrice.toFixed(2)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm">Total Price</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                ${quote.totalPrice.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Lead Time</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {quote.estimatedDeliveryDays} days
              </p>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Price Breakdown (per unit)
            </h4>
            <div className="space-y-2">
              {Object.entries(quote.priceBreakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <span className="capitalize text-muted-foreground">{key}</span>
                  <span className="font-medium text-foreground">${value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Justification */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Why This Price?</h4>
            <p className="text-muted-foreground leading-relaxed">
              {quote.priceJustification}
            </p>
          </div>

          {/* Comparable Products */}
          {quote.comparableProducts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Market Comparison</h4>
                <div className="space-y-2">
                  {quote.comparableProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.supplier}</p>
                      </div>
                      <Badge 
                        variant={product.price > quote.unitPrice ? "destructive" : "default"}
                      >
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AI Suggestions */}
          {quote.suggestions && (
            <>
              <Separator />
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Suggestions
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {quote.suggestions}
                </p>
              </div>
            </>
          )}

          {/* Data Sources */}
          {research.sources.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Research Sources</h4>
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
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onStartNew} variant="outline" className="flex-1">
              Get New Quote
            </Button>
            <Button className="flex-1 gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Accept Quote
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-muted/50 rounded-md border border-border">
            <p className="text-xs text-muted-foreground">
              📋 This quote is generated using real-time market research and is valid for 7 days. 
              Final pricing will be confirmed after reviewing your detailed requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
