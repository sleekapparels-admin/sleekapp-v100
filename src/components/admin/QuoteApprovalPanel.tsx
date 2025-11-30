import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Quote {
  id: string;
  product_type: string;
  quantity: number;
  total_price: number;
  customer_name: string | null;
  customer_email: string | null;
  status: string;
  created_at: string;
  quote_data: any;
}

export const QuoteApprovalPanel = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [adminMarkup, setAdminMarkup] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingQuotes();
  }, []);

  const fetchPendingQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_quotes')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes((data || []).map(q => ({
        ...q,
        status: q.status ?? 'draft',
        created_at: q.created_at ?? new Date().toISOString(),
        product_type: q.product_type,
        quantity: q.quantity,
        total_price: q.total_price,
        quote_data: q.quote_data
      })));
    } catch (error: any) {
      toast.error(`Failed to load quotes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const approveQuote = async (quoteId: string) => {
    // Input validation
    if (adminMarkup < 0) {
      toast.error("Markup cannot be negative");
      return;
    }

    if (selectedQuote && adminMarkup > selectedQuote.total_price * 2) {
      toast.error("Markup seems excessive (>200% of base price)");
      return;
    }

    if (notes.length > 1000) {
      toast.error("Notes too long (max 1000 characters)");
      return;
    }

    try {
      setProcessing(true);
      
      const finalPrice = selectedQuote ? selectedQuote.total_price + adminMarkup : 0;

      const { error: approvalError } = await supabase
        .from('quote_approvals')
        .insert({
          quote_id: quoteId,
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          final_price: finalPrice,
          admin_notes: notes,
          status: 'approved'
        });

      if (approvalError) throw approvalError;

      const { error: updateError } = await supabase
        .from('ai_quotes')
        .update({
          status: 'approved',
          admin_markup: adminMarkup,
          total_price: finalPrice
        })
        .eq('id', quoteId);

      if (updateError) throw updateError;

      toast.success("Quote approved successfully");
      setSelectedQuote(null);
      fetchPendingQuotes();
    } catch (error: any) {
      toast.error(`Failed to approve quote: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const rejectQuote = async (quoteId: string) => {
    try {
      setProcessing(true);

      const { error: approvalError } = await supabase
        .from('quote_approvals')
        .insert({
          quote_id: quoteId,
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: notes,
          status: 'rejected'
        });

      if (approvalError) throw approvalError;

      const { error: updateError } = await supabase
        .from('ai_quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);

      if (updateError) throw updateError;

      toast.success("Quote rejected");
      setSelectedQuote(null);
      fetchPendingQuotes();
    } catch (error: any) {
      toast.error(`Failed to reject quote: ${error.message}`);
    } finally {
      setProcessing(false);
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
        <h2 className="text-2xl font-bold">Quote Approval</h2>
        <p className="text-muted-foreground">Review and approve AI-generated quotes</p>
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No pending quotes to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Quotes ({quotes.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {quotes.map((quote) => (
                <button
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedQuote?.id === quote.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{quote.product_type}</div>
                      <div className="text-sm opacity-90">{quote.quantity} pieces</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${quote.total_price.toLocaleString()}</div>
                      <div className="text-xs opacity-75">
                        {format(new Date(quote.created_at), 'MMM dd')}
                      </div>
                    </div>
                  </div>
                  {quote.customer_name && (
                    <div className="text-sm opacity-75">{quote.customer_name}</div>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {selectedQuote && (
            <Card>
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-semibold">{selectedQuote.product_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-semibold">{selectedQuote.quantity} pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-semibold">${selectedQuote.total_price.toLocaleString()}</span>
                  </div>
                  {selectedQuote.customer_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-semibold">{selectedQuote.customer_name}</span>
                    </div>
                  )}
                  {selectedQuote.customer_email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-semibold text-sm">{selectedQuote.customer_email}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Admin Markup ($)</label>
                    <Input
                      type="number"
                      value={adminMarkup}
                      onChange={(e) => setAdminMarkup(Number(e.target.value))}
                      placeholder="Enter markup amount"
                    />
                  </div>

                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Price:</span>
                    <span className="text-primary">
                      ${(selectedQuote.total_price + adminMarkup).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Admin Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this quote..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => approveQuote(selectedQuote.id)}
                      disabled={processing}
                      className="flex-1"
                    >
                      {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectQuote(selectedQuote.id)}
                      disabled={processing}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
