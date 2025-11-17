# Database Type Definitions

This directory contains TypeScript interfaces for all database tables to improve type safety when using the Supabase client.

## Overview

Due to a temporary issue with the auto-generated Supabase types, we're using a loosely-typed client wrapper (`src/lib/supabaseClient.ts`). To maintain type safety, we've created comprehensive TypeScript interfaces for all database tables.

## Usage

### Option 1: Direct Type Assertion

```typescript
import { supabase } from '@/lib/supabaseClient';
import type { Order, Notification } from '@/types/database';

// Query with type assertion
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('buyer_id', userId);

const orders = data as Order[] | null;
```

### Option 2: Type-Safe Helper Functions (Recommended)

```typescript
import { orderHelpers, notificationHelpers } from '@/lib/supabaseHelpers';

// Get orders with automatic type inference
const { data: orders, error } = await orderHelpers.getByBuyerId(userId);
// orders is automatically typed as Order[] | null

// Get order with relations
const { data: orderWithRelations, error } = await orderHelpers.getWithRelations(orderId);
// orderWithRelations is typed as OrderWithRelations | null
```

### Option 3: Generic Query Builder

```typescript
import { queryTable } from '@/lib/supabaseHelpers';
import type { Order } from '@/types/database';

const { data, error } = await queryTable<Order>('orders')
  .select('*')
  .eq('buyer_id', userId);
// data is typed as Order[] | null
```

## Available Types

### Core Tables
- `Order` - Order information
- `Supplier` - Supplier details
- `Notification` - User notifications
- `Invoice` - Payment invoices
- `OrderDocument` - Order-related documents
- `OrderMessage` - Order messaging
- `Profile` - User profiles
- `UserRole` - User role assignments

### AI & Analytics
- `AIQuote` - AI-generated quotes
- `AIUsageLog` - AI usage tracking
- `ConversationContext` - Conversation state
- `ConversationMessage` - Chat messages
- `ConversationAnalytics` - Conversation metrics

### Production
- `ProductionBatch` - Batch production tracking
- `BatchContribution` - Batch order contributions
- `FactoryCapacity` - Factory capacity tracking
- `CapacityUtilizationLog` - Utilization history
- `OrderUpdate` - Production updates
- `QCCheck` - Quality control checks
- `Defect` - QC defect tracking

### Content
- `BlogPost` - Blog articles
- `BlogCategory` - Blog categories
- `BlogComment` - Blog comments
- `CaseStudy` - Customer case studies

### Admin
- `AdminAuditLog` - Admin action tracking
- `Certification` - Company certifications
- `CompanyInfo` - Company details

## Enums

```typescript
type AppRole = 'admin' | 'buyer' | 'supplier' | 'factory';
type VerificationStatus = 'pending' | 'verified' | 'rejected';
type OrderWorkflowStatus = 'quote_requested' | 'quote_provided' | ...;
type ProductionStage = 'yarn_received' | 'knitting' | ...;
type BatchStatus = 'filling' | 'confirmed' | 'in_production' | ...;
```

## Helper Types

### InsertData<T>
Used for inserting new records. Omits auto-generated fields like `id`, `created_at`, `updated_at`:

```typescript
import type { InsertData, Notification } from '@/types/database';

const newNotification: InsertData<Notification> = {
  user_id: userId,
  type: 'order_update',
  title: 'Order Updated',
  message: 'Your order status has changed',
};
```

### UpdateData<T>
Used for updating records. Makes all fields optional except `id` and `created_at`:

```typescript
import type { UpdateData, Order } from '@/types/database';

const updates: UpdateData<Order> = {
  status: 'shipped',
  tracking_number: 'TRACK123',
};
```

### Relations
Some types include relationship interfaces:

```typescript
import type { OrderWithRelations } from '@/types/database';

// Includes nested supplier, documents, messages, and updates
const { data: order } = await orderHelpers.getWithRelations(orderId);
```

## Helper Functions

The `src/lib/supabaseHelpers.ts` file provides pre-built helper functions for common operations:

```typescript
// Orders
orderHelpers.getById(orderId)
orderHelpers.getByBuyerId(buyerId)
orderHelpers.getWithRelations(orderId)
orderHelpers.updateStatus(orderId, status, notes)

// Notifications
notificationHelpers.getByUserId(userId)
notificationHelpers.markAsRead(notificationId)
notificationHelpers.markAllAsRead(userId)
notificationHelpers.create(notification)

// AI Quotes
quoteHelpers.getByEmail(email)
quoteHelpers.getById(quoteId)
quoteHelpers.updateStatus(quoteId, status)
quoteHelpers.create(quote)

// Suppliers
supplierHelpers.getVerified()
supplierHelpers.getById(supplierId)
supplierHelpers.getByUserId(userId)

// User Roles
roleHelpers.getUserRole(userId)
roleHelpers.hasRole(userId, role)
roleHelpers.assignRole(userId, role)

// Profiles
profileHelpers.getByUserId(userId)
profileHelpers.update(userId, updates)

// Invoices
invoiceHelpers.getByOrderId(orderId)
invoiceHelpers.getById(invoiceId)
invoiceHelpers.updateStatus(invoiceId, status)

// Documents
documentHelpers.getByOrderId(orderId)
documentHelpers.upload(document)
documentHelpers.delete(documentId)

// Blog
blogHelpers.getPublishedPosts()
blogHelpers.getBySlug(slug)
blogHelpers.incrementViews(postId)
```

## Best Practices

1. **Always use type assertions or helpers** - Don't rely on `any` types
2. **Use helper functions for common operations** - They provide better type inference
3. **Use `InsertData<T>` for inserts** - Ensures you don't include auto-generated fields
4. **Use `UpdateData<T>` for updates** - All fields are optional for partial updates
5. **Use `.maybeSingle()` instead of `.single()`** - Prevents errors when no data is found

## Example: Complete CRUD Operation

```typescript
import { supabase } from '@/lib/supabaseClient';
import { notificationHelpers } from '@/lib/supabaseHelpers';
import type { Notification, InsertData, UpdateData } from '@/types/database';

// Create
const newNotification: InsertData<Notification> = {
  user_id: 'user-123',
  type: 'order_update',
  title: 'New Order',
  message: 'You have a new order',
  read: false,
};
const { data: created, error: createError } = await notificationHelpers.create(newNotification);

// Read
const { data: notifications, error: readError } = await notificationHelpers.getByUserId('user-123');

// Update
const updates: UpdateData<Notification> = {
  read: true,
  read_at: new Date().toISOString(),
};
const { data: updated, error: updateError } = await supabase
  .from('notifications')
  .update(updates)
  .eq('id', notificationId)
  .select()
  .single();
const typedUpdated = updated as Notification | null;

// Delete
const { error: deleteError } = await supabase
  .from('notifications')
  .delete()
  .eq('id', notificationId);
```
