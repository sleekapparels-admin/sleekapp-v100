# Authentication Components

<cite>
**Referenced Files in This Document**  
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)
- [client.ts](file://src/integrations/supabase/client.ts)
- [Auth.tsx](file://src/pages/Auth.tsx)
- [supabase-adapter.ts](file://src/lib/firebase/supabase-adapter.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Authentication Workflow](#authentication-workflow)
7. [Security Features](#security-features)
8. [Form Validation and Error Handling](#form-validation-and-error-handling)
9. [Role-Based Redirection and Session Management](#role-based-redirection-and-session-management)
10. [Integration with Firebase and Supabase](#integration-with-firebase-and-supabase)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive documentation for the authentication components in the SleekApp platform, focusing on the CustomerSignupForm and ProductionPartnerSignupForm. The authentication system implements a multi-step registration workflow with identity verification, integrating Firebase Authentication for user management and Supabase as the backend database. The system includes robust security features such as password breach checking and OTP verification, with form validation powered by React Hook Form and Zod. This documentation details the implementation, workflow, and integration patterns used throughout the authentication system.

## Project Structure
The authentication components are organized within the src directory following a feature-based structure. The core authentication components reside in the src/components/auth directory, while authentication hooks are located in src/hooks, and Firebase/Supabase integration utilities are in src/lib/firebase and src/integrations/supabase respectively. Serverless functions for authentication operations are implemented in the supabase/functions directory.

```mermaid
graph TB
subgraph "Frontend Components"
AuthForms["auth/ (CustomerSignupForm, ProductionPartnerSignupForm)"]
AuthPage["pages/Auth.tsx"]
FirebaseAuthHook["hooks/useFirebaseAuth.tsx"]
end
subgraph "Integration Layer"
FirebaseAuth["lib/firebase/auth.ts"]
SupabaseAdapter["lib/firebase/supabase-adapter.ts"]
SupabaseClient["integrations/supabase/client.ts"]
end
subgraph "Backend Services"
PasswordBreach["functions/password-breach-check/"]
SendOTP["functions/send-otp/"]
VerifyOTP["functions/verify-otp/"]
end
AuthForms --> FirebaseAuthHook
FirebaseAuthHook --> FirebaseAuth
FirebaseAuth --> SupabaseAdapter
SupabaseAdapter --> SupabaseClient
FirebaseAuth --> PasswordBreach
FirebaseAuth --> SendOTP
FirebaseAuth --> VerifyOTP
```

**Diagram sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)
- [supabase-adapter.ts](file://src/lib/firebase/supabase-adapter.ts)
- [client.ts](file://src/integrations/supabase/client.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

**Section sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)

## Core Components
The authentication system centers around two primary signup components: CustomerSignupForm and ProductionPartnerSignupForm. These components implement a multi-step registration process with progressive form disclosure, collecting user information in stages to improve usability. Both components leverage React Hook Form for form state management and validation, with Zod for schema validation. The forms integrate with Firebase Authentication for identity management and Supabase for persistent data storage, implementing role-based user differentiation from the point of registration.

**Section sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)

## Architecture Overview
The authentication architecture follows a layered pattern with clear separation of concerns between presentation, business logic, and data access layers. The frontend components handle user interface and form validation, while custom hooks encapsulate authentication logic and state management. The integration layer translates between Firebase Authentication and Supabase, ensuring data consistency across both systems. Serverless functions deployed on Supabase handle sensitive operations like password breach checking and OTP verification, maintaining security boundaries.

```mermaid
graph TD
A[User Interface] --> B[React Components]
B --> C[React Hook Form + Zod]
C --> D[useFirebaseAuth Hook]
D --> E[Firebase Authentication]
D --> F[Supabase Backend]
E --> G[Identity Management]
F --> H[Data Storage]
D --> I[Serverless Functions]
I --> J[Password Breach Check]
I --> K[OTP Verification]
I --> L[Email Validation]
style A fill:#f9f,stroke:#333
style G fill:#bbf,stroke:#333
style H fill:#bbf,stroke:#333
```

**Diagram sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)

## Detailed Component Analysis

### CustomerSignupForm Analysis
The CustomerSignupForm component implements a multi-step registration process for customer users. It collects basic information, contact details, and preferences in sequential steps, providing a guided onboarding experience. The form uses React Hook Form for efficient form state management and re-renders, with Zod for comprehensive schema validation at each step.

```mermaid
flowchart TD
Start([Start Registration]) --> Step1["Step 1: Basic Information<br/>Name, Email, Password"]
Step1 --> Validate1["Validate with Zod Schema"]
Validate1 --> PasswordCheck["Check Password Against Breach Database"]
PasswordCheck --> Step2["Step 2: Contact Information<br/>Phone, Address"]
Step2 --> Validate2["Validate Contact Details"]
Validate2 --> Step3["Step 3: Preferences<br/>Interests, Communication"]
Step3 --> Validate3["Validate Preferences"]
Validate3 --> Submit["Submit to Firebase + Supabase"]
Submit --> Confirm["Send Email Confirmation"]
Confirm --> Complete([Registration Complete])
style Start fill:#4CAF50,stroke:#333
style Complete fill:#4CAF50,stroke:#333
style PasswordCheck fill:#FF9800,stroke:#333
```

**Diagram sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)

### ProductionPartnerSignupForm Analysis
The ProductionPartnerSignupForm component handles registration for production partners (suppliers), collecting additional business-specific information beyond the standard user data. This includes company details, production capabilities, certifications, and compliance information. The form implements conditional logic to show relevant fields based on the partner type selected.

```mermaid
flowchart TD
Start([Start Partner Registration]) --> Step1["Step 1: Business Information<br/>Company Name, Type, Size"]
Step1 --> Step2["Step 2: Contact & Location<br/>Address, Phone, Primary Contact"]
Step2 --> Step3["Step 3: Production Capabilities<br/>Specialties, Capacity, Equipment"]
Step3 --> Step4["Step 4: Certifications & Compliance<br/>Quality Standards, Environmental"]
Step4 --> Step5["Step 5: Banking & Tax Information<br/>Payment Details, Tax ID"]
Step5 --> ValidateAll["Validate All Sections"]
ValidateAll --> Submit["Submit for Review"]
Submit --> AdminReview["Admin Verification Required"]
AdminReview --> Approved["Approved: Activate Account"]
AdminReview --> Rejected["Rejected: Notify Applicant"]
style Start fill:#4CAF50,stroke:#333
style Approved fill:#4CAF50,stroke:#333
style Rejected fill:#F44336,stroke:#333
style AdminReview fill:#FF9800,stroke:#333
```

**Diagram sources**
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)

### Authentication Hook Analysis
The useFirebaseAuth custom hook encapsulates the authentication logic, providing a clean interface between the UI components and the underlying authentication services. It manages the authentication state, handles login, registration, and logout operations, and integrates with both Firebase Authentication and Supabase.

```mermaid
sequenceDiagram
participant Form as SignupForm
participant Hook as useFirebaseAuth
participant Firebase as Firebase Auth
participant Supabase as Supabase
participant OTP as OTP Function
Form->>Hook : registerUser(userData)
Hook->>Firebase : createUserWithEmailAndPassword()
Firebase-->>Hook : UserCredential
Hook->>Hook : Extract user ID and token
Hook->>OTP : sendOTP(phoneNumber)
OTP-->>Hook : OTP Sent Confirmation
Hook->>Form : Request OTP from user
Form->>Hook : submitOTP(otpCode)
Hook->>OTP : verifyOTP(otpCode)
OTP-->>Hook : Verification Result
Hook->>Supabase : createUserProfile(profileData)
Supabase-->>Hook : Profile Created
Hook->>Firebase : updateUserProfile(displayName)
Firebase-->>Hook : Profile Updated
Hook-->>Form : Registration Complete
```

**Diagram sources**
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)
- [supabase-adapter.ts](file://src/lib/firebase/supabase-adapter.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Authentication Workflow
The authentication workflow follows a multi-step process designed to balance security, usability, and data completeness. For both customer and production partner registration, the workflow progresses through information collection, validation, identity verification, and account activation stages.

```mermaid
graph TD
A[User Initiates Registration] --> B[Select Account Type]
B --> C{Customer or Partner?}
C --> |Customer| D[CustomerSignupForm]
C --> |Partner| E[ProductionPartnerSignupForm]
D --> F[Collect Basic Information]
E --> G[Collect Business Information]
F --> H[Validate Input with Zod]
G --> H
H --> I[Check Password Against Breach Database]
I --> J[Send Verification OTP]
J --> K[User Enters OTP]
K --> L[Verify OTP with Supabase Function]
L --> M{Verification Success?}
M --> |Yes| N[Create User in Firebase]
M --> |No| O[Show Error, Allow Retry]
O --> K
N --> P[Create Profile in Supabase]
P --> Q[Set Custom Claims for Role]
Q --> R[Send Welcome Email]
R --> S[Redirect to Dashboard]
style A fill:#2196F3,stroke:#333
style S fill:#4CAF50,stroke:#333
style O fill:#F44336,stroke:#333
```

**Diagram sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Security Features
The authentication system implements multiple security layers to protect user accounts and prevent common attack vectors. These include password breach checking, multi-factor authentication via OTP, rate limiting, and secure session management.

### Password Breach Checking
The system integrates with a password breach checking service to prevent users from setting compromised passwords. When a user creates an account or changes their password, the system checks the password against a database of known breached passwords.

```mermaid
sequenceDiagram
participant Form as SignupForm
participant Auth as FirebaseAuth
participant BreachCheck as BreachCheck Function
participant Firebase as Firebase
Form->>Auth : submitPassword(password)
Auth->>BreachCheck : checkPasswordBreach(password)
BreachCheck->>BreachCheck : Hash password with SHA-256
BreachCheck->>BreachCheck : Extract first 5 characters of hash
BreachCheck->>ExternalAPI : GET /api/breaches/{first5}
ExternalAPI-->>BreachCheck : List of hash suffixes
BreachCheck->>BreachCheck : Check if full hash exists
BreachCheck-->>Auth : Breach status (safe/breached)
Auth->>Form : Password valid/invalid
```

**Diagram sources**
- [auth.ts](file://src/lib/firebase/auth.ts)
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)

### OTP Verification Flow
The OTP verification system provides an additional layer of security by verifying user ownership of a phone number. The system generates time-limited codes sent via SMS, which users must enter to complete registration or sensitive operations.

```mermaid
flowchart TD
A[Request OTP] --> B[Generate Random 6-Digit Code]
B --> C[Store Code in Redis with TTL]
C --> D[Send SMS via Twilio]
D --> E[User Receives SMS]
E --> F[User Enters Code in App]
F --> G[Verify Code Against Redis]
G --> H{Code Matches & Not Expired?}
H --> |Yes| I[Mark Phone as Verified]
H --> |No| J[Show Error Message]
I --> K[Complete Registration/Action]
J --> F
style A fill:#2196F3,stroke:#333
style K fill:#4CAF50,stroke:#333
style J fill:#F44336,stroke:#333
```

**Diagram sources**
- [auth.ts](file://src/lib/firebase/auth.ts)
- [send-otp/index.ts](file://supabase/functions/send-otp/index.ts)
- [verify-otp/index.ts](file://supabase/functions/verify-otp/index.ts)

## Form Validation and Error Handling
The authentication forms implement comprehensive validation using React Hook Form and Zod, providing real-time feedback and clear error messages. The validation strategy combines client-side validation for immediate feedback with server-side validation for security-critical checks.

### Validation Architecture
```mermaid
graph TD
A[User Input] --> B[React Hook Form State]
B --> C{Field Changed?}
C --> |Yes| D[Trigger Zod Schema Validation]
D --> E{Valid?}
E --> |Yes| F[Update Form State]
E --> |No| G[Display Field Error]
F --> H[Enable Next Step/Submit]
G --> I[Highlight Invalid Fields]
H --> J[Submit Form]
J --> K[Server-Side Validation]
K --> L{Valid?}
L --> |Yes| M[Process Request]
L --> |No| N[Return Detailed Errors]
N --> O[Display Server Errors]
style A fill:#2196F3,stroke:#333
style M fill:#4CAF50,stroke:#333
style N fill:#F44336,stroke:#333
```

**Diagram sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)

## Role-Based Redirection and Session Management
The system implements role-based redirection after login, directing users to appropriate dashboards based on their role (customer, production partner, or admin). Session management follows security best practices with token refresh mechanisms and idle timeout detection.

```mermaid
sequenceDiagram
participant User as User
participant AuthPage as Auth.tsx
participant Hook as useFirebaseAuth
participant Firebase as Firebase Auth
participant Supabase as Supabase
User->>AuthPage : Navigate to /auth
AuthPage->>Hook : checkAuthState()
Hook->>Firebase : onAuthStateChanged()
Firebase-->>Hook : User object or null
Hook->>Supabase : getUserProfile(userId)
Supabase-->>Hook : User data with role
Hook->>Hook : Determine redirect path based on role
Hook->>AuthPage : redirectUser(path)
AuthPage->>User : Navigate to dashboard
Note over Hook,Supabase : Role-based redirection logic
```

**Diagram sources**
- [Auth.tsx](file://src/pages/Auth.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [supabase-adapter.ts](file://src/lib/firebase/supabase-adapter.ts)

## Integration with Firebase and Supabase
The authentication system leverages Firebase Authentication for identity management and Supabase for data persistence, using a custom adapter pattern to bridge the two systems. This hybrid approach combines Firebase's robust authentication features with Supabase's flexible PostgreSQL backend.

```mermaid
classDiagram
class FirebaseAuth {
+createUserWithEmailAndPassword(email, password)
+signInWithEmailAndPassword(email, password)
+sendPasswordResetEmail(email)
+verifyPasswordResetCode(code)
+applyActionCode(code)
}
class SupabaseClient {
+from(table)
+insert(data)
+update(data)
+select()
+rpc(functionName, params)
}
class SupabaseAdapter {
-firebaseAuth : FirebaseAuth
-supabaseClient : SupabaseClient
+createUserProfile(userData)
+getUserProfile(userId)
+updateUserProfile(userId, data)
+setUserRole(userId, role)
+logSecurityEvent(event)
}
class FirebaseAuthHook {
-adapter : SupabaseAdapter
+registerUser(userData)
+login(email, password)
+logout()
+resetPassword(email)
+verifyPhone(otp)
}
FirebaseAuthHook --> SupabaseAdapter : "uses"
SupabaseAdapter --> FirebaseAuth : "delegates auth"
SupabaseAdapter --> SupabaseClient : "delegates data"
```

**Diagram sources**
- [auth.ts](file://src/lib/firebase/auth.ts)
- [supabase-adapter.ts](file://src/lib/firebase/supabase-adapter.ts)
- [client.ts](file://src/integrations/supabase/client.ts)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)

## Troubleshooting Guide
This section documents common issues and their solutions related to the authentication components.

### Common Registration Issues
- **Email already in use**: The system prevents duplicate accounts with the same email. Users should use the password reset flow if they've forgotten their credentials.
- **OTP not received**: Check spam folder, verify phone number format, and ensure SMS gateway is operational. The system allows resending OTP after a cooldown period.
- **Password breach detected**: Users must choose a stronger password that hasn't been exposed in data breaches.
- **Form validation errors**: Ensure all required fields are completed with valid data according to the specified formats.

### Debugging Authentication Flows
When troubleshooting authentication issues, check the following:
1. Verify Firebase configuration is correctly loaded
2. Check network requests to Supabase functions for errors
3. Review browser console for JavaScript errors
4. Validate that environment variables are properly set
5. Check rate limiting on OTP requests

**Section sources**
- [CustomerSignupForm.tsx](file://src/components/auth/CustomerSignupForm.tsx)
- [ProductionPartnerSignupForm.tsx](file://src/components/auth/ProductionPartnerSignupForm.tsx)
- [useFirebaseAuth.tsx](file://src/hooks/useFirebaseAuth.tsx)
- [auth.ts](file://src/lib/firebase/auth.ts)

## Conclusion
The authentication system in SleekApp provides a secure, user-friendly registration and login experience with robust validation and security features. By combining Firebase Authentication with Supabase backend services, the system achieves a balance of reliability, scalability, and flexibility. The modular architecture with clear separation of concerns makes the system maintainable and extensible, while the comprehensive validation and error handling ensure a smooth user experience. The role-based access control and redirection patterns enable personalized user journeys from the moment of registration.