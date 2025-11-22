-- Fix Critical Security Issue: production_stages overly permissive RLS policies
-- Remove existing public access policies that allow anyone to view/modify/delete production data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS production_stages_select_policy ON public.production_stages;
DROP POLICY IF EXISTS production_stages_update_policy ON public.production_stages;
DROP POLICY IF EXISTS production_stages_delete_policy ON public.production_stages;
DROP POLICY IF EXISTS "Allow public read access to production_stages" ON public.production_stages;
DROP POLICY IF EXISTS "Allow public insert access to production_stages" ON public.production_stages;

-- Buyers can view production stages for their own orders
CREATE POLICY "Buyers can view stages for their orders"
  ON public.production_stages FOR SELECT
  USING (
    supplier_order_id IN (
      SELECT so.id FROM supplier_orders so
      WHERE so.buyer_order_id IN (
        SELECT id FROM orders WHERE buyer_id = auth.uid()
      )
    )
  );

-- Suppliers can view and update stages for orders assigned to them
CREATE POLICY "Suppliers can view their assigned order stages"
  ON public.production_stages FOR SELECT
  USING (
    supplier_order_id IN (
      SELECT id FROM supplier_orders
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Suppliers can update their assigned order stages"
  ON public.production_stages FOR UPDATE
  USING (
    supplier_order_id IN (
      SELECT id FROM supplier_orders
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

-- Admins have full access to all production stages
CREATE POLICY "Admins can view all production stages"
  ON public.production_stages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all production stages"
  ON public.production_stages FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete production stages"
  ON public.production_stages FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access to production stages"
  ON public.production_stages FOR ALL
  USING (auth.role() = 'service_role');