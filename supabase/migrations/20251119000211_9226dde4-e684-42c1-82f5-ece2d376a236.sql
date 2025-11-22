-- Revoke direct access to the materialized view from anon and authenticated
REVOKE ALL ON public.product_engagement_metrics FROM anon, authenticated;

-- Grant access only to service_role
GRANT SELECT ON public.product_engagement_metrics TO service_role;

-- Create a security definer function that wraps access
CREATE OR REPLACE FUNCTION public.get_product_engagement_metrics()
RETURNS SETOF public.product_engagement_metrics
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow admins to access this data
  SELECT *
  FROM public.product_engagement_metrics
  WHERE public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_product_engagement_metrics() TO authenticated;