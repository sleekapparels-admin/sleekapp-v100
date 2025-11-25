# Sleek Apparels Backend API

**Backend-Only Supabase Edge Functions API**

🎯 **Status:** ✅ Backend-Only Project (No Frontend)  
🔌 **Purpose:** API Endpoints for External Next.js Frontend  
⚡ **Functions:** 23 Edge Functions Deployed  

---

## 🎉 Project Overview

This is a **backend-only project** that provides Supabase Edge Functions as API endpoints for the external Next.js frontend. This Lovable project only contains the `/supabase` folder with Edge Functions - no frontend code.

---

## ⚠️ IMPORTANT SETUP INSTRUCTIONS

### Required: Add Build Script to package.json

**You MUST manually add this script to your `package.json` file for Lovable to build correctly:**

```json
{
  "scripts": {
    "build:dev": "vite build --mode development"
  }
}
```

### TypeScript Errors (Expected & Safe to Ignore)

**All TypeScript errors in edge function files are EXPECTED and will NOT affect deployment:**
- Edge functions use Deno runtime with Deno-specific imports (`https://deno.land/...`)
- These Deno types are not available during Vite build process
- Functions will work perfectly when deployed to Supabase
- Build errors related to `supabase/functions/*.ts` can be safely ignored

---

## 🔌 API Base URL

```
https://eqpftggctumujhutomom.supabase.co/functions/v1/
```

## 🔑 Required Headers

```typescript
{
  'apikey': NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>' // For authenticated endpoints only
}
```

---

## 📋 API Endpoints

### Public API Endpoints (No Auth Required)

#### Get Products
```typescript
// GET /get-products?category=t-shirts&search=cotton&featured=true&limit=20
const response = await fetch(`${API_BASE}/get-products?category=t-shirts`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...products] }
```

#### Get Single Product
```typescript
// GET /get-product?id=uuid or ?slug=product-slug
const response = await fetch(`${API_BASE}/get-product?slug=classic-crew-neck-tee`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { id, title, description, price, ... } }
```

#### Get Blog Posts
```typescript
// GET /get-blog-posts?category=guides&limit=10
const response = await fetch(`${API_BASE}/get-blog-posts?category=guides`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...posts] }
```

#### Get Single Blog Post
```typescript
// GET /get-blog-post?slug=post-slug
const response = await fetch(`${API_BASE}/get-blog-post?slug=low-moq-guide`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { id, title, content, ... } }
```

#### Get Certifications
```typescript
// GET /get-certifications
const response = await fetch(`${API_BASE}/get-certifications`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...certifications] }
```

#### Get Company Info
```typescript
// GET /get-company-info
const response = await fetch(`${API_BASE}/get-company-info`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { company details } }
```

#### Get Marketplace Products
```typescript
// GET /get-marketplace-products?category=activewear&supplier_id=uuid&min_price=10&max_price=50
const response = await fetch(`${API_BASE}/get-marketplace-products?category=activewear`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...marketplace_products] }
```

#### Get Single Marketplace Product
```typescript
// GET /get-marketplace-product?id=uuid
const response = await fetch(`${API_BASE}/get-marketplace-product?id=uuid`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { marketplace product details } }
```

#### Get Suppliers
```typescript
// GET /get-suppliers?specialization=knitwear&min_capacity=1000
const response = await fetch(`${API_BASE}/get-suppliers`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...suppliers] }
```

#### Get Single Supplier
```typescript
// GET /get-supplier?id=uuid
const response = await fetch(`${API_BASE}/get-supplier?id=uuid`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { supplier details } }
```

---

### Lead Capture API Endpoints (No Auth Required)

#### Subscribe to Newsletter
```typescript
// POST /subscribe-newsletter
const response = await fetch(`${API_BASE}/subscribe-newsletter`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe' // optional
  })
});

// Response: { success: true, message: 'Subscribed successfully' }
```

#### Submit Sample Request
```typescript
// POST /submit-sample-request
const response = await fetch(`${API_BASE}/submit-sample-request`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'buyer@example.com',
    company: 'Fashion Brand Inc',
    product_interest: 't-shirts'
  })
});

// Response: { success: true, message: 'Sample request submitted' }
```

---

### Authenticated API Endpoints (JWT Required)

#### Get User Profile
```typescript
// GET /get-user-profile
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/get-user-profile`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { user profile } }
```

#### Get User Quotes
```typescript
// GET /get-user-quotes
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/get-user-quotes`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...quotes] }
```

#### Get User Orders
```typescript
// GET /get-user-orders
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/get-user-orders`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...orders] }
```

#### Get Order Tracking (LoopTrace)
```typescript
// GET /get-order-tracking?order_id=uuid
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/get-order-tracking?order_id=uuid`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: { order, production_stages, qc_checks, timeline } }
```

---

### Order Management Endpoints (JWT Required)

#### Create Order
```typescript
// POST /create-order
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/create-order`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product_type: 't-shirts',
    quantity: 500,
    specifications: { color: 'black', size: 'M' },
    target_date: '2025-03-01',
    special_requirements: 'Custom label'
  })
});

// Response: { success: true, data: { order }, message: 'Order created successfully' }
```

#### Update Order Status
```typescript
// POST /update-order-status
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/update-order-status`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    order_id: 'uuid',
    status: 'in_production',
    notes: 'Production started'
  })
});

// Response: { success: true, data: { updated order } }
```

#### Get Production Stages
```typescript
// GET /get-production-stages?order_id=uuid
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/get-production-stages?order_id=uuid`, {
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});

// Response: { success: true, data: [...production_stages] }
```

#### Update Production Stage
```typescript
// POST /update-production-stage
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/update-production-stage`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    stage_id: 'uuid',
    completion_percentage: 75,
    notes: 'Progress update',
    photos: ['url1', 'url2']
  })
});

// Response: { success: true, data: { updated stage } }
```

---

## 💳 Payment Processing Endpoints

### Create Payment Intent
```typescript
// POST /create-payment-intent
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/create-payment-intent`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1500.00,
    currency: 'usd',
    order_id: 'uuid',
    customer_email: 'buyer@example.com'
  })
});

// Response: { success: true, data: { client_secret: 'pi_xxx', payment_intent_id: 'pi_xxx' } }
```

### Process Payment
```typescript
// POST /process-payment
// Headers: { Authorization: Bearer <JWT> }
const response = await fetch(`${API_BASE}/process-payment`, {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    payment_intent_id: 'pi_xxx',
    order_id: 'uuid'
  })
});

// Response: { success: true, data: { payment_status: 'succeeded', amount_received: 1500.00 } }
```

### Handle Webhooks
```typescript
// POST /handle-webhooks
// Public endpoint for Stripe webhook events
// Configure in Stripe Dashboard: https://dashboard.stripe.com/webhooks
// Webhook URL: https://eqpftggctumujhutomom.supabase.co/functions/v1/handle-webhooks

// Handled events:
// - payment_intent.succeeded
// - payment_intent.payment_failed
// - payment_intent.canceled

// Stripe will send webhook with signature header
```

---

## 🔧 Environment Variables for Next.js

Add these to your Next.js `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eqpftggctumujhutomom.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGZ0Z2djdHVtdWpodXRvbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc5NzAsImV4cCI6MjA3ODc0Mzk3MH0.7KkuzAPJlU7PR6lOIKi_zZi31oUhWk_MGUzYhxGYehw
```

---

## 🚀 Integration Example (Next.js)

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL + '/functions/v1';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getProducts(category?: string) {
  const url = new URL(`${API_BASE}/get-products`);
  if (category) url.searchParams.set('category', category);
  
  const res = await fetch(url.toString(), {
    headers: {
      'apikey': ANON_KEY,
      'Content-Type': 'application/json'
    }
  });
  
  return res.json();
}

export async function getUserOrders(token: string) {
  const res = await fetch(`${API_BASE}/get-user-orders`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return res.json();
}
```

---

## 📊 Complete API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/get-products` | GET | No | List all products |
| `/get-product` | GET | No | Get single product |
| `/get-blog-posts` | GET | No | List blog posts |
| `/get-blog-post` | GET | No | Get single blog post |
| `/get-certifications` | GET | No | List certifications |
| `/get-company-info` | GET | No | Get company details |
| `/get-marketplace-products` | GET | No | List marketplace products |
| `/get-marketplace-product` | GET | No | Get single marketplace product |
| `/get-suppliers` | GET | No | List suppliers |
| `/get-supplier` | GET | No | Get single supplier |
| `/subscribe-newsletter` | POST | No | Newsletter signup |
| `/submit-sample-request` | POST | No | Sample pack request |
| `/get-user-profile` | GET | Yes | Get user profile |
| `/get-user-quotes` | GET | Yes | Get user quotes |
| `/get-user-orders` | GET | Yes | Get user orders |
| `/get-order-tracking` | GET | Yes | Track order production |
| `/create-order` | POST | Yes | Create new order |
| `/update-order-status` | POST | Yes | Update order status |
| `/get-production-stages` | GET | Yes | Get production stages |
| `/update-production-stage` | POST | Yes | Update production stage |
| `/create-payment-intent` | POST | Yes | Create Stripe payment intent |
| `/process-payment` | POST | Yes | Process payment |
| `/handle-webhooks` | POST | No | Stripe webhook handler |

---

## 🔐 Authentication Flow

1. User signs up/logs in via Supabase Auth in Next.js frontend
2. Get JWT token from `supabase.auth.getSession()`
3. Pass token in `Authorization: Bearer <token>` header
4. Backend validates JWT and returns user-specific data

---

## ⚠️ Important Notes

**TypeScript Errors:** You will see TypeScript errors for Edge Functions in the Lovable build output. These are **expected** and **do not affect deployment**. Edge Functions use Deno runtime, and TypeScript cannot find Deno type definitions during build. The functions will work perfectly when deployed.

**Build Script:** Add this to your `package.json` scripts section manually:
```json
{
  "scripts": {
    "build:dev": "vite build --mode development"
  }
}
```

---

## 📞 Support

This backend API serves the external Next.js frontend at Sleek Apparels Limited.

**Backend Status:** ✅ All 23 Edge Functions Deployed
