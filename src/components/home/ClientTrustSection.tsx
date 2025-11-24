import { motion } from "framer-motion";
import { Globe2, Users, Package, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustMetrics = [
  {
    icon: Package,
    value: "10,000+",
    label: "Products Delivered",
    description: "Custom garments manufactured"
  },
  {
    icon: Users,
    value: "50+",
    label: "Global Brands",
    description: "Fashion brands & startups"
  },
  {
    icon: Globe2,
    value: "15+",
    label: "Countries Served",
    description: "Europe, North America & Asia"
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "On-Time Delivery",
    description: "Reliable production timelines"
  }
];

const countries = [
  "🇺🇸 USA",
  "🇬🇧 UK",
  "🇩🇪 Germany",
  "🇸🇪 Sweden",
  "🇨🇦 Canada",
  "🇦🇺 Australia",
  "🇪🇸 Spain",
  "🇫🇷 France",
  "🇳🇱 Netherlands",
  "🇩🇰 Denmark",
  "🇳🇴 Norway",
  "🇦🇪 UAE"
];

const clientTypes = [
  "E-commerce Startups",
  "Fashion Brands",
  "Corporate Uniforms",
  "Sports Teams",
  "Lifestyle Brands",
  "Sustainable Fashion"
];

export const ClientTrustSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Global Brands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manufacturing for fashion brands, startups, and enterprises across 15+ countries
          </p>
        </motion.div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{metric.value}</div>
                  <div className="font-semibold mb-1">{metric.label}</div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Countries Served */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-center mb-6">
            Serving Brands In:
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {countries.map((country, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium"
              >
                {country}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Client Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-center mb-6">
            Manufacturing For:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {clientTypes.map((type, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {type}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <p className="text-lg italic mb-4">
              "Sleek Apparels delivered exceptional quality on our 500-piece order. 
              The LoopTrace™ tracking gave us complete transparency throughout production. 
              Perfect for our startup's first collection."
            </p>
            <p className="font-semibold">— Streetwear Brand, London, UK</p>
          </Card>
        </motion.div>

      </div>
    </section>
  );
};
