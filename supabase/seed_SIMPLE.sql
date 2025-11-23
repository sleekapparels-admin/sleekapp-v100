-- ========================================
-- SIMPLE SEED - Matches Your Actual Schema
-- ========================================
-- Only the 3 users you created
-- Simplified to match actual table structure
-- ========================================

-- Clean slate (without supplier_id reference)
DELETE FROM public.orders WHERE buyer_id IN (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
);

DELETE FROM public.user_roles WHERE user_id IN (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
);

DELETE FROM public.profiles WHERE id IN (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
);

-- ========================================
-- INSERT 3 PROFILES
-- ========================================

-- Sarah Johnson (Buyer)
INSERT INTO public.profiles (id, full_name, company_name, phone, updated_at)
VALUES (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  'Sarah Johnson',
  'Urban Fashion Co',
  '+1-555-0101',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'retailer');

-- Ahmed Hassan (Supplier)
INSERT INTO public.profiles (id, full_name, company_name, phone, updated_at)
VALUES (
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Ahmed Hassan',
  'Dhaka Knitwear Ltd',
  '+880-1711-000101',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('7d52fff8-1992-4994-9817-296e7da7e27b'::uuid, 'supplier');

-- Admin User
INSERT INTO public.profiles (id, full_name, company_name, phone, updated_at)
VALUES (
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid,
  'Admin User',
  'Sleek Apparels Platform',
  '+1-555-ADMIN',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid, 'admin');

-- ========================================
-- ADD A SAMPLE PRODUCT (matches actual schema)
-- ========================================

INSERT INTO public.products (
  id, title, category, description, image_url, 
  featured, created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  'Premium Cotton T-Shirt',
  'T-Shirts',
  'High-quality 100% combed cotton crew neck t-shirt. Perfect for brands and promotional items.',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  true,
  NOW(),
  NOW()
);

-- ========================================
-- DONE! Simple seed complete
-- ========================================
-- 3 profiles
-- 3 user roles  
-- 1 sample product
-- ========================================
