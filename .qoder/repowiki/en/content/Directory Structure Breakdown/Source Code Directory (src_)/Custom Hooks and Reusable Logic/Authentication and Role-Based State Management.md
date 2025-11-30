# Authentication and Role-Based State Management

<cite>
**Referenced Files in This Document**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts)
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx)
- [ProtectedRoute.tsx](file://src/components/routes/ProtectedRoute.tsx)
- [RoleBasedRoute.tsx](file://src/components/routes/RoleBasedRoute.tsx)
- [AdminLayout.tsx](file://src/pages/admin/AdminLayout.tsx)
- [ModernAdminDashboard.tsx](file://src/pages/ModernAdminDashboard.tsx)
- [ModernSupplierDashboard.tsx](file://src/pages/ModernSupplierDashboard.tsx)
- [useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts)
- [Auth.test.tsx](file://src/pages/__tests__/Auth.test.tsx)
- [client.ts](file://src/integrations/supabase/client.ts)
- [supabase.ts](file://src/test/mocks/supabase.ts)
- [App.tsx](file://src/App.tsx)
- [index.ts](file://supabase/functions/admin-check/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Authentication Components](#core-authentication-components)
4. [Role-Based Access Control](#role-based-access-control)
5. [Route Protection Mechanisms](#route-protection-mechanisms)
6. [UI Rendering with Role Gating](#ui-rendering-with-role-gating)
7. [Testing Strategies](#testing-strategies)
8. [Security Considerations](#security-considerations)
9. [Common Issues and Solutions](#common-issues-and-solutions)
10. [Best Practices](#best-practices)

## Introduction

The Sleek Apparels authentication system provides comprehensive role-based access control (RBAC) for managing different user types including admins, buyers, and suppliers. The system integrates seamlessly with Supabase for authentication and implements multiple layers of security to protect sensitive administrative functions and user-specific content.

The authentication architecture consists of three main components:
- **AuthContext**: Centralized authentication state management
- **useAdminAuth**: Specialized hook for admin role validation
- **Route Protection**: ProtectedRoute and RoleBasedRoute components for secure navigation

## System Architecture

The authentication system follows a layered architecture that separates concerns between client-side state management, server-side validation, and UI protection mechanisms.

```mermaid
graph TB
subgraph "Client Layer"
UC[User Components]
AR[useAdminAuth Hook]
AC[AuthContext Provider]
PR[ProtectedRoute]
RBR[RoleBasedRoute]
end
subgraph "Validation Layer"
SC[Supabase Client]
EF[Edge Functions]
AC_CHECK[admin-check Function]
end
subgraph "Server Layer"
SB[Supabase Auth]
DB[(Database)]
RBAC[(Role-Based Access)]
end
UC --> AR
UC --> AC
UC --> PR
UC --> RBR
AR --> SC
AC --> SC
PR --> AC
RBR --> AC
SC --> EF
EF --> AC_CHECK
AC_CHECK --> SB
SB --> DB
DB --> RBAC
```

**Diagram sources**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L1-L47)
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx#L1-L166)
- [ProtectedRoute.tsx](file://src/components/routes/ProtectedRoute.tsx#L1-L36)
- [RoleBasedRoute.tsx](file://src/components/routes/RoleBasedRoute.tsx#L1-L60)

## Core Authentication Components

### AuthContext Implementation

The AuthContext serves as the central hub for authentication state management, providing reactive access to user information, roles, and authentication status across the entire application.

```mermaid
classDiagram
class AuthContext {
+User user
+Session session
+UserRole role
+UserType userType
+boolean isAdmin
+boolean isSupplier
+boolean isBuyer
+boolean loading
+signOut() Promise~void~
+refreshAuth() Promise~void~
}
class UserRole {
<<enumeration>>
retailer
wholesaler
educational
corporate
sports_team
factory
admin
supplier
}
class UserType {
<<enumeration>>
buyer
supplier
admin
}
AuthContext --> UserRole
AuthContext --> UserType
```

**Diagram sources**
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx#L5-L16)

The AuthContext provides several key capabilities:

- **Automatic Session Management**: Monitors authentication state changes and updates user roles dynamically
- **Role Resolution**: Converts raw user roles into logical user types (buyer, supplier, admin)
- **Secure State Updates**: Ensures authentication state changes trigger appropriate UI updates
- **Error Handling**: Provides graceful degradation when authentication fails

**Section sources**
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx#L40-L166)

### useAdminAuth Hook

The useAdminAuth hook provides specialized functionality for admin role validation with server-side confirmation and caching mechanisms.

```mermaid
sequenceDiagram
participant Component as React Component
participant Hook as useAdminAuth
participant Supabase as Supabase Client
participant EdgeFunc as admin-check Function
participant Server as Supabase Edge Runtime
Component->>Hook : Initialize
Hook->>Supabase : getSession()
Supabase-->>Hook : Session Data
Hook->>EdgeFunc : invoke('admin-check')
EdgeFunc->>Server : Validate Token & Roles
Server-->>EdgeFunc : Admin Status
EdgeFunc-->>Hook : Response
Hook-->>Component : isAdmin, loading
```

**Diagram sources**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L14-L42)
- [index.ts](file://supabase/functions/admin-check/index.ts#L44-L73)

The hook implements several important features:

- **Server-Side Validation**: Uses Supabase Edge Functions for secure admin role verification
- **Token-Based Authentication**: Leverages JWT tokens for secure server communication
- **Error Resilience**: Handles network failures and invalid sessions gracefully
- **Loading States**: Provides appropriate loading indicators during authentication checks

**Section sources**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L5-L47)

## Role-Based Access Control

### User Role Classification

The system implements a hierarchical role structure that determines user capabilities and access permissions:

| Role Type | Description | Access Level | UI Components |
|-----------|-------------|--------------|---------------|
| `admin` | System administrators | Full access | Admin dashboards, system management |
| `supplier` | Product suppliers | Supplier-specific features | Supplier dashboards, product management |
| `factory` | Manufacturing facilities | Supplier equivalent | Same as supplier |
| `retailer` | Retail businesses | Buyer features | Buyer dashboards, order management |
| `wholesaler` | Wholesale distributors | Buyer features | Same as retailer |
| `educational` | Educational institutions | Buyer features | Same as retailer |
| `corporate` | Corporate buyers | Buyer features | Same as retailer |
| `sports_team` | Sports team buyers | Buyer features | Same as retailer |

### Role Determination Logic

The system converts raw roles into logical user types for simplified route protection:

```mermaid
flowchart TD
Start([User Login]) --> CheckRole{Role Type?}
CheckRole --> |admin| SetAdmin[Set userType = 'admin']
CheckRole --> |supplier| SetSupplier[Set userType = 'supplier']
CheckRole --> |factory| SetSupplier
CheckRole --> |retailer| SetBuyer[Set userType = 'buyer']
CheckRole --> |wholesaler| SetBuyer
CheckRole --> |educational| SetBuyer
CheckRole --> |corporate| SetBuyer
CheckRole --> |sports_team| SetBuyer
SetAdmin --> UpdateState[Update Auth State]
SetSupplier --> UpdateState
SetBuyer --> UpdateState
UpdateState --> End([Ready for Routing])
```

**Diagram sources**
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx#L67-L74)

**Section sources**
- [AuthContext.tsx](file://src/contexts/AuthContext.tsx#L67-L74)

## Route Protection Mechanisms

### ProtectedRoute Component

The ProtectedRoute component ensures that only authenticated users can access protected areas of the application.

```mermaid
flowchart TD
RouteAccess[Route Access Attempt] --> CheckAuth{Authenticated?}
CheckAuth --> |No| ShowLoading[Show Loading Spinner]
CheckAuth --> |Yes| CheckLoading{Loading Complete?}
CheckLoading --> |No| ShowLoading
CheckLoading --> |Yes| CheckRedirect{Has Redirect?}
CheckRedirect --> |Yes| RedirectToAuth[Redirect to /auth]
CheckRedirect --> |No| RenderChildren[Render Protected Content]
ShowLoading --> WaitComplete[Wait for Auth Check]
WaitComplete --> CheckAuth
```

**Diagram sources**
- [ProtectedRoute.tsx](file://src/components/routes/ProtectedRoute.tsx#L14-L35)

### RoleBasedRoute Component

The RoleBasedRoute provides granular access control based on user roles and user types.

```mermaid
flowchart TD
RouteAttempt[Route Access Attempt] --> CheckLoading{Loading?}
CheckLoading --> |Yes| ShowLoading[Show Loading Spinner]
CheckLoading --> |No| CheckAuth{Authenticated?}
CheckAuth --> |No| RedirectAuth[Redirect to /auth]
CheckAuth --> |Yes| CheckRole{Allowed Role?}
CheckRole --> |No| CheckUserType{Allowed User Type?}
CheckRole --> |Yes| CheckUserType
CheckUserType --> |No| CheckFallback{Has Fallback?}
CheckUserType --> |Yes| RenderRoute[Render Route Content]
CheckFallback --> |Yes| RenderFallback[Render Fallback Component]
CheckFallback --> |No| RedirectUnauthorized[Redirect to /unauthorized]
ShowLoading --> WaitComplete[Wait for Auth Check]
WaitComplete --> CheckLoading
```

**Diagram sources**
- [RoleBasedRoute.tsx](file://src/components/routes/RoleBasedRoute.tsx#L17-L59)

### Route Configuration Examples

The application uses the following route protection patterns:

| Route Pattern | Protection Type | Allowed Roles | Purpose |
|---------------|-----------------|---------------|---------|
| `/dashboard` | Role-based | `['buyer']` | Buyer dashboard access |
| `/supplier-dashboard` | Role-based | `['supplier']` | Supplier dashboard access |
| `/admin` | Role-based | `['admin']` | Admin panel access |
| `/admin/*` | Role-based | `['admin']` | Admin sub-routes |
| `/dashboard-router` | Protected | Any authenticated user | General dashboard access |

**Section sources**
- [RoleBasedRoute.tsx](file://src/components/routes/RoleBasedRoute.tsx#L17-L59)
- [App.tsx](file://src/App.tsx#L213-L242)

## UI Rendering with Role Gating

### Admin Dashboard Implementation

The AdminLayout component demonstrates role gating in practice, ensuring only authorized admins can access the administration interface.

```mermaid
sequenceDiagram
participant User as User
participant Layout as AdminLayout
participant Hook as useAdminAuth
participant Nav as Navigation
User->>Layout : Access /admin
Layout->>Hook : Check admin status
Hook-->>Layout : isAdmin : false/loading
Layout->>Layout : Show loading spinner
Hook-->>Layout : isAdmin : true
Layout->>Layout : Render admin layout
Layout->>Nav : Show admin navigation
```

**Diagram sources**
- [AdminLayout.tsx](file://src/pages/admin/AdminLayout.tsx#L9-L44)
- [ModernAdminDashboard.tsx](file://src/pages/ModernAdminDashboard.tsx#L123-L153)

### Supplier Dashboard Features

The supplier dashboard showcases role-based UI rendering with dynamic content based on user capabilities and performance metrics.

**Section sources**
- [AdminLayout.tsx](file://src/pages/admin/AdminLayout.tsx#L9-L44)
- [ModernAdminDashboard.tsx](file://src/pages/ModernAdminDashboard.tsx#L123-L153)
- [ModernSupplierDashboard.tsx](file://src/pages/ModernSupplierDashboard.tsx#L98-L110)

## Testing Strategies

### useAdminAuth Testing Approach

The useAdminAuth hook includes comprehensive test coverage using Supabase mock implementations and Vitest for reliable testing.

```mermaid
flowchart TD
TestSuite[Test Suite] --> AdminStatus[Admin Status Tests]
TestSuite --> SessionValidation[Session Validation Tests]
TestSuite --> RecheckFunctionality[Re-check Functionality Tests]
TestSuite --> EdgeCases[Edge Case Tests]
TestSuite --> SecurityTests[Security Tests]
AdminStatus --> ValidAdmin[Valid Admin User]
AdminStatus --> NonAdmin[Non-admin User]
AdminStatus --> NoSession[No Session]
SessionValidation --> ExpiredSession[Expired Sessions]
SessionValidation --> NetworkErrors[Network Errors]
RecheckFunctionality --> ManualRecheck[Manual Re-check]
EdgeCases --> NullUser[Null User]
EdgeCases --> MalformedResponse[Malformed Response]
EdgeCases --> ConcurrentChecks[Concurrent Checks]
SecurityTests --> ServerSideValidation[Server-side Validation]
SecurityTests --> ClientTrust[Client Trust Prevention]
```

**Diagram sources**
- [useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts#L20-L381)

### Test Coverage Areas

The testing strategy covers multiple scenarios to ensure robust authentication behavior:

- **Successful Admin Validation**: Tests positive admin scenarios with proper token handling
- **Authentication Failures**: Validates error handling for invalid sessions and network issues
- **Role Transition Testing**: Ensures smooth transitions between different user roles
- **Security Validation**: Confirms server-side validation prevents client-side tampering
- **Edge Case Handling**: Tests boundary conditions and unexpected input scenarios

**Section sources**
- [useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts#L20-L381)

### Mock Implementation Strategy

The test suite uses sophisticated mocking to isolate authentication logic from external dependencies:

```mermaid
classDiagram
class MockSupabase {
+auth : MockSupabaseAuth
+functions : MockSupabaseFunctions
+from : MockSupabaseFrom
}
class MockSupabaseAuth {
+signInWithPassword()
+signUp()
+signOut()
+getSession()
+onAuthStateChange()
}
class MockSupabaseFunctions {
+invoke()
}
class MockSupabaseFrom {
+select()
+insert()
+update()
+delete()
+eq()
+single()
+maybeSingle()
}
MockSupabase --> MockSupabaseAuth
MockSupabase --> MockSupabaseFunctions
MockSupabase --> MockSupabaseFrom
```

**Diagram sources**
- [supabase.ts](file://src/test/mocks/supabase.ts#L1-L38)

**Section sources**
- [supabase.ts](file://src/test/mocks/supabase.ts#L1-L38)

## Security Considerations

### Token Handling Security

The authentication system implements several security measures to protect against common vulnerabilities:

- **Server-Side Validation**: Admin status is verified on the server using Supabase Edge Functions
- **Token Expiration**: Automatic token refresh prevents session timeouts
- **Secure Storage**: Tokens are stored securely in localStorage with encryption
- **Cross-Site Request Forgery (CSRF) Protection**: Implemented through Supabase's built-in CSRF protection

### Session Persistence

The system maintains secure session persistence with automatic refresh capabilities:

```mermaid
sequenceDiagram
participant Browser as Browser
participant Supabase as Supabase Client
participant Server as Supabase Server
participant EdgeFunc as Edge Function
Browser->>Supabase : Initialize with stored session
Supabase->>Server : Validate session token
Server-->>Supabase : Session validity
Supabase->>EdgeFunc : Check admin status
EdgeFunc->>Server : Verify user role
Server-->>EdgeFunc : Role information
EdgeFunc-->>Supabase : Admin status
Supabase-->>Browser : Authentication state
```

**Diagram sources**
- [client.ts](file://src/integrations/supabase/client.ts#L14-L20)
- [index.ts](file://supabase/functions/admin-check/index.ts#L44-L73)

### Edge Function Security

The admin-check Edge Function implements additional security layers:

- **Role Verification**: Direct database query to confirm admin status
- **Error Handling**: Graceful failure with minimal information leakage
- **CORS Protection**: Proper CORS headers prevent cross-origin attacks
- **Rate Limiting**: Built-in Supabase rate limiting protects against abuse

**Section sources**
- [client.ts](file://src/integrations/supabase/client.ts#L14-L20)
- [index.ts](file://supabase/functions/admin-check/index.ts#L44-L73)

## Common Issues and Solutions

### Authentication State Synchronization

**Issue**: Inconsistent authentication state across components
**Solution**: Use AuthContext for centralized state management and ensure all components consume the context properly

**Issue**: Race conditions during initial authentication
**Solution**: Implement loading states and wait for authentication completion before rendering protected content

### Role Validation Failures

**Issue**: Admin status not updating after role changes
**Solution**: Implement manual re-validation using the `checkAdminStatus` method from useAdminAuth

**Issue**: Server-side validation bypass attempts
**Solution**: Always rely on server-side validation and never trust client-side role flags

### Performance Optimization

**Issue**: Slow authentication checks impacting user experience
**Solution**: Implement caching mechanisms and optimize Edge Function execution time

**Issue**: Multiple simultaneous authentication checks
**Solution**: Use debouncing and request deduplication to prevent unnecessary API calls

## Best Practices

### Authentication Hook Usage

1. **Centralized State Management**: Always use AuthContext for authentication state rather than local component state
2. **Graceful Degradation**: Implement proper loading states and error boundaries
3. **Security First**: Never trust client-side authentication state for security decisions
4. **Performance Awareness**: Minimize authentication checks and implement caching where appropriate

### Route Protection Implementation

1. **Layered Protection**: Combine ProtectedRoute with RoleBasedRoute for comprehensive security
2. **Fallback Handling**: Provide meaningful fallback components for unauthorized access
3. **SEO Considerations**: Ensure proper meta tags and canonical URLs for protected routes
4. **Testing Coverage**: Maintain comprehensive test coverage for all authentication scenarios

### Development Guidelines

1. **Mock Consistency**: Use consistent mocking strategies across all authentication-related tests
2. **Error Handling**: Implement comprehensive error handling for all authentication operations
3. **Documentation**: Document authentication flows and security considerations clearly
4. **Monitoring**: Implement logging and monitoring for authentication events and failures