import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
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

interface PredictiveDelayAlertProps {
  orderId: string;
  stages: ProductionStage[];
}

interface DelayRisk {
  stage: ProductionStage;
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
  daysDelayed?: number;
}

export const PredictiveDelayAlert = ({ orderId, stages }: PredictiveDelayAlertProps) => {
  const [delayRisks, setDelayRisks] = useState<DelayRisk[]>([]);

  useEffect(() => {
    analyzeDelayRisks();
  }, [stages]);

  const analyzeDelayRisks = () => {
    const risks: DelayRisk[] = [];
    const now = new Date();

    stages.forEach((stage) => {
      // Skip completed stages
      if (stage.status === 'completed') return;

      // Check if stage is in progress and behind schedule
      if (stage.status === 'in_progress' && stage.target_date) {
        const targetDate = new Date(stage.target_date);
        const daysUntilTarget = differenceInDays(targetDate, now);
        const progress = stage.completion_percentage || 0;

        // Calculate if on track (simple heuristic)
        if (daysUntilTarget < 0) {
          // Already past target date
          risks.push({
            stage,
            riskLevel: 'high',
            message: `Stage is ${Math.abs(daysUntilTarget)} days overdue`,
            daysDelayed: Math.abs(daysUntilTarget)
          });
        } else if (daysUntilTarget <= 2 && progress < 80) {
          // Less than 2 days left but not 80% complete
          risks.push({
            stage,
            riskLevel: 'high',
            message: `Only ${daysUntilTarget} days left but only ${progress}% complete`,
          });
        } else if (daysUntilTarget <= 5 && progress < 50) {
          // Less than 5 days left but not 50% complete
          risks.push({
            stage,
            riskLevel: 'medium',
            message: `${daysUntilTarget} days until deadline, ${progress}% complete`,
          });
        } else if (progress < 20 && daysUntilTarget <= 7) {
          // Low progress with approaching deadline
          risks.push({
            stage,
            riskLevel: 'medium',
            message: `Progress is slow, only ${progress}% complete`,
          });
        }
      }

      // Check if stage should have started but hasn't
      if (stage.status === 'pending' && stage.target_date) {
        const targetDate = new Date(stage.target_date);
        const daysUntilTarget = differenceInDays(targetDate, now);
        
        if (daysUntilTarget < 7 && daysUntilTarget > 0) {
          risks.push({
            stage,
            riskLevel: 'low',
            message: `Stage should start soon (target: ${format(targetDate, 'MMM dd')})`,
          });
        } else if (daysUntilTarget < 0) {
          risks.push({
            stage,
            riskLevel: 'high',
            message: `Stage hasn't started but target date has passed`,
            daysDelayed: Math.abs(daysUntilTarget)
          });
        }
      }
    });

    setDelayRisks(risks);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return '';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  if (delayRisks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            AI Delay Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="text-lg font-semibold mb-1">All On Track</p>
            <p className="text-sm text-muted-foreground">
              No predicted delays detected. Production is progressing well.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          AI Delay Prediction
          <Badge variant="destructive">{delayRisks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {delayRisks.map((risk, index) => (
          <Alert 
            key={index} 
            className={getRiskColor(risk.riskLevel)}
          >
            <div className="flex items-start gap-3">
              {getRiskIcon(risk.riskLevel)}
              <div className="flex-1">
                <AlertTitle className="mb-1">
                  {risk.stage.stage_name}
                  <Badge variant="outline" className="ml-2">
                    {risk.riskLevel.toUpperCase()} RISK
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {risk.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
        
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">💡 AI Recommendation:</p>
          <p className="text-muted-foreground">
            {delayRisks.some(r => r.riskLevel === 'high') 
              ? "Immediate action required. Consider reallocating resources or communicating with suppliers."
              : "Monitor progress closely. Early intervention can prevent delays."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
