import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Users, TrendingUp, DollarSign, Bell, AlertCircle, LayoutGrid, CheckCircle, Edit, Shield } from "lucide-react";
import { SupplierAnalyticsCard } from "@/components/admin/SupplierAnalyticsCard";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SupplierAssignmentDialog } from "@/components/admin/SupplierAssignmentDialog";
import { OrderStatusBoard } from "@/components/admin/OrderStatusBoard";
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog";
import { QuoteApprovalPanel } from "@/components/admin/QuoteApprovalPanel";
import { CMSManagementPanel } from "@/components/admin/CMSManagementPanel";
import type { Order } from "@/types/database";
import { useAdminStats, useNewOrders, orderKeys } from "@/hooks/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSupplierAssignment } from "@/components/admin/SmartSupplierAssignment";
import { AutomationRulesManager } from "@/components/admin/AutomationRulesManager";
import { EnhancedCMSPanel } from "@/components/admin/EnhancedCMSPanel";
import { ProductDescriptionGenerator } from "@/components/admin/ProductDescriptionGenerator";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { RateLimitMonitoringDashboard } from "@/components/admin/RateLimitMonitoringDashboard";

export default function AdminDashboard() {
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your operations and supplier network</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Active orders</p>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    New Orders
                  </div>
                  {(newOrders?.length || 0) > 0 && (
                    <Badge variant="destructive">{newOrders?.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{newOrders?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.verifiedSuppliers || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Verified suppliers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${Math.round(stats?.totalRevenue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="board" className="space-y-6">
            <TabsList>
              <TabsTrigger value="board" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Order Board
              </TabsTrigger>
              <TabsTrigger value="queue" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                New Orders Queue
                {newOrders && newOrders.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{newOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Quote Approval
              </TabsTrigger>
              <TabsTrigger value="cms" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                CMS
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board">
              <OrderStatusBoard 
                onOrderClick={(order) => setSelectedOrderForDetails(order)}
              />
            </TabsContent>

            <TabsContent value="queue">
              {newOrders && newOrders.length > 0 ? (
            <Card className="mb-8 border-orange-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
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
                   {newOrders.map((order: any) => (
                    <div key={order.id} className="space-y-4 p-4 bg-secondary/50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold">Order #{order.order_number}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.quantity} × {order.product_type}
                              </div>
                              <div className="text-sm text-muted-foreground">
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
                          // Refresh data after supplier assignment
                          queryClient.invalidateQueries({ queryKey: orderKeys.new() });
                          queryClient.invalidateQueries({ queryKey: orderKeys.all });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">No new orders awaiting supplier assignment</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quotes">
              <QuoteApprovalPanel />
            </TabsContent>

            <TabsContent value="cms">
              <div className="space-y-6">
                <EnhancedCMSPanel />
                <ProductDescriptionGenerator />
              </div>
            </TabsContent>

            <TabsContent value="blog">
              <BlogEditor />
            </TabsContent>

            <TabsContent value="automation">
              <AutomationRulesManager />
            </TabsContent>

            <TabsContent value="suppliers">
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <SupplierAnalyticsCard />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/admin/suppliers">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Suppliers
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/dashboard">
                    <Package className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </Button>
              </CardContent>
            </Card>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <RateLimitMonitoringDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
      
      {/* Supplier Assignment Dialog */}
      {selectedOrder && (
        <SupplierAssignmentDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          onSuccess={() => {
            setSelectedOrder(null);
            // Invalidate queries to trigger refetch
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
