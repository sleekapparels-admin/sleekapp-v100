import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Factory, 
  Sparkles, 
  TrendingUp,
  Eye,
  Zap
} from 'lucide-react';
import { pageTransition, staggerContainer, staggerItem, hoverLift } from '@/lib/animations';
import { Helmet } from 'react-helmet';

const features = [
  {
    id: '1',
    title: 'Modern Buyer Dashboard',
    description: 'Stunning data visualization, smart recommendations, and one-click reordering',
    icon: ShoppingBag,
    color: 'from-blue-500 to-blue-600',
    path: '/buyer-dashboard-modern',
    features: [
      'Animated stat cards with trends',
      'Visual order timeline tracking',
      'Smart reorder suggestions',
      'Progress rings and charts',
      'Micro-interactions throughout'
    ]
  },
  {
    id: '2',
    title: 'Enhanced LoopTrace™',
    description: 'Timeline visualization with AI predictions and photo galleries',
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
    path: '/buyer-dashboard-modern',
    features: [
      'Interactive timeline with animations',
      'Photo lightbox galleries',
      'AI delay predictions',
      'Real-time progress tracking',
      'Expandable stage details'
    ]
  },
  {
    id: '3',
    title: 'Gamified Supplier Dashboard',
    description: 'Performance scores, tier system, and achievement badges',
    icon: Factory,
    color: 'from-orange-500 to-red-500',
    path: '/supplier-dashboard-modern',
    features: [
      'Performance score (0-100)',
      'Tier system (Bronze to Platinum)',
      'Achievement badges',
      'Urgent action alerts',
      'Capacity utilization tracking'
    ]
  },
];

export default function ModernShowcase() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Modern UI Showcase - New Features | Sleek Apparels</title>
        <meta name="description" content="Experience the new modern, sophisticated UI with animations, data visualization, and gamification." />
      </Helmet>

      <Navbar />

      <motion.div
        {...pageTransition}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6"
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold">
                New in 2025: Modern UI Transformation
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Experience the
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}Future{' '}
              </span>
              of B2B Sourcing
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Redesigned from the ground up with modern animations, data visualization, 
              and intelligent automation based on 2025 industry trends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => navigate('/buyer-dashboard-modern')}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Buyer Dashboard
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/supplier-dashboard-modern')}
              >
                <Factory className="mr-2 h-5 w-5" />
                View Supplier Dashboard
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={staggerItem}
                  {...hoverLift}
                >
                  <Card className="p-8 h-full bg-white/10 backdrop-blur-md border-white/20 cursor-pointer"
                    onClick={() => navigate(feature.path)}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100 mb-6">
                      {feature.description}
                    </p>

                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 + idx * 0.05 }}
                          className="flex items-center gap-2 text-sm text-blue-100"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>

                    <Button 
                      variant="outline"
                      className="w-full mt-6 border-white/30 text-white hover:bg-white/10"
                    >
                      Explore →
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* What's New Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What's New in This Update
              </h2>
              <p className="text-blue-100 text-lg">
                Based on comprehensive research of 2025 UI/UX trends and competitor analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Sparkles, title: 'Framer Motion Animations', description: 'Smooth, performant animations throughout' },
                { icon: TrendingUp, title: 'Data Visualization', description: 'Charts, graphs, and progress rings with Recharts' },
                { icon: Zap, title: 'Micro-Interactions', description: 'Delightful hover states, transitions, and feedback' },
                { icon: Eye, title: 'Modern Design Tokens', description: 'Consistent colors, spacing, and typography' },
              ].map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="p-3 bg-white/10 rounded-lg">
                      <ItemIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-100">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <p className="text-blue-100 mb-6">
              All changes have been committed to main branch and will auto-deploy to production
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
              onClick={() => navigate('/')}
            >
              Back to Homepage
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
}
