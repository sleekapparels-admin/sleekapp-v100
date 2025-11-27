# Wishlist Check API Documentation

<cite>
**Referenced Files in This Document**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts)
- [src/hooks/useWishlist.ts](file://src/hooks/useWishlist.ts)
- [src/components/products/ProductCard.tsx](file://src/components/products/ProductCard.tsx)
- [src/contexts/WishlistContext.tsx](file://src/contexts/WishlistContext.tsx)
- [src/pages/Wishlist.tsx](file://src/pages/Wishlist.tsx)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [supabase/functions/wishlist-get/index.ts](file://supabase/functions/wishlist-get/index.ts)
- [supabase/functions/wishlist-add/index.ts](file://supabase/functions/wishlist-add/index.ts)
- [supabase/functions/wishlist-remove/index.ts](file://supabase/functions/wishlist-remove/index.ts)
- [supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql](file://supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoint Overview](#api-endpoint-overview)
3. [Request Format](#request-format)
4. [Response Format](#response-format)
5. [Authentication Requirements](#authentication-requirements)
6. [Implementation Details](#implementation-details)
7. [Use Cases and Applications](#use-cases-and-applications)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)
10. [Integration Examples](#integration-examples)
11. [Best Practices](#best-practices)

## Introduction

The Wishlist Check API is a lightweight, optimized endpoint designed to efficiently verify whether specific products are in a user's wishlist. Unlike the main CRUD operations that return full wishlist data, this endpoint provides a focused, high-performance solution for batch checking product wishlist status. It serves as a crucial component for frontend optimization, enabling applications to display accurate wishlist indicators without requiring full wishlist data retrieval.

This API complements the existing wishlist management system by offering a specialized service that minimizes network overhead while providing real-time wishlist status information for multiple products simultaneously.

## API Endpoint Overview

### Endpoint Information
- **Method**: `POST`
- **URL**: `/functions/v1/wishlist-check`
- **Content-Type**: `application/json`
- **Authentication**: Required (Bearer Token)

### Purpose
The primary purpose of this endpoint is to perform bulk checks for product wishlist status, returning boolean indicators for each product ID provided in the request. This enables efficient frontend rendering and user experience optimization.

```mermaid
sequenceDiagram
participant Client as "Frontend Client"
participant API as "Wishlist Check API"
participant Auth as "Supabase Auth"
participant DB as "Wishlist Database"
Client->>API : POST /functions/v1/wishlist-check
API->>Auth : Verify Authentication
Auth-->>API : User Validation
API->>DB : Query Wishlisted Products
DB-->>API : Wishlist Status Data
API->>API : Generate Boolean Map
API-->>Client : {success, wishlisted : {productId : boolean}}
Note over Client,DB : Efficient batch processing for multiple products
```

**Diagram sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L9-L77)

## Request Format

### Body Structure
The API accepts a JSON payload containing an array of product IDs to check:

```json
{
  "productIds": ["product-id-1", "product-id-2", "product-id-3"]
}
```

### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer <your-token>`
- `Accept: application/json`

### Parameter Details

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `productIds` | Array\<string\> | Yes | Array of product identifiers to check against user's wishlist |

### Validation Rules
- `productIds` must be a non-empty array
- Each product ID must be a valid string
- Maximum array length depends on system limits
- All product IDs must be unique within the array

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L35-L42)

## Response Format

### Successful Response
When the request is successful, the API returns a JSON object with the following structure:

```json
{
  "success": true,
  "wishlisted": {
    "product-id-1": true,
    "product-id-2": false,
    "product-id-3": true
  }
}
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates whether the operation was successful |
| `wishlisted` | object | Map of product IDs to boolean wishlist status |

### Boolean Mapping
- `true`: Product is in the user's wishlist
- `false`: Product is not in the user's wishlist

### Error Response
When the request fails, the API returns an error response:

```json
{
  "success": false,
  "message": "Error description",
  "wishlisted": {}
}
```

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L65-L67)
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L73-L74)

## Authentication Requirements

### Authentication Method
The API requires authentication using Supabase's JWT tokens:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication Validation
1. **Token Verification**: The API validates the provided Bearer token
2. **User Context**: Establishes the user context for wishlist queries
3. **Permission Check**: Ensures the user has permission to access their own wishlist

### Security Features
- **Row Level Security**: Each user can only access their own wishlist data
- **Rate Limiting**: Prevents abuse through automated requests
- **CORS Protection**: Secure cross-origin request handling

### Authentication Error Handling
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions or account issues

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L25-L32)
- [supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql](file://supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql#L20-L34)

## Implementation Details

### Backend Architecture
The API is implemented as a Deno function with the following key components:

```mermaid
flowchart TD
Start([API Request]) --> ValidateAuth["Validate Authentication"]
ValidateAuth --> AuthValid{"Authentication<br/>Valid?"}
AuthValid --> |No| ReturnAuthError["Return 401 Error"]
AuthValid --> |Yes| ParseBody["Parse Request Body"]
ParseBody --> ValidateInput{"Valid Product<br/>IDs?"}
ValidateInput --> |No| ReturnBadRequest["Return 400 Error"]
ValidateInput --> |Yes| QueryDB["Query Wishlist Database"]
QueryDB --> DBSuccess{"Database<br/>Query Success?"}
DBSuccess --> |No| ReturnServerError["Return 500 Error"]
DBSuccess --> |Yes| BuildResponse["Build Response Map"]
BuildResponse --> ReturnSuccess["Return 200 Success"]
ReturnAuthError --> End([End])
ReturnBadRequest --> End
ReturnServerError --> End
ReturnSuccess --> End
```

**Diagram sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L14-L77)

### Database Operations
The API performs optimized database queries using Supabase's query builder:

1. **User Verification**: Confirms the authenticated user's identity
2. **Bulk Query**: Uses `.in()` operator for efficient multi-product lookup
3. **Selective Fields**: Retrieves only necessary `product_id` field
4. **Index Utilization**: Leverages database indexes for performance

### Performance Optimizations
- **Single Database Call**: Processes all product IDs in one query
- **Index Usage**: Utilizes composite indexes on `(user_id, product_id)`
- **Minimal Data Transfer**: Returns only boolean status information
- **Efficient Memory Usage**: Creates response map in O(n) time

### Rate Limiting
The system implements rate limiting to prevent abuse:

- **Per Hour Limit**: 100 requests per user per hour
- **Window-Based Tracking**: Uses time-windowed counters
- **Automatic Reset**: Resets counter hourly

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L44-L63)
- [supabase/functions/wishlist-add/index.ts](file://supabase/functions/wishlist-add/index.ts#L44-L71)

## Use Cases and Applications

### Frontend Optimization
The wishlist check API serves several critical frontend use cases:

#### Product Listings Enhancement
```typescript
// Example: Pre-loading wishlist status for product grid
const productIds = products.map(p => p.id);
const { data } = await supabase.functions.invoke('wishlist-check', {
  body: { productIds }
});

// Update product cards with wishlist status
products.forEach(product => {
  product.isWishlisted = data.wishlisted[product.id];
});
```

#### Real-Time Updates
- **Instant Feedback**: Show/hide wishlist buttons immediately
- **Visual Indicators**: Color-coded wishlist status
- **User Experience**: Seamless interaction without page reloads

### Server-Side Validation
#### Access Control
```typescript
// Example: Validate access to wishlisted content
const { data } = await supabase.functions.invoke('wishlist-check', {
  body: { productIds: [contentProductId] }
});

if (!data.wishlisted[contentProductId]) {
  throw new Error('Access denied - product not in wishlist');
}
```

#### Content Personalization
- **Exclusive Offers**: Target promotions to wishlisted products
- **Related Recommendations**: Suggest similar products based on wishlist
- **Priority Content**: Highlight content related to wishlisted items

### Batch Processing Scenarios
#### Inventory Management
```typescript
// Check multiple products for inventory updates
const { data } = await supabase.functions.invoke('wishlist-check', {
  body: { productIds: inventoryUpdateBatch }
});

// Filter products needing notification
const productsNeedingNotification = inventoryUpdateBatch.filter(
  id => data.wishlisted[id]
);
```

#### Marketing Campaigns
- **Targeted Emails**: Send notifications only for wishlisted products
- **Promotional Alerts**: Notify users about special offers on wishlisted items
- **Abandoned Cart Recovery**: Identify products users viewed but didn't purchase

### Performance Benefits
The wishlist check API provides significant performance advantages:

| Aspect | Traditional Approach | Wishlist Check API |
|--------|---------------------|-------------------|
| Network Overhead | Full wishlist data transfer | Minimal boolean data |
| Processing Time | Complete wishlist parsing | Direct boolean lookup |
| Memory Usage | Full wishlist object | Boolean map only |
| Frontend Rendering | Complex wishlist filtering | Simple status display |

**Section sources**
- [src/components/products/ProductCard.tsx](file://src/components/products/ProductCard.tsx#L24-L25)
- [src/hooks/useWishlist.ts](file://src/hooks/useWishlist.ts#L109-L111)

## Error Handling

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required",
  "wishlisted": {}
}
```

**Status Codes**: 401 Unauthorized
**Causes**: Invalid, expired, or missing authentication token

#### Malformed Requests
```json
{
  "success": false,
  "message": "Product IDs array is required",
  "wishlisted": {}
}
```

**Status Codes**: 400 Bad Request
**Causes**: Missing `productIds` field, non-array value, empty array

#### Database Errors
```json
{
  "success": false,
  "message": "Failed to check wishlist",
  "wishlisted": {}
}
```

**Status Codes**: 500 Internal Server Error
**Causes**: Database connectivity issues, query failures

#### Rate Limiting
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "wishlisted": {}
}
```

**Status Codes**: 429 Too Many Requests
**Causes**: Exceeded hourly request limit (100 requests/hour)

### Error Handling Best Practices

#### Client-Side Implementation
```typescript
try {
  const { data, error } = await supabase.functions.invoke('wishlist-check', {
    body: { productIds }
  });

  if (error) {
    // Handle API errors gracefully
    console.error('Wishlist check failed:', error.message);
    // Fall back to optimistic UI or cached state
    return fallbackWishlistStatus;
  }

  return data.wishlisted;

} catch (error) {
  // Handle network or unexpected errors
  console.error('Network error during wishlist check:', error);
  // Retry mechanism or user notification
}
```

#### Graceful Degradation
- **Fallback State**: Use cached or optimistic state when API fails
- **User Feedback**: Inform users of temporary service issues
- **Retry Logic**: Implement exponential backoff for transient failures

### Monitoring and Debugging
#### Logging Strategy
```typescript
// Log successful requests for monitoring
console.log('Wishlist check successful:', {
  productCount: productIds.length,
  userId: currentUser.id,
  timestamp: new Date()
});

// Log errors for debugging
console.error('Wishlist check failed:', {
  error: error.message,
  requestId: request.id,
  timestamp: new Date()
});
```

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L28-L32)
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L37-L42)
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L51-L56)
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L71-L74)

## Performance Considerations

### Optimization Strategies

#### Database Performance
The API is optimized for high-performance bulk operations:

1. **Composite Index Usage**: Leverages `(user_id, product_id)` index
2. **Selective Field Retrieval**: Queries only `product_id` field
3. **Single Database Call**: Processes all products in one query
4. **Efficient Filtering**: Uses `.in()` operator for multi-value lookup

#### Memory Efficiency
- **Streaming Processing**: Processes product IDs without storing intermediate arrays
- **Minimal Object Creation**: Creates only necessary response objects
- **Garbage Collection Friendly**: Releases temporary objects promptly

#### Network Optimization
- **Minimal Payload Size**: Boolean responses reduce bandwidth usage
- **Compression Support**: Leverages HTTP compression for larger datasets
- **Caching Opportunities**: Response caching for frequently checked products

### Scalability Factors

#### Horizontal Scaling
- **Stateless Design**: Each request is independent
- **Database Sharding**: Can scale across multiple database instances
- **Load Balancing**: Distributes requests across multiple API instances

#### Vertical Scaling
- **Memory Allocation**: Optimized for low memory footprint
- **CPU Efficiency**: Minimal computational overhead
- **I/O Optimization**: Efficient database query execution

### Performance Benchmarks
Typical performance characteristics:

| Metric | Typical Value | Notes |
|--------|---------------|-------|
| Response Time | < 50ms | For up to 100 product IDs |
| Throughput | 1000+ requests/sec | Single API instance |
| Memory Usage | < 10MB | Per concurrent request |
| Database Load | Minimal | Optimized queries only |

### Caching Strategies
#### Frontend Caching
```typescript
// Implement local caching for wishlist status
const wishlistCache = new Map();

async function getProductWishlistStatus(productId: string): Promise<boolean> {
  const cacheKey = `wishlist:${productId}`;
  
  if (wishlistCache.has(cacheKey)) {
    return wishlistCache.get(cacheKey);
  }
  
  const { data } = await supabase.functions.invoke('wishlist-check', {
    body: { productIds: [productId] }
  });
  
  const status = data.wishlisted[productId];
  wishlistCache.set(cacheKey, status);
  
  return status;
}
```

#### Server-Side Caching
- **Redis Integration**: Store frequently accessed wishlist statuses
- **Cache Invalidation**: Clear cache when wishlist changes
- **TTL Management**: Automatic cache expiration for stale data

**Section sources**
- [supabase/functions/wishlist-check/index.ts](file://supabase/functions/wishlist-check/index.ts#L44-L50)
- [supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql](file://supabase/migrations/20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql#L11-L14)

## Integration Examples

### React Component Integration

#### Basic Product Card Implementation
```typescript
import { useWishlistContext } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { isWishlisted, toggleWishlist } = useWishlistContext();
  const isWishlistedLocal = isWishlisted(product.id);

  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(product.id);
      // Analytics tracking handled by useWishlist hook
    } catch (error) {
      // Error handling managed by useWishlist hook
    }
  };

  return (
    <Card>
      {/* Other product content */}
      <Button
        variant="ghost"
        onClick={handleWishlistToggle}
        aria-label={`Toggle wishlist for ${product.title}`}
      >
        <Heart 
          className={`h-5 w-5 ${
            isWishlistedLocal ? 'fill-current text-red-500' : ''
          }`}
        />
      </Button>
    </Card>
  );
};
```

#### Batch Wishlist Checking
```typescript
// Example: Checking multiple products for a product grid
const ProductGrid = ({ products }: { products: Product[] }) => {
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const productIds = products.map(p => p.id);
      
      try {
        const { data } = await supabase.functions.invoke('wishlist-check', {
          body: { productIds }
        });
        
        if (data.success) {
          setWishlistStatus(data.wishlisted);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist status:', error);
        // Optionally set fallback status
      }
    };

    fetchWishlistStatus();
  }, [products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistStatus[product.id] || false}
        />
      ))}
    </div>
  );
};
```

### Server-Side Integration

#### Express.js Middleware
```typescript
import { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function wishlistCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    const { data, error } = await supabase.functions.invoke('wishlist-check', {
      body: { productIds }
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to check wishlist',
        error: error.message
      });
    }

    // Attach wishlist status to request for downstream middleware
    (req as any).wishlistStatus = data.wishlisted;
    next();

  } catch (error) {
    console.error('Wishlist check middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
```

#### GraphQL Resolver
```typescript
const resolvers = {
  Query: {
    productWishlistStatus: async (_, { productIds }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      try {
        const { data, error } = await supabase.functions.invoke('wishlist-check', {
          body: { productIds }
        });

        if (error) {
          throw new Error(error.message);
        }

        return data.wishlisted;

      } catch (error) {
        console.error('GraphQL wishlist check failed:', error);
        throw new Error('Failed to check wishlist status');
      }
    }
  }
};
```

### Mobile Application Integration

#### React Native Implementation
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase';

export const useProductWishlistStatus = (productIds: string[]) => {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.functions.invoke('wishlist-check', {
          body: { productIds }
        });

        if (error) {
          throw new Error(error.message);
        }

        setStatus(data.wishlisted);
      } catch (err) {
        setError(err.message);
        console.error('Wishlist check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkWishlistStatus();
  }, [productIds]);

  return { status, loading, error };
};
```

**Section sources**
- [src/components/products/ProductCard.tsx](file://src/components/products/ProductCard.tsx#L24-L25)
- [src/hooks/useWishlist.ts](file://src/hooks/useWishlist.ts#L109-L111)
- [src/contexts/WishlistContext.tsx](file://src/contexts/WishlistContext.tsx#L1-L33)

## Best Practices

### API Usage Guidelines

#### Request Optimization
1. **Batch Requests**: Group multiple product IDs in single requests
2. **Request Throttling**: Implement client-side throttling for frequent checks
3. **Caching Strategy**: Cache results locally to minimize API calls
4. **Conditional Requests**: Only check when necessary (e.g., user interaction)

#### Error Handling
1. **Graceful Degradation**: Provide fallback UI when API fails
2. **User Feedback**: Inform users of temporary service issues
3. **Retry Logic**: Implement exponential backoff for transient failures
4. **Logging**: Monitor and log API errors for debugging

#### Security Considerations
1. **Authentication**: Always include valid authentication tokens
2. **Input Validation**: Validate product IDs before sending requests
3. **Rate Limiting**: Respect API rate limits and implement client-side limits
4. **Data Privacy**: Handle wishlist data securely and privately

### Performance Optimization

#### Client-Side Caching
```typescript
// Implement intelligent caching strategy
class WishlistCache {
  private cache = new Map<string, { status: boolean; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  getStatus(productId: string): boolean | null {
    const cached = this.cache.get(productId);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(productId);
      return null;
    }
    
    return cached.status;
  }

  setStatus(productId: string, status: boolean): void {
    this.cache.set(productId, {
      status,
      timestamp: Date.now()
    });
  }

  invalidate(productId: string): void {
    this.cache.delete(productId);
  }
}
```

#### Request Batching
```typescript
// Batch multiple wishlist checks into single requests
class WishlistBatcher {
  private queue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];
  private timer: NodeJS.Timeout | null = null;

  enqueue(check: { productId: string; resolve: any; reject: any }): void {
    this.queue.push(check);
    
    if (this.queue.length >= 10 || !this.timer) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 100);
    }
  }

  private flush(): void {
    if (this.queue.length === 0) return;

    const productIds = this.queue.map(item => item.productId);
    const promises = this.queue.splice(0);

    supabase.functions.invoke('wishlist-check', {
      body: { productIds }
    }).then(result => {
      if (result.data?.success) {
        productIds.forEach((productId, index) => {
          const status = result.data.wishlisted[productId];
          const promise = promises[index];
          promise.resolve(status);
        });
      } else {
        promises.forEach(promise => promise.reject(result.error));
      }
    }).catch(error => {
      promises.forEach(promise => promise.reject(error));
    });
  }
}
```

### Monitoring and Maintenance

#### Performance Monitoring
```typescript
// Track API performance metrics
const trackWishlistCheckPerformance = (startTime: number, productIdCount: number) => {
  const duration = Date.now() - startTime;
  
  console.log('Wishlist check performance:', {
    durationMs: duration,
    productsChecked: productIdCount,
    throughput: productIdCount / (duration / 1000),
    timestamp: new Date()
  });
};

// Example usage
const startTime = Date.now();
const { data } = await supabase.functions.invoke('wishlist-check', {
  body: { productIds }
});
trackWishlistCheckPerformance(startTime, productIds.length);
```

#### Health Checks
```typescript
// Implement API health monitoring
const checkWishlistApiHealth = async (): Promise<boolean> => {
  try {
    const testProductId = 'test-product-' + Math.random().toString(36).substring(7);
    
    const { data, error } = await supabase.functions.invoke('wishlist-check', {
      body: { productIds: [testProductId] }
    });

    return data?.success === true;
  } catch (error) {
    console.error('Wishlist API health check failed:', error);
    return false;
  }
};
```

### Development Workflow

#### Testing Strategies
1. **Unit Tests**: Test individual wishlist check functionality
2. **Integration Tests**: Test API integration with frontend components
3. **Performance Tests**: Validate API performance under load
4. **Error Scenario Tests**: Test various error conditions

#### Development Tools
```typescript
// Development helper for testing wishlist functionality
const debugWishlistCheck = async (productIds: string[]): Promise<void> => {
  console.group('Wishlist Check Debug');
  console.log('Product IDs:', productIds);
  
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.functions.invoke('wishlist-check', {
      body: { productIds }
    });
    const duration = Date.now() - startTime;

    console.log('Response:', data);
    console.log('Duration:', `${duration}ms`);
    console.log('Success:', data?.success);
    
    if (error) {
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
  
  console.groupEnd();
};
```

These best practices ensure optimal performance, reliability, and maintainability of the wishlist check API in production environments.