# AI Market Research API Documentation

<cite>
**Referenced Files in This Document**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts)
- [src/components/quote/MarketResearchInsights.tsx](file://src/components/quote/MarketResearchInsights.tsx)
- [src/components/quote/ConversationalQuoteBuilder.tsx](file://src/components/quote/ConversationalQuoteBuilder.tsx)
- [supabase/migrations/20251124164837_4eda3cf0-ab6f-4305-a5fe-82a19c7948d3.sql](file://supabase/migrations/20251124164837_4eda3cf0-ab6f-4305-a5fe-82a19c7948d3.sql)
- [supabase/functions/ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)
- [src/pages/QuoteAnalytics.tsx](file://src/pages/QuoteAnalytics.tsx)
- [src/components/quote/SmartRecommendations.tsx](file://src/components/quote/SmartRecommendations.tsx)
- [src/integrations/supabase/types.ts](file://src/integrations/supabase/types.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoint](#api-endpoint)
3. [Data Structures](#data-structures)
4. [Caching Mechanism](#caching-mechanism)
5. [Rate Limiting System](#rate-limiting-system)
6. [Integration Architecture](#integration-architecture)
7. [Frontend Implementation](#frontend-implementation)
8. [Cost Tracking](#cost-tracking)
9. [Error Handling](#error-handling)
10. [Market Research Influence on Quotes](#market-research-influence-on-quotes)
11. [Administrative Monitoring](#administrative-monitoring)
12. [Usage Examples](#usage-examples)

## Introduction

The AI Market Research system provides real-time competitive intelligence for quote generation in the Sleek Apparels platform. This system gathers comprehensive market data including pricing benchmarks, manufacturing costs, lead times, and industry standards to inform accurate, market-researched quotes for apparel manufacturing clients.

The system operates through a serverless function that performs web research using Perplexity AI, processes structured data with Lovable AI, and caches results for optimal performance while maintaining data freshness.

## API Endpoint

### POST /functions/v1/ai-market-research

**Purpose**: Gather competitive intelligence for quote generation based on product specifications and quantity requirements.

**Request Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <service_role_key>`

**Request Body**:
```typescript
interface MarketResearchRequest {
  productType: string;           // Required: Product category (e.g., "t-shirts", "hoodies")
  quantity: number;              // Required: Order quantity (minimum 50)
  fabricType?: string;           // Optional: Fabric specification
  complexity?: string;           // Optional: Complexity level (simple/medium/complex)
  additionalRequirements?: string; // Optional: Additional specifications
}
```

**Response Format**:
```typescript
interface MarketResearchResponse {
  success: boolean;
  cached?: boolean;
  research: {
    averageUnitCost: number;
    materialCostPerUnit: number;
    leadTimeDays: number;
    markupPercentage: number;
    comparableProducts: Array<{
      name: string;
      price: number;
      source: string;
    }>;
    sources: string[];
    confidenceScore: number;
  };
  sources: string[];
  confidence_score: number;
  cache_id?: string;
  error?: string;
}
```

**Section sources**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts#L9-L15)

## Data Structures

### Market Research Data Model

The system processes comprehensive market research data structured as follows:

| Field | Type | Description | Range |
|-------|------|-------------|-------|
| `averageUnitCost` | number | Base manufacturing cost per unit | USD |
| `materialCostPerUnit` | number | Fabric and material costs per unit | USD |
| `leadTimeDays` | number | Typical production lead time | Days |
| `markupPercentage` | number | Industry standard markup rate | 0-100% |
| `confidenceScore` | number | Data reliability score | 0-100% |
| `comparableProducts` | Array | Similar products with pricing | 3-5 items |
| `sources` | Array | Data source URLs | 1-N URLs |

### Database Schema

The system utilizes several key database tables:

**market_research_cache**:
- `id`: UUID primary key
- `product_category`: Text category for indexing
- `quantity_range`: Quantitative range grouping
- `research_data`: JSONB containing market research
- `sources`: Array of source URLs
- `confidence_score`: Numeric reliability score
- `expires_at`: Timestamp for cache expiration
- `created_at`: Record creation timestamp

**ai_quotes** (enhanced):
- `market_research_id`: Foreign key to cache
- `confidence_score`: Quote confidence level
- `research_sources`: JSON array of sources
- `price_justification`: Text explanation
- `comparable_products`: JSON array of comparable items

**Section sources**
- [supabase/migrations/20251124164837_4eda3cf0-ab6f-4305-a5fe-82a19c7948d3.sql](file://supabase/migrations/20251124164837_4eda3cf0-ab6f-4305-a5fe-82a19c7948d3.sql#L2-L11)
- [src/integrations/supabase/types.ts](file://src/integrations/supabase/types.ts#L239-L245)

## Caching Mechanism

### Cache Strategy

The system implements a sophisticated caching mechanism to optimize performance and reduce API costs:

```mermaid
flowchart TD
A["Incoming Request"] --> B{"Check Cache"}
B --> |Hit| C["Return Cached Data"]
B --> |Miss| D["Perform Web Research"]
D --> E["Process with Perplexity AI"]
E --> F["Structure with Lovable AI"]
F --> G["Store in Cache"]
G --> H["Return Fresh Data"]
C --> I["Update Cache Expiration"]
I --> J["Return Cached Response"]
```

**Cache Configuration**:
- **Validity Period**: 24 hours (expires_at timestamp)
- **Indexing Strategy**: Composite index on (product_category, quantity_range)
- **Expiration Cleanup**: Automatic cleanup of expired entries
- **Storage Format**: JSONB for flexible data structure

### Quantity Range Grouping

The system groups quantities into ranges for efficient caching:
- 0-100 units
- 101-500 units
- 501-1000 units
- 1000+ units

This approach reduces cache fragmentation while maintaining accuracy for different order sizes.

**Section sources**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts#L58-L73)

## Rate Limiting System

### Multi-Level Rate Limiting

The system implements tiered rate limiting to prevent abuse and ensure fair usage:

**IP-Based Rate Limiting**:
- **Limit**: 10 requests per hour
- **Scope**: Per IP address
- **Window**: Rolling 1-hour period
- **Enforcement**: 429 HTTP status code

**Email-Based Rate Limiting**:
- **Limit**: 10 requests per day
- **Scope**: Per customer email address
- **Window**: Rolling 24-hour period
- **Enforcement**: 429 HTTP status code

### Rate Limiting Implementation

```mermaid
sequenceDiagram
participant Client
participant Function
participant Database
Client->>Function : Market Research Request
Function->>Database : Check IP Rate Limit
Database-->>Function : Current Count
alt IP Limit Exceeded
Function-->>Client : 429 Too Many Requests
else IP Limit OK
Function->>Database : Check Email Rate Limit
Database-->>Function : Current Count
alt Email Limit Exceeded
Function-->>Client : 429 Daily Limit Reached
else Both Limits OK
Function->>Function : Process Research
Function->>Database : Update Rate Counts
Function-->>Client : Research Response
end
end
```

**Section sources**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts#L28-L52)

## Integration Architecture

### System Architecture Overview

```mermaid
graph TB
subgraph "Client Layer"
A[ConversationalQuoteBuilder]
B[MarketResearchInsights]
end
subgraph "API Layer"
C[ai-market-research Function]
D[ai-conversational-quote Function]
end
subgraph "Data Layer"
E[market_research_cache]
F[ai_quotes]
G[ai_quote_rate_limits]
H[ai_usage_logs]
end
subgraph "External Services"
I[Perplexity AI]
J[Lovable AI]
end
A --> C
C --> E
C --> G
C --> H
C --> I
C --> J
D --> C
D --> F
F --> E
```

### Data Flow Integration

The system integrates seamlessly with the quote generation pipeline:

1. **Market Research Phase**: Client submits product specifications → AI function gathers data → Cache stores results
2. **Quote Generation Phase**: Client proceeds to quote generation → Function retrieves cached research → Generates comprehensive quote
3. **Persistence Phase**: Quote data includes market research references → Enables audit trail and transparency

**Section sources**
- [src/components/quote/ConversationalQuoteBuilder.tsx](file://src/components/quote/ConversationalQuoteBuilder.tsx#L75-L98)
- [supabase/functions/ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts#L89-L132)

## Frontend Implementation

### MarketResearchInsights Component

The frontend component displays market research data with comprehensive visualization:

**Key Features**:
- **Confidence Scoring**: Visual badges indicating data reliability (High/Medium/Estimated)
- **Source Attribution**: Links to original data sources for transparency
- **Comparative Analysis**: Side-by-side comparison with similar products
- **Responsive Design**: Mobile-friendly layout with clear information hierarchy

**Visual Elements**:
- **Average Unit Cost**: Primary pricing metric with currency formatting
- **Material Costs**: Breakdown of fabric and material expenses
- **Lead Times**: Production timeline indicators
- **Market Markup**: Industry-standard pricing adjustments

### ConversationalQuoteBuilder Integration

The main quote builder integrates market research seamlessly:

```mermaid
sequenceDiagram
participant User
participant Builder
participant API
participant Insights
User->>Builder : Enter Product Details
Builder->>API : Submit Market Research Request
API-->>Builder : Research Data + Cache ID
Builder->>Insights : Render Market Research
Insights-->>User : Display Pricing Insights
User->>Builder : Proceed to Quote Generation
Builder->>API : Generate Quote with Research
API-->>Builder : Comprehensive Quote
```

**Section sources**
- [src/components/quote/MarketResearchInsights.tsx](file://src/components/quote/MarketResearchInsights.tsx#L21-L139)
- [src/components/quote/ConversationalQuoteBuilder.tsx](file://src/components/quote/ConversationalQuoteBuilder.tsx#L75-L109)

## Cost Tracking

### Usage Logging System

The system implements comprehensive cost tracking for operational monitoring:

**AI Usage Logs Table**:
- `function_name`: "ai-market-research"
- `estimated_cost`: $0.05 per research request (approximate)
- `request_data`: Original request parameters
- `session_id`: Unique session identifier
- `user_id`: Associated user (if authenticated)

**Cost Optimization Strategies**:
- **Intelligent Caching**: Reduces API calls by serving cached data
- **Rate Limiting**: Prevents excessive usage and associated costs
- **Batch Processing**: Groups similar requests when possible
- **Fallback Mechanisms**: Provides basic data when external APIs fail

### Administrative Monitoring

Administrators can monitor system usage and costs through dedicated dashboards:

**Key Metrics**:
- **Request Volume**: Total number of market research requests
- **Cache Hit Rate**: Percentage of requests served from cache
- **API Cost Analysis**: Breakdown by function and time period
- **Error Rates**: Frequency of failed requests and error types

**Section sources**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts#L247-L252)
- [src/pages/QuoteAnalytics.tsx](file://src/pages/QuoteAnalytics.tsx#L83-L94)

## Error Handling

### Robust Error Management

The system implements comprehensive error handling to ensure reliable operation:

**Error Categories**:
1. **Validation Errors**: Invalid request parameters
2. **API Errors**: External service failures
3. **Database Errors**: Storage and retrieval issues
4. **Network Errors**: Connectivity problems

**Error Response Format**:
```typescript
{
  success: false,
  error: "Descriptive error message",
  // Additional context for debugging
}
```

**Fallback Mechanisms**:
- **Graceful Degradation**: Basic pricing data when research fails
- **Default Values**: Conservative estimates for missing data
- **Retry Logic**: Automatic retry for transient failures
- **Logging**: Comprehensive error logging for debugging

### Resilience Strategies

```mermaid
flowchart TD
A["Request Received"] --> B{"Validate Input"}
B --> |Invalid| C["Return Validation Error"]
B --> |Valid| D{"Check Cache"}
D --> |Cache Miss| E{"Call External APIs"}
E --> |Success| F["Process and Cache"]
E --> |Failure| G["Apply Fallback"]
D --> |Cache Hit| H["Return Cached Data"]
F --> I["Return Success Response"]
G --> J["Return Fallback Data"]
H --> I
I --> K["Log Success"]
J --> L["Log Warning"]
C --> M["Log Error"]
```

**Section sources**
- [supabase/functions/ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts#L265-L277)

## Market Research Influence on Quotes

### Pricing Algorithm Integration

Market research data directly influences quote pricing through a sophisticated algorithm:

**Pricing Factors**:
1. **Base Unit Cost**: Derived from average manufacturing costs
2. **Material Costs**: Specific to fabric type and quality
3. **Quantity Discounts**: Based on volume pricing tiers
4. **Complexity Multipliers**: Additional costs for customization
5. **Lead Time Adjustments**: Premium for expedited production
6. **Market Markup**: Industry-standard profit margins

### Confidence Score Impact

The confidence score from market research affects quote reliability:

| Confidence Level | Impact on Pricing | Quote Reliability |
|------------------|-------------------|-------------------|
| 85-100% | Standard pricing | High confidence |
| 70-84% | Moderate adjustment | Medium confidence |
| 50-69% | Significant adjustment | Estimated pricing |
| < 50% | Conservative pricing | Low confidence |

### Dynamic Recommendations

The system provides intelligent recommendations based on market data:

**SmartRecommendations Component**:
- **Volume Optimization**: Suggests optimal order quantities for discounts
- **Material Alternatives**: Recommends cost-effective fabric options
- **Timeline Flexibility**: Balances speed vs. cost trade-offs
- **Sample Kits**: Encourages risk-free testing for new customers

**Section sources**
- [src/components/quote/SmartRecommendations.tsx](file://src/components/quote/SmartRecommendations.tsx#L27-L87)
- [supabase/functions/ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts#L142-L188)

## Administrative Monitoring

### Quote Analytics Dashboard

Administrators can monitor system performance and usage patterns:

**Key Dashboards**:
1. **Quote Generation Analytics**: Request volume, success rates, and processing times
2. **Market Research Cache Status**: Cache hit rates, expiration patterns, and storage utilization
3. **Rate Limiting Metrics**: Usage patterns, threshold breaches, and mitigation actions
4. **Cost Tracking**: API costs, usage trends, and budget monitoring

### Cache Management Tools

Administrative interfaces provide tools for cache management:

**Cache Operations**:
- **Manual Cache Clearing**: Force refresh of specific cache entries
- **Bulk Cache Updates**: Refresh multiple cache entries simultaneously
- **Cache Health Monitoring**: Identify stale or problematic cache entries
- **Performance Analytics**: Monitor cache effectiveness and optimization opportunities

**Section sources**
- [src/pages/QuoteAnalytics.tsx](file://src/pages/QuoteAnalytics.tsx#L246-L277)

## Usage Examples

### Basic Market Research Request

```bash
curl -X POST https://your-supabase-url/functions/v1/ai-market-research \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "productType": "t-shirts",
    "quantity": 500,
    "fabricType": "cotton",
    "complexity": "medium"
  }'
```

### Response Example

```json
{
  "success": true,
  "cached": false,
  "research": {
    "averageUnitCost": 8.5,
    "materialCostPerUnit": 3.2,
    "leadTimeDays": 30,
    "markupPercentage": 20,
    "comparableProducts": [
      {
        "name": "Basic Cotton T-Shirt",
        "price": 7.8,
        "source": "https://source1.com"
      },
      {
        "name": "Premium Organic T-Shirt",
        "price": 12.5,
        "source": "https://source2.com"
      }
    ],
    "sources": [
      "https://manufacturing-costs.com/bangladesh-2025",
      "https://industry-reports.org/apparel-market"
    ],
    "confidenceScore": 85
  },
  "sources": [
    "https://manufacturing-costs.com/bangladesh-2025",
    "https://industry-reports.org/apparel-market"
  ],
  "confidence_score": 85,
  "cache_id": "uuid-identifier"
}
```

### Integration with Quote Generation

The market research data feeds directly into the quote generation process, providing the foundation for accurate, market-researched pricing that reflects current industry conditions and competitive positioning.

**Section sources**
- [src/components/quote/ConversationalQuoteBuilder.tsx](file://src/components/quote/ConversationalQuoteBuilder.tsx#L77-L98)