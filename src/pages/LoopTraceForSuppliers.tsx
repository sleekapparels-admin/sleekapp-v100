import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Factory, TrendingUp, Users, Globe, Sparkles, 
  DollarSign, BarChart3, Shield, Zap, Target,
  CheckCircle2, ArrowRight, Award, Clock, Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackCTAClick } from "@/lib/analyticsTracking";
import { motion } from "framer-motion";

export default function LoopTraceForSuppliers() {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    trackCTAClick('looptrace_suppliers_join_now', 'looptrace_for_suppliers_page');
    navigate('/auth?type=production_partner');
  };

  const benefits = [
    {
      icon: Users,
      title: "Access Global Buyers Instantly",
      description: "Connect with fashion brands, schools, corporates, and sports teams worldwide looking for your products.",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Lead Matching",
      description: "Our AI automatically matches you with buyers whose requirements fit your capabilities. No more cold outreach.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: TrendingUp,
      title: "Maximize Production Capacity",
      description: "Fill production gaps with qualified leads. Optimize utilization rates and increase revenue by 30-50%.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: DollarSign,
      title: "Fair & Transparent Pricing",
      description: "Set your prices, no middlemen taking cuts. Get paid on time through our secure payment system.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Shield,
      title: "Build Your Reputation",
      description: "Earn ratings, showcase certifications, and build a verified profile that attracts premium buyers.",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: BarChart3,
      title: "Smart Business Analytics",
      description: "Track orders, analyze trends, forecast demand, and make data-driven decisions to grow your business.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Set up your factory profile with products, capacity, certifications, and specializations. Our verification team will review within 48 hours.",
      icon: Factory
    },
    {
      step: "2",
      title: "Get Matched with Buyers",
      description: "AI matches incoming buyer requests with your capabilities. Receive qualified leads that fit your production strengths.",
      icon: Target
    },
    {
      step: "3",
      title: "Send Smart Quotes",
      description: "Use AI-assisted quoting to generate competitive proposals. Buyers see your profile, ratings, and past work.",
      icon: Sparkles
    },
    {
      step: "4",
      title: "Manage & Deliver",
      description: "Track orders, communicate with buyers, update production stages, and build long-term relationships.",
      icon: Package
    }
  ];

  const supplierTypes = [
    {
      type: "Garment Manufacturers",
      icon: Factory,
      description: "Whether you specialize in knitwear, woven, sweaters, or activewear - find buyers for your products.",
      capacity: "MOQ from 50 to 50,000+ pieces"
    },
    {
      type: "Fabric & Textile Mills",
      icon: Package,
      description: "Supply quality fabrics to garment manufacturers and brands. From cotton to technical fabrics.",
      capacity: "Bulk fabric orders"
    },
    {
      type: "Trims & Accessories",
      icon: Award,
      description: "Buttons, zippers, labels, packaging - connect with buyers needing your specialized products.",
      capacity: "Component suppliers welcome"
    },
    {
      type: "Raw Material Suppliers",
      icon: Globe,
      description: "Yarn, dyes, chemicals, and other raw materials. Complete the supply chain.",
      capacity: "All order sizes"
    }
  ];

  const features = [
    {
      title: "Verified Buyer Network",
      description: "Only serious, verified buyers. No time wasters.",
      icon: CheckCircle2
    },
    {
      title: "Instant Notifications",
      description: "Get alerts when buyers match your profile.",
      icon: Zap
    },
    {
      title: "Showcase Your Work",
      description: "Portfolio gallery to display past projects.",
      icon: Award
    },
    {
      title: "Secure Payments",
      description: "Protected payment processing with escrow.",
      icon: Shield
    },
    {
      title: "Order Management",
      description: "Dashboard to track all orders in one place.",
      icon: BarChart3
    },
    {
      title: "Rating System",
      description: "Build reputation with verified reviews.",
      icon: TrendingUp
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      company: "Dhaka Knitwear Ltd",
      role: "Managing Director",
      quote: "LoopTrace filled our production gaps with quality buyers from US and Europe. Revenue increased by 40% in just 3 months!",
      rating: 5
    },
    {
      name: "Fatima Rahman",
      company: "Active Sports Textiles",
      role: "CEO",
      quote: "The AI matching is incredible. We now get leads that perfectly fit our activewear specialization. No more wasting time on unsuitable inquiries.",
      rating: 5
    },
    {
      name: "Karim Textile",
      company: "Bengal Uniforms Manufacturing",
      role: "Owner",
      quote: "Professional platform with serious buyers. Payment protection gives us confidence. Best B2B platform for Bangladesh suppliers!",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Active Buyers" },
    { number: "$2M+", label: "Orders Processed" },
    { number: "95%", label: "On-Time Payments" },
    { number: "4.8★", label: "Avg Supplier Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
              <Factory className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-600">For Production Partners</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Grow Your Manufacturing
              <br />Business with AI
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join Bangladesh's first AI-powered apparel sourcing platform. 
              Get matched with verified global buyers, maximize your production capacity, 
              and grow your revenue. <span className="font-semibold text-gray-800">Zero commission on first 3 orders.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleJoinNow}
                className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
              >
                Join as Supplier <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/become-supplier')}
                className="text-lg px-8 py-6 border-green-600 text-green-600 hover:bg-green-50"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Suppliers Choose LoopTrace</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            More buyers, better margins, smarter growth
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
            <h2 className="text-4xl font-bold mb-4">How LoopTrace Works for Suppliers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From signup to your first order in 4 simple steps
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-teal-600 text-white flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-600 w-8 h-8" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supplier Types Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">All Supplier Types Welcome</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From garment manufacturers to raw material suppliers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {supplierTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <type.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{type.type}</h3>
                      <p className="text-gray-600 mb-3">{type.description}</p>
                      <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium">
                        {type.capacity}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools built for modern manufacturers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Success Stories from Suppliers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real growth from real manufacturing partners
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
              <Card className="h-full hover:shadow-lg transition-shadow border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle2 key={i} className="w-5 h-5 text-green-500 fill-green-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-green-600 font-semibold">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees. No upfront costs. Only pay when you get orders.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-4 border-green-200 shadow-xl">
              <CardContent className="p-10 text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Limited Time Offer</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">Success-Based Commission</h3>
                <div className="text-6xl font-bold text-green-600 mb-2">5%</div>
                <p className="text-gray-600 mb-6">Commission on completed orders only</p>
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>First 3 Orders: 0% Commission</span>
                  </div>
                  <p className="text-sm text-gray-600">Try the platform risk-free. No commission on your first 3 orders!</p>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unlimited buyer connections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">AI-powered lead matching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full dashboard & analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Payment protection & escrow</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">24/7 platform support</span>
                  </li>
                </ul>
                <Button 
                  size="lg"
                  onClick={handleJoinNow}
                  className="w-full text-lg py-6 bg-green-600 hover:bg-green-700"
                >
                  Join Now - Free Setup <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-12 text-center text-white"
        >
          <Factory className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join Bangladesh's leading manufacturers already growing with LoopTrace AI. 
            Start receiving qualified buyer leads today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleJoinNow}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Create Supplier Profile <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact')}
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-6">
            Free to join • No setup fees • First 3 orders commission-free
          </p>
        </motion.div>
      </section>
    </div>
  );
}
