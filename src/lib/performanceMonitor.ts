/**
 * Advanced Performance Monitoring
 * Tracks Web Vitals, React rendering, and custom metrics
 */

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  renderCount: number;
  slowRenders: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderCount: 0,
    slowRenders: 0
  };
  
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window === 'undefined') return;
    this.initWebVitals();
    this.trackResourceTiming();
  }

  private initWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry: any) => {
      this.metrics.lcp = entry.renderTime || entry.loadTime;
      this.reportMetric('LCP', this.metrics.lcp);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry: any) => {
      this.metrics.fid = entry.processingStart - entry.startTime;
      this.reportMetric('FID', this.metrics.fid);
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observeMetric('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        this.metrics.cls = clsValue;
      }
    });

    // First Contentful Paint (FCP)
    this.observeMetric('paint', (entry: any) => {
      if (entry.name === 'first-contentful-paint') {
        this.metrics.fcp = entry.startTime;
        this.reportMetric('FCP', this.metrics.fcp);
      }
    });

    // Navigation timing for TTFB
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const navTiming = window.performance.timing;
        this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
        this.reportMetric('TTFB', this.metrics.ttfb);
      });
    }
  }

  private observeMetric(type: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });
      observer.observe({ type, buffered: true } as any);
      this.observers.push(observer);
    } catch (e) {
      // Browser doesn't support this metric
    }
  }

  private trackResourceTiming() {
    // Monitor slow resources
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const slowResources = resources.filter(r => r.duration > 1000);
      
      if (slowResources.length > 0 && import.meta.env.DEV) {
        console.warn('Slow resources detected:', slowResources.map(r => ({
          name: r.name,
          duration: `${r.duration.toFixed(0)}ms`,
          size: r.transferSize
        })));
      }
    });
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics in production
    if (import.meta.env.PROD) {
      // Integration with Google Analytics or custom endpoint
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: name,
          value: Math.round(value),
          non_interaction: true
        });
      }
    }

    // Log in development
    if (import.meta.env.DEV) {
      const emoji = this.getMetricEmoji(name, value);
      console.log(`${emoji} ${name}: ${value.toFixed(0)}ms`, this.getMetricRating(name, value));
    }
  }

  private getMetricEmoji(name: string, value: number): string {
    const rating = this.getMetricRating(name, value);
    return rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
  }

  private getMetricRating(name: string, value: number): string {
    const thresholds: Record<string, [number, number]> = {
      'LCP': [2500, 4000],
      'FID': [100, 300],
      'CLS': [0.1, 0.25],
      'FCP': [1800, 3000],
      'TTFB': [800, 1800]
    };

    const [good, poor] = thresholds[name] || [1000, 3000];
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  // Track React component renders
  trackRender(componentName: string, duration: number) {
    this.metrics.renderCount++;
    
    if (duration > 16) { // Slower than 60fps
      this.metrics.slowRenders++;
      
      if (import.meta.env.DEV) {
        console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
      }
    }
  }

  // Get performance summary
  getSummary(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Cleanup
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let monitor: PerformanceMonitor | null = null;

export const getPerformanceMonitor = () => {
  if (!monitor) {
    monitor = new PerformanceMonitor();
  }
  return monitor;
};

// Helper to track component render time
export const measureRender = (componentName: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  getPerformanceMonitor().trackRender(componentName, duration);
};

// Export for React DevTools Profiler
export const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) => {
  if (actualDuration > 16) {
    getPerformanceMonitor().trackRender(id, actualDuration);
  }
};

