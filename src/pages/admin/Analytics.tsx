import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Fetch suppliers
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*');

      if (suppliersError) throw suppliersError;

      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.buyer_price || 0), 0) || 0;
      const totalMargin = orders?.reduce((sum, o) => sum + (o.admin_margin || 0), 0) || 0;
      const avgMarginPercent = orders?.length > 0
        ? orders.reduce((sum, o) => sum + (o.margin_percentage || 0), 0) / orders.length
        : 0;

      // Status distribution
      const statusDist = orders?.reduce((acc: any, o) => {
        const status = o.workflow_status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.entries(statusDist || {}).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value,
      }));

      // Monthly revenue trend (mock data)
      const monthlyData = [
        { month: 'Jan', revenue: 45000, orders: 12 },
        { month: 'Feb', revenue: 52000, orders: 15 },
        { month: 'Mar', revenue: 48000, orders: 14 },
        { month: 'Apr', revenue: 61000, orders: 18 },
        { month: 'May', revenue: 55000, orders: 16 },
        { month: 'Jun', revenue: 67000, orders: 20 },
      ];

      setMetrics({
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalMargin,
        avgMarginPercent,
        activeSuppliers: suppliers?.filter(s => s.verification_status === 'verified').length || 0,
        statusData,
        monthlyData,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track business performance and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(metrics?.totalRevenue || 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${(metrics?.totalMargin || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics?.activeSuppliers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="orders">Order Status</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue & Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics?.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics?.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics?.statusData?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
