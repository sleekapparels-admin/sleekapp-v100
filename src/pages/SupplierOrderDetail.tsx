import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ProductionStageUpdate } from "@/components/supplier/ProductionStageUpdate";
import { OrderMessaging } from "@/components/supplier/OrderMessaging";

export default function SupplierOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get supplier ID for this user
      const { data: supplierData } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!supplierData) {
        toast.error("No supplier profile found");
        navigate("/supplier-dashboard");
        return;
      }

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("supplier_orders")
        .select("*")
        .eq("id", orderId)
        .eq("supplier_id", supplierData.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch production stages
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/supplier-dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{order.order_number}</h1>
                  <p className="text-muted-foreground">Order Details</p>
                </div>
                <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                  {order.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Product Type</p>
                  <p className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {order.product_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p className="font-medium">{order.quantity} pieces</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Target Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {order.target_date ? format(new Date(order.target_date), "PPP") : "TBD"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Amount</p>
                  <p className="font-medium">
                    {order.supplier_price ? `$${parseFloat(order.supplier_price).toFixed(2)}` : "TBD"}
                  </p>
                </div>
              </div>

              {order.special_instructions && (
                <div className="mt-6 bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Special Instructions</p>
                  <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Overall Progress</h3>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-primary">{overallProgress.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {completedStages} of {stages.length} stages completed
                </p>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </Card>
          </div>

          <Tabs defaultValue="stages" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stages">Production Stages</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="stages">
              <div className="space-y-4">
                {stages.map((stage) => (
                  <ProductionStageUpdate
                    key={stage.id}
                    stage={stage}
                    onUpdate={fetchOrderDetails}
                  />
                ))}
                {stages.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No production stages defined yet. Contact admin for setup.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <OrderMessaging orderId={orderId!} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}