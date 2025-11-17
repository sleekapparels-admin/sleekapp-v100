-- Create enum for product interaction types
CREATE TYPE product_interaction_type AS ENUM (
  'hover',
  'quick_view_click',
  'wishlist_click',
  'color_swatch_click',
  'design_click',
  'quote_click',
  'add_to_cart',
  'view_details'
);

-- Create product_interactions table for analytics
CREATE TABLE public.product_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT NOT NULL,
  product_id UUID NOT NULL,
  interaction_type product_interaction_type NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  additional_data JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Create indexes for faster analytics queries
CREATE INDEX idx_product_interactions_product_id ON public.product_interactions(product_id);
CREATE INDEX idx_product_interactions_session_id ON public.product_interactions(session_id);
CREATE INDEX idx_product_interactions_user_id ON public.product_interactions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_product_interactions_timestamp ON public.product_interactions(timestamp DESC);
CREATE INDEX idx_product_interactions_type ON public.product_interactions(interaction_type);
CREATE INDEX idx_product_interactions_composite ON public.product_interactions(product_id, interaction_type, timestamp DESC);

-- Enable RLS
ALTER TABLE public.product_interactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert interactions (for anonymous tracking)
CREATE POLICY "Anyone can insert product interactions"
  ON public.product_interactions
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view interactions
CREATE POLICY "Admins can view all interactions"
  ON public.product_interactions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own interactions
CREATE POLICY "Users can view their own interactions"
  ON public.product_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create materialized view for product engagement metrics
CREATE MATERIALIZED VIEW public.product_engagement_metrics AS
SELECT 
  p.id as product_id,
  p.title as product_name,
  p.category,
  COUNT(DISTINCT pi.session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'hover') as hover_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'quick_view_click') as quick_view_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'wishlist_click') as wishlist_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'color_swatch_click') as color_swatch_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'design_click') as design_click_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'quote_click') as quote_click_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'view_details') as view_details_count,
  MAX(pi.timestamp) as last_interaction,
  COUNT(*) as total_interactions
FROM public.products p
LEFT JOIN public.product_interactions pi ON p.id = pi.product_id
WHERE pi.timestamp > NOW() - INTERVAL '30 days' OR pi.timestamp IS NULL
GROUP BY p.id, p.title, p.category;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_product_engagement_metrics_product_id ON public.product_engagement_metrics(product_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_product_engagement_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.product_engagement_metrics;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION refresh_product_engagement_metrics() TO service_role;

COMMENT ON TABLE public.product_interactions IS 'Tracks all user interactions with product cards for analytics';
COMMENT ON MATERIALIZED VIEW public.product_engagement_metrics IS 'Aggregated product engagement metrics for the last 30 days';
COMMENT ON FUNCTION refresh_product_engagement_metrics() IS 'Refreshes the product engagement metrics materialized view';