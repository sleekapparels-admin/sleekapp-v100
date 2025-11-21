import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { useSmartSupplierAssignment } from '@/hooks/useSmartSupplierAssignment';
import { toast } from 'sonner';

interface SmartSupplierAssignmentProps {
  orderId: string;
  productType: string;
  quantity: number;
  requirements?: string;
  onSupplierSelected: (supplierId: string) => void;
}

export const SmartSupplierAssignment = ({
  orderId,
  productType,
  quantity,
  requirements,
  onSupplierSelected
}: SmartSupplierAssignmentProps) => {
  const { loading, recommendations, getRecommendations } = useSmartSupplierAssignment();
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleGetRecommendations = async () => {
    const recs = await getRecommendations(orderId, productType, quantity, requirements);
    if (recs.length > 0) {
      setShowRecommendations(true);
    }
  };

  const handleSelectSupplier = (supplierId: string, supplierName: string) => {
    onSupplierSelected(supplierId);
    toast.success(`Assigned to ${supplierName}`);
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">High Confidence</Badge>;
    if (score >= 60) return <Badge variant="secondary">Medium Confidence</Badge>;
    return <Badge variant="outline">Low Confidence</Badge>;
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Supplier Recommendation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Let AI analyze and recommend the best suppliers for this order
            </p>
          </div>
          {!showRecommendations && (
            <Button onClick={handleGetRecommendations} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Get AI Recommendations
            </Button>
          )}
        </div>
      </CardHeader>

      {showRecommendations && recommendations.length > 0 && (
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.supplier_id} className="border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-lg font-bold">
                          #{rec.rank}
                        </Badge>
                        <h3 className="text-lg font-semibold">{rec.supplier_name}</h3>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {getConfidenceBadge(rec.confidence_score)}
                        <Badge variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {rec.confidence_score}% Match
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleSelectSupplier(rec.supplier_id, rec.supplier_name)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">AI Reasoning:</p>
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </div>

                  {rec.supplier_details && (
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacity</p>
                        <p className="font-semibold">{rec.supplier_details.monthly_capacity || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <p className="font-semibold">{rec.supplier_details.performance_score || 0}/100</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lead Time</p>
                        <p className="font-semibold">{rec.supplier_details.lead_time_days || 'N/A'} days</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};