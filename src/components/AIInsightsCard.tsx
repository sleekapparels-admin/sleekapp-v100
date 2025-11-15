import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import type { OrderData, OrderUpdate, QualityCheck, AIInsights } from "@/types/order";

interface AIInsightsCardProps {
  orderData: OrderData;
  updates: OrderUpdate[];
  qcChecks: QualityCheck[];
}

export const AIInsightsCard = ({ orderData, updates, qcChecks }: AIInsightsCardProps) => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analytics-service', {
        body: { 
          analysisType: 'order-insights',
          data: { orderData, updates, qcChecks }
        }
      });

      if (error) throw error;
      setInsights(data);
    } catch (error) {
      console.error('Error getting AI insights:', error);
      toast({
        title: "Error",
        description: "Failed to get AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!insights ? (
          <Button onClick={getInsights} disabled={loading} className="w-full">
            {loading ? "Analyzing..." : "Get AI Insights"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Delivery Prediction</p>
                <p className="text-sm text-muted-foreground">{insights.deliveryPrediction}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold">Quality Forecast</p>
                <p className="text-sm text-muted-foreground">{insights.qualityForecast}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-5 w-5 mt-1 ${getRiskColor(insights.riskLevel)}`} />
              <div>
                <p className="font-semibold">Risk Level</p>
                <Badge variant={insights.riskLevel === 'low' ? 'default' : 'destructive'}>
                  {insights.riskLevel}
                </Badge>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Recommendations</p>
              <ul className="space-y-1 text-sm">
                {insights.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={getInsights} variant="outline" size="sm" className="w-full">
              Refresh Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
