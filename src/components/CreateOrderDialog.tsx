import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface CreateOrderDialogProps {
  userId: string;
  trigger?: React.ReactNode;
}

export const CreateOrderDialog = ({ userId, trigger }: CreateOrderDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productType: "",
    quantity: "",
    targetDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

      // Create order
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          buyer_id: userId,
          order_number: orderNumber,
          product_type: formData.productType,
          quantity: parseInt(formData.quantity),
          target_date: formData.targetDate || null,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Order created successfully!");
      setOpen(false);
      setFormData({
        productType: "",
        quantity: "",
        targetDate: "",
        notes: "",
      });
      
      // Navigate to order details
      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full" variant="outline">
            Create New Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill in the details for your new production order. We'll review and assign it to our factory team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productType">Product Type *</Label>
            <Select
              value={formData.productType}
              onValueChange={(value) =>
                setFormData({ ...formData, productType: value })
              }
              required
            >
              <SelectTrigger id="productType">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Knitwear - Polo">Knitwear - Polo</SelectItem>
                <SelectItem value="Knitwear - Sweater">Knitwear - Sweater</SelectItem>
                <SelectItem value="Knitwear - Cardigan">Knitwear - Cardigan</SelectItem>
                <SelectItem value="Knitwear - Vest">Knitwear - Vest</SelectItem>
                <SelectItem value="Cut & Sew - Shirt">Cut & Sew - Shirt</SelectItem>
                <SelectItem value="Cut & Sew - Jacket">Cut & Sew - Jacket</SelectItem>
                <SelectItem value="Uniforms - School">Uniforms - School</SelectItem>
                <SelectItem value="Uniforms - Corporate">Uniforms - Corporate</SelectItem>
                <SelectItem value="Uniforms - Sports">Uniforms - Sports</SelectItem>
                <SelectItem value="Accessories - Beanie">Accessories - Beanie</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (pieces) *</Label>
            <Input
              id="quantity"
              type="number"
              min="50"
              placeholder="e.g., 100"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum order: 50 pieces for knitwear
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Delivery Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements, color preferences, or technical details..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
