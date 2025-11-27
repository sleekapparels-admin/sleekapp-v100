# Process Order Job

<cite>
**Referenced Files in This Document**   
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts)
- [useAggregation.ts](file://src/hooks/useAggregation.ts)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Request Format](#request-format)
3. [Processing Workflow](#processing-workflow)
4. [Response Structure](#response-structure)
5. [Security Context](#security-context)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)

## Introduction
The 'process-order' job type of the batch-processor serverless function handles the creation and processing of aggregated orders within the production batching system. This function implements a five-step workflow to either assign orders to existing compatible batches or create new batches with optimal supplier selection. The system is designed to maximize production efficiency through batch aggregation while ensuring accurate pricing and proper batch management.

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L1-L346)

## Request Format
The 'process-order' job requires a specific request structure with the job type and order data:

```json
{
  "jobType": "process-order",
  "data": {
    "productCategory": "string",
    "productVariantBase": "string",
    "quantity": "number",
    "styleDetails": "object",
    "buyerId": "string"
  }
}
```

The request must include:
- **jobType**: Must be 'process-order' to trigger the order processing workflow
- **data**: Contains the order processing parameters:
  - *productCategory*: The product category (e.g., "t-shirts", "hoodies")
  - *productVariantBase*: The base variant of the product
  - *quantity*: Number of units ordered
  - *styleDetails*: Object containing style-specific details including variant information
  - *buyerId*: UUID of the buyer placing the order

```mermaid
flowchart TD
Start([Request Initiation]) --> ValidateJobType["Validate jobType = 'process-order'"]
ValidateJobType --> ExtractData["Extract order data from request"]
ExtractData --> ValidateData["Validate required fields"]
ValidateData --> ProcessOrder["Process Order"]
style Start fill:#4CAF50,stroke:#388E3C
style ProcessOrder fill:#2196F3,stroke:#1976D2
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L12-L27)

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L12-L27)

## Processing Workflow
The 'process-order' job executes a five-step workflow to process orders and manage production batches.

### Step 1: Find Compatible Existing Batch
The system searches for existing batches that can accommodate the new order based on multiple criteria:
- Same product category
- Status of 'filling'
- Current style count less than 4 (maximum allowed styles)
- Target quantity sufficient to accommodate the new order
- Style compatibility (does not exceed style limits)

```mermaid
flowchart TD
FindBatch["Search for existing batches"] --> FilterCategory["Filter by product category"]
FilterCategory --> FilterStatus["Filter by status = 'filling'"]
FilterStatus --> FilterStyleCount["Filter by current_style_count < 4"]
FilterStyleCount --> FilterCapacity["Filter by target_quantity >= order quantity"]
FilterCapacity --> CheckStyleCompatibility["Check style compatibility"]
CheckStyleCompatibility --> StyleExists{"Style already in batch?"}
StyleExists --> |Yes| HasSpace{"Has space for quantity?"}
StyleExists --> |No| WouldExceed{"Would exceed style limit?"}
WouldExceed --> |No| HasSpace
HasSpace --> |Yes| SelectBatch["Select compatible batch"]
HasSpace --> |No| NoCompatible["No compatible batch"]
WouldExceed --> |Yes| NoCompatible
style FindBatch fill:#2196F3,stroke:#1976D2
style SelectBatch fill:#4CAF50,stroke:#388E3C
style NoCompatible fill:#F44336,stroke:#D32F2F
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L192-L225)

### Step 2: Create New Batch with Optimal Supplier
When no compatible batch exists, the system creates a new batch by selecting the optimal supplier based on:
- Active MOU terms
- MOQ per batch sufficient for the order quantity
- Lowest base price (ordered by ascending base_price)
- Only the top supplier is selected (limit 1)

```mermaid
flowchart TD
NoCompatibleBatch["No compatible batch found"] --> FindSupplier["Find best supplier"]
FindSupplier --> FilterActive["Filter by status = 'active'"]
FilterActive --> FilterMOQ["Filter by moq_per_batch >= order quantity"]
FilterMOQ --> SortPrice["Sort by base_price ascending"]
SortPrice --> SelectTop["Select top supplier"]
SelectTop --> ValidateSupplier["Validate supplier found"]
ValidateSupplier --> |Yes| CreateBatch["Create new batch"]
ValidateSupplier --> |No| Error["No suitable supplier found"]
style FindSupplier fill:#2196F3,stroke:#1976D2
style CreateBatch fill:#4CAF50,stroke:#388E3C
style Error fill:#F44336,stroke:#D32F2F
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L230-L265)

### Step 3: Invoke Pricing Calculator
The system invokes the pricing-calculator function to determine accurate pricing for the order, passing:
- batchId: The selected or newly created batch ID
- quantity: The order quantity
- styleDetails: The style details from the order request

```mermaid
sequenceDiagram
participant BP as BatchProcessor
participant PC as PricingCalculator
participant DB as Database
BP->>PC : invoke('pricing-calculator')
activate PC
PC->>DB : Retrieve batch pricing rules
DB-->>PC : Pricing configuration
PC->>PC : Calculate unit price
PC->>PC : Apply complexity multiplier
PC->>PC : Calculate total price
PC-->>BP : Return pricing data
deactivate PC
Note over BP,PC : Pricing calculation with<br/>batch-specific rules and<br/>complexity adjustments
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L268-L274)

### Step 4: Create Order Record
The system creates an order record in the database with calculated pricing information:

```mermaid
flowchart TD
CreateOrder["Create order record"] --> SetBuyer["Set buyer_id"]
SetBuyer --> SetProduct["Set product_type"]
SetProduct --> SetQuantity["Set quantity"]
SetQuantity --> SetPricing["Set unit_price and total_price"]
SetPricing --> SetStatus["Set workflow_status = 'payment_pending'"]
SetStatus --> SetBatchFlag["Set is_batch_order = true"]
SetBatchFlag --> InsertOrder["Insert into orders table"]
InsertOrder --> ValidateInsert["Validate insertion success"]
style CreateOrder fill:#2196F3,stroke:#1976D2
style InsertOrder fill:#4CAF50,stroke:#388E3C
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L281-L293)

### Step 5: Update Batch with Order Contribution
The final step adds the order contribution to the batch and updates batch quantities:

```mermaid
flowchart TD
AddContribution["Add contribution to batch"] --> InsertContribution["Insert into batch_contributions"]
InsertContribution --> UpdateBatch["Update batch quantities"]
UpdateBatch --> CalculateStyles["Calculate unique styles"]
CalculateStyles --> GetContributions["Get all batch contributions"]
GetContributions --> ExtractVariants["Extract style variants"]
ExtractVariants --> CreateSet["Create unique set of variants"]
CreateSet --> CountStyles["Count unique styles"]
CountStyles --> UpdateQuantities["Update current_quantity and current_style_count"]
UpdateQuantities --> Complete["Processing complete"]
style AddContribution fill:#2196F3,stroke:#1976D2
style Complete fill:#4CAF50,stroke:#388E3C
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L297-L324)

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L191-L324)

## Response Structure
The 'process-order' job returns a standardized response with order and batch information:

```json
{
  "success": true,
  "orderId": "string",
  "batchId": "string",
  "isNewBatch": "boolean",
  "pricing": {
    "unitPrice": "number",
    "totalPrice": "number",
    "breakdown": "object"
  },
  "batchFillPercentage": "number"
}
```

The response includes:
- **success**: Boolean indicating successful processing
- **orderId**: UUID of the created order
- **batchId**: UUID of the assigned or created batch
- **isNewBatch**: Boolean indicating if a new batch was created
- **pricing**: Object containing pricing details from the pricing-calculator
- **batchFillPercentage**: The fill percentage of the batch after adding the order

```mermaid
erDiagram
ORDER ||--o{ BATCH_CONTRIBUTION : contains
BATCH ||--o{ BATCH_CONTRIBUTION : has
ORDER {
uuid id PK
uuid buyer_id FK
string product_type
integer quantity
numeric unit_price
numeric total_price
order_workflow_status workflow_status
boolean is_batch_order
timestamp created_at
timestamp updated_at
}
BATCH {
uuid id PK
string product_category
string product_variant_base
integer target_quantity
integer current_quantity
integer current_style_count
integer max_styles
uuid supplier_id FK
text batch_status
numeric unit_price_base
numeric complexity_multiplier
date estimated_start_date
date actual_start_date
timestamp window_closes_at
timestamp created_at
timestamp updated_at
}
BATCH_CONTRIBUTION {
uuid id PK
uuid batch_id FK
uuid order_id FK
integer quantity_contributed
jsonb style_details
numeric unit_price
timestamp committed_at
}
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L333-L341)
- [TABLES_ONLY.sql](file://supabase/TABLES_ONLY.sql#L507-L524)

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L333-L341)

## Security Context
The 'process-order' job uses Supabase authentication with proper security context:

- **Client**: Uses SUPABASE_ANON_KEY for initial connection
- **Authorization**: Passes the request's Authorization header to ensure user context
- **Row Level Security**: Database policies enforce data access controls
- **Environment Variables**: Sensitive credentials stored in environment variables

```mermaid
sequenceDiagram
participant Client as "Client App"
participant BP as "BatchProcessor"
participant Supabase as "Supabase"
Client->>BP : POST /functions/v1/batch-processor
activate BP
BP->>BP : Validate CORS headers
BP->>BP : Parse request JSON
BP->>BP : Verify jobType
BP->>Supabase : Create client with ANON_KEY
Supabase-->>BP : Client initialized
BP->>Supabase : Set user authorization header
BP->>Supabase : Execute database operations
Supabase-->>BP : Return data
BP-->>Client : JSON response with CORS headers
deactivate BP
Note over BP,Supabase : All database operations<br/>respect Row Level Security<br/>policies based on user auth
```

**Diagram sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L180-L186)

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L180-L186)

## Usage Examples
### Example 1: Order Assigned to Existing Batch
```json
// Request
{
  "jobType": "process-order",
  "data": {
    "productCategory": "t-shirts",
    "productVariantBase": "crew-neck",
    "quantity": 150,
    "styleDetails": {
      "variant": "summer-collection-2025",
      "color": "navy",
      "size": "M"
    },
    "buyerId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
  }
}

// Response
{
  "success": true,
  "orderId": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
  "batchId": "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0",
  "isNewBatch": false,
  "pricing": {
    "unitPrice": 12.50,
    "totalPrice": 1875.00,
    "breakdown": {
      "baseCost": 8.00,
      "complexityMultiplier": 1.2,
      "margin": 2.50
    }
  },
  "batchFillPercentage": 68.5
}
```

### Example 2: New Batch Created
```json
// Request
{
  "jobType": "process-order",
  "data": {
    "productCategory": "hoodies",
    "productVariantBase": "zip-up",
    "quantity": 250,
    "styleDetails": {
      "variant": "premium-line",
      "color": "black",
      "size": "L"
    },
    "buyerId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
  }
}

// Response
{
  "success": true,
  "orderId": "d4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1",
  "batchId": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2",
  "isNewBatch": true,
  "pricing": {
    "unitPrice": 28.75,
    "totalPrice": 7187.50,
    "breakdown": {
      "baseCost": 20.00,
      "complexityMultiplier": 1.15,
      "margin": 5.75
    }
  },
  "batchFillPercentage": 55.6
}
```

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L333-L341)
- [useAggregation.ts](file://src/hooks/useAggregation.ts#L82-L98)

## Error Handling
The 'process-order' job implements comprehensive error handling:

```mermaid
flowchart TD
Start["Request Processing"] --> TryBlock["Try block execution"]
TryBlock --> Process["Process jobType"]
Process --> CatchError["Catch any errors"]
CatchError --> LogError["Log error details"]
LogError --> FormatError["Format error message"]
FormatError --> ReturnError["Return 500 response"]
subgraph Success Path
Process --> ValidateBatch["Validate batch compatibility"]
ValidateBatch --> CreateOrder["Create order record"]
CreateOrder --> UpdateBatch["Update batch quantities"]
UpdateBatch --> ReturnSuccess["Return 200 response"]
end
style TryBlock fill:#2196F3,stroke:#1976D2
style ReturnSuccess fill:#4CAF50,stroke:#388E3C
style ReturnError fill:#F44336,stroke:#D32F2F
```

Common error scenarios include:
- Invalid job type (400 Bad Request)
- No suitable supplier found (500 Internal Server Error)
- Database operation failures (500 Internal Server Error)
- Pricing calculation failures (500 Internal Server Error)

All errors are logged with details for debugging and monitoring purposes.

**Section sources**
- [batch-processor/index.ts](file://supabase/functions/batch-processor/index.ts#L48-L55)