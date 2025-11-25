-- =====================================================
-- Security Fix Migration: Remaining System Tables RLS
-- Fixes remaining overly permissive INSERT policies
-- =====================================================

-- Create bootstrap_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS public.bootstrap_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on bootstrap_attempts
ALTER TABLE public.bootstrap_attempts ENABLE ROW LEVEL SECURITY;

-- Only service_role can access bootstrap_attempts
CREATE POLICY "Service role manages bootstrap attempts"
ON public.bootstrap_attempts FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_bootstrap_attempts_ip_time 
ON public.bootstrap_attempts(ip_address, created_at DESC);

-- =====================================================
-- Fix notifications table
-- =====================================================
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Service role can create notifications" 
ON public.notifications FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix production_stages table
-- =====================================================
DROP POLICY IF EXISTS "production_stages_insert_policy" ON public.production_stages;
CREATE POLICY "Service role can insert production stages" 
ON public.production_stages FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix ai_usage_logs table
-- =====================================================
DROP POLICY IF EXISTS "System can create usage logs" ON public.ai_usage_logs;
CREATE POLICY "Service role can create usage logs" 
ON public.ai_usage_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix batch_contributions table
-- =====================================================
DROP POLICY IF EXISTS "System can create contributions" ON public.batch_contributions;
CREATE POLICY "Service role can create contributions" 
ON public.batch_contributions FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix timeline_predictions table
-- =====================================================
DROP POLICY IF EXISTS "System can create predictions" ON public.timeline_predictions;
CREATE POLICY "Service role can create predictions" 
ON public.timeline_predictions FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix capacity_utilization_logs table
-- =====================================================
DROP POLICY IF EXISTS "System can insert logs" ON public.capacity_utilization_logs;
CREATE POLICY "Service role can insert capacity logs" 
ON public.capacity_utilization_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix conversation_analytics table
-- =====================================================
DROP POLICY IF EXISTS "System manages analytics" ON public.conversation_analytics;
CREATE POLICY "Service role manages analytics" 
ON public.conversation_analytics FOR INSERT
WITH CHECK (auth.role() = 'service_role');