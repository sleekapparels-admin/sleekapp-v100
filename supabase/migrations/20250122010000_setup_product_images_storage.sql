-- =================================================================
-- SUPABASE STORAGE SETUP FOR MARKETPLACE PRODUCT IMAGES
-- =================================================================
-- This migration creates storage buckets and policies for product images
-- Version: 1.0.0
-- Date: 2025-01-22

-- =================================================================
-- 1. CREATE STORAGE BUCKETS
-- =================================================================

-- Create product-images bucket for marketplace product photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true, -- Public bucket for product images
  5242880, -- 5MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 2. STORAGE POLICIES FOR PRODUCT IMAGES
-- =================================================================

-- Policy: Anyone can view product images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Authenticated suppliers can upload product images
CREATE POLICY "Suppliers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers
    WHERE user_id = auth.uid()
  )
);

-- Policy: Suppliers can update their own product images
CREATE POLICY "Suppliers can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers s
    INNER JOIN marketplace_products p ON p.supplier_id = s.id
    WHERE s.user_id = auth.uid()
    AND storage.objects.name LIKE p.id || '/%'
  )
);

-- Policy: Suppliers can delete their own product images
CREATE POLICY "Suppliers can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers s
    INNER JOIN marketplace_products p ON p.supplier_id = s.id
    WHERE s.user_id = auth.uid()
    AND storage.objects.name LIKE p.id || '/%'
  )
);

-- Policy: Admins can manage all product images
CREATE POLICY "Admins can manage all product images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- =================================================================
-- 3. HELPER FUNCTIONS FOR IMAGE MANAGEMENT
-- =================================================================

-- Function to get product image URLs
CREATE OR REPLACE FUNCTION get_product_image_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_project_ref', true) || 
         '.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$;

-- Function to validate image file size and type
CREATE OR REPLACE FUNCTION validate_product_image(
  file_size BIGINT,
  mime_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check file size (max 5MB)
  IF file_size > 5242880 THEN
    RAISE EXCEPTION 'File size exceeds 5MB limit';
  END IF;
  
  -- Check mime type
  IF mime_type NOT IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif') THEN
    RAISE EXCEPTION 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- =================================================================
-- 4. TRIGGER TO AUTO-DELETE IMAGES WHEN PRODUCT DELETED
-- =================================================================

-- Function to clean up product images when product is deleted
CREATE OR REPLACE FUNCTION cleanup_product_images()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  image_url TEXT;
  file_path TEXT;
BEGIN
  -- Loop through all images and delete from storage
  FOREACH image_url IN ARRAY OLD.images
  LOOP
    -- Extract file path from URL
    file_path := regexp_replace(image_url, '^.*/product-images/', '');
    
    -- Delete from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'product-images'
    AND name = file_path;
  END LOOP;
  
  RETURN OLD;
END;
$$;

-- Trigger to clean up images when product is deleted
DROP TRIGGER IF EXISTS trigger_cleanup_product_images ON marketplace_products;
CREATE TRIGGER trigger_cleanup_product_images
AFTER DELETE ON marketplace_products
FOR EACH ROW
EXECUTE FUNCTION cleanup_product_images();

-- =================================================================
-- NOTES
-- =================================================================
-- 1. Product images are stored in format: {product_id}/{timestamp}_{filename}
-- 2. Maximum 10 images per product (enforced in application)
-- 3. Recommended image dimensions: 1200x1200px minimum
-- 4. Images are automatically cleaned up when product is deleted
-- 5. Public bucket allows direct CDN access to images
