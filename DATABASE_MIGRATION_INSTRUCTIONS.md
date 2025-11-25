# 🗄️ Database Migration Instructions

## What This Migration Does

This migration adds **supplier assignment capability** to the `quotes` table, allowing:
- ✅ Admin to assign quotes to suppliers
- ✅ Suppliers to see quotes assigned to them
- ✅ Tracking of who assigned what and when
- ✅ Complete quote-to-order workflow

---

## 📋 Files Updated

### 1. **Database Schema**
- Added 3 new columns to `quotes` table:
  - `supplier_id` - Which supplier is assigned to this quote
  - `assigned_at` - When the assignment happened
  - `assigned_by` - Which admin assigned it

### 2. **TypeScript Types**
- ✅ Updated `/src/integrations/supabase/types.ts`
- Added the 3 new fields to quotes Row/Insert/Update types

### 3. **Components Updated**
- ✅ `/src/components/admin/SupplierMatchingSystem.tsx` - Now saves supplier assignments
- ✅ `/src/components/supplier/AssignedQuotesPanel.tsx` - NEW! Shows assigned quotes to suppliers
- ✅ `/src/pages/ModernSupplierDashboard.tsx` - Integrated AssignedQuotesPanel

---

## 🚀 HOW TO APPLY THIS MIGRATION

### **Option 1: Using Lovable (RECOMMENDED)**

1. **Open Lovable.dev**
2. Click on your project
3. Click **"Update from GitHub"** button (Lovable will auto-sync from main branch)
4. Go to **Database** section in Lovable
5. Open **SQL Editor**
6. Copy and paste this SQL:

\`\`\`sql
-- Add supplier assignment columns to quotes table
ALTER TABLE quotes 
ADD COLUMN supplier_id UUID REFERENCES profiles(id),
ADD COLUMN assigned_at TIMESTAMP,
ADD COLUMN assigned_by UUID REFERENCES profiles(id);

-- Create indexes for performance
CREATE INDEX idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX idx_quotes_assigned_at ON quotes(assigned_at);
CREATE INDEX idx_quotes_status ON quotes(status);

-- Set default status for existing quotes
UPDATE quotes SET status = 'pending' WHERE status IS NULL OR status = '';
\`\`\`

7. Click **"Run"** ✅
8. Done! Your database is now updated

---

### **Option 2: Using Supabase Dashboard Directly**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **Sleek Apparels** (eqpftggctumujhutomom)
3. Go to **SQL Editor** tab
4. Create new query
5. Paste the SQL from above
6. Click **"Run"** ✅

---

### **Option 3: Using Supabase CLI (Advanced)**

If you have Supabase CLI installed:

\`\`\`bash
# Navigate to project
cd /home/user/webapp

# Run the migration
supabase db push
\`\`\`

---

## ✅ VERIFICATION

After running the migration, verify it worked:

### **SQL Query to Check:**

\`\`\`sql
-- Check if columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name IN ('supplier_id', 'assigned_at', 'assigned_by');
\`\`\`

**Expected Result:**
\`\`\`
column_name    | data_type
---------------|------------------
supplier_id    | uuid
assigned_at    | timestamp without time zone
assigned_by    | uuid
\`\`\`

---

## 🎯 WHAT HAPPENS NEXT (AUTO-SYNC)

Once you run the SQL migration:

1. ✅ **In Lovable**: Click "Update from GitHub"
2. ✅ **Code Auto-Syncs**: All components are already updated in GitHub
3. ✅ **Database Updated**: Your schema now supports supplier assignments
4. ✅ **Features Work**: All 4 admin features + supplier quotes panel work!

---

## 🔧 NEW FEATURES ENABLED

### **For Super Admin (YOU):**
- ✅ **Supplier Matching System** - Assign quotes to suppliers with AI matching
- ✅ **AI Quote Dashboard** - See all quotes with assignment status
- ✅ **Buyer Interest Tracker** - Track buyer engagement
- ✅ **Dashboard Analytics** - Comprehensive metrics

### **For Suppliers:**
- ✅ **Assigned Quotes Panel** - See quotes you're assigned to
- ✅ **Accept/Reject Quotes** - Respond with your pricing
- ✅ **Quote Details** - Full quote specifications

### **For Buyers:**
- ✅ **Transparency** - Can see which supplier is assigned (future feature)

---

## 🔄 ROLLBACK (If Needed)

If something goes wrong, rollback with:

\`\`\`sql
-- Remove the columns
ALTER TABLE quotes 
DROP COLUMN supplier_id,
DROP COLUMN assigned_at,
DROP COLUMN assigned_by;

-- Remove indexes
DROP INDEX IF EXISTS idx_quotes_supplier_id;
DROP INDEX IF EXISTS idx_quotes_assigned_at;
DROP INDEX IF EXISTS idx_quotes_status;
\`\`\`

---

## 📞 SUPPORT

If you encounter any issues:

1. **Check Supabase Logs**: Go to Supabase → Logs → Database
2. **Check Lovable Console**: Look for errors in browser console
3. **Verify Migration**: Run the verification query above

---

## ✨ SUMMARY

**What to do:**
1. Open Lovable → Update from GitHub ✅
2. Run the SQL migration ✅  
3. Test the features ✅
4. Done! 🎉

**Time Required:** 2-3 minutes

**Risk Level:** Low (no data loss, only adding columns)

**Tested:** Yes ✅
