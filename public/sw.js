const CACHE_NAME = 'sleek-textile-v10';
const RUNTIME_CACHE = 'sleek-textile-runtime-v10';
const IMAGE_CACHE = 'sleek-textile-images-v10';
const ASSET_CACHE = 'sleek-textile-assets-v10';
const API_CACHE = 'sleek-textile-api-v10';

// Cache durations
const MAX_CACHE_AGE = {
  static: 365 * 24 * 60 * 60 * 1000, // 1 year
  dynamic: 24 * 60 * 60 * 1000,      // 1 day
  api: 5 * 60 * 1000,                // 5 minutes
};

// Assets to cache on install (excluding HTML to prevent stale cache)
// Removed unused sleek-logo.webp to prevent console warnings
const PRECACHE_URLS = [];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Listen for SKIP_WAITING message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, ASSET_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Stale-while-revalidate helper
const staleWhileRevalidate = async (request, cacheName, maxAge) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  // Check cache age
  if (cachedResponse) {
    const cachedAt = cachedResponse.headers.get('sw-cached-at');
    const age = cachedAt ? Date.now() - parseInt(cachedAt) : Infinity;
    
    if (age < maxAge) {
      return cachedResponse;
    }
  }
  
  return fetchPromise;
};

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests - fixes Cache API errors for POST/PUT/DELETE
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Stale-while-revalidate for API calls (5 min cache)
  if (url.pathname.startsWith('/api') || url.hostname.includes('supabase')) {
    event.respondWith(
      staleWhileRevalidate(request, API_CACHE, MAX_CACHE_AGE.api)
        .catch(() => new Response('{"error":"offline"}', {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // Aggressive cache-first for videos (1 year cache)
  if (request.destination === 'video' || url.pathname.includes('/videos/') || url.pathname.match(/\.(mp4|webm)$/)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Aggressive cache-first for images (1 year cache)
  if (
    request.destination === 'image' || 
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-first for JS modules to avoid React duplication issues
  // Cache-first for hashed CSS and fonts only
  if (
    request.destination === 'script' || 
    url.pathname.match(/\.js$/)
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then(cached => {
          if (cached) return cached;
          return new Response('console.error("Failed to load script");', {
            status: 503,
            headers: { 'Content-Type': 'application/javascript' }
          });
        });
      })
    );
    return;
  }

  // Aggressive cache-first for CSS and fonts only
  if (
    url.pathname.startsWith('/assets/') ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(css|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response && response.status === 200 && response.type !== 'opaque') {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-first for HTML documents
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
