import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface ProductionStageManagerProps {
  orderId: string;
}

export const ProductionStageManager = ({ orderId }: ProductionStageManagerProps) => {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);
  const { toast } = useToast();

  const defaultStages = [
    'Material Procurement',
    'Cutting & Preparation',
    'Assembly & Stitching',
    'Quality Inspection',
    'Washing & Finishing',
    'Final QC',
    'Packing',
    'Ready to Ship'
  ];

  useEffect(() => {
    fetchStages();
  }, [orderId]);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response: any = await supabase
        .from('production_stages')
        .select('*');

      if (response.error) throw response.error;

      const filtered = (response.data || [])
        .filter((s: any) => s.supplier_order_id === orderId)
        .sort((a: any, b: any) => a.stage_number - b.stage_number);

      setStages(filtered);

      // Create default stages if none exist
      if (filtered.length === 0) {
        await createDefaultStages();
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultStages = async () => {
    try {
      const stagesToCreate = defaultStages.map((name, index) => ({
        supplier_order_id: orderId,
        stage_number: index + 1,
        stage_name: name,
        status: 'pending',
        completion_percentage: 0,
      }));

      const { error } = await supabase
        .from('production_stages')
        .insert(stagesToCreate);

      if (error) throw error;
      await fetchStages();
    } catch (error) {
      console.error('Error creating stages:', error);
    }
  };

  const updateStage = async (stageId: string, updates: any) => {
    try {
      setLoading(true);

      // Auto-set timestamps based on percentage
      if (updates.completion_percentage === 100 && !updates.completed_at) {
        updates.completed_at = new Date().toISOString();
        updates.status = 'completed';
      } else if (updates.completion_percentage > 0 && updates.completion_percentage < 100) {
        if (!updates.started_at) {
          updates.started_at = new Date().toISOString();
        }
        updates.status = 'in_progress';
      }

      const { error } = await supabase
        .from('production_stages')
        .update(updates)
        .eq('id', stageId);

      if (error) throw error;

      toast({
        title: "Stage Updated",
        description: "Production stage has been updated successfully",
      });

      await fetchStages();
      setEditingStage(null);
    } catch (error: any) {
      console.error('Error updating stage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update stage",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Production Stages</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={createDefaultStages}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>

      {stages.map((stage) => (
        <Card key={stage.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{stage.stage_name}</h4>
                  <Badge variant={getStatusColor(stage.status)}>
                    {stage.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingStage(editingStage?.id === stage.id ? null : stage)}
                >
                  {editingStage?.id === stage.id ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {editingStage?.id === stage.id ? (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor={`progress-${stage.id}`}>
                      Completion Progress: {editingStage.completion_percentage}%
                    </Label>
                    <Input
                      id={`progress-${stage.id}`}
                      type="range"
                      min="0"
                      max="100"
                      value={editingStage.completion_percentage}
                      onChange={(e) => setEditingStage({
                        ...editingStage,
                        completion_percentage: parseInt(e.target.value)
                      })}
                      className="cursor-pointer"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`notes-${stage.id}`}>Notes</Label>
                    <Textarea
                      id={`notes-${stage.id}`}
                      value={editingStage.notes || ''}
                      onChange={(e) => setEditingStage({
                        ...editingStage,
                        notes: e.target.value
                      })}
                      placeholder="Add notes about this stage..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => updateStage(stage.id, {
                      completion_percentage: editingStage.completion_percentage,
                      notes: editingStage.notes,
                    })}
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{stage.completion_percentage}%</span>
                    </div>
                    <Progress value={stage.completion_percentage} />
                  </div>

                  {stage.notes && (
                    <p className="text-sm text-muted-foreground">{stage.notes}</p>
                  )}

                  {stage.started_at && (
                    <p className="text-xs text-muted-foreground">
                      Started: {new Date(stage.started_at).toLocaleDateString()}
                    </p>
                  )}

                  {stage.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Completed: {new Date(stage.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
