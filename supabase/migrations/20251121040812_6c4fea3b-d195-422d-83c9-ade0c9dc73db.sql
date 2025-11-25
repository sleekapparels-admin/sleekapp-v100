-- Add admin SELECT policies to rate limit tables for monitoring dashboard

CREATE POLICY "Admins can view AI quote rate limits"
ON public.ai_quote_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view conversation rate limits"
ON public.conversation_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view OTP rate limits"
ON public.otp_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view wishlist rate limits"
ON public.wishlist_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));