# Vercel Deployment Configuration

<cite>
**Referenced Files in This Document**
- [vercel.json](file://vercel.json)
- [vite.config.ts](file://vite.config.ts)
- [package.json](file://package.json)
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts)
- [update-supabase-key.sh](file://update-supabase-key.sh)
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts)
- [supabase/functions/submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts)
- [supabase/functions/health/index.ts](file://supabase/functions/health/index.ts)
- [netlify.toml](file://netlify.toml)
- [public/sw.js](file://public/sw.js)
- [README.md](file://README.md)
- [DEPLOYMENT_SUMMARY.md](file://DEPLOYMENT_SUMMARY.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Vercel Configuration Overview](#vercel-configuration-overview)
3. [Edge Functions Setup](#edge-functions-setup)
4. [Build Configuration](#build-configuration)
5. [Environment Variables](#environment-variables)
6. [Rewrite Rules and Routing](#rewrite-rules-and-routing)
7. [Static Asset Optimization](#static-asset-optimization)
8. [Preview Deployments](#preview-deployments)
9. [Common Issues and Solutions](#common-issues-and-solutions)
10. [Deployment Workflow](#deployment-workflow)
11. [Debugging and Monitoring](#debugging-and-monitoring)

## Introduction

The sleekapp-v100 project utilizes Vercel for deployment, leveraging its edge functions, automatic preview deployments, and optimized static asset delivery. This comprehensive guide covers the Vercel configuration, edge function implementation, and deployment best practices for the React application built with Vite and Supabase integration.

Vercel's platform provides several advantages for this project:
- **Edge Functions**: Serverless functions for API routing and backend logic
- **Automatic Preview Deployments**: Pull request-based staging environments
- **Global CDN**: Fast content delivery worldwide
- **Zero-Config Builds**: Seamless integration with Vite and React
- **Custom Domains**: Flexible domain management

## Vercel Configuration Overview

The Vercel deployment configuration is defined in the `vercel.json` file, which serves as the central configuration hub for the deployment pipeline.

### Basic Configuration Structure

The current Vercel configuration is minimal but effective:

```mermaid
graph TB
subgraph "Vercel Deployment Pipeline"
A[Git Push] --> B[Vercel Build]
B --> C[Static Assets]
B --> D[Edge Functions]
C --> E[Global CDN]
D --> F[Serverless Runtime]
E --> G[Production Site]
F --> G
end
subgraph "Application Architecture"
H[React SPA] --> I[Edge Functions]
I --> J[Supabase Backend]
K[Static Assets] --> L[CDN Distribution]
end
```

**Diagram sources**
- [vercel.json](file://vercel.json#L1-L6)
- [vite.config.ts](file://vite.config.ts#L1-L216)

**Section sources**
- [vercel.json](file://vercel.json#L1-L6)
- [vite.config.ts](file://vite.config.ts#L1-L216)

## Edge Functions Setup

The project leverages Supabase edge functions integrated with Vercel's serverless platform. These functions handle API routes, business logic, and backend operations.

### Edge Function Architecture

```mermaid
sequenceDiagram
participant Client as Browser
participant Vercel as Vercel Edge Runtime
participant Supabase as Supabase Functions
participant DB as PostgreSQL
Client->>Vercel : API Request
Vercel->>Supabase : Route to Edge Function
Supabase->>Supabase : Validate Request
Supabase->>DB : Database Operations
DB-->>Supabase : Query Results
Supabase->>Supabase : Process Data
Supabase-->>Vercel : JSON Response
Vercel-->>Client : HTTP Response
```

**Diagram sources**
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L1-L753)
- [supabase/functions/submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts#L1-L222)

### Available Edge Functions

The project includes numerous edge functions organized by functionality:

| Function Category | Functions | Purpose |
|------------------|-----------|---------|
| **AI Services** | `ai-quote-generator`, `ai-conversational-quote`, `ai-design-generator` | AI-powered quote generation and design assistance |
| **Business Logic** | `submit-quote`, `convert-quote-to-order`, `send-otp` | Quote processing and user authentication |
| **Data Management** | `generate-invoice`, `track-product-interaction`, `analytics-service` | Business intelligence and reporting |
| **Communication** | `email-service`, `send-resource-email`, `resend-webhook` | Email automation and webhook handling |
| **Automation** | `execute-automation-rules`, `batch-processor`, `bootstrap-admin` | System automation and maintenance |

### Edge Function Implementation Details

Each edge function follows a consistent pattern for security, validation, and error handling:

```mermaid
flowchart TD
A[Incoming Request] --> B{Method Check}
B --> |OPTIONS| C[CORS Headers]
B --> |Other| D[Origin Validation]
D --> E{Allowed Origin?}
E --> |No| F[403 Forbidden]
E --> |Yes| G[Rate Limiting]
G --> H{Rate Limit Exceeded?}
H --> |Yes| I[429 Too Many Requests]
H --> |No| J[Process Request]
J --> K[Database Operations]
K --> L[Response Formatting]
L --> M[Return Response]
C --> M
F --> M
I --> M
```

**Diagram sources**
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L131-L202)
- [supabase/functions/submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts#L44-L114)

**Section sources**
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L1-L753)
- [supabase/functions/submit-quote/index.ts](file://supabase/functions/submit-quote/index.ts#L1-L222)

## Build Configuration

The Vite configuration drives the build process, optimizing the application for production deployment on Vercel.

### Build Optimization Strategy

```mermaid
graph LR
subgraph "Build Pipeline"
A[Source Code] --> B[Vite Build]
B --> C[Code Splitting]
B --> D[Asset Optimization]
B --> E[Bundle Analysis]
end
subgraph "Optimization Techniques"
C --> F[Dynamic Imports]
C --> G[Route-based Splitting]
D --> H[Gzip/Brotli Compression]
D --> I[Image Optimization]
E --> J[Bundle Size Monitoring]
end
subgraph "Output Assets"
F --> K[JavaScript Chunks]
G --> L[Route-specific Bundles]
H --> M[Compressed Files]
I --> N[Optimized Images]
J --> O[Performance Reports]
end
```

**Diagram sources**
- [vite.config.ts](file://vite.config.ts#L86-L210)

### Key Build Configurations

The Vite configuration implements several optimization strategies:

| Configuration | Purpose | Impact |
|--------------|---------|--------|
| **Code Splitting** | Reduces initial bundle size | Faster page loads |
| **Asset Optimization** | Minifies and compresses resources | Reduced bandwidth usage |
| **Tree Shaking** | Removes unused code | Smaller bundle sizes |
| **Caching Strategy** | Long-term caching for static assets | Improved repeat visits |

### Environment-Specific Builds

The build process adapts to different environments:

```mermaid
flowchart TD
A[Build Command] --> B{Environment}
B --> |Development| C[Dev Server]
B --> |Production| D[Optimized Build]
C --> E[Hot Reload]
D --> F[Code Splitting]
D --> G[Asset Optimization]
D --> H[Compression]
F --> I[Production Bundle]
G --> I
H --> I
```

**Diagram sources**
- [vite.config.ts](file://vite.config.ts#L11-L216)

**Section sources**
- [vite.config.ts](file://vite.config.ts#L1-L216)
- [package.json](file://package.json#L1-L115)

## Environment Variables

Proper environment variable configuration is crucial for Supabase integration and application functionality.

### Supabase Configuration

The application requires specific environment variables for Supabase integration:

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://eqpftggctumujhutomom.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Payment processing | `pk_test_...` |

### Environment Validation

The application includes comprehensive environment validation:

```mermaid
flowchart TD
A[Application Start] --> B[Import Environment Validator]
B --> C[Validate Required Variables]
C --> D{All Variables Present?}
D --> |No| E[Log Error & Throw Exception]
D --> |Yes| F[Validate URL Format]
F --> G{URL Valid?}
G --> |No| H[Log Format Error]
G --> |Yes| I[Validate Key Format]
I --> J{Key Format Valid?}
J --> |No| K[Log Key Error]
J --> |Yes| L[Mark as Validated]
E --> M[Application Failure]
H --> M
K --> M
L --> N[Application Ready]
```

**Diagram sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L29-L48)

### Secure Environment Management

The project provides secure environment variable management:

**Section sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L1-L142)
- [src/integrations/supabase/client.ts](file://src/integrations/supabase/client.ts#L1-L20)
- [update-supabase-key.sh](file://update-supabase-key.sh#L1-L54)

## Rewrite Rules and Routing

Vercel's rewrite configuration enables seamless React Router integration while maintaining clean URLs.

### SPA Routing Configuration

The current rewrite configuration handles single-page application routing:

```mermaid
graph LR
subgraph "URL Routing"
A[User Visits /about] --> B[Vercel Rewrite]
B --> C[index.html]
C --> D[React Router]
D --> E[About Component]
F[User Visits /api/quotes] --> G[Direct API Call]
G --> H[Edge Function]
H --> I[Supabase Backend]
end
```

**Diagram sources**
- [vercel.json](file://vercel.json#L2-L4)

### Route Handling Strategy

The application employs a hybrid routing approach:

| Route Pattern | Handler | Purpose |
|--------------|---------|---------|
| `/api/*` | Edge Functions | Backend API endpoints |
| `/*` | SPA Router | Client-side routing |
| `/static/*` | Static Assets | Optimized resource delivery |

### API Route Implementation

Edge functions serve as the backend API layer:

```mermaid
sequenceDiagram
participant Browser as Client Browser
participant Vercel as Vercel Router
participant Edge as Edge Function
participant Supabase as Supabase
Browser->>Vercel : GET /api/ai-quote
Vercel->>Edge : Route to ai-quote-generator
Edge->>Edge : Validate Request
Edge->>Supabase : Database Query
Supabase-->>Edge : Query Results
Edge->>Edge : Process Data
Edge-->>Browser : JSON Response
```

**Diagram sources**
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L254-L257)

**Section sources**
- [vercel.json](file://vercel.json#L1-L6)
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L254-L257)

## Static Asset Optimization

Vercel automatically optimizes static assets for performance and efficient delivery.

### Asset Optimization Strategy

```mermaid
graph TB
subgraph "Asset Pipeline"
A[Original Assets] --> B[Vite Processing]
B --> C[Compression]
B --> D[Hashing]
B --> E[Optimization]
end
subgraph "Optimization Techniques"
C --> F[Gzip/Brotli]
D --> G[Content Hashing]
E --> H[Image Optimization]
E --> I[CSS Minification]
end
subgraph "CDN Delivery"
F --> J[Global CDN]
G --> J
H --> J
I --> J
end
```

**Diagram sources**
- [vite.config.ts](file://vite.config.ts#L195-L207)

### Cache-Control Headers

The application implements sophisticated caching strategies:

| Asset Type | Cache Duration | Strategy |
|------------|---------------|----------|
| JavaScript | 1 year | Immutable caching |
| CSS | 1 year | Immutable caching |
| Images | 1 year | Immutable caching |
| Fonts | 1 year | Immutable caching |
| HTML | 0 seconds | Must-revalidate |

### Service Worker Integration

The project includes a service worker for advanced caching:

```mermaid
flowchart TD
A[Network Request] --> B{Asset Type}
B --> |HTML| C[Network First]
B --> |JS/CSS| D[Cache First]
B --> |Images| E[Cache First]
B --> |Other| F[Network First]
C --> G[Fetch from Network]
D --> H[Check Cache]
E --> H
F --> G
G --> I{Network Available?}
I --> |Yes| J[Update Cache]
I --> |No| K[Return Cached]
J --> L[Return Response]
K --> L
H --> M{Cached?}
M --> |Yes| N[Return Cached]
M --> |No| O[Fetch & Cache]
N --> L
O --> L
```

**Diagram sources**
- [public/sw.js](file://public/sw.js#L119-L219)

**Section sources**
- [vite.config.ts](file://vite.config.ts#L195-L207)
- [public/sw.js](file://public/sw.js#L119-L219)
- [netlify.toml](file://netlify.toml#L1-L122)

## Preview Deployments

Vercel's preview deployment system enables safe testing of pull requests before merging.

### Preview Deployment Workflow

```mermaid
sequenceDiagram
participant Dev as Developer
participant GitHub as GitHub
participant Vercel as Vercel Preview
participant Review as Reviewer
Dev->>GitHub : Create Pull Request
GitHub->>Vercel : Trigger Preview Build
Vercel->>Vercel : Build Preview Environment
Vercel-->>GitHub : Deploy Preview URL
GitHub-->>Dev : Notify Build Status
Review->>Vercel : Access Preview Site
Review->>Vercel : Test Changes
Review->>GitHub : Approve/Request Changes
```

### Preview Environment Benefits

Preview deployments provide several advantages:

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Isolation** | Separate environment per PR | Prevents breaking main branch |
| **Testing** | Full-stack testing capabilities | Ensures quality before merge |
| **Collaboration** | Shareable preview URLs | Facilitates team review |
| **Rollback** | Easy to discard changes | Reduces risk of bad merges |

### Configuration for Preview Deployments

The Vercel configuration supports preview deployments through:

- **Automatic Build Triggers**: Vercel monitors GitHub for new pull requests
- **Environment Isolation**: Each preview gets its own environment variables
- **Cleanup**: Automatic cleanup of preview environments after PR closure

**Section sources**
- [README.md](file://README.md#L228-L238)

## Common Issues and Solutions

Understanding common deployment issues helps prevent downtime and ensures smooth operations.

### Build Failures

Common build issues and solutions:

| Issue | Cause | Solution |
|-------|-------|---------|
| **Module Resolution** | Missing dependencies | Run `npm install` before build |
| **TypeScript Errors** | Type mismatches | Fix type errors in source code |
| **Asset Loading** | Incorrect asset paths | Verify asset import paths |
| **Environment Variables** | Missing variables | Set required environment variables |

### Runtime Errors

Edge function runtime issues:

```mermaid
flowchart TD
A[Function Execution] --> B{Error Type}
B --> |Timeout| C[Increase Timeout]
B --> |Memory| D[Optimize Memory Usage]
B --> |Network| E[Implement Retry Logic]
B --> |Database| F[Check Connection]
C --> G[Update Function Config]
D --> H[Refactor Code]
E --> I[Add Error Handling]
F --> J[Verify Credentials]
```

### Deployment Issues

Common deployment problems:

| Problem | Symptoms | Resolution |
|---------|----------|------------|
| **404 Errors** | Pages not found | Check rewrite rules |
| **CORS Issues** | API requests blocked | Configure allowed origins |
| **Environment Scoping** | Variables not available | Verify Vercel environment setup |
| **Cache Problems** | Stale content | Clear Vercel cache |

### Performance Issues

Optimization strategies for common performance problems:

```mermaid
graph LR
subgraph "Performance Issues"
A[Slow Load Times] --> B[Code Splitting]
C[Large Bundle Size] --> D[Tree Shaking]
E[High API Latency] --> F[Edge Functions]
G[Poor Mobile Performance] --> H[Asset Optimization]
end
subgraph "Solutions"
B --> I[Faster Initial Load]
D --> J[Smaller Bundle]
F --> K[Reduced Latency]
H --> L[Better Mobile Experience]
end
```

**Section sources**
- [src/lib/env-validator.ts](file://src/lib/env-validator.ts#L29-L48)
- [supabase/functions/ai-quote-generator/index.ts](file://supabase/functions/ai-quote-generator/index.ts#L228-L245)

## Deployment Workflow

The deployment process combines automated CI/CD with manual oversight for reliability.

### Automated Deployment Pipeline

```mermaid
flowchart TD
A[Code Commit] --> B[GitHub Push]
B --> C[Vercel Build Trigger]
C --> D[Environment Setup]
D --> E[Dependency Installation]
E --> F[TypeScript Compilation]
F --> G[Asset Optimization]
G --> H[Edge Function Build]
H --> I[Static Asset Generation]
I --> J[Preview Deployment]
J --> K{Manual Approval?}
K --> |Yes| L[Production Deployment]
K --> |No| M[Auto-Deploy]
L --> N[Production Site]
M --> N
```

### Deployment Commands

Standard deployment commands for different scenarios:

| Scenario | Command | Purpose |
|----------|---------|---------|
| **Development** | `npm run dev` | Local development server |
| **Build** | `npm run build` | Production build |
| **Preview** | Automatic | Pull request previews |
| **Production** | Vercel auto-deploy | Main branch deployment |

### Environment Management

The project uses environment-specific configurations:

```mermaid
graph TB
subgraph "Environment Types"
A[Development] --> B[Local .env]
C[Preview] --> D[Vercel Environment]
E[Production] --> F[Vercel Environment]
end
subgraph "Configuration Sources"
B --> G[.env.local]
D --> H[Preview Variables]
F --> I[Production Variables]
end
subgraph "Security"
G --> J[Local Only]
H --> K[Secure Preview]
I --> L[Production Security]
end
```

**Section sources**
- [README.md](file://README.md#L228-L238)
- [DEPLOYMENT_SUMMARY.md](file://DEPLOYMENT_SUMMARY.md#L1-L371)

## Debugging and Monitoring

Effective debugging and monitoring ensure reliable operation and quick issue resolution.

### Logging Strategy

Edge functions implement comprehensive logging:

```mermaid
sequenceDiagram
participant Request as Incoming Request
participant Function as Edge Function
participant Logger as Internal Logger
participant Vercel as Vercel Logs
participant Monitoring as Monitoring System
Request->>Function : Process Request
Function->>Logger : Log Request Details
Function->>Function : Process Business Logic
Function->>Logger : Log Processing Results
Function->>Vercel : Return Response
Logger->>Vercel : Log to Vercel Console
Vercel->>Monitoring : Stream Logs
```

### Error Monitoring

The application implements structured error handling:

| Error Type | Logging Level | Recovery Strategy |
|------------|---------------|-------------------|
| **Validation Errors** | INFO | Return formatted error to client |
| **Database Errors** | ERROR | Log details, return generic error |
| **Rate Limiting** | WARN | Log attempt, return 429 |
| **Unexpected Errors** | ERROR | Log stack trace, return 500 |

### Performance Monitoring

Key performance metrics tracked:

```mermaid
graph LR
subgraph "Performance Metrics"
A[Response Time] --> B[Edge Function Duration]
C[Throughput] --> D[Requests per Second]
E[Error Rate] --> F[5xx Responses]
G[Resource Usage] --> H[Memory/CPU]
end
subgraph "Monitoring Tools"
B --> I[Vercel Metrics]
D --> I
F --> I
H --> I
end
```

### Debugging Tools

Available debugging capabilities:

| Tool | Purpose | Access |
|------|---------|--------|
| **Vercel Logs** | Function execution logs | Vercel Dashboard |
| **Browser DevTools** | Client-side debugging | Browser Console |
| **Network Tab** | API request inspection | Browser Network |
| **Application Logs** | Custom application logging | Vercel Logs |

### Troubleshooting Checklist

Common troubleshooting steps:

1. **Check Vercel Dashboard**: Verify build status and function logs
2. **Review Environment Variables**: Ensure all required variables are set
3. **Test Edge Functions**: Use Vercel CLI to test functions locally
4. **Validate API Endpoints**: Test individual API routes
5. **Monitor Performance**: Check response times and error rates
6. **Review Cache Settings**: Verify asset caching behavior

**Section sources**
- [supabase/functions/health/index.ts](file://supabase/functions/health/index.ts#L1-L33)
- [DEPLOYMENT_SUMMARY.md](file://DEPLOYMENT_SUMMARY.md#L1-L371)

## Conclusion

The Vercel deployment configuration for sleekapp-v100 provides a robust foundation for scalable, performant web applications. The combination of edge functions, optimized builds, and comprehensive monitoring creates a reliable platform for production use.

Key success factors include:

- **Minimal Configuration**: Clean, maintainable Vercel configuration
- **Edge Function Integration**: Seamless backend API implementation
- **Performance Optimization**: Aggressive caching and asset optimization
- **Developer Experience**: Smooth preview deployments and debugging tools
- **Reliability**: Comprehensive error handling and monitoring

This configuration serves as a template for similar React applications requiring serverless backend capabilities and global performance optimization.