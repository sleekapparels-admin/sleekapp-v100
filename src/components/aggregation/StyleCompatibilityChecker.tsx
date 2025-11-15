import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Shirt } from "lucide-react";

interface StyleCompatibilityCheckerProps {
  yourStyle: {
    variant: string;
    color?: string;
    size?: string;
  };
  existingStyles: Array<{
    variant: string;
    color?: string;
  }>;
  maxStyles: number;
}

export const StyleCompatibilityChecker = ({
  yourStyle,
  existingStyles,
  maxStyles,
}: StyleCompatibilityCheckerProps) => {
  const currentStyleCount = existingStyles.length;
  const isCompatible = currentStyleCount < maxStyles;
  const spotsRemaining = maxStyles - currentStyleCount - 1;

  return (
    <Card className={`p-4 ${isCompatible ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompatible ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <h3 className={`font-semibold ${isCompatible ? 'text-green-900' : 'text-yellow-900'}`}>
              {isCompatible ? 'Compatible Batch' : 'Batch Almost Full'}
            </h3>
          </div>
          <Badge variant={isCompatible ? "default" : "secondary"} className={isCompatible ? "bg-green-600" : "bg-yellow-600"}>
            {currentStyleCount + 1}/{maxStyles} Styles
          </Badge>
        </div>

        {/* Your Style */}
        <div className="bg-white rounded-lg p-3 border-2 border-primary">
          <p className="text-xs text-muted-foreground mb-2">Your Order</p>
          <div className="flex items-center gap-2">
            <Shirt className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {yourStyle.variant}
              {yourStyle.color && ` - ${yourStyle.color}`}
            </span>
          </div>
        </div>

        {/* Existing Styles in Batch */}
        {existingStyles.length > 0 && (
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Current Batch Includes</p>
            <div className="space-y-2">
              {existingStyles.map((style, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Shirt className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {style.variant}
                    {style.color && ` - ${style.color}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="pt-2 border-t">
          {isCompatible ? (
            <p className="text-xs text-green-900">
              ✓ Your order fits perfectly! <span className="font-medium">{spotsRemaining} style {spotsRemaining === 1 ? 'slot' : 'slots'} remaining</span> in this batch.
            </p>
          ) : (
            <p className="text-xs text-yellow-900">
              ⚠️ This batch is at maximum style capacity. You'll start a new batch or join another one.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
