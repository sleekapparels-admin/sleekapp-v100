# Serverless Functions API

<cite>
**Referenced Files in This Document**   
- [logger.ts](file://supabase/functions/_shared/logger.ts)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts)
- [useOrderManagement.ts](file://src/hooks/useOrderManagement.ts)
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)
- [ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts)
- [convert-quote-to-order/index.ts](file://supabase/functions/convert-quote-to-order/index.ts)
- [initialize-production-stages/index.ts](file://supabase/functions/initialize-production-stages/index.ts)
- [generate-invoice/index.ts](file://supabase/functions/generate-invoice/index.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts)
- [track-product-interaction/index.ts](file://supabase/functions/track-product-interaction/index.ts)
- [track-social-share/index.ts](file://supabase/functions/track-social-share/index.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [health/index.ts](file://supabase/functions/health/index.ts)
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts)
- [resend-webhook/index.ts](file://supabase/functions/resend-webhook/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [AI-Powered Services](#ai-powered-services)
3. [Business Process Automation](#business-process-automation)
4. [Security Functions](#security-functions)
5. [Analytics Services](#analytics-services)
6. [Health Check and Webhook Integration](#health-check-and-webhook-integration)
7. [Shared Utilities](#shared-utilities)
8. [Rate Limiting and Monitoring](#rate-limiting-and-monitoring)
9. [Implementation Examples](#implementation-examples)
10. [Security Policies](#security-policies)

## Introduction
The Supabase serverless functions API in sleekapp-v100 provides a comprehensive suite of backend services for the apparel manufacturing platform. These functions handle AI-powered quote generation, business process automation, security operations, and analytics tracking. The API is designed to be invoked via `supabase.functions.invoke()` from the frontend, with each function following a consistent pattern of request validation, authentication checks, business logic execution, and response formatting. The functions are organized into logical groups based on their functionality, with shared utilities for logging and error handling.

**Section sources**
- [logger.ts](file://supabase/functions/_shared/logger.ts)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts)

## AI-Powered Services
The AI-powered services group includes functions that leverage artificial intelligence to enhance the user experience and provide intelligent recommendations. These functions integrate with external AI services like Lovable AI and Perplexity to deliver sophisticated capabilities.

### ai-quote-generator
This function generates AI-powered quotes for apparel manufacturing requests. It uses Bangladesh manufacturing standards and integrates with Lovable AI for intelligent suggestions.

**HTTP Endpoint Pattern**: `POST /functions/v1/ai-quote-generator`

**Request Schema**:
```json
{
  "productType": "string",
  "quantity": "number",
  "complexityLevel": "enum[simple,medium,complex]",
  "fabricType": "string",
  "additionalRequirements": "string",
  "customerEmail": "string",
  "customerName": "string",
  "targetDate": "string",
  "files": "array",
  "sessionId": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "quote": {
    "id": "string",
    "total_price": "number",
    "estimated_delivery_days": "number",
    "quote_data": "object",
    "ai_suggestions": "string"
  },
  "timeline": "array",
  "aiInsights": "string"
}
```

**Authentication Requirements**: Optional (supports both authenticated and anonymous users)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('ai-quote-generator', {
  body: {
    productType: 't-shirt',
    quantity: 100,
    customerEmail: 'user@example.com'
  }
});
```

**Implementation Example from aiQuote.ts**:
The `generateAIQuote` function in `aiQuote.ts` demonstrates how to invoke this function with proper error handling and context provision.

**Section sources**
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts)

### ai-conversational-quote
This function generates conversational quotes by integrating market research data with AI analysis. It creates a more interactive quote experience by combining multiple data sources.

**HTTP Endpoint Pattern**: `POST /functions/v1/ai-conversational-quote`

**Request Schema**:
```json
{
  "productType": "string",
  "quantity": "number",
  "fabricType": "string",
  "complexity": "string",
  "additionalRequirements": "string",
  "customerEmail": "string",
  "customerName": "string",
  "country": "string",
  "phoneNumber": "string",
  "sessionId": "string",
  "marketResearchId": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "quote": {
    "id": "string",
    "unitPrice": "number",
    "totalPrice": "number",
    "estimatedDeliveryDays": "number",
    "confidenceScore": "number",
    "priceBreakdown": "object",
    "priceJustification": "string",
    "comparableProducts": "array",
    "suggestions": "string"
  }
}
```

**Authentication Requirements**: None (public endpoint)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('ai-conversational-quote', {
  body: {
    productType: 'hoodie',
    quantity: 200,
    customerEmail: 'user@example.com'
  }
});
```

**Section sources**
- [ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)

### ai-market-research
This function performs market research by querying external sources and caching results for efficiency. It uses Perplexity AI to gather current manufacturing costs and market data.

**HTTP Endpoint Pattern**: `POST /functions/v1/ai-market-research`

**Request Schema**:
```json
{
  "productType": "string",
  "quantity": "number",
  "fabricType": "string",
  "complexity": "string",
  "additionalRequirements": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "cached": "boolean",
  "research": {
    "averageUnitCost": "number",
    "materialCostPerUnit": "number",
    "leadTimeDays": "number",
    "markupPercentage": "number",
    "comparableProducts": "array",
    "sources": "array",
    "confidenceScore": "number"
  },
  "sources": "array",
  "confidence_score": "number",
  "cache_id": "string"
}
```

**Authentication Requirements**: None (public endpoint)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('ai-market-research', {
  body: {
    productType: 'polo shirt',
    quantity: 500
  }
});
```

**Implementation Example**:
The `ai-conversational-quote` function automatically invokes this function when no `marketResearchId` is provided, demonstrating the integration between AI services.

**Section sources**
- [ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts)

## Business Process Automation
The business process automation functions handle key workflows in the order management lifecycle, from quote conversion to production initialization and invoicing.

### convert-quote-to-order
This function converts an AI-generated quote into a formal order, creating the necessary database records and sending confirmation emails.

**HTTP Endpoint Pattern**: `POST /functions/v1/convert-quote-to-order`

**Request Schema**:
```json
{
  "quoteId": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "order": {
    "id": "string",
    "orderNumber": "string",
    "trackingToken": "string",
    "trackingUrl": "string"
  }
}
```

**Authentication Requirements**: Required (user must be authenticated)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('convert-quote-to-order', {
  body: { quoteId: 'quote-123' }
});
```

**Implementation Example from useOrders.ts**:
The `convertQuoteToOrder` function in `aiQuote.ts` demonstrates how to invoke this function with proper authentication checks.

**Section sources**
- [convert-quote-to-order/index.ts](file://supabase/functions/convert-quote-to-order/index.ts)
- [aiQuote.ts](file://src/lib/api/aiQuote.ts)

### initialize-production-stages
This function initializes the production stages for a supplier order based on the product type, creating a timeline of manufacturing steps.

**HTTP Endpoint Pattern**: `POST /functions/v1/initialize-production-stages`

**Request Schema**:
```json
{
  "supplier_order_id": "string",
  "product_type": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "stages": "array"
}
```

**Authentication Requirements**: Required (service role key)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('initialize-production-stages', {
  body: {
    supplier_order_id: 'so-123',
    product_type: 't-shirt'
  }
});
```

**Section sources**
- [initialize-production-stages/index.ts](file://supabase/functions/initialize-production-stages/index.ts)

### generate-invoice
This function generates professional invoices using AI-generated HTML and sends them via email through Resend.

**HTTP Endpoint Pattern**: `POST /functions/v1/generate-invoice`

**Request Schema**:
```json
{
  "invoice_id": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "invoice_url": "string",
  "email_id": "string"
}
```

**Authentication Requirements**: Required (user must be buyer or admin)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('generate-invoice', {
  body: { invoice_id: 'inv-123' }
});
```

**Section sources**
- [generate-invoice/index.ts](file://supabase/functions/generate-invoice/index.ts)

## Security Functions
The security functions provide essential security features including OTP verification, password breach checking, and admin role validation.

### password-breach-check
This function checks passwords against the Have I Been Pwned database using k-anonymity to protect user privacy.

**HTTP Endpoint Pattern**: `POST /functions/v1/password-breach-check`

**Request Schema**:
```json
{
  "password": "string"
}
```

**Response Schema**:
```json
{
  "pwned": "boolean",
  "count": "number"
}
```

**Authentication Requirements**: None

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('password-breach-check', {
  body: { password: 'userpassword' }
});
```

**Section sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)

### verify-otp
This function verifies one-time passwords for both phone and email verification, with different workflows for quote generation and supplier registration.

**HTTP Endpoint Pattern**: `POST /functions/v1/verify-otp`

**Request Schema**:
```json
{
  "type": "enum[phone,email-quote,email-supplier]",
  "phone": "string",
  "email": "string",
  "otp": "string"
}
```

**Response Schema**:
```json
{
  "success": "boolean",
  "verified": "boolean",
  "message": "string",
  "quotesUsedToday": "number",
  "quotesRemaining": "number"
}
```

**Authentication Requirements**: Conditional (phone verification requires authentication)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('verify-otp', {
  body: {
    type: 'email-quote',
    email: 'user@example.com',
    otp: '123456'
  }
});
```

**Section sources**
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

### admin-check
This function verifies if the authenticated user has admin privileges by checking their role in the user_roles table.

**HTTP Endpoint Pattern**: `POST /functions/v1/admin-check`

**Request Schema**: None (uses Authorization header)

**Response Schema**:
```json
{
  "isAdmin": "boolean"
}
```

**Authentication Requirements**: Required (Authorization header with Bearer token)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('admin-check');
```

**Section sources**
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts)

## Analytics Services
The analytics functions track user interactions and social sharing to provide insights into user behavior and marketing effectiveness.

### track-product-interaction
This function tracks various product interactions such as hovers, clicks, and wishlist additions.

**HTTP Endpoint Pattern**: `POST /functions/v1/track-product-interaction`

**Request Schema**:
```json
{
  "productId": "string",
  "interactionType": "enum[hover,quick_view_click,wishlist_click,color_swatch_click,design_click,quote_click,add_to_cart,view_details]",
  "sessionId": "string",
  "additionalData": "object"
}
```

**Response Schema**: 204 No Content (fire and forget)

**Authentication Requirements**: Optional (tracks both authenticated and anonymous users)

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('track-product-interaction', {
  body: {
    productId: 'prod-123',
    interactionType: 'quote_click',
    sessionId: 'session-123'
  }
});
```

**Section sources**
- [track-product-interaction/index.ts](file://supabase/functions/track-product-interaction/index.ts)

### track-social-share
This function tracks when users share blog posts on social media platforms.

**HTTP Endpoint Pattern**: `POST /functions/v1/track-social-share`

**Request Schema**:
```json
{
  "post_id": "string",
  "platform": "enum[linkedin,facebook,twitter,whatsapp]"
}
```

**Response Schema**:
```json
{
  "success": "boolean"
}
```

**Authentication Requirements**: None

**Invocation Method**:
```typescript
const { data, error } = await supabase.functions.invoke('track-social-share', {
  body: {
    post_id: 'post-123',
    platform: 'twitter'
  }
});
```

**Section sources**
- [track-social-share/index.ts](file://supabase/functions/track-social-share/index.ts)

## Health Check and Webhook Integration
These functions provide system health monitoring and integration with external services through webhooks.

### health
This function provides a health check endpoint that verifies the database connection.

**HTTP Endpoint Pattern**: `GET /functions/v1/health`

**Request Schema**: None

**Response Schema**:
```json
{
  "status": "enum[healthy,unhealthy]",
  "requestId": "string"
}
```

**Authentication Requirements**: None

**Invocation Method**:
```typescript
const { data, error } = await fetch('/functions/v1/health');
```

**Section sources**
- [health/index.ts](file://supabase/functions/health/index.ts)

### stripe-webhook
This function handles webhook events from Stripe for payment processing.

**HTTP Endpoint Pattern**: `POST /functions/v1/stripe-webhook`

**Request Schema**: Raw Stripe webhook payload

**Response Schema**: 200 OK or 400 Bad Request

**Authentication Requirements**: Signature verification via Stripe signing secret

**Section sources**
- [stripe-webhook/index.ts](file://supabase/functions/stripe-webhook/index.ts)

### resend-webhook
This function handles webhook events from Resend for email delivery status.

**HTTP Endpoint Pattern**: `POST /functions/v1/resend-webhook`

**Request Schema**: Raw Resend webhook payload

**Response Schema**: 200 OK

**Authentication Requirements**: Signature verification via Resend signing secret

**Section sources**
- [resend-webhook/index.ts](file://supabase/functions/resend-webhook/index.ts)

## Shared Utilities
The serverless functions share common utilities for logging, error handling, and input validation.

### Logger Utility
The shared logger provides structured logging with PII sanitization to protect sensitive data while maintaining debuggability.

**Key Features**:
- Automatic sanitization of email addresses, phone numbers, and order IDs
- Structured JSON logging with timestamp, level, context, and message
- Support for info, warn, error, and success log levels
- PII field detection and redaction

**Usage Example**:
```typescript
import { createLogger } from '../_shared/logger.ts';
const logger = createLogger('my-function');
logger.info('Processing request', { userId: 'user-123', email: 'user@example.com' });
```

**Section sources**
- [logger.ts](file://supabase/functions/_shared/logger.ts)

### Error Handling Patterns
The functions follow consistent error handling patterns with appropriate HTTP status codes and client-friendly error messages.

**Key Patterns**:
- Input validation using Zod schema validation
- Rate limiting with tiered limits for authenticated vs. anonymous users
- Generic error messages for security (avoiding information disclosure)
- Detailed server-side logging for debugging
- Graceful degradation when external services fail

**Section sources**
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Rate Limiting and Monitoring
The API implements comprehensive rate limiting and monitoring to ensure reliability and prevent abuse.

### Rate Limiting Strategy
The functions use a multi-layered rate limiting approach:

**IP-based Rate Limiting**:
- 15 requests per IP per day for `ai-quote-generator`
- 5 requests per IP per hour for `ai-conversational-quote`
- 10 requests per IP per hour for `ai-market-research`

**User-based Rate Limiting**:
- 20 requests per day for authenticated users on `ai-quote-generator`
- 3 requests per day for anonymous users on `ai-quote-generator`

**Email-based Rate Limiting**:
- 10 requests per email per day for `ai-conversational-quote`

**Implementation**:
Rate limiting is implemented using the `ai_quote_rate_limits` table, which tracks request counts by identifier (IP, user ID, email) and type.

**Section sources**
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)
- [ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts)

### Function Timeout Settings
The functions have appropriate timeout settings based on their complexity:

- **AI functions**: 30 seconds (due to external API calls)
- **Database operations**: 15 seconds
- **Simple operations**: 5 seconds

### Monitoring Approaches
The API uses several monitoring approaches:

**AI Usage Tracking**:
- Logs AI usage in the `ai_usage_logs` table
- Tracks estimated costs for budgeting
- Monitors function performance

**Error Monitoring**:
- Comprehensive logging with structured JSON
- Error tracking in Supabase logs
- Client-side error reporting

**Performance Monitoring**:
- Request timing metrics
- Database query performance
- External API response times

**Section sources**
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)

## Implementation Examples
This section provides concrete examples of how to implement key workflows using the serverless functions API.

### OTP Verification Flow
The OTP verification flow demonstrates how to implement secure email and phone verification:

```typescript
// 1. Send OTP
const sendOTP = async (type: 'email-quote' | 'email-supplier' | 'phone', identifier: string) => {
  const { data, error } = await supabase.functions.invoke('send-otp', {
    body: { type, email: type.includes('email') ? identifier : undefined, phone: type === 'phone' ? identifier : undefined }
  });
  return { data, error };
};

// 2. Verify OTP
const verifyOTP = async (type: 'email-quote' | 'email-supplier' | 'phone', identifier: string, otp: string) => {
  const { data, error } = await supabase.functions.invoke('verify-otp', {
    body: { type, email: type.includes('email') ? identifier : undefined, phone: type === 'phone' ? identifier : undefined, otp }
  });
  return { data, error };
};

// 3. Complete verification workflow
const completeVerification = async () => {
  // Send OTP
  const sendResult = await sendOTP('email-quote', 'user@example.com');
  if (sendResult.error) throw sendResult.error;

  // User enters OTP
  const userOTP = '123456'; // From user input

  // Verify OTP
  const verifyResult = await verifyOTP('email-quote', 'user@example.com', userOTP);
  if (verifyResult.error) throw verifyResult.error;

  return verifyResult.data;
};
```

**Section sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

### AI Market Research Integration
This example shows how to integrate AI market research into a quote generation workflow:

```typescript
// Get market research data
const getMarketResearch = async (productType: string, quantity: number) => {
  const { data, error } = await supabase.functions.invoke('ai-market-research', {
    body: { productType, quantity }
  });
  return { data, error };
};

// Generate conversational quote with market research
const generateConversationalQuote = async (request: any) => {
  // Get market research
  const researchResult = await getMarketResearch(request.productType, request.quantity);
  if (researchResult.error) throw researchResult.error;

  // Generate quote with research data
  const { data, error } = await supabase.functions.invoke('ai-conversational-quote', {
    body: {
      ...request,
      marketResearchId: researchResult.data.cache_id
    }
  });
  return { data, error };
};
```

**Section sources**
- [ai-market-research/index.ts](file://supabase/functions/ai-market-research/index.ts)
- [ai-conversational-quote/index.ts](file://supabase/functions/ai-conversational-quote/index.ts)

## Security Policies
The serverless functions API implements comprehensive security policies to protect data and prevent abuse.

### Function Access Security
The functions follow the principle of least privilege with appropriate access controls:

**Public Functions**:
- `ai-quote-generator`
- `ai-conversational-quote`
- `ai-market-research`
- `track-product-interaction`
- `track-social-share`
- `health`

**Authenticated Functions**:
- `convert-quote-to-order` (requires user authentication)
- `generate-invoice` (requires buyer or admin authentication)
- `admin-check` (requires authentication)

**Service Role Functions**:
- Functions that require direct database access use the service role key for elevated privileges.

### Input Validation Requirements
All functions implement strict input validation:

**Schema Validation**:
- Uses Zod for comprehensive schema validation
- Validates data types, ranges, and formats
- Provides detailed error messages for invalid input

**Security Validation**:
- Email format validation with comprehensive regex
- Blocking of disposable email domains
- Phone number format validation
- Sanitization of user input to prevent injection attacks

**Rate Limiting**:
- Multi-layered rate limiting as described in the Rate Limiting section
- Protection against brute force attacks
- Prevention of service abuse

**Section sources**
- [ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)