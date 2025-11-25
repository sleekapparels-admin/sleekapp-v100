import React from 'react';
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
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>
        
        <div className="bg-muted p-3 rounded-md mb-4 overflow-auto max-h-32">
          <code className="text-sm text-muted-foreground">{error.message}</code>
        </div>
        
        <Button 
          onClick={resetError}
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

// Simple error boundary without Sentry
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} resetError={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;