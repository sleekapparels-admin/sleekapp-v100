import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Target
} from "lucide-react";
import { differenceInDays, format } from "date-fns";

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

interface ProductionAnalyticsProps {
  orderId: string;
  stages: ProductionStage[];
}

export const ProductionAnalytics = ({ orderId, stages }: ProductionAnalyticsProps) => {
  const calculateOverallProgress = () => {
    if (stages.length === 0) return 0;
    
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const inProgressStages = stages.filter(s => s.status === 'in_progress');
    
    let totalProgress = completedStages * 100;
    
    inProgressStages.forEach(stage => {
      totalProgress += (stage.completion_percentage || 0);
    });
    
    return Math.round(totalProgress / 8); // 8 total stages
  };

  const calculateEstimatedCompletion = () => {
    const completedCount = stages.filter(s => s.status === 'completed').length;
    const remainingStages = 8 - completedCount;
    
    // Simple estimation: 5 days per remaining stage
    const estimatedDays = remainingStages * 5;
    
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    
    return estimatedDate;
  };

  const getDelayedStages = () => {
    const now = new Date();
    return stages.filter(stage => {
      if (stage.status === 'completed' || !stage.target_date) return false;
      const targetDate = new Date(stage.target_date);
      return targetDate < now;
    });
  };

  const getAverageStageTime = () => {
    const completedStages = stages.filter(s => 
      s.status === 'completed' && s.started_at && s.completed_at
    );
    
    if (completedStages.length === 0) return null;
    
    let totalDays = 0;
    completedStages.forEach(stage => {
      if (stage.started_at && stage.completed_at) {
        const days = differenceInDays(
          new Date(stage.completed_at),
          new Date(stage.started_at)
        );
        totalDays += days;
      }
    });
    
    return Math.round(totalDays / completedStages.length);
  };

  const overallProgress = calculateOverallProgress();
  const estimatedCompletion = calculateEstimatedCompletion();
  const delayedStages = getDelayedStages();
  const avgStageTime = getAverageStageTime();

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const inProgressCount = stages.filter(s => s.status === 'in_progress').length;
  const pendingCount = stages.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{overallProgress}%</span>
                <Badge variant={overallProgress > 75 ? 'default' : 'secondary'}>
                  {completedCount} of 8 stages completed
                </Badge>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estimated Completion */}
          <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Estimated Completion</p>
              <p className="text-lg font-semibold">
                {format(estimatedCompletion, 'MMMM dd, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {differenceInDays(estimatedCompletion, new Date())} days remaining
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>

          {/* Average Stage Time */}
          {avgStageTime !== null && (
            <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Average Stage Duration</p>
                <p className="text-lg font-semibold">{avgStageTime} days</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on {completedCount} completed stage{completedCount !== 1 ? 's' : ''}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          )}

          {/* Delayed Stages Alert */}
          {delayedStages.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  {delayedStages.length} Stage{delayedStages.length !== 1 ? 's' : ''} Behind Schedule
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  {delayedStages.map(stage => (
                    <li key={stage.id}>
                      • {stage.stage_name} ({Math.abs(differenceInDays(new Date(stage.target_date!), new Date()))} days overdue)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* On Track Badge */}
          {delayedStages.length === 0 && completedCount > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-sm font-semibold text-green-900">
                All stages on track!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Quality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">On-Time Performance</p>
                <p className="text-lg font-semibold">
                  {delayedStages.length === 0 && stages.length > 0 ? '100%' : 
                   stages.length > 0 ? `${Math.round((1 - delayedStages.length / stages.length) * 100)}%` : 'N/A'}
                </p>
              </div>
              <Badge variant={delayedStages.length === 0 ? 'default' : 'destructive'}>
                {delayedStages.length === 0 ? 'Excellent' : 'Needs Attention'}
              </Badge>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">💡 AI Insight</p>
              <p className="text-xs text-blue-700">
                {overallProgress > 75 
                  ? "Production is in final stages. Maintain current pace for on-time delivery."
                  : overallProgress > 50
                  ? "Halfway through production. Monitor closely for any bottlenecks."
                  : "Early production phase. Set clear milestones for each stage."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
