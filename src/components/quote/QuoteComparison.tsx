import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Quote } from "@/hooks/useQuotes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format } from "date-fns";

interface QuoteComparisonProps {
  quotes: Quote[];
  onClose: () => void;
}

export function QuoteComparison({ quotes, onClose }: QuoteComparisonProps) {
  if (quotes.length < 2) return null;

  const getTotalPrice = (q: Quote) => {
    return q.ai_estimation?.totalPrice || (q.target_price_per_unit && q.quantity ? q.target_price_per_unit * q.quantity : null);
  };

  const getUnitPrice = (q: Quote) => {
    const total = getTotalPrice(q);
    return total && q.quantity ? (total / q.quantity).toFixed(2) : q.target_price_per_unit?.toFixed(2) || null;
  };

  const comparisonRows = [
    {
      label: "Product Type",
      getValue: (q: Quote) => q.product_type || "N/A",
    },
    {
      label: "Quantity",
      getValue: (q: Quote) => q.quantity ? `${q.quantity.toLocaleString()} pcs` : "N/A",
    },
    {
      label: "Total Price",
      getValue: (q: Quote) => {
        const price = getTotalPrice(q);
        return price ? `$${typeof price === 'number' ? price.toLocaleString() : price}` : "N/A";
      },
      highlight: true,
    },
    {
      label: "Unit Price",
      getValue: (q: Quote) => {
        const price = getUnitPrice(q);
        return price ? `$${price}` : "N/A";
      },
      highlight: true,
    },
    {
      label: "Lead Time",
      getValue: (q: Quote) => q.ai_estimation?.timeline || "N/A",
    },
    {
      label: "Fabric Type",
      getValue: (q: Quote) => q.fabric_type || "N/A",
    },
    {
      label: "Status",
      getValue: (q: Quote) => q.status,
      renderCell: (q: Quote) => (
        <Badge variant={q.status === "accepted" ? "default" : "secondary"}>
          {q.status}
        </Badge>
      ),
    },
    {
      label: "Created Date",
      getValue: (q: Quote) => format(new Date(q.created_at), "MMM dd, yyyy"),
    },
  ];

  // Calculate price comparison
  const prices = quotes
    .map(q => getTotalPrice(q))
    .filter((p): p is number => p !== null && p !== undefined);
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getPriceIcon = (quote: Quote) => {
    const price = getTotalPrice(quote);
    if (!price || prices.length < 2) return <Minus className="w-4 h-4" />;
    if (price === minPrice) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (price === maxPrice) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Quote Comparison
          </DialogTitle>
          <DialogDescription>
            Compare {quotes.length} quotes side by side
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Comparison Highlight */}
          {prices.length > 1 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Price Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Lowest Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${minPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(maxPrice - minPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold bg-muted/30">
                    Specification
                  </th>
                  {quotes.map((quote, idx) => (
                    <th key={quote.id} className="text-left p-3 font-semibold bg-muted/30">
                      Quote {idx + 1}
                      <div className="text-xs font-normal text-muted-foreground mt-1">
                        #{quote.id.slice(0, 8)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className={`border-b ${row.highlight ? "bg-primary/5" : ""}`}
                  >
                    <td className="p-3 font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {quotes.map(quote => (
                      <td key={quote.id} className="p-3">
                        <div className="flex items-center gap-2">
                          {row.label === "Total Price" && getPriceIcon(quote)}
                          {row.renderCell ? row.renderCell(quote) : row.getValue(quote)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
