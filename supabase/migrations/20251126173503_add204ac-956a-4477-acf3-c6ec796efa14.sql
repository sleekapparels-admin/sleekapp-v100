-- Fix SECURITY DEFINER view issue
-- The suppliers_public view must use security_invoker to respect RLS policies

DROP VIEW IF EXISTS public.suppliers_public;

CREATE VIEW public.suppliers_public
WITH (security_invoker=on)
AS
SELECT 
  id,
  company_name,
  factory_location,
  address,
  specializations,
  lead_time_days,
  website_url,
  created_at,
  updated_at,
  verification_status,
  tier,
  about,
  moq_minimum,
  moq_maximum
  -- Explicitly exclude sensitive fields:
  -- contact_email, contact_phone, contact_person,
  -- performance_score, total_orders_completed, on_time_delivery_rate,
  -- total_capacity_monthly, avg_capacity_utilization, user_id, business_registration_number
FROM public.suppliers
WHERE verification_status = 'verified';

-- Grant public access to the view
GRANT SELECT ON public.suppliers_public TO anon;
GRANT SELECT ON public.suppliers_public TO authenticated;

COMMENT ON VIEW public.suppliers_public IS 
'Public view of suppliers with sensitive contact info and performance metrics excluded. Uses security_invoker to respect RLS policies.';