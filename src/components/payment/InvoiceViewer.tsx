import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  payment_type: string;
  status: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
}

interface InvoiceViewerProps {
  invoice: Invoice;
  orderNumber: string;
}

export const InvoiceViewer = ({ invoice, orderNumber }: InvoiceViewerProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{invoice.invoice_number}</h3>
            <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Type</p>
            <p className="font-medium capitalize">{invoice.payment_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Issue Date</p>
            <p className="font-medium">
              {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {invoice.paid_at && (
          <div>
            <p className="text-sm text-muted-foreground">Paid On</p>
            <p className="font-medium text-green-600">
              {format(new Date(invoice.paid_at), 'MMM dd, yyyy')}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </Card>
  );
};