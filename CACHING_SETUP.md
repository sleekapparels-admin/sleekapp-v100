# Caching Configuration Guide

## Overview

This application implements a **multi-layer caching strategy** to maximize performance and reduce bandwidth usage:

1. **HTTP Cache Headers** (CDN/Server level)
2. **Service Worker Cache** (Client-side)
3. **Browser Cache** (Native browser caching)

## Current Implementation

### 1. Service Worker (`public/sw.js`)

The service worker provides aggressive client-side caching with the following strategy:

- **Static Assets** (JS, CSS, fonts): Cache-first with 1-year retention
- **Images & Videos**: Cache-first with 1-year retention  
- **HTML Pages**: Network-first with cache fallback
- **API Calls**: Network-first with cache fallback

**Cache Versions:**
- `sleek-textile-v3`: Primary cache
- `sleek-textile-runtime-v3`: Runtime cache for HTML/API
- `sleek-textile-images-v3`: Images and videos
- `sleek-textile-assets-v3`: JS, CSS, fonts

### 2. HTTP Cache Headers (`public/_headers`)

The `_headers` file configures CDN-level caching:

```
/assets/*      -> Cache-Control: public, max-age=31536000, immutable (1 year)
/videos/*      -> Cache-Control: public, max-age=31536000, immutable (1 year)
*.{js,css,...} -> Cache-Control: public, max-age=31536000, immutable (1 year)
/*.html        -> Cache-Control: public, max-age=0, must-revalidate (no cache)
```

### 3. Build Configuration (`vite.config.ts`)

Vite generates **content-hashed filenames** for all static assets:
- `assets/js/[name]-[hash].js`
- `assets/images/[name]-[hash].webp`
- `assets/fonts/[name]-[hash].woff2`

This allows safe long-term caching with automatic cache busting on updates.

## Platform-Specific Notes

### Lovable Hosting

⚠️ **Important:** Lovable's CDN may not fully respect `_headers` or `.htaccess` files. 

**What works:**
- ✅ Service Worker caching (client-side)
- ✅ Content-hashed filenames (cache busting)
- ✅ Browser cache API

**What might not work:**
- ⚠️ HTTP Cache-Control headers from `_headers` file
- ⚠️ Apache `.htaccess` directives

**Impact on Lighthouse:**
- Lighthouse audits check **HTTP cache headers** from the server
- Service worker caching is not measured by Lighthouse's cache audit
- You may see "Use efficient cache lifetimes" warnings even with working SW cache

### Alternative Hosting Platforms

If deploying to **Netlify**, **Vercel**, or **Cloudflare Pages**:
- The `_headers` file will be respected
- HTTP cache headers will be properly set
- Lighthouse scores will improve significantly

For **custom servers** (Nginx, Apache):
- Use the `.htaccess` file for Apache
- Create equivalent Nginx config for Nginx servers

## Performance Impact

**With Service Worker Active:**
- Static assets cached for 1 year (locally)
- Images and videos cached for 1 year (locally)
- Near-instant repeat visits for returning users
- Offline capability for cached pages

**Estimated Savings:**
- ~11 MB saved per repeat visit
- 50-90% faster page loads for returning users
- Reduced bandwidth costs

## Verification

### Check Service Worker Registration

Open DevTools Console:
```javascript
navigator.serviceWorker.getRegistrations()
```

Should show: `ServiceWorkerRegistration { scope: "/" }`

### Check Cached Assets

1. Open DevTools → Application → Cache Storage
2. Look for: `sleek-textile-v3`, `sleek-textile-images-v3`, etc.
3. Verify assets are cached

### Test Offline Mode

1. Visit the site (ensures SW installs)
2. Open DevTools → Network → Enable "Offline" mode
3. Refresh page - should still load from cache

## Troubleshooting

### Service Worker Not Installing

**Check:**
- Site must be served over HTTPS (or localhost)
- `sw.js` must be in `public/` folder
- Console for SW registration errors

### Assets Not Caching

**Check:**
- Service Worker is active (DevTools → Application)
- Network tab shows assets loaded from "ServiceWorker"
- Cache Storage shows assets in cache

### Lighthouse Still Shows Low Cache Score

This is expected on Lovable hosting because:
- Lighthouse checks HTTP headers, not Service Worker
- Lovable's CDN may not set proper Cache-Control headers
- Service Worker caching is functionally equivalent but not measured

**Solution:** Service Worker provides the same benefits (or better), even if Lighthouse doesn't detect it.

## Maintenance

### Updating Cache Version

When making breaking changes to cached assets:

1. Update version in `public/sw.js`:
```javascript
const CACHE_NAME = 'sleek-textile-v4'; // Increment version
```

2. Update in `src/lib/cacheConfig.ts`:
```typescript
version: 'v4'
```

3. Old caches will be automatically cleaned up

### Monitoring Cache Size

Service Worker caches can grow large. Monitor via:
```javascript
// Check total cache size
caches.keys().then(async (keys) => {
  for (const key of keys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    console.log(`${key}: ${requests.length} items`);
  }
});
```

## Best Practices

✅ **Do:**
- Use content-hashed filenames for static assets
- Cache static assets aggressively (1 year)
- Use network-first for HTML and API calls
- Implement cache versioning for breaking changes

❌ **Don't:**
- Cache HTML pages with long max-age
- Cache without content hashing (leads to stale content)
- Mix cached and uncached versions of same file
- Forget to update SW version after major changes

## Additional Resources

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [HTTP Caching Guide](https://web.dev/http-cache/)
- [Cache-Control Best Practices](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/)
