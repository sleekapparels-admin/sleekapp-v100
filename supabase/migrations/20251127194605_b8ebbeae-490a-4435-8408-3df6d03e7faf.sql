-- Fix security definer views to use SECURITY INVOKER instead
-- This ensures views use the permissions of the querying user, not the view creator

DROP VIEW IF EXISTS public.ai_hourly_costs;
DROP VIEW IF EXISTS public.daily_security_summary;

-- Recreate views with SECURITY INVOKER
CREATE OR REPLACE VIEW public.ai_hourly_costs 
WITH (security_invoker = true)
AS
SELECT 
  date_trunc('hour', created_at) as hour,
  function_name,
  model,
  COUNT(*) as request_count,
  SUM(request_tokens) as total_request_tokens,
  SUM(response_tokens) as total_response_tokens,
  SUM(estimated_cost) as total_cost
FROM public.ai_cost_tracking
GROUP BY date_trunc('hour', created_at), function_name, model;

CREATE OR REPLACE VIEW public.daily_security_summary
WITH (security_invoker = true)
AS
SELECT 
  date_trunc('day', created_at) as day,
  event_type,
  severity,
  COUNT(*) as event_count,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT session_id) as unique_sessions
FROM public.security_events
GROUP BY date_trunc('day', created_at), event_type, severity;