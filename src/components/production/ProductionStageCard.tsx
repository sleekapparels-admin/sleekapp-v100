import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOptimisticStageUpdate } from "@/hooks/useOptimisticUpdate";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  MessageSquare, 
  Edit,
  Save,
  X,
  Upload,
  LucideIcon
} from "lucide-react";
import { format } from "date-fns";

interface Stage {
  number: number;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface StageData {
  id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  completion_percentage: number | null;
  notes: string | null;
  photos: string[] | null;
  target_date: string | null;
}

interface ProductionStageCardProps {
  stage: Stage;
  data?: StageData;
  orderId: string;
  userRole: string | null;
}

export const ProductionStageCard = ({ stage, data, orderId, userRole }: ProductionStageCardProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(data?.notes || "");
  const [completionPercentage, setCompletionPercentage] = useState(data?.completion_percentage || 0);
  const [saving, setSaving] = useState(false);

  // Use optimistic updates for better UX
  const { data: optimisticData, isUpdating, updateStage } = useOptimisticStageUpdate(
    data?.id || '',
    data || {}
  );

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setNotes(data.notes || "");
      setCompletionPercentage(data.completion_percentage || 0);
    }
  }, [data]);

  const canEdit = userRole === 'admin' || userRole === 'staff' || userRole === 'supplier';

  const getStatusIcon = () => {
    if (!data) return <Clock className="h-5 w-5 text-gray-400" />;
    
    switch (data.status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    if (!data) return <Badge variant="secondary">Not Started</Badge>;
    
    const variants: Record<string, any> = {
      completed: 'default',
      in_progress: 'default',
      delayed: 'destructive',
      pending: 'secondary'
    };
    
    return (
      <Badge variant={variants[data.status?.toLowerCase()] || 'secondary'}>
        {data.status?.replace('_', ' ')}
      </Badge>
    );
  };

  const handleStartStage = async () => {
    if (!canEdit) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('production_stages')
        .insert({
          supplier_order_id: orderId,
          stage_number: stage.number,
          stage_name: stage.name,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          completion_percentage: 0
        });

      if (error) throw error;

      toast({
        title: "Stage Started",
        description: `${stage.name} has been marked as in progress`,
      });

      // Refresh page
      window.location.reload();
    } catch (error: any) {
      console.error('Error starting stage:', error);
      toast({
        title: "Error Starting Stage",
        description: error.message || 'Failed to start production stage. Please try again.',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStage = async () => {
    if (!data || !canEdit) return;

    setSaving(true);
    try {
      const updateData: any = {
        notes,
        completion_percentage: completionPercentage,
      };

      // Auto-complete if percentage reaches 100%
      if (completionPercentage === 100 && data.status !== 'completed') {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      // Use optimistic update hook
      await updateStage(updateData);

      setIsEditing(false);
      // Removed window.location.reload() - relying on real-time subscriptions
    } catch (error: any) {
      console.error('Error updating stage:', error);
      toast({
        title: "Update Failed",
        description: error.message || 'Failed to update production stage. Please try again.',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteStage = async () => {
    if (!data || !canEdit) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('production_stages')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completion_percentage: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Stage Completed",
        description: `${stage.name} has been marked as completed`,
      });

      window.location.reload();
    } catch (error: any) {
      console.error('Error completing stage:', error);
      toast({
        title: "Completion Failed",
        description: error.message || 'Failed to complete production stage. Please try again.',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const StageIcon = stage.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted ${stage.color}`}>
              <StageIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {stage.number}. {stage.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Stage {stage.number} of 8
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!data ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">This stage hasn't started yet</p>
            {canEdit && (
              <Button onClick={handleStartStage} disabled={saving}>
                Start This Stage
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            {data.status === 'in_progress' && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{data.completion_percentage || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${data.completion_percentage || 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.started_at && (
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="font-medium">
                    {format(new Date(data.started_at), 'MMM dd, HH:mm')}
                  </p>
                </div>
              )}
              {data.completed_at && (
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-medium">
                    {format(new Date(data.completed_at), 'MMM dd, HH:mm')}
                  </p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label>Completion Percentage</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={completionPercentage}
                    onChange={(e) => setCompletionPercentage(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this stage..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateStage} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {data.notes && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{data.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {canEdit && data.status !== 'completed' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Progress
                    </Button>
                    {data.status === 'in_progress' && (
                      <Button 
                        size="sm"
                        onClick={handleCompleteStage}
                        disabled={saving}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
