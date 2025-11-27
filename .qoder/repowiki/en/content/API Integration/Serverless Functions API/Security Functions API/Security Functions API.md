# Security Functions API

<cite>
**Referenced Files in This Document**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts)
- [log-audit-action/index.ts](file://supabase/functions/log-audit-action/index.ts)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [env-validator.ts](file://src/lib/env-validator.ts)
- [auditLog.ts](file://src/lib/auditLog.ts)
- [BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Security Function Architecture](#security-function-architecture)
3. [Two-Factor Authentication Functions](#two-factor-authentication-functions)
4. [Password Security Functions](#password-security-functions)
5. [Administrative Functions](#administrative-functions)
6. [Audit Logging System](#audit-logging-system)
7. [Integration Patterns](#integration-patterns)
8. [Security Measures](#security-measures)
9. [Deployment and Environment Management](#deployment-and-environment-management)
10. [Monitoring and Alerting](#monitoring-and-alerting)
11. [Best Practices](#best-practices)

## Introduction

The sleekapp-v100 security functions API provides comprehensive security controls for authentication, authorization, and audit logging. Built on Supabase Edge Functions, these serverless functions implement robust security measures including two-factor authentication (2FA), password breach detection, role-based access control, and comprehensive audit trails.

The security architecture follows defense-in-depth principles, combining multiple security layers including rate limiting, input validation, cryptographic hashing, and real-time monitoring. All functions are designed to handle sensitive operations securely while maintaining high availability and performance.

## Security Function Architecture

The security functions are organized into five core categories, each serving specific security requirements:

```mermaid
graph TB
subgraph "Client Layer"
WebApp[Web Application]
MobileApp[Mobile Application]
end
subgraph "Edge Functions Layer"
SendOTP[send-otp]
VerifyOTP[verify-otp]
PasswordCheck[password-breach-check]
AdminCheck[admin-check]
LogAudit[log-audit-action]
end
subgraph "Database Layer"
OTPStore[OTP Storage]
AuditLogs[Audit Logs]
UserRoles[User Roles]
Profiles[User Profiles]
end
subgraph "External Services"
Resend[Resend Email Service]
HIBP[Have I Been Pwned API]
Recaptcha[reCAPTCHA Service]
end
WebApp --> SendOTP
WebApp --> VerifyOTP
WebApp --> PasswordCheck
WebApp --> AdminCheck
WebApp --> LogAudit
SendOTP --> OTPStore
VerifyOTP --> OTPStore
VerifyOTP --> Profiles
LogAudit --> AuditLogs
AdminCheck --> UserRoles
SendOTP --> Resend
SendOTP --> Recaptcha
PasswordCheck --> HIBP
```

**Diagram sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts#L1-L489)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L1-L356)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L1-L142)
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts#L1-L74)
- [log-audit-action/index.ts](file://supabase/functions/log-audit-action/index.ts#L1-L97)

**Section sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts#L1-L50)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L1-L50)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L1-L50)
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts#L1-L50)
- [log-audit-action/index.ts](file://supabase/functions/log-audit-action/index.ts#L1-L50)

## Two-Factor Authentication Functions

### send-otp Function

The `send-otp` function handles one-time password generation and delivery for both phone and email verification scenarios.

#### Endpoint Details
- **URL**: `/functions/v1/send-otp`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: Public (rate-limited)

#### Request Format
```typescript
interface OTPRequest {
  type: 'phone' | 'email-quote' | 'email-supplier';
  phone?: string;
  email?: string;
  country?: string;
  captchaToken?: string;
}
```

#### Response Format
```typescript
interface OTPResponse {
  success: boolean;
  expiresAt: string;
  message: string;
}
```

#### Security Features

**Rate Limiting Implementation**:
- **Phone OTP**: 1 request per 5 minutes per phone number
- **Email OTP**: 1 request per 5 minutes per email address
- **Email Quote**: 3 requests per day per email address
- **Supplier Registration**: Requires reCAPTCHA verification

**Input Validation**:
- Comprehensive email format validation with regex
- Disposable email domain blocking
- Phone number sanitization and validation
- CAPTCHA verification for supplier registration

**Delivery Security**:
- Email templating with HTML formatting
- Retry logic with exponential backoff
- Delivery status tracking
- Header injection prevention

#### Invocation Pattern Example

```typescript
// Phone OTP Request
const { data, error } = await supabase.functions.invoke('send-otp', {
  body: { type: 'phone', phone: '+1234567890' }
});

// Email OTP Request
const { data, error } = await supabase.functions.invoke('send-otp', {
  body: { 
    type: 'email-quote', 
    email: 'user@example.com',
    captchaToken: 'recaptcha_token_here'
  }
});
```

**Section sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts#L145-L250)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts#L205-L249)

### verify-otp Function

The `verify-otp` function validates one-time passwords and completes the authentication process.

#### Endpoint Details
- **URL**: `/functions/v1/verify-otp`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: Depends on OTP type

#### Request Format
```typescript
interface VerifyRequest {
  type: 'phone' | 'email-quote' | 'email-supplier';
  phone?: string;
  email?: string;
  otp: string;
}
```

#### Response Format
```typescript
interface VerifyResponse {
  success: boolean;
  verified: boolean;
  message: string;
  quotesUsedToday?: number;
  quotesRemaining?: number;
}
```

#### Security Features

**Rate Limiting**:
- 3 attempts per hour per identifier
- 5 attempts per OTP record
- IP-based tracking for suspicious activity

**OTP Validation**:
- Expiration checking (10-minute validity)
- Attempt counting and limiting
- Secure comparison without timing attacks
- Automatic cleanup of expired records

**User Profile Updates**:
- Automatic phone verification updates
- Session management integration
- Role assignment based on verification type

#### Verification Flow

```mermaid
sequenceDiagram
participant Client as Client Application
participant VerifyOTP as verify-otp Function
participant Database as Supabase Database
participant Logger as Audit Logger
Client->>VerifyOTP : POST /verify-otp
VerifyOTP->>VerifyOTP : Validate OTP format (6 digits)
VerifyOTP->>Database : Check rate limits
Database-->>VerifyOTP : Rate limit status
VerifyOTP->>VerifyOTP : Validate identifier type
VerifyOTP->>Database : Fetch OTP record
Database-->>VerifyOTP : OTP record data
VerifyOTP->>VerifyOTP : Check expiration
VerifyOTP->>VerifyOTP : Validate OTP code
VerifyOTP->>Database : Update verification status
VerifyOTP->>Logger : Log verification attempt
VerifyOTP-->>Client : Verification result
```

**Diagram sources**
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L110-L146)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L224-L288)

**Section sources**
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L14-L25)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L36-L88)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L90-L178)

## Password Security Functions

### password-breach-check Function

The `password-breach-check` function implements k-anonymity password validation using the Have I Been Pwned API.

#### Endpoint Details
- **URL**: `/functions/v1/password-breach-check`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: Public (origin-restricted)

#### Request Format
```typescript
interface PasswordCheckRequest {
  password: string;
}
```

#### Response Format
```typescript
interface PasswordCheckResponse {
  pwned: boolean;
  count: number;
}
```

#### Security Features

**K-Anonymity Implementation**:
- SHA-1 hashing without revealing full passwords
- Prefix-based API calls to minimize exposure
- Fail-closed security model when HIBP is unavailable

**Origin Validation**:
- Whitelist-based CORS enforcement
- Protocol and subdomain validation
- Development vs production environment handling

**Cryptographic Security**:
- Secure SHA-1 implementation using Web Crypto API
- Proper encoding and hex conversion
- Memory-safe hash computation

#### Breach Detection Process

```mermaid
flowchart TD
Start([Password Input]) --> ValidateFormat["Validate Password Format"]
ValidateFormat --> HashPassword["Compute SHA-1 Hash"]
HashPassword --> ExtractPrefix["Extract First 5 Characters"]
ExtractPrefix --> APICall["Call HIBP API with Prefix"]
APICall --> ParseResponse["Parse API Response"]
ParseResponse --> CheckMatch{"Hash Match Found?"}
CheckMatch --> |Yes| ReturnPwned["Return {pwned: true, count: X}"]
CheckMatch --> |No| ReturnSafe["Return {pwned: false, count: 0}"]
ReturnPwned --> End([End])
ReturnSafe --> End
```

**Diagram sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L106-L131)

**Section sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L98-L141)

## Administrative Functions

### admin-check Function

The `admin-check` function verifies administrative privileges for privileged operations.

#### Endpoint Details
- **URL**: `/functions/v1/admin-check`
- **Method**: GET/POST
- **Content-Type**: application/json
- **Authentication**: JWT Token Required

#### Request Format
```typescript
// Authorization header required
Authorization: Bearer <jwt-token>
```

#### Response Format
```typescript
interface AdminCheckResponse {
  isAdmin: boolean;
  error?: string;
}
```

#### Security Features

**JWT Validation**:
- Server-side token verification
- User ID extraction from claims
- Role permission checking

**Database Security**:
- Service role key for secure database access
- Role-based permission queries
- Error handling and logging

#### Role Verification Process

```mermaid
sequenceDiagram
participant Client as Admin Client
participant AdminCheck as admin-check Function
participant Supabase as Supabase Auth
participant Database as User Roles
Client->>AdminCheck : GET /admin-check
AdminCheck->>AdminCheck : Extract Authorization header
AdminCheck->>Supabase : Verify JWT token
Supabase-->>AdminCheck : User data
AdminCheck->>Database : Check admin role
Database-->>AdminCheck : Role data
AdminCheck-->>Client : {isAdmin : true/false}
```

**Diagram sources**
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts#L33-L60)

**Section sources**
- [admin-check/index.ts](file://supabase/functions/admin-check/index.ts#L14-L74)

## Audit Logging System

### log-audit-action Function

The `log-audit-action` function provides comprehensive audit trail capabilities for security-sensitive operations.

#### Endpoint Details
- **URL**: `/functions/v1/log-audit-action`
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: JWT Token Required

#### Request Format
```typescript
interface AuditLogRequest {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  user_id?: string; // Ignored - uses JWT-validated user ID
}
```

#### Response Format
```typescript
interface AuditLogResponse {
  success: boolean;
  log_id: string;
  error?: string;
}
```

#### Database Schema

The audit logging system uses the following database structure:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Primary key | PRIMARY KEY |
| admin_id | UUID | User performing action | NOT NULL |
| action | TEXT | Action description | NOT NULL |
| resource_type | TEXT | Resource type | NOT NULL |
| resource_id | TEXT | Resource identifier | NULLABLE |
| details | JSONB | Action details | DEFAULT {} |
| ip_address | TEXT | Client IP address | NULLABLE |
| user_agent | TEXT | Browser/User agent | NULLABLE |
| created_at | TIMESTAMP | Creation timestamp | DEFAULT now() |

#### Security Features

**Server-Side Validation**:
- JWT token verification prevents spoofing
- User ID extraction from validated tokens
- IP address capture from headers
- User agent logging for forensic analysis

**Data Protection**:
- Sanitized logging with identifier masking
- Structured audit trail format
- Timestamp precision for timeline analysis
- Resource association for correlation

#### Audit Log Structure

```mermaid
erDiagram
ADMIN_AUDIT_LOGS {
uuid id PK
uuid admin_id FK
string action
string resource_type
string resource_id
jsonb details
string ip_address
string user_agent
timestamp created_at
}
USERS {
uuid id PK
text email
text full_name
timestamp created_at
}
ADMIN_AUDIT_LOGS ||--|| USERS : "performed_by"
```

**Diagram sources**
- [BASE_MIGRATION_SAFE.sql](file://supabase/BASE_MIGRATION_SAFE.sql#L736-L750)

**Section sources**
- [log-audit-action/index.ts](file://supabase/functions/log-audit-action/index.ts#L8-L14)
- [log-audit-action/index.ts](file://supabase/functions/log-audit-action/index.ts#L22-L97)
- [auditLog.ts](file://src/lib/auditLog.ts#L28-L40)

## Integration Patterns

### Firebase Auth Integration

The security functions integrate with Firebase Authentication for comprehensive identity management:

```mermaid
graph LR
subgraph "Firebase Auth"
FirebaseAuth[Firebase Authentication]
UserProfiles[Firebase User Profiles]
end
subgraph "Supabase Auth"
SupabaseAuth[Supabase Authentication]
UserRoles[User Roles]
Profiles[User Profiles]
end
subgraph "Security Functions"
SendOTP[send-otp]
VerifyOTP[verify-otp]
AdminCheck[admin-check]
end
FirebaseAuth --> SupabaseAuth
UserProfiles --> Profiles
SupabaseAuth --> SendOTP
SupabaseAuth --> VerifyOTP
SupabaseAuth --> AdminCheck
UserRoles --> AdminCheck
```

**Diagram sources**
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx#L1-L92)

### Supabase Functions Invocation

All security functions are invoked using the standardized Supabase functions client:

```typescript
// Standard invocation pattern
const { data, error } = await supabase.functions.invoke(functionName, {
  body: requestPayload
});
```

**Section sources**
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx#L1-L92)

## Security Measures

### Rate Limiting Implementation

The security functions implement multiple layers of rate limiting:

| Function | Rate Limit Type | Limit | Window |
|----------|----------------|-------|---------|
| send-otp (phone) | Per phone number | 1 request | 5 minutes |
| send-otp (email) | Per email address | 1 request | 5 minutes |
| send-otp (email-quote) | Per email address | 3 requests | 24 hours |
| verify-otp | Per identifier | 3 attempts | 1 hour |
| verify-otp (per OTP) | Per OTP record | 5 attempts | N/A |

### OTP Security Features

**Expiration Management**:
- 10-minute OTP validity period
- Automatic cleanup of expired records
- Graceful degradation for expired codes

**Attempt Control**:
- Configurable attempt limits per OTP
- Suspicious activity detection
- Automatic account lockout prevention

**Storage Security**:
- Encrypted OTP storage
- Secure deletion after verification
- Audit trail for all attempts

### Cryptographic Security

**Password Hashing**:
- SHA-1 implementation for HIBP API compliance
- Secure random OTP generation
- Timing attack resistance

**JWT Security**:
- Server-side token validation
- User ID extraction from claims
- Role-based access control

**Section sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts#L205-L249)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L67-L88)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts#L226-L262)

## Deployment and Environment Management

### Environment Variable Management

The security functions rely on several critical environment variables:

| Variable | Purpose | Security Level |
|----------|---------|----------------|
| RESEND_API_KEY | Email delivery service | Secret |
| SUPABASE_URL | Supabase database URL | Public |
| SUPABASE_SERVICE_ROLE_KEY | Database access | Secret |
| SUPABASE_ANON_KEY | Anonymous access | Public |
| RECAPTCHA_SECRET_KEY | Bot protection | Secret |

### Environment Validation

The application includes comprehensive environment validation:

```typescript
// Environment validation ensures all required variables are present
const envValidator = EnvironmentValidator.getInstance();
envValidator.validate(); // Throws error if validation fails
```

### Secure Deployment Practices

**Configuration Management**:
- Environment-specific configurations
- Secret rotation procedures
- Access control for deployment keys

**Monitoring Setup**:
- Function execution monitoring
- Error rate tracking
- Performance metrics collection

**Section sources**
- [env-validator.ts](file://src/lib/env-validator.ts#L1-L143)

## Monitoring and Alerting

### Real-Time Monitoring

The security functions implement comprehensive monitoring:

**Rate Limiting Alerts**:
- Excessive request patterns
- Failed verification attempts
- Suspicious IP addresses

**Security Event Tracking**:
- Failed authentication attempts
- Unauthorized access attempts
- Role elevation events

**Performance Metrics**:
- Function execution times
- Database query performance
- External service response times

### Audit Trail Analysis

The audit logging system enables comprehensive security analysis:

**Suspicious Activity Detection**:
- Multiple failed verification attempts
- Unusual geographic patterns
- Automated attack patterns

**Compliance Reporting**:
- User action tracking
- Administrative changes
- Data access patterns

## Best Practices

### Development Guidelines

**Secure Coding Practices**:
- Input validation for all parameters
- Error handling without information leakage
- Secure logging with sensitive data masking
- Proper resource cleanup

**Testing Strategies**:
- Unit testing for security logic
- Integration testing with external services
- Load testing for rate limiting
- Security penetration testing

### Operational Procedures

**Incident Response**:
- Immediate response to security incidents
- User notification procedures
- Service restoration protocols
- Post-incident analysis

**Maintenance Tasks**:
- Regular security audits
- Dependency updates
- Performance optimization
- Backup verification

### Compliance Considerations

**Data Protection**:
- GDPR compliance for user data
- Data retention policies
- Right to erasure implementation
- Data minimization principles

**Regulatory Requirements**:
- Authentication standards
- Audit trail requirements
- Security certification
- Third-party assessments