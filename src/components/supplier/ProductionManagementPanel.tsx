import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ProductionStage {
  id: string;
  stage_name: string;
  stage_number: number;
  description: string;
  status: string;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  target_date: string | null;
  notes: string | null;
  photos: string[];
}

interface SupplierOrder {
  id: string;
  order_id: string;
  status: string;
  orders: {
    order_number: string;
    product_type: string;
    quantity: number;
  };
}

export const ProductionManagementPanel = ({ supplierId }: { supplierId: string }) => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [stages, setStages] = useState<ProductionStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [supplierId]);

  useEffect(() => {
    if (selectedOrder) {
      fetchProductionStages(selectedOrder);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch supplier orders
      const { data: supplierOrdersData, error } = await supabase
        .from('supplier_orders')
        .select('id, buyer_order_id, status, product_type, quantity')
        .eq('supplier_id', supplierId)
        .in('status', ['accepted', 'in_production'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch order details separately
      const ordersWithDetails = await Promise.all(
        (supplierOrdersData || []).map(async (so) => {
          const { data: orderData } = await supabase
            .from('orders')
            .select('order_number')
            .eq('id', so.buyer_order_id)
            .maybeSingle();

          return {
            id: so.id,
            order_id: so.buyer_order_id,
            status: so.status,
            orders: {
              order_number: orderData?.order_number || 'N/A',
              product_type: so.product_type || 'Unknown',
              quantity: so.quantity || 0
            }
          };
        })
      );

      setOrders(ordersWithDetails as any);
      if (ordersWithDetails.length > 0) {
        setSelectedOrder(ordersWithDetails[0].id);
      }
    } catch (error: any) {
      toast.error(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductionStages = async (supplierOrderId: string) => {
    try {
      const { data, error } = await supabase
        .from('production_stages')
        .select('*')
        .eq('supplier_order_id', supplierOrderId)
        .order('stage_number', { ascending: true });

      if (error) throw error;
      
      // If no stages exist, initialize them
      if (!data || data.length === 0) {
        const selectedOrderData = orders.find(o => o.id === supplierOrderId);
        if (selectedOrderData) {
          await initializeProductionStages(supplierOrderId, selectedOrderData.orders.product_type);
          // Fetch again after initialization
          const { data: newData } = await supabase
            .from('production_stages')
            .select('*')
            .eq('supplier_order_id', supplierOrderId)
            .order('stage_number', { ascending: true });
          setStages(newData || []);
        }
      } else {
        setStages(data);
      }
    } catch (error: any) {
      console.error('Error fetching stages:', error);
    }
  };

  const initializeProductionStages = async (supplierOrderId: string, productType: string) => {
    try {
      console.log('Initializing production stages...');
      const { data, error } = await supabase.functions.invoke('initialize-production-stages', {
        body: { supplier_order_id: supplierOrderId, product_type: productType }
      });

      if (error) throw error;
      console.log('Production stages initialized:', data);
      toast.success('Production stages initialized');
    } catch (error: any) {
      console.error('Error initializing stages:', error);
      toast.error('Failed to initialize production stages');
    }
  };

  const updateStageProgress = async (stageId: string, percentage: number, notes: string) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('production_stages')
        .update({
          completion_percentage: percentage,
          notes,
          status: percentage === 100 ? 'completed' : percentage > 0 ? 'in_progress' : 'not_started',
          ...(percentage > 0 && { started_at: new Date().toISOString() }),
          ...(percentage === 100 && { completed_at: new Date().toISOString() })
        })
        .eq('id', stageId);

      if (error) throw error;

      toast.success("Stage updated successfully");
      if (selectedOrder) fetchProductionStages(selectedOrder);
    } catch (error: any) {
      toast.error(`Failed to update stage: ${error.message}`);
    } finally {
      setUpdating(false);
    }
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
        <h2 className="text-2xl font-bold">Production Management</h2>
        <p className="text-muted-foreground">Manage and update production stages</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No active production orders</h3>
            <p className="text-muted-foreground">Orders will appear here once accepted</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedOrder === order.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="font-semibold">#{order.orders.order_number}</div>
                    <div className="text-sm opacity-90">{order.orders.product_type}</div>
                    <div className="text-xs opacity-75">{order.orders.quantity} pcs</div>
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
                  <CardTitle>Production Stages</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Order #{selectedOrderData.orders.order_number}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stages.map((stage) => (
                    <StageUpdateCard
                      key={stage.id}
                      stage={stage}
                      onUpdate={(percentage, notes) => updateStageProgress(stage.id, percentage, notes)}
                      updating={updating}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StageUpdateCard = ({ 
  stage, 
  onUpdate, 
  updating 
}: { 
  stage: ProductionStage; 
  onUpdate: (percentage: number, notes: string) => void;
  updating: boolean;
}) => {
  const [percentage, setPercentage] = useState(stage.completion_percentage);
  const [notes, setNotes] = useState(stage.notes || "");

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{stage.stage_name}</h4>
          <p className="text-sm text-muted-foreground">{stage.description}</p>
        </div>
        <Badge variant={stage.status === 'completed' ? 'default' : 'secondary'}>
          {stage.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
          {stage.status}
        </Badge>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="grid gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Completion %</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add production notes..."
            rows={2}
          />
        </div>
        <Button
          onClick={() => onUpdate(percentage, notes)}
          disabled={updating}
          size="sm"
        >
          {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Update Stage
        </Button>
      </div>

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
    </div>
  );
};
