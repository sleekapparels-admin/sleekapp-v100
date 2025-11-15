import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';
  staggerChildren?: number;
}

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  variant = 'fadeUp',
  staggerChildren = 0.1,
}: AnimatedSectionProps) => {
  const motionVariants = variant === 'stagger' ? {
    ...variants[variant],
    visible: {
      ...variants[variant].visible,
      transition: {
        staggerChildren,
        delayChildren: delay
      }
    }
  } : variants[variant];

  return (
    <motion.div
      className={className}
      variants={motionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay: variant !== 'stagger' ? delay : 0, ease: "easeOut" }}
      style={{ 
        willChange: variant === 'scale' ? 'transform, opacity' : variant.includes('slide') || variant === 'fadeUp' ? 'transform, opacity' : 'opacity'
      }}
    >
      {children}
    </motion.div>
  );
};