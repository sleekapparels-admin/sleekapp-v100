import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  FileText,
  CreditCard,
  Package,
  CheckCircle2,
  ArrowRight,
  Store,
  Upload,
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Star,
  Target,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/animations';

const BUYER_JOURNEY = [
  {
    step: 1,
    title: 'Browse Marketplace',
    description: 'Explore thousands of quality products from verified suppliers',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Advanced search filters',
      'Verified supplier badges',
      'Real-time inventory',
      'Quality ratings',
    ],
  },
  {
    step: 2,
    title: 'Get Instant Quote',
    description: 'Our AI generates accurate pricing in under 60 seconds',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    details: [
      'AI-powered pricing',
      'Multiple supplier options',
      'Transparent breakdown',
      'Instant comparison',
    ],
  },
  {
    step: 3,
    title: 'Place Order',
    description: 'Simple checkout with secure payment options',
    icon: ShoppingBag,
    color: 'from-orange-500 to-red-500',
    details: [
      'Secure payment gateway',
      'Escrow protection',
      'Flexible terms',
      'Order confirmation',
    ],
  },
  {
    step: 4,
    title: 'Track Production',
    description: 'Real-time updates with photo verification at every stage',
    icon: Package,
    color: 'from-green-500 to-emerald-500',
    details: [
      'LoopTrace™ photo updates',
      'Live production status',
      'Quality checkpoints',
      'Direct communication',
    ],
  },
  {
    step: 5,
    title: 'Receive & Review',
    description: 'Get your order and share your experience',
    icon: CheckCircle2,
    color: 'from-indigo-500 to-purple-500',
    details: [
      'Quality assurance',
      'Fast shipping',
      'Easy returns',
      'Review & ratings',
    ],
  },
];

const SUPPLIER_JOURNEY = [
  {
    step: 1,
    title: 'Create Profile',
    description: 'Set up your supplier profile and showcase your capabilities',
    icon: Store,
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Company verification',
      'Capability showcase',
      'Certification upload',
      'Portfolio gallery',
    ],
  },
  {
    step: 2,
    title: 'List Products',
    description: 'Upload your products to the marketplace with ease',
    icon: Upload,
    color: 'from-purple-500 to-pink-500',
    details: [
      'Bulk product upload',
      'Image optimization',
      'Pricing automation',
      'Instant publishing',
    ],
  },
  {
    step: 3,
    title: 'Receive Orders',
    description: 'Get matched with buyers looking for your products',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    details: [
      'AI-powered matching',
      'Qualified leads',
      'Smart notifications',
      'Order management',
    ],
  },
  {
    step: 4,
    title: 'Fulfill Orders',
    description: 'Manage production with LoopTrace™ photo updates',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    details: [
      'Production tracking',
      'Photo verification',
      'Quality control',
      'Buyer updates',
    ],
  },
  {
    step: 5,
    title: 'Grow Business',
    description: 'Build reputation and unlock premium features',
    icon: Award,
    color: 'from-indigo-500 to-purple-500',
    details: [
      'Performance tracking',
      'Tier upgrades',
      'Featured listings',
      'Priority support',
    ],
  },
];

const BUYER_BENEFITS = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Escrow protection and verified payment gateways',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Average delivery in 20-30 days with LoopTrace™',
  },
  {
    icon: Star,
    title: 'Quality Assured',
    description: 'Photo verification at every production stage',
  },
  {
    icon: Target,
    title: 'Best Pricing',
    description: 'AI-optimized quotes from 10,000+ suppliers',
  },
];

const SUPPLIER_BENEFITS = [
  {
    icon: Users,
    title: 'Global Reach',
    description: 'Access to buyers worldwide looking for your products',
  },
  {
    icon: Zap,
    title: 'Easy Management',
    description: 'Streamlined order and production tracking',
  },
  {
    icon: TrendingUp,
    title: 'Grow Revenue',
    description: 'Increase sales with featured marketplace listings',
  },
  {
    icon: Award,
    title: 'Build Trust',
    description: 'Earn badges and tier upgrades with performance',
  },
];

export function BuyerSupplierJourney() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const currentJourney = activeTab === 'buyer' ? BUYER_JOURNEY : SUPPLIER_JOURNEY;
  const currentBenefits = activeTab === 'buyer' ? BUYER_BENEFITS : SUPPLIER_BENEFITS;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600">
            <Sparkles className="h-3 w-3 mr-1" />
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Your Journey Starts Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a buyer or supplier, we've streamlined the process for maximum efficiency
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'buyer' | 'supplier')}
          className="mb-12"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
            <TabsTrigger value="buyer" className="text-base">
              <ShoppingBag className="h-5 w-5 mr-2" />
              For Buyers
            </TabsTrigger>
            <TabsTrigger value="supplier" className="text-base">
              <Store className="h-5 w-5 mr-2" />
              For Suppliers
            </TabsTrigger>
          </TabsList>

          {/* Buyer Journey */}
          <TabsContent value="buyer" className="mt-12">
            <div className="space-y-16">
              {/* Journey Steps */}
              <div className="relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 via-green-500 to-indigo-500" />

                {/* Steps */}
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10"
                >
                  {BUYER_JOURNEY.map((item) => (
                    <motion.div
                      key={item.step}
                      variants={staggerItem}
                      onHoverStart={() => setHoveredStep(item.step)}
                      onHoverEnd={() => setHoveredStep(null)}
                    >
                      <Card
                        className={`transition-all duration-300 ${
                          hoveredStep === item.step ? 'shadow-2xl scale-105' : 'hover:shadow-lg'
                        }`}
                      >
                        <CardContent className="p-6">
                          {/* Icon */}
                          <motion.div
                            animate={
                              hoveredStep === item.step
                                ? { scale: 1.1, rotate: [0, -5, 5, 0] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.3 }}
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4`}
                          >
                            <item.icon className="h-8 w-8 text-white" />
                          </motion.div>

                          {/* Step Number */}
                          <Badge className="mb-2 mx-auto block w-fit">Step {item.step}</Badge>

                          {/* Title */}
                          <h3 className="font-bold text-center mb-2">{item.title}</h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground text-center mb-4">
                            {item.description}
                          </p>

                          {/* Details */}
                          <ul className="space-y-1">
                            {item.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Buyer Benefits */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8">Why Buyers Love Us</h3>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {BUYER_BENEFITS.map((benefit, index) => (
                    <motion.div key={index} variants={staggerItem}>
                      <Card className="h-full hover:shadow-lg transition-all">
                        <CardContent className="p-6 text-center">
                          <benefit.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                          <h4 className="font-semibold mb-2">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                >
                  Start Shopping Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Supplier Journey */}
          <TabsContent value="supplier" className="mt-12">
            <div className="space-y-16">
              {/* Journey Steps */}
              <div className="relative">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 via-green-500 to-indigo-500" />

                {/* Steps */}
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10"
                >
                  {SUPPLIER_JOURNEY.map((item) => (
                    <motion.div
                      key={item.step}
                      variants={staggerItem}
                      onHoverStart={() => setHoveredStep(item.step)}
                      onHoverEnd={() => setHoveredStep(null)}
                    >
                      <Card
                        className={`transition-all duration-300 ${
                          hoveredStep === item.step ? 'shadow-2xl scale-105' : 'hover:shadow-lg'
                        }`}
                      >
                        <CardContent className="p-6">
                          {/* Icon */}
                          <motion.div
                            animate={
                              hoveredStep === item.step
                                ? { scale: 1.1, rotate: [0, -5, 5, 0] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.3 }}
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4`}
                          >
                            <item.icon className="h-8 w-8 text-white" />
                          </motion.div>

                          {/* Step Number */}
                          <Badge className="mb-2 mx-auto block w-fit">Step {item.step}</Badge>

                          {/* Title */}
                          <h3 className="font-bold text-center mb-2">{item.title}</h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground text-center mb-4">
                            {item.description}
                          </p>

                          {/* Details */}
                          <ul className="space-y-1">
                            {item.details.map((detail, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Supplier Benefits */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8">Why Suppliers Choose Us</h3>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {SUPPLIER_BENEFITS.map((benefit, index) => (
                    <motion.div key={index} variants={staggerItem}>
                      <Card className="h-full hover:shadow-lg transition-all">
                        <CardContent className="p-6 text-center">
                          <benefit.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                          <h4 className="font-semibold mb-2">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90"
                >
                  Become a Supplier
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
