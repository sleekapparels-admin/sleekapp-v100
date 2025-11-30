-- ========================================
-- COMPREHENSIVE SEED - ALL TABLES POPULATED
-- NO NULL VALUES - COMPLETE SAMPLE DATA
-- ========================================
-- Execute this via Supabase SQL Editor
-- ========================================

BEGIN;

-- ========================================
-- PHASE 1: FOUNDATION DATA
-- ========================================

-- Company Info (entity_type must be 'us_llc' or 'bangladesh')
INSERT INTO public.company_info (id, legal_name, entity_type, address, city, state, zip_code, country, registration_number, tax_id, active, display_order, created_at)
VALUES 
  (gen_random_uuid(), 'Sleek Apparels LLC', 'us_llc', '2250 Fashion Avenue, Suite 500', 'New York', 'NY', '10018', 'United States', 'US-LLC-2019-048291', 'EIN-84-2937561', true, 1, NOW()),
  (gen_random_uuid(), 'Sleek Apparels Bangladesh Ltd', 'bangladesh', 'House 42, Road 11, Block C, Banani', 'Dhaka', 'Dhaka Division', '1213', 'Bangladesh', 'BD-REG-2018-183749', 'BIN-003847291847', true, 2, NOW());

-- Certifications
INSERT INTO public.certifications (name, description, status, icon_name, color_class, bg_color_class, issuing_body, certificate_number, issue_date, expiry_date, certificate_url, active, display_order)
VALUES
  ('OEKO-TEX Standard 100', 'Tested for harmful substances', 'valid', 'Shield', 'text-green-600', 'bg-green-50', 'OEKO-TEX Association', 'OTX-2023-98471', '2023-01-15', '2026-01-15', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f', true, 1),
  ('BSCI Certified', 'Business Social Compliance Initiative', 'valid', 'Award', 'text-blue-600', 'bg-blue-50', 'FTA', 'BSCI-BD-2023-4829', '2023-03-20', '2025-03-20', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85', true, 2),
  ('WRAP Certified', 'Worldwide Responsible Accredited Production', 'valid', 'CheckCircle', 'text-purple-600', 'bg-purple-50', 'WRAP', 'WRAP-4829-2024', '2024-02-10', '2025-02-10', 'https://images.unsplash.com/photo-1521791136064-7986c2920216', true, 3),
  ('ISO 9001:2015', 'Quality Management System', 'valid', 'Star', 'text-yellow-600', 'bg-yellow-50', 'ISO', 'ISO-9001-BD-18374', '2022-06-15', '2025-06-15', 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3', true, 4);

-- Blog Categories
INSERT INTO public.blog_categories (name, slug, description, color)
VALUES
  ('Manufacturing Insights', 'manufacturing-insights', 'Production processes and quality control', '#10b981'),
  ('Sustainability', 'sustainability', 'Eco-friendly manufacturing practices', '#22c55e'),
  ('Industry Trends', 'industry-trends', 'Fashion and textile market updates', '#3b82f6'),
  ('How-To Guides', 'how-to-guides', 'Practical buyer guides', '#8b5cf6');

-- Exchange Rates
INSERT INTO public.exchange_rates (base_currency, target_currency, rate, fetched_at, valid_until)
VALUES
  ('USD', 'BDT', 110.50, NOW(), NOW() + INTERVAL '24 hours'),
  ('USD', 'EUR', 0.92, NOW(), NOW() + INTERVAL '24 hours'),
  ('USD', 'GBP', 0.79, NOW(), NOW() + INTERVAL '24 hours');

-- Automation Rules (rule_type must be: order_assignment, email_trigger, invoice_generation, notification)
INSERT INTO public.automation_rules (rule_name, rule_type, priority, active, conditions, actions)
VALUES
  ('Auto-Assign Orders', 'order_assignment', 1, true, '{"trigger": "quote_approved"}', '{"action": "assign_supplier"}'),
  ('Send Status Notifications', 'notification', 2, true, '{"trigger": "status_change"}', '{"action": "notify_buyer"}'),
  ('Generate Invoice on Completion', 'invoice_generation', 1, true, '{"trigger": "order_completed"}', '{"action": "create_invoice"}');

-- Case Studies
INSERT INTO public.case_studies (
  title, client_name, industry, product_type, quantity,
  challenge, solution, results, testimonial, testimonial_author,
  metrics, hero_image_url, process_images, featured, published
)
VALUES
  (
    'E-commerce Startup Scales from 50 to 5,000 Units',
    'Urban Streetwear Co.',
    'E-commerce Fashion',
    'Custom Hoodies',
    5000,
    'Small brand struggled to find manufacturers for growing order volumes',
    'Flexible MOQs and incremental scaling over 18 months',
    '100x volume growth, 4.8-star reviews, $500K annual revenue',
    'Sleek Apparels believed in us when no one else would',
    'Alex Martinez, Founder',
    '{"growth": "100x", "timeframe": "18 months", "revenue": "$500K"}',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64"]',
    true,
    true
  );

-- Industry Knowledge
INSERT INTO public.industry_knowledge (category, subcategory, title, content, metadata, version)
VALUES
  ('Materials', 'Fabric Guide', 'Cotton vs Polyester Comparison', 'Complete fabric comparison guide content here...', '{"reading_time": "5 min"}', 1),
  ('Quality', 'Standards', 'AQL 2.5 Standard Explained', 'Quality control standard details...', '{"reading_time": "6 min"}', 1);

-- Notifications (type must be: order_update, qc_alert, system, shipment)
INSERT INTO public.notifications (user_id, title, message, type, link, read)
VALUES
  ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'Order Confirmed', 'Order ORD-2024-001 confirmed', 'order_update', '/orders', true),
  ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'Production Started', 'Production started for your order', 'order_update', '/orders', false),
  ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'Quality Check Passed', 'QC inspection completed successfully', 'qc_alert', '/orders', false),
  ('76aca2d5-4649-4a98-bca2-2274c2527a3a'::uuid, 'Order Shipped', 'Your order has been shipped', 'shipment', '/orders', false);

COMMIT;

-- ========================================
-- EXECUTION INSTRUCTIONS
-- ========================================
-- 1. Go to Lovable Cloud backend
-- 2. Open SQL Editor
-- 3. Paste this entire file
-- 4. Execute
-- ========================================
