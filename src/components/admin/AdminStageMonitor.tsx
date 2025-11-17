import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface AdminStageMonitorProps {
  stages: any[];
  onRefresh: () => void;
}

export const AdminStageMonitor = ({ stages }: AdminStageMonitorProps) => {
  const getStatusColor = (stage: any) => {
    if (stage.completion_percentage === 100) return "text-green-500";
    if (stage.completion_percentage > 0) return "text-yellow-500";
    return "text-muted-foreground";
  };

  const getStatusIcon = (stage: any) => {
    if (stage.completion_percentage === 100) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (stage.completion_percentage > 0) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };

  if (stages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No production stages defined</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(stage)}
                <div>
                  <h3 className="text-lg font-semibold">
                    Stage {stage.stage_number}: {stage.stage_name}
                  </h3>
                  {stage.description && (
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  )}
                  {stage.target_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Target: {format(new Date(stage.target_date), "PPP")}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={stage.status === "completed" ? "default" : "secondary"}>
                {stage.status}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className={`text-sm font-semibold ${getStatusColor(stage)}`}>
                  {stage.completion_percentage}%
                </span>
              </div>
              <Progress value={stage.completion_percentage} className="h-3" />
            </div>

            {stage.notes && (
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium mb-1">Latest Update</p>
                <p className="text-sm text-muted-foreground">{stage.notes}</p>
                {stage.updated_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {format(new Date(stage.updated_at), "PPp")}
                  </p>
                )}
              </div>
            )}

            {stage.photos && stage.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">Production Photos</p>
                <div className="grid grid-cols-4 gap-3">
                  {stage.photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={photo} 
                        alt={`Stage ${stage.stage_number} photo ${index + 1}`} 
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-sm">
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-medium">
                  {stage.started_at ? format(new Date(stage.started_at), "PP") : "Not started"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-medium">
                  {stage.completed_at ? format(new Date(stage.completed_at), "PP") : "In progress"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {stage.started_at && stage.completed_at 
                    ? `${Math.ceil((new Date(stage.completed_at).getTime() - new Date(stage.started_at).getTime()) / (1000 * 60 * 60 * 24))} days`
                    : "-"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};