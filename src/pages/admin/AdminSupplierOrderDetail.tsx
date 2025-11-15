import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Package, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AdminStageMonitor } from "@/components/admin/AdminStageMonitor";
import { OrderMessaging } from "@/components/supplier/OrderMessaging";
import { PerformanceReviewDialog } from "@/components/admin/PerformanceReviewDialog";

export default function AdminSupplierOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [supplier, setSupplier] = useState<any>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("supplier_orders")
        .select(`
          *,
          suppliers (*)
        `)
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);
      setSupplier(orderData.suppliers);

      const { data: stagesData, error: stagesError } = await supabase
        .from("production_stages")
        .select("*")
        .eq("supplier_order_id", orderId)
        .order("stage_number");

      if (stagesError) throw stagesError;
      setStages(stagesData || []);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-muted-foreground">Order not found</p>
          </div>
        </div>
      </>
    );
  }

  const completedStages = stages.filter(s => s.completion_percentage === 100).length;
  const overallProgress = stages.length > 0 ? (completedStages / stages.length) * 100 : 0;
  const margin = order.buyer_price && order.supplier_price ? 
    parseFloat(order.buyer_price) - parseFloat(order.supplier_price) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/supplier-orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <Button onClick={() => setShowReviewDialog(true)}>
              Rate Performance
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Order</p>
              </div>
              <p className="text-2xl font-bold">{order.order_number}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.product_type}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
              <p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
              <Progress value={overallProgress} className="mt-2" />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Margin</p>
              </div>
              <p className="text-2xl font-bold">${margin.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Buyer: ${order.buyer_price || "0"} | Supplier: ${order.supplier_price || "0"}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Target Date</p>
              </div>
              <p className="text-lg font-bold">
                {order.target_date ? format(new Date(order.target_date), "MMM dd") : "TBD"}
              </p>
              <Badge variant="outline" className="mt-2">{order.status}</Badge>
            </Card>
          </div>

          {supplier && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Supplier Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{supplier.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{supplier.factory_location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Performance Score</p>
                  <p className="font-medium">{supplier.performance_score?.toFixed(1) || "N/A"} / 10</p>
                </div>
              </div>
            </Card>
          )}

          <Tabs defaultValue="stages" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stages">LoopTrace™ Monitor</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="stages">
              <AdminStageMonitor stages={stages} onRefresh={fetchOrderDetails} />
            </TabsContent>

            <TabsContent value="messages">
              <OrderMessaging orderId={orderId!} isAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PerformanceReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        order={order}
        supplier={supplier}
        onSuccess={() => {
          setShowReviewDialog(false);
          toast.success("Performance review submitted");
        }}
      />
    </>
  );
}