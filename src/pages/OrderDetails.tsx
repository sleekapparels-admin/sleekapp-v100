import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { OrderIcon, CalendarIcon } from "@/components/CustomIcons";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductionTimeline, ProductionStage } from "@/components/ProductionTimeline";
import { ProductionUpdateForm } from "@/components/ProductionUpdateForm";
import { ProductionUpdatesFeed } from "@/components/ProductionUpdatesFeed";
import { QCCheckForm } from "@/components/QCCheckForm";
import { QCChecksList } from "@/components/QCChecksList";
import { AIInsightsCard } from "@/components/AIInsightsCard";
import { format } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  product_type: string;
  quantity: number;
  status: string;
  target_date: string | null;
  notes: string | null;
  created_at: string;
  current_stage: ProductionStage;
  stage_progress: Record<ProductionStage, number>;
  buyer: {
    full_name: string;
    company_name: string;
  };
  factory: {
    full_name: string;
    company_name: string;
  } | null;
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [updates, setUpdates] = useState<any[]>([]);
  const [qcChecks, setQcChecks] = useState<any[]>([]);

  useEffect(() => {
    fetchUserRole();
    if (orderId) {
      fetchOrderDetails();
      fetchUpdatesAndQc();
    }
  }, [orderId, refreshTrigger]);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data) setUserRole(data.role);
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;

      // Fetch buyer profile
      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("full_name, company_name")
        .eq("id", data.buyer_id)
        .single();

      // Fetch factory profile if assigned
      let factoryProfile = null;
      if (data.factory_id) {
        const { data: factory } = await supabase
          .from("profiles")
          .select("full_name, company_name")
          .eq("id", data.factory_id)
          .single();
        factoryProfile = factory;
      }

      setOrder({
        ...data,
        stage_progress: (data.stage_progress as Record<ProductionStage, number>) || {},
        buyer: buyerProfile || { full_name: "Unknown", company_name: "Unknown" },
        factory: factoryProfile,
      } as Order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdatesAndQc = async () => {
    if (!orderId) return;
    
    const { data: updatesData } = await supabase
      .from("order_updates")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    
    const { data: qcData } = await supabase
      .from("qc_checks")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    
    setUpdates(updatesData || []);
    setQcChecks(qcData || []);
  };

  const handleUpdateCreated = () => {
    fetchOrderDetails();
    fetchUpdatesAndQc();
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  const canAddUpdates = userRole === "factory" || userRole === "admin";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order #{order.order_number}</h1>
              <div className="flex items-center gap-2">
                <Badge>{order.status}</Badge>
                <Badge variant="outline">{order.product_type}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <OrderIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Quantity</p>
              </div>
              <p className="text-2xl font-bold">{order.quantity} pcs</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Target Date</p>
              </div>
              <p className="text-2xl font-bold">
                {order.target_date
                  ? format(new Date(order.target_date), "MMM dd, yyyy")
                  : "Not set"}
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Buyer</p>
              </div>
              <p className="font-semibold">{order.buyer.company_name}</p>
              <p className="text-sm text-muted-foreground">{order.buyer.full_name}</p>
            </Card>
          </div>

          {order.notes && (
            <Card className="p-4 mt-4">
              <p className="text-sm font-medium mb-2">Order Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIInsightsCard 
              orderData={order}
              updates={updates || []}
              qcChecks={qcChecks || []}
            />
            
            <ProductionTimeline
              currentStage={order.current_stage}
              stageProgress={order.stage_progress}
            />

            <QCChecksList
              orderId={order.id}
              refreshTrigger={refreshTrigger}
            />

            <ProductionUpdatesFeed
              orderId={order.id}
              refreshTrigger={refreshTrigger}
            />
          </div>

          <div className="space-y-6">
            {canAddUpdates && (
              <>
                <QCCheckForm
                  orderId={order.id}
                  onCheckCreated={handleUpdateCreated}
                />
                <ProductionUpdateForm
                  orderId={order.id}
                  onUpdateCreated={handleUpdateCreated}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
