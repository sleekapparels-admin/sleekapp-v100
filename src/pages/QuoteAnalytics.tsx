import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, DollarSign, Target, Database, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function QuoteAnalytics() {
  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["analytics-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_quotes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: usageLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["analytics-usage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_usage_logs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: cachedResearch, isLoading: cacheLoading } = useQuery({
    queryKey: ["analytics-cache"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_research_cache")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (quotesLoading || logsLoading || cacheLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate metrics
  const totalQuotes = quotes?.length || 0;
  const totalApiCost = usageLogs?.reduce((sum, log) => sum + (log.estimated_cost || 0), 0) || 0;
  const avgConfidence = quotes?.reduce((sum, q) => sum + (q.confidence_score || 0), 0) / (totalQuotes || 1);
  const cacheHitRate = cachedResearch?.length || 0;

  // Quotes by status
  const quotesByStatus = quotes?.reduce((acc: any, quote) => {
    const status = quote.status || "active";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(quotesByStatus || {}).map(([name, value]) => ({ name, value }));
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Quotes over time
  const quotesOverTime = quotes?.reduce((acc: any, quote) => {
    const date = new Date(quote.created_at).toLocaleDateString();
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []) || [];

  // API costs by function
  const costsByFunction = usageLogs?.reduce((acc: any, log) => {
    const name = log.function_name;
    const existing = acc.find((item: any) => item.name === name);
    if (existing) {
      existing.cost += log.estimated_cost || 0;
      existing.calls += 1;
    } else {
      acc.push({ name, cost: log.estimated_cost || 0, calls: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">AI Quote Analytics</h1>
        <p className="text-muted-foreground">Track quote generation metrics, API costs, and system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotes}</div>
            <p className="text-xs text-muted-foreground">All-time quote requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalApiCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated API expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Quote accuracy score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cached Research</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheHitRate}</div>
            <p className="text-xs text-muted-foreground">Active cache entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quotes Over Time</CardTitle>
            <CardDescription>Daily quote generation volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quotesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quote Status Distribution</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card>
        <CardHeader>
          <CardTitle>API Costs by Function</CardTitle>
          <CardDescription>Breakdown of estimated costs per edge function</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costsByFunction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
          <CardDescription>Latest AI-generated quotes with details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes?.slice(0, 10).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="font-medium">{quote.product_type}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {quote.quantity} | ${quote.total_price.toFixed(2)} | {quote.confidence_score}% confidence
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{quote.customer_email || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cached Research Table */}
      <Card>
        <CardHeader>
          <CardTitle>Market Research Cache</CardTitle>
          <CardDescription>Active cached research data (24h validity)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cachedResearch?.map((cache) => (
              <div key={cache.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="font-medium capitalize">{cache.product_category}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty Range: {cache.quantity_range} | Confidence: {cache.confidence_score}%
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    Expires: {new Date(cache.expires_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cache.sources?.length || 0} sources
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
