import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface OrderStats {
  total: number;
  inProgress: number;
  completed: number;
  pending: number;
  avgProgress: number;
}

export const BuyerOrdersOverview = () => {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
    avgProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: orders, error } = await supabase
        .from("orders")
        .select("status, stage_progress")
        .eq("buyer_id", user.id);

      if (error) throw error;

      const total = orders?.length || 0;
      const completed = orders?.filter(o => o.status === "completed").length || 0;
      const pending = orders?.filter(o => o.status === "pending").length || 0;
      const inProgress = total - completed - pending;

      // Calculate average progress
      let totalProgress = 0;
      orders?.forEach(order => {
        const progress = order.stage_progress as Record<string, number>;
        const stages = Object.values(progress);
        const avgStageProgress = stages.reduce((a, b) => a + b, 0) / stages.length;
        totalProgress += avgStageProgress;
      });
      const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;

      setStats({
        total,
        inProgress,
        completed,
        pending,
        avgProgress,
      });
    } catch (error) {
      console.error("Error fetching order stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">All time orders</p>
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Progress
          </CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="mt-2">
            <Progress value={stats.avgProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.avgProgress}% average progress
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completed
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Success Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Order completion rate</p>
        </CardContent>
      </Card>
    </div>
  );
};
