import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface QCInspectionFormProps {
  orderId: string;
  onComplete?: () => void;
}

export const QCInspectionForm = ({ orderId, onComplete }: QCInspectionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  type QCStage = 'yarn_received' | 'knitting' | 'linking' | 'washing_finishing' | 'final_qc' | 'packing' | 'ready_to_ship';

  const [formData, setFormData] = useState<{
    stage: QCStage;
    total_pieces_checked: number;
    passed_pieces: number;
    failed_pieces: number;
    notes: string;
  }>({
    stage: 'knitting',
    total_pieces_checked: 0,
    passed_pieces: 0,
    failed_pieces: 0,
    notes: '',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('qc_checks')
        .insert([{
          order_id: orderId,
          inspector_id: user.id,
          stage: formData.stage,
          total_pieces_checked: formData.total_pieces_checked,
          passed_pieces: formData.passed_pieces,
          failed_pieces: formData.failed_pieces,
          notes: formData.notes,
          check_date: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "QC Check Recorded",
        description: "Quality inspection has been saved successfully",
      });

      // Reset form
      setFormData({
        stage: 'knitting',
        total_pieces_checked: 0,
        passed_pieces: 0,
        failed_pieces: 0,
        notes: '',
      });

      onComplete?.();
    } catch (error: any) {
      console.error('Error saving QC check:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save QC check",
      });
    } finally {
      setLoading(false);
    }
  };

  const passRate = formData.total_pieces_checked > 0
    ? (formData.passed_pieces / formData.total_pieces_checked) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Control Inspection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="stage">Inspection Stage</Label>
          <Select
            value={formData.stage}
            onValueChange={(value) => setFormData({ ...formData, stage: value as QCStage })}
          >
            <SelectTrigger id="stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yarn_received">Yarn Received</SelectItem>
              <SelectItem value="knitting">Knitting</SelectItem>
              <SelectItem value="linking">Linking</SelectItem>
              <SelectItem value="washing_finishing">Washing & Finishing</SelectItem>
              <SelectItem value="final_qc">Final QC</SelectItem>
              <SelectItem value="packing">Packing</SelectItem>
              <SelectItem value="ready_to_ship">Ready to Ship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="total">Total Pieces Checked</Label>
            <Input
              id="total"
              type="number"
              value={formData.total_pieces_checked}
              onChange={(e) => {
                const total = parseInt(e.target.value) || 0;
                setFormData({ 
                  ...formData, 
                  total_pieces_checked: total,
                  failed_pieces: total - formData.passed_pieces
                });
              }}
            />
          </div>

          <div>
            <Label htmlFor="passed">Passed</Label>
            <Input
              id="passed"
              type="number"
              value={formData.passed_pieces}
              onChange={(e) => {
                const passed = parseInt(e.target.value) || 0;
                setFormData({ 
                  ...formData, 
                  passed_pieces: passed,
                  failed_pieces: formData.total_pieces_checked - passed
                });
              }}
            />
          </div>

          <div>
            <Label htmlFor="failed">Failed</Label>
            <Input
              id="failed"
              type="number"
              value={formData.failed_pieces}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        {formData.total_pieces_checked > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pass Rate</span>
              <span className={`text-2xl font-bold ${
                passRate >= 95 ? 'text-green-600' :
                passRate >= 85 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {passRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {passRate >= 95 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Excellent Quality</span>
                </>
              ) : passRate >= 85 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-600">Acceptable Quality</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Needs Improvement</span>
                </>
              )}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="notes">Inspection Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Document any defects, issues, or observations..."
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || formData.total_pieces_checked === 0}
          className="w-full"
        >
          Submit QC Report
        </Button>
      </CardContent>
    </Card>
  );
};
