# OTP Verification Workflow

<cite>
**Referenced Files in This Document**  
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
- [lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts)
- [components/ui/input-otp.tsx](file://src/components/ui/input-otp.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive documentation for the OTP verification workflow within the AI quote generation process. The system implements a secure, multi-step form flow that integrates with Supabase Edge Functions to send and verify one-time passwords. This workflow ensures user authenticity during quote generation while maintaining a seamless user experience. The documentation covers implementation details, security considerations, error handling mechanisms, and configuration options for OTP delivery and validation.

## Project Structure
The OTP verification system is implemented across frontend components and backend Edge Functions. The frontend resides in the components directory with dedicated UI elements for OTP input, while the backend logic is handled by Supabase Edge Functions for sending and verifying OTPs.

```mermaid
graph TD
subgraph "Frontend"
A[AIQuoteGeneratorWithOTP.tsx]
B[input-otp.tsx]
C[supabaseHelpers.ts]
end
subgraph "Backend"
D[send-otp/index.ts]
E[verify-otp/index.ts]
end
A --> D : "HTTP Request"
A --> E : "HTTP Request"
C --> A : "Utility Functions"
```

**Diagram sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

**Section sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)
- [supabase/functions](file://supabase/functions)

## Core Components
The OTP verification workflow centers around the AIQuoteGeneratorWithOTP component, which orchestrates a multi-step form flow consisting of form → otp → loading → result stages. This component manages state transitions between these stages and handles communication with Supabase Edge Functions for OTP operations. The workflow begins with user data collection, proceeds to OTP verification, shows a loading state during AI processing, and finally displays the generated quote. The implementation includes robust error handling and debug mode capabilities for development and troubleshooting.

**Section sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)

## Architecture Overview
The OTP verification architecture follows a client-server pattern with clear separation between frontend presentation logic and backend verification services. The frontend component manages the user interface flow and collects user input, while Supabase Edge Functions handle the secure aspects of OTP generation, delivery, and validation. This separation enhances security by keeping sensitive operations on the server side and reduces client-side attack surface.

```mermaid
sequenceDiagram
participant User as "User"
participant Frontend as "AIQuoteGeneratorWithOTP"
participant SendOTP as "send-otp Function"
participant VerifyOTP as "verify-otp Function"
participant Database as "Supabase Database"
User->>Frontend : Enter quote request
Frontend->>SendOTP : Request OTP send
SendOTP->>Database : Store OTP record
SendOTP->>User : Deliver OTP (email/SMS)
SendOTP-->>Frontend : Send confirmation
Frontend->>User : Display OTP input
User->>Frontend : Enter OTP
Frontend->>VerifyOTP : Submit OTP for verification
VerifyOTP->>Database : Check OTP validity
alt OTP Valid
VerifyOTP-->>Frontend : Verification success
Frontend->>Frontend : Show loading state
Frontend->>Frontend : Display result
else OTP Invalid/Expired
VerifyOTP-->>Frontend : Verification failure
Frontend->>User : Show error message
end
```

**Diagram sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Detailed Component Analysis

### AIQuoteGeneratorWithOTP Analysis
The AIQuoteGeneratorWithOTP component implements a state machine pattern to manage the multi-step form flow. It maintains state for each stage (form, otp, loading, result) and orchestrates transitions based on user actions and API responses. The component integrates with Supabase authentication and database services to ensure secure user verification before quote generation.

#### Component Flow Analysis
```mermaid
flowchart TD
Start([Form Stage]) --> CollectData["Collect User Information"]
CollectData --> RequestOTP["Request OTP Send"]
RequestOTP --> SendOTP["Call send-otp Edge Function"]
SendOTP --> OTPSent{"OTP Sent?"}
OTPSent --> |Yes| ShowOTPInput["Display OTP Input Form"]
OTPSent --> |No| ShowError["Show Error Message"]
ShowOTPInput --> UserEntersOTP["User Enters OTP"]
UserEntersOTP --> SubmitOTP["Submit OTP to verify-otp Function"]
SubmitOTP --> VerifyOTP["Call verify-otp Edge Function"]
VerifyOTP --> OTPValid{"OTP Valid?"}
OTPValid --> |Yes| ShowLoading["Show Loading State"]
ShowLoading --> GenerateQuote["Generate AI Quote"]
GenerateQuote --> ShowResult["Display Quote Result"]
OTPValid --> |No| HandleInvalidOTP["Handle Invalid OTP"]
HandleInvalidOTP --> RetryOTP["Allow OTP Retry"]
RetryOTP --> ShowOTPInput
ShowResult --> End([Result Stage])
```

**Diagram sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)

**Section sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)

### Supabase Edge Functions Analysis
The backend OTP functionality is implemented through two dedicated Supabase Edge Functions: send-otp and verify-otp. These serverless functions handle the secure aspects of the OTP workflow, including generation, storage, delivery, and validation.

#### OTP Processing Flow
```mermaid
flowchart TD
subgraph "send-otp Function"
A[Receive Phone/Email] --> B[Generate 6-digit OTP]
B --> C[Hash OTP with salt]
C --> D[Store in auth_otps table]
D --> E[Set 10-minute expiration]
E --> F[Send via Twilio/SendGrid]
F --> G[Return success response]
end
subgraph "verify-otp Function"
H[Receive Phone/Email + OTP] --> I[Lookup OTP record]
I --> J{Found?}
J --> |No| K[Return invalid error]
J --> |Yes| L{Expired?}
L --> |Yes| M[Return expired error]
L --> |No| N{Rate limited?}
N --> |Yes| O[Return rate limit error]
N --> |No| P[Compare hashed OTP]
P --> Q{Match?}
Q --> |No| R[Increment failed attempts]
Q --> |Yes| S[Mark as verified]
S --> T[Return success response]
end
```

**Diagram sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

**Section sources**
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Dependency Analysis
The OTP verification system depends on several key components and services to function correctly. The primary dependencies include Supabase authentication services, database connectivity for OTP storage, external delivery services (Twilio for SMS, SendGrid for email), and the AI quote generation engine.

```mermaid
graph LR
A[AIQuoteGeneratorWithOTP] --> B[Supabase Client]
B --> C[send-otp Function]
B --> D[verify-otp Function]
C --> E[Database: auth_otps]
D --> E
C --> F[Twilio API]
C --> G[SendGrid API]
A --> H[AI Quote Engine]
E --> I[Rate Limiting Service]
D --> I
```

**Diagram sources**
- [supabase/functions](file://supabase/functions)
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts)

**Section sources**
- [supabase/functions](file://supabase/functions)
- [src/lib/supabaseHelpers.ts](file://src/lib/supabaseHelpers.ts)

## Performance Considerations
The OTP verification workflow is designed with performance and user experience in mind. The system implements caching mechanisms for frequently accessed data and optimizes network requests through efficient payload design. The loading state during AI quote generation provides visual feedback to users, reducing perceived wait times. Error handling is optimized to provide immediate feedback for common issues like invalid OTP entries, minimizing unnecessary server round trips.

## Troubleshooting Guide
The OTP verification system includes comprehensive error handling and debug capabilities. Common issues include failed OTP delivery, expired OTPs, and rate limiting. The system provides specific error codes and messages to help diagnose issues. In debug mode, additional logging is available to trace the OTP workflow and identify bottlenecks or failures in the verification process.

**Section sources**
- [AIQuoteGeneratorWithOTP.tsx](file://src/components/AIQuoteGeneratorWithOTP.tsx)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Conclusion
The OTP verification workflow in the AI quote generation process provides a secure and user-friendly method for verifying user identity before generating quotes. By leveraging Supabase Edge Functions, the system maintains a strong security posture while delivering a seamless user experience. The multi-step form flow guides users through the process efficiently, and comprehensive error handling ensures reliability. Security features like rate limiting, OTP expiration, and protection against brute force attacks make this implementation robust and production-ready.