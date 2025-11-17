-- Fix search_path in database functions for security compliance
-- This ensures all functions operate within the public schema explicitly

-- Update update_production_batches_updated_at
CREATE OR REPLACE FUNCTION public.update_production_batches_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Update update_blog_post_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update create_update_notification
CREATE OR REPLACE FUNCTION public.create_update_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Notify the buyer
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT 
    orders.buyer_id,
    'Production Update: Order #' || orders.order_number,
    'New update at stage: ' || NEW.stage,
    'order_update',
    '/orders/' || NEW.order_id
  FROM public.orders
  WHERE orders.id = NEW.order_id;
  
  RETURN NEW;
END;
$function$;

-- Update update_production_stage_status
CREATE OR REPLACE FUNCTION public.update_production_stage_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
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