import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FloatingGeometryProps {
  shape?: 'circle' | 'square' | 'triangle';
  size?: number;
  color?: string;
  initialX?: number;
  initialY?: number;
  scrollDistance?: number;
  rotationSpeed?: number;
  delay?: number;
}

export const FloatingGeometry = ({
  shape = 'circle',
  size = 60,
  color = 'hsl(var(--primary) / 0.1)',
  initialX = 0,
  initialY = 0,
  scrollDistance = 200,
  rotationSpeed = 180,
  delay = 0,
}: FloatingGeometryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [initialY, initialY + scrollDistance]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotationSpeed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    triangle: 'clip-triangle',
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none ${shapeStyles[shape]}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: initialX,
        y,
        rotate,
        opacity,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
    />
  );
};

/**
 * Container for multiple floating geometric shapes
 */
export const FloatingGeometryGroup = () => {
  return (
    <>
      <FloatingGeometry
        shape="circle"
        size={80}
        color="hsl(var(--primary) / 0.08)"
        initialX={10}
        initialY={-100}
        scrollDistance={300}
        rotationSpeed={360}
        delay={0}
      />
      <FloatingGeometry
        shape="square"
        size={60}
        color="hsl(var(--primary) / 0.06)"
        initialX={85}
        initialY={-50}
        scrollDistance={-200}
        rotationSpeed={-180}
        delay={0.2}
      />
      <FloatingGeometry
        shape="circle"
        size={100}
        color="hsl(var(--primary) / 0.04)"
        initialX={70}
        initialY={-150}
        scrollDistance={250}
        rotationSpeed={270}
        delay={0.4}
      />
      <FloatingGeometry
        shape="square"
        size={50}
        color="hsl(var(--primary) / 0.07)"
        initialX={20}
        initialY={-80}
        scrollDistance={-150}
        rotationSpeed={-90}
        delay={0.6}
      />
    </>
  );
};
