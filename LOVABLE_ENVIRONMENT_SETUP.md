# 🔐 Lovable Cloud Environment Variables - Complete Setup Guide

**CRITICAL:** Verify and update these environment variables in Lovable Cloud to ensure your app works correctly after all the cleanup changes.

---

## 📋 **Required Environment Variables in Lovable Cloud**

### **1. Supabase Backend (CRITICAL - MANAGED BY LOVABLE)**

These are automatically set by Lovable Cloud. **DO NOT change these values manually** - they are managed by Lovable.

| Variable | Value | Status | Notes |
|----------|-------|--------|-------|
| `VITE_SUPABASE_URL` | `https://eqpftggctumujhutomom.supabase.co` | ✅ Auto-managed | Lovable sets this automatically |
| `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT token) | ✅ Auto-managed | Lovable sets this automatically |

**⚠️ IMPORTANT:** 
- Lovable Cloud **automatically provides** these values
- The fallback values in `vite.config.ts` match your project
- **You should NOT need to set these manually** in Lovable

---

### **2. Optional Services (SET MANUALLY IF USED)**

| Variable | Required? | Purpose | Where to Get It |
|----------|-----------|---------|----------------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional | Payment processing | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `GITHUB_API_KEY` | Optional | GitHub search feature (backend only) | [GitHub Settings](https://github.com/settings/tokens) |

---

## 🔍 **How to Verify Environment Variables in Lovable Cloud**

### **Step 1: Access Lovable Dashboard**
1. Go to [Lovable Cloud Dashboard](https://lovable.dev/)
2. Select your project: **sleekapp-v100**

### **Step 2: Check Environment Variables**
1. Click on **"Settings"** or **"Environment Variables"**
2. Look for the section with environment configuration
3. Verify the following:

---

## ✅ **Environment Variables Checklist**

Copy this checklist and verify each item in Lovable Cloud:

### **Backend Configuration (Auto-Managed by Lovable)**

- [ ] **VITE_SUPABASE_URL** exists and equals `https://eqpftggctumujhutomom.supabase.co`
  - If missing: Lovable should auto-populate this
  - If wrong: **Contact Lovable Support** (this is managed by them)

- [ ] **VITE_SUPABASE_ANON_KEY** or **VITE_SUPABASE_PUBLISHABLE_KEY** exists
  - Should be a long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Should contain `"ref":"eqpftggctumujhutomom"` when decoded
  - If missing: Lovable should auto-populate this
  - If wrong: **Contact Lovable Support**

### **Optional Services (Only if You're Using Them)**

- [ ] **VITE_STRIPE_PUBLISHABLE_KEY** (if you want payment features)
  - Get from: https://dashboard.stripe.com/apikeys
  - Should start with `pk_test_` (test) or `pk_live_` (production)
  - Leave empty if not using Stripe

- [ ] **GITHUB_API_KEY** (only needed for backend GitHub search)
  - Get from: https://github.com/settings/tokens
  - Only needed if you want the GitHub search feature to work
  - Can be left empty (feature will use rate-limited public API)

---

## 🚨 **What to Do If Environment Variables Are Wrong**

### **Scenario 1: Supabase Variables Missing or Wrong**

**Symptoms:**
- App fails to load
- Console errors: "Missing required environment variable: VITE_SUPABASE_URL"
- Authentication doesn't work
- Database queries fail

**Solution:**
1. **Check Lovable Dashboard** - these should be auto-populated
2. **If missing:** Lovable should detect your `supabase/config.toml` file (project_id = "eqpftggctumujhutomom")
3. **If still wrong:** Contact Lovable Support - this is managed by their platform

**DO NOT manually set these** - Lovable manages them based on your project configuration.

---

### **Scenario 2: Stripe Key Missing (But You Want Payments)**

**Symptoms:**
- Payment checkout page shows errors
- Stripe elements don't load

**Solution:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (starts with `pk_`)
3. In Lovable Dashboard → Environment Variables:
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: Your publishable key
4. Redeploy the app

---

### **Scenario 3: All Variables Look Correct But App Still Breaks**

**Symptoms:**
- Environment variables are set correctly
- App still shows errors or doesn't connect to backend

**Solution:**
1. **Clear Lovable Build Cache:**
   - In Lovable Dashboard, look for "Clear Cache" or "Rebuild"
   - Force a fresh deployment

2. **Check Browser Console:**
   - Open your deployed app
   - Press F12 to open DevTools
   - Look for errors in Console tab
   - Look for specific error messages

3. **Verify Fallback Values:**
   - Your `vite.config.ts` has fallback values
   - These match your project: `eqpftggctumujhutomom`
   - If Lovable doesn't set env vars, fallbacks will be used

---

## 🎯 **Expected Behavior After Deployment**

### **When Everything is Correct:**

1. ✅ App loads without errors
2. ✅ Console shows: `✅ Environment variables validated successfully`
3. ✅ Users can sign up/sign in
4. ✅ Database queries work
5. ✅ Edge functions are accessible
6. ✅ Custom domain works (if configured)

### **When Something is Wrong:**

❌ App shows blank screen or error page  
❌ Console shows: `Environment validation failed`  
❌ Authentication doesn't work  
❌ Database operations fail  

---

## 📝 **Quick Reference: Where to Find Things**

### **In Lovable Cloud:**
- **Dashboard:** https://lovable.dev/
- **Environment Variables:** Settings → Environment
- **Deployment Logs:** Deployments → View Logs
- **Database:** Managed by Lovable's Supabase instance

### **In Your Codebase:**
- **Environment Validator:** `src/lib/env-validator.ts`
- **Fallback Config:** `vite.config.ts` lines 81-84
- **Supabase Client:** `src/integrations/supabase/client.ts`
- **Project Config:** `supabase/config.toml`

### **External Services:**
- **Stripe Dashboard:** https://dashboard.stripe.com/
- **GitHub Tokens:** https://github.com/settings/tokens

---

## 🔄 **Step-by-Step: After Lovable Syncs Your Latest Commit**

1. **Lovable detects your commit:** "chore: comprehensive codebase cleanup..."
2. **Lovable builds the app** using environment variables
3. **Check deployment logs** in Lovable for any errors
4. **If successful:** Your app is live with clean codebase
5. **If failed:** Check error logs and verify environment variables

---

## ⚠️ **Common Issues & Quick Fixes**

### **Issue 1: "Missing required environment variable: VITE_SUPABASE_URL"**
**Fix:** Lovable should auto-set this. If not, check if `supabase/config.toml` is committed (it is ✅)

### **Issue 2: "Invalid URL format for VITE_SUPABASE_URL"**
**Fix:** URL should be exactly: `https://eqpftggctumujhutomom.supabase.co`

### **Issue 3: Stripe elements don't load**
**Fix:** Set `VITE_STRIPE_PUBLISHABLE_KEY` in Lovable or leave payments disabled

### **Issue 4: "Authentication failed"**
**Fix:** Check that `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY` is set by Lovable

---

## ✅ **Final Verification Checklist**

Before considering the deployment complete:

- [ ] Code is pushed to GitHub main branch ✅ (DONE)
- [ ] Lovable has detected the latest commit
- [ ] Deployment completed successfully in Lovable
- [ ] Open deployed app in browser
- [ ] Check browser console for errors (should show environment validation success)
- [ ] Test sign up/sign in functionality
- [ ] Test a simple database query (e.g., view products)
- [ ] Custom domain is working (if configured)
- [ ] No console errors related to environment variables

---

## 🆘 **Need Help?**

### **If Lovable Environment Variables Are Wrong:**
1. First, try redeploying - Lovable may auto-fix
2. Check Lovable documentation for environment setup
3. Contact Lovable Support if auto-managed variables are incorrect

### **If Optional Services (Stripe, etc.) Need Setup:**
1. Get API keys from respective services
2. Add them to Lovable Dashboard → Environment Variables
3. Redeploy the app

---

## 📊 **Current Configuration Status**

Your codebase is configured with:

- ✅ **Project ID:** `eqpftggctumujhutomom`
- ✅ **Backend URL:** `https://eqpftggctumujhutomom.supabase.co`
- ✅ **Fallback values in vite.config.ts:** Matching your project
- ✅ **Environment validator:** Will catch any issues at startup
- ✅ **All Firebase removed:** No conflicts
- ✅ **All tests passing:** Code is production-ready

**Your app will work as long as Lovable provides the correct environment variables (which they should automatically).**

---

**Last Updated:** After comprehensive codebase cleanup (Commit: d7f9892)  
**Status:** Ready for Lovable Cloud deployment ✅
