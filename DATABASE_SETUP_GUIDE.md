# 🗄️ DATABASE SETUP GUIDE - COMPLETE INSTRUCTIONS

## ❌ ERROR YOU ENCOUNTERED

```
Error: Failed to run sql query: ERROR: 42P01: relation "public.profiles" does not exist
```

**Root Cause**: The database tables haven't been created yet. You tried to insert data into tables that don't exist.

**Solution**: Run the schema migrations FIRST, then seed data.

---

## ✅ CORRECT 2-STEP PROCESS

### **STEP 1: Create Database Schema (Run Migrations)**
### **STEP 2: Populate Sample Data (Run Seed)**

---

## 🚀 STEP 1: CREATE DATABASE SCHEMA

### What You Need to Run:
**File**: `/home/user/webapp/supabase/COMPLETE_SETUP.sql`  
**Size**: 8,117 lines  
**Purpose**: Creates ALL database tables, functions, policies, storage buckets

### How to Run:

1. **Open Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/xcafrsphhnlssuzuatuo
   ```

2. **Navigate to SQL Editor**:
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy the Complete Setup Script**:
   - Open file: `/home/user/webapp/supabase/COMPLETE_SETUP.sql`
   - Select ALL (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

4. **Paste and Run**:
   - Paste into SQL Editor (Ctrl+V or Cmd+V)
   - Click "Run" button or press Ctrl+Enter
   - **Wait**: This may take 30-60 seconds to complete

5. **Expected Result**:
   ```
   Success. No rows returned
   ```
   
   OR you might see multiple success messages for each part of the migration.

### What This Creates:

#### **Custom Types (Enums)**:
- `app_role`: retailer, wholesaler, educational, corporate, sports_team, factory, admin, supplier
- `order_workflow_status`: quote_requested, quote_sent, admin_review, awaiting_payment, payment_received, assigned_to_supplier, sample_requested, sample_submitted, sample_approved, bulk_production, qc_inspection, ready_to_ship, shipped, delivered, completed, cancelled, on_hold
- `production_stage`: yarn_received, knitting, linking, washing_finishing, final_qc, packing, ready_to_ship
- `supplier_tier`: bronze, silver, gold
- `verification_status`: pending, verified, rejected

#### **Core Tables**:
- ✅ `profiles` - User profiles (links to auth.users)
- ✅ `buyer_profiles` - Buyer-specific data
- ✅ `supplier_profiles` - Supplier-specific data
- ✅ `products` - Product catalog
- ✅ `orders` - Order management
- ✅ `order_timeline` - Order status history
- ✅ `messages` - Communication between buyers/suppliers
- ✅ `supplier_certifications` - Quality certifications
- ✅ `supplier_production_capacity` - Capacity tracking
- ✅ `product_specifications` - Detailed product specs
- ✅ `sample_requests` - Sample request tracking
- ✅ `quality_reports` - QC inspection reports
- ✅ `shipments` - Shipping/logistics
- ✅ `payments` - Payment processing
- ✅ `reviews` - Supplier reviews/ratings
- ✅ `analytics_events` - User behavior tracking
- ✅ `lead_captures` - Marketing lead capture

#### **Marketplace Tables**:
- ✅ `marketplace_listings` - Public product listings
- ✅ `marketplace_categories` - Product categories
- ✅ `marketplace_inquiries` - Buyer inquiries

#### **Blog Tables**:
- ✅ `blog_posts` - Blog content
- ✅ `blog_categories` - Blog categorization
- ✅ `blog_tags` - Post tags
- ✅ `blog_post_tags` - Tag relationships

#### **Storage Buckets**:
- ✅ `product-images` - Product photos
- ✅ `certifications` - Certification documents
- ✅ `quality-reports` - QC documents
- ✅ `avatars` - User profile pictures

#### **Functions & Triggers**:
- ✅ `handle_new_user()` - Auto-create profile on signup
- ✅ `update_updated_at_column()` - Auto-update timestamps
- ✅ Row Level Security (RLS) policies for all tables

---

## 🌱 STEP 2: POPULATE SAMPLE DATA

### What You Need to Run:
**File**: `/home/user/webapp/supabase/seed_READY_TO_RUN.sql`  
**Size**: 40,936 characters  
**Purpose**: Inserts sample data for testing

### How to Run:

1. **Still in SQL Editor**:
   - Click "New Query" (start fresh)

2. **Copy the Seed Script**:
   - Open file: `/home/user/webapp/supabase/seed_READY_TO_RUN.sql`
   - Select ALL (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

3. **Paste and Run**:
   - Paste into SQL Editor (Ctrl+V or Cmd+V)
   - Click "Run" button or press Ctrl+Enter
   - **Wait**: This takes 5-10 seconds

4. **Expected Result**:
   ```
   Success. No rows returned
   ```

### What This Inserts:

#### **User Profiles (10 total)**:
**BUYERS (5)**:
1. Sarah Johnson - Urban Fashion Co (Retailer) - `76aca2d5-4649-4a98-bca2-2274c2527a3a`
2. Michael Chen - Green Valley High School (Educational)
3. Emily Rodriguez - TechCorp Inc (Corporate)
4. James Williams - City United FC (Sports Team)
5. Lisa Anderson - Wholesale Apparel Distributors (Wholesaler)

**SUPPLIERS (5)**:
6. Ahmed Hassan - Dhaka Knitwear Ltd - `7d52fff8-1992-4994-9817-296e7da7e27b`
7. Maria Santos - Performance Activewear Co
8. Rajesh Kumar - Precision Uniforms Ltd
9. Li Wei - Global Fabric Mills
10. Carlos Mendez - Premium Trims International

**ADMIN (1)**:
11. Admin User - Sleek Apparels Platform - `441f2e49-44fb-48c6-9dc4-cbf1929677e1`

#### **Sample Data Counts**:
- ✅ 20 Products (T-Shirts, Hoodies, Activewear, Uniforms, etc.)
- ✅ 7 Marketplace Listings (Live products from verified suppliers)
- ✅ 5 Orders (Showing various workflow stages)
- ✅ 6 Supplier Certifications (WRAP, OEKO-TEX, GOTS, BSCI, ISO)
- ✅ 4 Blog Posts (Full markdown content)
- ✅ Analytics Events (Page views, clicks, conversions)
- ✅ Lead Captures (Marketing form submissions)

---

## ✅ VERIFICATION STEPS

After running BOTH scripts, verify the setup:

### Check Tables Exist:

1. **Go to Table Editor** (left sidebar)
2. **You should see all these tables**:
   - profiles
   - buyer_profiles
   - supplier_profiles
   - products
   - orders
   - marketplace_listings
   - blog_posts
   - supplier_certifications
   - And many more...

### Check Row Counts:

Click on each table and verify row counts:
- ✅ `profiles`: **10 rows**
- ✅ `buyer_profiles`: **5 rows**
- ✅ `supplier_profiles`: **5 rows**
- ✅ `products`: **20 rows**
- ✅ `marketplace_listings`: **7 rows**
- ✅ `orders`: **5 rows**
- ✅ `supplier_certifications`: **6 rows**
- ✅ `blog_posts`: **4 rows**

### Check Authentication:

1. **Go to Authentication** → **Users** (left sidebar)
2. **You should see 3 users**:
   - sarah.johnson@test.sleekapp.com
   - ahmed.hassan@test.sleekapp.com
   - admin@test.sleekapp.com

---

## 🧪 STEP 3: TEST LOGIN

After both scripts run successfully:

### Test Buyer Login:
```
Email: sarah.johnson@test.sleekapp.com
Password: TestPassword123!
```

**What to check**:
- [ ] Login successful
- [ ] Profile shows "Urban Fashion Co"
- [ ] Dashboard displays properly
- [ ] Can see orders
- [ ] Can browse marketplace

### Test Supplier Login:
```
Email: ahmed.hassan@test.sleekapp.com
Password: TestPassword123!
```

**What to check**:
- [ ] Login successful
- [ ] Profile shows "Dhaka Knitwear Ltd"
- [ ] Supplier dashboard displays
- [ ] Can see portfolio (4 products)
- [ ] Can view certifications

### Test Admin Login:
```
Email: admin@test.sleekapp.com
Password: TestPassword123!
```

**What to check**:
- [ ] Login successful
- [ ] Admin dashboard accessible
- [ ] Can view all users
- [ ] Can see all orders
- [ ] Analytics data visible

---

## 🚨 TROUBLESHOOTING

### If STEP 1 Fails:

**Error: "already exists"**
- **Meaning**: Some tables already exist
- **Solution**: Either:
  1. Drop existing tables first (dangerous - you'll lose data)
  2. Or skip to STEP 2 if tables already exist

**Error: Timeout**
- **Meaning**: Script too large
- **Solution**: Run migrations individually from `/supabase/migrations/` folder

**Error: Permission denied**
- **Meaning**: Wrong project or insufficient permissions
- **Solution**: Verify you're in project `xcafrsphhnlssuzuatuo` and have owner access

### If STEP 2 Fails:

**Error: "relation does not exist"**
- **Meaning**: STEP 1 didn't complete successfully
- **Solution**: Run COMPLETE_SETUP.sql again

**Error: "duplicate key value violates unique constraint"**
- **Meaning**: Data already inserted
- **Solution**: This is OK! It means data is already there

**Error: "foreign key violation"**
- **Meaning**: Auth users don't exist
- **Solution**: Make sure you created the 3 Auth users with correct UUIDs:
  - Sarah: `76aca2d5-4649-4a98-bca2-2274c2527a3a`
  - Ahmed: `7d52fff8-1992-4994-9817-296e7da7e27b`
  - Admin: `441f2e49-44fb-48c6-9dc4-cbf1929677e1`

---

## 📋 QUICK CHECKLIST

### Before You Start:
- [ ] Have access to Supabase dashboard
- [ ] Project ID is `xcafrsphhnlssuzuatuo`
- [ ] Created 3 Auth users with correct passwords
- [ ] Have both SQL files ready to copy

### Execution Order:
1. [ ] Run `COMPLETE_SETUP.sql` (creates schema)
2. [ ] Wait for success message
3. [ ] Verify tables exist in Table Editor
4. [ ] Run `seed_READY_TO_RUN.sql` (inserts data)
5. [ ] Wait for success message
6. [ ] Verify row counts in Table Editor
7. [ ] Test login with Sarah's credentials
8. [ ] Test login with Ahmed's credentials
9. [ ] Test login with Admin credentials
10. [ ] Report back on findings!

---

## 🎯 SUMMARY

**ORDER MATTERS:**

1. **First**: `COMPLETE_SETUP.sql` → Creates database structure
2. **Then**: `seed_READY_TO_RUN.sql` → Fills with sample data
3. **Finally**: Test by logging in as different users

**Files to Use:**
- ✅ `/home/user/webapp/supabase/COMPLETE_SETUP.sql` (8,117 lines)
- ✅ `/home/user/webapp/supabase/seed_READY_TO_RUN.sql` (40,936 chars)

**Expected Time:**
- STEP 1: 30-60 seconds
- STEP 2: 5-10 seconds
- Total: Less than 2 minutes

---

## 💬 AFTER SUCCESSFUL SETUP

Once both scripts run successfully and you verify row counts, try logging in and report back:

1. ✅ What works perfectly
2. 🔧 What needs fixing
3. ❓ What's missing
4. 🚨 Priority issues
5. 💡 Improvement ideas

Good luck! You're very close now! 🚀
