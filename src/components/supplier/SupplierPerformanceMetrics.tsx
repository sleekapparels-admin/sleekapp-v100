import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Package, 
  Star, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SupplierPerformanceMetricsProps {
  supplierId: string;
}

export const SupplierPerformanceMetrics = ({ 
  supplierId 
}: SupplierPerformanceMetricsProps) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [supplierId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch supplier data
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();

      if (supplierError) throw supplierError;

      // Fetch order statistics
      const { data: orders, error: ordersError } = await supabase
        .from('supplier_orders')
        .select('*')
        .eq('supplier_id', supplierId);

      if (ordersError) throw ordersError;

      // Calculate metrics
      const totalOrders = orders?.length || 0;
      const acceptedOrders = orders?.filter(o => o.acceptance_status === 'accepted').length || 0;
      const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
      const pendingOrders = orders?.filter(o => o.acceptance_status === 'pending').length || 0;
      const acceptanceRate = totalOrders > 0 ? (acceptedOrders / totalOrders) * 100 : 0;

      setMetrics({
        performanceScore: supplier?.performance_score || 0,
        totalOrdersCompleted: supplier?.total_orders_completed || 0,
        onTimeDeliveryRate: supplier?.on_time_delivery_rate || 0,
        acceptanceRate,
        totalOrders,
        acceptedOrders,
        completedOrders,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading metrics...</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent', icon: Star };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good', icon: TrendingUp };
    return { variant: 'destructive' as const, label: 'Needs Improvement', icon: AlertCircle };
  };

  const scoreConfig = getScoreBadge(metrics?.performanceScore || 0);
  const ScoreIcon = scoreConfig.icon;

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-4xl font-bold">
                  {metrics?.performanceScore?.toFixed(1) || 0}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </p>
                <Badge variant={scoreConfig.variant} className="gap-1">
                  <ScoreIcon className="h-3 w-3" />
                  {scoreConfig.label}
                </Badge>
              </div>
            </div>
            <Progress value={metrics?.performanceScore || 0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              On-Time Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {metrics?.onTimeDeliveryRate?.toFixed(1) || 0}%
              </p>
              <Progress value={metrics?.onTimeDeliveryRate || 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Order Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {metrics?.acceptanceRate?.toFixed(1) || 0}%
              </p>
              <Progress value={metrics?.acceptanceRate || 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Orders Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.completedOrders || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Out of {metrics?.totalOrders || 0} total orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.pendingOrders || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting your response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Tips to Improve Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Respond to orders within 24 hours to improve acceptance rate</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Meet or beat target delivery dates consistently</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Maintain high quality standards to avoid returns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
              <span>Update order status regularly to keep buyers informed</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
