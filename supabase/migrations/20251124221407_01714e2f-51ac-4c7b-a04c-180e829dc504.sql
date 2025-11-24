-- Fix validate_message_recipient function to use profiles table instead of auth.users
-- This resolves "permission denied for table users" errors

CREATE OR REPLACE FUNCTION public.validate_message_recipient()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if recipient exists in profiles table (not auth.users)
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.recipient_id
  ) THEN
    RAISE EXCEPTION 'Invalid recipient';
  END IF;
  
  RETURN NEW;
END;
$function$;