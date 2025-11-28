import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Package, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Order } from "@/types/database";
import { useOrdersByBuyer, useOrdersByFactory, useAllOrders } from "@/hooks/queries";

interface OrdersListProps {
  role: string;
  userId: string;
}

export const OrdersList = ({ role, userId }: OrdersListProps) => {
  const navigate = useNavigate();
  
  // Select appropriate hook based on role
  const isBuyerRole = ["retailer", "wholesaler", "educational", "corporate", "sports_team"].includes(role);
  const isFactoryRole = role === "factory";
  const isAdminRole = role === "admin";
  
  const buyerQuery = useOrdersByBuyer(isBuyerRole ? userId : '');
  const factoryQuery = useOrdersByFactory(isFactoryRole ? userId : '');
  const adminQuery = useAllOrders();
  
  // Select the active query based on role
  const activeQuery = isBuyerRole ? buyerQuery : isFactoryRole ? factoryQuery : adminQuery;
  const { data: ordersData, isLoading: loading } = activeQuery;
  const orders = ordersData ?? [];

  if (loading) {
    return <p className="text-muted-foreground">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-dashed">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {role === 'admin' || role === 'factory' 
                ? "Orders will appear here once customers place them." 
                : "Start your journey by requesting a quote for your first order. Our AI-powered quote generator will provide instant estimates."}
            </p>
          </div>
          {role !== 'admin' && role !== 'factory' && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/quote-generator")} size="lg">
                Get AI Quote Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate("/portfolio")} size="lg">
                View Portfolio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orders.slice(0, 5).map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-semibold">{order.order_number}</p>
                  <Badge variant="outline" className="text-xs">
                    {order.product_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{order.quantity} pcs</span>
                  {order.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(order.target_date), "MMM dd")}</span>
                    </div>
                  )}
                  <Badge className="text-xs capitalize">
                    {order.current_stage?.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {orders.length > 5 && (
        <Button variant="outline" className="w-full" onClick={() => navigate("/orders")}>
          View All Orders ({orders.length})
        </Button>
      )}
    </div>
  );
};
