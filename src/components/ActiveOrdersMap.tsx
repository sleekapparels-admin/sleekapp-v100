import { useEffect, useState } from "react";
import { MapPin, Factory, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProductionStage } from "./ProductionTimeline";

interface ActiveOrder {
  id: string;
  order_number: string;
  product_type: string;
  current_stage: ProductionStage;
  factory: {
    company_name: string;
  } | null;
}

const stageLabels: Record<ProductionStage, string> = {
  yarn_received: "Yarn Received",
  knitting: "Knitting",
  linking: "Linking",
  washing_finishing: "Washing & Finishing",
  final_qc: "Final QC",
  packing: "Packing",
  ready_to_ship: "Ready to Ship",
};

export const ActiveOrdersMap = () => {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, product_type, current_stage, factory_id")
        .eq("buyer_id", user.id)
        .neq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Fetch factory details
      const ordersWithFactory = await Promise.all(
        (data || []).map(async (order) => {
          if (order.factory_id) {
            const { data: factory } = await supabase
              .from("profiles")
              .select("company_name")
              .eq("id", order.factory_id)
              .single();
            return { ...order, factory };
          }
          return { ...order, factory: null };
        })
      );

      setOrders(ordersWithFactory as ActiveOrder[]);
    } catch (error) {
      console.error("Error fetching active orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage: ProductionStage) => {
    if (stage === "ready_to_ship") return Truck;
    return Factory;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Orders Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Orders Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active orders to track</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Orders Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => {
            const StageIcon = getStageIcon(order.current_stage);
            return (
              <div
                key={order.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/orders/${order.id}`}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <StageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {order.order_number}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {order.product_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {order.factory?.company_name || "Factory not assigned"}
                    </span>
                  </div>
                </div>
                <Badge className="text-xs whitespace-nowrap">
                  {stageLabels[order.current_stage]}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
