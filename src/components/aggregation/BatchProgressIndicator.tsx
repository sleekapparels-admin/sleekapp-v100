import { Progress } from "@/components/ui/progress";
import { Clock, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BatchProgressIndicatorProps {
  currentQuantity: number;
  targetQuantity: number;
  currentStyleCount: number;
  maxStyles: number;
  estimatedStartDate: string;
  windowClosesAt: string;
  showDetails?: boolean;
}

export const BatchProgressIndicator = ({
  currentQuantity,
  targetQuantity,
  currentStyleCount,
  maxStyles,
  estimatedStartDate,
  windowClosesAt,
  showDetails = false,
}: BatchProgressIndicatorProps) => {
  const fillPercentage = (currentQuantity / targetQuantity) * 100;
  const hoursRemaining = Math.max(0, Math.floor((new Date(windowClosesAt).getTime() - Date.now()) / (1000 * 60 * 60)));
  const daysRemaining = Math.ceil(hoursRemaining / 24);

  const getStatusColor = () => {
    if (fillPercentage >= 75) return "text-green-600";
    if (fillPercentage >= 50) return "text-yellow-600";
    return "text-blue-600";
  };

  const getStatusMessage = () => {
    if (fillPercentage >= 75) return "Starting soon!";
    if (fillPercentage >= 50) return "Almost there";
    return "Filling up";
  };

  return (
    <Card className="p-4 border-primary/20">
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
            <span className="text-muted-foreground">
              {currentQuantity}/{targetQuantity} pieces
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {fillPercentage.toFixed(0)}% filled
          </p>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
            {/* Time Remaining */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Starting in</p>
                <p className="text-sm font-semibold">
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Style Slots */}
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Styles</p>
                <p className="text-sm font-semibold">
                  {currentStyleCount}/{maxStyles}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold">
                  {fillPercentage >= 75 ? 'Ready' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Social Proof */}
        {currentStyleCount > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              🔥 <span className="font-medium">{currentStyleCount} {currentStyleCount === 1 ? 'brand has' : 'brands have'}</span> joined this batch
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
