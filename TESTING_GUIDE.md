# 🧪 Complete Testing Guide - Sleek Apparels

## 📋 Pre-Testing Setup

### ✅ Requirements:
- [x] Repository cloned
- [x] Dependencies installed
- [x] Development server running
- [ ] **Supabase ANON key configured** ⚠️

### 🔑 Configure Supabase Key (REQUIRED):

**Quick Method:**
```bash
./update-supabase-key.sh YOUR_ANON_KEY_HERE
```

**Manual Method:**
1. Get key from: https://supabase.com/dashboard/project/eqpftggctumujhutomom/settings/api
2. Edit `.env.local` file
3. Replace `your-anon-public-key-here` with actual key
4. Save file

---

## 🌐 Access Your Application

**Live URL:** https://8080-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai

---

## 🎯 Feature Testing Checklist

### 1. Homepage & Navigation
- [ ] Homepage loads without errors
- [ ] Navigation menu works
- [ ] All links are clickable
- [ ] Mobile menu works
- [ ] Footer loads properly
- [ ] Logo displays correctly

**Test URL:** `/`

---

### 2. AI Quote Generator ⭐ (Key Feature)
- [ ] Page loads correctly
- [ ] OTP verification works
- [ ] Product type selection available
- [ ] Quantity input accepts numbers
- [ ] Complexity level selector works
- [ ] Additional requirements text area works
- [ ] "Generate Quote" button responds
- [ ] Quote results display
- [ ] Quote can be downloaded/saved
- [ ] Historical quotes accessible

**Test URL:** `/quote-generator`

**Test Data:**
```
Product Type: T-Shirt
Quantity: 500
Complexity: Medium
Requirements: "100% cotton, custom logo printing"
```

**Expected Result:**
- Estimated price calculation
- Lead time prediction
- Material breakdown
- Manufacturing timeline

---

### 3. Production Tracking 🔄 (LoopTrace™)
- [ ] Login/authentication required
- [ ] Orders list displays
- [ ] Can select an order
- [ ] 8 production stages visible
- [ ] Stage timeline displays
- [ ] Progress percentages show
- [ ] Can update stage status (if supplier/admin)
- [ ] Photo upload works
- [ ] Notes can be added
- [ ] Real-time updates work
- [ ] Predictive delay alerts show (if applicable)
- [ ] Analytics dashboard displays

**Test URL:** `/production-tracking`

**Production Stages:**
1. ✅ Order Confirmation
2. 📦 Fabric Sourcing
3. 📦 Accessories Procurement
4. ✂️ Cutting & Pattern Making
5. 🧵 Sewing & Assembly
6. ✓ Quality Control
7. 📦 Finishing & Packaging
8. 🚚 Shipment & Delivery

**Role-Based Testing:**
- **Buyer:** Can view stages, message suppliers
- **Supplier:** Can update stages, upload photos
- **Admin:** Full access, all orders visible
- **Staff:** Operations access

---

### 4. User Authentication
- [ ] Registration page loads
- [ ] Can create new account
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Login page works
- [ ] Can log in with credentials
- [ ] Remember me option works
- [ ] Forgot password link works
- [ ] Logout functionality works
- [ ] Session persistence works

**Test URLs:**
- `/auth` (login/register)
- `/dashboard` (after login)

**Test Accounts to Create:**
```
Buyer Account:
  Email: buyer-test@example.com
  Password: Test1234!

Supplier Account:
  Email: supplier-test@example.com
  Password: Test1234!
```

---

### 5. Order Management
- [ ] Orders page loads
- [ ] Can view order list
- [ ] Order details accessible
- [ ] Order status displays correctly
- [ ] Can filter orders
- [ ] Can search orders
- [ ] Order tracking works
- [ ] Order history accessible

**Test URLs:**
- `/orders` (order list)
- `/orders/:orderId` (order details)
- `/buyer-order-tracking` (tracking)

---

### 6. Dashboard
- [ ] User dashboard loads
- [ ] Statistics display correctly
- [ ] Recent orders show
- [ ] Notifications visible
- [ ] Quick actions work
- [ ] Charts/graphs display (if applicable)

**Test URL:** `/dashboard`

---

### 7. Admin Features (Admin Access Required)
- [ ] Admin dashboard accessible
- [ ] Order management panel works
- [ ] User management available
- [ ] Analytics dashboard displays
- [ ] Supplier orders visible
- [ ] Quote management works
- [ ] Audit logs accessible
- [ ] Settings configurable

**Test URLs:**
- `/admin` (admin dashboard)
- `/admin/orders` (order management)
- `/admin/analytics` (analytics)
- `/admin-supplier-orders` (supplier coordination)

---

### 8. Supplier Features
- [ ] Supplier dashboard loads
- [ ] Assigned orders visible
- [ ] Can update production stages
- [ ] Can upload photos
- [ ] Can add notes
- [ ] Messaging system works
- [ ] Notifications display

**Test URL:** `/supplier-dashboard`

---

### 9. Product Catalog
- [ ] Products page loads
- [ ] Product cards display
- [ ] Product images show
- [ ] Product details accessible
- [ ] Filtering works
- [ ] Search functionality works
- [ ] Categories display

**Test URL:** `/products`

**Product Categories:**
- Knitwear
- Cut & Sew
- Uniforms & Teamwear
- Activewear
- Casualwear

---

### 10. Services & Info Pages
- [ ] Services page loads
- [ ] About page works
- [ ] Contact page loads
- [ ] Contact form works
- [ ] Form validation works
- [ ] Sustainability page loads
- [ ] LoopTrace technology page works
- [ ] Why Sleek Apparels page loads

**Test URLs:**
- `/services`
- `/about`
- `/contact`
- `/sustainability`
- `/looptrace-technology`
- `/why-sleek-apparels`

---

### 11. Supplier Directory
- [ ] Supplier directory loads
- [ ] Supplier profiles visible
- [ ] Supplier details accessible
- [ ] Can filter suppliers
- [ ] Supplier ratings show (if applicable)
- [ ] Contact supplier works

**Test URL:** `/supplier-directory`

---

### 12. Blog & Content
- [ ] Blog page loads
- [ ] Blog posts list displays
- [ ] Can read individual posts
- [ ] Comments work (if enabled)
- [ ] Categories/tags work
- [ ] Search functionality works

**Test URLs:**
- `/blog`
- `/blog/:slug` (individual post)

---

### 13. Wishlist
- [ ] Wishlist page loads
- [ ] Can add items to wishlist
- [ ] Can remove items
- [ ] Wishlist persists across sessions

**Test URL:** `/wishlist`

---

### 14. Profile & Settings
- [ ] User profile page loads
- [ ] Can view profile information
- [ ] Can edit profile
- [ ] Settings page accessible
- [ ] Can update settings
- [ ] Password change works
- [ ] Email preferences work

**Test URLs:**
- `/user-profile`
- `/user-settings`

---

## 🔍 Browser Console Testing

### Check for Errors:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - ❌ Red error messages
   - ⚠️ Yellow warning messages
   - Network failures

### Common Issues to Check:
- [ ] No Supabase connection errors
- [ ] No missing image errors
- [ ] No failed API calls
- [ ] No CORS errors
- [ ] No authentication errors

---

## 📊 Network Testing

### Check API Calls:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by: XHR or Fetch
4. Look for:
   - ✅ Status 200 (success)
   - ❌ Status 400/401/403/500 (errors)

### Expected API Endpoints:
- `https://eqpftggctumujhutomom.supabase.co/auth/*` (authentication)
- `https://eqpftggctumujhutomom.supabase.co/rest/*` (database)
- `https://eqpftggctumujhutomom.supabase.co/functions/*` (edge functions)

---

## 🎨 UI/UX Testing

### Visual Checks:
- [ ] All text is readable
- [ ] Colors are consistent
- [ ] Buttons have hover effects
- [ ] Images load properly
- [ ] Icons display correctly
- [ ] Animations work smoothly
- [ ] Loading states show
- [ ] Error messages are clear

### Responsive Design:
- [ ] Desktop view (1920x1080)
- [ ] Laptop view (1366x768)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)

**Test:** Resize browser window or use DevTools device emulation

---

## 🚀 Performance Testing

### Page Load Speed:
- [ ] Homepage loads < 3 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] Quote generator loads < 2 seconds
- [ ] Production tracking loads < 3 seconds

### Check with DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Check scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 80
   - SEO: > 90

---

## 🔐 Security Testing

### Authentication:
- [ ] Cannot access protected pages without login
- [ ] Redirects to login when needed
- [ ] Session expires appropriately
- [ ] Password is not visible in forms

### Authorization:
- [ ] Buyers cannot access admin pages
- [ ] Suppliers cannot see other suppliers' orders
- [ ] Admin has full access
- [ ] API calls include proper authentication

---

## 📝 Test Results Template

```markdown
## Test Session: [Date]

### Environment:
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Screen Size: [1920x1080]

### Tests Passed: X/Y
- ✅ Feature 1: Working
- ❌ Feature 2: Error - [description]
- ⚠️ Feature 3: Warning - [description]

### Issues Found:
1. [Issue description]
   - Severity: [High/Medium/Low]
   - Steps to reproduce: [steps]
   - Expected: [expected behavior]
   - Actual: [actual behavior]

### Notes:
[Additional observations]
```

---

## 🐛 Reporting Issues

### What to Include:
1. **Feature/Page:** Where did the error occur?
2. **Steps to Reproduce:** How to trigger the issue?
3. **Expected Behavior:** What should happen?
4. **Actual Behavior:** What actually happened?
5. **Browser Console:** Any error messages?
6. **Screenshots:** Visual evidence
7. **Environment:** Browser, OS, screen size

### Example Issue Report:
```
Title: Quote Generator - Submit button not responding

Description:
When clicking the "Generate Quote" button on the quote generator 
page, nothing happens. No loading state, no error message.

Steps to Reproduce:
1. Go to /quote-generator
2. Fill in all fields (Product: T-Shirt, Quantity: 500, etc.)
3. Click "Generate Quote" button
4. Nothing happens

Expected: Quote should be generated and displayed
Actual: Button click has no effect

Console Error:
"TypeError: Cannot read property 'anon' of undefined"

Browser: Chrome 120
OS: Windows 11
```

---

## 📊 Test Coverage Summary

### Critical Features:
- [ ] Quote Generator (AI)
- [ ] Production Tracking (LoopTrace™)
- [ ] User Authentication
- [ ] Order Management

### Important Features:
- [ ] Dashboard
- [ ] Admin Panel
- [ ] Supplier Features
- [ ] Product Catalog

### Nice-to-Have Features:
- [ ] Blog
- [ ] Wishlist
- [ ] Success Stories
- [ ] Contact Form

---

## ✅ Ready for Production Checklist

- [ ] All critical features tested
- [ ] No console errors
- [ ] All API calls successful
- [ ] Authentication working
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse > 80)
- [ ] Security checks passed
- [ ] Database connected
- [ ] Edge functions working
- [ ] Email notifications working (if configured)

---

## 🎯 Next Steps After Testing

### If Everything Works:
1. ✅ Deploy to production
2. ✅ Configure custom domain
3. ✅ Set up monitoring
4. ✅ Train users

### If Issues Found:
1. 📝 Document all issues
2. 🔧 Prioritize fixes
3. 🐛 Debug and fix
4. 🔄 Re-test
5. ✅ Deploy when ready

---

## 📞 Support

**Need help with testing?**
- Check browser console for errors
- Review Supabase logs
- Check network tab for failed requests
- Ask for assistance!

---

**Happy Testing! 🚀**

*Remember: Testing is the key to a successful launch!*
