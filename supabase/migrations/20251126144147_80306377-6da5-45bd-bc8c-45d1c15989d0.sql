-- ============================================================================
-- COMPREHENSIVE SECURITY FIX: Address All 11 Vulnerabilities
-- Date: 2025-11-26 (Corrected)
-- ============================================================================

-- ============================================================================
-- CRITICAL ISSUE 1: Customer Contact Information Could Be Stolen (profiles)
-- ============================================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users view own profile or admins view all"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- CRITICAL ISSUE 2: Quote Data With Customer Details Accessible Via Session (ai_quotes)
-- ============================================================================

DROP POLICY IF EXISTS "Users can view quotes via session_id within 5 minutes" ON public.ai_quotes;
DROP POLICY IF EXISTS "Users view quotes via session" ON public.ai_quotes;

CREATE POLICY "Users view own quotes or recent session (2 min)"
ON public.ai_quotes
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    session_id IS NOT NULL 
    AND created_at > (now() - interval '2 minutes')
  )
);

-- ============================================================================
-- CRITICAL ISSUE 3: Customer Email Exposed in Conversation Data (conversation_context)
-- ============================================================================

DROP POLICY IF EXISTS "Users can access conversations via session_id within 15 minutes" ON public.conversation_context;
DROP POLICY IF EXISTS "Users view conversations via session" ON public.conversation_context;

CREATE POLICY "Users view own conversations or recent session (5 min)"
ON public.conversation_context
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    session_id IS NOT NULL
    AND created_at > (now() - interval '5 minutes')
  )
);

-- ============================================================================
-- CRITICAL ISSUE 4: Quote Request Email Enumeration Attack (quote_requests)
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own quote requests via email" ON public.quote_requests;
DROP POLICY IF EXISTS "Users view requests by email" ON public.quote_requests;

CREATE POLICY "Users view own quote requests via user_id"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================================
-- CRITICAL ISSUE 5: Customer Contact Details in Quotes Table (quotes)
-- FIX: Use buyer_id not user_id
-- ============================================================================

DROP POLICY IF EXISTS "Users can access quotes via session_id" ON public.quotes;
DROP POLICY IF EXISTS "Users view quotes via session" ON public.quotes;

CREATE POLICY "Users view own quotes only"
ON public.quotes
FOR SELECT
USING (
  auth.uid() = buyer_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================================
-- HIGH PRIORITY ISSUE 6: Audit Logs Could Be Tampered With (admin_audit_logs)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Allow INSERT with true condition" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Users can insert audit logs" ON public.admin_audit_logs;

CREATE POLICY "Only service_role inserts audit logs"
ON public.admin_audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Admins view audit logs"
ON public.admin_audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================================
-- HIGH PRIORITY ISSUE 7: Sample Request Form Spam (exit_intent_sample_requests)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit sample requests" ON public.exit_intent_sample_requests;
DROP POLICY IF EXISTS "Unrestricted INSERT on sample requests" ON public.exit_intent_sample_requests;
DROP POLICY IF EXISTS "Public can insert sample requests" ON public.exit_intent_sample_requests;

CREATE POLICY "Service role manages sample requests"
ON public.exit_intent_sample_requests
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Admins view sample requests"
ON public.exit_intent_sample_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================================
-- HIGH PRIORITY ISSUE 8: Product Analytics Manipulation (product_interactions)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert product interactions" ON public.product_interactions;
DROP POLICY IF EXISTS "Public can track interactions" ON public.product_interactions;

CREATE POLICY "Service role manages product interactions"
ON public.product_interactions
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Admins view product interactions"
ON public.product_interactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================================
-- HIGH PRIORITY ISSUE 9: Supplier Contact Info Harvesting (suppliers)
-- ============================================================================

DROP POLICY IF EXISTS "Public can view verified suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can view suppliers" ON public.suppliers;

CREATE POLICY "Authenticated users view verified suppliers"
ON public.suppliers
FOR SELECT
TO authenticated
USING (
  verification_status = 'verified'
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================================
-- INFO ISSUE 10: Blog Comments User Access (blog_comments)
-- ============================================================================

CREATE POLICY "Authenticated users create comments"
ON public.blog_comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view approved comments or own"
ON public.blog_comments
FOR SELECT
USING (
  approved = true
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================================
-- INFO ISSUE 11: Social Share Count Manipulation (social_shares)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can track shares" ON public.social_shares;
DROP POLICY IF EXISTS "Public can insert shares" ON public.social_shares;

CREATE POLICY "Service role manages social shares"
ON public.social_shares
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Anyone views share counts"
ON public.social_shares
FOR SELECT
USING (true);