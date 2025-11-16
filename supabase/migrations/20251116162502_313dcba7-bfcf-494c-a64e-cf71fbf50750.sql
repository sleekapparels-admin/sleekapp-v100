-- Security Hardening: Remove public OTP access and enable password breach protection

-- 1. Remove public access to phone verification OTPs (only service role should access)
DROP POLICY IF EXISTS "Users can verify their own phone OTPs" ON phone_verification_otps;
DROP POLICY IF EXISTS "Allow public to insert phone OTPs" ON phone_verification_otps;

-- 2. Remove public access to email verification OTPs (only service role should access)
DROP POLICY IF EXISTS "Users can verify their own email OTPs" ON email_verification_otps;
DROP POLICY IF EXISTS "Allow public to insert email OTPs" ON email_verification_otps;

-- 3. OTP tables should only be accessible via edge functions using service role
-- No RLS policies needed - edge functions will handle all OTP operations

-- Note: Leaked password protection is now enforced client-side via password-breach-check edge function
-- The ChangePasswordDialog component now validates passwords against HaveIBeenPwned before allowing changes