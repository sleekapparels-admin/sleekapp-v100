import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SampleRequest {
  id: string;
  order_id: string;
  status: string;
  sample_type: string;
  specifications: any;
  requested_at: string;
  requested_by: string;
  approved_at: string | null;
  rejected_at: string | null;
  notes: string;
  created_at: string | null;
  orders?: {
    order_number: string;
    product_name: string;
  };
}

interface SampleTrackingListProps {
  userId: string;
  role: string;
}

export const SampleTrackingList = ({ userId, role }: SampleTrackingListProps) => {
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamples();
  }, [userId, role]);

  const fetchSamples = async () => {
    try {
      const { data, error } = await supabase
        .from('sample_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setSamples(data.map(s => ({
          ...s,
          status: s.status ?? 'pending',
          requested_at: s.requested_at ?? new Date().toISOString(),
          requested_by: s.requested_by ?? '',
          notes: s.notes ?? ''
        })));
      }
    } catch (error: any) {
      console.error('Error fetching samples:', error);
      toast.error("Failed to load sample requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      case 'in_production': return 'outline';
      case 'shipped': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sample Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {samples.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No sample requests found
          </p>
        ) : (
          <div className="space-y-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(sample.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {sample.orders?.product_name || 'Product'}
                      </p>
                      <Badge variant={getStatusColor(sample.status)}>
                        {sample.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order: {sample.orders?.order_number || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requested: {format(new Date(sample.requested_at), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {sample.sample_type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/orders/${sample.order_id}`}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
