import { useEffect } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Core Web Vitals Monitoring Hook
 * Tracks LCP, FID/INP, CLS metrics and reports to analytics
 */
export const useCoreWebVitals = () => {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) return;

    // LCP - Largest Contentful Paint
    const reportLCP = (metric: WebVitalMetric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
      console.log('LCP:', metric.value, 'ms');
    };

    // FID/INP - First Input Delay / Interaction to Next Paint
    const reportINP = (metric: WebVitalMetric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'INP',
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }
      console.log('INP:', metric.value, 'ms');
    };

    // CLS - Cumulative Layout Shift
    const reportCLS = (metric: WebVitalMetric) => {
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: metric.value.toFixed(4),
          non_interaction: true,
        });
      }
      console.log('CLS:', metric.value);
    };

    // Use web-vitals library if available
    import('web-vitals').then(({ onLCP, onINP, onCLS }) => {
      onLCP(reportLCP);
      onINP(reportINP);
      onCLS(reportCLS);
    }).catch(() => {
      // Fallback: manual performance observer
      if ('PerformanceObserver' in window) {
        try {
          // Observe LCP
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            reportLCP({ 
              name: 'LCP',
              value: lastEntry.startTime,
              delta: 0,
              id: 'fallback-lcp'
            });
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          // Observe CLS
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShift = entry as LayoutShift;
              if (!layoutShift.hadRecentInput) {
                clsValue += layoutShift.value;
              }
            }
            reportCLS({ 
              name: 'CLS',
              value: clsValue,
              delta: 0,
              id: 'fallback-cls'
            });
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (_error) {
          console.warn('Performance Observer not fully supported');
        }
      }
    });
  }, []);
};
