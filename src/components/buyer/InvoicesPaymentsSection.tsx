import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { usePayment } from "@/hooks/usePayment";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  payment_type: string;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  pdf_url: string | null;
  order_id: string;
  orders: {
    order_number: string;
    product_type: string;
  };
}

export const InvoicesPaymentsSection = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'history'>('invoices');
  const { toast } = useToast();
  const { createPaymentIntent, loading: paymentLoading } = usePayment();

  useEffect(() => {
    fetchInvoices();
    fetchPaymentHistory();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', user.id);

      if (!ordersData) return;

      const orderIds = ordersData.map(o => o.id);

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          orders (
            order_number,
            product_type
          )
        `)
        .in('order_id', orderIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_history')
        .select('*')
        .eq('paid_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handlePayNow = async (invoiceId: string, orderId: string, amount: number) => {
    try {
      const paymentType = invoices.find(inv => inv.id === invoiceId)?.payment_type || 'full';
      const data = await createPaymentIntent(orderId, paymentType as any);
      
      if (data?.clientSecret) {
        // Redirect to Stripe checkout
        toast({
          title: "Redirecting to payment",
          description: "Opening secure payment page..."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
    if (status === 'pending') return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    if (status === 'overdue') return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
    return <Badge variant="outline">{status}</Badge>;
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
        <h2 className="text-2xl font-bold">Invoices & Payments</h2>
        <p className="text-muted-foreground">Manage your invoices and payment history</p>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Payment History
        </button>
      </div>

      {activeTab === 'invoices' ? (
        <div className="grid gap-4">
          {invoices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                <p className="text-muted-foreground">Your invoices will appear here once orders are confirmed</p>
              </CardContent>
            </Card>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Invoice #{invoice.invoice_number}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order #{invoice.orders.order_number} • {invoice.orders.product_type}
                      </p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-lg font-semibold">${invoice.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Type</p>
                      <p className="text-lg font-semibold capitalize">{invoice.payment_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="text-lg font-semibold">
                        {invoice.due_date ? format(new Date(invoice.due_date), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Issued</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {invoice.pdf_url && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                    {invoice.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handlePayNow(invoice.id, invoice.order_id, invoice.amount)}
                        disabled={paymentLoading}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No payment history</h3>
                <p className="text-muted-foreground">Your payment transactions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            paymentHistory.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        payment.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {payment.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {payment.payment_type} Payment • {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
