import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import { RootLayout } from "@/components/layouts/RootLayout";
import { ProtectedRoute, RoleBasedRoute } from "@/components/routes";
import { SmartDashboardRouter } from "@/components/SmartDashboardRouter";

// Critical pages - load immediately
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Health from "@/pages/Health";
import QuoteHistory from "@/pages/QuoteHistory";
import QuoteDetails from "@/pages/QuoteDetails";

// Lazy load secondary pages
const ProductCatalog = lazy(() => import("@/pages/ProductCatalog"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Services = lazy(() => import("@/pages/Services"));
const Casualwear = lazy(() => import("@/pages/Casualwear"));
const Activewear = lazy(() => import("@/pages/Activewear"));
const Knitwear = lazy(() => import("@/pages/Knitwear"));
const CutAndSew = lazy(() => import("@/pages/CutAndSew"));
const UniformsTeamwear = lazy(() => import("@/pages/UniformsTeamwear"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const About = lazy(() => import("@/pages/About"));
const Sustainability = lazy(() => import("@/pages/Sustainability"));
const Auth = lazy(() => import("@/pages/Auth"));
const UserTypeSelection = lazy(() => import("@/pages/UserTypeSelection"));
const AIQuoteGenerator = lazy(() => import("@/components/AIQuoteGenerator").then(m => ({ default: m.AIQuoteGenerator })));

const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const Orders = lazy(() => import("@/pages/Orders"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const OurStory = lazy(() => import("@/pages/OurStory"));
const DesignStudio = lazy(() => import("@/pages/DesignStudio"));
const QuoteGenerator = lazy(() => import("@/pages/QuoteGenerator"));
const QuoteAnalytics = lazy(() => import("@/pages/QuoteAnalytics"));
const Brochure = lazy(() => import("@/pages/Brochure"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const AdminLeads = lazy(() => import("@/pages/AdminLeads"));
const AdminBlog = lazy(() => import("@/pages/AdminBlog"));
const AdminBlogEditor = lazy(() => import("@/pages/AdminBlogEditor"));
const AdminAuditLogs = lazy(() => import("@/pages/AdminAuditLogs"));
const SecurityMonitoring = lazy(() => import("@/pages/SecurityMonitoring"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const TrackOrder = lazy(() => import("@/pages/TrackOrder"));
const BecomeSupplier = lazy(() => import("@/pages/BecomeSupplier"));
const SupplierDirectory = lazy(() => import("@/pages/SupplierDirectory"));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation"));
const JoinSupplier = lazy(() => import("@/pages/JoinSupplier"));

const SupplierOrderManagement = lazy(() => import("@/pages/admin/SupplierOrderManagement"));
const SupplierOrderDetail = lazy(() => import("@/pages/SupplierOrderDetail"));
const PaymentCheckout = lazy(() => import("@/pages/PaymentCheckout"));
const AdminSupplierOrderDetail = lazy(() => import("@/pages/admin/AdminSupplierOrderDetail"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const AdminQuotes = lazy(() => import("@/pages/admin/AdminQuotes"));
const Consultation = lazy(() => import("@/pages/Consultation"));
const SuccessStories = lazy(() => import("@/pages/SuccessStories"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const SupplierVerification = lazy(() => import("@/pages/admin/SupplierVerification"));
const GetStarted = lazy(() => import("@/pages/GetStarted"));
const InstantQuote = lazy(() => import("@/pages/InstantQuote"));
const ModernBuyerDashboard = lazy(() => import("@/pages/ModernBuyerDashboard"));
const ModernSupplierDashboard = lazy(() => import("@/pages/ModernSupplierDashboard"));
const ModernAdminDashboard = lazy(() => import("@/pages/ModernAdminDashboard"));
const OrderManagement = lazy(() => import("@/pages/admin/OrderManagement"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const ProductUpload = lazy(() => import("@/pages/supplier/ProductUpload"));
const ProductApproval = lazy(() => import("@/pages/admin/ProductApproval"));
const ProductReview = lazy(() => import("@/pages/admin/ProductReview"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const BuyerOrderTracking = lazy(() => import("@/pages/BuyerOrderTracking"));
const UserSettings = lazy(() => import("@/pages/UserSettings"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const ShippingLogistics = lazy(() => import("@/pages/ShippingLogistics"));
const MaterialsGuide = lazy(() => import("@/pages/MaterialsGuide"));
const SamplePolicy = lazy(() => import("@/pages/SamplePolicy"));
const LoopTraceTechnology = lazy(() => import("@/pages/LoopTraceTechnology"));
const LoopTraceForBuyers = lazy(() => import("@/pages/LoopTraceForBuyers"));
const LoopTraceForSuppliers = lazy(() => import("@/pages/LoopTraceForSuppliers"));
const WhySleekApparels = lazy(() => import("@/pages/WhySleekApparels"));
const FirstTimeOrdering = lazy(() => import("@/pages/FirstTimeOrdering"));
const TShirtsManufacturer = lazy(() => import("@/pages/TShirtsManufacturer"));
const HoodiesManufacturer = lazy(() => import("@/pages/HoodiesManufacturer"));
const JoggersManufacturer = lazy(() => import("@/pages/JoggersManufacturer"));
const ActivewearManufacturer = lazy(() => import("@/pages/ActivewearManufacturer"));
const UniformsManufacturer = lazy(() => import("@/pages/UniformsManufacturer"));
const PrivateLabelClothing = lazy(() => import("@/pages/PrivateLabelClothing"));
const USABuyers = lazy(() => import("@/pages/USABuyers"));
const EuropeanBrands = lazy(() => import("@/pages/EuropeanBrands"));
const Capabilities = lazy(() => import("@/pages/Capabilities"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const ProductionTracking = lazy(() => import("@/pages/ProductionTracking"));
const Samples = lazy(() => import("@/pages/Samples"));
const TechPackServices = lazy(() => import("@/pages/TechPackServices"));
const ForStartups = lazy(() => import("@/pages/ForStartups"));
const InnovationShowcase = lazy(() => import("@/pages/InnovationShowcase"));
const AdvancedFeatures = lazy(() => import("@/pages/AdvancedFeatures"));
const AIVisualShowcase = lazy(() => import("@/pages/AIVisualShowcase"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));

// SEO Landing Pages
const LowMOQManufacturer = lazy(() => import("@/pages/seo/LowMOQManufacturer"));
const PrivateLabelManufacturer = lazy(() => import("@/pages/seo/PrivateLabelManufacturer"));
const CustomTShirtManufacturer = lazy(() => import("@/pages/seo/CustomTShirtManufacturer"));
const StartupClothingManufacturer = lazy(() => import("@/pages/seo/StartupClothingManufacturer"));
const BangladeshUSAExport = lazy(() => import("@/pages/seo/BangladeshUSAExport"));
const AmazonFBASupplier = lazy(() => import("@/pages/seo/AmazonFBASupplier"));

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <Index /> },
            { path: "/health", element: <Health /> },
            { path: "/products", element: <ProductCatalog /> },
            { path: "/products/:id", element: <ProductDetail /> },
            { path: "/services", element: <Services /> },
            { path: "/casualwear", element: <Casualwear /> },
            { path: "/activewear", element: <Activewear /> },
            { path: "/knitwear", element: <Knitwear /> },
            { path: "/cut-and-sew", element: <CutAndSew /> },
            { path: "/uniforms-teamwear", element: <UniformsTeamwear /> },
            { path: "/portfolio", element: <Portfolio /> },
            { path: "/about", element: <About /> },
            { path: "/sustainability", element: <Sustainability /> },
            { path: "/contact", element: <Contact /> },
            { path: "/auth", element: <Auth /> },
            { path: "/signup", element: <UserTypeSelection /> },
            { path: "/unauthorized", element: <Unauthorized /> },
            { path: "/get-started", element: <GetStarted /> },
            { path: "/instant-quote", element: <InstantQuote /> },
            { path: "/ai-quote-generator", element: <AIQuoteGenerator /> },
            { path: "/ai-visual-showcase", element: <AIVisualShowcase /> },

            // Route aliases for SEO/legacy URLs (prevent 404s)
            { path: "/sign-in", element: <Navigate to="/auth" replace /> },
            { path: "/looptrace", element: <Navigate to="/looptrace-technology" replace /> },
            { path: "/uniforms", element: <Navigate to="/uniforms-teamwear" replace /> },

            { path: "/dashboard-router", element: <ProtectedRoute><SmartDashboardRouter /></ProtectedRoute> },

            // Buyer Dashboard Routes (Protected - Buyer Role)
            { path: "/dashboard", element: <RoleBasedRoute allowedUserTypes={['buyer']}><ModernBuyerDashboard /></RoleBasedRoute> },
            { path: "/buyer-dashboard-modern", element: <RoleBasedRoute allowedUserTypes={['buyer']}><ModernBuyerDashboard /></RoleBasedRoute> },
            { path: "/orders/:orderId/track", element: <RoleBasedRoute allowedUserTypes={['buyer']}><BuyerOrderTracking /></RoleBasedRoute> },
            { path: "/orders/:orderId", element: <RoleBasedRoute allowedUserTypes={['buyer']}><OrderDetails /></RoleBasedRoute> },
            { path: "/orders", element: <RoleBasedRoute allowedUserTypes={['buyer']}><Orders /></RoleBasedRoute> },

            // Supplier Dashboard Routes (Protected - Supplier Role)
            { path: "/supplier-dashboard-modern", element: <RoleBasedRoute allowedUserTypes={['supplier']}><ModernSupplierDashboard /></RoleBasedRoute> },
            { path: "/supplier-dashboard", element: <RoleBasedRoute allowedUserTypes={['supplier']}><ModernSupplierDashboard /></RoleBasedRoute> },
            { path: "/supplier/products", element: <RoleBasedRoute allowedUserTypes={['supplier']}><ProductUpload /></RoleBasedRoute> },
            { path: "/supplier/orders/:orderId", element: <RoleBasedRoute allowedUserTypes={['supplier']}><SupplierOrderDetail /></RoleBasedRoute> },

            // Admin Dashboard Routes (Protected - Admin Role)
            { path: "/admin", element: <RoleBasedRoute allowedRoles={['admin']}><ModernAdminDashboard /></RoleBasedRoute> },
            { path: "/admin/analytics", element: <RoleBasedRoute allowedRoles={['admin']}><Analytics /></RoleBasedRoute> },
            { path: "/admin/security", element: <RoleBasedRoute allowedRoles={['admin']}><SecurityMonitoring /></RoleBasedRoute> },
            { path: "/admin/orders", element: <RoleBasedRoute allowedRoles={['admin']}><OrderManagement /></RoleBasedRoute> },
            { path: "/admin/products/approval", element: <RoleBasedRoute allowedRoles={['admin']}><ProductApproval /></RoleBasedRoute> },
            { path: "/admin/products/:productId/review", element: <RoleBasedRoute allowedRoles={['admin']}><ProductReview /></RoleBasedRoute> },
            { path: "/admin/leads", element: <RoleBasedRoute allowedRoles={['admin']}><AdminLeads /></RoleBasedRoute> },
            { path: "/admin/blog", element: <RoleBasedRoute allowedRoles={['admin']}><AdminBlog /></RoleBasedRoute> },
            { path: "/admin/blog/new", element: <RoleBasedRoute allowedRoles={['admin']}><AdminBlogEditor /></RoleBasedRoute> },
            { path: "/admin/blog/edit/:id", element: <RoleBasedRoute allowedRoles={['admin']}><AdminBlogEditor /></RoleBasedRoute> },
            { path: "/admin/audit-logs", element: <RoleBasedRoute allowedRoles={['admin']}><AdminAuditLogs /></RoleBasedRoute> },
            { path: "/admin/products", element: <RoleBasedRoute allowedRoles={['admin']}><AdminProducts /></RoleBasedRoute> },
            { path: "/admin/supplier-orders", element: <RoleBasedRoute allowedRoles={['admin']}><SupplierOrderManagement /></RoleBasedRoute> },
            { path: "/admin/supplier-orders/:orderId", element: <RoleBasedRoute allowedRoles={['admin']}><AdminSupplierOrderDetail /></RoleBasedRoute> },
            { path: "/admin/quotes", element: <RoleBasedRoute allowedRoles={['admin']}><AdminQuotes /></RoleBasedRoute> },
            { path: "/admin/suppliers", element: <RoleBasedRoute allowedRoles={['admin']}><SupplierVerification /></RoleBasedRoute> },
            { path: "/blog", element: <Blog /> },
            { path: "/blog/:slug", element: <BlogPost /> },
            { path: "/faq", element: <FAQPage /> },
            { path: "/our-story", element: <OurStory /> },
            { path: "/design-studio", element: <DesignStudio /> },
            { path: "/quote-generator", element: <QuoteGenerator /> },
            { path: "/quote-analytics", element: <QuoteAnalytics /> },
            { path: "/brochure", element: <Brochure /> },

            // General Authenticated Routes (any logged-in user)
            { path: "/settings", element: <ProtectedRoute><UserSettings /></ProtectedRoute> },
            { path: "/profile/:userId?", element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
            { path: "/notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
            { path: "/quote-history", element: <ProtectedRoute><QuoteHistory /></ProtectedRoute> },
            { path: "/quote-details/:quoteId", element: <ProtectedRoute><QuoteDetails /></ProtectedRoute> },
            { path: "/order-confirmation", element: <ProtectedRoute><OrderConfirmation /></ProtectedRoute> },
            { path: "/payment/:orderId", element: <ProtectedRoute><PaymentCheckout /></ProtectedRoute> },
            { path: "/payment/success", element: <ProtectedRoute><PaymentSuccess /></ProtectedRoute> },

            // Public Routes
            { path: "/track-order/:orderId", element: <TrackOrder /> },
            { path: "/become-supplier", element: <BecomeSupplier /> },
            { path: "/suppliers", element: <SupplierDirectory /> },
            { path: "/marketplace", element: <Marketplace /> },
            { path: "/join-supplier", element: <JoinSupplier /> },
            { path: "/consultation", element: <Consultation /> },
            { path: "/success-stories", element: <SuccessStories /> },
            { path: "/how-it-works", element: <HowItWorks /> },
            { path: "/shipping-logistics", element: <ShippingLogistics /> },
            { path: "/materials-guide", element: <MaterialsGuide /> },
            { path: "/sample-policy", element: <SamplePolicy /> },
            { path: "/samples", element: <Samples /> },
            { path: "/tech-pack-services", element: <TechPackServices /> },
            { path: "/for-startups", element: <ForStartups /> },
            { path: "/looptrace-technology", element: <LoopTraceTechnology /> },
            { path: "/looptrace-for-buyers", element: <LoopTraceForBuyers /> },
            { path: "/looptrace-for-suppliers", element: <LoopTraceForSuppliers /> },
            { path: "/production-tracking", element: <ProductionTracking /> },
            { path: "/why-sleek-apparels", element: <WhySleekApparels /> },
            { path: "/first-time-ordering", element: <FirstTimeOrdering /> },
            { path: "/capabilities", element: <Capabilities /> },
            { path: "/privacy", element: <Privacy /> },
            { path: "/terms", element: <Terms /> },
            { path: "/innovation-showcase", element: <InnovationShowcase /> },
            { path: "/advanced-features", element: <AdvancedFeatures /> },

            // SEO Landing Pages (High-Priority Keywords)
            { path: "/low-moq-clothing-manufacturer-bangladesh", element: <LowMOQManufacturer /> },
            { path: "/private-label-clothing-manufacturer", element: <PrivateLabelManufacturer /> },
            { path: "/custom-tshirt-manufacturer-bangladesh", element: <CustomTShirtManufacturer /> },
            { path: "/clothing-manufacturer-for-startups-low-moq", element: <StartupClothingManufacturer /> },
            { path: "/bangladesh-clothing-manufacturer-usa-export", element: <BangladeshUSAExport /> },
            { path: "/amazon-fba-apparel-supplier-bangladesh", element: <AmazonFBASupplier /> },

            // Product-Specific Pages
            { path: "/t-shirts-manufacturer", element: <TShirtsManufacturer /> },
            { path: "/hoodies-manufacturer", element: <HoodiesManufacturer /> },
            { path: "/joggers-manufacturer", element: <JoggersManufacturer /> },
            { path: "/activewear-manufacturer", element: <ActivewearManufacturer /> },
            { path: "/uniforms-manufacturer", element: <UniformsManufacturer /> },
            { path: "/private-label-clothing", element: <PrivateLabelClothing /> },

            // Target Market Pages
            { path: "/usa-buyers", element: <USABuyers /> },
            { path: "/european-brands", element: <EuropeanBrands /> },

            { path: "*", element: <NotFound /> },
        ],
    },
]);
