import { Check, Clock, Package, Sparkles, Droplets, Shield, Box, Truck } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export type ProductionStage =
  | "yarn_received"
  | "knitting"
  | "linking"
  | "washing_finishing"
  | "final_qc"
  | "packing"
  | "ready_to_ship";

interface ProductionTimelineProps {
  currentStage: ProductionStage;
  stageProgress: Record<ProductionStage, number>;
}

const stages: Array<{
  key: ProductionStage;
  label: string;
  icon: React.ElementType;
}> = [
  { key: "yarn_received", label: "Yarn Received", icon: Package },
  { key: "knitting", label: "Knitting", icon: Sparkles },
  { key: "linking", label: "Linking", icon: Clock },
  { key: "washing_finishing", label: "Washing & Finishing", icon: Droplets },
  { key: "final_qc", label: "Final QC", icon: Shield },
  { key: "packing", label: "Packing", icon: Box },
  { key: "ready_to_ship", label: "Ready to Ship", icon: Truck },
];

const getStageStatus = (
  stageKey: ProductionStage,
  currentStage: ProductionStage,
  progress: number
): "complete" | "in-progress" | "pending" => {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);
  const stageIndex = stages.findIndex((s) => s.key === stageKey);

  if (stageIndex < currentIndex) return "complete";
  if (stageIndex === currentIndex && progress > 0) return "in-progress";
  return "pending";
};

export const ProductionTimeline = ({
  currentStage,
  stageProgress,
}: ProductionTimelineProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Production Timeline</h3>
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(
            stage.key,
            currentStage,
            stageProgress[stage.key]
          );
          const Icon = stage.icon;
          const progress = stageProgress[stage.key];

          return (
            <div key={stage.key} className="relative">
              {index < stages.length - 1 && (
                <div
                  className={`absolute left-5 top-12 w-0.5 h-8 ${
                    status === "complete"
                      ? "bg-green-500"
                      : status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-muted"
                  }`}
                />
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    status === "complete"
                      ? "border-green-500 bg-green-50 text-green-600"
                      : status === "in-progress"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  {status === "complete" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{stage.label}</p>
                    <Badge
                      variant={
                        status === "complete"
                          ? "default"
                          : status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {status === "complete"
                        ? "Complete"
                        : status === "in-progress"
                        ? `${progress}%`
                        : "Pending"}
                    </Badge>
                  </div>
                  {status === "in-progress" && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
