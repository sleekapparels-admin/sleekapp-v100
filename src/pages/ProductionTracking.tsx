import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Truck,
  Camera,
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  Bell
} from "lucide-react";
import { ProductionStageTimeline } from "@/components/production/ProductionStageTimeline";
import { ProductionStageCard } from "@/components/production/ProductionStageCard";
import { PredictiveDelayAlert } from "@/components/production/PredictiveDelayAlert";
import { SupplierCoordinationPanel } from "@/components/production/SupplierCoordinationPanel";
import { ProductionAnalytics } from "@/components/production/ProductionAnalytics";

// Production stages for RMG manufacturing
const PRODUCTION_STAGES = [
  { number: 1, name: "Order Confirmation", icon: CheckCircle2, color: "text-blue-500" },
  { number: 2, name: "Fabric Sourcing", icon: Package, color: "text-purple-500" },
  { number: 3, name: "Accessories Procurement", icon: Package, color: "text-pink-500" },
  { number: 4, name: "Cutting & Pattern Making", icon: Activity, color: "text-orange-500" },
  { number: 5, name: "Sewing & Assembly", icon: Activity, color: "text-green-500" },
  { number: 6, name: "Quality Control", icon: CheckCircle2, color: "text-teal-500" },
  { number: 7, name: "Finishing & Packaging", icon: Package, color: "text-indigo-500" },
  { number: 8, name: "Shipment & Delivery", icon: Truck, color: "text-red-500" }
];

const ProductionTracking = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndOrders();
  }, []);

  const fetchUserAndOrders = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Get user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setUserRole(roleData?.role || null);

        // Fetch orders based on role
        if (roleData?.role === 'admin') {
          // Admin/Staff: See all orders
          await fetchAllOrders();
        } else if (roleData?.role === 'supplier') {
          // Supplier: See their assigned orders
          await fetchSupplierOrders(session.user.id);
        } else {
          // Buyer: See their own orders
          await fetchBuyerOrders(session.user.email!);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load production data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    const { data, error } = await supabase
      .from('supplier_orders')
      .select(`
        *,
        production_stages(*),
        suppliers(company_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setOrders(data || []);
    if (data && data.length > 0) setSelectedOrder(data[0]);
  };

  const fetchSupplierOrders = async (userId: string) => {
    const { data: supplierData } = await supabase
      .from('suppliers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (supplierData) {
      const { data, error } = await supabase
        .from('supplier_orders')
        .select(`
          *,
          production_stages(*),
          suppliers(company_name)
        `)
        .eq('supplier_id', supplierData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      if (data && data.length > 0) setSelectedOrder(data[0]);
    }
  };

  const fetchBuyerOrders = async (email: string) => {
    // @ts-ignore - Complex Supabase type causes instantiation depth error
    const response = await supabase
      .from('supplier_orders')
      .select('*')
      .eq('buyer_email', email)
      .order('created_at', { ascending: false });
    
    const { data, error } = response;

    if (error) throw error;
    setOrders(data || []);
    if (data && data.length > 0) setSelectedOrder(data[0]);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const colors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default',
      delayed: 'destructive',
      cancelled: 'destructive'
    };
    return colors[status.toLowerCase()] || 'secondary';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading production data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-4xl mx-auto px-4 text-center py-20">
          <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access production tracking
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEO 
        config={{
          title: "Production Tracking | LoopTrace™ Technology",
          description: "Real-time production tracking with AI-powered insights. Track your orders across all manufacturing stages.",
          canonical: "/production-tracking"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Production Tracking</h1>
                <Badge variant="secondary" className="ml-2">
                  LoopTrace™ Technology
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Real-time visibility into your manufacturing pipeline
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'in_progress').length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Delayed</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'delayed').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('in_progress')}
                  size="sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={filterStatus === 'delayed' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('delayed')}
                  size="sm"
                >
                  Delayed
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders List */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Your Orders</h3>
                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      className={`cursor-pointer transition-all ${
                        selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">{order.product_name}</p>
                          </div>
                          <Badge variant={getStatusBadge(order.status)}>
                            {order.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>{order.quantity} pieces</span>
                        </div>
                        {order.suppliers && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Supplier: {order.suppliers.company_name}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Order Details */}
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="stages">Stages</TabsTrigger>
                      <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="space-y-4">
                      <ProductionStageTimeline 
                        orderId={selectedOrder.id}
                        stages={selectedOrder.production_stages || []}
                      />
                    </TabsContent>

                    <TabsContent value="stages" className="space-y-4">
                      {PRODUCTION_STAGES.map((stage) => {
                        const stageData = selectedOrder.production_stages?.find(
                          (s: any) => s.stage_number === stage.number
                        );
                        return (
                          <ProductionStageCard
                            key={stage.number}
                            stage={stage}
                            data={stageData}
                            orderId={selectedOrder.id}
                            userRole={userRole}
                          />
                        );
                      })}
                    </TabsContent>

                    <TabsContent value="suppliers" className="space-y-4">
                      <SupplierCoordinationPanel 
                        orderId={selectedOrder.id}
                        supplierId={selectedOrder.supplier_id}
                      />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                      <ProductionAnalytics 
                        orderId={selectedOrder.id}
                        stages={selectedOrder.production_stages || []}
                      />
                      <PredictiveDelayAlert 
                        orderId={selectedOrder.id}
                        stages={selectedOrder.production_stages || []}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Select an order to view production details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default ProductionTracking;
