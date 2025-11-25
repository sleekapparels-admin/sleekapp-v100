-- =====================================================
-- COPY AND PASTE THIS INTO LOVABLE'S SQL EDITOR
-- =====================================================
-- This adds supplier assignment capability to quotes
-- =====================================================

-- Step 1: Add new columns to quotes table
ALTER TABLE quotes 
ADD COLUMN supplier_id UUID REFERENCES profiles(id),
ADD COLUMN assigned_at TIMESTAMP,
ADD COLUMN assigned_by UUID REFERENCES profiles(id);

-- Step 2: Create indexes for performance
CREATE INDEX idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX idx_quotes_assigned_at ON quotes(assigned_at);
CREATE INDEX idx_quotes_status ON quotes(status);

-- Step 3: Set default status for existing quotes
UPDATE quotes SET status = 'pending' WHERE status IS NULL OR status = '';

-- Done! ✅
SELECT 'Migration completed successfully!' AS message;
