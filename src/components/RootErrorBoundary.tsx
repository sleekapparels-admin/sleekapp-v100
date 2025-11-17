import React, { Component, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  clearCacheAndReload = async () => {
    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear localStorage flag
      localStorage.removeItem('disable-sw');

      // Force reload
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback: just reload
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-foreground">
              Oops! Something went wrong
            </h1>
            
            <p className="text-muted-foreground mb-6">
              The application encountered an unexpected error. This is often caused by outdated cached files.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={this.clearCacheAndReload}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Cache & Reload
              </Button>

              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Just Reload
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-48">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              If this issue persists, try opening the site in an incognito/private window.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
