import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  FileText, 
  DollarSign, 
  Package, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { StatCard } from '@/components/modern/StatCard';
import { ProgressRing } from '@/components/modern/ProgressRing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageTransition, staggerContainer, staggerItem, hoverLift } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useOrdersByBuyer } from '@/hooks/queries/useOrders';
import { useQuotes } from '@/hooks/useQuotes';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function ModernBuyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [userName, setUserName] = useState<string>('User');
  const [customerType, setCustomerType] = useState<string>('');

  const userId = user?.id || null;

  // Get user profile data
  useEffect(() => {
    const getUserProfile = async () => {
      if (!user) return;

      try {
        // Get customer type from user metadata
        if (user.user_metadata?.customer_type) {
          setCustomerType(user.user_metadata.customer_type);
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
        }

        if (profile?.full_name) {
          setUserName(profile.full_name.split(' ')[0]); // First name only
        }
      } catch (err) {
        console.error('Profile error:', err);
      }
    };
    getUserProfile();
  }, [user]);

  // Fetch real data
  const { data: orders = [], isLoading: ordersLoading } = useOrdersByBuyer(userId || '');
  const { data: quotes = [], isLoading: quotesLoading } = useQuotes();

  // Calculate stats from real data
  const activeOrders = (orders || []).filter(o => 
    o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'rejected'
  ).length;
  
  const pendingQuotes = (quotes || []).filter(q => q.status === 'pending' || q.status === 'draft').length;
  
  const totalSpent = (orders || [])
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + (Number(order.buyer_price) || 0), 0);
  
  const completedOrders = (orders || []).filter(o => o.status === 'completed');
  const avgDeliveryTime = completedOrders.length > 0
    ? Math.round(completedOrders.reduce((sum, order) => {
        if (order.created_at && order.updated_at) {
          return sum + differenceInDays(new Date(order.updated_at), new Date(order.created_at));
        }
        return sum;
      }, 0) / completedOrders.length)
    : 0;

  // Map real orders to display format
  const mappedOrders = (orders || [])
    .filter(o => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'active') return o.status === 'in_production' || o.status === 'cutting' || o.status === 'sewing';
      if (selectedFilter === 'pending') return o.status === 'pending' || o.status === 'awaiting_approval';
      return true;
    })
    .map(order => {
      // Calculate progress based on status
      let progress = 0;
      let stage = 'Pending';
      
      switch (order.status) {
        case 'pending':
        case 'awaiting_approval':
          progress = 5;
          stage = 'Awaiting Approval';
          break;
        case 'fabric_sourcing':
          progress = 15;
          stage = 'Fabric Sourcing';
          break;
        case 'cutting':
          progress = 30;
          stage = 'Cutting';
          break;
        case 'sewing':
          progress = 50;
          stage = 'Sewing';
          break;
        case 'quality_check':
          progress = 75;
          stage = 'Quality Check';
          break;
        case 'in_production':
          progress = 40;
          stage = 'In Production';
          break;
        case 'packaging':
          progress = 85;
          stage = 'Packaging';
          break;
        case 'shipped':
          progress = 95;
          stage = 'Shipped';
          break;
        case 'completed':
          progress = 100;
          stage = 'Completed';
          break;
        default:
          progress = 10;
          stage = 'Processing';
      }

      const dueDate = (order as any).target_date 
        ? new Date((order as any).target_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

      return {
        id: order.order_number || order.id,
        product: order.product_type || 'Product',
        quantity: order.quantity || 0,
        status: order.status,
        progress,
        stage,
        supplier: (order as any).suppliers?.company_name || 'Sleek Apparels',
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        daysRemaining: differenceInDays(dueDate, new Date()),
        estimatedDelivery: format(dueDate, 'MMM d, yyyy'),
        looptraceUpdates: 0, // Can be enhanced with real tracking data
        lastUpdate: order.updated_at ? format(new Date(order.updated_at), "'Updated' h:mm a") : 'Recently',
      };
    });

  // Smart recommendations based on real data
  const recommendations = [];
  
  // Check for reorder opportunities
  const recentCompletedOrders = (orders || [])
    .filter(o => o.status === 'completed')
    .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
    .slice(0, 3);

  type Recommendation = {
    id: string;
    type: string;
    title: string;
    description: string;
    action: string;
    icon: React.ForwardRefExoticComponent<Omit<any, "ref"> & React.RefAttributes<SVGSVGElement>>;
    color: 'primary' | 'accent';
    onClick: () => void;
  };

  if (recentCompletedOrders.length > 0) {
    const lastOrder = recentCompletedOrders[0];
    const daysSinceLastOrder = lastOrder.updated_at 
      ? differenceInDays(new Date(), new Date(lastOrder.updated_at))
      : 999;
    
    if (daysSinceLastOrder > 40) {
      recommendations.push({
        id: '1',
        type: 'reorder',
        title: `Ready to Reorder ${lastOrder.product_type}?`,
        description: `Last order was ${daysSinceLastOrder} days ago. Keep your inventory stocked.`,
        action: 'Reorder Now',
        icon: RefreshCw,
        color: 'primary' as const,
        onClick: () => navigate('/instant-quote'),
      } as Recommendation);
    }
  }

  // Add seasonal recommendation
  recommendations.push({
    id: '2',
    type: 'seasonal',
    title: 'Plan Ahead for Next Season',
    description: 'Start ordering for next season now to avoid delays and get better pricing.',
    action: 'Browse Products',
    icon: TrendingUp,
    color: 'accent' as const,
    onClick: () => navigate('/products'),
  } as Recommendation);

  // Show loading state while fetching user or data
  if (!userId || ordersLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Buyer Dashboard - Track Orders & Get Quotes | Sleek Apparels</title>
        <meta name="description" content="Modern buyer dashboard with real-time order tracking, instant quotes, and smart reorder suggestions powered by LoopTrace™ AI." />
      </Helmet>

      <Navbar />

      <motion.div
        {...pageTransition}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pt-24 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              {customerType === 'fashion_brand' && "Manage your fashion brand's production orders"}
              {customerType === 'educational' && "Track your school uniform orders"}
              {customerType === 'corporate' && "Monitor your corporate apparel production"}
              {customerType === 'sports_team' && "Follow your team's sportswear production"}
              {customerType === 'wholesaler' && "Oversee your wholesale inventory orders"}
              {!customerType && "Here's what's happening with your orders today"}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={staggerItem}>
              <StatCard
                title="Active Orders"
                value={activeOrders}
                change={{ value: 12, label: 'vs last month' }}
                trend="up"
                icon={Package}
                color="primary"
                onClick={() => navigate('/orders')}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Pending Quotes"
                value={pendingQuotes}
                change={{ value: 5, label: 'vs last week' }}
                trend="down"
                icon={FileText}
                color="accent"
                onClick={() => navigate('/quotes')}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Total Spent"
                value={`$${totalSpent.toLocaleString()}`}
                change={{ value: 18, label: 'vs last month' }}
                trend="up"
                icon={DollarSign}
                color="success"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Avg Delivery"
                value={avgDeliveryTime > 0 ? `${avgDeliveryTime} days` : 'N/A'}
                change={{ value: 2, label: 'days faster' }}
                trend="up"
                icon={Clock}
                color="warning"
              />
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Need Something Fast?
                  </h3>
                  <p className="text-muted-foreground">
                    Get an instant quote in 30 seconds or reorder your previous products
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={() => navigate('/instant-quote')}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Instant Quote
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Reorder
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Active Orders */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Active Orders ({mappedOrders.length})
                  </h2>
                  <div className="flex gap-2">
                    {(['all', 'active', 'pending'] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant={selectedFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedFilter(filter)}
                        className="capitalize"
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>

                {mappedOrders.length === 0 ? (
                  <Card className="p-12 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start by getting an instant quote for your first order
                    </p>
                    <Button onClick={() => navigate('/instant-quote')}>
                      <Zap className="mr-2 h-4 w-4" />
                      Get Instant Quote
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {mappedOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        {...hoverLift}
                      >
                        <Card className="p-6 cursor-pointer" onClick={() => navigate(`/orders/${order.id}/track`)}>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {order.product} • {order.quantity} pieces
                              </p>
                            </div>
                            <Badge 
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {order.stage}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">
                                Production Progress
                              </span>
                              <span className="text-sm font-semibold text-primary">
                                {order.progress}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${order.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-primary to-accent"
                              />
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Supplier</p>
                              <p className="font-medium text-foreground">{order.supplier}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Delivery</p>
                              <p className="font-medium text-foreground">{order.estimatedDelivery}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Last Update</p>
                              <p className="font-medium text-foreground">{order.lastUpdate}</p>
                            </div>
                          </div>

                          {/* LoopTrace Updates Indicator */}
                          {order.daysRemaining > 0 && order.daysRemaining < 7 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-orange-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {order.daysRemaining} days until delivery
                                </span>
                              </div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - AI Recommendations */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Smart Suggestions
                </h3>

                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    {...hoverLift}
                  >
                    <Card 
                      className="p-5 cursor-pointer mb-4 bg-gradient-to-br from-card to-card/50 border-primary/20"
                      onClick={rec.onClick}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-${rec.color}/10`}>
                          <rec.icon className={`h-6 w-6 text-${rec.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rec.description}
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recent Quotes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold text-foreground mb-4">Recent Quotes</h3>
                <Card className="p-5">
                  {quotes.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground">No quotes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotes.slice(0, 3).map((quote: any) => (
                        <div 
                          key={quote.id}
                          className="p-3 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/quotes/${quote.id}`)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {quote.product_type}
                            </span>
                            <Badge variant={
                              quote.status === 'approved' ? 'default' : 
                              quote.status === 'pending' ? 'secondary' : 
                              'outline'
                            }>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {quote.quantity} pieces • {format(new Date(quote.created_at), 'MMM d')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
