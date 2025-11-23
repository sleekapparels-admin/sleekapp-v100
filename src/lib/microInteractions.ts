/**
 * Micro-Interactions Library
 * 
 * A collection of delightful UI feedback patterns including:
 * - Haptic feedback simulation (visual + audio)
 * - Button press animations
 * - Success/error celebrations
 * - Smooth transitions
 * - Loading micro-animations
 */

// Haptic Feedback Types
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Trigger haptic feedback (visual pulse effect)
 * Works on all devices by creating a visual and audio feedback
 */
export const triggerHaptic = (style: HapticStyle = 'light') => {
  // Try native haptics if available (mobile devices)
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [30, 100, 30, 100, 30],
    };
    navigator.vibrate(patterns[style]);
  }

  // Audio feedback (subtle click sounds)
  playFeedbackSound(style);
};

/**
 * Play subtle feedback sounds
 */
export const playFeedbackSound = (type: HapticStyle) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const frequencies = {
    light: 800,
    medium: 600,
    heavy: 400,
    success: 1000,
    warning: 700,
    error: 500,
  };

  oscillator.frequency.value = frequencies[type];
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

/**
 * Framer Motion variants for common interactions
 */
export const buttonTap = {
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeOut' }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const slideIn = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] },
  },
};

export const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const bounceIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 200,
    },
  },
};

/**
 * Success confetti effect
 */
export const celebrateSuccess = (element: HTMLElement) => {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = element.offsetLeft + element.offsetWidth / 2 + 'px';
    confetti.style.top = element.offsetTop + element.offsetHeight / 2 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 100;
    const gravity = 300;
    
    const animation = confetti.animate([
      {
        transform: `translate(0, 0) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity - gravity}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0,
      },
    ], {
      duration: 1000 + Math.random() * 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    });

    animation.onfinish = () => confetti.remove();
  }
};

/**
 * Ripple effect for buttons
 */
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - radius}px`;
  ripple.style.top = `${event.clientY - rect.top - radius}px`;
  ripple.classList.add('ripple');
  
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
};

/**
 * Shake animation for errors
 */
export const shakeElement = (element: HTMLElement) => {
  element.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' },
  ], {
    duration: 500,
    easing: 'ease-in-out',
  });
};

/**
 * Pulse animation for attention
 */
export const pulseElement = (element: HTMLElement, count = 3) => {
  const animation = element.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' },
  ], {
    duration: 300,
    iterations: count,
    easing: 'ease-in-out',
  });
  
  return animation.finished;
};

/**
 * Loading dot animation
 */
export const loadingDots = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 1,
      delay: i * 0.2,
      ease: 'easeInOut',
    },
  }),
};

/**
 * Smooth scroll with easing
 */
export const smoothScroll = (target: string | HTMLElement, offset = 0) => {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
    
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  let start: number | null = null;
  
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  
  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };
  
  requestAnimationFrame(animation);
};

/**
 * CSS classes for ripple effect (add to global CSS)
 */
export const rippleStyles = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
