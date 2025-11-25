import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { checkReactDuplication } from "@/lib/reactDuplicationCheck";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";

// Check for React duplication in development
checkReactDuplication();

import { initPerformanceOptimizations } from "./lib/performanceOptimizer";
import { getPerformanceMonitor } from "./lib/performanceMonitor";
import { initRoutePrefetching } from "./lib/routePrefetch";

// Initialize performance optimizations
initPerformanceOptimizations();

// Initialize performance monitoring
getPerformanceMonitor();

// Initialize intelligent route prefetching
initRoutePrefetching();

// Add global error handlers for production debugging
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
