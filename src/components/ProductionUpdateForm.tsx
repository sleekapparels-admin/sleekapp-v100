import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import type { ProductionStage } from "./ProductionTimeline";

interface ProductionUpdateFormProps {
  orderId: string;
  onUpdateCreated: () => void;
}

const stageOptions: Array<{ value: ProductionStage; label: string }> = [
  { value: "yarn_received", label: "Yarn Received" },
  { value: "knitting", label: "Knitting" },
  { value: "linking", label: "Linking" },
  { value: "washing_finishing", label: "Washing & Finishing" },
  { value: "final_qc", label: "Final QC" },
  { value: "packing", label: "Packing" },
  { value: "ready_to_ship", label: "Ready to Ship" },
];

export const ProductionUpdateForm = ({
  orderId,
  onUpdateCreated,
}: ProductionUpdateFormProps) => {
  const [stage, setStage] = useState<ProductionStage>("knitting");
  const [message, setMessage] = useState("");
  const [completion, setCompletion] = useState([0]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload photos to storage
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${orderId}/${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("production-photos")
          .upload(fileName, photo);

        if (uploadError) throw uploadError;
        photoUrls.push(fileName);
      }

      // Create order update
      const { error: updateError } = await supabase
        .from("order_updates")
        .insert({
          order_id: orderId,
          created_by: user.id,
          stage,
          message,
          completion_percentage: completion[0],
          photos: photoUrls,
        });

      if (updateError) throw updateError;

      // Update order's current stage and progress
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          current_stage: stage,
          [`stage_progress.${stage}`]: completion[0],
        })
        .eq("id", orderId);

      if (orderError) throw orderError;

      toast.success("Production update added successfully!");
      setMessage("");
      setPhotos([]);
      setCompletion([0]);
      onUpdateCreated();
    } catch (error: any) {
      console.error("Error creating update:", error);
      toast.error(error.message || "Failed to create update");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Production Update</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="stage">Production Stage</Label>
          <Select value={stage} onValueChange={(v) => setStage(v as ProductionStage)}>
            <SelectTrigger id="stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="completion">Completion Percentage: {completion[0]}%</Label>
          <Slider
            id="completion"
            min={0}
            max={100}
            step={5}
            value={completion}
            onValueChange={setCompletion}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="message">Update Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the progress made in this stage..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="photos">Upload Photos/Videos</Label>
          <div className="mt-2">
            <input
              id="photos"
              type="file"
              multiple
              accept="image/*,video/mp4,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("photos")?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
          </div>
          {photos.length > 0 && (
            <div className="mt-3 space-y-2">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm truncate">{photo.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Submit Update"
          )}
        </Button>
      </form>
    </Card>
  );
};
