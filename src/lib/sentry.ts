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
        // Remove sensitive data from events
        if (event.request) {
          delete event.request.cookies;
          // Remove authorization headers
          if (event.request.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['authorization'];
          }
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
