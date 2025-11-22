import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useQualityPrediction } from '@/hooks/useQualityPrediction';

interface QualityRiskAlertProps {
  supplierOrderId: string;
}

export const QualityRiskAlert = ({ supplierOrderId }: QualityRiskAlertProps) => {
  const { loading, assessment, predictQualityRisks } = useQualityPrediction();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const analyzeRisks = async () => {
      const result = await predictQualityRisks(supplierOrderId);
      if (result && (result.risk_level === 'high' || result.risk_level === 'critical')) {
        setShowAlert(true);
      }
    };

    analyzeRisks();
  }, [supplierOrderId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse text-muted-foreground">Analyzing quality risks...</div>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) return null;

  const getRiskColor = () => {
    switch (assessment.risk_level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const getRiskIcon = () => {
    switch (assessment.risk_level) {
      case 'critical': return <XCircle className="h-5 w-5" />;
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Info className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
    }
  };

  if (assessment.risk_level === 'low') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>All Clear:</strong> No significant quality risks detected. Production is on track.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`border-2 ${assessment.risk_level === 'critical' || assessment.risk_level === 'high' ? 'border-red-500' : 'border-orange-500'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon()}
            Quality Risk Assessment
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getRiskColor() as any}>
              {assessment.risk_level.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              Risk Score: {assessment.risk_score}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Risk Factors Identified:</h4>
          <ul className="space-y-1">
            {assessment.risk_factors.map((factor, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-500 flex-shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-900">AI Recommendations:</h4>
          <ul className="space-y-1">
            {assessment.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};