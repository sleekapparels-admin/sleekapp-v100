import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  DollarSign, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Play
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      quote_requested: { color: 'secondary', icon: Clock, label: 'Quote Requested' },
      quote_sent: { color: 'secondary', icon: DollarSign, label: 'Quote Sent' },
      admin_review: { color: 'outline', icon: AlertCircle, label: 'Under Review' },
      awaiting_payment: { color: 'destructive', icon: DollarSign, label: 'Awaiting Payment' },
      payment_received: { color: 'default', icon: CheckCircle, label: 'Payment Received' },
      assigned_to_supplier: { color: 'default', icon: Package, label: 'Assigned to Factory' },
      sample_requested: { color: 'secondary', icon: Clock, label: 'Sample Requested' },
      sample_submitted: { color: 'secondary', icon: Package, label: 'Sample Submitted' },
      sample_approved: { color: 'default', icon: CheckCircle, label: 'Sample Approved' },
      bulk_production: { color: 'default', icon: Play, label: 'In Production' },
      qc_inspection: { color: 'secondary', icon: AlertCircle, label: 'Quality Check' },
      ready_to_ship: { color: 'default', icon: Package, label: 'Ready to Ship' },
      shipped: { color: 'default', icon: Truck, label: 'Shipped' },
      delivered: { color: 'default', icon: CheckCircle, label: 'Delivered' },
      completed: { color: 'default', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'destructive', icon: XCircle, label: 'Cancelled' },
      on_hold: { color: 'outline', icon: Clock, label: 'On Hold' },
    };

    return configs[status] || { color: 'outline', icon: AlertCircle, label: status };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.color as any} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};