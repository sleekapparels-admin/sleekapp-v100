import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RateLimitMetrics {
  table: string;
  total_requests: number;
  unique_identifiers: number;
  max_requests_per_identifier: number;
  avg_requests_per_identifier: number;
  high_usage_identifiers: number;
}

export const RateLimitMonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<RateLimitMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    fetchRateLimitMetrics();
    const interval = setInterval(fetchRateLimitMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchRateLimitMetrics = async () => {
    try {
      setLoading(true);
      const rateLimitTables = [
        'otp_rate_limits',
        'conversation_rate_limits',
        'wishlist_rate_limits',
        'ai_quote_rate_limits'
      ];

      const metricsPromises = rateLimitTables.map(async (table) => {
        const { data, error } = await supabase
          .from(table as any)
          .select('*')
          .gte('window_start', new Date(Date.now() - 3600000).toISOString()); // Last hour

        if (error) throw error;

        const totalRequests = data?.reduce((sum, row: any) => sum + (row.request_count || 0), 0) || 0;
        const uniqueIdentifiers = new Set(data?.map((row: any) => row.identifier)).size;
        const maxRequests = Math.max(...(data?.map((row: any) => row.request_count || 0) || [0]));
        const avgRequests = totalRequests / (uniqueIdentifiers || 1);
        const highUsage = data?.filter((row: any) => (row.request_count || 0) > 80).length || 0;

        return {
          table: table.replace('_rate_limits', '').replace(/_/g, ' ').toUpperCase(),
          total_requests: totalRequests,
          unique_identifiers: uniqueIdentifiers,
          max_requests_per_identifier: maxRequests,
          avg_requests_per_identifier: Math.round(avgRequests * 10) / 10,
          high_usage_identifiers: highUsage
        };
      });

      const results = await Promise.all(metricsPromises);
      setMetrics(results);

      // Check for alerts
      const newAlerts: string[] = [];
      results.forEach(metric => {
        if (metric.high_usage_identifiers > 0) {
          newAlerts.push(`${metric.table}: ${metric.high_usage_identifiers} identifiers near rate limit`);
        }
      });
      setAlerts(newAlerts);

    } catch (error) {
      console.error('Error fetching rate limit metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (highUsage: number) => {
    if (highUsage === 0) return "text-green-500";
    if (highUsage < 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusIcon = (highUsage: number) => {
    if (highUsage === 0) return <CheckCircle className="h-4 w-4" />;
    if (highUsage < 3) return <Activity className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rate Limit Monitoring</h2>
        <p className="text-muted-foreground">
          Real-time monitoring of API rate limits and usage patterns
        </p>
      </div>

      {alerts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Active Alerts:</strong>
            <ul className="mt-2 space-y-1">
              {alerts.map((alert, idx) => (
                <li key={idx}>• {alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.table}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span className={getStatusColor(metric.high_usage_identifiers)}>
                  {getStatusIcon(metric.high_usage_identifiers)}
                </span>
                {metric.table}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Requests:</span>
                  <span className="font-semibold">{metric.total_requests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unique IDs:</span>
                  <span className="font-semibold">{metric.unique_identifiers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max/ID:</span>
                  <span className="font-semibold">{metric.max_requests_per_identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg/ID:</span>
                  <span className="font-semibold">{metric.avg_requests_per_identifier}</span>
                </div>
                {metric.high_usage_identifiers > 0 && (
                  <Badge variant="destructive" className="w-full justify-center mt-2">
                    {metric.high_usage_identifiers} Near Limit
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics (Last Hour)</CardTitle>
          <CardDescription>
            Monitoring all rate-limited endpoints for abuse patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading metrics...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead className="text-right">Total Requests</TableHead>
                  <TableHead className="text-right">Unique IDs</TableHead>
                  <TableHead className="text-right">Max per ID</TableHead>
                  <TableHead className="text-right">Avg per ID</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow key={metric.table}>
                    <TableCell className="font-medium">{metric.table}</TableCell>
                    <TableCell className="text-right">{metric.total_requests}</TableCell>
                    <TableCell className="text-right">{metric.unique_identifiers}</TableCell>
                    <TableCell className="text-right">{metric.max_requests_per_identifier}</TableCell>
                    <TableCell className="text-right">{metric.avg_requests_per_identifier}</TableCell>
                    <TableCell className="text-center">
                      <div className={`flex items-center justify-center gap-2 ${getStatusColor(metric.high_usage_identifiers)}`}>
                        {getStatusIcon(metric.high_usage_identifiers)}
                        {metric.high_usage_identifiers === 0 ? 'Normal' : 
                         metric.high_usage_identifiers < 3 ? 'Warning' : 'Critical'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
