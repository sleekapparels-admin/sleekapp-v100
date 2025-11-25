/**
 * Preload critical images to improve LCP (Largest Contentful Paint)
 */

const CRITICAL_IMAGES = [
  '/sleek-logo.webp'
];

export const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;

  // Defer preloading to not block initial render
  requestIdleCallback(() => {
    CRITICAL_IMAGES.forEach((src, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (src.endsWith('.mp4')) {
        link.as = 'video';
        link.type = 'video/mp4';
      } else {
        link.as = 'image';
        // Set high priority for LCP images
        if (index === 1) {
          link.setAttribute('fetchpriority', 'high');
        }
      }
      
      link.href = src;
      document.head.appendChild(link);
    });
  }, { timeout: 2000 });
};

const requestIdleCallback = (cb: () => void, options?: { timeout?: number }) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb, options);
  } else {
    setTimeout(cb, options?.timeout || 1);
  }
};

// Preload images on demand
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = (sources: string[]): Promise<void[]> => {
  return Promise.all(sources.map(preloadImage));
};
