-- =====================================================
-- LOOPTRACE™ MARKETPLACE SYSTEM
-- Complete B2B Marketplace with Product Listings
-- =====================================================

-- =====================================================
-- 1. SUPPLIER CATEGORIES & SUBCATEGORIES
-- =====================================================

-- Add supplier type and subcategories to existing suppliers table
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS supplier_type TEXT DEFAULT 'manufacturer',
ADD COLUMN IF NOT EXISTS subcategories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS can_list_products BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS product_listing_tier TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS approval_rating DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_products_listed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_products INTEGER DEFAULT 0;

-- Create supplier subcategories enum
CREATE TYPE supplier_subcategory AS ENUM (
  'knit_manufacturer',
  'woven_manufacturer', 
  'denim_specialist',
  'activewear_sportswear',
  'uniforms_corporate',
  'textile_mill',
  'dyeing_mill',
  'yarn_supplier',
  'trim_accessories',
  'printing_services',
  'stock_lot_seller',
  'sample_collection',
  'wholesale_reseller',
  'retail_ready_products'
);

-- =====================================================
-- 2. MARKETPLACE PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Supplier Info
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Basic Info
  product_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  slug TEXT UNIQUE,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL, -- Supplier's price
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
  platform_fee_amount DECIMAL(10,2) GENERATED ALWAYS AS (base_price * platform_fee_percentage / 100) STORED,
  final_price DECIMAL(10,2) GENERATED ALWAYS AS (base_price + (base_price * platform_fee_percentage / 100)) STORED,
  
  -- Inventory
  available_quantity INTEGER NOT NULL DEFAULT 0,
  moq INTEGER NOT NULL DEFAULT 50,
  unit TEXT DEFAULT 'pieces',
  reserved_quantity INTEGER DEFAULT 0,
  
  -- Media
  images TEXT[] DEFAULT '{}',
  primary_image TEXT,
  video_url TEXT,
  
  -- Specifications
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  material TEXT,
  gsm INTEGER,
  fabric_composition TEXT,
  
  -- Additional Specs (JSONB for flexibility)
  specifications JSONB DEFAULT '{}',
  
  -- Logistics
  lead_time_days INTEGER DEFAULT 0,
  shipping_from TEXT,
  shipping_weight_kg DECIMAL(10,2),
  
  -- Status & Quality
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'sold_out', 'archived')),
  rejection_reason TEXT,
  admin_feedback TEXT,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  approval_date TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Engagement Metrics
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- SEO
  meta_keywords TEXT[] DEFAULT '{}',
  meta_description TEXT,
  
  -- Featured/Premium
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Indexes for performance
  CONSTRAINT positive_price CHECK (base_price > 0),
  CONSTRAINT positive_quantity CHECK (available_quantity >= 0)
);

-- Create indexes for fast queries
CREATE INDEX idx_marketplace_products_supplier ON marketplace_products(supplier_id);
CREATE INDEX idx_marketplace_products_status ON marketplace_products(status);
CREATE INDEX idx_marketplace_products_category ON marketplace_products(category);
CREATE INDEX idx_marketplace_products_approved ON marketplace_products(status, approval_date DESC) WHERE status = 'approved';
CREATE INDEX idx_marketplace_products_featured ON marketplace_products(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX idx_marketplace_products_price ON marketplace_products(final_price);
CREATE INDEX idx_marketplace_products_search ON marketplace_products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_marketplace_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_products_updated_at
  BEFORE UPDATE ON marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_product_timestamp();

-- =====================================================
-- 3. PRODUCT APPROVAL LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS product_approval_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'revision_requested', 'archived')),
  reason TEXT,
  feedback TEXT,
  previous_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_approval_log_product ON product_approval_log(product_id);
CREATE INDEX idx_product_approval_log_admin ON product_approval_log(admin_id);

-- =====================================================
-- 4. PRODUCT INQUIRIES
-- =====================================================

CREATE TABLE IF NOT EXISTS product_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  quantity INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'converted_to_order', 'declined', 'expired')),
  quoted_price DECIMAL(10,2),
  quote_notes TEXT,
  supplier_response TEXT,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_inquiries_product ON product_inquiries(product_id);
CREATE INDEX idx_product_inquiries_buyer ON product_inquiries(buyer_id);
CREATE INDEX idx_product_inquiries_status ON product_inquiries(status);

-- =====================================================
-- 5. PRODUCT ANALYTICS
-- =====================================================

CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  add_to_wishlist INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX idx_product_analytics_product ON product_analytics(product_id);
CREATE INDEX idx_product_analytics_date ON product_analytics(date);

-- =====================================================
-- 6. PRODUCT CATEGORIES REFERENCE
-- =====================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES product_categories(id),
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO product_categories (name, slug, description, display_order) VALUES
  ('Stock Lots', 'stock-lots', 'Ready-to-ship surplus inventory and canceled orders', 1),
  ('Sample Collections', 'sample-collections', 'Sample pieces and prototypes available for immediate purchase', 2),
  ('Textile & Fabrics', 'textile-fabrics', 'Fabric rolls, yarn, and textile materials', 3),
  ('Finished Garments', 'finished-garments', 'Ready-made apparel and clothing', 4),
  ('Trims & Accessories', 'trims-accessories', 'Buttons, zippers, labels, and garment accessories', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 7. PRODUCT WISHLIST
-- =====================================================

CREATE TABLE IF NOT EXISTS product_wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_product_wishlist_user ON product_wishlist(user_id);
CREATE INDEX idx_product_wishlist_product ON product_wishlist(product_id);

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_approval_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_wishlist ENABLE ROW LEVEL SECURITY;

-- Marketplace Products Policies
CREATE POLICY "Anyone can view approved products" ON marketplace_products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Suppliers can view their own products" ON marketplace_products
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can create products" ON marketplace_products
  FOR INSERT WITH CHECK (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid() AND can_list_products = true
    )
  );

CREATE POLICY "Suppliers can update their own products" ON marketplace_products
  FOR UPDATE USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all products" ON marketplace_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products" ON marketplace_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Product Inquiries Policies
CREATE POLICY "Buyers can create inquiries" ON product_inquiries
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can view their own inquiries" ON product_inquiries
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Suppliers can view inquiries for their products" ON product_inquiries
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM marketplace_products 
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Suppliers can respond to inquiries" ON product_inquiries
  FOR UPDATE USING (
    product_id IN (
      SELECT id FROM marketplace_products 
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

-- Wishlist Policies
CREATE POLICY "Users can manage their own wishlist" ON product_wishlist
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- 9. HELPER FUNCTIONS
-- =====================================================

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE marketplace_products 
  SET views = views + 1 
  WHERE id = product_uuid;
  
  -- Also update analytics
  INSERT INTO product_analytics (product_id, date, views, unique_viewers)
  VALUES (product_uuid, CURRENT_DATE, 1, 1)
  ON CONFLICT (product_id, date) 
  DO UPDATE SET views = product_analytics.views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update supplier product counts
CREATE OR REPLACE FUNCTION update_supplier_product_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE suppliers 
    SET total_products_listed = total_products_listed + 1,
        active_products = active_products + CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END
    WHERE id = NEW.supplier_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      UPDATE suppliers 
      SET active_products = active_products + 
        CASE 
          WHEN NEW.status = 'approved' AND OLD.status != 'approved' THEN 1
          WHEN NEW.status != 'approved' AND OLD.status = 'approved' THEN -1
          ELSE 0
        END
      WHERE id = NEW.supplier_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE suppliers 
    SET total_products_listed = total_products_listed - 1,
        active_products = active_products - CASE WHEN OLD.status = 'approved' THEN 1 ELSE 0 END
    WHERE id = OLD.supplier_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplier_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_product_counts();

-- Function to calculate supplier approval rating
CREATE OR REPLACE FUNCTION calculate_supplier_approval_rating(supplier_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_submitted INTEGER;
  total_approved INTEGER;
  rating DECIMAL;
BEGIN
  SELECT COUNT(*) INTO total_submitted
  FROM marketplace_products
  WHERE supplier_id = supplier_uuid 
  AND status IN ('approved', 'rejected');
  
  IF total_submitted = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO total_approved
  FROM marketplace_products
  WHERE supplier_id = supplier_uuid 
  AND status = 'approved';
  
  rating := (total_approved::DECIMAL / total_submitted::DECIMAL) * 100;
  
  UPDATE suppliers 
  SET approval_rating = rating 
  WHERE id = supplier_uuid;
  
  RETURN rating;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. SEARCH FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION search_marketplace_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  final_price DECIMAL,
  primary_image TEXT,
  supplier_name TEXT,
  available_quantity INTEGER,
  moq INTEGER,
  rating DECIMAL,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.id,
    mp.title,
    mp.description,
    mp.category,
    mp.final_price,
    mp.primary_image,
    s.company_name as supplier_name,
    mp.available_quantity,
    mp.moq,
    mp.rating,
    ts_rank(
      to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')),
      plainto_tsquery('english', search_query)
    ) as relevance
  FROM marketplace_products mp
  JOIN suppliers s ON mp.supplier_id = s.id
  WHERE mp.status = 'approved'
    AND (search_query IS NULL OR 
         to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')) @@ plainto_tsquery('english', search_query))
    AND (category_filter IS NULL OR mp.category = category_filter)
    AND (min_price IS NULL OR mp.final_price >= min_price)
    AND (max_price IS NULL OR mp.final_price <= max_price)
  ORDER BY relevance DESC, mp.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. NOTIFICATION TRIGGERS
-- =====================================================

-- Notify supplier when product is approved/rejected
CREATE OR REPLACE FUNCTION notify_supplier_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO notifications (user_id, title, message, type, link, data)
    SELECT 
      s.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Product Approved! 🎉'
        ELSE 'Product Needs Revision'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your product "' || NEW.title || '" is now live on the marketplace!'
        ELSE 'Your product "' || NEW.title || '" needs some changes. ' || COALESCE(NEW.rejection_reason, 'Please review admin feedback.')
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'warning'
      END,
      '/supplier-dashboard?tab=products&product=' || NEW.id,
      jsonb_build_object(
        'product_id', NEW.id,
        'product_title', NEW.title,
        'status', NEW.status,
        'feedback', NEW.admin_feedback
      )
    FROM suppliers s
    WHERE s.id = NEW.supplier_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_product_status_change
  AFTER UPDATE ON marketplace_products
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_supplier_product_status();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON marketplace_products TO authenticated;
GRANT SELECT ON product_categories TO authenticated;
GRANT ALL ON product_inquiries TO authenticated;
GRANT ALL ON product_wishlist TO authenticated;

-- Grant to service role for admin operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
