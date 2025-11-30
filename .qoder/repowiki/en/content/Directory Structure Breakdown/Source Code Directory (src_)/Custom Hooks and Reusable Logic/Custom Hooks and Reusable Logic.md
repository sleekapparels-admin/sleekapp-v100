# Custom Hooks and Reusable Logic

<cite>
**Referenced Files in This Document**   
- [useQuotes.ts](file://src/hooks/useQuotes.ts)
- [useSuppliers.ts](file://src/hooks/useSuppliers.ts)
- [useOrders.ts](file://src/hooks/queries/useOrders.ts)
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts)
- [useConversation.ts](file://src/hooks/useConversation.ts)
- [usePerformance.ts](file://src/hooks/usePerformance.ts)
- [useOptimisticUpdate.ts](file://src/hooks/useOptimisticUpdate.ts)
- [useNotifications.ts](file://src/hooks/queries/useNotifications.ts)
- [useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts)
- [QuoteGenerator.tsx](file://src/pages/QuoteGenerator.tsx)
- [ProductionTracking.tsx](file://src/pages/ProductionTracking.tsx)
- [supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts)
- [client.ts](file://src/integrations/supabase/client.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Data Fetching Hooks](#data-fetching-hooks)
3. [State Management Hooks](#state-management-hooks)
4. [Authentication and Authorization](#authentication-and-authorization)
5. [Hook Composition Examples](#hook-composition-examples)
6. [Error Handling and Loading States](#error-handling-and-loading-states)
7. [Optimistic Updates](#optimistic-updates)
8. [Testing Strategies](#testing-strategies)
9. [Conclusion](#conclusion)

## Introduction

The hooks directory in this application contains a comprehensive collection of custom React hooks that encapsulate reusable logic and data-fetching patterns. These hooks leverage React Query for efficient data synchronization with Supabase, providing a robust foundation for the application's state management and data operations. The architecture follows a modular approach with specialized hooks for different domains including quotes, orders, suppliers, authentication, and performance monitoring.

The hooks are organized into several categories:
- Data fetching hooks in the `queries/` subdirectory that handle CRUD operations with Supabase
- State management hooks for specific application features like AI conversations and performance monitoring
- Utility hooks for common patterns like optimistic updates
- Authentication hooks for role-based access control

This documentation provides a comprehensive overview of these hooks, their implementation details, and how they work together to create a seamless user experience.

## Data Fetching Hooks

The data fetching hooks in this application are built on top of React Query and provide a consistent interface for interacting with Supabase. These hooks handle data retrieval, caching, pagination, and background updates, abstracting away the complexity of direct database operations.

### useQuotes Hook

The `useQuotes` hook manages all operations related to quote requests in the application. It provides several functions for different use cases:

```mermaid
flowchart TD
A[useQuotes] --> B[useQuery for fetching quotes]
A --> C[useMutation for creating quotes]
A --> D[useMutation for updating quotes]
A --> E[useQuery for supplier quotes]
A --> F[useMutation for creating supplier quotes]
B --> G[Fetches quotes with buyer_id or session_id]
C --> H[Creates new quote with user/session context]
D --> I[Updates existing quote]
E --> J[Fetches quotes for supplier dashboard]
F --> K[Submits supplier quote response]
```

**Diagram sources**
- [useQuotes.ts](file://src/hooks/useQuotes.ts#L55-L261)

**Section sources**
- [useQuotes.ts](file://src/hooks/useQuotes.ts#L55-L261)

### useOrders Hook

The `useOrders` hook in the queries directory provides comprehensive functionality for order management with proper query key organization and caching strategies:

```mermaid
flowchart TD
A[useOrders] --> B[Query Key Hierarchy]
B --> C[orders/list]
B --> D[orders/detail/id]
B --> E[orders/admin-stats]
A --> F[Query Functions]
F --> G[useOrder - single order]
F --> H[useOrderWithRelations - order with related data]
F --> I[useOrdersByBuyer - orders by buyer]
F --> J[useOrdersByFactory - orders by factory]
F --> K[useAllOrders - all orders]
F --> L[useNewOrders - new orders]
F --> M[useAdminStats - admin statistics]
A --> N[Mutation Functions]
N --> O[useUpdateOrderStatus - update order status]
```

**Diagram sources**
- [useOrders.ts](file://src/hooks/queries/useOrders.ts#L6-L152)

**Section sources**
- [useOrders.ts](file://src/hooks/queries/useOrders.ts#L6-L152)

### useSuppliers Hook

The `useSuppliers` hook provides functionality for supplier management with client-side filtering and memoization for performance optimization:

```mermaid
flowchart TD
A[useSuppliers] --> B[useQuery for fetching suppliers]
A --> C[useQuery for fetching single supplier]
A --> D[useMutation for creating supplier]
A --> E[useMutation for updating supplier]
A --> F[useQuery for fetching current user's supplier]
B --> G[Filters by location, tier, MOQ, product category]
B --> H[Client-side filtering with memoization]
B --> I[Stale time: 10 minutes]
B --> J[Cache time: 15 minutes]
```

**Diagram sources**
- [useSuppliers.ts](file://src/hooks/useSuppliers.ts#L48-L215)
- [useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L15-L49)

**Section sources**
- [useSuppliers.ts](file://src/hooks/useSuppliers.ts#L48-L215)
- [useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L15-L49)

### Query Keys and Caching Strategy

The application implements a comprehensive query key strategy using the Query Key Factory pattern to ensure type safety and consistency:

```mermaid
erDiagram
QUERY_KEY ||--o{ ORDER_KEYS : "has"
QUERY_KEY ||--o{ SUPPLIER_KEYS : "has"
QUERY_KEY ||--o{ NOTIFICATION_KEYS : "has"
ORDER_KEYS {
string all
function lists
function list
function detail
function withRelations
function byBuyer
function byFactory
function new
function adminStats
}
SUPPLIER_KEYS {
string all
function lists
function list
function verified
function detail
function byUser
}
NOTIFICATION_KEYS {
string all
function lists
function byUser
}
```

**Diagram sources**
- [useOrders.ts](file://src/hooks/queries/useOrders.ts#L6-L17)
- [useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L5-L13)
- [useNotifications.ts](file://src/hooks/queries/useNotifications.ts#L6-L10)

**Section sources**
- [useOrders.ts](file://src/hooks/queries/useOrders.ts#L6-L17)
- [useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L5-L13)
- [useNotifications.ts](file://src/hooks/queries/useNotifications.ts#L6-L10)

## State Management Hooks

The application includes several specialized hooks for managing complex state in specific features, particularly around AI interactions and performance monitoring.

### useConversation Hook

The `useConversation` hook manages the state for AI-powered conversational interfaces, handling message history, session persistence, and integration with serverless functions:

```mermaid
sequenceDiagram
participant User
participant Frontend
participant SupabaseFunction
participant Database
User->>Frontend : Send message
Frontend->>Database : Save user message
Frontend->>SupabaseFunction : Invoke conversational-assistant
SupabaseFunction->>SupabaseFunction : Process message with AI
SupabaseFunction-->>Frontend : Return AI response
Frontend->>Database : Save AI message
Frontend->>User : Display response
```

The hook implements several key features:
- Session persistence using localStorage
- Error handling with retry logic (up to 3 attempts)
- Toast notifications for connection issues
- Conversation state management with timestamps
- Integration with Supabase Edge Functions for AI processing

**Diagram sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)

**Section sources**
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)

### usePerformance Hook

The `usePerformance` hook monitors Core Web Vitals and implements resource preloading strategies to enhance user experience:

```mermaid
flowchart TD
A[usePerformanceMonitoring] --> B[PerformanceObserver]
B --> C[First Contentful Paint]
B --> D[Largest Contentful Paint]
B --> E[Time to Interactive]
F[useResourcePreloading] --> G[requestIdleCallback]
G --> H[Prefetch likely next pages]
H --> I[/services]
H --> J[/contact]
```

Key features include:
- Measurement of Core Web Vitals (FCP, LCP, TTI)
- Performance rating based on Google's thresholds
- Development-time logging for debugging
- Idle-time resource prefetching for improved navigation
- Graceful degradation when Performance API is not supported

**Diagram sources**
- [usePerformance.ts](file://src/hooks/usePerformance.ts#L11-L107)

**Section sources**
- [usePerformance.ts](file://src/hooks/usePerformance.ts#L11-L107)

## Authentication and Authorization

The application implements a robust authentication and authorization system with server-side validation to prevent client-side tampering.

### useAdminAuth Hook

The `useAdminAuth` hook provides role-based access control with server-side validation:

```mermaid
sequenceDiagram
participant Client
participant SupabaseAuth
participant AdminCheckFunction
participant Server
Client->>SupabaseAuth : Get session
SupabaseAuth-->>Client : Return session
Client->>AdminCheckFunction : Invoke admin-check with JWT
AdminCheckFunction->>Server : Validate admin status
Server-->>AdminCheckFunction : Return isAdmin status
AdminCheckFunction-->>Client : Return admin status
Client->>Client : Update isAdmin state
```

The hook implements several security features:
- Server-side admin validation using Supabase Edge Functions
- JWT token verification in the Authorization header
- Protection against client-side role manipulation
- Manual re-check capability for dynamic role changes
- Comprehensive error handling for network and authentication issues

**Diagram sources**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L5-L47)

**Section sources**
- [useAdminAuth.ts](file://src/hooks/useAdminAuth.ts#L5-L47)

## Hook Composition Examples

The application demonstrates effective hook composition in several key pages, combining multiple hooks to create complex functionality.

### QuoteGenerator Page

The QuoteGenerator page combines several hooks to create an AI-powered quote generation experience:

```mermaid
flowchart TD
A[QuoteGenerator] --> B[useConversation]
A --> C[useQuotes]
A --> D[useCreateQuote]
A --> E[useToast]
B --> F[Manage conversation state]
C --> G[Fetch existing quotes]
D --> H[Create new quote]
E --> I[Display success/error messages]
F --> J[ConversationalQuoteBuilder]
G --> J
H --> J
I --> J
```

**Diagram sources**
- [QuoteGenerator.tsx](file://src/pages/QuoteGenerator.tsx#L1-L42)
- [useConversation.ts](file://src/hooks/useConversation.ts#L32-L177)
- [useQuotes.ts](file://src/hooks/useQuotes.ts#L55-L261)

**Section sources**
- [QuoteGenerator.tsx](file://src/pages/QuoteGenerator.tsx#L1-L42)

### ProductionTracking Page

The ProductionTracking page combines real-time data fetching with state management hooks:

```mermaid
flowchart TD
A[ProductionTracking] --> B[useEffect for data fetching]
A --> C[Supabase Realtime]
A --> D[useState for UI state]
A --> E[useToast for notifications]
B --> F[Fetch user and orders]
B --> G[Fetch orders based on role]
C --> H[Subscribe to production updates]
D --> I[Manage selected order, search, filters]
E --> J[Display error messages]
```

The page implements role-based data access:
- Admins see all orders
- Suppliers see their assigned orders
- Buyers see their own orders
- Real-time updates via Supabase subscriptions

**Diagram sources**
- [ProductionTracking.tsx](file://src/pages/ProductionTracking.tsx#L1-L200)

**Section sources**
- [ProductionTracking.tsx](file://src/pages/ProductionTracking.tsx#L1-L200)

## Error Handling and Loading States

The application implements comprehensive error handling and loading state management across all hooks.

### Global Error Handling Pattern

All data fetching hooks follow a consistent error handling pattern:

```mermaid
flowchart TD
A[Data Fetching Operation] --> B{Success?}
B --> |Yes| C[Return data]
B --> |No| D[Throw error]
D --> E[React Query error boundary]
E --> F[Display toast notification]
F --> G[User feedback]
H[Mutation Operation] --> I{Success?}
H --> |Yes| J[Invalidate queries]
H --> |No| K[Display error toast]
J --> L[Show success toast]
```

Key aspects include:
- Centralized toast notifications using Sonner
- Query invalidation on successful mutations
- Detailed error messages for user feedback
- Console logging for debugging in development

**Section sources**
- [useQuotes.ts](file://src/hooks/useQuotes.ts#L157-L159)
- [useOrders.ts](file://src/hooks/queries/useOrders.ts#L142-L143)
- [useSuppliers.ts](file://src/hooks/useSuppliers.ts#L161-L163)

### Loading State Management

The hooks manage loading states to provide feedback during asynchronous operations:

```mermaid
flowchart TD
A[User Action] --> B[Set loading state]
B --> C[Execute async operation]
C --> D{Success?}
D --> |Yes| E[Update data]
D --> |No| F[Handle error]
E --> G[Reset loading state]
F --> G
G --> H[Update UI]
```

Loading states are exposed through hook return values:
- `isLoading` flag for data fetching hooks
- `isUpdating` flag for mutation hooks
- Skeleton components during initial loading
- Optimistic updates for immediate feedback

## Optimistic Updates

The application implements optimistic updates to enhance user experience by providing immediate feedback before server confirmation.

### useOptimisticUpdate Hook

The `useOptimisticUpdate` hook provides a generic solution for optimistic updates with automatic rollback:

```mermaid
sequenceDiagram
participant User
participant UI
participant Server
User->>UI : Initiate update
UI->>UI : Optimistically update UI
UI->>Server : Send update request
alt Success
Server-->>UI : Confirm update
UI->>User : Show success
else Failure
Server-->>UI : Reject update
UI->>UI : Rollback to previous state
UI->>User : Show error
end
```

The hook implements the following pattern:
1. Store the current value as the rollback point
2. Optimistically update the UI with the new value
3. Attempt the server update
4. On success: keep the optimistic update
5. On failure: revert to the previous value and show an error

**Section sources**
- [useOptimisticUpdate.ts](file://src/hooks/useOptimisticUpdate.ts#L16-L74)

### Specialized Optimistic Update Hooks

The application includes specialized hooks for specific use cases:

```mermaid
classDiagram
class useOptimisticUpdate {
+value : T
+isUpdating : boolean
+update(newValue : T) : Promise~void~
+reset() : void
}
class useOptimisticStageUpdate {
+data : any
+isUpdating : boolean
+updateStage(updates : Partial~any~) : Promise~void~
}
class useOptimisticOrderUpdate {
+order : any
+isUpdating : boolean
+updateOrder(updates : Partial~any~) : Promise~void~
}
useOptimisticStageUpdate --|> useOptimisticUpdate : "specialization"
useOptimisticOrderUpdate --|> useOptimisticUpdate : "specialization"
```

These specialized hooks provide domain-specific functionality while maintaining the core optimistic update pattern.

**Diagram sources**
- [useOptimisticUpdate.ts](file://src/hooks/useOptimisticUpdate.ts#L79-L176)

**Section sources**
- [useOptimisticUpdate.ts](file://src/hooks/useOptimisticUpdate.ts#L79-L176)

## Testing Strategies

The application implements comprehensive testing for its hooks, ensuring reliability and maintainability.

### useAdminAuth Test Suite

The `useAdminAuth.test.ts` file demonstrates a comprehensive testing strategy for authentication hooks:

```mermaid
flowchart TD
A[Test Suite] --> B[Admin Status Check]
A --> C[Session Validation]
A --> D[Re-check Admin Status]
A --> E[Edge Cases]
A --> F[Security]
B --> G[Valid admin user returns isAdmin true]
B --> H[Non-admin user returns isAdmin false]
B --> I[No session returns isAdmin false]
B --> J[Handles admin check errors]
C --> K[Handles expired sessions]
C --> L[Handles network errors]
D --> M[Allows manual re-check]
E --> N[Handles null user]
E --> O[Handles malformed responses]
E --> P[Handles concurrent checks]
E --> Q[Handles session errors]
F --> R[Uses server-side validation]
F --> S[Does not trust client-side admin flags]
```

The test suite includes:
- Happy path testing for valid scenarios
- Error handling for various failure modes
- Edge case testing for unusual conditions
- Security testing to prevent client-side manipulation
- Mocking of Supabase client and functions
- Use of Vitest and React Testing Library

**Section sources**
- [useAdminAuth.test.ts](file://src/hooks/__tests__/useAdminAuth.test.ts#L20-L381)

### Testing Best Practices

The application follows several testing best practices:

1. **Comprehensive Coverage**: Tests cover all major functionality and edge cases
2. **Mocking**: External dependencies are properly mocked
3. **Isolation**: Tests are isolated and don't depend on external state
4. **Realistic Scenarios**: Tests simulate real user interactions
5. **Error Handling**: Tests verify proper error handling and recovery
6. **Security**: Tests verify security constraints are enforced

## Conclusion

The hooks system in this application provides a robust foundation for reusable logic and data management. By leveraging React Query for data fetching, implementing proper error handling and loading states, and following best practices for state management, the hooks enable a consistent and reliable user experience across the application.

Key strengths of the implementation include:
- Modular organization with clear separation of concerns
- Comprehensive type safety with TypeScript
- Efficient data caching and synchronization
- Robust error handling and user feedback
- Optimistic updates for improved UX
- Comprehensive testing strategy
- Security-focused authentication with server-side validation

The hooks are designed to be composable, allowing developers to combine them in various ways to create complex functionality while maintaining code readability and maintainability. This approach enables rapid development of new features while ensuring consistency and reliability across the application.