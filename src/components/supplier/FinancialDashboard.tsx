import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { FinancialChartsEnhanced } from "@/components/admin/FinancialChartsEnhanced";

interface FinancialStats {
  totalEarnings: number;
  pendingPayments: number;
  paidOrders: number;
  pendingOrders: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  order_id: string;
}

export const FinancialDashboard = ({ supplierId }: { supplierId: string }) => {
  const [stats, setStats] = useState<FinancialStats>({
    totalEarnings: 0,
    pendingPayments: 0,
    paidOrders: 0,
    pendingOrders: 0
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, [supplierId]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Fetch supplier orders first
      const { data: supplierOrders, error: ordersError } = await supabase
        .from('supplier_orders')
        .select('id, supplier_price, status')
        .eq('supplier_id', supplierId);

      if (ordersError) throw ordersError;

      const totalEarnings = supplierOrders
        ?.filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.supplier_price || 0), 0) || 0;

      const pendingPayments = supplierOrders
        ?.filter(o => o.status === 'accepted' || o.status === 'in_production')
        .reduce((sum, o) => sum + (o.supplier_price || 0), 0) || 0;

      const paidOrders = supplierOrders?.filter(o => o.status === 'completed').length || 0;
      const pendingOrders = supplierOrders?.filter(o => o.status !== 'completed' && o.status !== 'rejected').length || 0;

      setStats({
        totalEarnings,
        pendingPayments,
        paidOrders,
        pendingOrders
      });

      // Fetch invoices if we have supplier orders
      if (supplierOrders && supplierOrders.length > 0) {
        // Get orders from supplier_orders
        const supplierOrderIds = supplierOrders.map(so => so.id);
        
        // Fetch all orders that match these supplier_order IDs
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id')
          .in('id', supplierOrderIds);

        if (ordersData) {
          const orderIds = ordersData.map(o => o.id);
          
          const { data: invoicesData, error: invoicesError } = await supabase
            .from('invoices')
            .select('*')
            .in('order_id', orderIds)
            .eq('payment_type', 'supplier_payment')
            .order('created_at', { ascending: false })
            .limit(10);

          if (invoicesError) throw invoicesError;
      setInvoices((invoicesData || []).map(inv => ({
        ...inv,
        status: inv.status ?? 'pending',
        due_date: inv.due_date ?? null,
        paid_at: inv.paid_at ?? null,
        created_at: inv.created_at ?? new Date().toISOString(),
        order_id: inv.order_id ?? ''
      })));
        }
      }

    } catch (error: any) {
      toast.error(`Failed to load financial data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <p className="text-muted-foreground">Track your earnings and payments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From completed orders</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From active orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Paid Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.paidOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Financial Charts */}
      <FinancialChartsEnhanced 
        monthlyData={[
          { month: 'Jan', earnings: stats.totalEarnings * 0.1, orders: Math.ceil(stats.paidOrders * 0.1) },
          { month: 'Feb', earnings: stats.totalEarnings * 0.15, orders: Math.ceil(stats.paidOrders * 0.15) },
          { month: 'Mar', earnings: stats.totalEarnings * 0.2, orders: Math.ceil(stats.paidOrders * 0.2) },
          { month: 'Apr', earnings: stats.totalEarnings * 0.25, orders: Math.ceil(stats.paidOrders * 0.25) },
          { month: 'May', earnings: stats.totalEarnings * 0.3, orders: Math.ceil(stats.paidOrders * 0.3) },
        ]}
        paymentStatus={[
          { name: 'Paid', value: stats.totalEarnings },
          { name: 'Pending', value: stats.pendingPayments }
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border"
                >
                  <div>
                    <div className="font-semibold">{invoice.invoice_number}</div>
                    <div className="text-sm text-muted-foreground">
                      Created: {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                    </div>
                    {invoice.due_date && (
                      <div className="text-sm text-muted-foreground">
                        Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${invoice.amount.toLocaleString()}</div>
                    <Badge
                      variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
