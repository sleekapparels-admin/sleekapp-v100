import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface CreateSupplierOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prefilledData?: {
    buyerEmail?: string;
    buyerName?: string;
    productType?: string;
    quantity?: number;
  };
}

export const CreateSupplierOrderDialog = ({ open, onOpenChange, onSuccess, prefilledData }: CreateSupplierOrderDialogProps) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stages, setStages] = useState([{ name: "", description: "", target_date: "" }]);
  const [formData, setFormData] = useState({
    supplier_id: "",
    order_number: `SO-${Date.now().toString().slice(-6)}`,
    product_type: "",
    quantity: "",
    buyer_price: "",
    supplier_price: "",
    target_date: "",
    special_instructions: "",
  });

  useEffect(() => {
    if (open) {
      fetchSuppliers();
      
      // Prefill form if data is provided
      if (prefilledData) {
        setFormData(prev => ({
          ...prev,
          product_type: prefilledData.productType || "",
          quantity: prefilledData.quantity?.toString() || "",
          special_instructions: `Buyer: ${prefilledData.buyerName || "N/A"}\nEmail: ${prefilledData.buyerEmail || "N/A"}`,
        }));
      }
    }
  }, [open, prefilledData]);

  const fetchSuppliers = async () => {
    const { data } = await supabase.from("suppliers").select("*").eq("verification_status", "verified");
    setSuppliers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: order, error: orderError } = await supabase
        .from("supplier_orders")
        .insert({
          ...formData,
          quantity: parseInt(formData.quantity),
          buyer_price: parseFloat(formData.buyer_price) || null,
          supplier_price: parseFloat(formData.supplier_price) || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create production stages
      const stagesData = stages
        .filter(s => s.name)
        .map((stage, index) => ({
          supplier_order_id: order.id,
          stage_number: index + 1,
          stage_name: stage.name,
          description: stage.description,
          target_date: stage.target_date || null,
        }));

      if (stagesData.length > 0) {
        const { error: stagesError } = await supabase.from("production_stages").insert(stagesData);
        if (stagesError) throw stagesError;
      }

      toast.success("Order created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Supplier Order</DialogTitle>
          <DialogDescription>
            Create a new order for a supplier with production stages and timeline
          </DialogDescription>
          <DialogTitle>Create Supplier Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Order Number</Label>
              <Input value={formData.order_number} onChange={(e) => setFormData({...formData, order_number: e.target.value})} required />
            </div>
            <div>
              <Label>Supplier</Label>
              <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Product Type</Label>
              <Input value={formData.product_type} onChange={(e) => setFormData({...formData, product_type: e.target.value})} required />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Buyer Price</Label>
              <Input type="number" step="0.01" value={formData.buyer_price} onChange={(e) => setFormData({...formData, buyer_price: e.target.value})} />
            </div>
            <div>
              <Label>Supplier Price</Label>
              <Input type="number" step="0.01" value={formData.supplier_price} onChange={(e) => setFormData({...formData, supplier_price: e.target.value})} />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input type="date" value={formData.target_date} onChange={(e) => setFormData({...formData, target_date: e.target.value})} />
            </div>
          </div>

          <div>
            <Label>Special Instructions</Label>
            <Textarea value={formData.special_instructions} onChange={(e) => setFormData({...formData, special_instructions: e.target.value})} rows={3} />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base">Production Stages</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => setStages([...stages, { name: "", description: "", target_date: "" }])}>
                <Plus className="h-4 w-4 mr-1" /> Add Stage
              </Button>
            </div>
            {stages.map((stage, index) => (
              <div key={index} className="flex gap-3 mb-3 items-start">
                <Input placeholder="Stage name" value={stage.name} onChange={(e) => {
                  const newStages = [...stages];
                  newStages[index].name = e.target.value;
                  setStages(newStages);
                }} />
                <Input placeholder="Description" value={stage.description} onChange={(e) => {
                  const newStages = [...stages];
                  newStages[index].description = e.target.value;
                  setStages(newStages);
                }} />
                <Input type="date" value={stage.target_date} onChange={(e) => {
                  const newStages = [...stages];
                  newStages[index].target_date = e.target.value;
                  setStages(newStages);
                }} />
                {stages.length > 1 && (
                  <Button type="button" size="icon" variant="ghost" onClick={() => setStages(stages.filter((_, i) => i !== index))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">Create Order</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}