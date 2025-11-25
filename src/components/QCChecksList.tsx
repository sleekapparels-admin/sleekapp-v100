import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { ProductionStage } from "./ProductionTimeline";

interface Defect {
  id: string;
  defect_type: string;
  severity: string;
  quantity: number;
  description: string;
}

interface QCCheck {
  id: string;
  check_date: string;
  stage: ProductionStage;
  total_pieces_checked: number;
  passed_pieces: number;
  failed_pieces: number;
  notes: string;
  defects: Defect[];
}

interface QCChecksListProps {
  orderId: string;
  refreshTrigger?: number;
}

const stageLabels: Record<ProductionStage, string> = {
  yarn_received: "Yarn Received",
  knitting: "Knitting",
  linking: "Linking",
  washing_finishing: "Washing & Finishing",
  final_qc: "Final QC",
  packing: "Packing",
  ready_to_ship: "Ready to Ship",
};

const severityConfig = {
  minor: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  major: { icon: XCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  critical: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

export const QCChecksList = ({ orderId, refreshTrigger = 0 }: QCChecksListProps) => {
  const [checks, setChecks] = useState<QCCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQCChecks();
  }, [orderId, refreshTrigger]);

  const fetchQCChecks = async () => {
    try {
      const { data: checksData, error: checksError } = await supabase
        .from("qc_checks")
        .select("*")
        .eq("order_id", orderId)
        .order("check_date", { ascending: false });

      if (checksError) throw checksError;

      // Fetch defects for each check
      const checksWithDefects = await Promise.all(
        (checksData || []).map(async (check) => {
          const { data: defectsData } = await supabase
            .from("defects")
            .select("*")
            .eq("qc_check_id", check.id);

          return {
            ...check,
            defects: defectsData || [],
          };
        })
      );

      setChecks(checksWithDefects as QCCheck[]);
    } catch (error) {
      console.error("Error fetching QC checks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPassRate = (check: QCCheck) => {
    const rate = (check.passed_pieces / check.total_pieces_checked) * 100;
    return rate.toFixed(1);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading QC checks...</p>
        </CardContent>
      </Card>
    );
  }

  if (checks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No QC checks recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quality Control History</h3>
      {checks.map((check) => {
        const passRate = parseFloat(getPassRate(check));
        return (
          <Card key={check.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {passRate >= 95 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : passRate >= 85 ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <CardTitle className="text-base">
                      {stageLabels[check.stage]} QC Check
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(check.check_date), "PPp")}
                    </p>
                  </div>
                </div>
                <Badge variant={passRate >= 95 ? "default" : "secondary"}>
                  {passRate}% Pass Rate
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{check.total_pieces_checked}</p>
                  <p className="text-xs text-muted-foreground">Inspected</p>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{check.passed_pieces}</p>
                  <p className="text-xs text-muted-foreground">Passed</p>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{check.failed_pieces}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>

              {check.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Inspector Notes:</p>
                  <p className="text-sm text-muted-foreground">{check.notes}</p>
                </div>
              )}

              {check.defects.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Defects Found:</p>
                  {check.defects.map((defect) => {
                    const config = severityConfig[defect.severity as keyof typeof severityConfig];
                    const Icon = config.icon;
                    return (
                      <div
                        key={defect.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${config.bg}`}
                      >
                        <Icon className={`h-4 w-4 mt-0.5 ${config.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{defect.defect_type}</p>
                            <Badge variant="outline" className="text-xs">
                              {defect.quantity} pcs
                            </Badge>
                          </div>
                          {defect.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {defect.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
