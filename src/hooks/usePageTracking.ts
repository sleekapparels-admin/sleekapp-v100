import { useEffect } from 'react';
import { trackPageView, trackBounce } from '@/lib/analytics/tracker';

/**
 * Hook to track page views and bounces
 */
export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    const startTime = Date.now();
    
    // Track page view
    trackPageView(pageName);

    // Track bounce on unmount if user spent less than 5 seconds
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent < 5) {
        trackBounce(timeSpent);
      }
    };
  }, [pageName]);
};
