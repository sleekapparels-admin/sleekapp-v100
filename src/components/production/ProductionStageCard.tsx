import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useStartProductionStage,
  useUpdateProductionStage,
  useCompleteProductionStage
} from "@/hooks/useProductionStages";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  Edit,
  Save,
  X,
  Upload,
  LucideIcon,
  ImageIcon,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(data?.notes || "");
  const [completionPercentage, setCompletionPercentage] = useState(data?.completion_percentage || 0);

  // Use React Query mutations
  const startStageMutation = useStartProductionStage();
  const updateStageMutation = useUpdateProductionStage();
  const completeStageMutation = useCompleteProductionStage();

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

    const variants: Record<string, "default" | "destructive" | "secondary"> = {
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

  const handleStartStage = () => {
    if (!canEdit) return;
    startStageMutation.mutate({
      supplierOrderId: orderId,
      stageNumber: stage.number,
      stageName: stage.name
    });
  };

  const handleUpdateStage = () => {
    if (!data || !canEdit) return;

    updateStageMutation.mutate({
      stageId: data.id,
      updates: {
        notes,
        completion_percentage: completionPercentage,
      }
    }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleCompleteStage = () => {
    if (!data || !canEdit) return;

    completeStageMutation.mutate({
      stageId: data.id,
      stageName: stage.name
    });
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
              <Button onClick={handleStartStage} disabled={startStageMutation.isPending}>
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

            {/* Photo Evidence Section (LoopTrace™) */}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  Photo Evidence
                </Label>
                {canEdit && isEditing && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => {
                    toast.info('Storage Configuration Required', {
                      description: "Photo uploads require the 'production-evidence' bucket to be configured in Supabase.",
                    });
                  }}>
                    <Upload className="h-3 w-3 mr-1" />
                    Add Photo
                  </Button>
                )}
              </div>

              {data.photos && data.photos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {data.photos.map((photo, index) => (
                    <a href={photo} target="_blank" rel="noopener noreferrer" key={index} className="block aspect-square rounded-md overflow-hidden border bg-muted hover:opacity-90 transition-opacity">
                      <img src={photo} alt={`Stage evidence ${index + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 border border-dashed rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    No photos uploaded yet
                  </p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {isEditing ? (
              <div className="space-y-3 pt-2">
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
                  <Button onClick={handleUpdateStage} disabled={updateStageMutation.isPending}>
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
                  <div className="bg-muted p-3 rounded-lg mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{data.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.print();
                    }}
                    title="Download Stage Report"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Report
                  </Button>

                  {canEdit && data.status !== 'completed' && (
                    <>
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
                          disabled={completeStageMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
