-- Create marketplace_products table for ready-stock supplier inventory
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  base_price NUMERIC NOT NULL,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  moq INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'pieces',
  sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
  colors TEXT[] DEFAULT ARRAY[]::TEXT[],
  material TEXT,
  gsm INTEGER,
  fabric_composition TEXT,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  shipping_from TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  quality_score INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view approved marketplace products"
ON public.marketplace_products
FOR SELECT
USING (status = 'approved');

CREATE POLICY "Suppliers can manage their own products"
ON public.marketplace_products
FOR ALL
USING (
  supplier_id IN (
    SELECT id FROM suppliers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all marketplace products"
ON public.marketplace_products
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_marketplace_products_supplier ON public.marketplace_products(supplier_id);
CREATE INDEX idx_marketplace_products_status ON public.marketplace_products(status);
CREATE INDEX idx_marketplace_products_category ON public.marketplace_products(category);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_marketplace_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_products_updated_at
BEFORE UPDATE ON public.marketplace_products
FOR EACH ROW
EXECUTE FUNCTION update_marketplace_products_updated_at();