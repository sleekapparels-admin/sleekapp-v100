import React from 'react';
import * as Sentry from "@sentry/react";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        </div>
        
        <p className="text-muted-foreground mb-4">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        
        {import.meta.env.DEV && (
          <div className="bg-muted p-3 rounded mb-4 overflow-auto">
            <p className="text-sm font-mono text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={resetError} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex-1"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: (errorData) => (
      <ErrorFallback 
        error={errorData.error instanceof Error ? errorData.error : new Error(String(errorData.error))} 
        resetError={errorData.resetError} 
      />
    ),
    showDialog: false,
  }
);
