/**
 * Service Worker Registration for caching strategies
 */

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // Check for bypass flags
    const urlParams = new URLSearchParams(window.location.search);
    const disableViaTool = urlParams.has('no-sw');
    const disableViaStorage = localStorage.getItem('disable-sw') === '1';
    
    if (disableViaTool || disableViaStorage) {
      console.log('[SW] Service Worker registration bypassed');
      // Unregister any existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      const handleUpdateFound = () => {
        const newWorker = registration.installing;
        if (newWorker) {
          const handleStateChange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available - notify via dataLayer (no forced reload)
              if (import.meta.env.PROD) {
                // Check if we've already notified about this update
                const updateKey = `sw_update_${CACHE_CONFIG.version}`;
                if (!sessionStorage.getItem(updateKey)) {
                  sessionStorage.setItem(updateKey, 'notified');
                  
                  // Push to dataLayer for analytics
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'sw_update_available',
                    sw_version: CACHE_CONFIG.version
                  });
                  
                  // Tell the waiting SW to activate on next navigation
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              }
            }
          };
          
          newWorker.addEventListener('statechange', handleStateChange);
        }
      };
      
      registration.addEventListener('updatefound', handleUpdateFound);
      
      return registration;
    } catch (error) {
      // Only log errors in development
      if (import.meta.env.DEV) {
        console.error('Service Worker registration failed:', error);
      }
      return null;
    }
  }
  return null;
};

// Cache configuration with stale-while-revalidate support
export const CACHE_CONFIG = {
  version: 'v10',
  caches: {
    static: 'static-cache-v10',
    dynamic: 'dynamic-cache-v10',
    images: 'image-cache-v10',
    assets: 'asset-cache-v10',
    api: 'api-cache-v10',
  },
  maxAge: {
    static: 365 * 24 * 60 * 60 * 1000,  // 1 year for immutable hashed assets
    dynamic: 24 * 60 * 60 * 1000,       // 1 day for dynamic content
    images: 365 * 24 * 60 * 60 * 1000,  // 1 year for images
    api: 5 * 60 * 1000,                 // 5 minutes for API responses
  },
  strategies: {
    static: 'cache-first',
    dynamic: 'stale-while-revalidate',
    api: 'stale-while-revalidate',
  },
};
