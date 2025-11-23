-- ========================================
-- SLEEK APPARELS SAMPLE DATA SEED
-- ========================================
-- This file populates the database with sample/test data
-- All test accounts use @test.sleekapp.com domain
-- Safe to run in development - includes RLS-compatible data
-- ========================================

-- NOTE: This seed file is meant to be run AFTER users are created via Supabase Auth
-- You'll need to create test users in Supabase dashboard first, then note their UUIDs
-- Replace the UUIDs below with your actual test user IDs

-- ========================================
-- SECTION 1: USER PROFILES & ROLES
-- ========================================

-- Sample Buyer Profiles (5 buyers)
-- IMPORTANT: Create these users in Supabase Auth first, then update UUIDs below

-- Buyer 1: Fashion Brand Owner
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Sarah Johnson', 'sarah.johnson@test.sleekapp.com', 'Urban Fashion Co', '+1-555-0101', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'retailer')
ON CONFLICT (user_id, role) DO NOTHING;

-- Buyer 2: School Administrator
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Michael Chen', 'michael.chen@test.sleekapp.com', 'Green Valley High School', '+1-555-0102', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000002'::uuid, 'educational')
ON CONFLICT (user_id, role) DO NOTHING;

-- Buyer 3: Corporate Buyer
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Emily Rodriguez', 'emily.rodriguez@test.sleekapp.com', 'TechCorp Inc', '+1-555-0103', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000003'::uuid, 'corporate')
ON CONFLICT (user_id, role) DO NOTHING;

-- Buyer 4: Sports Team Manager
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000004'::uuid, 'James Williams', 'james.williams@test.sleekapp.com', 'City United FC', '+1-555-0104', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000004'::uuid, 'sports_team')
ON CONFLICT (user_id, role) DO NOTHING;

-- Buyer 5: Wholesaler
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000005'::uuid, 'Lisa Anderson', 'lisa.anderson@test.sleekapp.com', 'Wholesale Apparel Distributors', '+1-555-0105', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000005'::uuid, 'wholesaler')
ON CONFLICT (user_id, role) DO NOTHING;

-- Sample Supplier Profiles (5 suppliers)

-- Supplier 1: Knitwear Manufacturer
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000101'::uuid, 'Ahmed Hassan', 'ahmed.hassan@test.sleekapp.com', 'Dhaka Knitwear Ltd', '+880-1711-000101', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000101'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.suppliers (
  id, user_id, company_name, business_type, country, city, address,
  production_capacity_monthly, minimum_order_quantity, lead_time_days,
  specializations, verification_status, tier, rating, total_orders, on_time_delivery_rate
)
VALUES (
  '00000000-0000-0000-0000-000000000101'::uuid,
  '00000000-0000-0000-0000-000000000101'::uuid,
  'Dhaka Knitwear Ltd',
  'Garment Manufacturer',
  'Bangladesh',
  'Dhaka',
  'Plot 45, Tejgaon Industrial Area, Dhaka-1208',
  50000,
  500,
  30,
  ARRAY['T-Shirts', 'Polo Shirts', 'Hoodies', 'Sweatshirts'],
  'verified'::verification_status,
  'gold'::supplier_tier,
  4.8,
  156,
  95.5
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status;

-- Supplier 2: Activewear Specialist
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000102'::uuid, 'Fatima Rahman', 'fatima.rahman@test.sleekapp.com', 'Active Sports Textiles', '+880-1711-000102', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000102'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.suppliers (
  id, user_id, company_name, business_type, country, city, address,
  production_capacity_monthly, minimum_order_quantity, lead_time_days,
  specializations, verification_status, tier, rating, total_orders, on_time_delivery_rate
)
VALUES (
  '00000000-0000-0000-0000-000000000102'::uuid,
  '00000000-0000-0000-0000-000000000102'::uuid,
  'Active Sports Textiles',
  'Garment Manufacturer',
  'Bangladesh',
  'Gazipur',
  'Kashimpur, Gazipur-1346',
  35000,
  300,
  25,
  ARRAY['Sports Jerseys', 'Track Pants', 'Athletic Tops', 'Performance Wear'],
  'verified'::verification_status,
  'gold'::supplier_tier,
  4.7,
  98,
  93.2
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status;

-- Supplier 3: Uniform Manufacturer
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000103'::uuid, 'Karim Textile', 'karim.textile@test.sleekapp.com', 'Bengal Uniforms Manufacturing', '+880-1711-000103', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000103'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.suppliers (
  id, user_id, company_name, business_type, country, city, address,
  production_capacity_monthly, minimum_order_quantity, lead_time_days,
  specializations, verification_status, tier, rating, total_orders, on_time_delivery_rate
)
VALUES (
  '00000000-0000-0000-0000-000000000103'::uuid,
  '00000000-0000-0000-0000-000000000103'::uuid,
  'Bengal Uniforms Manufacturing',
  'Garment Manufacturer',
  'Bangladesh',
  'Dhaka',
  'Ashulia, Savar, Dhaka-1340',
  25000,
  800,
  35,
  ARRAY['School Uniforms', 'Corporate Uniforms', 'Industrial Workwear', 'Hospital Scrubs'],
  'verified'::verification_status,
  'silver'::supplier_tier,
  4.6,
  67,
  91.8
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status;

-- Supplier 4: Fabric Supplier
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000104'::uuid, 'Nazma Begum', 'nazma.begum@test.sleekapp.com', 'Premium Fabric Mills', '+880-1711-000104', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000104'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.suppliers (
  id, user_id, company_name, business_type, country, city, address,
  production_capacity_monthly, minimum_order_quantity, lead_time_days,
  specializations, verification_status, tier, rating, total_orders, on_time_delivery_rate
)
VALUES (
  '00000000-0000-0000-0000-000000000104'::uuid,
  '00000000-0000-0000-0000-000000000104'::uuid,
  'Premium Fabric Mills',
  'Fabric Supplier',
  'Bangladesh',
  'Narayanganj',
  'Rupganj, Narayanganj-1460',
  100000,
  5000,
  15,
  ARRAY['Cotton Fabric', 'Polyester Blend', 'Jersey Knit', 'French Terry'],
  'verified'::verification_status,
  'gold'::supplier_tier,
  4.9,
  234,
  97.1
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status;

-- Supplier 5: Trims & Accessories
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000105'::uuid, 'Rashid Ahmed', 'rashid.ahmed@test.sleekapp.com', 'Dhaka Trims & Accessories', '+880-1711-000105', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000105'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.suppliers (
  id, user_id, company_name, business_type, country, city, address,
  production_capacity_monthly, minimum_order_quantity, lead_time_days,
  specializations, verification_status, tier, rating, total_orders, on_time_delivery_rate
)
VALUES (
  '00000000-0000-0000-0000-000000000105'::uuid,
  '00000000-0000-0000-0000-000000000105'::uuid,
  'Dhaka Trims & Accessories',
  'Trims Supplier',
  'Bangladesh',
  'Dhaka',
  'Mirpur-11, Dhaka-1216',
  200000,
  1000,
  10,
  ARRAY['Buttons', 'Zippers', 'Labels', 'Packaging Materials', 'Hang Tags'],
  'verified'::verification_status,
  'silver'::supplier_tier,
  4.5,
  189,
  89.7
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status;

-- Admin User
INSERT INTO public.profiles (id, full_name, email, company_name, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000999'::uuid, 'Admin User', 'admin@test.sleekapp.com', 'Sleek Apparels', '+880-1711-999999', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name;

INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000999'::uuid, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ========================================
-- SECTION 2: SUPPLIER CERTIFICATIONS
-- ========================================

-- Certifications for Dhaka Knitwear Ltd
INSERT INTO public.supplier_certifications (supplier_id, certification_name, certification_body, issue_date, expiry_date, certificate_url)
VALUES 
  ('00000000-0000-0000-0000-000000000101'::uuid, 'WRAP Certification', 'Worldwide Responsible Accredited Production', '2023-01-15', '2026-01-14', 'https://example.com/cert-wrap.pdf'),
  ('00000000-0000-0000-0000-000000000101'::uuid, 'OEKO-TEX Standard 100', 'OEKO-TEX Association', '2023-06-20', '2024-06-19', 'https://example.com/cert-oeko.pdf'),
  ('00000000-0000-0000-0000-000000000101'::uuid, 'ISO 9001:2015', 'International Organization for Standardization', '2022-03-10', '2025-03-09', 'https://example.com/cert-iso.pdf')
ON CONFLICT (id) DO NOTHING;

-- Certifications for Active Sports Textiles
INSERT INTO public.supplier_certifications (supplier_id, certification_name, certification_body, issue_date, expiry_date, certificate_url)
VALUES 
  ('00000000-0000-0000-0000-000000000102'::uuid, 'BSCI Social Compliance', 'Business Social Compliance Initiative', '2023-02-28', '2025-02-27', 'https://example.com/cert-bsci.pdf'),
  ('00000000-0000-0000-0000-000000000102'::uuid, 'GOTS Organic', 'Global Organic Textile Standard', '2023-08-10', '2024-08-09', 'https://example.com/cert-gots.pdf')
ON CONFLICT (id) DO NOTHING;

-- Certifications for Premium Fabric Mills
INSERT INTO public.supplier_certifications (supplier_id, certification_name, certification_body, issue_date, expiry_date, certificate_url)
VALUES 
  ('00000000-0000-0000-0000-000000000104'::uuid, 'OEKO-TEX Standard 100', 'OEKO-TEX Association', '2023-04-15', '2024-04-14', 'https://example.com/cert-oeko2.pdf'),
  ('00000000-0000-0000-0000-000000000104'::uuid, 'ISO 14001:2015', 'Environmental Management', '2022-11-20', '2025-11-19', 'https://example.com/cert-iso-env.pdf')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- SECTION 3: PRODUCTS (Portfolio Items)
-- ========================================

-- Note: Using photorealistic image URLs from aiGeneratedProductImages.ts
-- These are 4K studio-quality product images

INSERT INTO public.products (
  id, name, category, description, base_price, featured, 
  minimum_order, available_colors, available_sizes, lead_time_days,
  supplier_id, created_at, updated_at
)
VALUES 
  -- T-Shirts
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Premium Cotton Crew Neck T-Shirt',
    'T-Shirts',
    'Classic crew neck t-shirt made from 100% combed cotton. Soft, breathable, and perfect for everyday wear. Pre-shrunk fabric ensures long-lasting fit.',
    8.50,
    true,
    100,
    ARRAY['White', 'Black', 'Navy Blue', 'Heather Gray', 'Red', 'Royal Blue'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    25,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    'V-Neck Fashion T-Shirt',
    'T-Shirts',
    'Stylish v-neck design with premium cotton blend. Perfect for casual and semi-formal occasions. Modern slim fit.',
    9.00,
    true,
    100,
    ARRAY['White', 'Black', 'Charcoal', 'Navy', 'Burgundy'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    25,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '38 days',
    NOW() - INTERVAL '8 days'
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    'Oversized Streetwear T-Shirt',
    'T-Shirts',
    'Trendy oversized fit with dropped shoulders. Heavy-weight cotton for premium feel. Perfect for streetwear brands.',
    10.50,
    true,
    150,
    ARRAY['Black', 'White', 'Olive', 'Sand', 'Washed Blue'],
    ARRAY['M', 'L', 'XL', '2XL'],
    30,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '5 days'
  ),
  
  -- Polo Shirts
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    'Classic Pique Polo Shirt',
    'Polo Shirts',
    'Traditional pique polo with ribbed collar and cuffs. Perfect for corporate uniforms and casual wear. Durable and easy-care fabric.',
    12.00,
    true,
    200,
    ARRAY['White', 'Black', 'Navy', 'Red', 'Kelly Green', 'Royal Blue'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    28,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '42 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    '10000000-0000-0000-0000-000000000005'::uuid,
    'Performance Polo Shirt',
    'Polo Shirts',
    'Moisture-wicking performance polo ideal for active lifestyles. Quick-dry fabric with anti-bacterial treatment.',
    14.50,
    true,
    150,
    ARRAY['White', 'Black', 'Navy', 'Gray', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    30,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '7 days'
  ),

  -- Hoodies
  (
    '10000000-0000-0000-0000-000000000006'::uuid,
    'Pullover Fleece Hoodie',
    'Hoodies',
    'Cozy pullover hoodie with kangaroo pocket. Brushed fleece interior for warmth. Perfect for schools and teams.',
    22.00,
    true,
    100,
    ARRAY['Black', 'Navy', 'Heather Gray', 'Maroon', 'Forest Green'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    35,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '50 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    '10000000-0000-0000-0000-000000000007'::uuid,
    'Zip-Up Hoodie with Pockets',
    'Hoodies',
    'Full-zip hoodie with dual side pockets. Heavy-weight fleece for maximum comfort. Ideal for branding.',
    24.50,
    true,
    100,
    ARRAY['Black', 'Navy', 'Charcoal', 'Royal Blue'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    35,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '9 days'
  ),
  (
    '10000000-0000-0000-0000-000000000008'::uuid,
    'Tech Fleece Hoodie',
    'Hoodies',
    'Modern tech fleece with lightweight warmth. Sleek design perfect for athleisure brands. Premium fabric blend.',
    28.00,
    true,
    150,
    ARRAY['Black', 'Gray', 'Navy', 'Olive'],
    ARRAY['M', 'L', 'XL', '2XL'],
    40,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '6 days'
  ),

  -- Sweatshirts
  (
    '10000000-0000-0000-0000-000000000009'::uuid,
    'Crew Neck Sweatshirt',
    'Sweatshirts',
    'Classic crew neck sweatshirt with ribbed cuffs and hem. Soft fleece interior. Perfect for screen printing.',
    18.00,
    true,
    100,
    ARRAY['White', 'Black', 'Gray', 'Navy', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    30,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '11 days'
  ),
  (
    '10000000-0000-0000-0000-000000000010'::uuid,
    'Premium French Terry Sweatshirt',
    'Sweatshirts',
    'High-quality French terry fabric with modern fit. Soft and durable. Ideal for premium brands.',
    20.50,
    true,
    150,
    ARRAY['Heather Gray', 'Black', 'Navy', 'Burgundy'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    32,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '32 days',
    NOW() - INTERVAL '8 days'
  ),

  -- Activewear
  (
    '10000000-0000-0000-0000-000000000011'::uuid,
    'Sports Performance Jersey',
    'Activewear',
    'Moisture-wicking athletic jersey with ventilation panels. Lightweight and breathable. Perfect for team sports.',
    15.00,
    true,
    100,
    ARRAY['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    28,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '13 days'
  ),
  (
    '10000000-0000-0000-0000-000000000012'::uuid,
    'Athletic Track Pants',
    'Activewear',
    'Comfortable track pants with elastic waistband and ankle zippers. Breathable polyester blend.',
    16.50,
    true,
    100,
    ARRAY['Black', 'Navy', 'Charcoal', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    30,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '38 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    '10000000-0000-0000-0000-000000000013'::uuid,
    'Compression Athletic Top',
    'Activewear',
    'Form-fitting compression top for enhanced performance. Four-way stretch fabric with UV protection.',
    18.50,
    true,
    150,
    ARRAY['Black', 'Navy', 'Gray', 'Red'],
    ARRAY['S', 'M', 'L', 'XL'],
    32,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '7 days'
  ),

  -- School Uniforms
  (
    '10000000-0000-0000-0000-000000000014'::uuid,
    'School Uniform Polo',
    'Uniforms',
    'Durable polo shirt designed specifically for school uniforms. Easy-care fabric that maintains color after washing.',
    11.00,
    true,
    300,
    ARRAY['White', 'Navy', 'Sky Blue', 'Red'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    35,
    '00000000-0000-0000-0000-000000000103'::uuid,
    NOW() - INTERVAL '50 days',
    NOW() - INTERVAL '14 days'
  ),
  (
    '10000000-0000-0000-0000-000000000015'::uuid,
    'School Uniform Pants',
    'Uniforms',
    'Comfortable uniform pants with reinforced knees. Adjustable waistband for growing children.',
    14.00,
    true,
    300,
    ARRAY['Navy', 'Khaki', 'Black', 'Gray'],
    ARRAY['4', '6', '8', '10', '12', '14', '16'],
    35,
    '00000000-0000-0000-0000-000000000103'::uuid,
    NOW() - INTERVAL '48 days',
    NOW() - INTERVAL '12 days'
  ),

  -- Corporate Uniforms
  (
    '10000000-0000-0000-0000-000000000016'::uuid,
    'Corporate Polo Uniform',
    'Uniforms',
    'Professional polo shirt for corporate environments. Wrinkle-resistant fabric with contemporary fit.',
    13.50,
    true,
    200,
    ARRAY['White', 'Black', 'Navy', 'Charcoal'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    32,
    '00000000-0000-0000-0000-000000000103'::uuid,
    NOW() - INTERVAL '42 days',
    NOW() - INTERVAL '11 days'
  ),
  (
    '10000000-0000-0000-0000-000000000017'::uuid,
    'Industrial Work Shirt',
    'Uniforms',
    'Heavy-duty work shirt with reinforced stitching. Multiple pockets for functionality.',
    16.00,
    true,
    250,
    ARRAY['Navy', 'Charcoal', 'Red', 'Orange'],
    ARRAY['M', 'L', 'XL', '2XL', '3XL'],
    35,
    '00000000-0000-0000-0000-000000000103'::uuid,
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '9 days'
  ),

  -- Tank Tops
  (
    '10000000-0000-0000-0000-000000000018'::uuid,
    'Athletic Tank Top',
    'Tank Tops',
    'Lightweight tank top with moisture-wicking properties. Perfect for gym wear and summer sports.',
    9.50,
    true,
    100,
    ARRAY['White', 'Black', 'Gray', 'Navy', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    25,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '7 days'
  ),

  -- Long Sleeve Shirts
  (
    '10000000-0000-0000-0000-000000000019'::uuid,
    'Long Sleeve Performance Shirt',
    'Long Sleeve',
    'Athletic long sleeve with thumb holes and reflective details. Ideal for outdoor activities.',
    17.00,
    true,
    100,
    ARRAY['Black', 'Navy', 'Gray', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    30,
    '00000000-0000-0000-0000-000000000102'::uuid,
    NOW() - INTERVAL '33 days',
    NOW() - INTERVAL '8 days'
  ),
  (
    '10000000-0000-0000-0000-000000000020'::uuid,
    'Henley Long Sleeve Shirt',
    'Long Sleeve',
    'Classic henley style with button placket. Comfortable cotton blend for everyday wear.',
    15.50,
    true,
    100,
    ARRAY['White', 'Black', 'Gray', 'Navy', 'Burgundy'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    28,
    '00000000-0000-0000-0000-000000000101'::uuid,
    NOW() - INTERVAL '37 days',
    NOW() - INTERVAL '9 days'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  updated_at = NOW();

-- ========================================
-- SECTION 4: MARKETPLACE PRODUCTS
-- ========================================

-- Marketplace listings from suppliers
INSERT INTO marketplace_products (
  id, supplier_id, product_name, category, description, base_price,
  minimum_order_quantity, lead_time_days, available_colors, available_sizes,
  featured, status, created_at
)
VALUES
  -- From Dhaka Knitwear Ltd
  (
    '20000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000101'::uuid,
    'Classic Cotton T-Shirt - Bulk Order',
    'T-Shirts',
    'High-quality cotton t-shirts perfect for bulk orders. Excellent for promotional campaigns, events, or retail.',
    7.50,
    500,
    25,
    ARRAY['White', 'Black', 'Navy', 'Gray', 'Red', 'Royal Blue'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '20 days'
  ),
  (
    '20000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000101'::uuid,
    'Premium Polo Shirt',
    'Polo Shirts',
    'Professional polo shirts ideal for corporate branding. Durable pique fabric.',
    11.00,
    300,
    28,
    ARRAY['White', 'Black', 'Navy', 'Red'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '18 days'
  ),
  (
    '20000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000101'::uuid,
    'Heavyweight Hoodie',
    'Hoodies',
    'Cozy fleece hoodie perfect for cold weather. Great for schools and sports teams.',
    20.00,
    200,
    35,
    ARRAY['Black', 'Navy', 'Gray', 'Maroon'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '15 days'
  ),

  -- From Active Sports Textiles
  (
    '20000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000102'::uuid,
    'Performance Athletic Jersey',
    'Activewear',
    'Moisture-wicking sports jersey with excellent breathability. Perfect for team sports.',
    14.00,
    200,
    25,
    ARRAY['White', 'Black', 'Red', 'Blue', 'Yellow'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '22 days'
  ),
  (
    '20000000-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000102'::uuid,
    'Track Suit Set',
    'Activewear',
    'Complete track suit with jacket and pants. Comfortable and durable for athletic wear.',
    32.00,
    150,
    30,
    ARRAY['Black', 'Navy', 'Red', 'Gray'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '12 days'
  ),

  -- From Bengal Uniforms Manufacturing
  (
    '20000000-0000-0000-0000-000000000006'::uuid,
    '00000000-0000-0000-0000-000000000103'::uuid,
    'School Uniform Set',
    'Uniforms',
    'Complete school uniform including shirt and pants. Durable and comfortable for daily wear.',
    22.00,
    500,
    35,
    ARRAY['White/Navy', 'White/Khaki', 'Blue/Black'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    true,
    'active',
    NOW() - INTERVAL '25 days'
  ),
  (
    '20000000-0000-0000-0000-000000000007'::uuid,
    '00000000-0000-0000-0000-000000000103'::uuid,
    'Corporate Uniform Package',
    'Uniforms',
    'Professional corporate uniform set with polo and pants. Perfect for hospitality and retail.',
    28.00,
    300,
    32,
    ARRAY['Black', 'Navy', 'Charcoal'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    true,
    'active',
    NOW() - INTERVAL '17 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- SECTION 5: BLOG POSTS
-- ========================================

-- Blog Categories
INSERT INTO public.blog_categories (id, name, slug, description)
VALUES
  ('30000000-0000-0000-0000-000000000001'::uuid, 'Industry Insights', 'industry-insights', 'Latest trends and insights from the apparel manufacturing industry'),
  ('30000000-0000-0000-0000-000000000002'::uuid, 'Sourcing Tips', 'sourcing-tips', 'Expert advice on sourcing apparel from Bangladesh'),
  ('30000000-0000-0000-0000-000000000003'::uuid, 'Sustainability', 'sustainability', 'Sustainable practices in garment manufacturing'),
  ('30000000-0000-0000-0000-000000000004'::uuid, 'Technology', 'technology', 'How technology is transforming apparel sourcing')
ON CONFLICT (id) DO NOTHING;

-- Sample Blog Posts
INSERT INTO public.blog_posts (
  id, title, slug, excerpt, content, category_id, author_id,
  featured_image, published, published_at, views
)
VALUES
  (
    '40000000-0000-0000-0000-000000000001'::uuid,
    'Why Bangladesh is the World''s Second-Largest Apparel Exporter',
    'why-bangladesh-apparel-exporter',
    'Discover how Bangladesh became a global leader in garment manufacturing and what makes it the preferred sourcing destination for brands worldwide.',
    E'# Why Bangladesh is the World''s Second-Largest Apparel Exporter\n\nBangladesh has risen to become the world''s second-largest apparel exporter, right after China. This remarkable achievement is the result of several key factors:\n\n## 1. Competitive Pricing\nBangladeshi manufacturers offer some of the most competitive prices in the global market, making it attractive for brands of all sizes.\n\n## 2. Skilled Workforce\nWith over 4 million workers in the garment industry, Bangladesh has developed a highly skilled workforce specialized in apparel production.\n\n## 3. Vertical Integration\nMany factories in Bangladesh offer vertical integration, from fabric production to finished garments, ensuring quality control and faster lead times.\n\n## 4. Compliance and Standards\nAfter the Rana Plaza tragedy in 2013, Bangladesh has made significant improvements in factory safety and compliance, becoming one of the most monitored garment industries globally.\n\n## 5. Government Support\nThe Bangladeshi government provides strong support to the RMG (Ready-Made Garment) sector through favorable policies and infrastructure development.\n\n## Conclusion\nFor brands looking to source quality apparel at competitive prices, Bangladesh remains the top choice globally.',
    '30000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000999'::uuid,
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    true,
    NOW() - INTERVAL '15 days',
    1247
  ),
  (
    '40000000-0000-0000-0000-000000000002'::uuid,
    '10 Tips for Successful Apparel Sourcing from Bangladesh',
    'tips-apparel-sourcing-bangladesh',
    'Essential tips every buyer should know when sourcing garments from Bangladesh to ensure quality, compliance, and on-time delivery.',
    E'# 10 Tips for Successful Apparel Sourcing from Bangladesh\n\nSourcing apparel from Bangladesh can be highly rewarding when done right. Here are 10 essential tips:\n\n## 1. Verify Factory Certifications\nAlways check for WRAP, BSCI, OEKO-TEX, and other relevant certifications before partnering with a supplier.\n\n## 2. Start with Sample Orders\nNever place bulk orders without testing samples first. This helps you verify quality and fit.\n\n## 3. Communicate Clearly\nProvide detailed tech packs and specifications. Clear communication prevents costly mistakes.\n\n## 4. Visit Factories (When Possible)\nNothing beats seeing production facilities in person to assess capabilities and conditions.\n\n## 5. Build Long-Term Relationships\nSuppliers prioritize loyal customers. Building relationships leads to better pricing and service.\n\n## 6. Plan Lead Times Carefully\nAccount for production time, shipping, customs clearance, and potential delays.\n\n## 7. Use Technology Platforms\nPlatforms like LoopTrace AI make sourcing easier with instant quotes and real-time tracking.\n\n## 8. Understand MOQ Requirements\nBangladeshi factories typically have MOQ (Minimum Order Quantities). Plan your quantities accordingly.\n\n## 9. Consider Quality Control\nImplement third-party QC inspections to ensure standards are met before shipping.\n\n## 10. Stay Updated on Compliance\nKeep track of changing labor laws, safety standards, and trade regulations.\n\n## Ready to Start Sourcing?\nConnect with verified suppliers through Sleek Apparels and experience hassle-free sourcing.',
    '30000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000999'::uuid,
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    true,
    NOW() - INTERVAL '10 days',
    892
  ),
  (
    '40000000-0000-0000-0000-000000000003'::uuid,
    'How AI is Revolutionizing Apparel Sourcing',
    'ai-revolutionizing-apparel-sourcing',
    'Explore how artificial intelligence and machine learning are transforming the traditional apparel sourcing process.',
    E'# How AI is Revolutionizing Apparel Sourcing\n\nArtificial Intelligence is transforming every industry, and apparel sourcing is no exception. Here''s how:\n\n## Instant Quote Generation\nTraditional quoting takes days or weeks. AI-powered platforms like LoopTrace can generate accurate quotes in seconds by analyzing:\n- Material costs\n- Labor requirements\n- Production complexity\n- Market rates\n\n## Intelligent Supplier Matching\nAI algorithms can match buyers with the most suitable suppliers based on:\n- Product category specialization\n- Production capacity\n- Quality ratings\n- Past performance\n- Geographic location\n\n## Predictive Analytics\nMachine learning models can predict:\n- Production bottlenecks\n- Delivery delays\n- Quality issues\n- Cost fluctuations\n\n## Automated Quality Control\nComputer vision technology can detect defects in real-time during production, reducing rejection rates.\n\n## Real-Time Tracking\nAI-powered IoT sensors provide live updates on:\n- Production progress\n- Shipment location\n- Environmental conditions\n\n## Cost Optimization\nAI analyzes historical data to recommend the best times to place orders and optimize pricing.\n\n## The Future is Here\nPlatforms like Sleek Apparels are leading this transformation with LoopTrace AI technology, making sourcing faster, smarter, and more transparent.',
    '30000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000999'::uuid,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    true,
    NOW() - INTERVAL '5 days',
    1456
  ),
  (
    '40000000-0000-0000-0000-000000000004'::uuid,
    'Sustainable Apparel Manufacturing: The Bangladesh Story',
    'sustainable-apparel-manufacturing-bangladesh',
    'How Bangladesh is leading the way in sustainable garment production with green factories and ethical practices.',
    E'# Sustainable Apparel Manufacturing: The Bangladesh Story\n\nBangladesh is making remarkable strides in sustainable apparel manufacturing:\n\n## Green Factories\nBangladesh now has the highest number of LEED-certified green garment factories globally, with over 180+ green factories.\n\n## Water Conservation\nModern factories use:\n- Water recycling systems\n- Effluent treatment plants (ETP)\n- Rainwater harvesting\n\n## Energy Efficiency\n- Solar panel installations\n- Natural lighting in factories\n- Energy-efficient machinery\n\n## Ethical Labor Practices\n- Fair wages\n- Safe working conditions\n- Worker rights protection\n- Maternity benefits\n\n## Organic and Recycled Materials\nIncreasing use of:\n- Organic cotton\n- Recycled polyester\n- Sustainable dyes\n\n## Certifications\n- GOTS (Global Organic Textile Standard)\n- OEKO-TEX\n- Better Cotton Initiative\n- Fair Trade\n\n## The Path Forward\nBangladesh is committed to becoming a leader in sustainable fashion manufacturing, balancing economic growth with environmental responsibility.',
    '30000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000999'::uuid,
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
    true,
    NOW() - INTERVAL '20 days',
    2103
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- SECTION 6: SAMPLE ORDERS
-- ========================================

-- Create some sample orders showing buyer-supplier relationships
INSERT INTO public.orders (
  id, buyer_id, supplier_id, product_id, quantity, unit_price, total_amount,
  status, order_date, expected_delivery_date, notes
)
VALUES
  -- Order 1: Fashion Brand ordering T-Shirts
  (
    '50000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid, -- Sarah Johnson
    '00000000-0000-0000-0000-000000000101'::uuid, -- Dhaka Knitwear Ltd
    '10000000-0000-0000-0000-000000000001'::uuid, -- Premium Cotton T-Shirt
    1000,
    8.00,
    8000.00,
    'bulk_production'::order_workflow_status,
    NOW() - INTERVAL '20 days',
    NOW() + INTERVAL '10 days',
    'Custom screen printing required - brand logo on front chest'
  ),
  -- Order 2: School ordering Uniforms
  (
    '50000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid, -- Michael Chen
    '00000000-0000-0000-0000-000000000103'::uuid, -- Bengal Uniforms
    '10000000-0000-0000-0000-000000000014'::uuid, -- School Uniform Polo
    500,
    10.50,
    5250.00,
    'sample_approved'::order_workflow_status,
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '25 days',
    'School logo embroidery on left chest'
  ),
  -- Order 3: Sports Team ordering Jerseys
  (
    '50000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000004'::uuid, -- James Williams
    '00000000-0000-0000-0000-000000000102'::uuid, -- Active Sports Textiles
    '10000000-0000-0000-0000-000000000011'::uuid, -- Sports Performance Jersey
    150,
    14.50,
    2175.00,
    'shipped'::order_workflow_status,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '5 days',
    'Team numbers and names on back - sublimation printing'
  ),
  -- Order 4: Corporate ordering Polos
  (
    '50000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid, -- Emily Rodriguez
    '00000000-0000-0000-0000-000000000101'::uuid, -- Dhaka Knitwear Ltd
    '10000000-0000-0000-0000-000000000004'::uuid, -- Classic Pique Polo
    300,
    11.50,
    3450.00,
    'delivered'::order_workflow_status,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '20 days',
    'Company logo embroidery - excellent quality, will reorder'
  ),
  -- Order 5: Wholesaler bulk order
  (
    '50000000-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000005'::uuid, -- Lisa Anderson
    '00000000-0000-0000-0000-000000000101'::uuid, -- Dhaka Knitwear Ltd
    '10000000-0000-0000-0000-000000000006'::uuid, -- Pullover Fleece Hoodie
    800,
    20.00,
    16000.00,
    'qc_inspection'::order_workflow_status,
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '5 days',
    'Assorted colors - for retail distribution'
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- SECTION 7: ANALYTICS & TRACKING
-- ========================================

-- Sample analytics events (page views, CTA clicks)
INSERT INTO public.analytics_events (event_type, page_url, user_id, metadata)
VALUES
  ('page_view', '/looptrace-technology', NULL, '{"source": "organic", "device": "desktop"}'::jsonb),
  ('page_view', '/marketplace', NULL, '{"source": "direct", "device": "mobile"}'::jsonb),
  ('cta_click', '/looptrace-technology', NULL, '{"button_id": "get_instant_quote", "position": "hero"}'::jsonb),
  ('page_view', '/portfolio', NULL, '{"source": "google", "device": "desktop"}'::jsonb),
  ('cta_click', '/become-supplier', NULL, '{"button_id": "join_as_supplier", "position": "top"}'::jsonb)
ON CONFLICT DO NOTHING;

-- ========================================
-- SECTION 8: LEAD CAPTURES
-- ========================================

-- Sample leads (users who showed interest before signing up)
INSERT INTO public.lead_captures (
  email, full_name, company_name, phone, lead_source, page_url, 
  user_type, status, captured_at
)
VALUES
  ('potential.buyer1@example.com', 'John Smith', 'Trendy Apparel Co', '+1-555-1001', 'landing_page', '/looptrace-for-buyers', 'customer', 'new', NOW() - INTERVAL '3 days'),
  ('potential.supplier1@example.com', 'Kamal Hossain', 'Dhaka Textiles Ltd', '+880-1711-2001', 'landing_page', '/looptrace-for-suppliers', 'production_partner', 'new', NOW() - INTERVAL '2 days'),
  ('potential.buyer2@example.com', 'Maria Garcia', 'Fashion Forward Inc', '+1-555-1002', 'marketplace', '/marketplace', 'customer', 'contacted', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SAMPLE DATA SEED COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- 10 user profiles (5 buyers + 5 suppliers + 1 admin)';
  RAISE NOTICE '- 5 supplier companies with certifications';
  RAISE NOTICE '- 20 portfolio products';
  RAISE NOTICE '- 7 marketplace listings';
  RAISE NOTICE '- 4 blog posts with categories';
  RAISE NOTICE '- 5 sample orders';
  RAISE NOTICE '- Sample analytics events';
  RAISE NOTICE '- Sample lead captures';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT: Update the UUIDs with your actual Supabase Auth user IDs';
  RAISE NOTICE 'All test accounts use @test.sleekapp.com domain';
  RAISE NOTICE '==============================================';
END $$;
