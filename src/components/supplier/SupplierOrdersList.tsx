import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { SupplierOrderDetailModal } from "./SupplierOrderDetailModal";
import { useSupplierOrders } from "@/hooks/useSupplierOrders";

interface SupplierOrdersListProps {
  supplierId: string;
}

export const SupplierOrdersList = ({ supplierId }: SupplierOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { orders, loading, fetchOrders } = useSupplierOrders(supplierId);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      pending: { color: 'secondary', icon: Clock },
      accepted: { color: 'default', icon: CheckCircle },
      rejected: { color: 'destructive', icon: XCircle },
      counter_offered: { color: 'outline', icon: DollarSign },
      in_progress: { color: 'default', icon: Package },
      completed: { color: 'default', icon: CheckCircle },
    };

    const config = configs[status] || { color: 'outline', icon: Package };
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const filterOrders = (filter: string) => {
    switch (filter) {
      case 'pending':
        return orders.filter(o => o.acceptance_status === 'pending');
      case 'active':
        return orders.filter(o => 
          o.acceptance_status === 'accepted' && 
          o.status !== 'completed'
        );
      case 'completed':
        return orders.filter(o => o.status === 'completed');
      default:
        return orders;
    }
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleOrderClick(order)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{order.order_number}</h3>
              {getStatusBadge(order.acceptance_status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Product</p>
                <p className="font-medium">{order.product_type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium">{order.quantity} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium text-green-600">
                  ${order.supplier_price?.toFixed(2) || 'TBD'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Date</p>
                <p className="font-medium">{order.target_date || 'Not set'}</p>
              </div>
            </div>

            {order.buyer_order?.buyer && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Buyer</p>
                <p className="text-sm font-medium">
                  {order.buyer_order.buyer.company_name || order.buyer_order.buyer.full_name}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOrderClick(order);
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterOrders('pending').length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({filterOrders('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterOrders('completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground">
                  You'll see orders here once they're assigned to you
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterOrders('pending').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filterOrders('active').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterOrders('completed').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>

      {selectedOrder && (
        <SupplierOrderDetailModal
          order={selectedOrder}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onUpdate={fetchOrders}
        />
      )}
    </>
  );
};
