-- Create table for exit-intent popup sample requests (different from order-related samples)
CREATE TABLE IF NOT EXISTS public.exit_intent_sample_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'sent', 'fulfilled')),
  source TEXT DEFAULT 'exit_intent_popup' NOT NULL,
  notes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exit_intent_sample_email ON public.exit_intent_sample_requests(email);
CREATE INDEX IF NOT EXISTS idx_exit_intent_sample_created ON public.exit_intent_sample_requests(created_at);

-- Enable RLS
ALTER TABLE public.exit_intent_sample_requests ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to insert
CREATE POLICY "Edge functions can insert sample requests"
  ON public.exit_intent_sample_requests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view sample requests"
  ON public.exit_intent_sample_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

COMMENT ON TABLE public.exit_intent_sample_requests IS 'Stores sample pack requests from exit-intent popup';