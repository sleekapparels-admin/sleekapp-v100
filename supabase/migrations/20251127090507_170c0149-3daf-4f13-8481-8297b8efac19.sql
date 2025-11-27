-- Security Fix 1: Remove overly permissive shipping_info policy
DROP POLICY IF EXISTS "Authenticated users can manage shipping info" ON public.shipping_info;

-- Security Fix 2: Restrict supplier_ratings to authenticated users only
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.supplier_ratings;
CREATE POLICY "Authenticated users can view ratings"
ON public.supplier_ratings FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Security Fix 3: Fix social_shares INSERT to service_role only
DROP POLICY IF EXISTS "Service role manages social shares" ON public.social_shares;
CREATE POLICY "Service role can insert social shares"
ON public.social_shares FOR INSERT
WITH CHECK (auth.role() = 'service_role'::text);

-- Security Fix 4: Fix exit_intent_sample_requests INSERT to service_role only
DROP POLICY IF EXISTS "Edge functions can insert sample requests" ON public.exit_intent_sample_requests;
DROP POLICY IF EXISTS "Service role manages sample requests" ON public.exit_intent_sample_requests;
CREATE POLICY "Service role inserts sample requests"
ON public.exit_intent_sample_requests FOR INSERT
WITH CHECK (auth.role() = 'service_role'::text);

-- Security Fix 5: Fix product_interactions INSERT to service_role only
DROP POLICY IF EXISTS "Service role manages product interactions" ON public.product_interactions;
CREATE POLICY "Service role inserts product interactions"
ON public.product_interactions FOR INSERT
WITH CHECK (auth.role() = 'service_role'::text);