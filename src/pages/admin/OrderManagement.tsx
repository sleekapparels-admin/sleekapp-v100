import { useState, useEffect } from "react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, UserPlus, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  product_type: string;
  quantity: number;
  workflow_status: string;
  buyer_price: number;
  supplier_price: number;
  admin_margin: number;
  created_at: string;
  buyer_id: string;
  supplier_id: string | null;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      quote_requested: 'secondary',
      quote_sent: 'secondary',
      admin_review: 'outline',
      awaiting_payment: 'destructive',
      payment_received: 'default',
      assigned_to_supplier: 'default',
      bulk_production: 'default',
      completed: 'default',
    };
    return colors[status] || 'outline';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.workflow_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const ordersByTab = {
    pending: filteredOrders.filter(o => o.workflow_status === 'admin_review'),
    awaiting_assignment: filteredOrders.filter(o => 
      o.workflow_status === 'payment_received' && !o.supplier_id
    ),
    in_progress: filteredOrders.filter(o => 
      ['assigned_to_supplier', 'sample_requested', 'sample_submitted', 
       'sample_approved', 'bulk_production', 'qc_inspection', 
       'ready_to_ship', 'shipped'].includes(o.workflow_status)
    ),
    completed: filteredOrders.filter(o => 
      ['delivered', 'completed'].includes(o.workflow_status)
    ),
    all: filteredOrders,
  };

  const stats = {
    total: orders.length,
    pending: ordersByTab.pending.length,
    awaitingAssignment: ordersByTab.awaiting_assignment.length,
    inProgress: ordersByTab.in_progress.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.buyer_price || 0), 0),
    totalMargin: orders.reduce((sum, o) => sum + (o.admin_margin || 0), 0),
  };

  const OrdersTable = ({ orders }: { orders: Order[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Buyer Price</TableHead>
          <TableHead>Margin</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            <TableCell>{order.product_type}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(order.workflow_status) as any}>
                {order.workflow_status.replace(/_/g, ' ')}
              </Badge>
            </TableCell>
            <TableCell className="font-semibold">
              ${order.buyer_price?.toFixed(2) || '-'}
            </TableCell>
            <TableCell className="text-green-600 font-semibold">
              ${order.admin_margin?.toFixed(2) || '-'}
            </TableCell>
            <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDetailModal(true);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage buyer orders, assign suppliers, and track margins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Need Assignment</p>
                  <p className="text-2xl font-bold">{stats.awaitingAssignment}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Margin</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.totalMargin.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="admin_review">Pending Review</SelectItem>
                  <SelectItem value="payment_received">Awaiting Assignment</SelectItem>
                  <SelectItem value="bulk_production">In Production</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pending">
                  Pending ({ordersByTab.pending.length})
                </TabsTrigger>
                <TabsTrigger value="awaiting_assignment">
                  Need Assignment ({ordersByTab.awaiting_assignment.length})
                </TabsTrigger>
                <TabsTrigger value="in_progress">
                  In Progress ({ordersByTab.in_progress.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({ordersByTab.completed.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({ordersByTab.all.length})
                </TabsTrigger>
              </TabsList>

              {(['pending', 'awaiting_assignment', 'in_progress', 'completed', 'all'] as const).map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <OrdersTable orders={ordersByTab[tab]} />
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onUpdate={fetchOrders}
        />
      )}
    </>
  );
}