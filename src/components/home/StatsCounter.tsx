import { useEffect, useState } from "react";
import { TrendingUp, Users, Globe, Package } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsCounter = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Brands Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Real numbers from real partnerships
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Stat 1: Products Delivered */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <Counter end={10000} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Products Delivered
            </div>
          </div>

          {/* Stat 2: Brands Served */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <Counter end={50} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Brands Worldwide
            </div>
          </div>

          {/* Stat 3: Countries Served */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <Counter end={15} suffix="+" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              Countries Served
            </div>
          </div>

          {/* Stat 4: On-Time Delivery */}
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition-colors">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              <Counter end={98.5} suffix="%" />
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              On-Time Delivery
            </div>
          </div>
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
