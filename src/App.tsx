import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { router } from "./AppRoutes";

// Lazy load Sonner for better initial page load
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache cleanup (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
      // Structural sharing for better performance
      structuralSharing: true,
    },
    mutations: {
      retry: 1,
      gcTime: 5 * 60 * 1000, // 5 minutes cache for mutation results
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <Suspense fallback={null}>
              <Sonner />
            </Suspense>
            <noscript>
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#ffffff',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div>
                  <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#000' }}>
                    JavaScript Required
                  </h1>
                  <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
                    This website requires JavaScript to function properly. Please enable JavaScript in your browser settings.
                  </p>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    <p>For the best experience, we recommend using a modern browser with JavaScript enabled.</p>
                  </div>
                </div>
              </div>
            </noscript>
            <RouterProvider router={router} />
          </WishlistProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
