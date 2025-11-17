-- 1) Harden OTP tables: remove public SELECT access and restrict to service role only

-- Email OTPs
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_otps FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can verify their own OTPs" ON public.email_verification_otps;
-- Ensure service role policy exists and is correct
DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.email_verification_otps;
CREATE POLICY "Service role can manage OTPs"
ON public.email_verification_otps
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Phone OTPs
ALTER TABLE public.phone_verification_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verification_otps FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can verify their own phone OTPs" ON public.phone_verification_otps;
DROP POLICY IF EXISTS "Service role can manage phone OTPs" ON public.phone_verification_otps;
CREATE POLICY "Service role can manage phone OTPs"
ON public.phone_verification_otps
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- 2) Tighten ai_quotes anonymous access window to 15 minutes (keeps session_id binding)
DROP POLICY IF EXISTS "Time-limited session access to quotes" ON public.ai_quotes;
CREATE POLICY "Time-limited session access to quotes"
ON public.ai_quotes
FOR SELECT TO anon
USING (
  auth.uid() IS NULL
  AND session_id IS NOT NULL
  AND session_id = (current_setting('request.jwt.claims', true))::json->>'session_id'
  AND created_at > (now() - interval '15 minutes')
);

-- Keep existing authenticated/admin policies as-is
