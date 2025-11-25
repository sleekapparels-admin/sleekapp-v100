/**
 * Image optimization utilities for better performance
 */

// Generate responsive image srcset
export const generateSrcSet = (src: string, widths: number[]): string => {
  return widths
    .map(width => `${src}?w=${width} ${width}w`)
    .join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = (breakpoints: { size: string; width: string }[]): string => {
  return breakpoints
    .map(bp => `${bp.size} ${bp.width}`)
    .join(', ');
};

// Optimize portfolio images for different screen sizes
export const getOptimizedPortfolioImage = (src: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  // For now, return the original src
  // In production, this would integrate with an image CDN
  return src;
};

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;
          
          if (src) img.src = src;
          if (srcset) img.srcset = srcset;
          
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical images
export const preloadImage = (src: string, priority: 'high' | 'low' = 'low') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.setAttribute('fetchpriority', priority);
  document.head.appendChild(link);
};

// Check if WebP is supported
export const supportsWebP = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};
