/**
 * User Analytics & Behavior Tracking
 */

import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";

// Get session ID for anonymous tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Country tracking disabled to prevent CORS errors
// Can be re-enabled with backend proxy if needed
const getUserCountry = async (): Promise<string | null> => {
  return null; // Disabled for performance
};

interface TrackEventParams {
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
}

/**
 * Track user events for admin analytics
 */
export const trackEvent = async ({
  eventType,
  eventData = {},
  pageUrl = window.location.pathname,
}: TrackEventParams) => {
  // Analytics tracking temporarily disabled - table not configured
  // Re-enable after creating user_analytics table if needed
  if (import.meta.env.DEV) {
    console.log('Analytics event:', { eventType, eventData, pageUrl });
  }
};

/**
 * Track product interactions
 */
export const trackProductInteraction = async ({
  productId,
  productCategory,
  interactionType,
  durationSeconds,
}: {
  productId?: string;
  productCategory?: string;
  interactionType: 'view' | 'click' | 'scroll_past' | 'hover';
  durationSeconds?: number;
}) => {
  // Product interaction tracking temporarily disabled - table not configured
  if (import.meta.env.DEV) {
    console.log('Product interaction:', { productId, productCategory, interactionType, durationSeconds });
  }
};

/**
 * Track page views
 */
export const trackPageView = (pageName: string) => {
  trackEvent({
    eventType: 'page_view',
    eventData: { page_name: pageName },
  });
};

/**
 * Track bounce (user leaving without interaction)
 */
export const trackBounce = (timeSpentSeconds: number) => {
  trackEvent({
    eventType: 'bounce',
    eventData: { time_spent: timeSpentSeconds },
  });
};

/**
 * Track quote generation attempts
 */
export const trackQuoteAttempt = (success: boolean, errorReason?: string) => {
  trackEvent({
    eventType: 'quote_attempt',
    eventData: { success, error_reason: errorReason },
  });
};

/**
 * Track signup conversion
 */
export const trackSignup = (method: 'direct' | 'quote_flow', role?: string) => {
  trackEvent({
    eventType: 'signup',
    eventData: { method, role },
  });
};
