import { Skeleton } from "@/components/ui/skeleton";
import sleekLogo from "@/assets/sleek-logo.svg";

/**
 * Branded loading component with spinning logo animation
 * Provides engaging visual feedback during page loading
 */
export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F4' }}>
      <div className="text-center space-y-6">
        {/* Spinning Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <img 
              src={sleekLogo} 
              alt="Sleek Apparels Logo" 
              className="w-full h-full object-contain animate-spin"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold" style={{ color: '#2C2C2C' }}>
            Preparing your experience...
          </p>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2C2C2C', animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2C2C2C', animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#2C2C2C', animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Minimal loading fallback with branded spinner
 * Used for quick transitions
 */
export const MinimalLoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F4' }}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src={sleekLogo} 
            alt="Loading" 
            className="h-16 w-16 animate-spin"
            style={{ animationDuration: '2s' }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold" style={{ color: '#2C2C2C' }}>Preparing your experience...</p>
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
