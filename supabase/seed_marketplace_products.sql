-- =====================================================
-- MARKETPLACE READY-STOCK PRODUCTS SEED
-- =====================================================
-- These are wholesale/stock-lot products available for immediate purchase
-- Different from manufacturer portfolios (custom OEM)
-- =====================================================

-- First, let's update Ahmed's supplier to be a wholesale supplier (has ready stock)
UPDATE public.suppliers 
SET 
  supplier_type = 'wholesale_reseller',
  can_list_products = true,
  product_listing_tier = 'premium',
  total_products_listed = 7,
  active_products = 7
WHERE id = '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid;

-- =====================================================
-- READY STOCK PRODUCTS FOR MARKETPLACE
-- =====================================================

-- Product 1: Premium Cotton T-Shirt (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'T-Shirts',
  'Premium Cotton T-Shirt - Ready Stock',
  'High-quality 100% combed cotton t-shirts. Ready to ship immediately. Available in multiple colors and sizes. Perfect for brands, events, and bulk orders.',
  'T-Shirts',
  'Basics',
  6.50,
  5000,
  100,
  'pieces',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  ARRAY['White', 'Black', 'Navy', 'Gray', 'Red'],
  '100% Combed Cotton',
  180,
  '100% Cotton',
  0,
  'Dhaka, Bangladesh',
  'approved',
  95,
  true,
  1250,
  45,
  4.7,
  NOW() - INTERVAL '15 days',
  NOW(),
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '14 days'
);

-- Product 2: Sports Polo Shirts (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Polos',
  'Pique Polo Shirts - Stock Available',
  'Classic pique polo shirts with ribbed collar and cuffs. Ideal for corporate uniforms, sports teams, and casual wear. Ready for immediate dispatch.',
  'Polos',
  'Corporate',
  9.75,
  3500,
  100,
  'pieces',
  ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
  ARRAY['White', 'Black', 'Navy', 'Royal Blue', 'Burgundy'],
  'Cotton Pique',
  200,
  '100% Cotton',
  0,
  'Dhaka, Bangladesh',
  'approved',
  92,
  true,
  890,
  32,
  4.6,
  NOW() - INTERVAL '12 days',
  NOW(),
  NOW() - INTERVAL '11 days',
  NOW() - INTERVAL '11 days'
);

-- Product 3: Cotton Hoodies (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Hoodies',
  'Heavyweight Hoodies - In Stock',
  'Comfortable heavyweight hoodies with kangaroo pocket and drawstring hood. Perfect for winter promotions, team wear, and retail. Ships within 24 hours.',
  'Hoodies',
  'Casual',
  18.50,
  2000,
  50,
  'pieces',
  ARRAY['S', 'M', 'L', 'XL', '2XL'],
  ARRAY['Black', 'Gray', 'Navy', 'Maroon'],
  'Cotton Fleece',
  320,
  '80% Cotton, 20% Polyester',
  0,
  'Dhaka, Bangladesh',
  'approved',
  88,
  false,
  645,
  18,
  4.5,
  NOW() - INTERVAL '10 days',
  NOW(),
  NOW() - INTERVAL '9 days',
  NOW() - INTERVAL '9 days'
);

-- Product 4: Basic Tank Tops (Stock Lot)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Tank Tops',
  'Cotton Tank Tops - Clearance Stock',
  'Basic cotton tank tops from overproduction. Excellent quality at discounted price. Limited quantity available. Great for summer campaigns.',
  'Tank Tops',
  'Basics',
  3.25,
  1500,
  200,
  'pieces',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['White', 'Black', 'Gray'],
  'Cotton Jersey',
  160,
  '100% Cotton',
  0,
  'Dhaka, Bangladesh',
  'approved',
  85,
  false,
  420,
  12,
  4.4,
  NOW() - INTERVAL '8 days',
  NOW(),
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
);

-- Product 5: Athletic Shorts (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Shorts',
  'Polyester Athletic Shorts - Available Now',
  'Breathable polyester athletic shorts with elastic waistband. Perfect for sports teams, gym wear, and activewear retailers. Quick-dry fabric.',
  'Activewear',
  'Sports',
  7.80,
  4000,
  100,
  'pieces',
  ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
  ARRAY['Black', 'Navy', 'Red', 'Royal Blue', 'Green'],
  'Polyester Mesh',
  140,
  '100% Polyester',
  0,
  'Dhaka, Bangladesh',
  'approved',
  90,
  false,
  780,
  28,
  4.6,
  NOW() - INTERVAL '6 days',
  NOW(),
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- Product 6: Crew Neck Sweatshirts (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Sweatshirts',
  'Classic Crewneck Sweatshirts - Stock',
  'Soft fleece crewneck sweatshirts. Comfortable and warm. Ideal for screen printing and embroidery. Available for immediate shipping.',
  'Sweatshirts',
  'Casual',
  15.00,
  2500,
  50,
  'pieces',
  ARRAY['S', 'M', 'L', 'XL', '2XL'],
  ARRAY['Black', 'Gray', 'Navy', 'White'],
  'Cotton Fleece',
  280,
  '80% Cotton, 20% Polyester',
  0,
  'Dhaka, Bangladesh',
  'approved',
  87,
  false,
  520,
  15,
  4.5,
  NOW() - INTERVAL '4 days',
  NOW(),
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);

-- Product 7: Basic Long Sleeve Tees (Ready Stock)
INSERT INTO marketplace_products (
  id, supplier_id, product_type, title, description, category, subcategory,
  base_price, available_quantity, moq, unit,
  sizes, colors, material, gsm, fabric_composition,
  lead_time_days, shipping_from, status, quality_score,
  is_featured, views, sales, rating,
  created_at, updated_at, published_at, approval_date
)
VALUES (
  gen_random_uuid(),
  '7d52fff8-1992-4994-9817-296e7da7e27b'::uuid,
  'Long Sleeve Tees',
  'Cotton Long Sleeve T-Shirts - Available',
  'Classic long sleeve t-shirts in premium cotton. Perfect for cooler weather, layering, and custom printing. Multiple sizes in stock.',
  'T-Shirts',
  'Basics',
  8.90,
  3000,
  100,
  'pieces',
  ARRAY['S', 'M', 'L', 'XL', '2XL'],
  ARRAY['White', 'Black', 'Gray', 'Navy'],
  'Combed Cotton',
  180,
  '100% Cotton',
  0,
  'Dhaka, Bangladesh',
  'approved',
  89,
  false,
  610,
  22,
  4.5,
  NOW() - INTERVAL '2 days',
  NOW(),
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);

-- =====================================================
-- SUMMARY
-- =====================================================
-- Added 7 ready-stock marketplace products
-- All approved and ready for immediate purchase
-- Supplier: Ahmed Hassan (Dhaka Knitwear - Wholesale)
-- Total Available Quantity: 21,500 pieces
-- Price Range: $3.25 - $18.50
-- All with 0 lead time (immediate shipping)
-- =====================================================
