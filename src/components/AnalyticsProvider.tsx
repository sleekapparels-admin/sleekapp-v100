import { useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, pushToDataLayer, CLARITY_PROJECT_ID, FACEBOOK_PIXEL_ID, LINKEDIN_PARTNER_ID } from '@/lib/analytics';
import { checkClarityReachability } from '@/lib/analytics/clarityCheck';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  gaId?: string;
  gtmId?: string;
  clarityId?: string;
  facebookPixelId?: string;
  linkedInPartnerId?: string;
}

// Memoize AnalyticsProvider to prevent unnecessary re-renders
export const AnalyticsProvider = memo(({ 
  children, 
  gaId,
  gtmId,
  clarityId = CLARITY_PROJECT_ID,
  facebookPixelId = FACEBOOK_PIXEL_ID,
  linkedInPartnerId = LINKEDIN_PARTNER_ID
}: AnalyticsProviderProps) => {
  const location = useLocation();

  // Initialize Google Analytics - deferred on user interaction
  useEffect(() => {
    if (!gaId) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth <= 768;

    let loaded = false;
    const loadGA = () => {
      if (loaded) return;
      loaded = true;

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId);
    };

    // Load on first user interaction
    const events = ['mousedown', 'touchstart', 'scroll', 'keydown'];
    const handleInteraction = () => {
      loadGA();
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };

    events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true, once: true }));

    // Fallback: NO timeout on mobile, 10s on desktop
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (!isMobile) {
      timeoutId = setTimeout(loadGA, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };
  }, [gaId]);

  // GTM removed - using pure GA4 tracking now

  // Microsoft Clarity is loaded via Google Tag Manager
  // No direct initialization needed to avoid duplicate loading
  
  // Check Clarity reachability after GTM initializes - deferred
  useEffect(() => {
    if (!clarityId || clarityId === 'YOUR_CLARITY_PROJECT_ID') return;
    
    // Wait for GTM to attempt loading Clarity (deferred)
    const checkTimeout = setTimeout(async () => {
      // If Clarity didn't load, check if it's blocked
      if (!window.clarity && !window.CLARITY_BLOCKED) {
        const result = await checkClarityReachability();
        
        if (!result.reachable) {
          // Mark as blocked to prevent further checks
          window.CLARITY_BLOCKED = true;
          
          // Send diagnostic event to GTM
          pushToDataLayer({
            event: 'clarity_blocked',
            clarity_error: result.error,
            clarity_host: result.host,
            reason: 'HTTPS inspection or firewall blocking',
          });
          
          // Dev-only logging
          if (import.meta.env.DEV) {
            console.info(
              '%c[Analytics] Microsoft Clarity unreachable',
              'color: #ff9800; font-weight: bold',
              '\n→ Likely cause: HTTPS inspection or corporate firewall',
              '\n→ This only affects your development environment',
              '\n→ Real visitors should not be affected',
              `\n→ Details: ${result.error}`
            );
          }
        }
      }
    }, 5000); // Wait 5 seconds (deferred after analytics load)
    
    return () => clearTimeout(checkTimeout);
  }, [clarityId]);

  // Initialize Facebook Pixel - load on interaction
  useEffect(() => {
    if (!facebookPixelId || facebookPixelId === 'YOUR_FACEBOOK_PIXEL_ID') return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth <= 768;

    let loaded = false;
    const loadFBPixel = () => {
      if (loaded) return;
      loaded = true;

      // Facebook Pixel Code
      (function(f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        }
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq?.('init', facebookPixelId);
      window.fbq?.('track', 'PageView');
    };

    // Load on interaction
    const events = ['mousedown', 'touchstart'];
    const handleInteraction = () => {
      loadFBPixel();
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };

    events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true, once: true }));

    // Fallback: NO timeout on mobile, 10s on desktop
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (!isMobile) {
      timeoutId = setTimeout(loadFBPixel, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };
  }, [facebookPixelId]);

  // Initialize LinkedIn Insight Tag - load on interaction
  useEffect(() => {
    if (!linkedInPartnerId || linkedInPartnerId === 'YOUR_LINKEDIN_PARTNER_ID') return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth <= 768;

    let loaded = false;
    const loadLinkedIn = () => {
      if (loaded) return;
      loaded = true;

      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(linkedInPartnerId);

      (function(l: any) {
        if (!l) {
          const lintrk: any = function(a: any, b: any) {
            lintrk.q.push([a, b]);
          };
          lintrk.q = [];
          window.lintrk = lintrk;
        }
        const s = document.getElementsByTagName("script")[0];
        const b = document.createElement("script");
        b.type = "text/javascript";
        b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        if (s && s.parentNode) {
          s.parentNode.insertBefore(b, s);
        }
      })(window.lintrk);
    };

    // Load on interaction
    const events = ['mousedown', 'touchstart'];
    const handleInteraction = () => {
      loadLinkedIn();
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };

    events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true, once: true }));

    // Fallback: NO timeout on mobile, 10s on desktop
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (!isMobile) {
      timeoutId = setTimeout(loadLinkedIn, 10000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, handleInteraction));
    };
  }, [linkedInPartnerId]);

  // Track page views on route change (all platforms)
  useEffect(() => {
    // GA4 tracking
    trackPageView(window.location.href, document.title);
    
    // Also push to dataLayer for GA4 events
    pushToDataLayer({
      event: 'page_view',
      page_location: window.location.href,
      page_title: document.title,
      page_path: location.pathname
    });

    // Facebook Pixel tracking
    if (window.fbq && facebookPixelId && facebookPixelId !== 'YOUR_FACEBOOK_PIXEL_ID') {
      window.fbq('track', 'PageView');
    }

    // Clarity tracking
    if (window.clarity && clarityId && clarityId !== 'YOUR_CLARITY_PROJECT_ID') {
      window.clarity('set', 'page', location.pathname);
    }
  }, [location, facebookPixelId, clarityId]);

  return <>{children}</>;
});

AnalyticsProvider.displayName = 'AnalyticsProvider';