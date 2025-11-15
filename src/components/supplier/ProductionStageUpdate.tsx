import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { toast } from "sonner";
import { Upload, CheckCircle, Clock, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface ProductionStageUpdateProps {
  stage: any;
  onUpdate: () => void;
}

export const ProductionStageUpdate = ({ stage, onUpdate }: ProductionStageUpdateProps) => {
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    completion_percentage: stage.completion_percentage,
    notes: stage.notes || "",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let photoUrls = stage.photos || [];

      // Upload new photos
      if (photos.length > 0) {
        const uploadPromises = photos.map(async (photo) => {
          const fileName = `${stage.supplier_order_id}/${stage.id}/${Date.now()}-${photo.name}`;
          const { error: uploadError } = await supabase.storage
            .from("production-photos")
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("production-photos")
            .getPublicUrl(fileName);

          return data.publicUrl;
        });

        const newUrls = await Promise.all(uploadPromises);
        photoUrls = [...photoUrls, ...newUrls];
      }

      // Update stage
      const { error } = await supabase
        .from("production_stages")
        .update({
          completion_percentage: parseInt(formData.completion_percentage.toString()),
          notes: formData.notes,
          photos: photoUrls,
          updated_by: user.id,
        })
        .eq("id", stage.id);

      if (error) throw error;

      toast.success("Stage updated successfully");
      setEditing(false);
      setPhotos([]);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating stage:", error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    if (stage.completion_percentage === 100) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (stage.completion_percentage > 0) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Clock className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold">
              Stage {stage.stage_number}: {stage.stage_name}
            </h3>
            {stage.description && (
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            )}
          </div>
        </div>
        <Badge variant={stage.status === "completed" ? "default" : "secondary"}>
          {stage.status}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{stage.completion_percentage}%</span>
        </div>
        <Progress value={stage.completion_percentage} className="h-2" />
      </div>

      {stage.target_date && (
        <p className="text-sm text-muted-foreground mb-4">
          Target: {format(new Date(stage.target_date), "PPP")}
        </p>
      )}

      {editing ? (
        <div className="space-y-4 border-t pt-4">
          <div>
            <Label>Completion Percentage</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.completion_percentage}
              onChange={(e) => setFormData({ ...formData, completion_percentage: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Add production notes, issues, or updates..."
            />
          </div>
          <div>
            <Label>Upload Photos</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
            {photos.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {photos.length} photo(s) selected
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Uploading..." : "Save Update"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {stage.notes && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-sm">{stage.notes}</p>
              {stage.updated_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {format(new Date(stage.updated_at), "PPp")}
                </p>
              )}
            </div>
          )}

          {stage.photos && stage.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {stage.photos.map((photo: string, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                  <img src={photo} alt={`Stage ${stage.stage_number} photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <Button onClick={() => setEditing(true)} variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Update Stage
          </Button>
        </>
      )}
    </Card>
  );
};