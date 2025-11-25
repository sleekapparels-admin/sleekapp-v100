-- Security Fix: Restrict social_shares table to service role only
-- Remove the overly permissive "Anyone can create shares" policy

DROP POLICY IF EXISTS "Anyone can create shares" ON public.social_shares;

-- Add ip_address column for rate limiting if it doesn't exist
ALTER TABLE public.social_shares 
ADD COLUMN IF NOT EXISTS ip_address text;

-- Add user_id column to email_verification_otps for efficient user lookup
ALTER TABLE public.email_verification_otps
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_user_id 
ON public.email_verification_otps(user_id);

-- Service role can manage social shares (for edge function)
CREATE POLICY "Service role can manage social shares"
ON public.social_shares
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow users to view share counts (read-only for analytics)
CREATE POLICY "Anyone can view social shares"
ON public.social_shares
FOR SELECT
USING (true);
