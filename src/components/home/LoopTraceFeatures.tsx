import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  BarChart3,
  Camera,
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  Package,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fadeIn, slideInLeft, slideInRight } from '@/lib/animations';

const AI_QUOTE_STEPS = [
  {
    id: 1,
    title: 'Input Requirements',
    description: 'Enter your product specifications and quantity',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    id: 2,
    title: 'AI Processing',
    description: 'Our AI analyzes 10,000+ supplier quotes instantly',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    delay: 0.2,
  },
  {
    id: 3,
    title: 'Smart Matching',
    description: 'Get matched with the best suppliers for your needs',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    delay: 0.4,
  },
  {
    id: 4,
    title: 'Instant Quote',
    description: 'Receive accurate pricing in under 60 seconds',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500',
    delay: 0.6,
  },
];

const LOOPTRACE_TIMELINE = [
  {
    id: 1,
    stage: 'Order Placed',
    description: 'Buyer places order',
    icon: Package,
    status: 'completed',
    time: 'Day 0',
  },
  {
    id: 2,
    stage: 'Material Sourcing',
    description: 'Fabric procurement',
    icon: CheckCircle2,
    status: 'completed',
    time: 'Day 2-5',
  },
  {
    id: 3,
    stage: 'Production Start',
    description: 'Manufacturing begins',
    icon: CheckCircle2,
    status: 'completed',
    time: 'Day 7',
  },
  {
    id: 4,
    stage: 'Quality Check',
    description: 'Photo verification',
    icon: Camera,
    status: 'in_progress',
    time: 'Day 15',
  },
  {
    id: 5,
    stage: 'Final Inspection',
    description: 'Quality assurance',
    icon: Eye,
    status: 'pending',
    time: 'Day 20',
  },
  {
    id: 6,
    stage: 'Shipping',
    description: 'Order dispatched',
    icon: TrendingUp,
    status: 'pending',
    time: 'Day 25',
  },
];

const REAL_TIME_STATS = [
  { label: 'Response Time', value: '< 2 mins', icon: Clock, trend: '+50%' },
  { label: 'Accuracy Rate', value: '99.2%', icon: CheckCircle2, trend: '+12%' },
  { label: 'Suppliers Analyzed', value: '10K+', icon: BarChart3, trend: '+200%' },
  { label: 'Orders Tracked', value: '5K+', icon: Eye, trend: '+180%' },
];

export function LoopTraceFeatures() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTimeline, setActiveTimeline] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setActiveStep((prev) => (prev + 1) % AI_QUOTE_STEPS.length);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % LOOPTRACE_TIMELINE.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-50/50 to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            How LoopTrace™ Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven manufacturing with real-time tracking and instant quotes
          </p>
        </motion.div>

        {/* AI Quote Generator Animation */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl font-bold mb-2">⚡ AI Quote Generator</h3>
            <p className="text-muted-foreground">Get accurate pricing in under 60 seconds</p>
          </motion.div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 -translate-y-1/2" />

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {AI_QUOTE_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.delay }}
                >
                  <Card
                    className={`relative transition-all duration-500 ${
                      activeStep === index
                        ? 'ring-2 ring-primary shadow-2xl scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Animated Icon */}
                      <motion.div
                        animate={
                          activeStep === index
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 relative`}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                        {activeStep === index && (
                          <motion.div
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-primary/30"
                          />
                        )}
                      </motion.div>

                      {/* Step Number */}
                      <Badge
                        variant={activeStep === index ? 'default' : 'secondary'}
                        className="mb-2"
                      >
                        Step {step.id}
                      </Badge>

                      {/* Content */}
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>

                      {/* Active Indicator */}
                      <AnimatePresence>
                        {activeStep === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 flex items-center justify-center gap-1 text-primary text-sm font-medium"
                          >
                            <Zap className="h-4 w-4" />
                            Processing...
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">📊 Real-Time Performance</h3>
            <p className="text-muted-foreground">Powered by AI for lightning-fast results</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REAL_TIME_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <Badge variant="secondary" className="text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend}
                    </Badge>

                    {/* Animated Background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 -z-10"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* LoopTrace Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl font-bold mb-2">📸 LoopTrace™ Real-Time Tracking</h3>
            <p className="text-muted-foreground">
              Visual proof at every stage of production
            </p>
          </motion.div>

          <Card className="p-8 bg-gradient-to-br from-background to-muted/20">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-primary to-gray-300" />

              {/* Timeline Items */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                {LOOPTRACE_TIMELINE.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    {/* Icon Circle */}
                    <motion.div
                      animate={
                        activeTimeline === index
                          ? {
                              scale: [1, 1.3, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(59, 130, 246, 0.5)',
                                '0 0 0 10px rgba(59, 130, 246, 0)',
                                '0 0 0 0 rgba(59, 130, 246, 0)',
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative z-10 ${
                        item.status === 'completed'
                          ? 'bg-green-500'
                          : item.status === 'in_progress'
                          ? 'bg-primary'
                          : 'bg-gray-300'
                      }`}
                    >
                      <item.icon className="h-7 w-7 text-white" />
                    </motion.div>

                    {/* Content */}
                    <Badge
                      variant={
                        item.status === 'completed'
                          ? 'default'
                          : item.status === 'in_progress'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="mb-2 text-xs"
                    >
                      {item.time}
                    </Badge>
                    <p className="font-semibold text-sm text-center mb-1">{item.stage}</p>
                    <p className="text-xs text-muted-foreground text-center">
                      {item.description}
                    </p>

                    {/* Active Pulse */}
                    {activeTimeline === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 flex items-center gap-1 text-primary text-xs font-medium"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Active
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            onClick={() => window.location.href = '/ai-quote-generator'}
          >
            Try AI Quote Generator
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
