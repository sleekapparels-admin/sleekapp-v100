-- COMPREHENSIVE SECURITY FIX: Address all remaining RLS policy issues
-- This migration fixes 5 critical security vulnerabilities by removing overly permissive policies
-- and adding proper service_role restrictions where needed

-- ============================================================================
-- ISSUE 1 & 2: Remove overly permissive policies on sample_requests and sample_submissions
-- These tables had public SELECT/INSERT/UPDATE policies that exposed business-sensitive data
-- ============================================================================

-- Fix sample_requests table
DROP POLICY IF EXISTS "sample_requests_select_policy" ON public.sample_requests;
DROP POLICY IF EXISTS "sample_requests_insert_policy" ON public.sample_requests;
DROP POLICY IF EXISTS "sample_requests_update_policy" ON public.sample_requests;

-- Fix sample_submissions table
DROP POLICY IF EXISTS "sample_submissions_select_policy" ON public.sample_submissions;
DROP POLICY IF EXISTS "sample_submissions_insert_policy" ON public.sample_submissions;
DROP POLICY IF EXISTS "sample_submissions_update_policy" ON public.sample_submissions;

-- Note: Keeping the existing restrictive policies that properly scope access:
-- - "Order participants view sample requests/submissions"
-- - "Buyers manage sample requests"
-- - "Suppliers create/update sample submissions"

-- ============================================================================
-- ISSUE 3: Fix quote_usage_tracking - CRITICAL PII EXPOSURE
-- This table exposed user emails and IP addresses with public ALL access
-- ============================================================================

DROP POLICY IF EXISTS "System can manage quote usage" ON public.quote_usage_tracking;

-- Restrict to service_role only (for edge functions)
CREATE POLICY "Service role manages quote usage"
ON public.quote_usage_tracking
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: If authenticated users need to view their own data, uncomment below:
-- CREATE POLICY "Users view their own usage"
-- ON public.quote_usage_tracking
-- FOR SELECT
-- TO authenticated
-- USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================================================
-- ISSUE 4: Fix timeline_predictions - Public write access
-- Anyone could create/modify timeline predictions, affecting business intelligence
-- ============================================================================

DROP POLICY IF EXISTS "System can create predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "System can update timeline predictions" ON public.timeline_predictions;

-- Restrict write operations to service_role only
CREATE POLICY "Service role manages predictions"
ON public.timeline_predictions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Keep the existing read policy "Users can view timelines for their quotes and orders"
-- which properly restricts SELECT to authenticated users viewing their own data

-- ============================================================================
-- ISSUE 5: Fix rate limiting tables - Security mechanism bypass risk
-- Four tables used public role instead of service_role, allowing manipulation
-- ============================================================================

-- Fix ai_quote_rate_limits
DROP POLICY IF EXISTS "Edge functions can manage rate limits" ON public.ai_quote_rate_limits;
CREATE POLICY "Service role manages AI quote rate limits"
ON public.ai_quote_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix conversation_rate_limits
DROP POLICY IF EXISTS "System manages rate limits" ON public.conversation_rate_limits;
CREATE POLICY "Service role manages conversation rate limits"
ON public.conversation_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix otp_rate_limits
DROP POLICY IF EXISTS "System can manage OTP rate limits" ON public.otp_rate_limits;
CREATE POLICY "Service role manages OTP rate limits"
ON public.otp_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix wishlist_rate_limits
DROP POLICY IF EXISTS "System can manage rate limits" ON public.wishlist_rate_limits;
CREATE POLICY "Service role manages wishlist rate limits"
ON public.wishlist_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- SECURITY FIX SUMMARY
-- ============================================================================
-- ✅ Removed 6 overly permissive policies (3 from sample_requests, 3 from sample_submissions)
-- ✅ Fixed PII exposure in quote_usage_tracking (emails, IPs)
-- ✅ Secured timeline_predictions against unauthorized writes
-- ✅ Protected 4 rate limiting tables from bypass attacks
-- ✅ All edge function operations now properly restricted to service_role
-- ============================================================================