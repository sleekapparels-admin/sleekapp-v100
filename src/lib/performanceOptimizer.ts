/**
 * Performance optimization utilities
 * Handles resource preloading, DNS prefetch, and third-party script loading
 */

// Preload critical resources for faster LCP
export const preloadCriticalAssets = () => {
  // Removed unused sleek-logo.webp preload to eliminate console warning
  // Only preload assets that are actually used above the fold
};


// Load third-party tracking scripts after page load - deferred for better FCP/LCP
export const loadTrackingScripts = () => {
  // Only load once
  if ((window as any).__trackingLoaded) return;
  (window as any).__trackingLoaded = true;
  
  // Defer GTM load to not block initial render (after hero video loads)
  setTimeout(() => {
    (function(w: any, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-NSTT3GTQ');
  }, 5000); // Load after 5 seconds - video takes priority
};

// Resource hints
export const addResourceHints = () => {
  // Only add once
  if (document.querySelector('link[rel="dns-prefetch"]')) return;
  
  // DNS prefetch for external resources
  const dnsPrefetch = [
    'https://eqpftggctumujhutomom.supabase.co',
    'https://www.googletagmanager.com'
  ];

  // Preconnect to backend origin
  const preconnect = [
    'https://eqpftggctumujhutomom.supabase.co'
  ];

  // Batch DOM insertions
  const fragment = document.createDocumentFragment();
  
  dnsPrefetch.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    fragment.appendChild(link);
  });

  preconnect.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    fragment.appendChild(link);
  });
  
  document.head.appendChild(fragment);
};

// Initialize all optimizations
export const initPerformanceOptimizations = () => {
  if (typeof window === 'undefined') return;
  
  // Prevent double initialization
  if ((window as any).__perfOptimized) return;
  (window as any).__perfOptimized = true;

  // Run critical optimizations immediately
  preloadCriticalAssets();
  addResourceHints();

  // Defer non-critical optimizations with proper timing
  requestIdleCallback(() => {
    if (document.readyState === 'complete') {
      loadTrackingScripts();
    } else {
      window.addEventListener('load', loadTrackingScripts, { once: true });
    }
  }, { timeout: 5000 }); // Increased timeout for better initial load
};

// Request idle callback polyfill
const requestIdleCallback = (cb: () => void, options?: { timeout?: number }) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb, options);
  } else {
    setTimeout(cb, options?.timeout || 1);
  }
};
