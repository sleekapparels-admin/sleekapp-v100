import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { OrderMessaging } from "@/components/OrderMessaging";
import { Package, Clock, MapPin, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function BuyerOrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState<any[]>([]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      fetchProductionStages();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      const orderWithSupplier: any = { ...orderData };
      
      // Fetch supplier separately
      if (orderData?.supplier_id) {
        const { data: supplierData } = await supabase
          .from('suppliers')
          .select('company_name, factory_location')
          .eq('id', orderData.supplier_id)
          .single();
          
        if (supplierData) {
          orderWithSupplier.supplier = supplierData;
        }
      }
      
      setOrder(orderWithSupplier);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductionStages = async () => {
    if (!orderId) return;
    
    try {
      // Type assertion workaround for deep instantiation issue
      const response: any = await supabase
        .from('production_stages')
        .select('id, order_id, stage_name, status, started_at, completed_at, completion_percentage, notes, photos, created_at, updated_at');

      if (response.error) throw response.error;
      
      // Filter and sort in JavaScript
      const filtered = (response.data || [])
        .filter((stage: any) => stage.order_id === orderId)
        .sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      
      setStages(filtered);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const overallProgress = stages.length > 0
    ? stages.reduce((sum, s) => sum + s.completion_percentage, 0) / stages.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Order #{order?.order_number}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Track your order progress in real-time
                  </p>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {order?.workflow_status?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{order?.product_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{order?.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{order?.supplier?.company_name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-medium">{order?.expected_delivery_date || 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Production Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{overallProgress.toFixed(0)}%</span>
                <span className="text-sm text-muted-foreground">Complete</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="stages">Production Stages</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-6">
                  <OrderStatusTimeline 
                    currentStatus={order?.workflow_status}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stages">
              <div className="space-y-4">
                {stages.map((stage) => (
                  <Card key={stage.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{stage.stage_name}</h3>
                        <Badge variant={stage.status === 'completed' ? 'default' : 'secondary'}>
                          {stage.status}
                        </Badge>
                      </div>
                      <Progress value={stage.completion_percentage} className="mb-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{stage.completion_percentage}% complete</span>
                        {stage.completed_at && (
                          <span>Completed: {new Date(stage.completed_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      {stage.notes && (
                        <p className="mt-3 text-sm">{stage.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <OrderMessaging orderId={orderId!} currentUserRole="buyer" />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents available yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
