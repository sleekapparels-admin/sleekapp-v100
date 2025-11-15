import { useEffect } from 'react';

// Enhanced performance monitoring hook with Web Vitals
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reportWebVitals = (metric: PerformanceMetric) => {
      // Log in development for debugging
      if (import.meta.env.DEV) {
        console.log('📊 Performance:', metric);
      }
      
      // Send to analytics in production (can be enabled later)
      // if (import.meta.env.PROD) {
      //   // Send to Google Analytics or custom endpoint
      // }
    };

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // First Contentful Paint (FCP)
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          reportWebVitals({
            name: 'FCP',
            value: entry.startTime,
            timestamp: Date.now(),
            rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor'
          });
        }
        
        // Largest Contentful Paint (LCP)
        if (entry.entryType === 'largest-contentful-paint') {
          reportWebVitals({
            name: 'LCP',
            value: entry.startTime,
            timestamp: Date.now(),
            rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor'
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (e) {
      // Browser doesn't support this API
    }

    // Measure Time to Interactive (TTI) approximation
    if ('PerformanceObserver' in window) {
      try {
        const ttiObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            reportWebVitals({
              name: 'TTI',
              value: entries[entries.length - 1].startTime,
              timestamp: Date.now(),
            });
          }
        });
        ttiObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Browser doesn't support longtask
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};

// Hook to preload critical resources
export const useResourcePreloading = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Defer prefetching to idle time
    const idleCallback = window.requestIdleCallback || ((cb: Function) => setTimeout(cb, 1));
    
    idleCallback(() => {
      // Prefetch likely next pages
      const prefetchPage = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      };

      // Only prefetch after user shows intent to navigate
      const prefetchTimeout = setTimeout(() => {
        prefetchPage('/services');
        prefetchPage('/contact');
      }, 3000);

      return () => clearTimeout(prefetchTimeout);
    });
  }, []);
};