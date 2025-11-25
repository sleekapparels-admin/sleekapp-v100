-- ========================================
-- COMPREHENSIVE TEST DATA FOR LOOPTRACE
-- ========================================
-- Creates realistic orders with production stages for testing
-- ========================================

-- Clean up existing test data
DELETE FROM public.production_stages WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
  )
);

DELETE FROM public.order_updates WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
  )
);

DELETE FROM public.orders WHERE buyer_id IN (
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '441f2e49-44fb-48c6-9dc4-cbf1929677e1'::uuid
);

DELETE FROM public.marketplace_products WHERE supplier_id = '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid;

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
-- CREATE TEST USERS
-- ========================================

-- Buyer: Sarah Johnson
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

-- Supplier: Ahmed Hassan
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

-- Admin User
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

-- ========================================
-- CREATE SUPPLIER PROFILE
-- ========================================

INSERT INTO public.suppliers (
  id, user_id, company_name, country, city, phone, email,
  verification_status, performance_score, tier, is_featured,
  specializations, production_capacity, min_order_quantity,
  lead_time_days, created_at, updated_at
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
  ARRAY['T-Shirts', 'Hoodies', 'Activewear'],
  50000,
  500,
  30,
  NOW(),
  NOW()
);

-- ========================================
-- CREATE PRODUCTS
-- ========================================

INSERT INTO public.products (
  id, supplier_id, name, description, category,
  base_price, currency, minimum_order_quantity,
  is_active, created_at, updated_at
)
VALUES 
  (
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
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Fleece Pullover Hoodie',
    'Premium fleece hoodie with adjustable drawstring hood',
    'Hoodies',
    18.50,
    'USD',
    300,
    true,
    NOW(),
    NOW()
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'Performance Athletic Wear',
    'Moisture-wicking athletic wear with technical fabric',
    'Activewear',
    12.25,
    'USD',
    400,
    true,
    NOW(),
    NOW()
  );

-- ========================================
-- CREATE MARKETPLACE PRODUCTS
-- ========================================

INSERT INTO public.marketplace_products (
  id, supplier_id, product_type, title, description, category,
  base_price, available_quantity, moq, lead_time_days,
  status, is_featured, created_at, updated_at
)
VALUES 
  (
    '20000000-0000-0000-0000-000000000001'::uuid,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    'T-Shirts',
    'Premium Cotton T-Shirt - Ready Stock',
    'High-quality 100% combed cotton t-shirts. Ready to ship immediately.',
    'T-Shirts',
    6.50,
    5000,
    100,
    0,
    'approved',
    true,
    NOW(),
    NOW()
  );

-- ========================================
-- CREATE TEST ORDERS
-- ========================================

-- Order 1: T-Shirt Order - In Bulk Production (Active)
INSERT INTO public.orders (
  id, order_number, buyer_id, supplier_id, product_id,
  quantity, unit_price, total_amount, buyer_price,
  status, current_stage, payment_status,
  order_date, expected_delivery_date,
  created_at, updated_at
)
VALUES (
  '50000000-0000-0000-0000-000000000001'::uuid,
  'ORD-2025-001',
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '10000000-0000-0000-0000-000000000001'::uuid,
  1000,
  8.00,
  8000.00,
  10.00,
  'bulk_production'::order_workflow_status,
  'cutting'::production_stage,
  'deposit_paid',
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '15 days',
  NOW() - INTERVAL '15 days',
  NOW()
);

-- Order 2: Hoodie Order - QC Stage
INSERT INTO public.orders (
  id, order_number, buyer_id, supplier_id, product_id,
  quantity, unit_price, total_amount, buyer_price,
  status, current_stage, payment_status,
  order_date, expected_delivery_date,
  created_at, updated_at
)
VALUES (
  '50000000-0000-0000-0000-000000000002'::uuid,
  'ORD-2025-002',
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '10000000-0000-0000-0000-000000000002'::uuid,
  500,
  18.50,
  9250.00,
  22.00,
  'quality_control'::order_workflow_status,
  'quality_check'::production_stage,
  'deposit_paid',
  NOW() - INTERVAL '25 days',
  NOW() + INTERVAL '5 days',
  NOW() - INTERVAL '25 days',
  NOW()
);

-- Order 3: Activewear Order - Recently Confirmed
INSERT INTO public.orders (
  id, order_number, buyer_id, supplier_id, product_id,
  quantity, unit_price, total_amount, buyer_price,
  status, current_stage, payment_status,
  order_date, expected_delivery_date,
  created_at, updated_at
)
VALUES (
  '50000000-0000-0000-0000-000000000003'::uuid,
  'ORD-2025-003',
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '10000000-0000-0000-0000-000000000003'::uuid,
  800,
  12.25,
  9800.00,
  15.00,
  'confirmed'::order_workflow_status,
  'fabric_sourcing'::production_stage,
  'deposit_paid',
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '27 days',
  NOW() - INTERVAL '3 days',
  NOW()
);

-- Order 4: Completed T-Shirt Order
INSERT INTO public.orders (
  id, order_number, buyer_id, supplier_id, product_id,
  quantity, unit_price, total_amount, buyer_price,
  status, current_stage, payment_status,
  order_date, expected_delivery_date, actual_delivery_date,
  created_at, updated_at
)
VALUES (
  '50000000-0000-0000-0000-000000000004'::uuid,
  'ORD-2024-099',
  '76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid,
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  '10000000-0000-0000-0000-000000000001'::uuid,
  1200,
  7.50,
  9000.00,
  9.50,
  'completed'::order_workflow_status,
  'shipped'::production_stage,
  'fully_paid',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '8 days'
);

-- ========================================
-- CREATE PRODUCTION STAGES FOR ORDER 1 (Active T-Shirt Order)
-- ========================================

INSERT INTO public.production_stages (
  id, order_id, stage_name, stage_order, status,
  start_date, estimated_completion, actual_completion,
  notes, created_at, updated_at
)
VALUES
  -- Completed stages
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'fabric_sourcing',
    1,
    'completed',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '13 days',
    '100% cotton fabric sourced from local supplier',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '13 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'pattern_making',
    2,
    'completed',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '11 days',
    NOW() - INTERVAL '11 days',
    'Patterns approved by buyer',
    NOW() - INTERVAL '13 days',
    NOW() - INTERVAL '11 days'
  ),
  -- Current stage
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'cutting',
    3,
    'in_progress',
    NOW() - INTERVAL '11 days',
    NOW() - INTERVAL '8 days',
    NULL,
    'Cutting in progress - 60% complete',
    NOW() - INTERVAL '11 days',
    NOW()
  ),
  -- Pending stages
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'sewing',
    4,
    'pending',
    NULL,
    NOW() - INTERVAL '5 days',
    NULL,
    NULL,
    NOW() - INTERVAL '15 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'quality_check',
    5,
    'pending',
    NULL,
    NOW() - INTERVAL '2 days',
    NULL,
    NULL,
    NOW() - INTERVAL '15 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'finishing',
    6,
    'pending',
    NULL,
    NOW() + INTERVAL '2 days',
    NULL,
    NULL,
    NOW() - INTERVAL '15 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'packing',
    7,
    'pending',
    NULL,
    NOW() + INTERVAL '5 days',
    NULL,
    NULL,
    NOW() - INTERVAL '15 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'shipped',
    8,
    'pending',
    NULL,
    NOW() + INTERVAL '15 days',
    NULL,
    NULL,
    NOW() - INTERVAL '15 days',
    NOW()
  );

-- ========================================
-- CREATE PRODUCTION STAGES FOR ORDER 2 (Hoodie Order in QC)
-- ========================================

INSERT INTO public.production_stages (
  id, order_id, stage_name, stage_order, status,
  start_date, estimated_completion, actual_completion,
  notes, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'fabric_sourcing',
    1,
    'completed',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '23 days',
    NOW() - INTERVAL '23 days',
    'Premium fleece fabric imported',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '23 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'cutting',
    2,
    'completed',
    NOW() - INTERVAL '23 days',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days',
    'All pieces cut according to specifications',
    NOW() - INTERVAL '23 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'sewing',
    3,
    'completed',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days',
    'Sewing completed with reinforced stitching',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'quality_check',
    4,
    'in_progress',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '10 days',
    NULL,
    'QC inspection ongoing - 80% inspected',
    NOW() - INTERVAL '12 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'finishing',
    5,
    'pending',
    NULL,
    NOW() - INTERVAL '5 days',
    NULL,
    NULL,
    NOW() - INTERVAL '25 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'packing',
    6,
    'pending',
    NULL,
    NOW() - INTERVAL '2 days',
    NULL,
    NULL,
    NOW() - INTERVAL '25 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'shipped',
    7,
    'pending',
    NULL,
    NOW() + INTERVAL '5 days',
    NULL,
    NULL,
    NOW() - INTERVAL '25 days',
    NOW()
  );

-- ========================================
-- CREATE PRODUCTION STAGES FOR ORDER 3 (New Activewear Order)
-- ========================================

INSERT INTO public.production_stages (
  id, order_id, stage_name, stage_order, status,
  start_date, estimated_completion, actual_completion,
  notes, created_at, updated_at
)
VALUES
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'fabric_sourcing',
    1,
    'in_progress',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '2 days',
    NULL,
    'Performance fabric being sourced',
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'cutting',
    2,
    'pending',
    NULL,
    NOW() + INTERVAL '7 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'sewing',
    3,
    'pending',
    NULL,
    NOW() + INTERVAL '15 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'quality_check',
    4,
    'pending',
    NULL,
    NOW() + INTERVAL '20 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'finishing',
    5,
    'pending',
    NULL,
    NOW() + INTERVAL '23 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'packing',
    6,
    'pending',
    NULL,
    NOW() + INTERVAL '25 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'shipped',
    7,
    'pending',
    NULL,
    NOW() + INTERVAL '27 days',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    NOW()
  );

-- ========================================
-- CREATE ORDER UPDATES FOR REAL-TIME TRACKING
-- ========================================

INSERT INTO public.order_updates (
  id, order_id, stage, message, completion_percentage,
  created_by, created_at
)
VALUES
  -- Order 1 Updates
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'fabric_sourcing'::production_stage,
    'Fabric sourcing completed. High-quality cotton received.',
    100,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '13 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'pattern_making'::production_stage,
    'Patterns created and approved by buyer.',
    100,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '11 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000001'::uuid,
    'cutting'::production_stage,
    'Cutting in progress - 600 pieces completed.',
    60,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '2 days'
  ),
  -- Order 2 Updates
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'sewing'::production_stage,
    'Sewing completed with quality reinforced stitching.',
    100,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '12 days'
  ),
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000002'::uuid,
    'quality_check'::production_stage,
    'Quality inspection ongoing. 400 units inspected and approved.',
    80,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '1 day'
  ),
  -- Order 3 Updates
  (
    gen_random_uuid(),
    '50000000-0000-0000-0000-000000000003'::uuid,
    'fabric_sourcing'::production_stage,
    'Performance fabric sourcing in progress. Expected delivery in 2 days.',
    40,
    '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
    NOW() - INTERVAL '1 day'
  );

-- ========================================
-- SEED COMPLETE
-- ========================================
-- ✅ 3 Users (Buyer, Supplier, Admin)
-- ✅ 1 Verified Supplier
-- ✅ 3 Products
-- ✅ 1 Marketplace Product
-- ✅ 4 Orders (1 completed, 3 active)
-- ✅ 22 Production Stages across orders
-- ✅ 6 Order Updates for real-time tracking
-- ========================================
