import { Skeleton } from "@/components/ui/skeleton";

/**
 * Comprehensive loading skeleton for page content
 * Provides visual feedback during async loading
 */
export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="sticky top-0 bg-background/98 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton className="h-10 w-32" />
            <div className="hidden md:flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Hero/Header skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4 mb-12">
          <Skeleton className="h-12 w-3/4 max-w-2xl" />
          <Skeleton className="h-6 w-1/2 max-w-xl" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Minimal loading fallback with spinner
 * Used for quick transitions
 */
export const MinimalLoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" 
             role="status" 
             aria-label="Loading">
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">Loading...</p>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your content</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Dashboard loading skeleton
 * Optimized for admin/dashboard pages
 */
export const DashboardLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
