-- Strengthen B2B data access policies - Ensure buyers can only see their own data

-- =============================================================================
-- ORDERS TABLE - Add missing INSERT policy for buyers
-- =============================================================================

-- Allow buyers to create their own orders
CREATE POLICY "Buyers can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- =============================================================================
-- AI_QUOTES TABLE - Add user_id column for better security
-- =============================================================================

-- Add user_id column to ai_quotes if not exists (for better security than email matching)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ai_quotes' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.ai_quotes 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Drop old email-based policies and create user_id-based policies
DROP POLICY IF EXISTS "Authenticated users can view their quotes" ON public.ai_quotes;
DROP POLICY IF EXISTS "Authenticated users can update their quotes" ON public.ai_quotes;

-- New secure policy: Users can only view quotes they created
CREATE POLICY "Users can view their own quotes"
ON public.ai_quotes
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  -- Fallback for legacy quotes without user_id (match by email)
  (user_id IS NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
);

-- New secure policy: Users can only update quotes they created
CREATE POLICY "Users can update their own quotes"
ON public.ai_quotes
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR
  -- Fallback for legacy quotes without user_id (match by email)
  (user_id IS NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
);

-- Allow authenticated users to create quotes (user_id will be set by edge function or client)
DROP POLICY IF EXISTS "Authenticated users can create quotes" ON public.ai_quotes;
CREATE POLICY "Authenticated users can create quotes"
ON public.ai_quotes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR user_id IS NULL)
);

-- =============================================================================
-- ORDER_DOCUMENTS TABLE - Ensure strict access control
-- =============================================================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Users can view documents for their orders" ON public.order_documents;

-- Only order participants can view documents (buyers and suppliers)
CREATE POLICY "Order participants can view documents"
ON public.order_documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_documents.order_id
    AND (orders.buyer_id = auth.uid() OR orders.supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    ))
  )
);

-- =============================================================================
-- INVOICES TABLE - Add DELETE protection
-- =============================================================================

-- Prevent anyone from deleting invoices (only service role should be able to)
CREATE POLICY "No one can delete invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (false);

-- =============================================================================
-- ORDERS TABLE - Add DELETE protection
-- =============================================================================

-- Prevent buyers from deleting orders (only admins should be able to)
CREATE POLICY "Only admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================================================
-- PAYMENT_HISTORY TABLE - Add DELETE protection
-- =============================================================================

-- Prevent anyone from deleting payment records (immutable audit trail)
CREATE POLICY "No one can delete payment records"
ON public.payment_history
FOR DELETE
TO authenticated
USING (false);

COMMENT ON POLICY "Buyers can create their own orders" ON public.orders IS 'Allows buyers to create orders but only if they set themselves as the buyer';
COMMENT ON POLICY "Users can view their own quotes" ON public.ai_quotes IS 'Users can only see quotes they created (by user_id or fallback to email for legacy data)';
COMMENT ON POLICY "Order participants can view documents" ON public.order_documents IS 'Only buyers and suppliers involved in an order can view its documents';
COMMENT ON POLICY "No one can delete invoices" ON public.invoices IS 'Invoices are immutable financial records - cannot be deleted by users';
COMMENT ON POLICY "Only admins can delete orders" ON public.orders IS 'Only admins can delete orders to prevent accidental data loss';
COMMENT ON POLICY "No one can delete payment records" ON public.payment_history IS 'Payment history is an immutable audit trail';