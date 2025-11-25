import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MousePointer, Palette, Pencil, MessageSquare, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductMetrics {
  product_id: string;
  product_name: string;
  category: string;
  unique_sessions: number;
  hover_count: number;
  quick_view_count: number;
  wishlist_count: number;
  color_swatch_count: number;
  design_click_count: number;
  quote_click_count: number;
  view_details_count: number;
  total_interactions: number;
  last_interaction: string;
}

export const ProductEngagementMetrics = () => {
  const [metrics, setMetrics] = useState<ProductMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_product_engagement_metrics');

      if (error) throw error;
      
      // Sort and limit on client side since RPC doesn't support order/limit
      const sortedData = (data || [])
        .sort((a: ProductMetrics, b: ProductMetrics) => b.total_interactions - a.total_interactions)
        .slice(0, 10);
      
      setMetrics(sortedData);
    } catch (err) {
      console.error('Failed to fetch product metrics:', err);
      setError('Failed to load engagement metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Engagement Metrics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Engagement Metrics</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Product Engagement Metrics
        </CardTitle>
        <CardDescription>
          Top 10 products by engagement in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No engagement data available yet
            </p>
          ) : (
            metrics.map((metric) => (
              <div
                key={metric.product_id}
                className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-base">{metric.product_name}</h4>
                    <Badge variant="secondary" className="mt-1">
                      {metric.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {metric.total_interactions}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Interactions
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                      <MousePointer className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.hover_count}</div>
                      <div className="text-xs text-muted-foreground">Hovers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.quick_view_count}</div>
                      <div className="text-xs text-muted-foreground">Quick Views</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.wishlist_count}</div>
                      <div className="text-xs text-muted-foreground">Wishlist</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.color_swatch_count}</div>
                      <div className="text-xs text-muted-foreground">Colors</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                      <Pencil className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.design_click_count}</div>
                      <div className="text-xs text-muted-foreground">Design</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{metric.quote_click_count}</div>
                      <div className="text-xs text-muted-foreground">Quotes</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 col-span-2">
                    <div>
                      <div className="text-sm font-semibold">{metric.unique_sessions}</div>
                      <div className="text-xs text-muted-foreground">Unique Sessions</div>
                    </div>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Engagement Score:</span>
                    <span className="font-semibold text-foreground">
                      {Math.round(
                        (metric.total_interactions / Math.max(metric.unique_sessions, 1)) * 10
                      ) / 10} interactions per session
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
