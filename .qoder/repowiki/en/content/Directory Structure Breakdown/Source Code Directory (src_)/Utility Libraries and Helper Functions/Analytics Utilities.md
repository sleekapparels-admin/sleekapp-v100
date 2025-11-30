# Analytics Utilities

<cite>
**Referenced Files in This Document**   
- [analytics.ts](file://src/lib/analytics.ts)
- [analyticsTracking.ts](file://src/lib/analyticsTracking.ts)
- [tracker.ts](file://src/lib/analytics/tracker.ts)
- [clarityCheck.ts](file://src/lib/analytics/clarityCheck.ts)
- [blogDebugger.ts](file://src/lib/blogDebugger.ts)
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx)
- [CookieConsentBanner.tsx](file://src/components/CookieConsentBanner.tsx)
- [LeadCaptureForm.tsx](file://src/components/LeadCaptureForm.tsx)
- [QuoteForm.tsx](file://src/components/QuoteForm.tsx)
- [App.tsx](file://src/App.tsx)
- [usePageTracking.ts](file://src/hooks/usePageTracking.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Analytics Architecture](#core-analytics-architecture)
3. [Multi-Platform Tracking Implementation](#multi-platform-tracking-implementation)
4. [Analytics Provider and Initialization](#analytics-provider-and-initialization)
5. [Event Schema and Type Safety](#event-schema-and-type-safety)
6. [Component-Level Event Triggering](#component-level-event-triggering)
7. [Consent Management](#consent-management)
8. [Error Handling and Diagnostics](#error-handling-and-diagnostics)
9. [Performance Considerations](#performance-considerations)
10. [Database Analytics Integration](#database-analytics-integration)

## Introduction
The analytics utilities in the Sleek Apparels platform provide a comprehensive multi-platform tracking system that integrates Google Analytics 4, Facebook Pixel, LinkedIn Insight Tag, Google Tag Manager, and Microsoft Clarity. This documentation details the implementation of the analytics infrastructure, focusing on the central integration layer, event management, and component-level tracking. The system is designed to capture user behavior, conversion events, and engagement metrics across various touchpoints while maintaining performance and respecting user privacy through consent management.

## Core Analytics Architecture

The analytics architecture is built around a modular design that separates configuration, event tracking, and platform-specific implementations. The core components work together to provide a unified interface for tracking events across multiple analytics platforms.

```mermaid
graph TD
A[AnalyticsProvider] --> B[analytics.ts]
A --> C[clarityCheck.ts]
B --> D[Google Analytics 4]
B --> E[Facebook Pixel]
B --> F[LinkedIn Insight Tag]
B --> G[Microsoft Clarity]
B --> H[Google Tag Manager]
I[Component] --> J[Analytics Utilities]
J --> K[Event Trigger]
K --> L[Multi-Platform Dispatch]
M[CookieConsentBanner] --> N[Consent Management]
N --> A
```

**Diagram sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)
- [CookieConsentBanner.tsx](file://src/components/CookieConsentBanner.tsx#L1-L109)

**Section sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)

## Multi-Platform Tracking Implementation

The analytics.ts file serves as the central integration layer for multi-platform tracking, abstracting event tracking, page views, and user properties across different analytics services. It provides a unified interface that simplifies event tracking across platforms.

The implementation includes configuration constants for each analytics platform:
- Google Analytics 4 (GA4_MEASUREMENT_ID: G-1PYKLMP22J)
- Google Tag Manager (GTM_CONTAINER_ID: GTM-WGTH2FQ9)
- Microsoft Clarity (CLARITY_PROJECT_ID: txi3rcrykl)
- Facebook Pixel (FACEBOOK_PIXEL_ID: 1165081028902190)
- LinkedIn Insight Tag (LINKEDIN_PARTNER_ID: 514756254)

The system implements several key functions for cross-platform tracking:
- pushToDataLayer: Pushes custom events to GTM DataLayer
- trackPageView: Tracks page views in GA4
- trackEvent: Tracks custom events in GA4
- trackBusinessEvent: Tracks business-specific events with platform-specific parameters
- trackMultiPlatformEvent: Coordinates events across all platforms

```mermaid
classDiagram
class AnalyticsCore {
+GA4_MEASUREMENT_ID : string
+GTM_CONTAINER_ID : string
+CLARITY_PROJECT_ID : string
+FACEBOOK_PIXEL_ID : string
+LINKEDIN_PARTNER_ID : string
+pushToDataLayer(data : Record~string, any~)
+trackPageView(url : string, title? : string)
+trackEvent(action : string, category : string, label? : string, value? : number)
+trackFacebookPixel(eventName : string, params? : Record~string, any~)
+trackLinkedInEvent(conversionId? : string)
+trackClarityEvent(eventName : string)
}
class BusinessEvents {
+quoteRequest(productType : string, quantity : number)
+looptraceSignup(source : string)
+designStudioUsage(action : 'start' | 'complete' | 'export')
+contactFormSubmit(formType : string)
+videoEngagement(videoName : string, percentage : number)
}
class MultiPlatformEvents {
+quoteRequest(productType : string, quantity : number)
+contactFormSubmit(formType : string)
+signupComplete(source : string)
}
AnalyticsCore --> BusinessEvents : "contains"
AnalyticsCore --> MultiPlatformEvents : "contains"
BusinessEvents --> AnalyticsCore : "uses"
MultiPlatformEvents --> AnalyticsCore : "uses"
```

**Diagram sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)

**Section sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)

## Analytics Provider and Initialization

The AnalyticsProvider component manages the initialization and lifecycle of analytics scripts, ensuring optimal performance and user experience. It implements deferred loading strategies to minimize impact on page load times.

Key features of the AnalyticsProvider:
- Deferred initialization on user interaction (mousedown, touchstart, scroll, keydown)
- Mobile/desktop-specific loading strategies
- Fallback mechanisms with timeouts
- Integration with React Router for page view tracking
- Error handling for blocked or failed script loading

The provider initializes each analytics platform separately:
- Google Analytics: Loads on first user interaction with 10-second fallback on desktop
- Facebook Pixel: Loads on interaction with 10-second fallback on desktop
- LinkedIn Insight Tag: Loads on interaction with 10-second fallback on desktop
- Microsoft Clarity: Checked for reachability after GTM initialization

```mermaid
sequenceDiagram
participant User
participant AnalyticsProvider
participant GA4
participant FBPixel
participant LinkedIn
participant Clarity
User->>AnalyticsProvider : Page Load
AnalyticsProvider->>AnalyticsProvider : Initialize with deferred loading
User->>AnalyticsProvider : First Interaction (click, scroll, etc.)
AnalyticsProvider->>GA4 : Load GA4 Script
AnalyticsProvider->>FBPixel : Load Facebook Pixel
AnalyticsProvider->>LinkedIn : Load LinkedIn Script
AnalyticsProvider->>AnalyticsProvider : Set up page view tracking
User->>AnalyticsProvider : Route Change
AnalyticsProvider->>GA4 : Track Page View
AnalyticsProvider->>FBPixel : Track Page View
AnalyticsProvider->>Clarity : Set Page Context
AnalyticsProvider->>AnalyticsProvider : Check Clarity Reachability (5s delay)
alt Clarity Blocked
AnalyticsProvider->>AnalyticsProvider : Mark as blocked
AnalyticsProvider->>GA4 : Send diagnostic event
end
```

**Diagram sources**
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)

**Section sources**
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)

## Event Schema and Type Safety

The analytics system implements a type-safe event schema to ensure consistency and prevent errors in event tracking. This is achieved through TypeScript interfaces and well-defined function signatures.

The primary event tracking functions include:
- trackEvent: Generic event tracking with action, category, label, and value parameters
- trackBusinessEvent: Predefined business events with specific parameters
- trackMultiPlatformEvent: Coordinated events across multiple platforms

Each analytics platform has specific event requirements:
- Google Analytics: Uses gtag function with event parameters
- Facebook Pixel: Uses fbq function with event names and parameters
- LinkedIn: Uses lintrk function with conversion IDs
- Microsoft Clarity: Uses clarity function with event names

The system also includes database analytics tracking through analyticsTracking.ts, which defines a DatabaseAnalyticsEvent interface with properties for event name, category, properties, page URL, and referrer.

```mermaid
erDiagram
EVENT ||--o{ PLATFORM : "tracked_on"
EVENT {
string event_name PK
string event_category
json event_properties
string page_url
string referrer
string user_agent
string device_type
string browser
string os
}
PLATFORM {
string platform_name PK
string measurement_id
string container_id
string project_id
}
USER_SESSION {
string session_id PK
string user_id FK
datetime created_at
datetime expires_at
}
EVENT }o--|| USER_SESSION : "belongs_to"
```

**Diagram sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)
- [analyticsTracking.ts](file://src/lib/analyticsTracking.ts#L1-L149)

**Section sources**
- [analytics.ts](file://src/lib/analytics.ts#L1-L183)
- [analyticsTracking.ts](file://src/lib/analyticsTracking.ts#L1-L149)

## Component-Level Event Triggering

Analytics events are triggered from various components throughout the application, with LeadCaptureForm.tsx and QuoteForm.tsx serving as primary examples of event-driven components.

The LeadCaptureForm component tracks:
- Form submission success/failure
- Lead capture events with user type and source
- UTM parameters for campaign tracking

The QuoteForm component implements:
- Form validation with Zod schema
- Session tracking with localStorage
- Edge function integration for quote submission
- Success/error state management

Both components use the analytics utilities to track relevant events, ensuring consistent data collection across the platform.

```mermaid
flowchart TD
A[User Interaction] --> B{Component Type}
B --> C[LeadCaptureForm]
B --> D[QuoteForm]
C --> E[Form Submission]
E --> F[Validate Input]
F --> G[Submit to Database]
G --> H{Success?}
H --> |Yes| I[Track Successful Lead]
H --> |No| J[Track Failed Lead]
I --> K[Show Success State]
J --> L[Show Error State]
D --> M[Form Submission]
M --> N[Validate with Zod]
N --> O[Invoke Edge Function]
O --> P{Success?}
P --> |Yes| Q[Track Quote Request]
P --> |No| R[Track Failed Request]
Q --> S[Show Success State]
R --> T[Show Error State]
I --> U[Analytics Tracking]
Q --> U
J --> U
R --> U
U --> V[Multi-Platform Dispatch]
```

**Diagram sources**
- [LeadCaptureForm.tsx](file://src/components/LeadCaptureForm.tsx#L1-L295)
- [QuoteForm.tsx](file://src/components/QuoteForm.tsx#L1-L213)

**Section sources**
- [LeadCaptureForm.tsx](file://src/components/LeadCaptureForm.tsx#L1-L295)
- [QuoteForm.tsx](file://src/components/QuoteForm.tsx#L1-L213)

## Consent Management

The CookieConsentBanner component handles user consent for tracking, complying with privacy regulations and user preferences. It provides a user-friendly interface for accepting or rejecting non-essential cookies.

Key features of the consent management system:
- Local storage persistence of consent choices
- GDPR-compliant consent workflow
- Dynamic updating of gtag consent settings
- Visual feedback for user actions
- Smooth animations for banner appearance/disappearance

When users accept or reject tracking, the system updates the gtag consent settings accordingly, controlling which analytics scripts are allowed to run.

```mermaid
sequenceDiagram
participant User
participant CookieBanner
participant Analytics
User->>CookieBanner : Page Load
CookieBanner->>User : Show Consent Banner (after 1s)
User->>CookieBanner : Click "Accept All"
CookieBanner->>Analytics : Update gtag consent (all granted)
CookieBanner->>CookieBanner : Store "accepted" in localStorage
CookieBanner->>CookieBanner : Animate out banner
User->>CookieBanner : Click "Reject All"
CookieBanner->>Analytics : Update gtag consent (all denied)
CookieBanner->>CookieBanner : Store "rejected" in localStorage
CookieBanner->>CookieBanner : Animate out banner
User->>CookieBanner : Refresh Page
CookieBanner->>CookieBanner : Check localStorage
alt Consent Already Given
CookieBanner->>User : Do not show banner
else No Consent
CookieBanner->>User : Show banner again
end
```

**Diagram sources**
- [CookieConsentBanner.tsx](file://src/components/CookieConsentBanner.tsx#L1-L109)

**Section sources**
- [CookieConsentBanner.tsx](file://src/components/CookieConsentBanner.tsx#L1-L109)

## Error Handling and Diagnostics

The analytics system includes comprehensive error handling and diagnostic capabilities to ensure reliability and troubleshoot issues.

The clarityCheck.ts module implements reachability testing for Microsoft Clarity resources:
- Checks both tracking pixel and main script
- Uses cached results to prevent redundant checks
- Handles HTTPS inspection and firewall blocking
- Provides detailed error information

The blogDebugger.ts utility offers comprehensive debugging for blog data fetching:
- Connection status verification
- Supabase configuration validation
- Database connectivity testing
- Permission checks for read/write operations
- RLS policy verification
- Detailed diagnostic output

```mermaid
flowchart TD
A[Error Detection] --> B{Error Type}
B --> C[Clarity Blocked]
B --> D[Database Connection]
B --> E[Permission Denied]
B --> F[Network Failure]
C --> G[clarityCheck.ts]
G --> H[Check Pixel Reachability]
H --> I{Success?}
I --> |Yes| J[Mark as Reachable]
I --> |No| K[Check Script Reachability]
K --> L{Success?}
L --> |Yes| M[Mark as Reachable]
L --> |No| N[Mark as Blocked]
N --> O[Send Diagnostic Event]
O --> P[Log in Development]
D --> Q[blogDebugger.ts]
Q --> R[Test Database Connection]
R --> S{Success?}
S --> |Yes| T[Fetch Sample Data]
S --> |No| U[Log Connection Error]
T --> V[Verify Permissions]
V --> W[Generate Diagnostic Report]
```

**Diagram sources**
- [clarityCheck.ts](file://src/lib/analytics/clarityCheck.ts#L1-L124)
- [blogDebugger.ts](file://src/lib/blogDebugger.ts#L1-L246)

**Section sources**
- [clarityCheck.ts](file://src/lib/analytics/clarityCheck.ts#L1-L124)
- [blogDebugger.ts](file://src/lib/blogDebugger.ts#L1-L246)

## Performance Considerations

The analytics implementation prioritizes performance through several key strategies:

1. **Deferred Loading**: Analytics scripts load only after user interaction or with delayed timeouts, preventing render-blocking behavior.

2. **Mobile Optimization**: Different loading strategies for mobile vs. desktop, recognizing that mobile users are more sensitive to performance impacts.

3. **Asynchronous Execution**: All analytics operations are non-blocking, ensuring they don't interfere with core application functionality.

4. **Caching**: Results are cached to prevent redundant network requests and processing.

5. **Error Resilience**: Failed analytics operations are handled gracefully without affecting user experience.

The system also implements performance monitoring through the usePageTracking hook, which tracks page views and bounce rates, providing insights into user engagement and potential performance issues.

```mermaid
flowchart LR
A[Performance Strategy] --> B[Deferred Loading]
A --> C[Mobile Optimization]
A --> D[Asynchronous Execution]
A --> E[Caching]
A --> F[Error Resilience]
B --> G[Load on Interaction]
B --> H[Fallback Timeout]
C --> I[No Timeout on Mobile]
C --> J[10s Timeout on Desktop]
D --> K[Non-blocking Operations]
D --> L[Promise-based Execution]
E --> M[Cached Results]
E --> N[Session Storage]
F --> O[Graceful Degradation]
F --> P[Development Logging]
```

**Diagram sources**
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)
- [usePageTracking.ts](file://src/hooks/usePageTracking.ts#L1-L23)

**Section sources**
- [AnalyticsProvider.tsx](file://src/components/AnalyticsProvider.tsx#L1-L256)
- [usePageTracking.ts](file://src/hooks/usePageTracking.ts#L1-L23)

## Database Analytics Integration

The analytics system integrates with the database through analyticsTracking.ts, providing server-side event tracking that complements client-side analytics.

Key features of the database analytics integration:
- Session management with sessionStorage
- Anonymous user tracking with session IDs
- Comprehensive user agent parsing
- Device type detection (mobile/desktop)
- Browser and OS identification
- UTM parameter capture
- Error handling with graceful degradation

The trackDatabaseEvent function captures detailed information about user interactions, including:
- Event name and category
- User authentication status
- Session and anonymous IDs
- Page URL and referrer
- Browser and device information
- Custom event properties

This database-level tracking provides a reliable backup to client-side analytics and enables analysis of user behavior that might not be captured by third-party services.

```mermaid
classDiagram
class DatabaseAnalyticsEvent {
+event_name : string
+event_category? : 'engagement' | 'conversion' | 'navigation' | 'error'
+event_properties? : Record~string, any~
+page_url? : string
+referrer? : string
}
class trackDatabaseEvent {
+user_id : string | null
+session_id : string
+anonymous_id : string
+user_agent : string
+device_type : 'mobile' | 'desktop'
+browser : string
+os : string
}
class HelperFunctions {
+detectBrowser(userAgent : string) : string
+detectOS(userAgent : string) : string
+getUTMParameters() : Record~string, string | null~
}
class TrackingFunctions {
+trackFormSubmit(formName : string, success : boolean)
+trackSignupComplete(method : 'email' | 'google', userType? : string)
+trackCTAClick(ctaName : string, ctaLocation : string)
}
DatabaseAnalyticsEvent <|-- trackDatabaseEvent
HelperFunctions --> trackDatabaseEvent
TrackingFunctions --> trackDatabaseEvent
```

**Diagram sources**
- [analyticsTracking.ts](file://src/lib/analyticsTracking.ts#L1-L149)

**Section sources**
- [analyticsTracking.ts](file://src/lib/analyticsTracking.ts#L1-L149)