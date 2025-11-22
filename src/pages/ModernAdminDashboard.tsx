import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  AlertCircle, 
  LayoutGrid, 
  CheckCircle, 
  Edit, 
  Shield,
  Loader2,
  Sparkles,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierAnalyticsCard } from "@/components/admin/SupplierAnalyticsCard";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { SupplierAssignmentDialog } from "@/components/admin/SupplierAssignmentDialog";
import { OrderStatusBoard } from "@/components/admin/OrderStatusBoard";
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog";
import { QuoteApprovalPanel } from "@/components/admin/QuoteApprovalPanel";
import type { Order } from "@/types/database";
import { useAdminStats, useNewOrders, orderKeys } from "@/hooks/queries";
import { SmartSupplierAssignment } from "@/components/admin/SmartSupplierAssignment";
import { AutomationRulesManager } from "@/components/admin/AutomationRulesManager";
import { EnhancedCMSPanel } from "@/components/admin/EnhancedCMSPanel";
import { ProductDescriptionGenerator } from "@/components/admin/ProductDescriptionGenerator";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { RateLimitMonitoringDashboard } from "@/components/admin/RateLimitMonitoringDashboard";
import { pageTransition, staggerContainer, staggerItem, hoverLift, slideInBottom, fadeIn } from '@/lib/animations';
import { Helmet } from 'react-helmet';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'info';
  badge?: {
    text: string;
    variant: 'default' | 'destructive' | 'secondary';
  };
}

const ModernStatCard = ({ title, value, subtitle, icon, trend, color, badge }: StatCardProps) => {
  const colorClasses = {
    primary: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-600',
    success: 'from-green-500/10 to-green-600/10 border-green-500/20 text-green-600',
    warning: 'from-orange-500/10 to-orange-600/10 border-orange-500/20 text-orange-600',
    info: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-600',
  };

  return (
    <motion.div variants={staggerItem} whileHover={hoverLift}>
      <Card className={`bg-gradient-to-br ${colorClasses[color]} border overflow-hidden relative group`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            {badge && (
              <Badge variant={badge.variant} className="text-xs">
                {badge.text}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">{value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{subtitle}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Decorative gradient orb */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </Card>
    </motion.div>
  );
};

export default function ModernAdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, loading } = useAdminAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  
  // Use React Query hooks
  const { data: stats } = useAdminStats();
  const { data: newOrders = [] } = useNewOrders();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  // Calculate trends (mock data - replace with real calculations)
  const trends = {
    orders: { value: 12, isPositive: true },
    revenue: { value: 8, isPositive: true },
    suppliers: { value: 5, isPositive: true },
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Sleek Apparels</title>
        <meta name="description" content="Manage your operations, suppliers, and orders with powerful admin tools" />
      </Helmet>
      
      <Navbar />
      
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-16"
        initial="hidden"
        animate="visible"
        variants={pageTransition}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Manage your operations and supplier network
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Insights
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            <ModernStatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              subtitle="Active orders"
              icon={<Package className="h-4 w-4" />}
              trend={trends.orders}
              color="primary"
            />
            
            <ModernStatCard
              title="New Orders"
              value={newOrders?.length || 0}
              subtitle="Awaiting assignment"
              icon={<Bell className="h-4 w-4" />}
              color="warning"
              badge={
                (newOrders?.length || 0) > 0
                  ? { text: 'Action Needed', variant: 'destructive' }
                  : undefined
              }
            />
            
            <ModernStatCard
              title="Suppliers"
              value={stats?.verifiedSuppliers || 0}
              subtitle="Verified suppliers"
              icon={<Users className="h-4 w-4" />}
              trend={trends.suppliers}
              color="success"
            />
            
            <ModernStatCard
              title="Revenue"
              value={`$${Math.round(stats?.totalRevenue || 0).toLocaleString()}`}
              subtitle="Total revenue"
              icon={<DollarSign className="h-4 w-4" />}
              trend={trends.revenue}
              color="info"
            />
          </motion.div>

          {/* Quick Actions Bar */}
          <motion.div variants={slideInBottom} className="mb-8">
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/10">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-medium">Quick Actions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/analytics">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/suppliers">
                        <Users className="h-4 w-4 mr-2" />
                        Suppliers
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/dashboard">
                        <Package className="h-4 w-4 mr-2" />
                        Orders
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div variants={fadeIn}>
            <Tabs defaultValue="board" className="space-y-6">
              <TabsList className="bg-card border">
                <TabsTrigger value="board" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <LayoutGrid className="h-4 w-4" />
                  Order Board
                </TabsTrigger>
                <TabsTrigger value="queue" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Bell className="h-4 w-4" />
                  New Orders
                  {newOrders && newOrders.length > 0 && (
                    <Badge variant="destructive" className="ml-2">{newOrders.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="quotes" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <DollarSign className="h-4 w-4" />
                  Quotes
                </TabsTrigger>
                <TabsTrigger value="cms" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Edit className="h-4 w-4" />
                  CMS
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Edit className="h-4 w-4" />
                  Blog
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <TrendingUp className="h-4 w-4" />
                  Automation
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Users className="h-4 w-4" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-primary/10">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="board">
                <motion.div variants={fadeIn}>
                  <OrderStatusBoard 
                    onOrderClick={(order) => setSelectedOrderForDetails(order)}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="queue">
                <motion.div variants={fadeIn}>
                  {newOrders && newOrders.length > 0 ? (
                    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                              <AlertCircle className="h-5 w-5 text-orange-500" />
                              New Orders Need Supplier Assignment
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              These orders are awaiting supplier assignment
                            </p>
                          </div>
                          <Badge variant="destructive" className="text-lg px-3 py-1">
                            {newOrders.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {newOrders.map((order: any, index: number) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                      <Package className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-lg">Order #{order.order_number}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {order.quantity} × {order.product_type}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        Buyer: {order.profiles?.full_name || order.profiles?.email || 'Unknown'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => setSelectedOrder(order)}
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Assign Manually
                                </Button>
                              </div>
                              <SmartSupplierAssignment 
                                orderId={order.id}
                                productType={order.product_type}
                                quantity={order.quantity}
                                requirements={order.notes}
                                onSupplierSelected={(supplierId) => {
                                  queryClient.invalidateQueries({ queryKey: orderKeys.new() });
                                  queryClient.invalidateQueries({ queryKey: orderKeys.all });
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
                      <CardContent className="py-12 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                        <p className="text-muted-foreground">No new orders awaiting supplier assignment</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="quotes">
                <motion.div variants={fadeIn}>
                  <QuoteApprovalPanel />
                </motion.div>
              </TabsContent>

              <TabsContent value="cms">
                <motion.div variants={fadeIn} className="space-y-6">
                  <EnhancedCMSPanel />
                  <ProductDescriptionGenerator />
                </motion.div>
              </TabsContent>

              <TabsContent value="blog">
                <motion.div variants={fadeIn}>
                  <BlogEditor />
                </motion.div>
              </TabsContent>

              <TabsContent value="automation">
                <motion.div variants={fadeIn}>
                  <AutomationRulesManager />
                </motion.div>
              </TabsContent>

              <TabsContent value="suppliers">
                <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2">
                  <SupplierAnalyticsCard />

                  <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Management Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button asChild className="w-full justify-start h-12 text-base" variant="outline">
                        <Link to="/admin/suppliers">
                          <Users className="mr-2 h-5 w-5" />
                          Manage Suppliers
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                        <Link to="/admin/analytics">
                          <TrendingUp className="mr-2 h-5 w-5" />
                          View Analytics
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                        <Link to="/dashboard">
                          <Package className="mr-2 h-5 w-5" />
                          View Orders
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="security">
                <motion.div variants={fadeIn}>
                  <RateLimitMonitoringDashboard />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
      
      <Footer />
      
      {/* Supplier Assignment Dialog */}
      {selectedOrder && (
        <SupplierAssignmentDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          onSuccess={() => {
            setSelectedOrder(null);
            queryClient.invalidateQueries({ queryKey: orderKeys.new() });
            queryClient.invalidateQueries({ queryKey: orderKeys.adminStats() });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
          }}
        />
      )}

      {/* Order Details Dialog */}
      {selectedOrderForDetails && (
        <OrderDetailsDialog
          order={selectedOrderForDetails}
          open={!!selectedOrderForDetails}
          onOpenChange={(open) => !open && setSelectedOrderForDetails(null)}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.new() });
          }}
        />
      )}
    </>
  );
}
