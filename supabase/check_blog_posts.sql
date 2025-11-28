-- Blog Posts Database Inspection Script
-- This script verifies the blog_posts table structure and data

-- 1. Check if blog_posts table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'blog_posts'
) AS table_exists;

-- 2. Get table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- 3. Count total blog posts
SELECT COUNT(*) as total_posts FROM blog_posts;

-- 4. Count published blog posts
SELECT COUNT(*) as published_posts 
FROM blog_posts 
WHERE published = true;

-- 5. Get all published posts (basic info)
SELECT 
  id,
  title,
  slug,
  category,
  published,
  published_at,
  views_count,
  shares_count,
  created_at
FROM blog_posts
WHERE published = true
ORDER BY published_at DESC;

-- 6. Get all posts (including unpublished)
SELECT 
  id,
  title,
  slug,
  category,
  published,
  published_at,
  created_at
FROM blog_posts
ORDER BY created_at DESC;

-- 7. Check for any data integrity issues
SELECT 
  'Missing featured_image_url' as issue,
  COUNT(*) as count
FROM blog_posts
WHERE featured_image_url IS NULL OR featured_image_url = ''
UNION ALL
SELECT 
  'Missing excerpt' as issue,
  COUNT(*) as count
FROM blog_posts
WHERE excerpt IS NULL OR excerpt = ''
UNION ALL
SELECT 
  'Published without published_at' as issue,
  COUNT(*) as count
FROM blog_posts
WHERE published = true AND published_at IS NULL;

-- 8. Check RLS policies on blog_posts
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'blog_posts';

-- 9. Test a sample query (what the frontend uses)
SELECT 
  id, 
  title, 
  slug, 
  excerpt, 
  category, 
  published_at, 
  featured_image_url, 
  views_count, 
  shares_count
FROM blog_posts
WHERE published = true
ORDER BY published_at DESC
LIMIT 5;
