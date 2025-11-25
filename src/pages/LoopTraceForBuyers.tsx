import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, Clock, DollarSign, Shield, TrendingUp, 
  Package, BarChart3, MessageSquare, CheckCircle2,
  Zap, Target, Users, Award, ArrowRight, Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackCTAClick } from "@/lib/analyticsTracking";
import { motion } from "framer-motion";

export default function LoopTraceForBuyers() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    trackCTAClick('looptrace_buyers_get_started', 'looptrace_for_buyers_page');
    navigate('/auth?type=customer');
  };

  const benefits = [
    {
      icon: Zap,
      title: "Instant AI-Powered Quotes",
      description: "Get accurate pricing in seconds, not days. Our AI analyzes your requirements and provides instant quotes from verified suppliers.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Clock,
      title: "Save 80% Time on Sourcing",
      description: "Traditional sourcing takes weeks. With LoopTrace, find the perfect supplier, get quotes, and place orders in hours.",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: DollarSign,
      title: "Competitive Factory-Direct Pricing",
      description: "Cut out middlemen and get the best prices directly from manufacturers. Transparent pricing with no hidden fees.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Shield,
      title: "100% Verified Suppliers Only",
      description: "Every supplier is thoroughly vetted with certifications (WRAP, BSCI, OEKO-TEX). Your brand reputation is safe with us.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Package,
      title: "Real-Time Production Tracking",
      description: "Know exactly where your order is at every stage. From yarn to shipping, track progress in real-time on your dashboard.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics & Insights",
      description: "Make data-driven decisions with AI-powered insights on costs, timelines, supplier performance, and market trends.",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Tell Us What You Need",
      description: "Upload your design, select product type, quantity, and specifications. Our AI understands your requirements instantly.",
      icon: MessageSquare
    },
    {
      step: "2",
      title: "Get Instant AI Quote",
      description: "Within seconds, receive accurate quotes with breakdown of costs, timelines, and matched suppliers.",
      icon: Sparkles
    },
    {
      step: "3",
      title: "Compare & Choose Supplier",
      description: "Review supplier profiles, certifications, ratings, and past work. Choose the best fit for your brand.",
      icon: Target
    },
    {
      step: "4",
      title: "Track Production Live",
      description: "Monitor every stage from cutting to shipping. Get automated updates and communicate directly with suppliers.",
      icon: TrendingUp
    }
  ];

  const useCases = [
    {
      type: "Fashion Brands",
      icon: Award,
      description: "Launch your clothing line with low MOQs starting from just 50 pieces. Perfect for startups and established brands.",
      examples: ["T-Shirts", "Hoodies", "Streetwear", "Premium Apparel"]
    },
    {
      type: "Schools & Universities",
      icon: Users,
      description: "Source quality uniforms with custom embroidery and printing. Bulk discounts available for educational institutions.",
      examples: ["School Uniforms", "Sports Jerseys", "Graduation Gowns", "Team Apparel"]
    },
    {
      type: "Corporates & Businesses",
      icon: CheckCircle2,
      description: "Get professional corporate uniforms and branded merchandise. Quick turnaround for urgent orders.",
      examples: ["Polo Shirts", "Workwear", "Promotional T-Shirts", "Corporate Gifts"]
    },
    {
      type: "Sports Teams & Clubs",
      icon: Play,
      description: "Custom jerseys, track suits, and performance wear with sublimation printing and team customization.",
      examples: ["Sports Jerseys", "Track Suits", "Athletic Wear", "Fan Merchandise"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Urban Fashion Co",
      role: "Founder",
      quote: "LoopTrace cut our sourcing time from 3 weeks to 2 hours. The AI quotes are incredibly accurate and the supplier matching is spot-on!",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "Green Valley High School",
      role: "Procurement Manager",
      quote: "We ordered 500 school uniforms and the real-time tracking gave us complete peace of mind. Quality exceeded expectations!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "TechCorp Inc",
      role: "HR Director",
      quote: "Finally, a platform that makes bulk corporate apparel ordering simple. Transparent pricing and no surprises. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Sourcing Revolution</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Source Apparel in Seconds,
              <br />Not Weeks
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              LoopTrace AI instantly matches you with verified Bangladesh manufacturers, 
              generates accurate quotes, and tracks your orders in real-time. 
              <span className="font-semibold text-gray-800"> Welcome to the future of apparel sourcing.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Get Instant Quote <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/portfolio')}
                className="text-lg px-8 py-6"
              >
                View Product Gallery
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10s</div>
                <div className="text-sm text-gray-600">Quote Generation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-600">Live Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">50</div>
                <div className="text-sm text-gray-600">Minimum Order</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Buyers Love LoopTrace</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by AI, designed for speed, built for transparency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-lg ${benefit.bgColor} flex items-center justify-center mb-4`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How LoopTrace Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From idea to delivery in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary w-8 h-8" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Perfect For Every Buyer Type</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whatever your needs, we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{useCase.type}</h3>
                      <p className="text-gray-600 mb-4">{useCase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, i) => (
                          <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Buyers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real results from real customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <CheckCircle2 key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                    <div className="border-t pt-4">
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-primary font-semibold">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-12 text-center text-white"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Sourcing?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of brands, schools, and businesses already sourcing smarter with LoopTrace AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact')}
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Talk to Our Team
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-6">No credit card required • Free instant quotes • 24/7 support</p>
        </motion.div>
      </section>
    </div>
  );
}
