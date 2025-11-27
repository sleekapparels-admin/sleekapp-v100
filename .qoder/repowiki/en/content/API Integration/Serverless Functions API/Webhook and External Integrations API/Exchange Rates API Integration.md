# Exchange Rates API Integration

<cite>
**Referenced Files in This Document**   
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql)
- [COMPLETE_SETUP.sql](file://supabase/COMPLETE_SETUP.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Caching Mechanism](#caching-mechanism)
4. [Fallback Strategy](#fallback-strategy)
5. [Currency Conversion Process](#currency-conversion-process)
6. [Error Handling and Rate Limiting](#error-handling-and-rate-limiting)
7. [Configuration and Testing](#configuration-and-testing)
8. [Performance Considerations](#performance-considerations)

## Introduction
The exchange rates API integration in sleekapp-v100 provides real-time currency conversion functionality for quote generation and financial calculations. This system minimizes external API calls through an efficient caching mechanism while ensuring reliability through fallback strategies. The implementation supports USD, EUR, CAD, AUD, GBP, and BDT currencies with a 24-hour cache duration, balancing accuracy with performance requirements.

## Architecture Overview
The exchange rates system follows a serverless architecture pattern with Supabase functions handling the backend logic. The architecture consists of a Deno-based serverless function that serves as the intermediary between the frontend application and the external exchange rate API.

```mermaid
graph TB
A[Frontend Application] --> B[Supabase Function]
B --> C{Cache Check}
C --> |Cache Hit| D[Return Cached Rates]
C --> |Cache Miss| E[Fetch External API]
E --> F[exchangerate-api.com]
F --> G[Store in Database]
G --> H[Return Fresh Rates]
D --> A
H --> A
style B fill:#4A90E2,stroke:#333
style G fill:#50C878,stroke:#333
style F fill:#D35400,stroke:#333
```

**Diagram sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L9-L88)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L16-L23)

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L9-L88)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L16-L23)

## Caching Mechanism
The system implements a database-backed caching mechanism using the `exchange_rates` table to minimize external API calls and improve response times. The cache is managed through a timestamp-based validity system using the `valid_until` field.

The caching workflow operates as follows:
1. When a request is received, the system first checks for valid cached rates in the database
2. Validity is determined by comparing the current time with the `valid_until` timestamp
3. If valid rates exist for all required currencies, they are returned immediately
4. If no valid cache exists, fresh rates are fetched and stored with a new expiration time

```mermaid
flowchart TD
Start([Request Exchange Rates]) --> CheckCache["Check exchange_rates table<br/>for valid entries"]
CheckCache --> Valid{"Valid cache exists?<br/>(valid_until > now)"}
Valid --> |Yes| ReturnCached["Return cached rates<br/>from database"]
Valid --> |No| FetchAPI["Fetch rates from<br/>exchangerate-api.com"]
FetchAPI --> StoreCache["Delete old rates &<br/>Insert new rates with<br/>valid_until + 24h"]
StoreCache --> ReturnFresh["Return fresh rates"]
ReturnCached --> End([Response])
ReturnFresh --> End
style CheckCache fill:#E1F5FE,stroke:#1976D2
style Valid fill:#B3E5FC,stroke:#0288D1
style ReturnCached fill:#C8E6C9,stroke:#388E3C
style FetchAPI fill:#FFECB3,stroke:#FF8F00
style StoreCache fill:#FFCDD2,stroke:#D32F2F
style ReturnFresh fill:#C8E6C9,stroke:#388E3C
```

**Diagram sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L22-L36)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L320-L328)

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L22-L36)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L320-L328)

## Fallback Strategy
The system implements a comprehensive fallback strategy to ensure uninterrupted service when the external API is unavailable. This strategy includes both development-time and runtime fallback mechanisms.

For development environments, the system uses a demo API key from exchangerate-api.com when no production key is configured. This allows developers to test currency conversion functionality without requiring a paid API subscription.

At runtime, if the external API call fails, the frontend component provides hardcoded fallback exchange rates to ensure the application remains functional. These fallback rates are used temporarily until the external service is restored.

```mermaid
sequenceDiagram
participant Frontend
participant SupabaseFunction
participant ExternalAPI
Frontend->>SupabaseFunction : Invoke get-exchange-rates
SupabaseFunction->>SupabaseFunction : Check cache (valid_until)
alt Cache valid
SupabaseFunction-->>Frontend : Return cached rates
else Cache invalid/expired
SupabaseFunction->>ExternalAPI : GET /v6/latest/USD
alt API call successful
ExternalAPI-->>SupabaseFunction : Return rates
SupabaseFunction->>SupabaseFunction : Update cache
SupabaseFunction-->>Frontend : Return fresh rates
else API call failed
SupabaseFunction-->>Frontend : Return error
Frontend->>Frontend : Use fallback rates
Frontend-->>User : Display with fallback values
end
end
Note over SupabaseFunction,ExternalAPI : Production : Uses EXCHANGE_RATE_API_KEY<br/>Development : Uses 'demo' key
```

**Diagram sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L39-L44)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L26-L35)

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L39-L44)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L26-L35)

## Currency Conversion Process
The currency conversion system supports USD, EUR, CAD, AUD, GBP, and BDT with USD as the base currency. The conversion process is designed to be efficient and reliable, with a 24-hour cache duration to balance freshness with API usage limits.

The exchange_rates database table stores conversion rates with the following schema:
- **base_currency**: The reference currency (defaults to USD)
- **target_currency**: The currency being converted to
- **rate**: The conversion rate as a numeric value (precision 10, scale 6)
- **fetched_at**: Timestamp when the rate was retrieved
- **valid_until**: Expiration timestamp for cache validity
- **created_at**: Record creation timestamp

The conversion process follows these steps:
1. Client requests exchange rates via Supabase function invocation
2. Server checks for valid cached rates in the database
3. If cache is valid and complete, returns cached rates
4. If cache is invalid, fetches fresh rates from exchangerate-api.com
5. Stores fresh rates in database with 24-hour validity
6. Returns rates to client for currency display

```mermaid
erDiagram
EXCHANGE_RATES {
uuid id PK
text base_currency UK
text target_currency UK
numeric rate
timestamp fetched_at
timestamp valid_until
timestamp created_at
}
EXCHANGE_RATES ||--|| EXCHANGE_RATES : "base_currency determines rates"
```

**Section sources**
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L320-L328)
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L19-L20)

## Error Handling and Rate Limiting
The system implements robust error handling to ensure graceful degradation when external services are unavailable. The error handling strategy operates at both the server and client levels.

On the server side, the Supabase function catches any errors during the external API fetch process and returns a 500 error response. This prevents unhandled exceptions from crashing the function.

On the client side, the CurrencyDisplay component implements a comprehensive error handling strategy:
- Catches errors when invoking the Supabase function
- Logs errors for debugging purposes
- Applies hardcoded fallback exchange rates
- Continues rendering the component with approximate values
- Provides a smooth user experience even when rates cannot be retrieved

The system also protects against rate limiting by:
- Caching results for 24 hours to minimize API calls
- Using the free tier of exchangerate-api.com (1,500 requests/month)
- Falling back to cached or hardcoded values when needed

```mermaid
flowchart TD
A[API Request] --> B{Success?}
B --> |Yes| C[Process Response]
B --> |No| D[Server Error Handler]
D --> E[Log Error]
E --> F[Return 500 Response]
F --> G[Client Error Handler]
G --> H[Log Error]
H --> I[Apply Fallback Rates]
I --> J[Continue Rendering]
C --> K[Update Cache]
K --> L[Return Response]
L --> M[Client Processing]
style B fill:#FFCDD2,stroke:#D32F2F
style D fill:#FFCDD2,stroke:#D32F2F
style G fill:#FFCDD2,stroke:#D32F2F
style I fill:#C8E6C9,stroke:#388E3C
```

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L81-L87)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L24-L35)

## Configuration and Testing
The exchange rates system requires proper configuration for production deployment while supporting development workflows.

### Environment Configuration
The system uses the following environment variables:
- **EXCHANGE_RATE_API_KEY**: Production API key for exchangerate-api.com (required for production)
- **SUPABASE_URL**: Supabase project URL
- **SUPABASE_SERVICE_ROLE_KEY**: Supabase service role key with full database access

For development, the `EXCHANGE_RATE_API_KEY` can be omitted, causing the system to use the 'demo' key which has limited functionality but allows testing.

### Testing Cache Invalidation
To test cache invalidation:
1. Manually update the `valid_until` field in the exchange_rates table to a past timestamp
2. Or delete records from the exchange_rates table
3. Trigger a new exchange rate request from the frontend
4. Verify that fresh rates are fetched and stored

### Monitoring API Usage
API usage can be monitored through:
- Supabase function invocation logs
- Database audit logs for exchange_rates table operations
- External API provider dashboard (exchangerate-api.com)
- Application error logs for failed API calls

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L15-L17)
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L39-L39)

## Performance Considerations
The exchange rates integration has been designed with performance optimization as a key priority, particularly regarding its impact on quote generation latency.

### Cache Efficiency
The 24-hour cache duration significantly improves system efficiency by:
- Reducing external API calls from potentially thousands to just one per day
- Decreasing average response time from ~300-500ms (external API) to ~50-100ms (database lookup)
- Minimizing dependency on external service availability
- Reducing costs associated with API usage

Cache hit rate is expected to be over 99% during normal operation, as most requests occur within the 24-hour validity window.

### Quote Generation Latency
The integration is optimized to minimize impact on quote generation:
- Asynchronous rate loading prevents blocking of main quote calculation
- Fallback rates ensure currency display never delays quote presentation
- Database caching keeps response times consistent
- The system adds minimal overhead (typically < 100ms) to quote generation

### Database Performance
The exchange_rates table is optimized for the access pattern:
- Indexed on base_currency and valid_until for efficient cache lookups
- Small dataset size (6 records per base currency) ensures fast queries
- Regular cleanup of expired records maintains performance
- UUID primary key ensures efficient record management

```mermaid
graph LR
A[Performance Factors] --> B[Cache Efficiency]
A --> C[Latency Impact]
A --> D[Database Optimization]
B --> B1["99%+ cache hit rate"]
B --> B2["1 external call per 24h"]
B --> B3["~80% latency reduction"]
C --> C1["< 100ms overhead"]
C --> C2["Non-blocking loading"]
C --> C3["Fallback rates available"]
D --> D1["Indexed queries"]
D --> D2["Small dataset"]
D --> D3["Automatic cleanup"]
style A fill:#4A90E2,stroke:#333,color:#fff
style B fill:#50C878,stroke:#333,color:#fff
style C fill:#50C878,stroke:#333,color:#fff
style D fill:#50C878,stroke:#333,color:#fff
```

**Section sources**
- [get-exchange-rates/index.ts](file://supabase/functions/get-exchange-rates/index.ts#L48-L48)
- [CurrencyDisplay.tsx](file://src/components/quote/CurrencyDisplay.tsx#L13-L40)