import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { ShippingCalculator } from '@/components/ShippingCalculator';
import { TechPackGenerator } from '@/components/TechPackGenerator';
import { AIProductRecommendations } from '@/components/AIProductRecommendations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Package, 
  FileText, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Download
} from 'lucide-react';
import { smoothScroll, staggerContainer, fadeInUp } from '@/lib/microInteractions';

const AdvancedFeatures = () => {
  const [activeTab, setActiveTab] = useState('newsletter');

  const features = [
    {
      id: 'newsletter',
      icon: Mail,
      title: 'Newsletter Signup',
      description: 'Email capture with confetti celebration and Supabase integration',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'calculator',
      icon: Package,
      title: 'Shipping Calculator',
      description: 'Real-time cost estimation for 15+ countries with multiple shipping methods',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'techpack',
      icon: FileText,
      title: 'Tech Pack Generator',
      description: 'Professional specification sheets with PDF export capability',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'recommendations',
      icon: Sparkles,
      title: 'AI Recommendations',
      description: 'Smart product suggestions based on browsing history and preferences',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
              >
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Advanced Features</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl font-bold mb-6"
              >
                Tools Built For{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                  Your Success
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Professional-grade tools to streamline your apparel manufacturing workflow. 
                From newsletter signups to tech pack generation, we've got you covered.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={() => smoothScroll('#features', 100)}
                  className="gap-2"
                >
                  Explore Features <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => smoothScroll('#demo', 100)}
                >
                  See Live Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What's Included</h2>
              <p className="text-lg text-muted-foreground">
                Four powerful tools designed to enhance your manufacturing experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setActiveTab(feature.id);
                        smoothScroll('#demo', 100);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground mb-4">{feature.description}</p>
                          
                          <div className="space-y-2">
                            {feature.id === 'newsletter' && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Confetti celebration animation</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Supabase integration</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Duplicate detection</span>
                                </div>
                              </>
                            )}
                            {feature.id === 'calculator' && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>15+ countries supported</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>3 shipping methods</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Customs duty estimation</span>
                                </div>
                              </>
                            )}
                            {feature.id === 'techpack' && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Professional PDF export</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Size chart builder</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Material specifications</span>
                                </div>
                              </>
                            )}
                            {feature.id === 'recommendations' && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Browsing history tracking</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>AI-powered scoring</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Personalized suggestions</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Try It Live</h2>
              <p className="text-lg text-muted-foreground">
                Interactive demos - click around and test all features!
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                {features.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <TabsTrigger key={feature.id} value={feature.id} className="gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{feature.title.split(' ')[0]}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="newsletter" className="mt-0">
                <div className="max-w-2xl mx-auto">
                  <Card className="p-6 mb-4">
                    <h3 className="text-2xl font-bold mb-2">Newsletter Signup</h3>
                    <p className="text-muted-foreground mb-4">
                      Try subscribing! You'll see a confetti celebration on success.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Globe className="h-4 w-4" />
                      <span>Connected to live Supabase database</span>
                    </div>
                  </Card>
                  <NewsletterSignup variant="hero" />
                </div>
              </TabsContent>

              <TabsContent value="calculator" className="mt-0">
                <Card className="p-6 mb-4">
                  <h3 className="text-2xl font-bold mb-2">Shipping Calculator</h3>
                  <p className="text-muted-foreground">
                    Select a country, adjust weight, and see real-time shipping cost calculations.
                  </p>
                </Card>
                <ShippingCalculator />
              </TabsContent>

              <TabsContent value="techpack" className="mt-0">
                <Card className="p-6 mb-4">
                  <h3 className="text-2xl font-bold mb-2">Tech Pack Generator</h3>
                  <p className="text-muted-foreground mb-4">
                    Fill out the form and click "Export PDF" to generate a professional tech pack.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>Click "Export PDF" button to download your tech pack</span>
                  </div>
                </Card>
                <TechPackGenerator />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-0">
                <Card className="p-6 mb-4">
                  <h3 className="text-2xl font-bold mb-2">AI Product Recommendations</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse products to build your history. The AI will learn your preferences and suggest items you'll love.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Start browsing products to see personalized recommendations!</span>
                  </div>
                </Card>
                <AIProductRecommendations limit={6} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                All these tools are available now. Start using them to streamline your manufacturing process.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.location.href = '/'}
                >
                  Browse Products
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdvancedFeatures;
