import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, DollarSign, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  source: string;
  ip_address: string;
  details: any;
  created_at: string;
}

interface CostData {
  hour: string;
  function_name: string;
  model: string;
  request_count: number;
  total_cost: number;
}

interface SecuritySummary {
  day: string;
  event_type: string;
  severity: string;
  event_count: number;
  unique_ips: number;
}

export const SecurityMonitoringDashboard = () => {
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [costData, setCostData] = useState<CostData[]>([]);
  const [securitySummary, setSecuritySummary] = useState<SecuritySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    
    // Set up real-time subscription for new security events
    const channel = supabase
      .channel('security-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events',
        },
        (payload) => {
          const newEvent = payload.new as SecurityEvent;
          setRecentEvents(prev => [newEvent, ...prev].slice(0, 10));
          
          if (newEvent.severity === 'critical' || newEvent.severity === 'high') {
            toast.error(`Security Alert: ${newEvent.event_type}`, {
              description: `${newEvent.severity.toUpperCase()} - ${newEvent.source}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch recent security events
      const { data: events, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;
      setRecentEvents(events || []);

      // Fetch hourly cost data (last 24 hours)
      const { data: costs, error: costsError } = await supabase
        .from('ai_hourly_costs')
        .select('*')
        .gte('hour', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('hour', { ascending: false });

      if (costsError) throw costsError;
      setCostData(costs || []);

      // Fetch security summary (last 7 days)
      const { data: summary, error: summaryError } = await supabase
        .from('daily_security_summary')
        .select('*')
        .gte('day', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('day', { ascending: false });

      if (summaryError) throw summaryError;
      setSecuritySummary(summary || []);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const totalDailyCost = costData.reduce((sum, item) => sum + Number(item.total_cost), 0);
  const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
  const highEvents = recentEvents.filter(e => e.severity === 'high').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
          <p className="text-muted-foreground">Real-time security events and AI cost tracking</p>
        </div>
        <Shield className="h-12 w-12 text-primary" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
            <p className="text-xs text-muted-foreground">Last 10 events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highEvents}</div>
            <p className="text-xs text-muted-foreground">Last 10 events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily AI Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDailyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEvents.length}</div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Live feed of security events and suspicious activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No security events recorded</p>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">{event.event_type.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Source: {event.source}</p>
                    <p className="text-xs text-muted-foreground">IP: {event.ip_address}</p>
                    {event.details && (
                      <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>AI API Cost Breakdown</CardTitle>
          <CardDescription>Hourly cost analysis by function and model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {costData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No cost data available</p>
            ) : (
              costData.map((cost, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{cost.function_name}</p>
                    <p className="text-xs text-muted-foreground">{cost.model}</p>
                    <p className="text-xs text-muted-foreground">
                      {cost.request_count} requests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${Number(cost.total_cost).toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cost.hour).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Security Summary</CardTitle>
          <CardDescription>Aggregated security events by type and severity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securitySummary.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No summary data available</p>
            ) : (
              securitySummary.map((summary, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{summary.event_type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {summary.unique_ips} unique IPs
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(summary.severity)}`}>
                      {summary.severity}
                    </span>
                    <p className="text-sm font-bold mt-1">{summary.event_count} events</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
