-- ========================================
-- ULTRA MINIMAL SEED - ABSOLUTELY ONLY YOUR 3 USERS
-- ========================================
-- This is the SIMPLEST possible seed with just the essentials
-- GUARANTEED to work!
-- ========================================

-- First, let's make sure we're starting fresh
-- Delete any existing sample data from previous attempts
DELETE FROM public.orders WHERE buyer_id IN (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
);

DELETE FROM public.supplier_certifications WHERE supplier_id = '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid;

DELETE FROM public.products WHERE supplier_id = '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid;

DELETE FROM public.suppliers WHERE id = '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid;

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
-- NOW INSERT FRESH DATA
-- ========================================

-- Profile 1: Sarah Johnson (Buyer)
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  'Sarah Johnson',
  'sarah.johnson@test.sleekapp.com',
  'Urban Fashion Co',
  '+1-555-0101',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'retailer');

-- Profile 2: Ahmed Hassan (Supplier)
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES (
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Ahmed Hassan',
  'ahmed.hassan@test.sleekapp.com',
  'Dhaka Knitwear Ltd',
  '+880-1711-000101',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('7d52fff8-1992-4994-9817-296e7da7e27b'::uuid, 'supplier');

-- Profile 3: Admin User
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES (
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid,
  'Admin User',
  'admin@test.sleekapp.com',
  'Sleek Apparels Platform',
  '+1-555-ADMIN',
  NOW()
);

INSERT INTO public.user_roles (user_id, role)
VALUES ('441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid, 'admin');

-- Ahmed's Supplier Profile
INSERT INTO public.suppliers (
  id, user_id, company_name, country, city, phone, email,
  verification_status, performance_score, tier, is_featured,
  created_at, updated_at
)
VALUES (
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Dhaka Knitwear Ltd',
  'Bangladesh',
  'Dhaka',
  '+880-1711-000101',
  'ahmed.hassan@test.sleekapp.com',
  'verified'::verification_status,
  92.5,
  'gold'::supplier_tier,
  true,
  NOW(),
  NOW()
);

-- Ahmed's Product 1: Premium T-Shirt
INSERT INTO public.products (
  id, supplier_id, name, description, category,
  base_price, currency, minimum_order_quantity,
  is_active, created_at, updated_at
)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Premium Cotton T-Shirt',
  'High-quality 100% combed cotton crew neck t-shirt',
  'T-Shirts',
  8.00,
  'USD',
  500,
  true,
  NOW(),
  NOW()
);

-- Sample Order: Sarah → Ahmed
INSERT INTO public.orders (
  id, buyer_id, supplier_id, product_id,
  quantity, unit_price, total_amount,
  status, order_date, expected_delivery_date
)
VALUES (
  '50000000-0000-0000-0000-000000000001'::uuid,
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '10000000-0000-0000-0000-000000000001'::uuid,
  1000,
  8.00,
  8000.00,
  'bulk_production'::order_workflow_status,
  NOW() - INTERVAL '20 days',
  NOW() + INTERVAL '10 days'
);

-- ========================================
-- DONE! Ultra minimal seed complete
-- ========================================
-- 3 profiles
-- 3 user roles
-- 1 supplier
-- 1 product
-- 1 order
-- ========================================
