-- Create resource_downloads table for tracking download requests
CREATE TABLE IF NOT EXISTS public.resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('buyers_guide', 'material_chart')),
  source TEXT DEFAULT 'homepage',
  ip_address TEXT,
  user_agent TEXT,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resource_downloads_email ON public.resource_downloads(email);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_created_at ON public.resource_downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource_type ON public.resource_downloads(resource_type);

-- Enable RLS
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Service role can insert (edge functions)
CREATE POLICY "Service role can insert resource downloads"
  ON public.resource_downloads
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Admins can view all downloads
CREATE POLICY "Admins can view all resource downloads"
  ON public.resource_downloads
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));