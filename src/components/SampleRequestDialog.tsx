import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface SampleRequestDialogProps {
  orderId: string;
  onSuccess?: () => void;
}

export const SampleRequestDialog = ({ orderId, onSuccess }: SampleRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    sample_type: 'pre_production',
    notes: '',
    specifications: {},
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('sample_requests')
        .insert({
          order_id: orderId,
          requested_by: user.id,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Sample Requested",
        description: "Your sample request has been submitted successfully",
      });

      setOpen(false);
      setFormData({
        sample_type: 'pre_production',
        notes: '',
        specifications: {},
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to request sample",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Package className="mr-2 h-4 w-4" />
          Request Sample
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Sample</DialogTitle>
          <DialogDescription>
            Request a sample from your supplier for approval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sample-type">Sample Type</Label>
            <Select
              value={formData.sample_type}
              onValueChange={(value) => setFormData({ ...formData, sample_type: value })}
            >
              <SelectTrigger id="sample-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_production">Pre-Production Sample</SelectItem>
                <SelectItem value="fit">Fit Sample</SelectItem>
                <SelectItem value="size_set">Size Set Sample</SelectItem>
                <SelectItem value="counter">Counter Sample</SelectItem>
                <SelectItem value="photo">Photo Sample</SelectItem>
                <SelectItem value="shipment">Shipment Sample</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Special Requirements</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe any specific requirements for this sample..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
