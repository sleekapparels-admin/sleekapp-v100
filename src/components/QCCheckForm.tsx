import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import type { ProductionStage } from "./ProductionTimeline";

interface Defect {
  type: string;
  severity: "minor" | "major" | "critical";
  quantity: number;
  description: string;
}

interface QCCheckFormProps {
  orderId: string;
  onCheckCreated: () => void;
}

const productionStages: { value: ProductionStage; label: string }[] = [
  { value: "yarn_received", label: "Yarn Received" },
  { value: "knitting", label: "Knitting" },
  { value: "linking", label: "Linking" },
  { value: "washing_finishing", label: "Washing & Finishing" },
  { value: "final_qc", label: "Final QC" },
  { value: "packing", label: "Packing" },
  { value: "ready_to_ship", label: "Ready to Ship" },
];

export const QCCheckForm = ({ orderId, onCheckCreated }: QCCheckFormProps) => {
  const [stage, setStage] = useState<ProductionStage>("knitting");
  const [totalPieces, setTotalPieces] = useState("");
  const [passedPieces, setPassedPieces] = useState("");
  const [failedPieces, setFailedPieces] = useState("");
  const [notes, setNotes] = useState("");
  const [defects, setDefects] = useState<Defect[]>([]);
  const [uploading, setUploading] = useState(false);

  const addDefect = () => {
    setDefects([...defects, { type: "", severity: "minor", quantity: 0, description: "" }]);
  };

  const removeDefect = (index: number) => {
    setDefects(defects.filter((_, i) => i !== index));
  };

  const updateDefect = (index: number, field: keyof Defect, value: any) => {
    const updated = [...defects];
    updated[index] = { ...updated[index], [field]: value };
    setDefects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create QC check
      const { data: qcCheck, error: qcError } = await supabase
        .from("qc_checks")
        .insert({
          order_id: orderId,
          inspector_id: user.id,
          stage,
          total_pieces_checked: parseInt(totalPieces),
          passed_pieces: parseInt(passedPieces),
          failed_pieces: parseInt(failedPieces),
          notes,
        })
        .select()
        .single();

      if (qcError) throw qcError;

      // Create defects if any
      if (defects.length > 0 && qcCheck) {
        const defectRecords = defects.map(d => ({
          qc_check_id: qcCheck.id,
          defect_type: d.type,
          severity: d.severity,
          quantity: d.quantity,
          description: d.description,
        }));

        const { error: defectsError } = await supabase
          .from("defects")
          .insert(defectRecords);

        if (defectsError) throw defectsError;
      }

      toast({
        title: "QC Check Created",
        description: "Quality control check has been recorded successfully.",
      });

      // Reset form
      setTotalPieces("");
      setPassedPieces("");
      setFailedPieces("");
      setNotes("");
      setDefects([]);
      onCheckCreated();
    } catch (error) {
      console.error("Error creating QC check:", error);
      toast({
        title: "Error",
        description: "Failed to create QC check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record QC Check</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Production Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as ProductionStage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {productionStages.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Total Pieces Checked</Label>
              <Input
                type="number"
                value={totalPieces}
                onChange={(e) => setTotalPieces(e.target.value)}
                required
                min="0"
              />
            </div>
            <div>
              <Label>Passed</Label>
              <Input
                type="number"
                value={passedPieces}
                onChange={(e) => setPassedPieces(e.target.value)}
                required
                min="0"
              />
            </div>
            <div>
              <Label>Failed</Label>
              <Input
                type="number"
                value={failedPieces}
                onChange={(e) => setFailedPieces(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations or comments..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Defects Found</Label>
              <Button type="button" onClick={addDefect} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Defect
              </Button>
            </div>

            {defects.map((defect, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Defect {index + 1}</span>
                  <Button
                    type="button"
                    onClick={() => removeDefect(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Defect Type</Label>
                    <Input
                      value={defect.type}
                      onChange={(e) => updateDefect(index, "type", e.target.value)}
                      placeholder="e.g., Hole, Stain, Misalignment"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Severity</Label>
                    <Select
                      value={defect.severity}
                      onValueChange={(v) => updateDefect(index, "severity", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      value={defect.quantity}
                      onChange={(e) => updateDefect(index, "quantity", parseInt(e.target.value))}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={defect.description}
                      onChange={(e) => updateDefect(index, "description", e.target.value)}
                      placeholder="Details..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              "Record QC Check"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
