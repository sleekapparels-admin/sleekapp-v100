# Supabase REST API Documentation

<cite>
**Referenced Files in This Document**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [src/types/database.ts](file://src/types/database.ts)
- [src/hooks/queries/index.ts](file://src/hooks/queries/index.ts)
- [src/hooks/queries/useOrders.ts](file://src/hooks/queries/useOrders.ts)
- [src/hooks/queries/useNotifications.ts](file://src/hooks/queries/useNotifications.ts)
- [src/hooks/queries/useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts)
- [src/hooks/useSupplierOrders.ts](file://src/hooks/useSupplierOrders.ts)
- [src/hooks/useQuotes.ts](file://src/hooks/useQuotes.ts)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts)
- [src/components/supplier/ProductionStageUpdate.tsx](file://src/components/supplier/ProductionStageUpdate.tsx)
- [src/components/supplier/ProductionManagementPanel.tsx](file://src/components/supplier/ProductionManagementPanel.tsx)
- [src/pages/SupplierOrderDetail.tsx](file://src/pages/SupplierOrderDetail.tsx)
- [src/components/ErrorBoundary.tsx](file://src/components/ErrorBoundary.tsx)
- [src/components/RouteErrorBoundary.tsx](file://src/components/RouteErrorBoundary.tsx)
- [src/components/RootErrorBoundary.tsx](file://src/components/RootErrorBoundary.tsx)
- [supabase/functions/health/index.ts](file://supabase/functions/health/index.ts)
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [supabase/functions/verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
- [supabase/migrations/20251121040812_6c4fea3b-d195-422d-83c9-ade0c9dc73db.sql](file://supabase/migrations/20251121040812_6c4fea3b-d195-422d-83c9-ade0c9dc73db.sql)
- [supabase/migrations/20251127091524_dd83810a-55c9-494a-8878-c84278881cc9.sql](file://supabase/migrations/20251127091524_dd83810a-55c9-494a-8878-c84278881cc9.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Core API Endpoints](#core-api-endpoints)
4. [TypeScript Interfaces and Schemas](#typescript-interfaces-and-schemas)
5. [React Query Integration](#react-query-integration)
6. [Helper Functions](#helper-functions)
7. [Error Handling and Status Codes](#error-handling-and-status-codes)
8. [Rate Limiting Policies](#rate-limiting-policies)
9. [Performance Optimization](#performance-optimization)
10. [Common Operations Examples](#common-operations-examples)
11. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

The sleekapp-v100 application utilizes Supabase as its backend database and authentication provider, offering a comprehensive REST API for managing core business entities including AI quotes, supplier orders, production stages, users, and suppliers. This documentation provides detailed coverage of all REST API endpoints, authentication mechanisms, error handling patterns, and performance optimization strategies.

The application follows a type-safe architecture using TypeScript interfaces and React Query for efficient data fetching and caching. All API operations are wrapped in helper functions that provide better type inference and reduce boilerplate code.

## Authentication and Authorization

### Authentication Methods

The application supports multiple authentication methods:

- **JWT Token Authentication**: Used for API requests requiring user context
- **Session-based Authentication**: For anonymous users and temporary sessions
- **Service Role Authentication**: For server-side operations and administrative tasks

### Authentication Headers

All authenticated requests must include the appropriate authorization header:

```typescript
// JWT Token Authentication
Authorization: Bearer <jwt-token>

// Session-based Authentication
X-Session-ID: <session-id>
```

### Role-Based Access Control

The system implements role-based access control with the following user roles:

- **Admin**: Full system access and administrative privileges
- **Buyer**: Can create and manage orders, quotes, and notifications
- **Supplier**: Can manage supplier profiles, quotes, and production stages
- **Factory**: Can manage production orders and stage updates

**Section sources**
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L14-L20)
- [src/hooks/useQuotes.ts](file://src/hooks/useQuotes.ts#L55-L78)

## Core API Endpoints

### AI Quotes Endpoints

#### GET /ai_quotes
Retrieve AI-generated quotes for customers or buyers.

**HTTP Method**: GET  
**URL Pattern**: `/rest/v1/ai_quotes`  
**Authentication**: Required (Buyer or Admin role)

**Query Parameters**:
- `customer_email` (string): Filter by customer email
- `status` (string): Filter by quote status
- `limit` (number): Maximum number of results (default: 25)
- `offset` (number): Pagination offset (default: 0)

**Response Schema**:
```typescript
interface AIQuote {
  id: string;
  session_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  phone_number: string | null;
  product_type: string;
  quantity: number;
  fabric_type: string | null;
  complexity_level: string | null;
  additional_requirements: string | null;
  quote_data: Record<string, any>;
  total_price: number;
  estimated_delivery_days: number;
  status: string;
  lead_status: LeadStatus;
  created_at: string;
}
```

**Example Request**:
```typescript
const { data, error } = await supabase
  .from('ai_quotes')
  .select('*')
  .eq('customer_email', 'customer@example.com')
  .order('created_at', { ascending: false });
```

#### POST /ai_quotes
Create a new AI-generated quote.

**HTTP Method**: POST  
**URL Pattern**: `/rest/v1/ai_quotes`  
**Authentication**: Required (Buyer or Anonymous)

**Request Body**:
```typescript
interface CreateAIQuote {
  session_id?: string;
  customer_email?: string;
  customer_name?: string;
  phone_number?: string;
  product_type: string;
  quantity: number;
  fabric_type?: string;
  complexity_level?: string;
  additional_requirements?: string;
  quote_data?: Record<string, any>;
  status?: string;
}
```

**Example Usage**:
```typescript
const { data, error } = await quoteHelpers.create({
  customer_email: 'customer@example.com',
  product_type: 't-shirt',
  quantity: 100,
  fabric_type: 'cotton',
  complexity_level: 'medium'
});
```

**Section sources**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts#L154-L190)
- [src/hooks/useQuotes.ts](file://src/hooks/useQuotes.ts#L112-L160)

### Supplier Orders Endpoints

#### GET /supplier_orders
Retrieve supplier orders with optional filtering.

**HTTP Method**: GET  
**URL Pattern**: `/rest/v1/supplier_orders`  
**Authentication**: Required (Supplier role)

**Query Parameters**:
- `supplier_id` (string): Filter by supplier ID
- `status` (string): Filter by order status
- `buyer_order_id` (string): Filter by buyer order ID
- `limit`/`offset`: Pagination parameters

**Response Schema**:
```typescript
interface SupplierOrder {
  id: string;
  order_number: string;
  supplier_id: string;
  buyer_order_id: string;
  product_type: string;
  quantity: number;
  supplier_price: number;
  status: string;
  target_date: string | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}
```

#### PUT /supplier_orders/:id/status
Update supplier order status.

**HTTP Method**: PUT  
**URL Pattern**: `/rest/v1/supplier_orders/{id}`  
**Authentication**: Required (Supplier role)

**Request Body**:
```typescript
interface UpdateSupplierOrderStatus {
  status: string;
  acceptance_status?: string;
  notes?: string;
}
```

**Example Usage**:
```typescript
const { data, error } = await supabase
  .from('supplier_orders')
  .update({ status: 'accepted' })
  .eq('id', orderId)
  .select()
  .single();
```

**Section sources**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts#L33-L105)
- [src/hooks/useSupplierOrders.ts](file://src/hooks/useSupplierOrders.ts#L41-L207)

### Production Stages Endpoints

#### GET /production_stages
Retrieve production stages for supplier orders.

**HTTP Method**: GET  
**URL Pattern**: `/rest/v1/production_stages`  
**Authentication**: Required (Supplier role)

**Query Parameters**:
- `supplier_order_id` (string): Filter by supplier order ID
- `stage_number` (number): Filter by specific stage number
- `status` (string): Filter by stage status

**Response Schema**:
```typescript
interface ProductionStage {
  id: string;
  supplier_order_id: string;
  stage_number: number;
  stage_name: string;
  description: string;
  status: string;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  target_date: string | null;
  notes: string | null;
  photos: string[];
  created_at: string;
  updated_at: string;
}
```

#### PUT /production_stages/:id
Update production stage progress.

**HTTP Method**: PUT  
**URL Pattern**: `/rest/v1/production_stages/{id}`  
**Authentication**: Required (Supplier role)

**Request Body**:
```typescript
interface UpdateProductionStage {
  completion_percentage: number;
  notes?: string;
  photos?: string[];
  status?: string;
}
```

**Example Implementation**:
```typescript
const updateStageProgress = async (stageId: string, percentage: number, notes: string) => {
  try {
    const { error } = await supabase
      .from('production_stages')
      .update({
        completion_percentage: percentage,
        notes: notes,
        photos: photoUrls,
        updated_by: user.id,
      })
      .eq('id', stageId);
    
    if (error) throw error;
    toast.success("Stage updated successfully");
  } catch (error: any) {
    console.error("Error updating stage:", error);
    toast.error(error.message);
  }
};
```

**Section sources**
- [src/components/supplier/ProductionStageUpdate.tsx](file://src/components/supplier/ProductionStageUpdate.tsx#L34-L75)
- [src/components/supplier/ProductionManagementPanel.tsx](file://src/components/supplier/ProductionManagementPanel.tsx#L102-L155)

### Users and Profiles Endpoints

#### GET /profiles
Retrieve user profiles with optional filtering.

**HTTP Method**: GET  
**URL Pattern**: `/rest/v1/profiles`  
**Authentication**: Required (Self or Admin)

**Query Parameters**:
- `id` (string): Filter by user ID
- `user_id` (string): Filter by Supabase user ID

**Response Schema**:
```typescript
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
```

#### PUT /profiles/:id
Update user profile information.

**HTTP Method**: PUT  
**URL Pattern**: `/rest/v1/profiles/{id}`  
**Authentication**: Required (Self or Admin)

**Request Body**:
```typescript
interface UpdateProfile {
  full_name?: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
}
```

**Section sources**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts#L261-L279)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts#L100-L122)

### Suppliers Endpoints

#### GET /suppliers
Retrieve supplier information with capabilities and ratings.

**HTTP Method**: GET  
**URL Pattern**: `/rest/v1/suppliers`  
**Authentication**: Optional

**Query Parameters**:
- `verification_status` (string): Filter by verification status
- `tier` (string): Filter by supplier tier
- `factory_location` (string): Filter by location
- `min_moq`/`max_moq` (number): Filter by minimum/maximum MOQ

**Response Schema**:
```typescript
interface Supplier {
  id: string;
  user_id: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  specialties: string[] | null;
  certifications: string[] | null;
  verification_status: VerificationStatus;
  rating: number | null;
  total_orders: number;
  on_time_delivery_rate: number | null;
  quality_rating: number | null;
  created_at: string;
  updated_at: string;
}
```

#### POST /suppliers
Create a new supplier profile.

**HTTP Method**: POST  
**URL Pattern**: `/rest/v1/suppliers`  
**Authentication**: Required (Buyer role)

**Request Body**:
```typescript
interface CreateSupplier {
  company_name: string;
  factory_location: string;
  moq_minimum: number;
  lead_time_days: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  about?: string;
  year_established?: number;
  total_capacity_monthly?: number;
}
```

**Section sources**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts#L196-L222)
- [src/hooks/useSuppliers.ts](file://src/hooks/useSuppliers.ts#L48-L90)

## TypeScript Interfaces and Schemas

### Core Data Types

The application defines comprehensive TypeScript interfaces for type-safe database operations:

```typescript
// Enum Types
export type AppRole = 'admin' | 'buyer' | 'supplier' | 'factory';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type OrderWorkflowStatus = 
  | 'quote_requested'
  | 'quote_provided'
  | 'quote_accepted'
  | 'assigned_to_supplier'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'completed';

// Helper Types
export type InsertData<T> = Partial<Omit<T, 'id'>> & { id?: string };
export type UpdateData<T> = Partial<Omit<T, 'id' | 'created_at'>>;
```

### Database Table Interfaces

Each core table has a corresponding TypeScript interface:

#### AI Quote Interface
```typescript
export interface AIQuote {
  id: string;
  session_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  phone_number: string | null;
  country: string | null;
  product_type: string;
  quantity: number;
  fabric_type: string | null;
  complexity_level: string | null;
  additional_requirements: string | null;
  quote_data: Record<string, any>;
  total_price: number;
  estimated_delivery_days: number;
  ai_suggestions: string | null;
  status: string;
  lead_status: LeadStatus;
  lead_notes: string | null;
  production_route: string | null;
  specialty_sourcing_required: boolean;
  bangladesh_cost: number | null;
  specialty_cost: number | null;
  admin_markup: number | null;
  alternative_options: Record<string, any> | null;
  converted_to_order_id: string | null;
  created_at: string;
}
```

#### Order Interface
```typescript
export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string | null;
  factory_id: string | null;
  quote_id: string | null;
  product_type: string;
  quantity: number;
  buyer_price: number | null;
  supplier_price: number | null;
  admin_margin: number | null;
  margin_percentage: number | null;
  status: string;
  payment_status: PaymentStatus;
  workflow_status: OrderWorkflowStatus;
  production_status: string;
  current_stage: ProductionStage;
  stage_progress: Record<string, number>;
  milestone_tracker: Record<string, any>;
  target_date: string | null;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  deposit_amount: number | null;
  balance_amount: number | null;
  deposit_paid_at: string | null;
  balance_paid_at: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  tracking_token: string | null;
  display_publicly: boolean;
  is_demo_order: boolean;
  anonymized_client_name: string | null;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}
```

**Section sources**
- [src/types/database.ts](file://src/types/database.ts#L1-L579)

## React Query Integration

### Query Hooks Architecture

The application uses React Query for efficient data fetching, caching, and synchronization. All API operations are wrapped in custom hooks that provide:

- Automatic caching with configurable TTL
- Optimistic updates for better UX
- Error boundaries and toast notifications
- Real-time data synchronization
- Pagination and filtering support

### Order Management Queries

```typescript
// Basic order queries
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getById(orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

// Optimistic status updates
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, notes }: { 
      orderId: string; 
      status: string; 
      notes?: string 
    }) => {
      const { data, error } = await orderHelpers.updateStatus(orderId, status, notes);
      if (error) throw error;
      return data;
    },
    onMutate: async ({ orderId, status }) => {
      // Snapshot previous value
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(orderId));
      
      // Optimistically update
      if (previousOrder) {
        queryClient.setQueryData<Order>(orderKeys.detail(orderId), {
          ...previousOrder,
          status,
          updated_at: new Date().toISOString(),
        });
      }
      
      return { previousOrder };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(variables.orderId), context.previousOrder);
      }
      toast.error('Failed to update order status');
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order status updated');
    },
  });
}
```

### Supplier Queries

```typescript
// Supplier search with filtering
export function useSuppliers(filters?: SupplierFilters) {
  const queryFn = useMemo(() => async () => {
    let query = supabase
      .from("suppliers")
      .select("*, supplier_capabilities(*), supplier_ratings(*)")
      .eq("verification_status", "verified");

    if (filters?.location) {
      query = query.ilike("factory_location", `%${filters.location}%`);
    }

    if (filters?.tier && (filters.tier === 'bronze' || filters.tier === 'silver' || filters.tier === 'gold')) {
      query = query.eq("tier", filters.tier);
    }

    const { data, error } = await query.order("tier", { ascending: false });

    if (error) throw error;

    // Client-side filtering
    let filteredData = data || [];
    if (filters?.min_moq || filters?.max_moq || filters?.product_category) {
      filteredData = filteredData.filter(s => {
        if (filters.min_moq && s.moq_minimum > filters.min_moq) return false;
        if (filters.max_moq && s.moq_minimum < filters.max_moq) return false;
        if (filters.product_category) {
          const hasCategory = s.supplier_capabilities?.some((cap: any) => 
            cap.product_category === filters.product_category
          );
          if (!hasCategory) return false;
        }
        return true;
      });
    }

    return filteredData as Supplier[];
  }, [filters?.location, filters?.tier, filters?.min_moq, filters?.max_moq, filters?.product_category]);

  return useQuery({
    queryKey: ["suppliers", filters],
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}
```

**Section sources**
- [src/hooks/queries/useOrders.ts](file://src/hooks/queries/useOrders.ts#L19-L152)
- [src/hooks/queries/useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L48-L90)

## Helper Functions

### Type-Safe Database Operations

The application provides type-safe helper functions that wrap Supabase client operations:

#### Order Helpers
```typescript
export const orderHelpers = {
  async getById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    return { data: data as Order | null, error };
  },

  async updateStatus(orderId: string, status: string, notes?: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    return { data: data as Order | null, error };
  },

  async getByBuyerId(buyerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    return { data: data as Order[] | null, error };
  }
};
```

#### Quote Helpers
```typescript
export const quoteHelpers = {
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });
    return { data: data as AIQuote[] | null, error };
  },

  async create(quote: InsertData<AIQuote>) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .insert(quote as any)
      .select()
      .single();
    return { data: data as AIQuote | null, error };
  }
};
```

#### Supplier Helpers
```typescript
export const supplierHelpers = {
  async getVerified() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('verification_status', 'verified')
      .order('rating', { ascending: false });
    return { data: data as any as Supplier[] | null, error };
  },

  async getById(supplierId: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .maybeSingle();
    return { data: data as any as Supplier | null, error };
  }
};
```

### Generic Query Builder

A generic type-safe query builder is available for dynamic table operations:

```typescript
export const queryTable = <T>(tableName: string): any => {
  return (supabase as any).from(tableName) as any;
};

// Usage example
const { data, error } = await queryTable<Order>('orders')
  .select('*')
  .eq('buyer_id', userId)
  .order('created_at', { ascending: false });
```

**Section sources**
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts#L26-L376)

## Error Handling and Status Codes

### HTTP Status Codes

The API follows standard HTTP status codes:

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful requests |
| 201 | Created | Successful creation operations |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server errors |

### Error Handling Patterns

#### Client-Side Error Handling
```typescript
// Toast notification pattern
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'completed' })
  .eq('id', orderId);

if (error) {
  toast.error(`Failed to update order: ${error.message}`);
  console.error('Order update failed:', error);
  return;
}
```

#### Optimistic Updates with Rollback
```typescript
export function useOptimisticUpdate<T>(
  initialState: T,
  updateFn: (newValue: T) => Promise<void>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [value, setValue] = useState<T>(initialState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousValue, setPreviousValue] = useState<T>(initialState);
  const { toast } = useToast();

  const update = async (newValue: T) => {
    // Store previous value for rollback
    setPreviousValue(value);
    setValue(newValue);
    setIsUpdating(true);

    try {
      await updateFn(newValue);
      
      // Success handling
      if (options.successMessage) {
        toast({
          title: 'Success',
          description: options.successMessage,
        });
      }
    } catch (error) {
      // Rollback on error
      setValue(previousValue);
      toast.error(options.errorMessage || 'Operation failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return { value, setValue: update, isUpdating };
}
```

#### Error Boundary Implementation
```typescript
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    // Log to analytics service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            </div>
            
            <p className="text-muted-foreground mb-4">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            
            <div className="bg-muted p-3 rounded-md mb-4 overflow-auto max-h-32">
              <code className="text-sm text-muted-foreground">{this.state.error?.message}</code>
            </div>
            
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Section sources**
- [src/components/ErrorBoundary.tsx](file://src/components/ErrorBoundary.tsx#L1-L40)
- [src/components/RouteErrorBoundary.tsx](file://src/components/RouteErrorBoundary.tsx#L1-L44)
- [src/components/RootErrorBoundary.tsx](file://src/components/RootErrorBoundary.tsx#L1-L48)

## Rate Limiting Policies

### Rate Limiting Strategies

The application implements multiple layers of rate limiting to protect against abuse and ensure fair usage:

#### IP-Based Rate Limiting
- **Anonymous users**: 15 quotes per IP per day
- **Authenticated users**: 20 quotes per user per day
- **Session-based users**: 3 quotes per session per day

#### Tiered Rate Limits
```typescript
// Rate limiting configuration
const rateLimits = {
  anonymous: { limit: 3, period: 'day', identifier: 'session' },
  authenticated: { limit: 20, period: 'day', identifier: 'user' },
  ip: { limit: 15, period: 'day', identifier: 'ip' }
};

// Rate limit check function
async function checkAndUpdateRateLimit(
  supabase: SupabaseClient,
  identifier: string,
  identifierType: 'user' | 'session' | 'ip',
  dailyLimit: number
) {
  const { data, error } = await supabase.rpc('check_and_update_rate_limit', {
    p_identifier: identifier,
    p_identifier_type: identifierType,
    p_daily_limit: dailyLimit
  });

  if (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Fail open for rate limiting errors
  }

  return data;
}
```

#### Rate Limit Headers
When rate limits are exceeded, the API returns appropriate headers:

```typescript
// Rate limit exceeded response
return new Response(
  JSON.stringify({ 
    error: 'Too many requests. Please try again later.',
    code: 'RATE_001',
    retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000),
    requestId
  }),
  { 
    status: 429, 
    headers: { 
      'Content-Type': 'application/json',
      'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString()
    } 
  }
);
```

### Rate Limit Monitoring

Administrators can monitor rate limit violations through dedicated dashboards:

```sql
-- Admin rate limit monitoring policy
CREATE POLICY "Admins can view rate limits"
ON public.ai_quote_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
```

**Section sources**
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L284-L349)
- [supabase/migrations/20251121040812_6c4fea3b-d195-422d-83c9-ade0c9dc73db.sql](file://supabase/migrations/20251121040812_6c4fea3b-d195-422d-83c9-ade0c9dc73db.sql#L1-L25)

## Performance Optimization

### Database Indexing Strategies

#### Core Table Indexes
```sql
-- Orders table optimization
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_workflow_status ON orders(workflow_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- AI Quotes table optimization
CREATE INDEX idx_ai_quotes_customer_email ON ai_quotes(customer_email);
CREATE INDEX idx_ai_quotes_session_id ON ai_quotes(session_id);
CREATE INDEX idx_ai_quotes_created_at ON ai_quotes(created_at DESC);

-- Supplier Orders table optimization
CREATE INDEX idx_supplier_orders_supplier_id ON supplier_orders(supplier_id);
CREATE INDEX idx_supplier_orders_buyer_order_id ON supplier_orders(buyer_order_id);
CREATE INDEX idx_supplier_orders_status ON supplier_orders(status);

-- Production Stages table optimization
CREATE INDEX idx_production_stages_supplier_order_id ON production_stages(supplier_order_id);
CREATE INDEX idx_production_stages_stage_number ON production_stages(stage_number);
CREATE INDEX idx_production_stages_status ON production_stages(status);
```

### Query Optimization Techniques

#### Selective Field Retrieval
```typescript
// Efficient queries with selective field retrieval
const { data, error } = await supabase
  .from('orders')
  .select(`
    id,
    order_number,
    buyer_id,
    supplier_id,
    status,
    created_at
  `)
  .eq('buyer_id', userId)
  .order('created_at', { ascending: false });
```

#### Relationship Loading Optimization
```typescript
// Efficient relationship loading with joins
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    supplier:suppliers(company_name, rating),
    order_documents(*),
    order_messages(*)
  `)
  .eq('id', orderId)
  .maybeSingle();
```

### Caching Strategies

#### React Query Caching
```typescript
// Configurable cache times
export function useSuppliers(filters?: SupplierFilters) {
  return useQuery({
    queryKey: ["suppliers", filters],
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getById(orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}
```

#### Pagination Implementation
```typescript
// Efficient pagination with cursor-based approach
const fetchOrders = async (cursor?: string, limit: number = 20) => {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  return { data, error };
};
```

### Storage Optimization

#### File Upload Optimization
```typescript
// Efficient file upload with compression
const uploadProductionPhoto = async (file: File, stageId: string) => {
  try {
    // Compress image before upload
    const compressedBlob = await compressImage(file);
    
    const fileName = `${stageId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("production-photos")
      .upload(fileName, compressedBlob);

    if (error) throw error;

    const { data } = supabase.storage
      .from("production-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Photo upload failed:', error);
    throw error;
  }
};
```

**Section sources**
- [src/hooks/queries/useSuppliers.ts](file://src/hooks/queries/useSuppliers.ts#L48-L90)
- [src/components/supplier/ProductionStageUpdate.tsx](file://src/components/supplier/ProductionStageUpdate.tsx#L44-L57)

## Common Operations Examples

### Retrieving User Quotes

```typescript
// Get quotes by customer email
const getCustomerQuotes = async (email: string) => {
  const { data, error } = await quoteHelpers.getByEmail(email);
  if (error) {
    console.error('Failed to fetch quotes:', error);
    return [];
  }
  return data;
};

// Usage in React component
const { data: quotes, isLoading } = useQuery({
  queryKey: ['quotes', customerEmail],
  queryFn: () => getCustomerQuotes(customerEmail),
  enabled: !!customerEmail,
});
```

### Updating Order Status

```typescript
// Update order status with optimistic UI
const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    // Optimistic update
    queryClient.setQueryData(['order', orderId], (oldData: any) => ({
      ...oldData,
      status: newStatus,
      updated_at: new Date().toISOString(),
    }));

    // Server update
    const { data, error } = await orderHelpers.updateStatus(orderId, newStatus);
    
    if (error) {
      throw error;
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['order', orderId] });

    return data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    // Error handling is managed by React Query
  }
};
```

### Managing Production Stages

```typescript
// Initialize production stages for new orders
const initializeProductionStages = async (supplierOrderId: string, productType: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('initialize-production-stages', {
      body: { supplier_order_id: supplierOrderId, product_type: productType }
    });

    if (error) throw error;
    
    toast.success('Production stages initialized');
    return data;
  } catch (error) {
    console.error('Failed to initialize production stages:', error);
    toast.error('Failed to initialize production stages');
  }
};

// Update stage progress
const updateStageProgress = async (stageId: string, percentage: number, notes: string) => {
  try {
    const { error } = await supabase
      .from('production_stages')
      .update({
        completion_percentage: percentage,
        notes: notes,
        updated_by: currentUser.id,
      })
      .eq('id', stageId);

    if (error) throw error;
    
    toast.success('Stage updated successfully');
  } catch (error) {
    console.error('Stage update failed:', error);
    toast.error('Failed to update stage');
  }
};
```

### Supplier Management Operations

```typescript
// Search and filter suppliers
const searchSuppliers = (filters: SupplierFilters) => {
  return useSuppliers({
    location: filters.location,
    tier: filters.tier,
    min_moq: filters.minMoq,
    product_category: filters.productCategory,
  });
};

// Create supplier profile
const createSupplierProfile = async (profileData: CreateSupplier) => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        ...profileData,
        user_id: currentUser.id,
        verification_status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Supplier profile created successfully');
    return data;
  } catch (error) {
    console.error('Failed to create supplier profile:', error);
    toast.error('Failed to create supplier profile');
  }
};
```

**Section sources**
- [src/hooks/useQuotes.ts](file://src/hooks/useQuotes.ts#L55-L85)
- [src/hooks/queries/useOrders.ts](file://src/hooks/queries/useOrders.ts#L110-L152)
- [src/hooks/useSupplierOrders.ts](file://src/hooks/useSupplierOrders.ts#L165-L207)

## Troubleshooting Guide

### Common Issues and Solutions

#### Authentication Problems

**Issue**: "Unauthorized" errors when making API requests
**Solution**: Verify authentication token and user session

```typescript
// Check authentication status
const checkAuthStatus = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Redirect to login or show authentication prompt
    console.warn('User not authenticated');
    return false;
  }
  return true;
};
```

#### Rate Limit Exceeded

**Issue**: "Too many requests" errors
**Solution**: Implement exponential backoff and user education

```typescript
// Rate limit handling with retry logic
const makeRateLimitedRequest = async (fn: () => Promise<any>, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error.status === 429 && i < maxRetries - 1) {
        const retryAfter = parseInt(error.headers?.get('retry-after') || '1');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      break;
    }
  }
  
  throw lastError;
};
```

#### Database Connection Issues

**Issue**: "Connection timeout" or "Network error" messages
**Solution**: Implement connection retry logic and offline handling

```typescript
// Connection retry with exponential backoff
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
```

#### Data Consistency Issues

**Issue**: Stale or inconsistent data after updates
**Solution**: Proper cache invalidation and real-time synchronization

```typescript
// Comprehensive cache invalidation
const invalidateRelatedQueries = (resourceType: string, resourceId?: string) => {
  const queryKeys = [
    ['orders'],
    ['suppliers'],
    ['quotes'],
    ['notifications']
  ];

  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: key });
  });

  // Invalidate specific resource if ID provided
  if (resourceId) {
    queryClient.invalidateQueries({ 
      queryKey: [resourceType, resourceId] 
    });
  }
};
```

### Debugging Tools

#### API Request Logging
```typescript
// Enhanced logging for API requests
const logApiRequest = (method: string, url: string, payload?: any) => {
  console.group(`API ${method} Request`);
  console.log('URL:', url);
  console.log('Payload:', payload);
  console.groupEnd();
};

const logApiResponse = (response: any, error?: any) => {
  console.group('API Response');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', response.data);
    console.log('Status:', response.status);
  }
  console.groupEnd();
};
```

#### Performance Monitoring
```typescript
// Request timing and performance monitoring
const measureApiPerformance = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    
    console.log(`${operationName} took ${endTime - startTime}ms`);
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`${operationName} failed after ${endTime - startTime}ms`);
    throw error;
  }
};
```

### Error Recovery Strategies

#### Graceful Degradation
```typescript
// Offline-first approach with fallbacks
const getDataWithFallback = async <T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>
): Promise<T> => {
  try {
    const data = await primaryFn();
    return data;
  } catch (primaryError) {
    console.warn('Primary data fetch failed, trying fallback:', primaryError);
    
    try {
      return await fallbackFn();
    } catch (fallbackError) {
      console.error('Both primary and fallback failed:', fallbackError);
      throw primaryError; // Prefer original error for debugging
    }
  }
};
```

#### Data Validation
```typescript
// Type-safe data validation
const validateApiResponse = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  operation: string
): T => {
  const validationResult = schema.safeParse(data);
  
  if (!validationResult.success) {
    console.error(`API response validation failed for ${operation}:`, validationResult.error);
    throw new Error(`Invalid API response for ${operation}`);
  }
  
  return validationResult.data;
};
```

**Section sources**
- [src/components/ErrorBoundary.tsx](file://src/components/ErrorBoundary.tsx#L1-L40)
- [src/components/RouteErrorBoundary.tsx](file://src/components/RouteErrorBoundary.tsx#L1-L44)