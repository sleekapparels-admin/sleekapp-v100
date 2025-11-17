import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  suffix = "", 
  className = "" 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const endValue = value;
          
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const currentValue = Math.floor(easeOutQuad(progress) * endValue);
            
            setCount(currentValue);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  );
};
