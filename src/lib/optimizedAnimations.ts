/**
 * GPU-accelerated animation utilities
 * Uses transform and opacity for 60fps animations
 */

// Framer Motion variants optimized for GPU acceleration
export const optimizedFadeIn = {
  initial: { 
    opacity: 0, 
    y: 20,
    // Force GPU acceleration
    transform: 'translateZ(0)',
    willChange: 'opacity, transform'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transform: 'translateZ(0)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] // Custom easing for smooth motion
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transform: 'translateZ(0)',
    transition: { duration: 0.2 }
  }
};

export const optimizedScale = {
  initial: { 
    scale: 0.95, 
    opacity: 0,
    transform: 'translateZ(0)',
    willChange: 'scale, opacity'
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transform: 'translateZ(0)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transform: 'translateZ(0)',
    transition: { duration: 0.15 }
  }
};

export const optimizedSlideIn = {
  initial: { 
    x: 100, 
    opacity: 0,
    transform: 'translateZ(0)',
    willChange: 'transform, opacity'
  },
  animate: { 
    x: 0, 
    opacity: 1,
    transform: 'translateZ(0)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 25
    }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transform: 'translateZ(0)',
    transition: { duration: 0.2 }
  }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Optimized button hover animation
export const buttonHover = {
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10
  }
};

export const buttonTap = {
  scale: 0.98
};

// Card hover with GPU acceleration
export const cardHover = {
  y: -4,
  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20
  }
};

// Pulse animation for attention
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

/**
 * Apply GPU acceleration styles to any element
 */
export const gpuAcceleration = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const
};

/**
 * Optimized scroll reveal animation
 */
export const scrollReveal = {
  initial: {
    opacity: 0,
    y: 50,
    transform: 'translateZ(0)',
    willChange: 'opacity, transform'
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transform: 'translateZ(0)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  viewport: { once: true, margin: '-50px' }
};
