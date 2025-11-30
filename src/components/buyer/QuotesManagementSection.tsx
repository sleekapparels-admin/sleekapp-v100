import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { format } from "date-fns";

interface Quote {
  id: string;
  product_type: string;
  quantity: number;
  total_price: number;
  estimated_delivery_days: number;
  status: string;
  created_at: string;
  quote_data: any;
  converted_to_order_id: string | null;
}

export const QuotesManagementSection = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'approved' | 'converted'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, [filter]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('ai_quotes')
        .select('*')
        .eq('customer_email', user.email ?? '')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        if (filter === 'converted') {
          query = query.not('converted_to_order_id', 'is', null);
        } else {
          query = query.eq('status', filter);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotes((data || []).map(q => ({
        ...q,
        status: q.status ?? 'draft',
        created_at: q.created_at
      })));
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

  const getStatusIcon = (status: string, convertedToOrder: boolean) => {
    if (convertedToOrder) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'approved') return <CheckCircle className="h-4 w-4 text-blue-600" />;
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusBadge = (status: string, convertedToOrder: boolean) => {
    if (convertedToOrder) return <Badge className="bg-green-600">Converted to Order</Badge>;
    if (status === 'approved') return <Badge className="bg-blue-600">Approved</Badge>;
    if (status === 'rejected') return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="secondary">Draft</Badge>;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Quotes</h2>
          <p className="text-muted-foreground">View and manage your AI-generated quotes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Draft
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'converted' ? 'default' : 'outline'}
            onClick={() => setFilter('converted')}
          >
            Orders
          </Button>
        </div>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
            <p className="text-muted-foreground">Start by getting a quote from our AI assistant</p>
            <Button className="mt-4">Get a Quote</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(quote.status, !!quote.converted_to_order_id)}
                    <div>
                      <CardTitle className="text-lg">{quote.product_type}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(quote.status, !!quote.converted_to_order_id)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="text-lg font-semibold">{quote.quantity} pcs</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-lg font-semibold">${quote.total_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price per Unit</p>
                    <p className="text-lg font-semibold">${(quote.total_price / quote.quantity).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery</p>
                    <p className="text-lg font-semibold">{quote.estimated_delivery_days} days</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {!quote.converted_to_order_id && quote.status === 'approved' && (
                    <Button size="sm">Convert to Order</Button>
                  )}
                  {quote.converted_to_order_id && (
                    <Button size="sm" variant="outline">View Order</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
