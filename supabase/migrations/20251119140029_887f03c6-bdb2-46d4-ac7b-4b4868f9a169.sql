-- Add email delivery tracking fields to email_verification_otps table
ALTER TABLE email_verification_otps 
ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'bounced', 'delivered')),
ADD COLUMN IF NOT EXISTS delivery_error TEXT;

-- Add indexes for querying by delivery status
CREATE INDEX IF NOT EXISTS idx_email_verification_delivery_status 
ON email_verification_otps(delivery_status, created_at);

-- Add index for Resend email ID lookups (webhook updates)
CREATE INDEX IF NOT EXISTS idx_email_verification_resend_id 
ON email_verification_otps(resend_email_id) 
WHERE resend_email_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN email_verification_otps.resend_email_id IS 'Resend API email ID for tracking delivery status';
COMMENT ON COLUMN email_verification_otps.email_sent_at IS 'Timestamp when email was successfully sent via Resend';
COMMENT ON COLUMN email_verification_otps.delivery_status IS 'Email delivery status: pending, sent, failed, bounced, delivered';
COMMENT ON COLUMN email_verification_otps.delivery_error IS 'Error message if email delivery failed';