# Utility and Shared Functions API

<cite>
**Referenced Files in This Document**   
- [_shared/logger.ts](file://supabase/functions/_shared/logger.ts)
- [health/index.ts](file://supabase/functions/health/index.ts)
- [bootstrap-admin/index.ts](file://supabase/functions/bootstrap-admin/index.ts)
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts)
- [wishlist-add/index.ts](file://supabase/functions/wishlist-add/index.ts)
- [wishlist-get/index.ts](file://supabase/functions/wishlist-get/index.ts)
- [wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts)
- [wishlist-remove/index.ts](file://supabase/functions/wishlist-remove/index.ts)
- [useWishlist.ts](file://src/hooks/useWishlist.ts)
- [Health.tsx](file://src/pages/Health.tsx)
- [SystemHealthCheck.tsx](file://src/components/SystemHealthCheck.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Centralized Logging Utility](#centralized-logging-utility)
3. [Health Check Endpoint](#health-check-endpoint)
4. [Bootstrap Admin Function](#bootstrap-admin-function)
5. [Batch Processor Function](#batch-processor-function)
6. [Wishlist Management Functions](#wishlist-management-functions)
7. [Frontend Integration Examples](#frontend-integration-examples)
8. [Performance and Error Handling](#performance-and-error-handling)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive documentation for the utility and shared serverless functions in the sleekapp-v100 application. The documented functions include the centralized logging utility, health check endpoint, bootstrap admin function, batch processor, and wishlist management functions. These components form the backbone of the application's operational integrity, security, and user experience. The documentation covers endpoints, request/response formats, authentication requirements, usage patterns, and integration examples to ensure proper implementation and maintenance.

## Centralized Logging Utility

The centralized logging utility in `_shared/logger.ts` provides structured JSON logging with PII (Personally Identifiable Information) sanitization capabilities. This ensures sensitive data is redacted from logs while maintaining debuggability.

The Logger class supports multiple log levels including INFO, WARN, ERROR, and SUCCESS, each producing standardized JSON output with timestamp, context, message, and sanitized data. The utility automatically sanitizes known PII fields such as email addresses, phone numbers, order IDs, passwords, tokens, and secrets according to predefined patterns.

Email addresses are sanitized to show only the first three characters and domain (e.g., john.doe@example.com becomes joh***@example.com). Phone numbers display only the first four and last two digits (e.g., +8801234567890 becomes +880****90). Order IDs show only the first eight characters followed by asterisks.

The logging utility is designed for integration with monitoring tools that can parse structured JSON logs, enabling efficient log aggregation, searching, and alerting. Each log entry includes a context parameter that identifies the source function, facilitating traceability across distributed systems.

**Section sources**
- [_shared/logger.ts](file://supabase/functions/_shared/logger.ts#L1-L173)

## Health Check Endpoint

The health check endpoint provides a simple system status verification mechanism that returns a standardized response indicating service availability. Accessible via the `/health` route, this endpoint is crucial for deployment monitoring and uptime verification.

The endpoint implements CORS headers to allow cross-origin requests and returns a JSON response with an `ok` boolean flag, timestamp, and service identifier. When functioning properly, it returns a 200 status with `{ ok: true, timestamp: "ISO8601", service: "edge-functions" }`. In case of failure, it returns a 500 status with `{ ok: false, error: "Health check failed" }`.

The health check is designed to be lightweight and fast, making minimal external dependencies to avoid cascading failures. It serves as a canary for the serverless function environment, helping operations teams quickly identify deployment issues or runtime problems.

The frontend includes a Health page that displays application health information including build ID, timestamp, environment, and version, complementing the backend health check with additional client-side context.

**Section sources**
- [health/index.ts](file://supabase/functions/health/index.ts#L1-L34)
- [Health.tsx](file://src/pages/Health.tsx#L1-L32)

## Bootstrap Admin Function

The bootstrap-admin function enables secure initial admin user creation through a token-based authentication mechanism. This idempotent function ensures that only one admin user can be created, enhancing security by preventing unauthorized privilege escalation after initial setup.

The function requires a POST request with email and token parameters. It implements multiple security measures including IP-based rate limiting (maximum 3 attempts per hour), constant-time token comparison to prevent timing attacks, and verification that no existing admin users are present before assignment.

Authentication is performed using Supabase's service role key, allowing the function to interact with the authentication system at an administrative level. Upon successful validation, the function assigns the 'admin' role to the specified user in the user_roles table and logs the operation in the bootstrap_attempts table for audit purposes.

The function is designed to be used only during initial application setup, after which it becomes inactive due to the presence of an existing admin account. This prevents ongoing exposure of the bootstrap mechanism while ensuring the system can be properly initialized.

**Section sources**
- [bootstrap-admin/index.ts](file://supabase/functions/bootstrap-admin/index.ts#L1-L178)

## Batch Processor Function

The batch-processor function handles bulk operations for production batch orchestration and order processing. It supports two job types: 'orchestrate' for batch management and 'process-order' for individual order handling.

The orchestration functionality monitors production batches in 'filling' status and applies business rules based on fill percentage and time windows. Batches with 75% or higher fill rate are automatically confirmed and converted to supplier orders. Batches with 50-74% fill rate when their window closes require administrative review, while those below 50% are cancelled with appropriate order refunds.

For order processing, the function first attempts to add the order to an existing compatible batch based on product category, style count, and quantity constraints. If no suitable batch exists, it creates a new batch by selecting the optimal supplier based on MOQ (Minimum Order Quantity), pricing, and lead time.

The function implements atomic operations through Supabase transactions, ensuring data consistency across related tables including production_batches, batch_contributions, and orders. Error handling is comprehensive, with detailed logging and appropriate HTTP status codes returned for various failure scenarios.

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L1-L346)

## Wishlist Management Functions

The wishlist system consists of four serverless functions that provide complete CRUD operations for user wishlists: wishlist-add, wishlist-get, wishlist-check, and wishlist-remove.

### Add to Wishlist
The wishlist-add function adds a product to the authenticated user's wishlist. It performs authentication validation, rate limiting (100 adds per hour), product existence verification, and uses a UNIQUE constraint to handle duplicates idempotently. The function returns appropriate messages for new additions, duplicates, or errors.

### Get Wishlist
The wishlist-get function retrieves all items in the user's wishlist with full product details. It joins the wishlists table with the products table to provide comprehensive information including title, description, price, image URL, category, MOQ, lead time, colors, and materials. Results are ordered by creation date in descending order.

### Check Wishlist Status
The wishlist-check function provides bulk verification of multiple products' wishlist status. It accepts an array of product IDs and returns a map indicating whether each product is wishlisted. This optimization reduces client-server round trips when rendering product listings with wishlist indicators.

### Remove from Wishlist
The wishlist-remove function deletes a product from the user's wishlist. It validates authentication and the required productId parameter before performing the deletion operation.

All wishlist functions implement proper authentication using Supabase's getUser method and respect RLS (Row Level Security) policies that restrict access to user-owned data.

**Section sources**
- [wishlist-add/index.ts](file://supabase/functions/wishlist-add/index.ts#L1-L121)
- [wishlist-get/index.ts](file://supabase/functions/wishlist-get/index.ts#L1-L85)
- [wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L1-L78)
- [wishlist-remove/index.ts](file://supabase/functions/wishlist-remove/index.ts#L1-L72)

## Frontend Integration Examples

The useWishlist hook in `useWishlist.ts` demonstrates how the wishlist functions are integrated into the frontend application. This custom React hook provides a clean interface for wishlist operations with optimistic UI updates and error recovery.

The hook maintains local state for wishlisted products and count, synchronizing with the server through the wishlist-get function on mount and authentication changes. It implements optimistic updates for add and remove operations, immediately reflecting changes in the UI while awaiting server confirmation. If an operation fails, the hook reverts the local state to maintain consistency.

Key functions include:
- `addToWishlist(productId)`: Adds a product with optimistic update
- `removeFromWishlist(productId)`: Removes a product with optimistic update
- `toggleWishlist(productId)`: Toggles the wishlist status
- `isWishlisted(productId)`: Checks if a product is in the wishlist

The SystemHealthCheck component shows how health monitoring is implemented in the UI, providing a diagnostic interface that can run comprehensive system checks and generate reports for troubleshooting.

**Section sources**
- [useWishlist.ts](file://src/hooks/useWishlist.ts#L1-L132)
- [SystemHealthCheck.tsx](file://src/components/SystemHealthCheck.tsx#L1-L101)

## Performance and Error Handling

The documented functions implement comprehensive performance considerations and error recovery strategies. The logger utility ensures PII sanitization without significant performance overhead through efficient string operations and minimal processing.

The batch processor handles large datasets through batched operations and optimized database queries with appropriate indexes. It manages timeouts by breaking operations into discrete steps and implementing proper error boundaries to prevent cascading failures.

Rate limiting is implemented across critical functions to prevent abuse: 3 attempts per hour for bootstrap-admin and 100 adds per hour for wishlist operations. These limits are enforced through dedicated database tables with time-window tracking.

Error recovery strategies include:
- Optimistic updates with rollback capability in the frontend
- Comprehensive logging with structured error information
- Idempotent operations to prevent duplicate processing
- Atomic transactions for data consistency
- Graceful degradation when non-critical functions fail

Monitoring is facilitated through structured JSON logs that can be ingested by external tools, and the health check endpoint provides a reliable indicator of system status for deployment pipelines and uptime monitoring.

**Section sources**
- [_shared/logger.ts](file://supabase/functions/_shared/logger.ts#L1-L173)
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L1-L346)
- [useWishlist.ts](file://src/hooks/useWishlist.ts#L1-L132)

## Conclusion
The utility and shared functions in sleekapp-v100 provide essential capabilities for system operation, security, and user experience. The centralized logging utility ensures secure and structured diagnostics, while the health check endpoint enables reliable system monitoring. The bootstrap-admin function provides secure initial setup, and the batch processor handles complex bulk operations with atomicity and consistency. The wishlist management functions offer a complete set of operations for user engagement, with efficient frontend integration through the useWishlist hook. Together, these components form a robust foundation for the application's serverless architecture, with attention to performance, security, and maintainability.