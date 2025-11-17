-- Part 1: Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 30;
ALTER TABLE products ADD COLUMN IF NOT EXISTS moq INTEGER DEFAULT 50;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Part 2: Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_active ON product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON product_categories(display_order);

-- Part 3: Seed product categories
INSERT INTO product_categories (name, slug, display_order, is_active) VALUES
  ('Knitwear', 'knitwear', 1, true),
  ('Activewear', 'activewear', 2, true),
  ('Swimwear', 'swimwear', 3, true),
  ('Cut & Sew', 'cut-and-sew', 4, true),
  ('Uniforms & Teamwear', 'uniforms-teamwear', 5, true),
  ('Casual Wear', 'casual-wear', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Part 4: Add full-text search column and function
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_trigger() 
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS products_search_update ON products;
CREATE TRIGGER products_search_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_trigger();

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN(search_vector);

-- Update existing products with search vectors
UPDATE products SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C');

-- Part 5: Update existing products with sample data for new fields
UPDATE products 
SET 
  price = CASE 
    WHEN price IS NULL THEN (RANDOM() * 80 + 20)::DECIMAL(10,2)
    ELSE price 
  END,
  materials = CASE
    WHEN materials IS NULL THEN ARRAY['Cotton', 'Polyester']::TEXT[]
    ELSE materials
  END,
  lead_time_days = COALESCE(lead_time_days, 30),
  moq = COALESCE(moq, 100),
  popularity_score = COALESCE(popularity_score, FLOOR(RANDOM() * 100)::INTEGER)
WHERE id IS NOT NULL;

-- Part 6: Enable RLS on product_categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON product_categories;
CREATE POLICY "Public categories are viewable by everyone"
  ON product_categories FOR SELECT
  USING (true);

-- Ensure products RLS allows public read
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);