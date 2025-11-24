import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Trophy,
  TrendingUp,
  Package,
  DollarSign,
  Star,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Camera,
  Award,
  Zap
} from 'lucide-react';
import { StatCard } from '@/components/modern/StatCard';
import { ProgressRing } from '@/components/modern/ProgressRing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageTransition, staggerContainer, staggerItem, hoverLift, bounceIn } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupplierByUser } from '@/hooks/queries/useSuppliers';
import { useOrdersByFactory } from '@/hooks/queries/useOrders';
import { useSupplierQuotes } from '@/hooks/useQuotes';
import { AssignedQuotesPanel } from '@/components/supplier/AssignedQuotesPanel';

// Mock data
const performanceScore = {
  overall: 87,
  onTimeDelivery: 92,
  qualityScore: 4.8,
  looptraceCompliance: 78,
  communicationScore: 95,
  tier: 'GOLD',
  tierProgress: 68, // Progress to next tier (Platinum)
  pointsToNextTier: 13,
};

const stats = {
  activeOrders: 12,
  monthlyRevenue: '$24,500',
  capacityUtilization: 72,
  avgRating: 4.8,
};

const urgentActions = [
  {
    id: '1',
    type: 'photo_update',
    order: '#12345',
    product: 'Polo Shirts',
    message: 'Upload Quality Check photos',
    dueIn: '2 hours',
    priority: 'high',
  },
  {
    id: '2',
    type: 'quote',
    order: '#12350',
    product: 'Hoodies',
    message: 'Respond to quote request',
    dueIn: '4 hours',
    priority: 'high',
  },
  {
    id: '3',
    type: 'update',
    order: '#12346',
    product: 'T-Shirts',
    message: 'Update production status',
    dueIn: '1 day',
    priority: 'medium',
  },
];

const tierBenefits = {
  BRONZE: ['Standard visibility', 'Standard support'],
  SILVER: ['Standard visibility', 'Standard support', 'Quality badge'],
  GOLD: ['Enhanced visibility', 'Priority support', 'Gold badge', '5% fee discount'],
  PLATINUM: ['Featured placement', '24/7 support', 'Platinum badge', '10% fee discount', 'Marketing support'],
};

const achievements = [
  { id: '1', name: 'Perfect Week', description: '7 days of on-time updates', icon: Star, unlocked: true },
  { id: '2', name: 'Quality Master', description: '4.8+ rating for 30 days', icon: Award, unlocked: true },
  { id: '3', name: 'Speed Demon', description: '10 orders delivered early', icon: Zap, unlocked: false },
  { id: '4', name: 'Photo Pro', description: '100% LoopTrace compliance', icon: Camera, unlocked: false },
];

export default function ModernSupplierDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState<string>('Supplier');

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Fetch real supplier data
  const { data: supplier, isLoading: supplierLoading } = useSupplierByUser(userId || '');
  const { data: orders = [], isLoading: ordersLoading } = useOrdersByFactory(supplier?.id || '');
  const { data: quotes = [], isLoading: quotesLoading } = useSupplierQuotes();

  // Set supplier name
  useEffect(() => {
    if (supplier?.company_name) {
      setSupplierName(supplier.company_name);
    }
  }, [supplier]);

  // Calculate real stats
  const activeOrders = orders.filter(o => 
    o.status !== 'completed' && o.status !== 'cancelled' && o.status !== 'rejected'
  ).length;
  
  const monthlyRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.created_at || '');
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return orderDate >= monthAgo;
    })
    .reduce((sum, order) => sum + (Number(order.supplier_price) || 0), 0);
  
  const capacityUtilization = (supplier as any)?.total_capacity_monthly 
    ? Math.min(100, Math.round((activeOrders * 100) / ((supplier as any).total_capacity_monthly / 500)))
    : 0;
  
  const avgRating = (supplier as any)?.supplier_ratings?.[0]?.overall_score || 0;

  // Calculate performance score
  const completedOrders = orders.filter(o => o.status === 'completed');
  const onTimeOrders = completedOrders.filter(o => {
    // This would need actual delivery tracking data
    return true; // Placeholder
  });
  const onTimeDelivery = completedOrders.length > 0 
    ? Math.round((onTimeOrders.length / completedOrders.length) * 100)
    : 0;

  const looptraceCompliance = Math.round((avgRating / 5) * 100);
  
  const performanceScore = {
    overall: Math.round((onTimeDelivery + looptraceCompliance + (avgRating * 20)) / 3),
    onTimeDelivery,
    qualityScore: avgRating,
    looptraceCompliance,
    communicationScore: Math.round((avgRating / 5) * 100),
    tier: (supplier as any)?.tier || 'BRONZE',
    tierProgress: 68,
    pointsToNextTier: 13,
  };

  const stats = {
    activeOrders,
    monthlyRevenue: `$${monthlyRevenue.toLocaleString()}`,
    capacityUtilization,
    avgRating,
  };

  // Extract urgent actions from real data
  const urgentActions = orders
    .filter(o => o.status === 'quality_check' || o.status === 'awaiting_approval')
    .slice(0, 3)
    .map(order => ({
      id: order.id,
      type: order.status === 'quality_check' ? 'photo_update' : 'update',
      order: order.order_number || order.id,
      product: order.product_type || 'Product',
      message: order.status === 'quality_check' ? 'Upload Quality Check photos' : 'Update production status',
      dueIn: '2 hours',
      priority: 'high' as const,
    }));

  // Add pending quote responses
  const pendingQuotes = quotes
    .filter((q: any) => q.status === 'pending')
    .slice(0, 2)
    .map((quote: any) => ({
      id: quote.id,
      type: 'quote',
      order: quote.quotes?.product_type || 'Quote',
      product: quote.quotes?.product_type || 'Product',
      message: 'Respond to quote request',
      dueIn: '4 hours',
      priority: 'high' as const,
    }));

  urgentActions.push(...pendingQuotes);

  if (supplierLoading || ordersLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50/30">
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-500 to-pink-500';
      case 'GOLD': return 'from-yellow-500 to-orange-500';
      case 'SILVER': return 'from-gray-400 to-gray-500';
      default: return 'from-amber-700 to-amber-900';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return '💎';
      case 'GOLD': return '🥇';
      case 'SILVER': return '🥈';
      default: return '🥉';
    }
  };

  return (
    <>
      <Helmet>
        <title>Supplier Dashboard - Manage Orders & Performance | Sleek Apparels</title>
        <meta name="description" content="Track your performance, manage orders, and grow your business with gamified supplier dashboard." />
      </Helmet>

      <Navbar />

      <motion.div
        {...pageTransition}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 pt-24 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Performance Score */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Supplier Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Keep up the great work! 🚀
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/supplier/products')}
                >
                  <Package className="mr-2 h-5 w-5" />
                  My Products
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload Photos
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Performance Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className={cn(
              "p-8 relative overflow-hidden",
              "bg-gradient-to-r",
              getTierColor(performanceScore.tier)
            )}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <motion.span 
                        {...bounceIn}
                        className="text-5xl"
                      >
                        {getTierIcon(performanceScore.tier)}
                      </motion.span>
                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {performanceScore.tier} TIER
                        </h2>
                        <p className="text-white/80 text-sm">
                          Top 15% of all suppliers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="text-6xl font-bold text-white mb-1"
                    >
                      {performanceScore.overall}
                    </motion.div>
                    <p className="text-white/80">Performance Score</p>
                  </div>
                </div>

                {/* Progress to Next Tier */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      Progress to PLATINUM
                    </span>
                    <span className="text-white font-bold">
                      {performanceScore.pointsToNextTier} points to go
                    </span>
                  </div>
                  <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${performanceScore.tierProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                      <span className="text-white/80 text-sm">On-Time</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {performanceScore.onTimeDelivery}%
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-white" />
                      <span className="text-white/80 text-sm">Quality</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {performanceScore.qualityScore}/5
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="h-4 w-4 text-white" />
                      <span className="text-white/80 text-sm">LoopTrace™</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {performanceScore.looptraceCompliance}%
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-white" />
                      <span className="text-white/80 text-sm">Response</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {performanceScore.communicationScore}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="secondary" className="w-full">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Improvement Tips
                  </Button>
                </div>
              </div>
            </Card>
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
                value={stats.activeOrders}
                change={{ value: 8, label: 'vs last month' }}
                trend="up"
                icon={Package}
                color="primary"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Monthly Revenue"
                value={stats.monthlyRevenue}
                change={{ value: 15, label: 'vs last month' }}
                trend="up"
                icon={DollarSign}
                color="success"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Capacity Used"
                value={`${stats.capacityUtilization}%`}
                change={{ value: 12, label: 'vs last month' }}
                trend="up"
                icon={TrendingUp}
                color="accent"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Average Rating"
                value={stats.avgRating}
                change={{ value: 2, label: 'vs last month' }}
                trend="up"
                icon={Star}
                color="warning"
              />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Urgent Actions */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    Urgent Actions ({urgentActions.filter(a => a.priority === 'high').length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {urgentActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      {...hoverLift}
                    >
                      <Card className={cn(
                        "p-5 cursor-pointer border-2",
                        action.priority === 'high' ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'
                      )}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={cn(
                                action.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                              )}>
                                {action.priority === 'high' ? 'URGENT' : 'SOON'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Order {action.order}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {action.message}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {action.product}
                            </p>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Due in {action.dueIn}</span>
                            </div>
                          </div>

                          <Button 
                            className={cn(
                              "ml-4",
                              action.priority === 'high' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-amber-500 hover:bg-amber-600'
                            )}
                          >
                            Take Action
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Assigned Quotes Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-500" />
                  Assigned Quotes
                </h2>
                <AssignedQuotesPanel supplierId={supplier?.id || ''} />
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  Achievements
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <Card className={cn(
                          "p-4 text-center",
                          achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 opacity-60'
                        )}>
                          <motion.div
                            animate={achievement.unlocked ? {
                              rotate: [0, -10, 10, -10, 10, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                          >
                            <Icon className={cn(
                              "h-10 w-10 mx-auto mb-2",
                              achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                            )} />
                          </motion.div>
                          <h3 className="font-semibold text-sm mb-1">
                            {achievement.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                          {achievement.unlocked && (
                            <Badge className="mt-2 bg-yellow-500">
                              Unlocked!
                            </Badge>
                          )}
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tier Benefits */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Your Benefits
                  </h3>
                  <div className="space-y-3">
                    {tierBenefits[performanceScore.tier as keyof typeof tierBenefits].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    See All Tier Benefits
                  </Button>
                </Card>
              </motion.div>

              {/* Performance Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Capacity Status</h3>
                  <div className="flex justify-center mb-4">
                    <ProgressRing
                      progress={stats.capacityUtilization}
                      size={140}
                      strokeWidth={12}
                      color="accent"
                      label="Available Capacity"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    You have {100 - stats.capacityUtilization}% capacity available for new orders
                  </p>
                  <Button variant="outline" className="w-full">
                    Update Capacity
                  </Button>
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
