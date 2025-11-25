import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, Users, Globe, Package } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, motionValue, end]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsCounter = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Brands Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Real numbers from real partnerships
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Stat 1: Active Orders */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              <Counter end={500} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Active Orders
            </div>
          </motion.div>

          {/* Stat 2: Partner Factories */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-secondary to-coral bg-clip-text text-transparent">
              <Counter end={50} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Partner Factories
            </div>
          </motion.div>

          {/* Stat 3: Products Shipped */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
              <Globe className="h-8 w-8 text-accent" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              <Counter end={5000} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Products Shipped Monthly
            </div>
          </motion.div>

          {/* Stat 4: Quality Score */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition-colors">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              <Counter end={98} suffix="%" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Quality Score
            </div>
          </motion.div>
        </div>

        {/* Additional Context */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            With 15+ years of manufacturing excellence, we've built lasting partnerships with brands across continents. 
            Our commitment to quality and transparency has made us the preferred choice for emerging and established brands alike.
          </p>
        </div>
      </div>
    </section>
  );
};
