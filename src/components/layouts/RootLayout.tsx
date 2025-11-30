import { Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { SmartAIAssistant } from "@/components/SmartAIAssistant";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { PageLoadingSkeleton } from "@/components/LoadingSkeleton";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { GA4_MEASUREMENT_ID, GTM_CONTAINER_ID } from "@/lib/analytics";

export const RootLayout = () => {
    const location = useLocation();
    const isAdminSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('admin.');

    return (
        <AnalyticsProvider
            gaId={GA4_MEASUREMENT_ID}
            gtmId={GTM_CONTAINER_ID}
        >
            <ScrollToTop />
            <SmartAIAssistant />
            <CookieConsentBanner />
            {isAdminSubdomain && location.pathname !== '/admin' ? (
                <Navigate to="/admin" replace />
            ) : (
                <RouteErrorBoundary>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                        <Outlet />
                    </Suspense>
                </RouteErrorBoundary>
            )}
        </AnalyticsProvider>
    );
};
