-- ============================================================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- Fixes remaining RLS policy vulnerabilities identified in security review
-- ============================================================================

-- ============================================================================
-- Phase 1: Rate Limit Tables (Add TO service_role clause)
-- ============================================================================

-- 1. Fix conversation_rate_limits
DROP POLICY IF EXISTS "Service role manages conversation rate limits" ON public.conversation_rate_limits;
CREATE POLICY "Service role manages conversation rate limits"
ON public.conversation_rate_limits FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- 2. Fix otp_rate_limits
DROP POLICY IF EXISTS "Service role manages OTP rate limits" ON public.otp_rate_limits;
CREATE POLICY "Service role manages OTP rate limits"
ON public.otp_rate_limits FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- 3. Fix wishlist_rate_limits
DROP POLICY IF EXISTS "Service role manages wishlist rate limits" ON public.wishlist_rate_limits;
CREATE POLICY "Service role manages wishlist rate limits"
ON public.wishlist_rate_limits FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- 4. Fix otp_verification_attempts
DROP POLICY IF EXISTS "Service role can manage attempts" ON public.otp_verification_attempts;
CREATE POLICY "Service role manages OTP attempts"
ON public.otp_verification_attempts FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- 5. Fix quote_usage_tracking
DROP POLICY IF EXISTS "Service role manages quote usage" ON public.quote_usage_tracking;
CREATE POLICY "Service role manages quote usage"
ON public.quote_usage_tracking FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- ============================================================================
-- Phase 2: Admin Audit Logs (Restrict INSERT to service_role)
-- ============================================================================

DROP POLICY IF EXISTS "Only service_role inserts audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "System can create audit logs" ON public.admin_audit_logs;
CREATE POLICY "Service role inserts audit logs"
ON public.admin_audit_logs FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================================================
-- Phase 3: Social Shares (Remove old permissive ALL policy)
-- ============================================================================

DROP POLICY IF EXISTS "Service role can manage social shares" ON public.social_shares;

-- ============================================================================
-- Phase 4: Timeline Predictions (Proper service_role + role-based access)
-- ============================================================================

DROP POLICY IF EXISTS "Service role manages predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "System manages predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "Admins can view predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "Buyers view their order predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "Suppliers view assigned order predictions" ON public.timeline_predictions;

-- Service role has full access
CREATE POLICY "Service role manages predictions"
ON public.timeline_predictions FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- Admins can view all predictions
CREATE POLICY "Admins can view predictions"
ON public.timeline_predictions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Buyers can view predictions for their orders
CREATE POLICY "Buyers view their order predictions"
ON public.timeline_predictions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = timeline_predictions.order_id
    AND o.buyer_id = auth.uid()
  )
);

-- Suppliers can view predictions for assigned orders
CREATE POLICY "Suppliers view assigned order predictions"
ON public.timeline_predictions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = timeline_predictions.order_id
    AND o.supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  )
);

-- ============================================================================
-- Phase 5: OTP Tables (Proper service_role restriction)
-- ============================================================================

-- Fix email_verification_otps
DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.email_verification_otps;
CREATE POLICY "Service role manages email OTPs"
ON public.email_verification_otps FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- Fix phone_verification_otps
DROP POLICY IF EXISTS "Service role can manage phone OTPs" ON public.phone_verification_otps;
CREATE POLICY "Service role manages phone OTPs"
ON public.phone_verification_otps FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- ============================================================================
-- Phase 6: Conversation Analytics (Proper service_role restriction)
-- ============================================================================

DROP POLICY IF EXISTS "System updates analytics" ON public.conversation_analytics;
DROP POLICY IF EXISTS "System manages analytics" ON public.conversation_analytics;
DROP POLICY IF EXISTS "Service role manages analytics" ON public.conversation_analytics;
DROP POLICY IF EXISTS "Service role inserts analytics" ON public.conversation_analytics;

CREATE POLICY "Service role manages analytics"
ON public.conversation_analytics FOR ALL
TO service_role
USING (true) WITH CHECK (true);