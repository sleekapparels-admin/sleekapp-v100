import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
  role: string;
  stats?: {
    activeOrders?: number;
    completedOrders?: number;
    avgLeadTime?: number;
    totalSpend?: number;
    onTimeDelivery?: number;
    delayedOrders?: number;
    capacityUtilization?: number;
  };
}

export const DashboardStats = ({ role, stats = {} }: DashboardStatsProps) => {
  const isBuyer = ['retailer', 'wholesaler', 'educational', 'corporate', 'sports_team'].includes(role);
  const isFactory = role === 'factory';

  if (isBuyer) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Currently in production</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgLeadTime || 45} days</div>
            <p className="text-xs text-muted-foreground">From order to delivery</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalSpend || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFactory) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Production</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Orders in progress</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Schedule</CardTitle>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((stats.activeOrders || 0) - (stats.delayedOrders || 0))}</div>
            <p className="text-xs text-muted-foreground">Meeting deadlines</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <div className="bg-red-500/10 p-2 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delayedOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.capacityUtilization || 85}%</div>
            <p className="text-xs text-muted-foreground">Factory utilization</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
