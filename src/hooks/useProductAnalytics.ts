import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

type InteractionType = 
  | 'hover' 
  | 'quick_view_click' 
  | 'wishlist_click' 
  | 'color_swatch_click' 
  | 'design_click' 
  | 'quote_click'
  | 'add_to_cart'
  | 'view_details';

interface TrackingOptions {
  color?: string;
  additionalData?: Record<string, any>;
}

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function useProductAnalytics() {
  const trackedHovers = useRef<Set<string>>(new Set());
  const sessionId = useRef<string>(getSessionId());

  // Track product interaction
  const trackInteraction = useCallback(async (
    productId: string,
    interactionType: InteractionType,
    options?: TrackingOptions
  ) => {
    try {
      // For hover events, only track once per session per product
      if (interactionType === 'hover') {
        const hoverKey = `${productId}_hover`;
        if (trackedHovers.current.has(hoverKey)) {
          return; // Already tracked
        }
        trackedHovers.current.add(hoverKey);
      }

      // Call edge function to track interaction
      await supabase.functions.invoke('track-product-interaction', {
        body: {
          productId,
          interactionType,
          sessionId: sessionId.current,
          additionalData: options?.additionalData || {}
        }
      });

      console.log(`[Analytics] Tracked ${interactionType} for product ${productId}`);
    } catch (error) {
      // Silently fail - don't block user experience
      console.error('[Analytics] Failed to track interaction:', error);
    }
  }, []);

  // Debounced hover tracking
  const trackHover = useCallback((productId: string) => {
    trackInteraction(productId, 'hover');
  }, [trackInteraction]);

  // Track quick view click
  const trackQuickView = useCallback((productId: string) => {
    trackInteraction(productId, 'quick_view_click');
  }, [trackInteraction]);

  // Track wishlist click
  const trackWishlist = useCallback((productId: string) => {
    trackInteraction(productId, 'wishlist_click');
  }, [trackInteraction]);

  // Track color swatch interaction
  const trackColorSwatch = useCallback((productId: string, color: string) => {
    trackInteraction(productId, 'color_swatch_click', {
      color,
      additionalData: { color }
    });
  }, [trackInteraction]);

  // Track design button click
  const trackDesignClick = useCallback((productId: string) => {
    trackInteraction(productId, 'design_click');
  }, [trackInteraction]);

  // Track quote button click
  const trackQuoteClick = useCallback((productId: string) => {
    trackInteraction(productId, 'quote_click');
  }, [trackInteraction]);

  // Track view details
  const trackViewDetails = useCallback((productId: string) => {
    trackInteraction(productId, 'view_details');
  }, [trackInteraction]);

  return {
    trackHover,
    trackQuickView,
    trackWishlist,
    trackColorSwatch,
    trackDesignClick,
    trackQuoteClick,
    trackViewDetails,
    trackInteraction
  };
}
