-- Fix search_path for update_marketplace_products_updated_at function
CREATE OR REPLACE FUNCTION update_marketplace_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;