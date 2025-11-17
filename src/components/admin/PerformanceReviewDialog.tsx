import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface PerformanceReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  supplier: any;
  onSuccess: () => void;
}

export const PerformanceReviewDialog = ({
  open,
  onOpenChange,
  order,
  supplier,
  onSuccess,
}: PerformanceReviewDialogProps) => {
  const [formData, setFormData] = useState({
    quality_score: 5,
    communication_score: 5,
    actual_delivery_date: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const onTime = formData.actual_delivery_date && order.target_date
        ? new Date(formData.actual_delivery_date) <= new Date(order.target_date)
        : null;

      const { error } = await supabase.from("supplier_performance").insert({
        supplier_id: supplier.id,
        supplier_order_id: order.id,
        committed_delivery_date: order.target_date,
        actual_delivery_date: formData.actual_delivery_date || null,
        on_time: onTime,
        quality_score: formData.quality_score,
        communication_score: formData.communication_score,
        notes: formData.notes,
      });

      if (error) throw error;

      // Update order status to completed
      await supabase
        .from("supplier_orders")
        .update({ status: "completed" })
        .eq("id", order.id);

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 ${star <= value ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Performance Review</DialogTitle>
          <DialogDescription>
            Rate the supplier's performance on quality, delivery, and communication
          </DialogDescription>
          <DialogTitle>Performance Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Quality Score</Label>
            <StarRating
              value={formData.quality_score}
              onChange={(v) => setFormData({ ...formData, quality_score: v })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Rate the quality of the finished product
            </p>
          </div>

          <div>
            <Label>Communication Score</Label>
            <StarRating
              value={formData.communication_score}
              onChange={(v) => setFormData({ ...formData, communication_score: v })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Rate their responsiveness and communication
            </p>
          </div>

          <div>
            <Label>Actual Delivery Date</Label>
            <Input
              type="date"
              value={formData.actual_delivery_date}
              onChange={(e) => setFormData({ ...formData, actual_delivery_date: e.target.value })}
            />
            {order.target_date && (
              <p className="text-xs text-muted-foreground mt-1">
                Target was: {new Date(order.target_date).toLocaleDateString()}
              </p>
            )}
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Any additional feedback or comments..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};