/**
 * Intelligent route prefetching for faster navigation
 */

interface PrefetchConfig {
  routes: string[];
  delay: number;
  priority: 'high' | 'low';
}

// Critical routes to prefetch after initial load
const CRITICAL_ROUTES: PrefetchConfig = {
  routes: ['/services', '/contact'],
  delay: 2000,
  priority: 'high',
};

// Secondary routes based on user behavior
const SECONDARY_ROUTES: PrefetchConfig = {
  routes: ['/about', '/portfolio', '/products'],
  delay: 5000,
  priority: 'low',
};

/**
 * Prefetch route chunks by creating hidden link elements
 */
const prefetchRoute = (path: string, priority: 'high' | 'low' = 'low') => {
  // Check if already prefetched
  const existing = document.querySelector(`link[href="${path}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  
  if (priority === 'high') {
    link.setAttribute('importance', 'high');
  }
  
  document.head.appendChild(link);
};

/**
 * Prefetch JavaScript chunks for lazy-loaded routes
 */
const prefetchChunks = (routeName: string) => {
  // Map routes to their likely chunk names
  const chunkMap: Record<string, string[]> = {
    '/services': ['ui-vendor', 'animation-vendor'],
    '/contact': ['forms', 'ui-vendor'],
    '/about': ['animation-vendor'],
    '/portfolio': ['ui-vendor', 'animation-vendor'],
    '/products': ['ui-vendor', 'query-vendor'],
  };

  const chunks = chunkMap[routeName];
  if (!chunks) return;

  chunks.forEach((chunk) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = `/assets/js/${chunk}-[hash].js`; // Vite will resolve the hash
    document.head.appendChild(link);
  });
};

/**
 * Initialize intelligent route prefetching
 */
export const initRoutePrefetching = () => {
  if (typeof window === 'undefined') return;

  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPrefetching);
  } else {
    startPrefetching();
  }
};

const startPrefetching = () => {
  // Prefetch critical routes first
  setTimeout(() => {
    CRITICAL_ROUTES.routes.forEach((route) => {
      prefetchRoute(route, CRITICAL_ROUTES.priority);
      prefetchChunks(route);
    });
  }, CRITICAL_ROUTES.delay);

  // Prefetch secondary routes later
  setTimeout(() => {
    SECONDARY_ROUTES.routes.forEach((route) => {
      prefetchRoute(route, SECONDARY_ROUTES.priority);
    });
  }, SECONDARY_ROUTES.delay);

  // Intelligent hover prefetching
  setupHoverPrefetch();
};

/**
 * Prefetch routes when user hovers over navigation links
 */
const setupHoverPrefetch = () => {
  let hoverTimeout: NodeJS.Timeout;

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
    
    if (!link) return;

    clearTimeout(hoverTimeout);
    
    // Prefetch after 200ms hover (indicates intent)
    hoverTimeout = setTimeout(() => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        prefetchRoute(href, 'high');
        prefetchChunks(href);
      }
    }, 200);
  });

  document.addEventListener('mouseout', () => {
    clearTimeout(hoverTimeout);
  });
};

/**
 * Prefetch route on demand (for programmatic use)
 */
export const prefetchRouteNow = (path: string) => {
  prefetchRoute(path, 'high');
  prefetchChunks(path);
};
