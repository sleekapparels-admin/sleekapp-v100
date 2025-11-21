import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize Sentry in production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      // Environment
      environment: import.meta.env.MODE,
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || "unknown",
      // Before send - filter sensitive data
      beforeSend(event, hint) {
        // Helper function to sanitize objects for PII
        const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
          const sanitized: Record<string, any> = {};
          
          for (const [key, value] of Object.entries(obj)) {
            // Check if key name suggests sensitive data
            const keyLower = key.toLowerCase();
            const isSensitiveKey = 
              keyLower.includes('email') ||
              keyLower.includes('password') ||
              keyLower.includes('token') ||
              keyLower.includes('secret') ||
              keyLower.includes('key') ||
              keyLower.includes('auth') ||
              keyLower.includes('credential') ||
              keyLower.includes('api') ||
              keyLower.includes('bearer') ||
              keyLower.includes('jwt') ||
              keyLower.includes('session') ||
              keyLower.includes('cookie');
            
            if (isSensitiveKey) {
              sanitized[key] = '[REDACTED]';
            } else if (typeof value === 'string') {
              // Check if value looks like an email
              if (value.includes('@') && /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(value)) {
                sanitized[key] = '[REDACTED_EMAIL]';
              }
              // Check if value looks like a JWT token
              else if (value.split('.').length === 3 && value.length > 100) {
                sanitized[key] = '[REDACTED_TOKEN]';
              }
              // Check if value looks like an API key
              else if (value.length > 20 && /^[A-Za-z0-9_-]+$/.test(value) && 
                       (value.startsWith('sk_') || value.startsWith('pk_') || 
                        value.startsWith('api_') || value.startsWith('key_'))) {
                sanitized[key] = '[REDACTED_KEY]';
              }
              else {
                sanitized[key] = value;
              }
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              // Recursively sanitize nested objects
              sanitized[key] = sanitizeObject(value);
            } else {
              sanitized[key] = value;
            }
          }
          
          return sanitized;
        };

        // Remove sensitive data from request
        if (event.request) {
          delete event.request.cookies;
          // Remove authorization headers
          if (event.request.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['authorization'];
          }
        }
        
        // Sanitize custom contexts
        if (event.contexts?.custom) {
          event.contexts.custom = sanitizeObject(event.contexts.custom as Record<string, any>);
        }
        
        // Sanitize extra data
        if (event.extra) {
          event.extra = sanitizeObject(event.extra as Record<string, any>);
        }
        
        // Filter out network errors that are not actionable
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);
          if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
            return null; // Don't send network errors
          }
        }
        
        return event;
      },
      // Sanitize breadcrumbs (console logs, user actions)
      beforeBreadcrumb(breadcrumb) {
        // Sanitize console log breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.message) {
          // Redact email addresses in console logs
          breadcrumb.message = breadcrumb.message.replace(
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            '[EMAIL_REDACTED]'
          );
          // Redact JWT tokens in console logs
          breadcrumb.message = breadcrumb.message.replace(
            /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
            '[TOKEN_REDACTED]'
          );
        }
        
        // Sanitize data in breadcrumb
        if (breadcrumb.data) {
          const sanitized: Record<string, any> = {};
          for (const [key, value] of Object.entries(breadcrumb.data)) {
            const keyLower = key.toLowerCase();
            if (keyLower.includes('email') || keyLower.includes('token') || 
                keyLower.includes('password') || keyLower.includes('secret')) {
              sanitized[key] = '[REDACTED]';
            } else {
              sanitized[key] = value;
            }
          }
          breadcrumb.data = sanitized;
        }
        
        return breadcrumb;
      },
    });
  }
};

// Export error tracking utilities
export const logError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
};

export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level);
  } else {
    console[level === 'warning' ? 'warn' : level === 'error' ? 'error' : 'log'](message);
  }
};

export const setUserContext = (userId: string, email?: string) => {
  if (import.meta.env.PROD) {
    Sentry.setUser({ id: userId, email });
  }
};

export const clearUserContext = () => {
  if (import.meta.env.PROD) {
    Sentry.setUser(null);
  }
};
