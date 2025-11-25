import { Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessHoursProps {
  variant?: "full" | "compact";
}

export const BusinessHours = ({ variant = "full" }: BusinessHoursProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>9:00 AM - 6:00 PM (GMT+6)</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-foreground mb-1">Business Hours</p>
          <p className="text-sm text-muted-foreground">
            9:00 AM - 6:00 PM (GMT+6, Bangladesh Time)
          </p>
        </div>
      </div>
      
      <Badge variant="secondary" className="gap-2">
        <Zap className="w-3 h-3" />
        <span>Fast Response: We reply within 2 hours during business hours</span>
      </Badge>
    </div>
  );
};
