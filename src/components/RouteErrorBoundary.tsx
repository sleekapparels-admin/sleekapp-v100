import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("RouteErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>
                  {this.props.fallbackTitle || "Something went wrong"}
                </CardTitle>
              </div>
              <CardDescription>
                {this.props.fallbackDescription || 
                  "This section encountered an error. You can try reloading or return to the previous page."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default">
                  Reload Page
                </Button>
                <Button onClick={() => window.history.back()} variant="outline">
                  Go Back
                </Button>
              </div>
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-4 p-3 bg-muted rounded-md text-xs">
                  <p className="font-semibold mb-1">Error Details (dev only):</p>
                  <p className="text-destructive">{this.state.error.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
