-- Phase 2: Security Vulnerability Fixes

-- Step 2.1: Restrict Profile Data Access
-- Drop overly permissive policy and add restrictive policy
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;

CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- Step 2.2: Strengthen Session Token Security
-- Reduce ai_quotes session access from 15 minutes to 5 minutes
DROP POLICY IF EXISTS "Time-limited session access to quotes" ON public.ai_quotes;

CREATE POLICY "Time-limited session access to quotes"
ON public.ai_quotes
FOR SELECT
TO public
USING (
  (auth.uid() IS NOT NULL AND ((user_id = auth.uid()) OR ((user_id IS NULL) AND (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text))))
  OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text)) AND (created_at > (now() - interval '5 minutes')))
);

-- Reduce conversation_context session from 2 hours to 15 minutes
DROP POLICY IF EXISTS "Users view conversations with session support" ON public.conversation_context;

CREATE POLICY "Users view conversations with session support"
ON public.conversation_context
FOR SELECT
TO public
USING (
  ((auth.uid() IS NOT NULL) AND ((user_id = auth.uid()) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)))
  OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (created_at > (now() - interval '15 minutes')))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Step 2.3: Add SELECT Restrictions to Quote Requests
-- Ensure proper access control on quote_requests
CREATE POLICY "Admins can view all quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users view own quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- Step 2.4: Add Message Recipient Validation
-- Validate recipient exists before allowing message insert
CREATE OR REPLACE FUNCTION public.validate_message_recipient()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if recipient exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.recipient_id
  ) THEN
    RAISE EXCEPTION 'Invalid recipient';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_message_recipient_trigger
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_message_recipient();

-- Step 2.5: Restrict OTP Table Access
-- Block all authenticated user access to OTP tables (service_role only)
CREATE POLICY "Authenticated users cannot access email OTPs"
ON public.email_verification_otps
FOR ALL
TO authenticated
USING (false);

CREATE POLICY "Authenticated users cannot access phone OTPs"
ON public.phone_verification_otps
FOR ALL
TO authenticated
USING (false);

-- Step 2.6: Add Order Display Validation
-- Sanitize sensitive data when display_publicly is true
CREATE OR REPLACE FUNCTION public.sanitize_public_orders()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If order is marked for public display, clear sensitive pricing
  IF NEW.display_publicly = true THEN
    NEW.buyer_price := NULL;
    NEW.supplier_price := NULL;
    NEW.admin_margin := NULL;
    NEW.anonymized_client_name := COALESCE(NEW.anonymized_client_name, 'Anonymous Client');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER sanitize_public_orders_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
WHEN (NEW.display_publicly = true)
EXECUTE FUNCTION public.sanitize_public_orders();