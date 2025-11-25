-- Migration: Add supplier assignment fields to quotes table
-- Purpose: Allow admins to assign suppliers to quotes and track assignment history
-- Date: 2025-11-24

-- Add supplier assignment columns to quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for faster supplier quote lookups
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_assigned_at ON quotes(assigned_at);

-- Add comment for documentation
COMMENT ON COLUMN quotes.supplier_id IS 'The supplier assigned to fulfill this quote by the admin';
COMMENT ON COLUMN quotes.assigned_at IS 'Timestamp when the supplier was assigned to this quote';
COMMENT ON COLUMN quotes.assigned_by IS 'Admin user who assigned the supplier to this quote';

-- Update existing quotes to have 'pending' status if they don't have a status
UPDATE quotes SET status = 'pending' WHERE status IS NULL OR status = '';

-- Add status index for faster filtering
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Success message
SELECT 'Migration completed successfully: supplier assignment fields added to quotes table' AS status;
