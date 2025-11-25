import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject } from 'react';

interface ScrollProgressOptions {
  target?: RefObject<HTMLElement>;
  offset?: [string, string];
}

/**
 * Track scroll progress for scroll-linked animations
 */
export const useScrollProgress = (options: ScrollProgressOptions = {}) => {
  const { target, offset = ["start end", "end start"] } = options;
  
  const { scrollYProgress } = useScroll({
    target: target as RefObject<HTMLElement>,
    offset: offset as ["start end", "end start"],
  });

  return scrollYProgress;
};

/**
 * Create parallax transform based on scroll progress
 */
export const useParallax = (
  scrollProgress: MotionValue<number>,
  distance: number
) => {
  return useTransform(scrollProgress, [0, 1], [0, distance]);
};

/**
 * Create scale transform based on scroll progress
 */
export const useScrollScale = (
  scrollProgress: MotionValue<number>,
  range: [number, number] = [0.8, 1]
) => {
  return useTransform(scrollProgress, [0, 1], range);
};

/**
 * Create opacity transform based on scroll progress
 */
export const useScrollOpacity = (
  scrollProgress: MotionValue<number>,
  range: [number, number] = [0, 1]
) => {
  return useTransform(scrollProgress, [0, 1], range);
};

/**
 * Create rotation transform based on scroll progress
 */
export const useScrollRotate = (
  scrollProgress: MotionValue<number>,
  degrees: number = 360
) => {
  return useTransform(scrollProgress, [0, 1], [0, degrees]);
};
