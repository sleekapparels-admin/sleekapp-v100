-- Lead Capture System for MVP Data Collection
-- Purpose: Collect early interest before full signup to train AI models

-- Lead capture table for pre-signup data collection
CREATE TABLE IF NOT EXISTS public.lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Basic contact info
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  
  -- Lead qualification
  user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'supplier', 'both', 'not_sure')),
  interest_level TEXT CHECK (interest_level IN ('high', 'medium', 'low')),
  
  -- Additional context
  monthly_volume_range TEXT, -- e.g., "0-500", "500-2000", "2000+"
  primary_product_categories TEXT[], -- Array of product types they're interested in
  geographical_region TEXT, -- Where they operate
  source TEXT, -- How they found us (utm_source or manual entry)
  message TEXT, -- Any additional message/notes
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'disqualified')),
  qualified_by UUID REFERENCES auth.users(id),
  qualified_at TIMESTAMPTZ,
  converted_to_user_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  referral_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  browser_info JSONB,
  
  -- Admin notes
  admin_notes TEXT,
  follow_up_date DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_status ON public.lead_captures(status);
CREATE INDEX IF NOT EXISTS idx_lead_captures_user_type ON public.lead_captures(user_type);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON public.lead_captures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_captures_converted_to ON public.lead_captures(converted_to_user_id);

-- Event tracking table for analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event details
  event_name TEXT NOT NULL, -- e.g., 'homepage_cta_clicked', 'signup_completed', 'lead_form_submitted'
  event_category TEXT, -- e.g., 'engagement', 'conversion', 'navigation'
  
  -- User identification (nullable for anonymous events)
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  anonymous_id TEXT,
  
  -- Event context
  page_url TEXT,
  referrer TEXT,
  event_properties JSONB, -- Additional data about the event
  
  -- Technical metadata
  user_agent TEXT,
  ip_address INET,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);

-- RLS Policies

-- Lead captures: Public can insert, only admins can read/update
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead capture form"
  ON public.lead_captures
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all lead captures"
  ON public.lead_captures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lead captures"
  ON public.lead_captures
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Analytics events: Authenticated users can insert their own, admins can view all
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Update timestamp trigger for lead_captures
CREATE OR REPLACE FUNCTION public.update_lead_capture_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_captures_updated_at
  BEFORE UPDATE ON public.lead_captures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_capture_updated_at();

-- Helper function to track conversion from lead to user
CREATE OR REPLACE FUNCTION public.convert_lead_to_user(
  lead_email TEXT,
  new_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.lead_captures
  SET 
    status = 'converted',
    converted_to_user_id = new_user_id,
    updated_at = NOW()
  WHERE email = lead_email
  AND status != 'converted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.lead_captures TO anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT, UPDATE ON public.lead_captures TO authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;

COMMENT ON TABLE public.lead_captures IS 'Stores lead information from homepage form submissions before full signup - used for AI training data collection and lead qualification';
COMMENT ON TABLE public.analytics_events IS 'Tracks user events across the platform for analytics and behavior analysis';
