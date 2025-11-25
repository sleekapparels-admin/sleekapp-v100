-- ============================================================================
-- Fix Critical Rate Limit and Public INSERT Security Issues
-- ============================================================================

-- 1. Fix ai_quote_rate_limits table - restrict to service_role only
-- ============================================================================

DROP POLICY IF EXISTS "Edge functions can manage rate limits" ON public.ai_quote_rate_limits;
DROP POLICY IF EXISTS "Service role manages AI quote rate limits" ON public.ai_quote_rate_limits;
DROP POLICY IF EXISTS "Admins can view AI quote rate limits" ON public.ai_quote_rate_limits;

-- Only service_role (edge functions) can manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.ai_quote_rate_limits 
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- 2. Fix blog_comments - remove public INSERT, require edge function
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;

-- Only admins can view all comments (for moderation)
CREATE POLICY "Admins can manage comments" 
ON public.blog_comments 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments" 
ON public.blog_comments 
FOR SELECT
USING (approved = true);

-- Only service_role can insert comments (via edge function)
CREATE POLICY "Service role can insert comments" 
ON public.blog_comments 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');


-- 3. Fix social_shares - remove public INSERT, require edge function
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can create shares" ON public.social_shares;
DROP POLICY IF EXISTS "Anyone can view shares" ON public.social_shares;

-- Only admins can view share data for analytics
CREATE POLICY "Admins can view shares" 
ON public.social_shares 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only service_role can insert shares (via edge function)
CREATE POLICY "Service role can track shares" 
ON public.social_shares 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');


-- 4. Fix quote_requests - tighten INSERT policy
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Authenticated users can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view their own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;

-- Only service_role can insert quote requests (via edge function)
CREATE POLICY "Service role can insert quote requests" 
ON public.quote_requests 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Users can view their own quote requests
CREATE POLICY "Users can view their own quote requests" 
ON public.quote_requests 
FOR SELECT
USING ((auth.uid() = user_id) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Admins can view all quote requests
CREATE POLICY "Admins can view all quote requests" 
ON public.quote_requests 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update quote requests
CREATE POLICY "Admins can update quote requests" 
ON public.quote_requests 
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
