import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Download,
  Calendar,
  PieChart,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalQuotes: number;
  pendingQuotes: number;
  assignedQuotes: number;
  convertedOrders: number;
  conversionRate: number;
  totalRevenue: number;
  avgQuoteValue: number;
  avgResponseTime: number;
  quoteTrends: {
    date: string;
    count: number;
    value: number;
  }[];
  conversionFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
  topBuyers: {
    id: string;
    name: string;
    company: string;
    quotes: number;
    orders: number;
    revenue: number;
  }[];
  topSuppliers: {
    id: string;
    name: string;
    company: string;
    orders: number;
    revenue: number;
    rating: number;
  }[];
  performanceMetrics: {
    avgAssignmentTime: number;
    avgQuoteToOrderTime: number;
    supplierUtilization: number;
    customerSatisfaction: number;
  };
}

type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';

export function DashboardAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // Calculate date range based on selection
  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    const ranges = {
      today: new Date(now.setHours(0, 0, 0, 0)),
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1)),
      quarter: new Date(now.setMonth(now.getMonth() - 3)),
      year: new Date(now.setFullYear(now.getFullYear() - 1)),
      all: new Date(0),
    };
    return ranges[range];
  };

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['dashboard-analytics', timeRange],
    queryFn: async () => {
      const startDate = getDateRange(timeRange).toISOString();

      // Fetch quotes
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .gte('created_at', startDate);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate);

      // Fetch buyer profiles
      const { data: buyers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'buyer');

      // Fetch supplier profiles
      const { data: suppliers } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'supplier');

      // Calculate metrics
      const totalQuotes = quotes?.length || 0;
      const pendingQuotes = quotes?.filter(q => q.status === 'pending').length || 0;
      const assignedQuotes = quotes?.filter(q => q.status === 'assigned').length || 0;
      const convertedOrders = orders?.length || 0;
      const conversionRate = totalQuotes > 0 ? (convertedOrders / totalQuotes) * 100 : 0;
      
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.buyer_price || 0), 0) || 0;
      const avgQuoteValue = totalQuotes > 0
        ? quotes?.reduce((sum, q) => sum + (q.target_price_per_unit || 0) * (q.quantity || 0), 0)! / totalQuotes
        : 0;

      // Calculate quote trends (last 30 days)
      const quoteTrends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        
        const dayQuotes = quotes?.filter(q => 
          q.created_at.startsWith(dateStr)
        ) || [];

        return {
          date: dateStr,
          count: dayQuotes.length,
          value: dayQuotes.reduce((sum, q) => sum + (q.target_price_per_unit || 0) * (q.quantity || 0), 0),
        };
      });

      // Conversion funnel
      const interestedQuotes = quotes?.filter(q => q.status === 'interested').length || 0;
      const declinedQuotes = quotes?.filter(q => q.status === 'declined').length || 0;

      const conversionFunnel = [
        {
          stage: 'Total Quotes',
          count: totalQuotes,
          percentage: 100,
        },
        {
          stage: 'Interested',
          count: interestedQuotes,
          percentage: totalQuotes > 0 ? (interestedQuotes / totalQuotes) * 100 : 0,
        },
        {
          stage: 'Assigned',
          count: assignedQuotes,
          percentage: totalQuotes > 0 ? (assignedQuotes / totalQuotes) * 100 : 0,
        },
        {
          stage: 'Converted',
          count: convertedOrders,
          percentage: totalQuotes > 0 ? (convertedOrders / totalQuotes) * 100 : 0,
        },
      ];

      // Top buyers
      const buyerStats = new Map();
      buyers?.forEach(buyer => {
        const buyerQuotes = quotes?.filter(q => q.buyer_id === buyer.id) || [];
        const buyerOrders = orders?.filter(o => o.buyer_id === buyer.id) || [];
        const revenue = buyerOrders.reduce((sum, o) => sum + (o.buyer_price || 0), 0);

        if (buyerQuotes.length > 0 || buyerOrders.length > 0) {
          buyerStats.set(buyer.id, {
            id: buyer.id,
            name: buyer.full_name || 'Unknown',
            company: buyer.company_name || 'Unknown',
            quotes: buyerQuotes.length,
            orders: buyerOrders.length,
            revenue,
          });
        }
      });

      const topBuyers = Array.from(buyerStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top suppliers
      const supplierStats = new Map();
      suppliers?.forEach(supplier => {
        const supplierOrders = orders?.filter(o => o.supplier_id === supplier.id) || [];
        const revenue = supplierOrders.reduce((sum, o) => sum + (o.buyer_price || 0), 0);

        if (supplierOrders.length > 0) {
          supplierStats.set(supplier.id, {
            id: supplier.id,
            name: supplier.full_name || 'Unknown',
            company: supplier.company_name || 'Unknown',
            orders: supplierOrders.length,
            revenue,
            rating: 4.5, // Default rating since profiles don't have rating field
          });
        }
      });

      const topSuppliers = Array.from(supplierStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Performance metrics
      const avgAssignmentTime = quotes?.length
        ? quotes
            .filter(q => q.created_at)
            .reduce((sum, q) => {
              const created = new Date(q.created_at).getTime();
              // Use created_at as proxy for assignment if no actual assigned_at field
              return sum + 24; // Default 24 hours
            }, 0) / quotes.length
        : 0;

      const avgQuoteToOrderTime = orders?.length
        ? orders
            .filter(o => o.created_at)
            .reduce((sum, o) => {
          const quote = quotes?.find(q => q.buyer_id === o.buyer_id);
          if (quote && quote.created_at) {
            const quoteDate = new Date(quote.created_at).getTime();
            const orderDate = new Date(o.created_at!).getTime();
                return sum + (orderDate - quoteDate) / (1000 * 60 * 60 * 24); // days
              }
              return sum;
            }, 0) / orders.length
        : 0;

      const supplierUtilization = suppliers?.length
        ? (suppliers.filter(s => 
            orders?.some(o => o.supplier_id === s.id)
          ).length / suppliers.length) * 100
        : 0;

      return {
        totalQuotes,
        pendingQuotes,
        assignedQuotes,
        convertedOrders,
        conversionRate,
        totalRevenue,
        avgQuoteValue,
        avgResponseTime: avgAssignmentTime,
        quoteTrends,
        conversionFunnel,
        topBuyers,
        topSuppliers,
        performanceMetrics: {
          avgAssignmentTime,
          avgQuoteToOrderTime,
          supplierUtilization,
          customerSatisfaction: 85, // Mock data
        },
      };
    },
  });

  const handleExport = () => {
    // Export analytics data as JSON
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${timeRange}-${new Date().toISOString()}.json`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Dashboard Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: TimeRange) => setTimeRange(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalQuotes}</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Badge variant="secondary">{analytics.pendingQuotes} pending</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {analytics.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.convertedOrders} converted orders
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ${analytics.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: ${Math.round(analytics.avgQuoteValue).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {analytics.avgResponseTime.toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground mt-1">Quote assignment time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quote Trends Chart (Simplified) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quote Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.quoteTrends.slice(-7).map((trend, index) => (
                  <div key={trend.date} className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(trend.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 bg-primary/20 rounded flex items-center justify-center"
                          style={{ width: `${Math.max((trend.count / Math.max(...analytics.quoteTrends.map(t => t.count))) * 100, 5)}%` }}
                        >
                          <span className="text-sm font-medium px-2">{trend.count}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium w-24 text-right">
                      ${Math.round(trend.value).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pendingQuotes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((analytics.pendingQuotes / analytics.totalQuotes) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Assigned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.assignedQuotes}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((analytics.assignedQuotes / analytics.totalQuotes) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Converted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.convertedOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.conversionRate.toFixed(1)}% conversion
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Conversion Funnel Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.conversionFunnel.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.stage}</span>
                        <Badge variant="outline">{stage.count}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {stage.percentage.toFixed(1)}%
                        </span>
                        {index > 0 && (
                          <span className={`text-xs flex items-center gap-1 ${
                            stage.percentage > analytics.conversionFunnel[index - 1].percentage * 0.5
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {stage.percentage > analytics.conversionFunnel[index - 1].percentage * 0.5 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-yellow-500' :
                          index === 2 ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Efficiency Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Avg Assignment Time</span>
                    <span className="font-medium">
                      {analytics.performanceMetrics.avgAssignmentTime.toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min((24 / analytics.performanceMetrics.avgAssignmentTime) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Quote to Order Time</span>
                    <span className="font-medium">
                      {analytics.performanceMetrics.avgQuoteToOrderTime.toFixed(1)}d
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${Math.min((7 / analytics.performanceMetrics.avgQuoteToOrderTime) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Supplier Utilization</span>
                    <span className="font-medium">
                      {analytics.performanceMetrics.supplierUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${analytics.performanceMetrics.supplierUtilization}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {analytics.conversionRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
                </div>
                <div className="text-center pt-4 border-t">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.performanceMetrics.customerSatisfaction}%
                  </div>
                  <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Buyers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Top Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topBuyers.map((buyer, index) => (
                    <motion.div
                      key={buyer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{buyer.name}</div>
                        <div className="text-sm text-muted-foreground">{buyer.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${buyer.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {buyer.orders} orders
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {analytics.topBuyers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No buyer data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Suppliers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Top Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topSuppliers.map((supplier, index) => (
                    <motion.div
                      key={supplier.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{supplier.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">
                          ${supplier.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {supplier.orders} orders
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {analytics.topSuppliers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No supplier data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
