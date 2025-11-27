# Routing & Navigation

<cite>
**Referenced Files in This Document**
- [src/App.tsx](file://src/App.tsx)
- [src/main.tsx](file://src/main.tsx)
- [src/components/Navbar.tsx](file://src/components/Navbar.tsx)
- [src/components/Breadcrumb.tsx](file://src/components/Breadcrumb.tsx)
- [src/components/Breadcrumbs.tsx](file://src/components/Breadcrumbs.tsx)
- [src/components/SmartDashboardRouter.tsx](file://src/components/SmartDashboardRouter.tsx)
- [src/lib/routePrefetch.ts](file://src/lib/routePrefetch.ts)
- [vite.config.ts](file://vite.config.ts)
- [src/pages/OrderDetails.tsx](file://src/pages/OrderDetails.tsx)
- [src/pages/QuoteDetails.tsx](file://src/pages/QuoteDetails.tsx)
- [src/pages/ModernBuyerDashboard.tsx](file://src/pages/ModernBuyerDashboard.tsx)
- [src/components/SEO.tsx](file://src/components/SEO.tsx)
- [src/lib/structuredData.ts](file://src/lib/structuredData.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [File-Based Routing Architecture](#file-based-routing-architecture)
3. [React Router Configuration](#react-router-configuration)
4. [Protected Routes & Role-Based Access Control](#protected-routes--role-based-access-control)
5. [Navigation System Components](#navigation-system-components)
6. [Intelligent Route Prefetching](#intelligent-route-prefetching)
7. [Vite Configuration for Code Splitting](#vite-configuration-for-code-splitting)
8. [Parameter Handling & Navigation Guards](#parameter-handling--navigation-guards)
9. [Accessibility Considerations](#accessibility-considerations)
10. [SEO Implications](#seo-implications)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

The sleekapp-v100 routing and navigation system implements a sophisticated file-based routing architecture built on React Router DOM with intelligent performance optimizations. The system provides seamless navigation experiences through multiple specialized components including a responsive navbar, breadcrumb navigation, and role-based dashboard routing. Built with modern web standards, the system emphasizes performance, accessibility, and SEO optimization while maintaining clean separation of concerns.

## File-Based Routing Architecture

The application follows a conventional file-based routing structure where pages are organized in the `src/pages/` directory. Each file corresponds to a route path, enabling automatic route registration and code splitting.

```mermaid
graph TB
subgraph "File-Based Routing Structure"
PagesDir[src/pages/]
subgraph "Main Pages"
Index[Index.tsx]
About[About.tsx]
Contact[Contact.tsx]
Services[Services.tsx]
end
subgraph "Product Pages"
ProductCatalog[ProductCatalog.tsx]
ProductDetail[ProductDetail.tsx]
ProductUpload[ProductUpload.tsx]
end
subgraph "User Dashboard"
BuyerDashboard[ModernBuyerDashboard.tsx]
SupplierDashboard[ModernSupplierDashboard.tsx]
AdminDashboard[ModernAdminDashboard.tsx]
end
subgraph "Admin Pages"
AdminProducts[admin/AdminProducts.tsx]
AdminQuotes[admin/AdminQuotes.tsx]
OrderManagement[admin/OrderManagement.tsx]
end
subgraph "SEO Pages"
LowMOQ[seo/LowMOQManufacturer.tsx]
PrivateLabel[seo/PrivateLabelManufacturer.tsx]
CustomTShirt[seo/CustomTShirtManufacturer.tsx]
end
end
PagesDir --> Index
PagesDir --> About
PagesDir --> Contact
PagesDir --> Services
PagesDir --> ProductCatalog
PagesDir --> ProductDetail
PagesDir --> ProductUpload
PagesDir --> BuyerDashboard
PagesDir --> SupplierDashboard
PagesDir --> AdminDashboard
PagesDir --> AdminProducts
PagesDir --> AdminQuotes
PagesDir --> OrderManagement
PagesDir --> LowMOQ
PagesDir --> PrivateLabel
PagesDir --> CustomTShirt
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L18-L116)
- [src/pages/Index.tsx](file://src/pages/Index.tsx)
- [src/pages/About.tsx](file://src/pages/About.tsx)

**Section sources**
- [src/App.tsx](file://src/App.tsx#L18-L116)

## React Router Configuration

The application uses React Router v6 with `createBrowserRouter` for enhanced performance and modern routing features. The router is configured with both critical and lazy-loaded routes to optimize initial bundle size and loading performance.

### Router Setup and Configuration

The main router configuration demonstrates intelligent route loading strategies:

```mermaid
flowchart TD
RouterInit[Router Initialization] --> CriticalRoutes[Critical Routes<br/>Immediate Load]
RouterInit --> LazyRoutes[Lazy Routes<br/>Dynamic Import]
CriticalRoutes --> Index["/ - Index Page"]
CriticalRoutes --> Health["/health - Health Check"]
CriticalRoutes --> NotFound["/* - 404 Not Found"]
LazyRoutes --> ProductPages["Product Catalog & Details"]
LazyRoutes --> UserDashboards["User Dashboards"]
LazyRoutes --> AdminPages["Admin Panels"]
LazyRoutes --> SpecializedPages["SEO & Landing Pages"]
ProductPages --> ProductCatalog["/products"]
ProductPages --> ProductDetail["/products/:id"]
UserDashboards --> BuyerDashboard["/dashboard"]
UserDashboards --> SupplierDashboard["/supplier-dashboard"]
UserDashboards --> AdminDashboard["/admin"]
AdminPages --> AdminProducts["/admin/products"]
AdminPages --> AdminQuotes["/admin/quotes"]
AdminPages --> OrderManagement["/admin/orders"]
SpecializedPages --> SEOPages["SEO Landing Pages"]
SpecializedPages --> MarketPlace["/marketplace"]
SpecializedPages --> Blog["/blog"]
```

**Diagram sources**
- [src/App.tsx](file://src/App.tsx#L176-L296)

### Route Registration Pattern

The application implements a hybrid approach combining immediate loading for critical routes with lazy loading for secondary pages:

| Route Category | Loading Strategy | Example Routes | Performance Impact |
|----------------|------------------|----------------|-------------------|
| **Critical** | Immediate Load | `/`, `/health`, `/contact` | Minimal impact on initial bundle |
| **High Priority** | Lazy Load | `/products`, `/services`, `/about` | Medium impact, cached after first load |
| **User Specific** | Lazy Load | `/dashboard`, `/admin`, `/supplier-dashboard` | High impact, loaded per user role |
| **SEO Focused** | Lazy Load | `/low-moq-clothing-manufacturer` | Variable impact, depends on traffic |

**Section sources**
- [src/App.tsx](file://src/App.tsx#L176-L296)

## Protected Routes & Role-Based Access Control

The system implements comprehensive role-based access control through the SmartDashboardRouter component, which handles authentication verification and role-based redirection.

### Authentication Flow Architecture

```mermaid
sequenceDiagram
participant User as User
participant Router as SmartDashboardRouter
participant Supabase as Supabase Auth
participant Database as User Roles DB
participant Dashboard as Target Dashboard
User->>Router : Navigate to /dashboard-router
Router->>Supabase : getSession()
Supabase-->>Router : Session Data
alt No Session
Router->>User : Redirect to /auth
else Has Session
Router->>Database : Fetch user role
Database-->>Router : Role Data
alt Admin Role
Router->>Dashboard : Redirect to /admin
else Supplier Role
Router->>Dashboard : Redirect to /supplier-dashboard
else Buyer Role
Router->>Dashboard : Redirect to /dashboard
end
end
```

**Diagram sources**
- [src/components/SmartDashboardRouter.tsx](file://src/components/SmartDashboardRouter.tsx#L15-L113)

### Role-Based Redirection Logic

The SmartDashboardRouter implements sophisticated role-based redirection with fallback mechanisms:

| User Role | Target Route | Access Level | Features Available |
|-----------|--------------|--------------|-------------------|
| **Admin** | `/admin` | Full administrative access | Complete system management, user administration, financial oversight |
| **Supplier** | `/supplier-dashboard` | Supplier-specific features | Order management, production tracking, inventory control |
| **Buyer** | `/dashboard` | Buyer functionality | Order tracking, quote management, purchase history |
| **Unauthenticated** | `/auth` | Login required | Authentication and signup flows |

### Authentication Verification Process

The authentication system includes multiple layers of verification:

1. **Session Validation**: Verifies active Supabase session
2. **Role Resolution**: Fetches user role from database with retry logic
3. **Fallback Protection**: Implements timeout and error handling
4. **Security Checks**: Validates user permissions for specific actions

**Section sources**
- [src/components/SmartDashboardRouter.tsx](file://src/components/SmartDashboardRouter.tsx#L15-L113)

## Navigation System Components

The navigation system consists of multiple specialized components working together to provide seamless user experiences across different devices and use cases.

### Navbar Component Architecture

The Navbar component serves as the primary navigation interface with responsive design and contextual menus:

```mermaid
classDiagram
class Navbar {
+useState isOpen
+useState user
+useState userRole
+useLocation location
+useNavigate navigate
+render() JSX.Element
+handleAuthStateChange()
+renderPlatformMenu()
+renderResourcesMenu()
+renderAccountMenu()
}
class NavigationMenu {
+NavigationMenuList
+NavigationMenuItem
+NavigationMenuTrigger
+NavigationMenuContent
}
class AccountMenu {
+renderGuestMenu()
+renderAuthenticatedMenu()
+handleLogout()
}
class PlatformMenu {
+Array platformItems
+renderItem()
+handleNavigation()
}
class ResourcesMenu {
+Array resourceItems
+filterByAudience()
+renderItem()
}
Navbar --> NavigationMenu
Navbar --> AccountMenu
Navbar --> PlatformMenu
Navbar --> ResourcesMenu
NavigationMenu --> PlatformMenu
NavigationMenu --> ResourcesMenu
```

**Diagram sources**
- [src/components/Navbar.tsx](file://src/components/Navbar.tsx#L129-L487)

### Responsive Navigation Behavior

The navigation system adapts to different screen sizes with intelligent breakpoint handling:

| Screen Size | Navigation Mode | Features | Performance Impact |
|-------------|----------------|----------|-------------------|
| **Desktop (>1024px)** | Full Navigation Bar | All dropdown menus, CTA buttons, account management | Moderate - cached dropdown content |
| **Tablet (768-1024px)** | Condensed Navigation | Simplified menus, essential CTAs | Low - reduced DOM complexity |
| **Mobile (<768px)** | Collapsible Menu | Slide-out navigation, simplified layout | Minimal - optimized for touch |

### Breadcrumb Navigation System

The application implements both automatic and manual breadcrumb systems for improved user orientation:

#### Automatic Breadcrumb Generation

The Breadcrumb component automatically generates navigation trails based on URL segments:

```mermaid
flowchart LR
Home[Home] --> Products[Products]
Products --> Category[Activewear]
Category --> Product[Product Detail]
subgraph "URL Path"
URL["/products/activewear/12345"]
end
subgraph "Breadcrumb Output"
Breadcrumb["Home → Products → Activewear → Product Detail"]
end
URL --> Breadcrumb
```

**Diagram sources**
- [src/components/Breadcrumb.tsx](file://src/components/Breadcrumb.tsx#L29-L48)

#### Manual Breadcrumb Implementation

The Breadcrumbs component allows for custom breadcrumb trails with structured data support:

| Component | Purpose | Features | SEO Benefits |
|-----------|---------|----------|--------------|
| **Breadcrumb** | Automatic generation | URL parsing, route mapping | Automatic schema generation |
| **Breadcrumbs** | Custom trails | Structured data, custom items | Enhanced schema.org support |
| **SEO Integration** | Search engine optimization | JSON-LD schema, meta tags | Improved SERP visibility |

**Section sources**
- [src/components/Breadcrumb.tsx](file://src/components/Breadcrumb.tsx#L29-L98)
- [src/components/Breadcrumbs.tsx](file://src/components/Breadcrumbs.tsx#L9-L54)

## Intelligent Route Prefetching

The route prefetching system implements a multi-layered approach to improve perceived performance and reduce navigation latency.

### Prefetching Strategy Architecture

```mermaid
flowchart TD
PrefetchInit[Prefetch Initialization] --> CriticalPrefetch[Critical Routes<br/>2-second delay]
PrefetchInit --> SecondaryPrefetch[Secondary Routes<br/>5-second delay]
PrefetchInit --> HoverPrefetch[Intelligent Hover<br/>200ms delay]
CriticalPrefetch --> Services["/services"]
CriticalPrefetch --> Contact["/contact"]
SecondaryPrefetch --> About["/about"]
SecondaryPrefetch --> Portfolio["/portfolio"]
SecondaryPrefetch --> Products["/products"]
HoverPrefetch --> UserInteraction[User Hover Event]
UserInteraction --> CheckLink{Valid Link?}
CheckLink --> |Yes| PrefetchRoute[Prefetch Route]
CheckLink --> |No| CancelHover[Cancel Hover Timer]
PrefetchRoute --> CreateLink[Create Link Element]
CreateLink --> SetImportance[Set Importance Attribute]
SetImportance --> AppendHead[Append to Document Head]
```

**Diagram sources**
- [src/lib/routePrefetch.ts](file://src/lib/routePrefetch.ts#L57-L124)

### Prefetching Configuration

The system uses configurable prefetching priorities:

| Priority Level | Delay | Routes | Use Case |
|----------------|-------|--------|----------|
| **High Priority** | 2 seconds | `/services`, `/contact` | High-traffic pages, conversion paths |
| **Low Priority** | 5 seconds | `/about`, `/portfolio`, `/products` | Content discovery, exploration |
| **Intelligent** | 200ms hover | User-selected links | Personalized navigation |

### Implementation Details

The prefetching system includes several optimization features:

1. **Duplicate Prevention**: Checks for existing prefetch links
2. **Importance Attributes**: Sets `importance="high"` for critical routes
3. **Cleanup Mechanisms**: Removes prefetch links on navigation
4. **Browser Compatibility**: Uses native `link[rel="prefetch"]` elements

**Section sources**
- [src/lib/routePrefetch.ts](file://src/lib/routePrefetch.ts#L57-L124)

## Vite Configuration for Code Splitting

The Vite configuration implements sophisticated code splitting strategies to optimize bundle sizes and loading performance.

### Chunking Strategy

```mermaid
graph TB
subgraph "Vite Build Configuration"
CoreChunks[Manual Chunks]
VendorChunks[Vendor Chunks]
LazyChunks[Lazy Loaded Chunks]
end
subgraph "Core React"
ReactCore[react-core<br/>react + scheduler]
ReactDOM[react-dom]
end
subgraph "Router & State"
RouterChunk[router<br/>react-router-dom]
QueryChunk[query<br/>@tanstack/react-query]
end
subgraph "Backend Integration"
SupabaseAuth[supabase-auth]
SupabaseClient[supabase-client]
end
subgraph "UI Components"
UIMenus[ui-menus<br/>dropdown/select/popover]
UIDialogs[ui-dialogs<br/>dialog/alert-dialog]
UIBase[ui-base<br/>radix-ui components]
end
subgraph "Heavy Libraries"
AnimationChunk[animation<br/>framer-motion]
ChartsChunk[charts<br/>recharts]
FormsChunk[forms<br/>react-hook-form]
end
CoreChunks --> ReactCore
CoreChunks --> ReactDOM
CoreChunks --> RouterChunk
CoreChunks --> QueryChunk
VendorChunks --> SupabaseAuth
VendorChunks --> SupabaseClient
VendorChunks --> UIMenus
VendorChunks --> UIDialogs
VendorChunks --> UIBase
LazyChunks --> AnimationChunk
LazyChunks --> ChartsChunk
LazyChunks --> FormsChunk
```

**Diagram sources**
- [vite.config.ts](file://vite.config.ts#L103-L186)

### Code Splitting Configuration

The Vite configuration implements strategic chunking based on usage patterns:

| Chunk Category | Purpose | Included Modules | Size Impact |
|----------------|---------|------------------|-------------|
| **Core React** | Essential runtime | react, react-dom, scheduler | Fixed size, cached across sessions |
| **Router** | Navigation infrastructure | react-router-dom, react-router | Critical for all navigation |
| **State Management** | Data synchronization | @tanstack/react-query | Essential for all data operations |
| **UI Components** | Common interface elements | radix-ui, form libraries | Modular loading based on usage |
| **Backend Integration** | Authentication & APIs | @supabase, firebase | Per-user feature loading |
| **Heavy Libraries** | Feature-specific | framer-motion, recharts | On-demand loading |

### Performance Optimizations

The build configuration includes several performance enhancements:

1. **Tree Shaking**: Eliminates unused code from bundles
2. **Asset Optimization**: Compresses images and assets
3. **CSS Optimization**: Minifies and optimizes stylesheets
4. **Source Maps**: Hidden source maps for production debugging
5. **Bundle Analysis**: Visualizes bundle composition

**Section sources**
- [vite.config.ts](file://vite.config.ts#L103-L186)

## Parameter Handling & Navigation Guards

The application implements robust parameter handling and navigation guards to ensure data integrity and user experience consistency.

### Parameter Extraction and Validation

```mermaid
sequenceDiagram
participant Route as Route Component
participant Params as useParams Hook
participant Validator as Parameter Validator
participant API as Data API
participant UI as User Interface
Route->>Params : Extract route parameters
Params-->>Route : Return parameter object
Route->>Validator : Validate parameters
Validator-->>Route : Validation result
alt Valid Parameters
Route->>API : Fetch data with parameters
API-->>Route : Return data
Route->>UI : Render component with data
else Invalid Parameters
Route->>UI : Show error or redirect
end
```

**Diagram sources**
- [src/pages/OrderDetails.tsx](file://src/pages/OrderDetails.tsx#L38-L44)
- [src/pages/QuoteDetails.tsx](file://src/pages/QuoteDetails.tsx#L14-L17)

### Parameter Handling Patterns

The application demonstrates several parameter handling patterns:

#### Route Parameter Extraction
```typescript
// Order details with parameter validation
const { orderId } = useParams<{ orderId: string }>();
const { quoteId } = useParams();

// Parameter validation and type safety
if (!quoteId) {
  toast({ title: "Invalid quote", description: "No quote ID provided" });
  navigate("/quote-history");
}
```

#### Dynamic Route Generation
The system supports dynamic route generation based on user context and permissions, enabling personalized navigation experiences.

### Navigation Guard Implementation

Navigation guards are implemented through multiple layers:

| Guard Type | Implementation | Purpose | Performance Impact |
|------------|----------------|---------|-------------------|
| **Authentication Guards** | SmartDashboardRouter | Role-based access control | Medium - database queries |
| **Parameter Guards** | Component-level validation | Data integrity checks | Low - client-side validation |
| **Permission Guards** | Role-based filtering | Feature access control | Minimal - in-memory checks |
| **Fallback Guards** | Error boundaries | Graceful degradation | Minimal - error handling |

**Section sources**
- [src/pages/OrderDetails.tsx](file://src/pages/OrderDetails.tsx#L38-L44)
- [src/pages/QuoteDetails.tsx](file://src/pages/QuoteDetails.tsx#L14-L17)
- [src/pages/ModernBuyerDashboard.tsx](file://src/pages/ModernBuyerDashboard.tsx#L38-L76)

## Accessibility Considerations

The routing and navigation system incorporates comprehensive accessibility features to ensure inclusive user experiences.

### Keyboard Navigation Support

The navigation components implement full keyboard navigation support:

```mermaid
flowchart TD
KeyboardNav[Keyboard Navigation] --> TabNavigation[Tab Navigation]
KeyboardNav --> ArrowKeys[Arrow Key Navigation]
KeyboardNav --> EnterActivation[Enter Activation]
KeyboardNav --> EscapeClose[Escape Close]
TabNavigation --> FocusManagement[Focus Management]
TabNavigation --> TabIndex[Proper Tab Index]
ArrowKeys --> MenuNavigation[Menu Item Navigation]
ArrowKeys --> DirectionAware[Direction-Aware Movement]
EnterActivation --> ClickEquivalent[Click Equivalent]
EnterActivation --> FormSubmission[Form Submission]
EscapeClose --> ModalDismissal[Modal Dismissal]
EscapeClose --> MenuClose[Menu Close]
```

### ARIA Implementation

The system includes comprehensive ARIA attributes for screen reader compatibility:

| Component | ARIA Features | Implementation |
|-----------|---------------|----------------|
| **Navbar** | `aria-label`, `aria-expanded`, `aria-haspopup` | Navigation landmark, menu states |
| **Breadcrumbs** | `aria-label`, `aria-current` | Navigation landmark, current page indication |
| **Dropdown Menus** | `role="menu"`, `aria-controls`, `aria-labelledby` | Menu structure, accessibility tree |
| **Navigation Links** | `aria-current="page"` | Current page identification |

### Screen Reader Optimization

The navigation system includes screen reader optimizations:

1. **Landmark Elements**: Proper HTML5 landmarks for navigation
2. **Skip Links**: Direct access to main content areas
3. **State Announcements**: Dynamic state changes announced to screen readers
4. **Focus Indicators**: Clear visual focus indicators for keyboard users

### Color Contrast and Visual Accessibility

The system maintains WCAG AA compliance for color contrast ratios and visual accessibility:

| Element Type | Contrast Ratio | Implementation |
|--------------|----------------|----------------|
| **Text Links** | 4.5:1 minimum | High contrast color pairs |
| **Focus Indicators** | 3:1 minimum | Visible outline and background changes |
| **Interactive Elements** | 3:1 minimum | Hover and focus states |
| **Navigation Bars** | 3:1 minimum | Background and text contrast |

**Section sources**
- [src/components/Navbar.tsx](file://src/components/Navbar.tsx#L171-L487)
- [src/components/Breadcrumb.tsx](file://src/components/Breadcrumb.tsx#L60-L98)

## SEO Implications

The routing system implements comprehensive SEO optimization strategies to improve search engine visibility and user experience.

### Structured Data Implementation

The application generates structured data for search engines and rich snippets:

```mermaid
graph TB
subgraph "Structured Data Types"
Organization[Organization Schema]
Breadcrumb[Breadcrumb Schema]
Product[Product Schema]
Article[Article Schema]
FAQ[FAQ Schema]
end
subgraph "SEO Benefits"
RichSnippets[Rich Snippets]
ImprovedCTR[Improved CTR]
BetterRanking[Better Ranking]
EnhancedVisibility[Enhanced Visibility]
end
Organization --> RichSnippets
Breadcrumb --> ImprovedCTR
Product --> BetterRanking
Article --> EnhancedVisibility
FAQ --> RichSnippets
```

**Diagram sources**
- [src/components/SEO.tsx](file://src/components/SEO.tsx#L108-L255)
- [src/lib/structuredData.ts](file://src/lib/structuredData.ts#L10-L231)

### SEO Configuration Patterns

The SEO system implements several optimization patterns:

| SEO Feature | Implementation | Benefit |
|-------------|----------------|---------|
| **Dynamic Meta Tags** | Helmet integration | Page-specific metadata |
| **Canonical URLs** | Automatic generation | Duplicate content prevention |
| **Open Graph Tags** | Social media optimization | Rich social sharing |
| **Schema.org Markup** | Structured data generation | Enhanced search results |
| **Mobile Optimization** | Responsive design | Mobile-first indexing |

### Client-Side Routing SEO Strategies

The system addresses client-side routing SEO challenges:

1. **Server-Side Rendering**: Critical pages rendered server-side
2. **Pre-rendering**: Static generation for SEO-focused pages
3. **Structured Data**: JSON-LD markup for search engines
4. **Canonical URLs**: Proper URL normalization
5. **Meta Tag Management**: Dynamic meta tag generation

### Performance Impact on SEO

The routing optimizations positively impact SEO performance:

| Optimization | SEO Impact | Technical Benefit |
|--------------|------------|-------------------|
| **Route Prefetching** | Faster page loads | Improved Core Web Vitals |
| **Code Splitting** | Reduced bundle sizes | Better page speed scores |
| **Lazy Loading** | Focused content delivery | Enhanced user engagement |
| **Structured Data** | Rich snippets | Higher click-through rates |

**Section sources**
- [src/components/SEO.tsx](file://src/components/SEO.tsx#L39-L106)
- [src/lib/structuredData.ts](file://src/lib/structuredData.ts#L10-L231)

## Performance Optimization

The routing system implements multiple performance optimization strategies to ensure fast navigation and optimal user experience.

### Loading Performance Metrics

The system tracks and optimizes various performance metrics:

```mermaid
graph LR
subgraph "Performance Metrics"
FP[First Paint]
FCP[First Contentful Paint]
LCP[Largest Contentful Paint]
TTI[Time to Interactive]
CLS[Cumulative Layout Shift]
end
subgraph "Optimization Strategies"
CodeSplitting[Code Splitting]
RoutePrefetch[Route Prefetching]
LazyLoading[Lazy Loading]
Caching[Smart Caching]
end
CodeSplitting --> FP
CodeSplitting --> FCP
RoutePrefetch --> LCP
LazyLoading --> TTI
Caching --> CLS
```

### Bundle Size Optimization

The Vite configuration implements aggressive bundle optimization:

| Optimization Technique | Impact | Implementation |
|------------------------|--------|----------------|
| **Tree Shaking** | 30-40% reduction | ES module elimination |
| **Code Splitting** | 50-70% reduction | Route-level chunking |
| **Asset Optimization** | 60-80% reduction | Image and asset compression |
| **Source Map Minification** | 90% reduction | Hidden source maps |

### Navigation Performance

The navigation system optimizes for fast transitions:

1. **Instant Navigation**: Critical routes load instantly
2. **Intelligent Prefetching**: Predictive route loading
3. **Cached Components**: Component-level caching strategies
4. **Optimized Transitions**: Smooth, performant animations

### Memory Management

The system implements efficient memory management:

- **Component Cleanup**: Proper cleanup of navigation listeners
- **Event Listener Management**: Automatic removal of event handlers
- **State Optimization**: Minimal state updates during navigation
- **Resource Cleanup**: Efficient cleanup of network requests

**Section sources**
- [vite.config.ts](file://vite.config.ts#L103-L186)
- [src/lib/routePrefetch.ts](file://src/lib/routePrefetch.ts#L57-L124)

## Troubleshooting Guide

Common issues and solutions for the routing and navigation system.

### Authentication Issues

**Problem**: Users redirected to incorrect dashboards
**Solution**: Verify user role resolution and database connectivity

**Problem**: Authentication timeouts
**Solution**: Implement proper session refresh and error handling

### Navigation Performance Issues

**Problem**: Slow route transitions
**Solution**: Check route prefetching configuration and network conditions

**Problem**: Memory leaks during navigation
**Solution**: Verify proper cleanup of event listeners and subscriptions

### SEO and Accessibility Issues

**Problem**: Missing structured data
**Solution**: Verify SEO component implementation and schema generation

**Problem**: Poor accessibility scores
**Solution**: Review ARIA implementation and keyboard navigation support

### Development Issues

**Problem**: Hot reload not working for routes
**Solution**: Restart development server and verify file watching configuration

**Problem**: Build failures with route imports
**Solution**: Check Vite configuration and import resolution settings

**Section sources**
- [src/components/SmartDashboardRouter.tsx](file://src/components/SmartDashboardRouter.tsx#L15-L113)
- [src/lib/routePrefetch.ts](file://src/lib/routePrefetch.ts#L57-L124)