import { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Factory, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";

interface SupplierAssignmentDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const SupplierAssignmentDialog = ({
  order,
  open,
  onOpenChange,
  onSuccess,
}: SupplierAssignmentDialogProps) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [supplierPrice, setSupplierPrice] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSuppliers();
    }
  }, [open]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('verification_status', 'verified')
        .order('performance_score', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load suppliers",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedSupplier || supplierPrice <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a supplier and set supplier price",
      });
      return;
    }

    try {
      setLoading(true);

      // Update main order - trigger will auto-create supplier_orders entry
      const margin = (order.buyer_price || order.total_price) - supplierPrice;
      const marginPercentage = ((order.buyer_price || order.total_price) > 0) 
        ? (margin / (order.buyer_price || order.total_price)) * 100 
        : 0;

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          supplier_id: selectedSupplier.id,
          supplier_price: supplierPrice,
          margin_amount: margin,
          margin_percentage: marginPercentage,
          special_instructions: specialInstructions || order.special_instructions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (orderError) throw orderError;

      toast({
        title: "Success",
        description: `Order assigned to ${selectedSupplier.company_name}. They will be notified.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error assigning supplier:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign supplier",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.factory_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Supplier</DialogTitle>
          <DialogDescription>
            Select a verified supplier and set pricing for order {order.order_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Supplier Cards */}
          <div className="grid gap-3 max-h-[400px] overflow-y-auto">
            {filteredSuppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedSupplier?.id === supplier.id
                    ? 'ring-2 ring-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedSupplier(supplier)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Factory className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{supplier.company_name}</h4>
                        {selectedSupplier?.id === supplier.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{supplier.factory_location}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="gap-1">
                          <Star className="h-3 w-3" />
                          {supplier.performance_score || 0}
                        </Badge>
                        <span className="text-sm">
                          MOQ: {supplier.moq_minimum} units
                        </span>
                        <span className="text-sm">
                          Lead time: {supplier.lead_time_days} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pricing */}
          {selectedSupplier && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="supplier-price">Supplier Price (USD)</Label>
                <Input
                  id="supplier-price"
                  type="number"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Buyer price: ${(order.buyer_price || order.total_price)?.toFixed(2)} • 
                  Estimated margin: ${((order.buyer_price || order.total_price) - supplierPrice).toFixed(2)}
                </p>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Add any special requirements or notes for the supplier..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedSupplier || supplierPrice <= 0 || loading}
            >
              Assign Supplier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};