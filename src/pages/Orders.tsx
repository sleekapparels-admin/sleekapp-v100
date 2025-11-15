import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { OrderIcon, CalendarIcon } from "@/components/CustomIcons";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  product_type: string;
  quantity: number;
  status: string;
  target_date: string | null;
  created_at: string;
}

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRole();
    fetchOrders();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data) setUserRole(data.role);
    } catch (error) {
      console.error("Error fetching role:", error);
      toast({
        title: "Error",
        description: "Failed to load user role",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      let query = supabase.from("orders").select("*");

      // Filter based on role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleData) {
        if (["retailer", "wholesaler", "educational", "corporate", "sports_team"].includes(roleData.role)) {
          query = query.eq("buyer_id", user.id);
        } else if (roleData.role === "factory") {
          query = query.eq("factory_id", user.id);
        }
        // admin sees all orders (no filter)
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">All Orders</h1>
          <p className="text-muted-foreground">
            {['retailer', 'wholesaler', 'educational', 'corporate', 'sports_team'].includes(userRole || '') ? 'Your orders' : 
             userRole === 'factory' ? 'Assigned orders' : 
             'All orders in the system'}
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <OrderIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {['retailer', 'wholesaler', 'educational', 'corporate', 'sports_team'].includes(userRole || '') 
                  ? "You haven't placed any orders yet." 
                  : userRole === 'factory' 
                    ? "You don't have any assigned orders." 
                    : "There are no orders in the system."}
              </p>
              {['retailer', 'wholesaler', 'educational', 'corporate', 'sports_team'].includes(userRole || '') && (
                <Button onClick={() => navigate("/dashboard")}>
                  Create New Order
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <OrderIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">{order.order_number}</h3>
                        <Badge variant="outline">{order.product_type}</Badge>
                        <Badge>{order.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity} pcs</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">
                            {format(new Date(order.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        {order.target_date && (
                          <div>
                            <p className="text-muted-foreground">Target Date</p>
                            <p className="font-medium">
                              {format(new Date(order.target_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}