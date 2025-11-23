-- ========================================
-- SLEEK APPARELS - CLEANUP SAMPLE DATA
-- ========================================
-- This script removes all test/sample data from the database
-- Run this when you're ready to remove sample data
-- CAUTION: This will delete all records with @test.sleekapp.com emails
-- ========================================

-- Start transaction for safety
BEGIN;

-- ========================================
-- DELETE SAMPLE DATA IN CORRECT ORDER
-- (respecting foreign key constraints)
-- ========================================

-- 1. Delete analytics events (no dependencies)
DELETE FROM public.analytics_events 
WHERE metadata::text LIKE '%test.sleekapp.com%' 
OR user_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 2. Delete lead captures
DELETE FROM public.lead_captures 
WHERE email LIKE '%@test.sleekapp.com';

-- 3. Delete blog comments (if any exist for test users)
DELETE FROM public.blog_comments 
WHERE author_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 4. Delete blog posts created by test admin
DELETE FROM public.blog_posts 
WHERE author_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 5. Delete blog categories (sample categories)
DELETE FROM public.blog_categories 
WHERE slug IN ('industry-insights', 'sourcing-tips', 'sustainability', 'technology');

-- 6. Delete order-related tables
DELETE FROM public.order_documents 
WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.order_messages 
WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.order_status_history 
WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.order_updates 
WHERE order_id IN (
  SELECT id FROM public.orders WHERE buyer_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.orders 
WHERE buyer_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 7. Delete marketplace product-related tables
DELETE FROM marketplace_products 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

-- 8. Delete products
DELETE FROM public.products 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

-- 9. Delete supplier-related tables
DELETE FROM public.supplier_certifications 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.supplier_capabilities 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.supplier_performance 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.supplier_ratings 
WHERE supplier_id IN (
  SELECT id FROM public.suppliers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
  )
);

DELETE FROM public.suppliers 
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 10. Delete user roles
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email LIKE '%@test.sleekapp.com'
);

-- 11. Delete profiles
DELETE FROM public.profiles 
WHERE email LIKE '%@test.sleekapp.com';

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SAMPLE DATA CLEANUP COMPLETED!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'All sample data with @test.sleekapp.com has been removed';
  RAISE NOTICE '';
  RAISE NOTICE 'NOTE: You still need to manually delete test users from';
  RAISE NOTICE 'Supabase Auth dashboard (Authentication > Users)';
  RAISE NOTICE '==============================================';
END $$;

-- Commit the transaction
COMMIT;

-- If something goes wrong, you can ROLLBACK instead of COMMIT
