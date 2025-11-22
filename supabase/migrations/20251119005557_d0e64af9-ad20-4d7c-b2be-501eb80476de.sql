-- CRITICAL SECURITY FIX: Remove public DELETE, UPDATE, INSERT, and SELECT policies on production_stages
-- This prevents attackers from deleting, modifying, or viewing production data without authentication

-- Drop the dangerous public DELETE policy
DROP POLICY IF EXISTS "production_stages_delete_policy" ON public.production_stages;

-- Drop the public UPDATE policy
DROP POLICY IF EXISTS "production_stages_update_policy" ON public.production_stages;

-- Drop the public INSERT policy
DROP POLICY IF EXISTS "production_stages_insert_policy" ON public.production_stages;

-- Drop the public SELECT policy
DROP POLICY IF EXISTS "production_stages_select_policy" ON public.production_stages;

-- Note: The following properly restrictive policies are KEPT and remain active:
-- - "Admins can manage all production stages" (authenticated role)
-- - "Suppliers manage production stages" (authenticated role)  
-- - "Order participants view production stages" (authenticated role)
-- - "Suppliers can view stages for their orders" (authenticated role)
-- - "Suppliers can update stages for their orders" (authenticated role)

-- These restrictive policies properly scope access to authenticated users with appropriate permissions