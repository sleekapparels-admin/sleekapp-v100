import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserPlus, DollarSign, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SupplierAssignmentDialog } from "./SupplierAssignmentDialog";

interface OrderDetailModalProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const OrderDetailModal = ({ order, open, onOpenChange, onUpdate }: OrderDetailModalProps) => {
  const [buyerPrice, setBuyerPrice] = useState(order.buyer_price || order.total_price || 0);
  const [supplierPrice, setSupplierPrice] = useState(order.supplier_price || 0);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const margin = buyerPrice - supplierPrice;
  const marginPercentage = buyerPrice > 0 ? (margin / buyerPrice) * 100 : 0;

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('orders')
        .update({
          buyer_price: buyerPrice,
          supplier_price: supplierPrice,
          admin_margin: margin,
          margin_percentage: marginPercentage,
          admin_notes: adminNotes,
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order details updated successfully",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {order.order_number}</DialogTitle>
            <DialogDescription>
              Review and manage order pricing, supplier assignment, and notes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Information */}
            <div>
              <h3 className="font-semibold mb-3">Order Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Product Type</Label>
                  <p className="font-medium">{order.product_type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <p className="font-medium">{order.quantity} units</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="mt-1">
                    {order.workflow_status?.replace(/_/g, ' ') || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Target Date</Label>
                  <p className="font-medium">{order.target_date || 'Not set'}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing & Margins
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyer-price">Buyer Price (USD)</Label>
                  <Input
                    id="buyer-price"
                    type="number"
                    value={buyerPrice}
                    onChange={(e) => setBuyerPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="supplier-price">Supplier Price (USD)</Label>
                  <Input
                    id="supplier-price"
                    type="number"
                    value={supplierPrice}
                    onChange={(e) => setSupplierPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Admin Margin</Label>
                    <p className="text-2xl font-bold text-green-600">
                      ${margin.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Margin %</Label>
                    <p className="text-2xl font-bold text-green-600">
                      {marginPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Supplier Assignment */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Supplier Assignment
              </h3>
              {order.supplier_id ? (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Assigned Supplier</p>
                  <p className="font-medium">Supplier ID: {order.supplier_id}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowSupplierDialog(true)}
                  >
                    Change Supplier
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowSupplierDialog(true)} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign to Supplier
                </Button>
              )}
            </div>

            <Separator />

            {/* Admin Notes */}
            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this order..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SupplierAssignmentDialog
        order={order}
        open={showSupplierDialog}
        onOpenChange={setShowSupplierDialog}
        onSuccess={() => {
          setShowSupplierDialog(false);
          onUpdate();
        }}
      />
    </>
  );
};