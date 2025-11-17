import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ProductionStage {
  id: string;
  stage_number: number;
  stage_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  target_date: string | null;
  completion_percentage: number | null;
}

interface ProductionStageTimelineProps {
  orderId: string;
  stages: ProductionStage[];
}

export const ProductionStageTimeline = ({ orderId, stages }: ProductionStageTimelineProps) => {
  const getStatusIcon = (status: string, completionPercentage: number | null) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'delayed':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  // Sort stages by stage_number
  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

          {/* Timeline items */}
          <div className="space-y-6">
            {sortedStages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No production stages available yet
              </p>
            ) : (
              sortedStages.map((stage, index) => (
                <div key={stage.id} className="relative pl-10">
                  {/* Icon */}
                  <div className="absolute left-0 top-0 flex items-center justify-center">
                    {getStatusIcon(stage.status, stage.completion_percentage)}
                  </div>

                  {/* Content */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{stage.stage_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Stage {stage.stage_number}
                        </p>
                      </div>
                      <Badge 
                        variant={stage.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {stage.status?.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    {stage.status === 'in_progress' && stage.completion_percentage !== null && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{stage.completion_percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getStatusColor(stage.status)}`}
                            style={{ width: `${stage.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {stage.started_at && (
                        <div>
                          <p className="text-muted-foreground">Started</p>
                          <p className="font-medium">
                            {format(new Date(stage.started_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {stage.completed_at && (
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="font-medium">
                            {format(new Date(stage.completed_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {stage.target_date && !stage.completed_at && (
                        <div>
                          <p className="text-muted-foreground">Target Date</p>
                          <p className="font-medium">
                            {format(new Date(stage.target_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
