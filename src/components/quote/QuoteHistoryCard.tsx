import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Quote } from "@/hooks/useQuotes";
import { Calendar, Package, DollarSign, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface QuoteHistoryCardProps {
  quote: Quote;
  isSelected: boolean;
  onToggleSelect: (quoteId: string) => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
    pending: { variant: "secondary", label: "Pending" },
    quoted: { variant: "default", label: "Quoted" },
    accepted: { variant: "default", label: "Accepted" },
    rejected: { variant: "outline", label: "Rejected" },
    converted: { variant: "default", label: "Converted to Order" },
  };
  
  const config = statusMap[status] || statusMap.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export function QuoteHistoryCard({ quote, isSelected, onToggleSelect }: QuoteHistoryCardProps) {
  const totalPrice = quote.ai_estimation?.totalPrice || (quote.target_price_per_unit && quote.quantity ? quote.target_price_per_unit * quote.quantity : null);
  const unitPrice = totalPrice && quote.quantity 
    ? (totalPrice / quote.quantity).toFixed(2)
    : quote.target_price_per_unit?.toFixed(2) || null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm text-muted-foreground">
                #{quote.id.slice(0, 8)}
              </span>
            </div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {quote.product_type || "Custom Product"}
            </h3>
          </div>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(quote.id)}
            aria-label="Select for comparison"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            {getStatusBadge(quote.status)}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(quote.created_at), "MMM dd, yyyy")}
            </span>
          </div>

          {/* Key Details */}
          <div className="space-y-2 pt-2 border-t">
            {quote.quantity && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{quote.quantity.toLocaleString()} pcs</span>
              </div>
            )}
            
            {totalPrice && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-semibold text-primary">
                  ${typeof totalPrice === 'number' ? totalPrice.toLocaleString() : totalPrice}
                </span>
              </div>
            )}

            {unitPrice && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unit Price</span>
                <span className="font-medium">${unitPrice}</span>
              </div>
            )}

            {quote.ai_estimation?.timeline && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Lead Time
                </span>
                <span className="font-medium">{quote.ai_estimation.timeline}</span>
              </div>
            )}
          </div>

          {/* Materials/Specifications */}
          {(quote.fabric_type || quote.customization_details) && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Specifications</p>
              <p className="text-sm line-clamp-2">
                {quote.fabric_type && `Fabric: ${quote.fabric_type}`}
                {quote.fabric_type && quote.customization_details && " • "}
                {quote.customization_details}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to={`/quote-details/${quote.id}`}>
                View Details <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
