/**
 * Database Analytics Tracking
 * Tracks user events in the database for data collection and behavior analysis
 */

import { supabase } from '@/integrations/supabase/client';

export interface DatabaseAnalyticsEvent {
  event_name: string;
  event_category?: 'engagement' | 'conversion' | 'navigation' | 'error';
  event_properties?: Record<string, any>;
  page_url?: string;
  referrer?: string;
}

/**
 * Track an analytics event in the database
 * @param event - The event to track
 */
export async function trackDatabaseEvent(event: DatabaseAnalyticsEvent): Promise<void> {
  try {
    // Get current user session (if authenticated)
    const { data: { session } } = await supabase.auth.getSession();
    
    // Get or create anonymous session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // Get browser and device info
    const userAgent = navigator.userAgent;
    const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop';
    
    // Prepare event data
    const eventData = {
      event_name: event.event_name,
      event_category: event.event_category || null,
      user_id: session?.user?.id || null,
      session_id: sessionId,
      anonymous_id: sessionId, // Use session ID as anonymous ID
      page_url: event.page_url || window.location.href,
      referrer: event.referrer || document.referrer || null,
      event_properties: event.event_properties || null,
      user_agent: userAgent,
      device_type: deviceType,
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
    };

    // Insert event into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert(eventData);

    if (error) {
      console.warn('Failed to track database analytics event:', error);
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Database Analytics Event:', event.event_name, event.event_properties);
    }
  } catch (err) {
    console.warn('Database analytics tracking error:', err);
  }
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, success: boolean): void {
  trackDatabaseEvent({
    event_name: 'form_submit',
    event_category: 'conversion',
    event_properties: { 
      form_name: formName,
      success: success
    },
  });
}

/**
 * Track signup completion
 */
export function trackSignupComplete(method: 'email' | 'google', userType?: string): void {
  trackDatabaseEvent({
    event_name: 'signup_completed',
    event_category: 'conversion',
    event_properties: { 
      signup_method: method,
      user_type: userType
    },
  });
}

/**
 * Track CTA click (Call to Action)
 */
export function trackCTAClick(ctaName: string, ctaLocation: string): void {
  trackDatabaseEvent({
    event_name: 'cta_clicked',
    event_category: 'engagement',
    event_properties: { 
      cta_name: ctaName,
      cta_location: ctaLocation
    },
  });
}

/**
 * Detect browser from user agent
 */
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

/**
 * Detect OS from user agent
 */
function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone')) return 'iOS';
  return 'Unknown';
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParameters(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  };
}
