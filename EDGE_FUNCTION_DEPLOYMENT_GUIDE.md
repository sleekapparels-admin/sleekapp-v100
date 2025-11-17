RESEND_API_KEY=your_resend_api_key_here
LOVABLE_API_KEY=your_lovable_api_key_here
DEBUG_OTP=true  # Optional, for testing
```

### Getting API Keys

**Resend API Key:**
1. Go to [resend.com](https://resend.com) and sign up
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

**Lovable API Key:**
1. Go to your Lovable dashboard
2. Navigate to Settings → API Keys
3. Generate a new API key for AI services
4. Copy the key

---

## 🌐 METHOD 1: LOVABLE CLOUD DEPLOYMENT (RECOMMENDED)

### Step 1: Access Lovable Dashboard

1. **Login to Lovable:**
   - Go to [lovable.dev](https://lovable.dev)
   - Sign in with your account

2. **Open Your Project:**
   - Select your blueprint-buddy project
   - Click "Open in Editor" or access the dashboard

### Step 2: Navigate to Functions Section

1. **Find Functions Tab:**
   - In the left sidebar, click **"Functions"** or **"Edge Functions"**
   - If not visible, click the **"⋮"** menu and look for Functions

2. **View Current Functions:**
   - You should see the three functions listed:
     - `send-quote-otp`
     - `verify-quote-otp`
     - `ai-quote-generator`

### Step 3: Deploy Each Function

**For each function, follow these steps:**

1. **Select the Function:**
   - Click on the function name (e.g., `send-quote-otp`)

2. **Deploy the Function:**
   - Click the **"Deploy"** button
   - Wait for deployment to complete (usually 30-60 seconds)
   - Status should change to **"Deployed"** ✅

3. **Repeat for All Functions:**
   - Deploy `send-quote-otp` first
   - Then `verify-quote-otp`
   - Finally `ai-quote-generator`

**Screenshot Location:** Add screenshot showing the Functions dashboard with deploy buttons

### Step 4: Set Environment Variables

1. **Access Environment Variables:**
   - In Functions section, click **"Environment Variables"** or **"Settings"**
   - Look for **"Secrets"** or **"Environment"** tab

2. **Add Required Variables:**
   ```
   RESEND_API_KEY = your_resend_api_key_here
   LOVABLE_API_KEY = your_lovable_api_key_here
   DEBUG_OTP = true  # Optional
   ```

3. **Save Changes:**
   - Click **"Save"** or **"Update"**
   - Redeploy functions if prompted

**Screenshot Location:** Add screenshot showing environment variables configuration

### Step 5: Verify Deployment

1. **Check Function Status:**
   - All functions should show **"Active"** or **"Deployed"**
   - Green status indicators

2. **Test Function URLs:**
   - Each function gets a URL like: `https://your-project.lovable.app/functions/v1/send-quote-otp`

---

## 🔷 METHOD 2: SUPABASE CLI DEPLOYMENT (ALTERNATIVE)

### Step 1: Install Supabase CLI

```bash
# Install globally
npm install -g supabase

# Or using brew (macOS)
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

### Step 2: Login to Supabase

```bash
supabase login
```

- Follow the browser login flow
- Select your organization if prompted

### Step 3: Link to Your Project

```bash
# Navigate to your project directory
cd /path/to/blueprint-buddy-83-2

# Link to your Supabase project
supabase link --project-ref your-project-ref
```

**Find your project ref:**
- Go to [supabase.com](https://supabase.com)
- Select your project
- Copy the project ref from the URL (looks like `abcdefghijklmnop`)

### Step 4: Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy send-quote-otp
supabase functions deploy verify-quote-otp
supabase functions deploy ai-quote-generator
```

### Step 5: Set Secrets

```bash
# Set environment variables
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
supabase secrets set LOVABLE_API_KEY=your_lovable_api_key_here
supabase secrets set DEBUG_OTP=true
```

---

## ✅ VERIFICATION STEPS

### Check Function Deployment

1. **Via Lovable Dashboard:**
   - Functions tab → All functions show "Deployed" ✅

2. **Via Supabase Dashboard:**
   - Go to [supabase.com](https://supabase.com)
   - Select your project → Edge Functions
   - All three functions should be listed

3. **Test Function URLs:**
   ```bash
   # Test send-quote-otp
   curl -X POST https://your-project.supabase.co/functions/v1/send-quote-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

### Check Function Logs

1. **Lovable Dashboard:**
   - Functions → Select function → "Logs" tab
   - Should show successful deployment messages

2. **Supabase Dashboard:**
   - Edge Functions → Select function → "Logs"
   - Look for startup messages without errors

### Verify Environment Variables

1. **Check Secrets are Set:**
   ```bash
   supabase secrets list
   ```
   - Should show RESEND_API_KEY, LOVABLE_API_KEY

2. **Test with Debug Mode:**
   - Set DEBUG_OTP=true
   - Test OTP function should return OTP in response

---

## 🐛 TROUBLESHOOTING SECTION

### Common Deployment Errors

**Error: "Function not found"**
- **Cause:** Functions not deployed
- **Fix:** Follow deployment steps above, check function names match exactly

**Error: "Environment variable not set"**
- **Cause:** Missing API keys
- **Fix:** Add RESEND_API_KEY and LOVABLE_API_KEY in environment variables

**Error: "Database connection failed"**
- **Cause:** Supabase URL/key issues
- **Fix:** Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-set by Lovable

**Error: "Build failed"**
- **Cause:** Code syntax errors
- **Fix:** Check function code for TypeScript errors, run locally first

### Checking Function Logs

**Lovable Dashboard:**
1. Functions → Select function
2. Click "Logs" tab
3. Look for error messages in red
4. Check timestamps for recent activity

**Supabase CLI:**
```bash
# View logs for specific function
supabase functions logs send-quote-otp --follow
```

### Verifying Database Connection

1. **Test Database Access:**
   ```bash
   supabase db test
   ```

2. **Check Tables Exist:**
   - Go to Supabase Dashboard → Table Editor
   - Verify these tables exist:
     - `quote_configurations`
     - `quote_otps`
     - `quotes`
     - `timeline_predictions`

### Testing Each Function Individually

**Test send-quote-otp:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-quote-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"test@example.com"}'
```

**Test verify-quote-otp:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/verify-quote-otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

**Test ai-quote-generator:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai-quote-generator \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"productType":"t_shirt","quantity":1000,"timeline":"2_weeks"}'
```

---

## 📋 ENVIRONMENT VARIABLES CHECKLIST

### Auto-Set by Lovable
- ✅ `SUPABASE_URL` - Your project URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key

### Must Set Manually
- ✅ `RESEND_API_KEY` - From resend.com
- ✅ `LOVABLE_API_KEY` - From lovable.dev

### Optional
- ☐ `DEBUG_OTP` - Set to `true` for testing (returns OTP in response)

### Verification Commands
```bash
# Check all secrets
supabase secrets list

# Should show:
# RESEND_API_KEY = re_...
# LOVABLE_API_KEY = lv_...
# DEBUG_OTP = true
```

---

## 🧪 TESTING SECTION

### Test OTP Flow

1. **Send OTP:**
   - Use the quote generator form
   - Enter email: `test@example.com`
   - Click "Send Verification Code"

2. **Check Email:**
   - If DEBUG_OTP=true, OTP appears in response
   - Otherwise, check email inbox for OTP

3. **Verify OTP:**
   - Enter the 6-digit code
   - Should proceed to quote form

### Test Quote Generation

1. **Fill Quote Form:**
   - Product Type: T-Shirt
   - Quantity: 1000
   - Timeline: 2 weeks
   - Other details as needed

2. **Submit Form:**
   - Should generate quote with pricing
   - Timeline should appear
   - AI insights should be included

3. **Verify Results:**
   - Check quote details are saved
   - Timeline predictions work
   - No errors in browser console

### Verify AI Insights

1. **Check AI Response:**
   - Quote should include AI-generated insights
   - Based on Bangladesh manufacturing data

2. **Test Fallback:**
   - If AI fails, should still generate quote
   - Uses template-based suggestions

### Full Integration Test

1. **Complete User Flow:**
   - Enter email → Send OTP → Verify OTP → Fill form → Generate quote
   - Should work end-to-end without errors

2. **Check Logs:**
   - No errors in function logs
   - Successful database writes

---

## 🚀 POST-DEPLOYMENT CHECKLIST

- [ ] All three functions deployed successfully
- [ ] Environment variables configured
- [ ] Function logs show no errors
- [ ] OTP email sending works
- [ ] Quote generation completes
- [ ] AI insights are included
- [ ] Database tables populated correctly
- [ ] Frontend integration works

---

## 📞 NEED HELP?

### Quick Diagnostic Commands
```bash
# Check function status
supabase functions list

# View recent logs
supabase functions logs ai-quote-generator --limit 10

# Test database connection
supabase db test