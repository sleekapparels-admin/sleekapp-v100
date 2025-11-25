import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function SupplierAnalyticsCard() {
  const { data: supplierStats, isLoading } = useQuery({
    queryKey: ['supplier-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('verification_status');

      if (error) throw error;

      const stats = {
        verified: data.filter(s => s.verification_status === 'verified').length,
        pending: data.filter(s => s.verification_status === 'pending').length,
        rejected: data.filter(s => s.verification_status === 'rejected').length,
        suspended: data.filter(s => s.verification_status === 'suspended').length,
        total: data.length,
      };

      return stats;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const hasPending = (supplierStats?.pending || 0) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Supplier Network Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold">{supplierStats?.verified || 0}</p>
            </div>
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{supplierStats?.pending || 0}</p>
            </div>
            {hasPending && <AlertCircle className="h-5 w-5 text-yellow-600" />}
          </div>

          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{supplierStats?.rejected || 0}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div>
              <p className="text-sm text-muted-foreground">Suspended</p>
              <p className="text-2xl font-bold">{supplierStats?.suspended || 0}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Suppliers</span>
            <span className="text-2xl font-bold">{supplierStats?.total || 0}</span>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link to="/admin/suppliers">
            {hasPending ? 'Review Pending Suppliers' : 'Manage Suppliers'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
