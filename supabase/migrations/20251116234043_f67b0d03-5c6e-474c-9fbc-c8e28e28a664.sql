-- SECURITY FIX: Add SET search_path = public to all SECURITY DEFINER functions
-- This prevents privilege escalation attacks via search path manipulation

-- Fix update_production_batches_updated_at
CREATE OR REPLACE FUNCTION public.update_production_batches_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix update_blog_post_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_production_stage_status
CREATE OR REPLACE FUNCTION public.update_production_stage_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set started_at when first update
  IF OLD.completion_percentage = 0 AND NEW.completion_percentage > 0 AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
    NEW.status = 'in_progress';
  END IF;
  
  -- Auto-set completed_at when 100%
  IF NEW.completion_percentage = 100 AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix products_search_trigger
CREATE OR REPLACE FUNCTION public.products_search_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$function$;

-- Fix increment_blog_post_shares
CREATE OR REPLACE FUNCTION public.increment_blog_post_shares(post_id_param uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.blog_posts
  SET shares_count = shares_count + 1
  WHERE id = post_id_param;
END;
$function$;

-- Fix increment_blog_post_views
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id_param uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE id = post_id_param;
END;
$function$;