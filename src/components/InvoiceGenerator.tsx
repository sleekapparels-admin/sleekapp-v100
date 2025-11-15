import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface InvoiceGeneratorProps {
  orderId: string;
  order: any;
}

export const InvoiceGenerator = ({ orderId, order }: InvoiceGeneratorProps) => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateInvoice = async (type: 'deposit' | 'balance' | 'full') => {
    try {
      setGenerating(true);

      const amount = type === 'deposit' 
        ? order.deposit_amount || order.buyer_price * 0.5
        : type === 'balance'
        ? order.balance_amount || order.buyer_price * 0.5
        : order.buyer_price;

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          order_id: orderId,
          amount,
          payment_type: type,
          invoice_number: `INV-${Date.now()}`,
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Invoice Generated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} invoice created successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate invoice",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Order Total</span>
              <span className="text-2xl font-bold">${order.buyer_price?.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deposit (50%)</span>
                <span className="font-medium">${((order.buyer_price || 0) * 0.5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance (50%)</span>
                <span className="font-medium">${((order.buyer_price || 0) * 0.5).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              variant="outline"
              onClick={() => generateInvoice('deposit')}
              disabled={generating}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Deposit Invoice (50%)
            </Button>

            <Button
              variant="outline"
              onClick={() => generateInvoice('balance')}
              disabled={generating}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Balance Invoice (50%)
            </Button>

            <Button
              variant="outline"
              onClick={() => generateInvoice('full')}
              disabled={generating}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Full Invoice
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Payment Status</p>
            <div className="flex items-center gap-2">
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                {order.payment_status || 'pending'}
              </Badge>
              {order.deposit_paid_at && (
                <span className="text-xs text-muted-foreground">
                  Deposit paid: {new Date(order.deposit_paid_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
