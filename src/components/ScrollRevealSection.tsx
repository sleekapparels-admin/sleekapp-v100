import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  parallaxSpeed?: number;
}

/**
 * Section with scroll-based reveal and parallax effects
 */
export const ScrollRevealSection = ({
  children,
  className = '',
  parallaxSpeed = 50,
}: ScrollRevealSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallaxSpeed, -parallaxSpeed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        opacity,
        scale,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
};
