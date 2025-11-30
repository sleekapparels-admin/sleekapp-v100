import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useProductionStages } from "@/hooks/useProductionStages";

interface OrderWithTracking {
  id: string;
  order_number: string;
  product_type: string;
  quantity: number;
  workflow_status: string;
  expected_delivery_date: string | null;
  supplier_orders: {
    id: string;
    supplier_id: string;
    suppliers: {
      company_name: string;
    };
  }[];
}

export const LoopTraceOrderTracking = () => {
  const [orders, setOrders] = useState<OrderWithTracking[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Use the new hook for stages
  const { stages, isLoading: stagesLoading } = useProductionStages(selectedOrder);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, order_number, product_type, quantity, workflow_status, expected_delivery_date')
          .eq('buyer_id', user.id)
          .in('workflow_status', ['bulk_production', 'qc_inspection', 'completed', 'shipped'])
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        if (!ordersData) {
          setOrders([]);
          return;
        }

        const result: OrderWithTracking[] = [];

        for (const order of ordersData) {
          // Fetch supplier order using buyer_order_id
          const { data: supplierOrderData } = await supabase
            .from('supplier_orders')
            .select('id, supplier_id')
            .eq('buyer_order_id', order.id)
            .maybeSingle();

          let supplierInfo = { company_name: 'Unknown' };
          if (supplierOrderData?.supplier_id) {
            // Fetch supplier info
            const { data: supplierData } = await supabase
              .from('suppliers')
              .select('company_name')
              .eq('id', supplierOrderData.supplier_id)
              .maybeSingle();

            if (supplierData) {
              supplierInfo = supplierData;
            }
          }

          result.push({
            ...order,
            workflow_status: (order.workflow_status ?? 'pending') as string,
            supplier_orders: supplierOrderData ? [{
              id: supplierOrderData.id,
              supplier_id: supplierOrderData.supplier_id ?? '',
              suppliers: supplierInfo
            }] : []
          });
        }

        setOrders(result);
        if (result.length > 0) {
          setSelectedOrder(result[0].id);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const getStageIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'in_progress') return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const calculateOverallProgress = () => {
    if (stages.length === 0) return 0;
    const total = stages.reduce((sum, stage) => sum + stage.completion_percentage, 0);
    return Math.round(total / stages.length);
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">LoopTrace™ Order Tracking</h2>
        <p className="text-muted-foreground">Real-time production tracking with AI-powered insights</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No active orders</h3>
            <p className="text-muted-foreground">You don't have any orders in production yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedOrder === order.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                      }`}
                  >
                    <div className="font-semibold">#{order.order_number}</div>
                    <div className="text-sm opacity-90">{order.product_type}</div>
                    <div className="text-xs opacity-75">{order.quantity} pcs</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Production Stages */}
          <div className="lg:col-span-2">
            {selectedOrderData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Production Progress</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order #{selectedOrderData.order_number} • {selectedOrderData.quantity} pcs
                      </p>
                    </div>
                    <Badge className="bg-blue-600">{calculateOverallProgress()}% Complete</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Progress */}
                  <div>
                    <Progress value={calculateOverallProgress()} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Expected Delivery: {selectedOrderData.expected_delivery_date
                        ? format(new Date(selectedOrderData.expected_delivery_date), 'MMM dd, yyyy')
                        : 'TBD'}
                    </p>
                  </div>

                  {/* Stage Timeline */}
                  <div className="space-y-4">
                    {stagesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : stages.map((stage, index) => (
                      <div key={stage.id} className="relative">
                        {index < stages.length - 1 && (
                          <div className="absolute left-[10px] top-[30px] w-0.5 h-[calc(100%+16px)] bg-border" />
                        )}
                        <div className="flex gap-4">
                          <div className="relative z-10 bg-background">
                            {getStageIcon(stage.status)}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{stage.stage_name}</h4>
                              <Badge variant="outline">{stage.completion_percentage}%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                            <Progress value={stage.completion_percentage} className="h-2 mb-2" />
                            {stage.started_at && (
                              <p className="text-xs text-muted-foreground">
                                Started: {format(new Date(stage.started_at), 'MMM dd, yyyy')}
                              </p>
                            )}
                            {stage.completed_at && (
                              <p className="text-xs text-green-600">
                                Completed: {format(new Date(stage.completed_at), 'MMM dd, yyyy')}
                              </p>
                            )}
                            {stage.notes && (
                              <p className="text-sm mt-2 p-2 bg-secondary rounded">{stage.notes}</p>
                            )}
                            {stage.photos && stage.photos.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {stage.photos.map((photo, i) => (
                                  <img
                                    key={i}
                                    src={photo}
                                    alt={`Stage ${stage.stage_name}`}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
