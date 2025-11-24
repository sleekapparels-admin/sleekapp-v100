-- Create market research cache table for 24h caching
CREATE TABLE IF NOT EXISTS public.market_research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_category TEXT NOT NULL,
  quantity_range TEXT NOT NULL,
  research_data JSONB NOT NULL DEFAULT '{}',
  sources TEXT[] DEFAULT ARRAY[]::TEXT[],
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_market_research_category ON public.market_research_cache(product_category, quantity_range);
CREATE INDEX idx_market_research_expires ON public.market_research_cache(expires_at);

-- Enable RLS
ALTER TABLE public.market_research_cache ENABLE ROW LEVEL SECURITY;

-- Service role can manage cache
CREATE POLICY "Service role can manage research cache"
  ON public.market_research_cache
  FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can view cache
CREATE POLICY "Admins can view research cache"
  ON public.market_research_cache
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Update ai_quotes table with new MVP fields
ALTER TABLE public.ai_quotes
  ADD COLUMN IF NOT EXISTS market_research_id UUID REFERENCES public.market_research_cache(id),
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  ADD COLUMN IF NOT EXISTS research_sources JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS price_justification TEXT,
  ADD COLUMN IF NOT EXISTS comparable_products JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS conversation_history JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS refinement_count INTEGER DEFAULT 0;

-- Add index for market_research_id
CREATE INDEX IF NOT EXISTS idx_ai_quotes_market_research ON public.ai_quotes(market_research_id);