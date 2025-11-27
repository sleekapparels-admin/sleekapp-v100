# Password Security

<cite>
**Referenced Files in This Document**  
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts)
- [ChangePasswordDialog.tsx](file://src/components/ChangePasswordDialog.tsx)
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Password Breach Check Edge Function](#password-breach-check-edge-function)
3. [Client-Side Integration in ChangePasswordDialog](#client-side-integration-in-changepassworddialog)
4. [Security Architecture and Migration Rationale](#security-architecture-and-migration-rationale)
5. [Implementation Details](#implementation-details)
6. [Security Considerations](#security-considerations)
7. [Conclusion](#conclusion)

## Introduction
This document provides a comprehensive overview of the password security mechanisms implemented in sleekapp-v100, with a focus on the password-breach-check Edge Function. The system leverages k-anonymity principles to securely verify user passwords against the Have I Been Pwned (HIBP) database without exposing the full password or compromising user privacy. The architecture strategically places breach validation on the client side while maintaining server-side control and integrity. This design balances security, performance, and user experience.

## Password Breach Check Edge Function

The `password-breach-check` Edge Function serves as a secure intermediary between the client application and the Have I Been Pwned API. It implements k-anonymity by accepting only the first five characters of a SHA-1 hashed password, ensuring that no full password hash is ever transmitted or processed by the server. This approach allows the system to check if a password has appeared in known data breaches without risking exposure of the complete hash.

The function enforces strict CORS policies and validates allowed origins to prevent unauthorized access. It acts as a proxy to the HIBP API, shielding the client from direct interaction and protecting against potential abuse or rate-limiting issues. When the HIBP service is unavailable, the function implements a safe fallback mechanism that allows password changes to proceed while logging the incident for monitoring purposes.

**Section sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L1-L150)

## Client-Side Integration in ChangePasswordDialog

The `ChangePasswordDialog.tsx` component integrates the password breach check directly into the user interface during password updates. Before submitting a new password, the client computes the SHA-1 hash of the input, extracts the first five characters, and sends this partial hash to the `password-breach-check` Edge Function.

This client-side validation provides immediate feedback to users if their chosen password has been compromised, encouraging stronger password selection. The implementation ensures that the full password or its complete hash never leaves the user's device, preserving privacy and security. The UI displays clear warnings when a breached password is detected, guiding users toward safer alternatives.

**Section sources**
- [ChangePasswordDialog.tsx](file://src/components/ChangePasswordDialog.tsx#L25-L200)

## Security Architecture and Migration Rationale

A key architectural decision documented in the `add_supplier_to_quotes.sql` migration file involves moving password breach checking to the client side while retaining server-side enforcement. This hybrid model allows real-time user feedback without sacrificing backend control over authentication policies.

By delegating the initial breach check to the client, the system reduces server load and improves responsiveness. However, the final authentication and password storage logic remains server-managed, ensuring that security policies cannot be bypassed. This approach reflects a deliberate shift toward more responsive, user-friendly security practices without weakening overall system integrity.

The migration underscores a broader security philosophy: empower clients with visibility and guidance, but maintain authoritative control at the server level. This balance supports both usability and robust security posture.

**Section sources**
- [add_supplier_to_quotes.sql](file://supabase/migrations/add_supplier_to_quotes.sql#L1-L10)

## Implementation Details

### SHA-1 Hashing and K-Anonymity
The system uses SHA-1 hashing to transform passwords into fixed-length hashes. Only the first five hexadecimal characters (20 bits) of the hash are sent to the Edge Function. This partial hash is used to query the HIBP API, which returns all known breached hashes sharing the same prefix. The client then performs a local comparison to determine if the full hash matches any in the result set, completing the k-anonymity protocol.

### CORS Policy Enforcement
The Edge Function enforces strict CORS policies, permitting requests only from authorized origins defined in the application's configuration. This prevents cross-site exploitation and ensures that only legitimate instances of the application can access the breach-checking service.

### Allowed Origins Validation
Origin validation is performed using a whitelist approach, where the server checks the `Origin` header against a predefined list of trusted domains. Dynamic origin checking based on environment variables allows flexible configuration across development, staging, and production environments.

### Fallback Behavior
When the HIBP service is unreachable due to network issues or downtime, the Edge Function returns a non-blocking response, allowing the password change process to continue. This fail-open behavior prioritizes user access while logging the event for security review. The rationale is to avoid denying legitimate users access due to third-party service outages, while still encouraging strong passwords through best-effort breach checking.

**Section sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L50-L150)

## Security Considerations

### Fail-Closed Design for Critical Operations
While the breach check uses a fail-open model for availability, other security mechanisms follow a fail-closed principle. Authentication attempts are denied by default unless explicitly validated, and suspicious activities trigger immediate denial and alerting.

### Protection Against Timing Attacks
The Edge Function ensures constant-time responses regardless of whether a match is found, preventing attackers from inferring information based on response duration. All cryptographic operations use secure, timing-safe libraries to eliminate side-channel vulnerabilities.

### Data Minimization
The system adheres to data minimization principles by never transmitting or storing full password hashes outside the client environment. The partial hash used for breach checking cannot be reversed or used to reconstruct the original password.

### Logging and Monitoring
Security events, including failed breach checks and service outages, are logged via the shared `securityLogger.ts` module. These logs enable auditing and detection of potential abuse patterns without storing sensitive user data.

**Section sources**
- [password-breach-check/index.ts](file://supabase/functions/password-breach-check/index.ts#L100-L150)
- [supabase/functions/_shared/logger.ts](file://supabase/functions/_shared/logger.ts#L1-L30)
- [supabase/functions/shared/securityLogger.ts](file://supabase/functions/shared/securityLogger.ts#L1-L25)

## Conclusion
The password security implementation in sleekapp-v100 demonstrates a sophisticated balance between user experience and robust security. By leveraging k-anonymity through the password-breach-check Edge Function and integrating it seamlessly into the client-side ChangePasswordDialog, the system empowers users to make informed decisions about their password strength. The architecture maintains server-side authority over authentication while enabling responsive client-side validation, reflecting a modern, layered approach to application security.