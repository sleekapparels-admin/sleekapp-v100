// Google Analytics 4 configuration
export const GA4_MEASUREMENT_ID = 'G-1PYKLMP22J';
export const GA4_STREAM_ID = '13041825408';

// Google Tag Manager configuration
export const GTM_CONTAINER_ID = 'GTM-WGTH2FQ9';

// Microsoft Clarity configuration
export const CLARITY_PROJECT_ID = 'txi3rcrykl';

// Facebook Pixel configuration
export const FACEBOOK_PIXEL_ID = '1165081028902190';

// LinkedIn Insight Tag configuration
export const LINKEDIN_PARTNER_ID = '514756254';

// Push custom events to GTM DataLayer
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track business-specific events
export const trackBusinessEvent = {
  quoteRequest: (productType: string, quantity: number) => {
    trackEvent('quote_request', 'lead_generation', `${productType}_${quantity}`);
    pushToDataLayer({
      event: 'quote_request',
      productType,
      quantity,
      category: 'lead_generation'
    });
  },
  
  looptraceSignup: (source: string) => {
    trackEvent('looptrace_signup', 'engagement', source);
    pushToDataLayer({
      event: 'looptrace_signup',
      source,
      category: 'engagement'
    });
  },
  
  designStudioUsage: (action: 'start' | 'complete' | 'export') => {
    trackEvent(`design_studio_${action}`, 'product_usage');
    pushToDataLayer({
      event: `design_studio_${action}`,
      action,
      category: 'product_usage'
    });
  },
  
  contactFormSubmit: (formType: string) => {
    trackEvent('contact_form_submit', 'lead_generation', formType);
    pushToDataLayer({
      event: 'contact_form_submit',
      formType,
      category: 'lead_generation'
    });
  },
  
  videoEngagement: (videoName: string, percentage: number) => {
    trackEvent('video_engagement', 'content', videoName, percentage);
    pushToDataLayer({
      event: 'video_engagement',
      videoName,
      percentage,
      category: 'content'
    });
  }
};

// Facebook Pixel tracking
export const trackFacebookPixel = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

// LinkedIn Insight Tag tracking
export const trackLinkedInEvent = (conversionId?: string) => {
  if (typeof window !== 'undefined' && window.lintrk) {
    if (conversionId) {
      window.lintrk('track', { conversion_id: conversionId });
    } else {
      window.lintrk('track');
    }
  }
};

// Microsoft Clarity tracking
export const trackClarityEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName);
  }
};

// Enhanced business events with multi-platform tracking
export const trackMultiPlatformEvent = {
  quoteRequest: (productType: string, quantity: number) => {
    // Google Analytics
    trackBusinessEvent.quoteRequest(productType, quantity);
    
    // Facebook Pixel
    trackFacebookPixel('Lead', {
      content_name: productType,
      value: quantity,
      currency: 'USD'
    });
    
    // LinkedIn
    trackLinkedInEvent();
    
    // Clarity
    trackClarityEvent('quote_request');
  },
  
  contactFormSubmit: (formType: string) => {
    // Google Analytics
    trackBusinessEvent.contactFormSubmit(formType);
    
    // Facebook Pixel
    trackFacebookPixel('Contact', { form_type: formType });
    
    // LinkedIn
    trackLinkedInEvent();
    
    // Clarity
    trackClarityEvent('contact_form_submit');
  },
  
  signupComplete: (source: string) => {
    // Facebook Pixel
    trackFacebookPixel('CompleteRegistration', { source });
    
    // LinkedIn
    trackLinkedInEvent();
    
    // Clarity
    trackClarityEvent('signup_complete');
  }
};

// Declare global tracking functions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
    lintrk?: (...args: any[]) => void;
    _linkedin_data_partner_ids?: string[];
    clarity?: (...args: any[]) => void;
    CLARITY_BLOCKED?: boolean;
  }
}