# Content and User-Generated Content Functions

<cite>
**Referenced Files in This Document**
- [generate-product-description/index.ts](file://supabase/functions/generate-product-description/index.ts)
- [generate-product-image/index.ts](file://supabase/functions/generate-product-image/index.ts)
- [submit-blog-comment/index.ts](file://supabase/functions/submit-blog-comment/index.ts)
- [ProductDescriptionGenerator.tsx](file://src/components/admin/ProductDescriptionGenerator.tsx)
- [aiGeneratedProductImages.ts](file://src/lib/aiGeneratedProductImages.ts)
- [portfolioImagesPhotorealistic.ts](file://src/lib/portfolioImagesPhotorealistic.ts)
- [ai-design-generator/index.ts](file://supabase/functions/ai-design-generator/index.ts)
- [generate-invoice/index.ts](file://supabase/functions/generate-invoice/index.ts)
- [RateLimitMonitoringDashboard.tsx](file://src/components/admin/RateLimitMonitoringDashboard.tsx)
- [blog_comments table schema](file://supabase/FIXED_SETUP_PART1.sql)
- [storage bucket configuration](file://supabase/migrations/20250122010000_setup_product_images_storage.sql)
- [ProductApproval.tsx](file://src/pages/admin/ProductApproval.tsx)
- [ProductReview.tsx](file://src/pages/admin/ProductReview.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [AI-Powered Content Generation](#ai-powered-content-generation)
3. [User-Generated Content Management](#user-generated-content-management)
4. [Content Moderation and Quality Control](#content-moderation-and-quality-control)
5. [Storage and Performance Systems](#storage-and-performance-systems)
6. [Integration Architecture](#integration-architecture)
7. [Security and Rate Limiting](#security-and-rate-limiting)
8. [Best Practices and Guidelines](#best-practices-and-guidelines)
9. [Troubleshooting and Monitoring](#troubleshooting-and-monitoring)
10. [Conclusion](#conclusion)

## Introduction

SleekApp v100 implements a comprehensive content management system that leverages AI technologies to automate content creation while maintaining strict quality control and moderation standards. The system provides three primary functions: AI-powered product description generation, automated product image creation, and moderated user comment submission. These functions work together to create a seamless content ecosystem that balances automation with human oversight.

The platform integrates advanced AI services through the Lovable AI Gateway to generate high-quality, brand-consistent content while implementing robust moderation workflows to prevent spam and inappropriate content. Storage systems are optimized for performance with automatic caching and CDN delivery, ensuring fast content delivery across global markets.

## AI-Powered Content Generation

### Product Description Generator

The AI Product Description Generator creates compelling copy using sophisticated prompt engineering and AI models. The system accepts technical specifications and generates complete product descriptions including titles, feature bullets, and meta descriptions.

```mermaid
sequenceDiagram
participant Client as "Admin Interface"
participant API as "generate-product-description"
participant AI as "Lovable AI Gateway"
participant Storage as "Supabase Storage"
Client->>API : Submit product specifications
API->>API : Validate input parameters
API->>AI : Send structured prompt
AI->>AI : Generate content using Gemini 2.5 Flash
AI-->>API : Return structured content
API->>Storage : Store raw prompt and response
API-->>Client : Return formatted content
```

**Diagram sources**
- [generate-product-description/index.ts](file://supabase/functions/generate-product-description/index.ts#L13-L91)
- [ProductDescriptionGenerator.tsx](file://src/components/admin/ProductDescriptionGenerator.tsx#L19-L48)

#### Prompt Template Architecture

The system uses a sophisticated prompt template system that ensures consistent, high-quality output:

| Component | Purpose | Example |
|-----------|---------|---------|
| System Prompt | Defines AI role and tone | "Expert copywriter specializing in apparel product descriptions" |
| User Prompt | Provides specific requirements | Product type, materials, features, target audience |
| Tool Definition | Structured output format | JSON schema with title, description, features, meta_description |
| Validation | Ensures completeness | Required fields check and content quality assessment |

**Section sources**
- [generate-product-description/index.ts](file://supabase/functions/generate-product-description/index.ts#L21-L35)

#### Content Structure and Output

Generated content follows a standardized structure:

- **Product Title**: Catchy headline with main keyword
- **Full Description**: 200-300 word SEO-optimized text
- **Feature Bullets**: 5-7 bullet points highlighting key attributes
- **Meta Description**: 150-160 character SEO tag

### AI Product Image Generator

The AI Product Image Generator creates professional-grade product photography using advanced image generation models. The system combines technical specifications with creative prompts to produce studio-quality images.

```mermaid
flowchart TD
Start([Image Generation Request]) --> ValidateInput["Validate Product Data"]
ValidateInput --> BuildPrompt["Build Creative Prompt"]
BuildPrompt --> CallAI["Call Lovable AI Gateway"]
CallAI --> ProcessResponse["Process Image Response"]
ProcessResponse --> UploadStorage["Upload to Supabase Storage"]
UploadStorage --> UpdateDatabase["Update Product Record"]
UpdateDatabase --> ReturnURL["Return Public URL"]
ReturnURL --> End([Complete])
CallAI --> ErrorCheck{"AI Error?"}
ErrorCheck --> |Yes| HandleError["Handle Error"]
ErrorCheck --> |No| ProcessResponse
HandleError --> End
```

**Diagram sources**
- [generate-product-image/index.ts](file://supabase/functions/generate-product-image/index.ts#L14-L138)

#### Image Generation Workflow

The image generation process incorporates multiple optimization strategies:

| Optimization Level | Technique | Implementation |
|-------------------|-----------|----------------|
| Prompt Engineering | Detailed creative direction | Professional photography style, studio lighting, fabric textures |
| Model Selection | Appropriate AI model | Google Gemini 2.5 Flash Image Preview |
| Quality Control | Multi-stage validation | Base64 decoding, format verification, size constraints |
| Storage Optimization | Efficient file handling | WebP compression, automatic naming, metadata preservation |

**Section sources**
- [generate-product-image/index.ts](file://supabase/functions/generate-product-image/index.ts#L22-L35)

### Design Generation System

The AI Design Generator creates print-ready designs for apparel manufacturing, supporting various style preferences and color palettes.

**Section sources**
- [ai-design-generator/index.ts](file://supabase/functions/ai-design-generator/index.ts#L32-L40)

## User-Generated Content Management

### Blog Comment Submission System

The blog comment system implements a comprehensive moderation workflow that handles both authenticated and anonymous submissions while preventing spam and inappropriate content.

```mermaid
stateDiagram-v2
[*] --> ValidateSubmission
ValidateSubmission --> CAPTCHAVerify : Required fields present
ValidateSubmission --> Reject : Missing fields
CAPTCHAVerify --> SanitizeInputs : Verification successful
CAPTCHAVerify --> Reject : Verification failed
SanitizeInputs --> EmailValidation : Inputs sanitized
EmailValidation --> InsertComment : Valid email
EmailValidation --> Reject : Invalid email
InsertComment --> PendingApproval : Comment inserted
PendingApproval --> NotifyAdmin : Admin notification
NotifyAdmin --> [*] : Complete
Reject --> [*] : Error response
```

**Diagram sources**
- [submit-blog-comment/index.ts](file://supabase/functions/submit-blog-comment/index.ts#L16-L128)

#### Submission Validation Pipeline

The system implements multi-layered validation:

| Validation Stage | Purpose | Implementation |
|------------------|---------|----------------|
| Field Validation | Required data presence | Presence checks for post_id, author_name, author_email, content |
| CAPTCHA Verification | Bot prevention | Google reCAPTCHA v3 integration with score threshold |
| Input Sanitization | XSS protection | Character limits, format normalization |
| Email Validation | Address verification | Regex pattern matching and format checking |
| Duplicate Prevention | Spam reduction | Rate limiting and duplicate detection |

**Section sources**
- [submit-blog-comment/index.ts](file://supabase/functions/submit-blog-comment/index.ts#L19-L66)

### Database Schema and Relationships

The blog comment system uses a normalized database schema with appropriate indexing and constraints:

```mermaid
erDiagram
BLOG_POSTS {
uuid id PK
string title
string slug UK
text excerpt
text content
string category
uuid author_id FK
string featured_image_url
string thumbnail_url
string meta_title
string meta_description
string meta_keywords
boolean published
timestamp published_at
int views_count
int shares_count
jsonb tags
jsonb seo_data
timestamp created_at
timestamp updated_at
}
BLOG_COMMENTS {
uuid id PK
uuid post_id FK
uuid user_id FK
string author_name
string author_email
text content
boolean approved
timestamp created_at
}
USERS {
uuid id PK
string email
string full_name
timestamp created_at
}
BLOG_POSTS ||--o{ BLOG_COMMENTS : contains
USERS ||--o{ BLOG_COMMENTS : author_of
```

**Diagram sources**
- [blog_comments table schema](file://supabase/FIXED_SETUP_PART1.sql#L173-L181)
- [blog_posts table schema](file://supabase/FIXED_SETUP_PART1.sql#L183-L204)

**Section sources**
- [blog_comments table schema](file://supabase/FIXED_SETUP_PART1.sql#L173-L181)

## Content Moderation and Quality Control

### Approval Workflow System

The content approval system implements a comprehensive workflow for managing AI-generated and user-submitted content:

```mermaid
flowchart TD
SubmitContent["Content Submission"] --> AutoValidation["Automatic Validation"]
AutoValidation --> QualityCheck["Quality Assessment"]
QualityCheck --> BrandCompliance["Brand Voice Check"]
BrandCompliance --> Approved{"Approved?"}
Approved --> |Yes| PublishContent["Publish Content"]
Approved --> |No| ReviewQueue["Send to Review Queue"]
ReviewQueue --> AdminReview["Admin Review Process"]
AdminReview --> FinalDecision{"Final Decision"}
FinalDecision --> |Approve| PublishContent
FinalDecision --> |Reject| FeedbackUser["Provide Feedback"]
FeedbackUser --> RevisionRequest["Request Revisions"]
RevisionRequest --> SubmitContent
PublishContent --> MonitorPerformance["Monitor Performance"]
MonitorPerformance --> End([Complete])
```

**Diagram sources**
- [ProductApproval.tsx](file://src/pages/admin/ProductApproval.tsx#L393-L415)
- [ProductReview.tsx](file://src/pages/admin/ProductReview.tsx#L185-L610)

### Quality Control Mechanisms

The system implements multiple quality control layers:

| Control Layer | Purpose | Implementation |
|---------------|---------|----------------|
| Pre-submission | Input validation | Frontend form validation and backend sanitization |
| AI Quality | Content assessment | Automated readability scoring and sentiment analysis |
| Brand Compliance | Voice consistency | Keyword matching and tone analysis |
| Human Review | Final approval | Admin dashboard with approval/rejection workflows |
| Post-publish | Performance monitoring | Analytics tracking and user feedback collection |

### Versioning Strategies

Content versioning ensures rollback capabilities and change tracking:

- **Automatic Versioning**: Each content modification creates a new version
- **Rollback Capability**: Administrators can revert to previous versions
- **Change Tracking**: Detailed audit logs of all modifications
- **Approval History**: Complete workflow history for compliance

**Section sources**
- [ProductReview.tsx](file://src/pages/admin/ProductReview.tsx#L185-L610)

## Storage and Performance Systems

### Image Storage Architecture

The system uses a multi-tiered storage architecture optimized for performance and scalability:

```mermaid
graph TB
subgraph "Client Layer"
Browser[Browser]
CDN[CDN Network]
end
subgraph "Storage Layer"
Supabase[(Supabase Storage)]
Bucket[product-images Bucket]
Policies[Access Policies]
end
subgraph "Processing Layer"
ImageOpt[Image Optimization]
Compression[WebP Compression]
Resize[Auto-resizing]
end
Browser --> CDN
CDN --> Supabase
Supabase --> Bucket
Bucket --> Policies
Bucket --> ImageOpt
ImageOpt --> Compression
Compression --> Resize
```

**Diagram sources**
- [storage bucket configuration](file://supabase/migrations/20250122010000_setup_product_images_storage.sql#L12-L22)

### Performance Optimization Strategies

| Optimization Technique | Implementation | Benefits |
|------------------------|----------------|----------|
| CDN Integration | Automatic CDN URLs | Reduced latency, global distribution |
| Image Compression | WebP format conversion | Smaller file sizes, faster loading |
| Lazy Loading | Progressive image loading | Improved page performance |
| Caching Headers | Intelligent cache policies | Reduced server load |
| Auto-scaling | Dynamic resource allocation | Consistent performance under load |

**Section sources**
- [storage bucket configuration](file://supabase/migrations/20250122010000_setup_product_images_storage.sql#L12-L22)

### Asset Management System

The asset management system provides comprehensive control over generated content:

```mermaid
classDiagram
class AssetManager {
+uploadAsset(file, metadata)
+optimizeImage(imageData)
+generateThumbnail(source)
+validateFormat(file)
+cleanupOldAssets()
}
class StoragePolicy {
+checkPermissions(user, action)
+validateFileSize(size)
+validateMimeType(type)
+enforceQuotas()
}
class CacheManager {
+setCache(key, value, ttl)
+getCache(key)
+invalidateCache(pattern)
+monitorCacheHitRate()
}
AssetManager --> StoragePolicy : uses
AssetManager --> CacheManager : integrates
StoragePolicy --> CacheManager : influences
```

**Diagram sources**
- [aiGeneratedProductImages.ts](file://src/lib/aiGeneratedProductImages.ts#L1-L331)
- [portfolioImagesPhotorealistic.ts](file://src/lib/portfolioImagesPhotorealistic.ts#L1-L162)

**Section sources**
- [aiGeneratedProductImages.ts](file://src/lib/aiGeneratedProductImages.ts#L1-L331)

## Integration Architecture

### AI Service Integration

The system integrates with multiple AI services through a unified gateway:

```mermaid
graph LR
subgraph "Application Layer"
React[React Components]
API[Edge Functions]
end
subgraph "Gateway Layer"
LovableGateway[Lovable AI Gateway]
RateLimit[Rate Limiting]
Retry[Retry Logic]
end
subgraph "AI Services"
Gemini[Gemini Models]
DALL[E2 Image Generation]
Claude[Claude Models]
end
React --> API
API --> LovableGateway
LovableGateway --> RateLimit
RateLimit --> Retry
Retry --> Gemini
Retry --> DALL
Retry --> Claude
```

**Diagram sources**
- [generate-product-description/index.ts](file://supabase/functions/generate-product-description/index.ts#L37-L48)
- [generate-product-image/index.ts](file://supabase/functions/generate-product-image/index.ts#L40-L56)

### Database Integration Patterns

The system uses Supabase for comprehensive data management:

| Integration Pattern | Purpose | Implementation |
|---------------------|---------|----------------|
| Real-time Subscriptions | Live updates | WebSocket connections for instant notifications |
| RLS Policies | Access control | Row-level security for data isolation |
| Triggers | Automated workflows | Database triggers for cascading updates |
| Stored Procedures | Complex operations | PL/pgSQL functions for business logic |
| Foreign Keys | Data integrity | Referential constraints for relationships |

**Section sources**
- [generate-invoice/index.ts](file://supabase/functions/generate-invoice/index.ts#L49-L53)

## Security and Rate Limiting

### Authentication and Authorization

The system implements comprehensive security measures:

```mermaid
sequenceDiagram
participant User as "User"
participant Auth as "Authentication"
participant API as "Edge Function"
participant DB as "Database"
User->>Auth : Submit credentials
Auth->>Auth : Validate JWT token
Auth-->>User : Return session
User->>API : Request with token
API->>Auth : Verify token
Auth-->>API : User identity
API->>DB : Execute with permissions
DB-->>API : Authorized data
API-->>User : Secure response
```

**Diagram sources**
- [submit-blog-comment/index.ts](file://supabase/functions/submit-blog-comment/index.ts#L73-L88)

### Rate Limiting Implementation

The system implements intelligent rate limiting to prevent abuse:

| Rate Limit Type | Scope | Limits | Enforcement |
|-----------------|-------|--------|-------------|
| Per-IP Limiting | Global | 100 requests/hour | Distributed counter |
| Per-User Limiting | Authenticated | 500 requests/hour | User-specific counters |
| Per-Endpoint | Specific functions | 10 requests/minute | Function-level throttling |
| Burst Protection | Temporary spikes | 5 requests/second | Sliding window algorithm |

**Section sources**
- [RateLimitMonitoringDashboard.tsx](file://src/components/admin/RateLimitMonitoringDashboard.tsx#L1-L165)

### Security Measures

Comprehensive security controls protect against various threats:

- **Input Validation**: All user inputs undergo strict validation
- **Output Encoding**: Generated content is properly encoded
- **CSRF Protection**: Cross-site request forgery prevention
- **Content Security Policy**: Prevents XSS attacks
- **Encryption**: Data encryption at rest and in transit
- **Audit Logging**: Comprehensive logging of all actions

## Best Practices and Guidelines

### Brand Voice Consistency

Maintaining consistent brand voice across all generated content:

| Guideline | Implementation | Tools |
|-----------|----------------|-------|
| Tone Standards | Define acceptable tones and styles | AI training data |
| Keyword Usage | Control for brand terminology | Keyword filtering |
| Style Guides | Document preferred writing styles | Content templates |
| Review Process | Human oversight for quality | Admin approval workflow |

### Content Quality Standards

Establishing and maintaining high content quality:

- **Readability Scores**: Minimum Flesch-Kincaid grade level
- **Grammar Checking**: Automated grammar and spelling validation
- **Plagiarism Detection**: Content uniqueness verification
- **SEO Optimization**: Keyword density and meta tag validation
- **Accessibility**: WCAG compliance for generated content

### Performance Optimization

Best practices for optimal performance:

- **Image Optimization**: Proper compression and format selection
- **Caching Strategies**: Intelligent cache management
- **CDN Utilization**: Global content delivery network
- **Lazy Loading**: Progressive content loading
- **Resource Minification**: JavaScript and CSS optimization

## Troubleshooting and Monitoring

### Error Handling and Recovery

Comprehensive error handling ensures system reliability:

```mermaid
flowchart TD
Error[Error Occurs] --> LogError[Log Error Details]
LogError --> CheckType{Error Type}
CheckType --> |Network| RetryLogic[Apply Retry Logic]
CheckType --> |Validation| UserFeedback[Provide User Feedback]
CheckType --> |Server| AlertAdmin[Alert Administrator]
RetryLogic --> Success{Retry Successful?}
Success --> |Yes| Continue[Continue Operation]
Success --> |No| FallbackMode[Enter Fallback Mode]
UserFeedback --> UserAction[User Takes Action]
AlertAdmin --> AdminIntervention[Administrator Intervention]
FallbackMode --> Continue
Continue --> End([Complete])
UserAction --> End
AdminIntervention --> End
```

### Monitoring and Alerting

The system includes comprehensive monitoring capabilities:

| Monitoring Aspect | Metrics | Alerts |
|-------------------|---------|--------|
| API Performance | Response times, error rates | SLA violations |
| Rate Limits | Usage patterns, threshold breaches | Capacity warnings |
| AI Service Health | Availability, latency | Service degradation |
| Storage Performance | Upload speeds, error rates | Storage issues |
| Content Quality | Approval rates, user feedback | Quality concerns |

### Debugging Tools

Administrative tools for troubleshooting:

- **Request Logs**: Complete request/response logging
- **Performance Profiling**: Detailed timing information
- **Error Analytics**: Trend analysis and pattern recognition
- **User Impact Analysis**: Affected user identification
- **System Health Checks**: Automated health monitoring

**Section sources**
- [RateLimitMonitoringDashboard.tsx](file://src/components/admin/RateLimitMonitoringDashboard.tsx#L1-L165)

## Conclusion

SleekApp v100's content management system represents a sophisticated balance between automation and quality control. The AI-powered content generation functions provide efficient, scalable solutions for creating high-quality product descriptions and images, while the comprehensive moderation and approval workflows ensure content quality and brand consistency.

The system's architecture emphasizes performance, security, and reliability through intelligent caching, robust rate limiting, and comprehensive monitoring. The integration of multiple AI services through a unified gateway enables flexible content generation while maintaining control over output quality.

Key strengths of the system include:

- **Scalable AI Integration**: Flexible AI service integration with multiple providers
- **Comprehensive Moderation**: Multi-layered content review and approval workflows
- **Performance Optimization**: Intelligent caching and CDN integration
- **Security Focus**: Robust authentication, authorization, and rate limiting
- **Developer Experience**: Well-documented APIs and comprehensive error handling

The platform's design supports future enhancements including additional AI models, expanded content types, and advanced analytics capabilities. The modular architecture ensures that new features can be integrated seamlessly while maintaining system stability and performance.