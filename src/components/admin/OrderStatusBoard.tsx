import { useState } from 'react';
import { useAllOrders } from '@/hooks/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Order } from '@/types/database';

const statusConfig = {
  quote_requested: {
    label: 'Quote Requested',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  quote_sent: {
    label: 'Quote Sent',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  quote_approved: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  supplier_assigned: {
    label: 'Assigned',
    icon: Package,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  in_production: {
    label: 'In Production',
    icon: Package,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  quality_check: {
    label: 'QC',
    icon: CheckCircle,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

interface OrderCardProps {
  order: Order;
  onOrderClick: (order: Order) => void;
}

function OrderCard({ order, onOrderClick }: OrderCardProps) {
  return (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: 'hsl(var(--primary))' }}
      onClick={() => onOrderClick(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="font-semibold text-sm">#{order.order_number}</div>
            <div className="text-xs text-muted-foreground">{order.product_type}</div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {order.quantity} units
          </Badge>
        </div>
        
        <div className="space-y-1 text-xs text-muted-foreground">
          {order.buyer_price && (
            <div>Price: ${order.buyer_price.toLocaleString()}</div>
          )}
          {order.target_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due: {new Date(order.target_date).toLocaleDateString()}
            </div>
          )}
          {order.created_at && (
            <div className="text-xs text-muted-foreground/70">
              Created {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </div>
          )}
        </div>

        {order.supplier_id && (
          <Badge variant="outline" className="mt-2 text-xs">
            Supplier Assigned
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusColumnProps {
  status: string;
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

function StatusColumn({ status, orders, onOrderClick }: StatusColumnProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config?.icon || Package;

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {config?.label || status}
            </div>
            <Badge variant="secondary">{orders.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-16rem)] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No orders
            </div>
          ) : (
            orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onOrderClick={onOrderClick}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface OrderStatusBoardProps {
  onOrderClick: (order: Order) => void;
}

export function OrderStatusBoard({ onOrderClick }: OrderStatusBoardProps) {
  const { data: orders = [], isLoading } = useAllOrders();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter orders by search term
  const filteredOrders = (orders || []).filter((order: Order) =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group orders by workflow status
  const ordersByStatus = filteredOrders.reduce((acc: Record<string, Order[]>, order: Order) => {
    const status = order.workflow_status || 'quote_requested';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {});

  // Define the order of columns
  const columnOrder = [
    'quote_requested',
    'quote_sent', 
    'quote_approved',
    'supplier_assigned',
    'in_production',
    'quality_check',
    'completed',
    'shipped',
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Pipeline</h2>
          <p className="text-muted-foreground text-sm">
            {filteredOrders.length} orders across all stages
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md w-64"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnOrder.map(status => (
          <StatusColumn
            key={status}
            status={status}
            orders={ordersByStatus[status] || []}
            onOrderClick={onOrderClick}
          />
        ))}
      </div>
    </div>
  );
}
