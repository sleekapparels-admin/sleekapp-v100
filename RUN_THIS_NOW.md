# ✅ RUN THIS NOW - seed_SIMPLE.sql

## 🎯 WHAT HAPPENED

Your `products` table has a different structure than expected:
- ❌ No `supplier_id` column
- ✅ Has `title` instead of `name`
- ✅ Has `image_url`, `category`, etc.

So I created a **simpler seed** that matches your actual schema!

---

## 🚀 RUN THIS FILE NOW

**File**: `/home/user/webapp/supabase/seed_SIMPLE.sql` ⭐

**This file:**
- ✅ Matches your actual table structure
- ✅ Only 3 users (Sarah, Ahmed, Admin)
- ✅ Cleans old data automatically
- ✅ Adds 1 sample product
- ✅ Super simple - only ~80 lines

---

## 📋 STEPS:

1. Go to SQL Editor
2. Click **"New Query"**
3. Open: `/home/user/webapp/supabase/seed_SIMPLE.sql`
4. Copy **ENTIRE FILE** (Ctrl+A, Ctrl+C)
5. Paste in SQL Editor (Ctrl+V)
6. Click **"Run"**

**Expected result:**
```
Success. No rows returned
```

---

## ✅ VERIFY IT WORKED

Run this:
```sql
SELECT id, full_name, company_name FROM public.profiles;
```

**Should see:**
- Sarah Johnson - Urban Fashion Co
- Ahmed Hassan - Dhaka Knitwear Ltd
- Admin User - Sleek Apparels Platform

---

## 🧪 THEN TEST LOGIN

```
Email: sarah.johnson@test.sleekapp.com
Password: TestPassword123!
```

**If you can login → YOU'RE DONE!** 🎉

---

## 💬 WHY THIS WILL WORK

This seed file:
1. ✅ Doesn't reference `supplier_id` (doesn't exist in your schema)
2. ✅ Uses `title` for products (matches your schema)
3. ✅ Only inserts into tables that exist
4. ✅ Super minimal - just the essentials

**This WILL work!** 🚀

Go run it now!
