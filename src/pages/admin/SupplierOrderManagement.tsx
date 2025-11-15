import { useState, useEffect } from "react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateSupplierOrderDialog } from "@/components/admin/CreateSupplierOrderDialog";
import { SupplierOrdersTable } from "@/components/admin/SupplierOrdersTable";

export default function SupplierOrderManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier_orders")
        .select(`
          *,
          suppliers (company_name, factory_location),
          orders (order_number, buyer_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Supplier Order Management</h1>
              <p className="text-muted-foreground mt-2">Assign and track supplier orders</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>

          <SupplierOrdersTable orders={orders} loading={loading} onRefresh={fetchOrders} />
        </div>
      </div>

      <CreateSupplierOrderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchOrders();
        }}
      />
    </>
  );
}