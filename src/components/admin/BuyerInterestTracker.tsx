import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Mail,
  Phone,
  Building,
  Target,
  Zap,
  Clock,
  DollarSign,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BuyerActivity {
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string;
  total_quotes: number;
  interested_quotes: number;
  converted_orders: number;
  total_value: number;
  last_activity: string;
  conversion_rate: number;
  interest_level: 'hot' | 'warm' | 'cold';
  follow_up_needed: boolean;
  days_since_contact: number;
}

export function BuyerInterestTracker() {
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch buyer activity data
  const { data: buyerActivities = [], isLoading } = useQuery({
    queryKey: ['buyer-activities'],
    queryFn: async () => {
      // Fetch all buyers with their activity
      const { data: buyers, error: buyersError } = await supabase
        .from('profiles')
        .select('*');

      if (buyersError) throw buyersError;

      // Fetch all quotes grouped by buyer
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*');

      if (quotesError) throw quotesError;

      // Fetch all orders grouped by buyer
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Calculate activities for each buyer
      const activities: BuyerActivity[] = buyers
        .filter(buyer => buyer.id)
        .map(buyer => {
          const buyerQuotes = quotes?.filter(q => q.buyer_id === buyer.id) || [];
          const buyerOrders = orders?.filter(o => o.buyer_id === buyer.id) || [];
          const interestedQuotes = buyerQuotes.filter(q => q.status === 'interested' || q.status === 'assigned');
          const totalValue = buyerOrders.reduce((sum, o) => sum + (o.buyer_price || 0), 0);
          const conversionRate = buyerQuotes.length > 0 
            ? (buyerOrders.length / buyerQuotes.length) * 100 
            : 0;

          // Determine last activity
          const lastQuote = buyerQuotes.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          const lastOrder = buyerOrders.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          const lastActivityDate = lastOrder?.created_at || lastQuote?.created_at || buyer.created_at;
          const daysSinceContact = Math.floor(
            (new Date().getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          // Determine interest level
          let interestLevel: 'hot' | 'warm' | 'cold' = 'cold';
          if (daysSinceContact <= 7 && buyerQuotes.length > 0) {
            interestLevel = 'hot';
          } else if (daysSinceContact <= 30 && buyerQuotes.length > 0) {
            interestLevel = 'warm';
          }

          return {
            buyer_id: buyer.id,
            buyer_name: buyer.full_name || 'Unknown',
            buyer_email: buyer.email || '',
            buyer_company: buyer.company_name || 'N/A',
            total_quotes: buyerQuotes.length,
            interested_quotes: interestedQuotes.length,
            converted_orders: buyerOrders.length,
            total_value: totalValue,
            last_activity: lastActivityDate,
            conversion_rate: conversionRate,
            interest_level: interestLevel,
            follow_up_needed: daysSinceContact > 7 && buyerQuotes.length > 0 && buyerOrders.length === 0,
            days_since_contact: daysSinceContact,
          };
        })
        .filter(activity => activity.total_quotes > 0) // Only show buyers with activity
        .sort((a, b) => b.total_quotes - a.total_quotes);

      return activities;
    },
  });

  // Filter by tab
  const filteredActivities = buyerActivities.filter(activity => {
    if (selectedTab === 'hot') return activity.interest_level === 'hot';
    if (selectedTab === 'warm') return activity.interest_level === 'warm';
    if (selectedTab === 'cold') return activity.interest_level === 'cold';
    if (selectedTab === 'follow-up') return activity.follow_up_needed;
    return true;
  });

  // Calculate overall stats
  const stats = {
    totalBuyers: buyerActivities.length,
    hotLeads: buyerActivities.filter(b => b.interest_level === 'hot').length,
    avgConversionRate: buyerActivities.length > 0
      ? buyerActivities.reduce((sum, b) => sum + b.conversion_rate, 0) / buyerActivities.length
      : 0,
    totalRevenue: buyerActivities.reduce((sum, b) => sum + b.total_value, 0),
    followUpNeeded: buyerActivities.filter(b => b.follow_up_needed).length,
  };

  const getInterestBadge = (level: string) => {
    const config = {
      hot: { color: 'bg-red-500', label: '🔥 Hot', variant: 'destructive' as const },
      warm: { color: 'bg-orange-500', label: '☀️ Warm', variant: 'default' as const },
      cold: { color: 'bg-blue-500', label: '❄️ Cold', variant: 'secondary' as const },
    };
    return config[level as keyof typeof config] || config.cold;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Buyer Interest Tracker
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor buyer engagement and conversion rates
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuyers}</div>
            <p className="text-xs text-muted-foreground mt-1">With quote activity</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">🔥 Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.hotLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">High engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.avgConversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Quote to order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground mt-1">From tracked buyers</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">⏰ Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.followUpNeeded}</div>
            <p className="text-xs text-muted-foreground mt-1">Action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Buyer Activities Table */}
      <Card>
        <CardHeader>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Buyers</TabsTrigger>
              <TabsTrigger value="hot">🔥 Hot</TabsTrigger>
              <TabsTrigger value="warm">☀️ Warm</TabsTrigger>
              <TabsTrigger value="cold">❄️ Cold</TabsTrigger>
              <TabsTrigger value="follow-up">⏰ Follow-up</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Interest Level</TableHead>
                <TableHead>Quotes</TableHead>
                <TableHead>Interested</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => {
                const interestConfig = getInterestBadge(activity.interest_level);
                return (
                  <TableRow key={activity.buyer_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{activity.buyer_name}</div>
                        <div className="text-sm text-muted-foreground">{activity.buyer_company}</div>
                        <div className="text-xs text-muted-foreground">{activity.buyer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={interestConfig.variant}>
                        {interestConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{activity.total_quotes}</TableCell>
                    <TableCell className="text-blue-600">{activity.interested_quotes}</TableCell>
                    <TableCell className="text-green-600">{activity.converted_orders}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={activity.conversion_rate} className="w-16" />
                        <span className="text-sm font-medium">{activity.conversion_rate.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${activity.total_value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(activity.last_activity), { addSuffix: true })}
                      </div>
                      {activity.follow_up_needed && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Follow-up needed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No buyers found in this category</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
