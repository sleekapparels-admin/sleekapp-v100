import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ServiceWorkerStatus } from "@/components/ServiceWorkerStatus";
import { GA4_MEASUREMENT_ID, GTM_CONTAINER_ID } from "@/lib/analytics";
import { lazy, Suspense } from "react";

// Lazy load Sonner for better initial page load
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Critical pages - load immediately
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Health from "./pages/Health";

// Lazy load secondary pages
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
const Services = lazy(() => import("./pages/Services"));
const Knitwear = lazy(() => import("./pages/Knitwear"));
const CutAndSew = lazy(() => import("./pages/CutAndSew"));
const UniformsTeamwear = lazy(() => import("./pages/UniformsTeamwear"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Orders = lazy(() => import("./pages/Orders"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const OurStory = lazy(() => import("./pages/OurStory"));
const DesignStudio = lazy(() => import("./pages/DesignStudio"));
const QuoteGenerator = lazy(() => import("./pages/QuoteGenerator"));
const Brochure = lazy(() => import("./pages/Brochure"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminBlogEditor = lazy(() => import("./pages/AdminBlogEditor"));
const AdminAuditLogs = lazy(() => import("./pages/AdminAuditLogs"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const BecomeSupplier = lazy(() => import("./pages/BecomeSupplier"));
const SupplierDirectory = lazy(() => import("./pages/SupplierDirectory"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const JoinSupplier = lazy(() => import("./pages/JoinSupplier"));
const SupplierDashboard = lazy(() => import("./pages/SupplierDashboard"));
const SupplierOrderManagement = lazy(() => import("./pages/admin/SupplierOrderManagement"));
const SupplierOrderDetail = lazy(() => import("./pages/SupplierOrderDetail"));
const PaymentCheckout = lazy(() => import("./pages/PaymentCheckout"));
const AdminSupplierOrderDetail = lazy(() => import("./pages/admin/AdminSupplierOrderDetail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const AdminQuotes = lazy(() => import("./pages/admin/AdminQuotes"));
const Consultation = lazy(() => import("./pages/Consultation"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const SupplierVerification = lazy(() => import("./pages/admin/SupplierVerification"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OrderManagement = lazy(() => import("./pages/admin/OrderManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const BuyerOrderTracking = lazy(() => import("./pages/BuyerOrderTracking"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ShippingLogistics = lazy(() => import("./pages/ShippingLogistics"));
const MaterialsGuide = lazy(() => import("./pages/MaterialsGuide"));
const SamplePolicy = lazy(() => import("./pages/SamplePolicy"));
const LoopTraceTechnology = lazy(() => import("./pages/LoopTraceTechnology"));
const WhySleekApparels = lazy(() => import("./pages/WhySleekApparels"));
const FirstTimeOrdering = lazy(() => import("./pages/FirstTimeOrdering"));
const AdminBootstrap = lazy(() => import("./pages/AdminBootstrap"));
// AdminSetup page removed (security hardening)
import QuoteHistory from "./pages/QuoteHistory";
import QuoteDetails from "./pages/QuoteDetails";

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

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Root = () => {
  const location = useLocation();
  const isAdminSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('admin.');

  return (
    <AnalyticsProvider 
      gaId={GA4_MEASUREMENT_ID}
      gtmId={GTM_CONTAINER_ID}
    >
      <ScrollToTop />
      <ServiceWorkerStatus />
      {isAdminSubdomain && location.pathname !== '/admin' ? (
        <Navigate to="/admin" replace />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      )}
    </AnalyticsProvider>
  );
};
const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/health", element: <Health /> },
      { path: "/products", element: <ProductCatalog /> },
      { path: "/services", element: <Services /> },
      { path: "/knitwear", element: <Knitwear /> },
      { path: "/cut-and-sew", element: <CutAndSew /> },
      { path: "/uniforms-teamwear", element: <UniformsTeamwear /> },
      { path: "/portfolio", element: <Portfolio /> },
      { path: "/about", element: <About /> },
      { path: "/sustainability", element: <Sustainability /> },
      { path: "/contact", element: <Contact /> },
      { path: "/auth", element: <Auth /> },
      { path: "/admin-bootstrap", element: <AdminBootstrap /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/analytics", element: <Analytics /> },
      { path: "/admin/orders", element: <OrderManagement /> },
      { path: "/orders/:orderId/track", element: <BuyerOrderTracking /> },
      { path: "/orders/:orderId", element: <OrderDetails /> },
      { path: "/orders", element: <Orders /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/our-story", element: <OurStory /> },
      { path: "/design-studio", element: <DesignStudio /> },
      { path: "/quote-generator", element: <QuoteGenerator /> },
      { path: "/brochure", element: <Brochure /> },
      { path: "/admin/leads", element: <AdminLeads /> },
      { path: "/admin/blog", element: <AdminBlog /> },
      { path: "/admin/blog/new", element: <AdminBlogEditor /> },
      { path: "/admin/blog/edit/:id", element: <AdminBlogEditor /> },
      { path: "/admin/audit-logs", element: <AdminAuditLogs /> },
      { path: "/admin/products", element: <AdminProducts /> },
      { path: "/track-order/:orderId", element: <TrackOrder /> },
      { path: "/become-supplier", element: <BecomeSupplier /> },
      { path: "/suppliers", element: <SupplierDirectory /> },
      { path: "/order-confirmation", element: <OrderConfirmation /> },
      { path: "/join-supplier", element: <JoinSupplier /> },
      { path: "/supplier-dashboard", element: <SupplierDashboard /> },
      { path: "/supplier/orders/:orderId", element: <SupplierOrderDetail /> },
      { path: "/admin/supplier-orders", element: <SupplierOrderManagement /> },
      { path: "/admin/supplier-orders/:orderId", element: <AdminSupplierOrderDetail /> },
      { path: "/admin/quotes", element: <AdminQuotes /> },
      { path: "/admin/suppliers", element: <SupplierVerification /> },
      { path: "/payment/:orderId", element: <PaymentCheckout /> },
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/settings", element: <UserSettings /> },
      { path: "/profile/:userId?", element: <UserProfile /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/consultation", element: <Consultation /> },
      { path: "/success-stories", element: <SuccessStories /> },
      { path: "/how-it-works", element: <HowItWorks /> },
      { path: "/quote-history", element: <QuoteHistory /> },
      { path: "/quote-details/:quoteId", element: <QuoteDetails /> },
        { path: "/shipping-logistics", element: <ShippingLogistics /> },
        { path: "/materials-guide", element: <MaterialsGuide /> },
        { path: "/sample-policy", element: <SamplePolicy /> },
        { path: "/looptrace-technology", element: <LoopTraceTechnology /> },
        { path: "/why-sleek-apparels", element: <WhySleekApparels /> },
        { path: "/first-time-ordering", element: <FirstTimeOrdering /> },
        // Admin Setup page removed
      
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <Sonner />
      </Suspense>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
