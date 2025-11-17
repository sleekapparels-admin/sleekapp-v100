import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";

interface SupplierOrder {
  id: string;
  order_number: string;
  product_type: string;
  quantity: number;
  status: string;
  target_date: string | null;
  suppliers?: {
    company_name: string;
  };
}

interface SupplierOrdersTableProps {
  orders: SupplierOrder[];
  loading: boolean;
  onRefresh: () => void;
}

export const SupplierOrdersTable = ({ orders, loading }: SupplierOrdersTableProps) => {
  if (loading) {
    return <Card className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></Card>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Target Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">{order.order_number}</td>
                <td className="px-6 py-4">{order.suppliers?.company_name || "N/A"}</td>
                <td className="px-6 py-4">{order.product_type}</td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4">
                  <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">{order.target_date ? format(new Date(order.target_date), "PP") : "-"}</td>
                <td className="px-6 py-4">
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/admin/supplier-orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}