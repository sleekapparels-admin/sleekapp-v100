-- Create security monitoring tables for tracking suspicious activity and costs

-- Table for tracking CAPTCHA failures and suspicious patterns
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('captcha_failure', 'rate_limit_violation', 'suspicious_pattern', 'cost_alert')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL, -- Edge function name or component
  user_id UUID,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying security events
CREATE INDEX idx_security_events_type_date ON public.security_events(event_type, created_at DESC);
CREATE INDEX idx_security_events_severity ON public.security_events(severity, created_at DESC);
CREATE INDEX idx_security_events_ip ON public.security_events(ip_address, created_at DESC);

-- Table for tracking AI API costs
CREATE TABLE IF NOT EXISTS public.ai_cost_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  model TEXT NOT NULL, -- e.g., 'google/gemini-2.5-flash', 'perplexity/sonar'
  request_tokens INTEGER,
  response_tokens INTEGER,
  estimated_cost DECIMAL(10, 6), -- In USD
  session_id TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for cost analysis
CREATE INDEX idx_ai_cost_function_date ON public.ai_cost_tracking(function_name, created_at DESC);
CREATE INDEX idx_ai_cost_model ON public.ai_cost_tracking(model, created_at DESC);
CREATE INDEX idx_ai_cost_user ON public.ai_cost_tracking(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- View for hourly cost aggregation
CREATE OR REPLACE VIEW public.ai_hourly_costs AS
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

-- View for daily security event summary
CREATE OR REPLACE VIEW public.daily_security_summary AS
SELECT 
  date_trunc('day', created_at) as day,
  event_type,
  severity,
  COUNT(*) as event_count,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT session_id) as unique_sessions
FROM public.security_events
GROUP BY date_trunc('day', created_at), event_type, severity;

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cost_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies - only service_role can access (tables for internal monitoring only)
CREATE POLICY "Service role can manage security events"
  ON public.security_events
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage cost tracking"
  ON public.ai_cost_tracking
  FOR ALL
  USING (auth.role() = 'service_role');