import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, AlertTriangle, Package, Truck, Scissors, PenTool, ClipboardCheck, Tag, ShoppingBag } from "lucide-react";
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
  const getStageIcon = (stageName: string) => {
    const lowerName = stageName.toLowerCase();
    if (lowerName.includes('sourcing')) return <ShoppingBag className="h-5 w-5" />;
    if (lowerName.includes('pattern')) return <PenTool className="h-5 w-5" />;
    if (lowerName.includes('cutting')) return <Scissors className="h-5 w-5" />;
    if (lowerName.includes('sewing')) return <Scissors className="h-5 w-5" />; // Could find a needle icon if available
    if (lowerName.includes('inspection') || lowerName.includes('quality')) return <ClipboardCheck className="h-5 w-5" />;
    if (lowerName.includes('packaging')) return <Package className="h-5 w-5" />;
    if (lowerName.includes('logistics') || lowerName.includes('shipment')) return <Truck className="h-5 w-5" />;
    if (lowerName.includes('order')) return <Tag className="h-5 w-5" />;
    return <Circle className="h-5 w-5" />;
  };

  const getStatusIcon = (status: string, completionPercentage: number | null, stageName: string) => {
    const baseIcon = getStageIcon(stageName);

    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500 bg-background rounded-full" />;
      case 'in_progress':
        return <div className="text-blue-500 animate-pulse">{baseIcon}</div>;
      case 'delayed':
        return <AlertTriangle className="h-6 w-6 text-red-500 bg-background rounded-full" />;
      default:
        return <div className="text-gray-300">{baseIcon}</div>;
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

  const getBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'delayed': return 'destructive';
      default: return 'outline';
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
              sortedStages.map((stage) => (
                <div key={stage.id} className="relative pl-10 group">
                  {/* Icon */}
                  <div className={`absolute left-0 top-0 flex items-center justify-center w-7 h-7 rounded-full bg-background border-2 transition-colors ${
                    stage.status === 'completed' ? 'border-green-500' :
                    stage.status === 'in_progress' ? 'border-blue-500' :
                    stage.status === 'delayed' ? 'border-red-500' : 'border-gray-200'
                  }`}>
                    {getStatusIcon(stage.status, stage.completion_percentage, stage.stage_name)}
                  </div>

                  {/* Content */}
                  <div className={`rounded-lg p-4 border transition-all ${
                    stage.status === 'in_progress' ? 'bg-muted/50 border-blue-200 shadow-sm' :
                    stage.status === 'completed' ? 'bg-muted/30 border-green-100' :
                    'bg-card border-transparent hover:border-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${stage.status === 'completed' ? 'text-green-700' : ''}`}>
                          {stage.stage_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Stage {stage.stage_number}
                        </p>
                      </div>
                      <Badge variant={getBadgeVariant(stage.status)}>
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
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      {stage.started_at && (
                        <div>
                          <p className="text-xs text-muted-foreground">Started</p>
                          <p className="font-medium text-xs">
                            {format(new Date(stage.started_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {stage.completed_at && (
                        <div>
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="font-medium text-xs">
                            {format(new Date(stage.completed_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                      {stage.target_date && !stage.completed_at && (
                        <div>
                          <p className="text-xs text-muted-foreground">Target Date</p>
                          <p className={`font-medium text-xs ${
                            new Date(stage.target_date) < new Date() && stage.status !== 'completed'
                              ? 'text-red-500 font-bold'
                              : ''
                          }`}>
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
