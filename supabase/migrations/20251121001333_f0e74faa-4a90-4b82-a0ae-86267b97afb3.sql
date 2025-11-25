-- Fix overly permissive RLS policies identified in security audit

-- Fix payment_history table
DROP POLICY IF EXISTS "System can create payments" ON public.payment_history;

CREATE POLICY "Service role can create payments" ON public.payment_history
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Fix admin_actions table  
DROP POLICY IF EXISTS "System can log admin actions" ON public.admin_actions;

CREATE POLICY "Service role can log actions" ON public.admin_actions
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');