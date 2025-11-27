# OTP Authentication Flow

<cite>
**Referenced Files in This Document**
</cite>

## Table of Contents
1. [OTP Authentication Flow](#otp-authentication-flow)
2. [Implementation Details](#implementation-details)
3. [Security and Rate Limiting](#security-and-rate-limiting)
4. [Frontend Integration](#frontend-integration)
5. [Common Issues and Error Handling](#common-issues-and-error-handling)
6. [Best Practices for Secure OTP Implementation](#best-practices-for-secure-otp-implementation)

## Implementation Details

The OTP authentication system in the application is designed to securely verify user phone numbers through a two-step process: sending an OTP (One-Time Password) and verifying it. This flow involves two primary edge functions—`send-otp` and `verify-otp`—which are implemented as Supabase functions. These functions handle the generation, storage, validation, and expiration of OTPs.

OTPs are generated as 6-digit numeric codes and stored in the `phone_verification_otps` database table. Each OTP record includes the phone number, the hashed OTP value, timestamp of creation, and expiration time. The system enforces a 10-minute expiration policy, after which the OTP becomes invalid and a new one must be requested.

Before sending an OTP, the phone number is validated for proper formatting and international compliance. Upon successful validation, the `send-otp` function triggers an SMS delivery via a third-party messaging service. The actual OTP value is never logged in plaintext; instead, phone numbers are masked in logs (e.g., +1******1234) to protect user privacy.

The `verify-otp` function checks the submitted code against the stored (hashed) value, ensures it has not expired, and confirms it has not already been used. Upon successful verification, the user is authenticated, and a session is established.

**Section sources**

## Security and Rate Limiting

To prevent abuse and brute force attacks, the OTP system implements multiple security measures. A cooldown period of 5 minutes is enforced between OTP requests for the same phone number, limiting the frequency of attempts. This prevents rapid-fire requests that could overwhelm the SMS gateway or be used in enumeration attacks.

Each verification attempt is logged via the `log_otp_attempt` RPC (Remote Procedure Call), which records metadata such as timestamp, success/failure status, and IP address (where available). These logs are used for monitoring suspicious activity and auditing security events.

The system also includes protection against replay attacks by ensuring each OTP can only be used once. After a successful or failed verification attempt, the OTP is invalidated and cannot be reused.

Rate limiting is enforced at both the function level and the API gateway to prevent denial-of-service attacks. Additionally, the number of failed attempts from a single phone number or IP address is monitored, and excessive failures may trigger temporary blocking or additional verification challenges.

**Section sources**

## Frontend Integration

The frontend Auth page (Auth.tsx) serves as the user interface for the OTP authentication flow. It collects the user's phone number, validates its format using built-in regex patterns, and submits it to the `send-otp` function. Users are informed of the 5-minute cooldown if they request a new OTP before the timer expires.

After the OTP is sent, the UI transitions to a verification screen where the user enters the received code. This input is handled by the `input-otp` component, which provides visual feedback and enforces numeric-only entry. Upon submission, the code is sent to the `verify-otp` function for validation.

The frontend handles various states including loading, success, error, and timeout conditions, providing appropriate user feedback. Network errors are gracefully handled with retry options and informative messages.

**Section sources**

## Common Issues and Error Handling

Common issues in the OTP flow include:
- **Invalid or expired codes**: Users may enter incorrect codes or attempt to use expired ones. The system responds with clear error messages and allows requesting a new OTP.
- **Network errors**: Temporary connectivity issues may prevent OTP delivery or verification. The frontend implements retry logic and fallback messaging.
- **Brute force attempts**: Multiple failed verification attempts trigger rate limiting and may require additional user verification.
- **SMS delivery delays**: Third-party SMS services may experience delays. Users are informed of typical delivery times and can request a new code after the cooldown period.

Error responses are standardized and include human-readable messages while avoiding disclosure of sensitive system details.

**Section sources**

## Best Practices for Secure OTP Implementation

To ensure a secure and reliable OTP flow:
- Always hash OTPs before storage; never store them in plaintext.
- Enforce short expiration times (e.g., 10 minutes) to reduce the window of vulnerability.
- Implement rate limiting and cooldown periods to prevent abuse.
- Mask sensitive data like phone numbers in logs and error messages.
- Use secure communication channels (HTTPS) for all OTP-related requests.
- Monitor and log all authentication attempts for security auditing.
- Provide clear user feedback for all states, including errors and timeouts.
- Support alternative authentication methods for users who cannot receive SMS.
- Regularly audit the OTP system for vulnerabilities and compliance with security standards.

These practices help maintain the integrity of the authentication system while providing a smooth user experience.

**Section sources**