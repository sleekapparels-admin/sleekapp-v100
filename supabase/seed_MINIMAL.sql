-- ========================================
-- SLEEK APPARELS SAMPLE DATA SEED - MINIMAL VERSION
-- ========================================
-- This version ONLY includes the 3 Auth users you actually created
-- Sarah Johnson (Buyer), Ahmed Hassan (Supplier), Admin User
-- ========================================

-- UUID MAPPING:
-- Sarah Johnson (Buyer): 76aca2d5-4649-4a98-bca2-2274c2527a3a
-- Ahmed Hassan (Supplier): 7d52fff8-1992-4994-9817-296e7da7e27b
-- Admin User: 441f2e49-44fb-48c6-9dc4-cbf1929677e1

-- ========================================
-- SECTION 1: USER PROFILES & ROLES (3 USERS ONLY)
-- ========================================

-- Buyer 1: Fashion Brand Owner (Sarah Johnson) - YOUR ACTUAL USER
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES 
  ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'Sarah Johnson', 'sarah.johnson@test.sleekapp.com', 'Urban Fashion Co', '+1-555-0101', NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'retailer')
ON CONFLICT (user_id, role) DO NOTHING;

-- Supplier 1: Knitwear Manufacturer (Ahmed Hassan) - YOUR ACTUAL USER
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES 
  ('7d52fff8-1992-4994-9817-296e7da7e27b'::uuid, 'Ahmed Hassan', 'ahmed.hassan@test.sleekapp.com', 'Dhaka Knitwear Ltd', '+880-1711-000101', NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('7d52fff8-1992-4994-9817-296e7da7e27b'::uuid, 'supplier')
ON CONFLICT (user_id, role) DO NOTHING;

-- Admin User - YOUR ACTUAL USER
INSERT INTO public.profiles (id, full_name, email, company_name, phone, updated_at)
VALUES 
  ('441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid, 'Admin User', 'admin@test.sleekapp.com', 'Sleek Apparels Platform', '+1-555-ADMIN', NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone;

INSERT INTO public.user_roles (user_id, role)
VALUES ('441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ========================================
-- SECTION 2: SUPPLIER PROFILE (Ahmed only)
-- ========================================

INSERT INTO public.suppliers (
  id, user_id, company_name, business_registration_number, tax_id, 
  country, city, address, postal_code, phone, email,
  website, company_description, year_established, total_employees,
  production_capacity_monthly, lead_time_days, minimum_order_quantity,
  verification_status, performance_score, on_time_delivery_rate,
  quality_rating, tier, is_featured, created_at, updated_at
)
VALUES (
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Dhaka Knitwear Ltd',
  'BN-2015-KW-5521',
  'TAX-BD-987654',
  'Bangladesh',
  'Dhaka',
  '123 Garment District, Mirpur',
  '1216',
  '+880-1711-000101',
  'ahmed.hassan@test.sleekapp.com',
  'https://dhaka-knitwear.example.com',
  'Leading knitwear manufacturer specializing in cotton and wool garments. 15+ years experience, WRAP certified, serving European and US markets.',
  2008,
  450,
  50000,
  30,
  500,
  'verified'::verification_status,
  92.5,
  95.0,
  4.6,
  'gold'::supplier_tier,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  verification_status = EXCLUDED.verification_status,
  performance_score = EXCLUDED.performance_score;

-- ========================================
-- SECTION 3: PRODUCTS (Ahmed's portfolio only - 4 products)
-- ========================================

INSERT INTO public.products (
  id, supplier_id, name, description, category, 
  base_price, currency, minimum_order_quantity, lead_time_days,
  available_colors, available_sizes, material_composition,
  features, certifications, country_of_origin,
  is_active, created_at, updated_at
)
VALUES
  -- Product 1: Premium Cotton T-Shirt
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Premium Cotton T-Shirt',
    'High-quality 100% combed cotton crew neck t-shirt. Pre-shrunk, soft feel, durable construction. Perfect for brands, corporate wear, and promotional items.',
    'T-Shirts',
    8.00,
    'USD',
    500,
    25,
    ARRAY['White', 'Black', 'Navy', 'Gray', 'Red', 'Royal Blue'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    '100% Combed Cotton, 180 GSM',
    ARRAY['Pre-shrunk', 'Tagless neck label', 'Side-seamed', 'Reinforced shoulder seams', 'Double-needle stitching'],
    ARRAY['OEKO-TEX Standard 100', 'WRAP Certified'],
    'Bangladesh',
    true,
    NOW(),
    NOW()
  ),
  -- Product 2: Classic Polo Shirt
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Classic Polo Shirt',
    'Professional polo shirt with ribbed collar and cuffs. Made from pique cotton for breathability and durability. Ideal for corporate uniforms and casual wear.',
    'Polos',
    12.00,
    'USD',
    300,
    28,
    ARRAY['White', 'Black', 'Navy', 'Charcoal', 'Burgundy', 'Forest Green'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    '100% Cotton Pique, 200 GSM',
    ARRAY['Three-button placket', 'Ribbed collar and cuffs', 'Side vents', 'Reinforced seams'],
    ARRAY['OEKO-TEX Standard 100'],
    'Bangladesh',
    true,
    NOW(),
    NOW()
  ),
  -- Product 3: Merino Wool Sweater
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Merino Wool Sweater',
    'Luxurious crew neck sweater in fine gauge merino wool. Lightweight, breathable, naturally odor-resistant. Perfect for premium retail brands.',
    'Sweaters',
    35.00,
    'USD',
    200,
    35,
    ARRAY['Navy', 'Charcoal', 'Camel', 'Burgundy', 'Forest Green'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
    '100% Extra Fine Merino Wool, 12-gauge knit',
    ARRAY['Fully fashioned', 'Ribbed cuffs and hem', 'Flat seams', 'Machine washable'],
    ARRAY['Responsible Wool Standard', 'OEKO-TEX Standard 100'],
    'Bangladesh',
    true,
    NOW(),
    NOW()
  ),
  -- Product 4: Cotton Cardigan
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Cotton Cardigan',
    'Versatile button-front cardigan in soft cotton blend. Features ribbed trim and patch pockets. Great for layering in corporate and casual settings.',
    'Cardigans',
    28.00,
    'USD',
    250,
    32,
    ARRAY['Navy', 'Charcoal', 'Beige', 'Black', 'Light Gray'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    '80% Cotton, 20% Polyester, 7-gauge knit',
    ARRAY['Five-button front', 'Two patch pockets', 'Ribbed trim', 'Relaxed fit'],
    ARRAY['OEKO-TEX Standard 100'],
    'Bangladesh',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price;

-- ========================================
-- SECTION 4: SUPPLIER CERTIFICATIONS (Ahmed only)
-- ========================================

INSERT INTO public.supplier_certifications (
  id, supplier_id, certification_name, certification_body,
  certificate_number, issue_date, expiry_date, status, 
  certificate_url, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'WRAP (Worldwide Responsible Accredited Production)',
    'WRAP Certification Board',
    'WRAP-BD-2023-0521',
    '2023-03-15'::date,
    '2024-03-14'::date,
    'active',
    NULL,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'OEKO-TEX Standard 100',
    'OEKO-TEX Association',
    'OTX-2023-BD-8842',
    '2023-01-10'::date,
    '2024-01-09'::date,
    'active',
    NULL,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ========================================
-- SECTION 5: SAMPLE ORDER (Sarah → Ahmed)
-- ========================================

INSERT INTO public.orders (
  id, buyer_id, supplier_id, product_id, quantity, unit_price, total_amount,
  status, order_date, expected_delivery_date, notes
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
  NOW() + INTERVAL '10 days',
  'Custom screen printing required - brand logo on front chest'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  notes = EXCLUDED.notes;

-- ========================================
-- SECTION 6: BLOG CATEGORIES
-- ========================================

INSERT INTO public.blog_categories (id, name, slug, description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Industry News', 'industry-news', 'Latest news and trends in apparel manufacturing', NOW(), NOW()),
  (gen_random_uuid(), 'Best Practices', 'best-practices', 'Tips and guides for better manufacturing', NOW(), NOW()),
  (gen_random_uuid(), 'Technology', 'technology', 'Digital transformation and innovation', NOW(), NOW()),
  (gen_random_uuid(), 'Sustainability', 'sustainability', 'Sustainable and ethical manufacturing', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- SECTION 7: BLOG POSTS (2 sample posts)
-- ========================================

INSERT INTO public.blog_posts (
  id, title, slug, excerpt, content, author_id, status,
  featured_image, published_at, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    'How to Choose the Right Apparel Supplier for Your Brand',
    'how-to-choose-right-apparel-supplier',
    'A comprehensive guide to evaluating and selecting manufacturing partners that align with your brand values and quality standards.',
    E'# How to Choose the Right Apparel Supplier\n\nFinding the right manufacturing partner is crucial for your brand''s success. Here are key factors to consider:\n\n## 1. Quality Standards\nLook for certifications like WRAP, OEKO-TEX, and GOTS that demonstrate commitment to quality and ethical practices.\n\n## 2. Production Capacity\nEnsure the supplier can handle your order volumes and has capacity for growth as your brand scales.\n\n## 3. Communication\nEffective communication is essential. Look for suppliers who are responsive and transparent about their processes.\n\n## 4. Lead Times\nUnderstand their production timelines and ensure they align with your launch schedules.\n\n## 5. Minimum Order Quantities\nMake sure their MOQs fit your business model, especially if you''re a startup.\n\nBy carefully evaluating these factors, you can build strong, long-term partnerships with reliable suppliers.',
    '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid,
    'published',
    NULL,
    NOW() - INTERVAL '30 days',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'The Future of Sustainable Apparel Manufacturing',
    'future-sustainable-apparel-manufacturing',
    'Explore emerging trends in sustainable manufacturing practices and how they''re shaping the future of the fashion industry.',
    E'# The Future of Sustainable Apparel Manufacturing\n\nSustainability is no longer optional in the apparel industry—it''s essential. Here''s what''s driving change:\n\n## Circular Economy\nBrands are moving towards circular models where garments are designed for longevity, reuse, and recycling.\n\n## Innovative Materials\nFrom recycled polyester to plant-based alternatives, new materials are reducing environmental impact.\n\n## Transparent Supply Chains\nConsumers demand visibility into how and where their clothes are made.\n\n## Local Production\nNearshoring and local manufacturing reduce carbon footprint and lead times.\n\n## Digital Innovation\n3D design, AI-powered demand forecasting, and blockchain tracking are revolutionizing sustainability.\n\nThe future belongs to manufacturers who embrace these changes and help brands meet their sustainability goals.',
    '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid,
    'published',
    NULL,
    NOW() - INTERVAL '15 days',
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- DONE! Database seeded with minimal sample data
-- ========================================
-- 3 User Profiles (Sarah, Ahmed, Admin)
-- 1 Supplier (Ahmed's company)
-- 4 Products (Ahmed's portfolio)
-- 2 Certifications (Ahmed's certs)
-- 1 Order (Sarah → Ahmed)
-- 4 Blog Categories
-- 2 Blog Posts
-- ========================================
