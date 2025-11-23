/**
 * Animation Utilities - Reusable Framer Motion Variants
 * Optimized for performance and consistency
 */

import { Variants } from 'framer-motion';

// Page Transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1], // easeInOut
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Fade In
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0 },
};

// Slide In from Bottom
export const slideInBottom: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }
  },
  exit: { opacity: 0, y: 20 },
};

// Slide In from Right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0, x: -20 },
};

// Slide In from Left
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
  exit: { opacity: 0, x: 20 },
};

// Fade In Up
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, y: 10 },
};

// Scale Up (for modals, cards)
export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
  },
  exit: { opacity: 0, scale: 0.95 },
};

// Bounce In (for success states)
export const bounceIn: Variants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    }
  },
};

// Stagger Container (for lists)
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger Item
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
};

// Skeleton Pulse (loading state)
export const skeletonPulse: Variants = {
  animate: {
    opacity: [0.4, 0.6, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Progress Bar Fill
export const progressFill = (progress: number): Variants => ({
  initial: { width: 0 },
  animate: { 
    width: `${progress}%`,
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
  },
});

// Counter Animation (for numbers)
export const counterAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.2, 1],
    transition: { duration: 0.5 }
  },
};

// Shake (for errors)
export const shake: Variants = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  },
};

// Ripple Effect (for buttons)
export const ripple: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { 
    scale: 2.5, 
    opacity: 0,
    transition: { duration: 0.6 }
  },
};

// Hover Lift (for cards)
export const hoverLift = {
  whileHover: { 
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 },
};

// Button Press
export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

// Expand/Collapse
export const expandCollapse: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.3 }
  },
};

// Float Animation (subtle movement)
export const float: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Spin (for loading spinners)
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Confetti Burst (celebration)
export const confettiBurst: Variants = {
  initial: { scale: 0, rotate: 0 },
  animate: { 
    scale: [0, 1.5, 1], 
    rotate: [0, 180, 360],
    transition: { duration: 0.8 }
  },
};

// Badge Notification (pulse)
export const badgePulse: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// Drawer Slide (for mobile menus)
export const drawerSlide: Variants = {
  initial: { x: '100%' },
  animate: { 
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 30 
    }
  },
  exit: { 
    x: '100%',
    transition: { duration: 0.2 }
  },
};

// Backdrop Fade (for modals)
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Tooltip Arrow
export const tooltipArrow: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { delay: 0.1 }
  },
};
