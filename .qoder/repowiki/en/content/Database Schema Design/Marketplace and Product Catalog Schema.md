# Marketplace and Product Catalog Schema

<cite>
**Referenced Files in This Document**
- [marketplace.ts](file://src/types/marketplace.ts)
- [database.ts](file://src/types/database.ts)
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql)
- [20250122010000_setup_product_images_storage.sql](file://supabase/migrations/20250122010000_setup_product_images_storage.sql)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts)
- [useProducts.ts](file://src/hooks/useProducts.ts)
- [Marketplace.tsx](file://src/pages/Marketplace.tsx)
- [ProductDetail.tsx](file://src/pages/ProductDetail.tsx)
- [imageOptimizer.ts](file://src/lib/imageOptimizer.ts)
- [mediaGallery.ts](file://src/lib/mediaGallery.ts)
- [ProductEngagementMetrics.tsx](file://src/components/admin/ProductEngagementMetrics.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture Overview](#system-architecture-overview)
3. [Core Entity Relationships](#core-entity-relationships)
4. [Product Data Model](#product-data-model)
5. [Supplier Management](#supplier-management)
6. [Product Lifecycle Workflow](#product-lifecycle-workflow)
7. [Image Storage and Media Management](#image-storage-and-media-management)
8. [Search and Filtering System](#search-and-filtering-system)
9. [Analytics and Engagement Tracking](#analytics-and-engagement-tracking)
10. [Performance Optimization Strategies](#performance-optimization-strategies)
11. [Data Access Patterns](#data-access-patterns)
12. [Constraints and Validation Rules](#constraints-and-validation-rules)
13. [Conclusion](#conclusion)

## Introduction

The LoopTrace™ Marketplace and Product Catalog system is a comprehensive B2B e-commerce platform designed for textile manufacturers, suppliers, and buyers. The system manages product listings, supplier relationships, inventory management, and marketplace operations with sophisticated data modeling and performance optimization.

This documentation covers the complete data schema, entity relationships, business workflows, and technical implementation details that power the marketplace ecosystem.

## System Architecture Overview

The marketplace system follows a modern cloud-native architecture built on Supabase, featuring:

```mermaid
graph TB
subgraph "Frontend Layer"
UI[React UI Components]
Hooks[Custom Hooks]
Pages[Page Components]
end
subgraph "Backend Layer"
Supabase[Supabase Platform]
Functions[Edge Functions]
Storage[Object Storage]
end
subgraph "Database Layer"
Postgres[PostgreSQL Database]
Tables[Core Tables]
Indexes[Indexes & Constraints]
end
UI --> Hooks
Hooks --> Supabase
Supabase --> Postgres
Storage --> Postgres
Functions --> Postgres
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L1-L532)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L1-L528)

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L1-L532)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L1-L528)

## Core Entity Relationships

The marketplace system consists of several interconnected entities that define the product catalog ecosystem:

```mermaid
erDiagram
SUPPLIERS {
uuid id PK
uuid user_id FK
string company_name
string contact_name
string email
string phone
string country
text_array specialties
text_array certifications
enum verification_status
decimal rating
integer total_orders
decimal on_time_delivery_rate
decimal quality_rating
timestamp created_at
timestamp updated_at
}
MARKETPLACE_PRODUCTS {
uuid id PK
uuid supplier_id FK
string product_type
string title
text description
string category
string subcategory
string slug
decimal base_price
decimal platform_fee_percentage
decimal platform_fee_amount
decimal final_price
integer available_quantity
integer moq
string unit
integer reserved_quantity
text_array images
string primary_image
string video_url
text_array sizes
text_array colors
string material
integer gsm
string fabric_composition
jsonb specifications
integer lead_time_days
string shipping_from
decimal shipping_weight_kg
enum status
string rejection_reason
text admin_feedback
integer quality_score
timestamp approval_date
uuid approved_by FK
integer views
integer inquiries
integer sales
decimal rating
text_array meta_keywords
text meta_description
boolean is_featured
timestamp featured_until
timestamp created_at
timestamp updated_at
timestamp published_at
}
PRODUCT_CATEGORIES {
uuid id PK
string name
string slug
text description
uuid parent_category_id FK
string icon_name
integer display_order
boolean is_active
timestamp created_at
}
PRODUCT_INQUIRIES {
uuid id PK
uuid product_id FK
uuid buyer_id FK
integer quantity
text message
enum status
decimal quoted_price
text quote_notes
text supplier_response
timestamp responded_at
timestamp expires_at
timestamp created_at
timestamp updated_at
}
PRODUCT_APPROVAL_LOG {
uuid id PK
uuid product_id FK
uuid admin_id FK
enum action
text reason
text feedback
string previous_status
string new_status
timestamp created_at
}
PRODUCT_ANALYTICS {
uuid id PK
uuid product_id FK
date date
integer views
integer unique_viewers
integer inquiries
integer add_to_wishlist
integer shares
timestamp created_at
}
PRODUCT_WISHLIST {
uuid id PK
uuid user_id FK
uuid product_id FK
timestamp created_at
}
SUPPLIERS ||--o{ MARKETPLACE_PRODUCTS : "lists"
SUPPLIERS ||--o{ PRODUCT_APPROVAL_LOG : "approves"
MARKETPLACE_PRODUCTS ||--o{ PRODUCT_INQUIRIES : "receives"
MARKETPLACE_PRODUCTS ||--o{ PRODUCT_ANALYTICS : "generates"
MARKETPLACE_PRODUCTS ||--o{ PRODUCT_WISHLIST : "added_to"
PRODUCT_CATEGORIES ||--o{ MARKETPLACE_PRODUCTS : "categorizes"
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L42-L241)
- [marketplace.ts](file://src/types/marketplace.ts#L42-L118)

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L42-L241)
- [marketplace.ts](file://src/types/marketplace.ts#L42-L118)

## Product Data Model

The `MARKETPLACE_PRODUCTS` table serves as the central entity for product information, containing comprehensive attributes for textile and apparel products:

### Core Product Attributes

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Unique product identifier | Primary Key |
| `supplier_id` | UUID | Reference to supplier | Foreign Key, Not Null |
| `product_type` | TEXT | Product classification | Not Null |
| `title` | TEXT | Product display name | Not Null |
| `description` | TEXT | Detailed product description | Nullable |
| `category` | TEXT | Product category | Not Null |
| `subcategory` | TEXT | Specific product type | Nullable |

### Pricing and Inventory Management

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `base_price` | DECIMAL(10,2) | Supplier's selling price | Not Null |
| `platform_fee_percentage` | DECIMAL(5,2) | Platform commission rate | 10.00% |
| `platform_fee_amount` | DECIMAL(10,2) | Calculated platform fee | Generated |
| `final_price` | DECIMAL(10,2) | Total price including fees | Generated |
| `available_quantity` | INTEGER | Current stock level | 0 |
| `moq` | INTEGER | Minimum order quantity | 50 |
| `unit` | TEXT | Measurement unit | 'pieces' |
| `reserved_quantity` | INTEGER | Reserved for pending orders | 0 |

### Media and Specifications

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `images` | TEXT[] | Array of image URLs | Default: '{}' |
| `primary_image` | TEXT | Main product image | Nullable |
| `video_url` | TEXT | Product demonstration video | Nullable |
| `sizes` | TEXT[] | Available size options | Default: '{}' |
| `colors` | TEXT[] | Available color options | Default: '{}' |
| `material` | TEXT | Fabric material composition | Nullable |
| `gsm` | INTEGER | Grams per square meter | Nullable |
| `fabric_composition` | TEXT | Material blend percentages | Nullable |
| `specifications` | JSONB | Flexible specification data | Default: '{}' |

### Logistics and Compliance

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `lead_time_days` | INTEGER | Production and shipping time | 0 |
| `shipping_from` | TEXT | Origin location | Nullable |
| `shipping_weight_kg` | DECIMAL(10,2) | Product weight for shipping | Nullable |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L42-L118)
- [marketplace.ts](file://src/types/marketplace.ts#L42-L118)

## Supplier Management

The supplier system manages manufacturer relationships and product listing capabilities:

### Supplier Categories and Subcategories

The system supports multiple supplier types with specialized subcategories:

```mermaid
graph TD
MANUFACTURER[Manufacturer] --> KNIT[knit_manufacturer]
MANUFACTURER --> WOVEN[woven_manufacturer]
MANUFACTURER --> DENIM[denim_specialist]
MANUFACTURER --> ACTIVE[activewear_sportswear]
MANUFACTURER --> UNIFORM[uniforms_corporate]
MATERIAL[MATERIAL_SUPPLIER] --> TEXTILE[textile_mill]
MATERIAL --> DYING[dyeing_mill]
MATERIAL --> YARN[yarn_supplier]
STOCK[STOCK_LOT_SELLER] --> SAMPLE[sample_collection]
STOCK --> WHOLESALE[wholesale_reseller]
STOCK --> RETAIL[retail_ready_products]
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L20-L36)
- [marketplace.ts](file://src/types/marketplace.ts#L8-L22)

### Supplier Performance Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| `approval_rating` | Percentage of approved products | (Approved / Submitted) × 100 |
| `total_products_listed` | Total products submitted | COUNT(products) |
| `active_products` | Currently approved products | COUNT(approved_products) |
| `product_listing_tier` | Premium status level | 'basic' \| 'premium' \| 'featured' |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L10-L18)
- [marketplace.ts](file://src/types/marketplace.ts#L8-L22)

## Product Lifecycle Workflow

The product approval and publishing workflow ensures quality control and marketplace readiness:

```mermaid
stateDiagram-v2
[*] --> draft
draft --> pending_approval : Submit for Approval
pending_approval --> approved : Admin Approval
pending_approval --> rejected : Admin Rejection
rejected --> draft : Revision Requested
draft --> archived : Archive
approved --> sold_out : Out of Stock
approved --> archived : Archive
sold_out --> approved : Restock
archived --> [*]
note right of approved : Published to Marketplace
note right of rejected : Feedback Provided
note right of archived : Removed from Marketplace
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L89-L95)
- [marketplace.ts](file://src/types/marketplace.ts#L24-L30)

### Status Transitions and Validation

| From Status | To Status | Admin Action | Required Fields |
|-------------|-----------|--------------|-----------------|
| `draft` | `pending_approval` | Submit for Review | All mandatory fields validated |
| `pending_approval` | `approved` | Approve Product | None |
| `pending_approval` | `rejected` | Reject with Reason | Rejection reason required |
| `rejected` | `draft` | Revision Requested | None |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L89-L95)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L345-L438)

## Image Storage and Media Management

The system implements a sophisticated image management architecture optimized for performance and scalability:

### Storage Architecture

```mermaid
graph TB
subgraph "Storage Layer"
Bucket[product-images Bucket]
Policies[Access Policies]
Cleanup[Auto-Cleanup Triggers]
end
subgraph "Processing Layer"
Upload[Image Upload]
Validate[Validation Rules]
Optimize[Optimization Pipeline]
end
subgraph "Application Layer"
Frontend[Frontend Upload]
CDN[CDN Delivery]
Lazy[Lazy Loading]
end
Frontend --> Upload
Upload --> Validate
Validate --> Optimize
Optimize --> Bucket
Bucket --> CDN
CDN --> Lazy
Policies --> Bucket
Cleanup --> Bucket
```

**Diagram sources**
- [20250122010000_setup_product_images_storage.sql](file://supabase/migrations/20250122010000_setup_product_images_storage.sql#L12-L169)
- [imageOptimizer.ts](file://src/lib/imageOptimizer.ts#L1-L74)

### Image Requirements and Constraints

| Requirement | Value | Purpose |
|-------------|-------|---------|
| Max File Size | 5MB | Performance optimization |
| Allowed Formats | JPEG, PNG, WebP, GIF | Browser compatibility |
| Max Images Per Product | 10 | Organization and performance |
| Minimum Dimensions | 800×800px | Quality assurance |
| Recommended Ratio | 1:1 | Visual consistency |

### Storage Policies and Security

The system implements role-based access controls for image management:

| Role | Permissions | Scope |
|------|-------------|-------|
| Supplier | Upload, Update, Delete own images | Only for products they own |
| Admin | Full management rights | All products |
| Public | Read access | All approved products |

**Section sources**
- [20250122010000_setup_product_images_storage.sql](file://supabase/migrations/20250122010000_setup_product_images_storage.sql#L12-L169)
- [imageOptimizer.ts](file://src/lib/imageOptimizer.ts#L1-L74)

## Search and Filtering System

The marketplace implements a comprehensive search and filtering system optimized for performance:

### Search Implementation

```mermaid
flowchart TD
Query[Search Query] --> Parse[Parse Query]
Parse --> FullText[Full-Text Search]
Parse --> Filters[Apply Filters]
FullText --> Rank[Relevance Ranking]
Filters --> Rank
Rank --> Results[Filtered Results]
Results --> Cache[Response Cache]
Cache --> Return[Return to Client]
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L420-L469)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L34-L110)

### Search Filters and Performance

| Filter Type | Implementation | Performance Impact |
|-------------|----------------|-------------------|
| Text Search | Full-text indexing | O(log n) |
| Category Filter | Indexed column | O(log n) |
| Price Range | Numeric comparison | O(log n) |
| Availability | Boolean flag | O(log n) |
| Featured | Boolean flag | O(log n) |

### Advanced Filtering Options

| Filter | Type | Example Values |
|--------|------|----------------|
| `minPrice` | Decimal | 10.50, 100.00 |
| `maxPrice` | Decimal | 1000.00, 5000.00 |
| `minMoq` | Integer | 50, 100 |
| `maxMoq` | Integer | 1000, 5000 |
| `inStock` | Boolean | true, false |
| `featured` | Boolean | true, false |
| `location` | String | Bangladesh, China |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L420-L469)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L34-L110)

## Analytics and Engagement Tracking

The system provides comprehensive analytics for product performance and user engagement:

### Engagement Metrics

```mermaid
graph LR
Product[Product] --> Views[View Tracking]
Product --> Inquiries[Inquiry Tracking]
Product --> Sales[Sales Tracking]
Product --> Ratings[Rating System]
Views --> Analytics[Daily Analytics]
Inquiries --> Analytics
Sales --> Analytics
Ratings --> Analytics
Analytics --> Insights[Business Insights]
Analytics --> Reporting[Admin Reports]
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L188-L205)
- [ProductEngagementMetrics.tsx](file://src/components/admin/ProductEngagementMetrics.tsx#L1-L118)

### Analytics Data Model

| Table | Purpose | Key Metrics |
|-------|---------|-------------|
| `product_analytics` | Daily engagement tracking | Views, unique viewers, inquiries |
| `product_inquiries` | Inquiry management | Quantity, status, response time |
| `product_approval_log` | Approval tracking | Timing, decisions, feedback |

### Performance Monitoring

| Metric | Purpose | Update Frequency |
|--------|---------|------------------|
| Page Views | Traffic analysis | Real-time |
| Unique Visitors | Audience measurement | Real-time |
| Inquiry Rate | Conversion tracking | Real-time |
| Approval Rate | Quality assessment | Daily |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L188-L205)
- [ProductEngagementMetrics.tsx](file://src/components/admin/ProductEngagementMetrics.tsx#L1-L118)

## Performance Optimization Strategies

The marketplace implements multiple optimization strategies for efficient data access and processing:

### Database Optimization

```mermaid
graph TB
subgraph "Indexing Strategy"
Primary[Primary Keys]
Composite[Composite Indexes]
GIN[GIN Indexes]
Functional[Functional Indexes]
end
subgraph "Query Optimization"
Caching[Response Caching]
Pagination[Pagination]
Limit[Result Limits]
Timeout[Query Timeouts]
end
subgraph "Storage Optimization"
Compression[Data Compression]
Partitioning[Table Partitioning]
Archiving[Data Archiving]
end
Primary --> Caching
Composite --> Pagination
GIN --> Limit
Functional --> Timeout
```

**Diagram sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L120-L127)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L144-L149)

### Caching Strategy

| Cache Type | TTL | Scope | Purpose |
|------------|-----|-------|---------|
| Product Lists | 10 minutes | Public | Reduce database load |
| Product Details | 5 minutes | Authenticated | Improve UX |
| Categories | 30 minutes | Public | Static data |
| Analytics | 15 minutes | Admin | Real-time insights |

### Image Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| Lazy Loading | Intersection Observer | Faster initial load |
| Responsive Images | Srcset & Sizes | Optimal bandwidth |
| WebP Support | Feature detection | Reduced file size |
| CDN Delivery | Supabase Storage | Global performance |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L120-L127)
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L144-L149)
- [imageOptimizer.ts](file://src/lib/imageOptimizer.ts#L1-L74)

## Data Access Patterns

The marketplace implements efficient data access patterns optimized for different use cases:

### Query Patterns

```mermaid
sequenceDiagram
participant Client as Client Application
participant Hook as Custom Hook
participant Supabase as Supabase API
participant DB as PostgreSQL Database
Client->>Hook : Request Products
Hook->>Supabase : Execute Query
Supabase->>DB : Database Query
DB-->>Supabase : Query Results
Supabase-->>Hook : Formatted Data
Hook-->>Client : React Query Response
Note over Client,DB : Caching and Optimization Applied
```

**Diagram sources**
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L34-L110)
- [useProducts.ts](file://src/hooks/useProducts.ts#L55-L131)

### Common Access Patterns

| Pattern | Use Case | Optimization |
|---------|----------|--------------|
| Product Listing | Marketplace browsing | Paginated, cached |
| Product Detail | Single product view | Optimized joins |
| Search Results | Filtered browsing | Full-text search |
| Supplier Products | Supplier dashboard | Authenticated queries |
| Admin Approval | Moderation | Role-based filtering |

### Error Handling and Resilience

| Scenario | Response Strategy | Recovery Method |
|----------|------------------|-----------------|
| Database Timeout | Return cached data | Retry with exponential backoff |
| Network Failure | Offline mode | Local storage fallback |
| Rate Limiting | Throttled requests | Queue management |
| Data Validation | Graceful degradation | Partial results |

**Section sources**
- [useMarketplace.ts](file://src/hooks/useMarketplace.ts#L34-L110)
- [useProducts.ts](file://src/hooks/useProducts.ts#L55-L131)

## Constraints and Validation Rules

The system enforces comprehensive data integrity through database constraints and application-level validation:

### Database Constraints

| Constraint Type | Purpose | Implementation |
|----------------|---------|----------------|
| Primary Keys | Uniqueness | UUID generation |
| Foreign Keys | Referential Integrity | Cascade deletion |
| Check Constraints | Data Validation | Price > 0, Quantity ≥ 0 |
| Unique Constraints | Business Rules | Slug uniqueness |

### Business Rules

| Rule | Validation | Error Handling |
|------|------------|----------------|
| Positive Pricing | `base_price > 0` | Price validation error |
| Non-negative Inventory | `available_quantity >= 0` | Inventory constraint |
| Image Requirements | Size, format, count limits | Upload validation |
| Category Existence | Reference validation | Category not found |

### Security Constraints

| Security Layer | Implementation | Purpose |
|----------------|----------------|---------|
| Row Level Security | Supabase RLS | Data isolation |
| Authentication | JWT tokens | User identity |
| Authorization | Role-based access | Permission checking |
| Input Sanitization | Parameter validation | SQL injection prevention |

**Section sources**
- [20250122000000_create_marketplace_system.sql](file://supabase/migrations/20250122000000_create_marketplace_system.sql#L115-L118)
- [20250122010000_setup_product_images_storage.sql](file://supabase/migrations/20250122010000_setup_product_images_storage.sql#L102-L122)

## Conclusion

The LoopTrace™ Marketplace and Product Catalog system represents a sophisticated B2B e-commerce platform with robust data modeling, comprehensive business workflows, and performance-optimized architecture. The system successfully balances functionality, scalability, and user experience through:

- **Comprehensive Entity Modeling**: Well-defined relationships between products, suppliers, categories, and media
- **Sophisticated Workflow Management**: Structured product approval and lifecycle management
- **Performance-Optimized Architecture**: Efficient indexing, caching, and query patterns
- **Security and Data Integrity**: Robust constraints and access control mechanisms
- **Scalable Media Management**: Optimized image storage and delivery systems

The modular design enables future enhancements while maintaining system stability and performance. The combination of Supabase's managed infrastructure with custom React components provides a solid foundation for marketplace operations and growth.