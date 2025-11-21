import { motion } from 'framer-motion';
import { useState } from 'react';
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
  RefreshCw
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

// Mock data - Replace with real API calls
const mockStats = {
  activeOrders: 8,
  pendingQuotes: 3,
  totalSpent: '$47,250',
  avgDeliveryTime: '16 days',
};

const mockOrders = [
  {
    id: '12345',
    product: 'Polo Shirts',
    quantity: 500,
    status: 'In Production',
    progress: 65,
    stage: 'Quality Check',
    supplier: 'ABC Textiles',
    dueDate: '2025-12-05',
    daysRemaining: 12,
    estimatedDelivery: 'Dec 5, 2025',
    looptraceUpdates: 8,
    lastUpdate: '2 hours ago',
  },
  {
    id: '12346',
    product: 'Hoodies',
    quantity: 200,
    status: 'Cutting',
    progress: 25,
    stage: 'Cutting',
    supplier: 'XYZ Manufacturing',
    dueDate: '2025-12-15',
    daysRemaining: 22,
    estimatedDelivery: 'Dec 15, 2025',
    looptraceUpdates: 3,
    lastUpdate: '1 day ago',
  },
  {
    id: '12347',
    product: 'T-Shirts',
    quantity: 1000,
    status: 'Fabric Sourcing',
    progress: 10,
    stage: 'Fabric Sourcing',
    supplier: 'Best Apparel Co.',
    dueDate: '2025-12-20',
    daysRemaining: 27,
    estimatedDelivery: 'Dec 20, 2025',
    looptraceUpdates: 1,
    lastUpdate: '3 days ago',
  },
];

const mockRecommendations = [
  {
    id: '1',
    type: 'reorder',
    title: 'Ready to Reorder Polo Shirts?',
    description: 'You typically reorder every 45 days. Last order was 42 days ago.',
    action: 'Reorder Now',
    icon: RefreshCw,
    color: 'primary' as const,
  },
  {
    id: '2',
    type: 'seasonal',
    title: 'Summer Collection Prep',
    description: 'Start ordering for summer season now to avoid delays.',
    action: 'Browse Products',
    icon: TrendingUp,
    color: 'accent' as const,
  },
];

export default function ModernBuyerDashboard() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending'>('all');

  const filteredOrders = mockOrders;

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
              Welcome back, User! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's what's happening with your orders today
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
                value={mockStats.activeOrders}
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
                value={mockStats.pendingQuotes}
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
                value={mockStats.totalSpent}
                change={{ value: 18, label: 'vs last month' }}
                trend="up"
                icon={DollarSign}
                color="success"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <StatCard
                title="Avg Delivery"
                value={mockStats.avgDeliveryTime}
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
                    Active Orders ({mockOrders.length})
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

                <div className="space-y-4">
                  {filteredOrders.map((order, index) => (
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Supplier</p>
                            <p className="font-medium">{order.supplier}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Delivery</p>
                            <p className="font-medium">{order.estimatedDelivery}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Days Left</p>
                            <p className="font-medium text-primary">{order.daysRemaining} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">LoopTrace™</p>
                            <p className="font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              {order.looptraceUpdates} updates
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Last update: {order.lastUpdate}
                          </span>
                          <Button size="sm" variant="ghost" className="text-primary">
                            View LoopTrace™ →
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Recommendations & Quick Stats */}
            <div className="space-y-6">
              {/* Performance Ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
                  <div className="flex justify-center mb-4">
                    <ProgressRing
                      progress={78}
                      size={140}
                      strokeWidth={12}
                      color="primary"
                      label="Orders Completed"
                    />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">On-time orders</span>
                      <span className="font-semibold text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Quality satisfaction</span>
                      <span className="font-semibold text-blue-600">4.8/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Repeat orders</span>
                      <span className="font-semibold text-orange-600">42%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Smart Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Smart Recommendations</h3>
                {mockRecommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      {...hoverLift}
                    >
                      <Card className="p-4 cursor-pointer border-2 hover:border-primary/50">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            rec.color === 'primary' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3">
                              {rec.description}
                            </p>
                            <Button size="sm" variant="outline" className="w-full">
                              {rec.action}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Quick Alert */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900 mb-1">
                        Peak Season Ahead
                      </h4>
                      <p className="text-xs text-amber-800">
                        Order now to avoid 2-3 week delays during peak season (Jan-Feb).
                      </p>
                    </div>
                  </div>
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
