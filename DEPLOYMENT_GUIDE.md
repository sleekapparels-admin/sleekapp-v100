# 🚀 DEPLOY TO CUSTOM DOMAIN - COMPLETE GUIDE

## 🎯 RECOMMENDED: Deploy to Vercel (Easiest!)

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Edge Functions support
- ✅ Perfect for React/Vite apps

---

## 📋 PREREQUISITES

Before deploying, make sure:
- ✅ Dependencies installed (`npm install` - DONE!)
- ✅ `.env.local` has your Supabase credentials
- ✅ App runs locally (`npm run dev`)
- ✅ No build errors (`npm run build`)

---

## 🌐 METHOD 1: VERCEL (RECOMMENDED)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- Choose your login method (GitHub, GitLab, Email)
- Follow the prompts

### Step 3: Deploy
```bash
vercel
```

**You'll be asked:**
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → Choose your account
3. "Link to existing project?" → **No** (first time)
4. "What's your project's name?" → `blueprint-buddy` (or your choice)
5. "In which directory is your code located?" → `./` (press Enter)
6. "Want to override settings?" → **No**

**Vercel will:**
- Detect it's a Vite project
- Build your app
- Deploy it
- Give you a URL like: `https://blueprint-buddy-xxx.vercel.app`

### Step 4: Add Environment Variables
```bash
# Option A: Through CLI
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
# Paste your Supabase key when prompted

# Option B: Through Dashboard (easier)
```

**Through Dashboard:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - `VITE_SUPABASE_URL` = your URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your key
   - `VITE_GA_MEASUREMENT_ID` = (optional)
   - `VITE_GTM_CONTAINER_ID` = (optional)
   - `VITE_HOTJAR_ID` = (optional)

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

### Step 6: Add Your Custom Domain

**Through Vercel Dashboard:**
1. Go to your project
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your domain: `yourdomain.com`
5. Vercel will show you DNS records to add

**Update Your Domain DNS:**

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:

**For Root Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait 5-60 minutes for DNS to propagate**

### Step 7: Enable Automatic Deployments (Optional)

**Connect to GitHub:**
1. Push your code to GitHub
2. In Vercel dashboard, click "Connect Git Repository"
3. Select your repo
4. Every push to `main` branch will auto-deploy!

---

## 🔷 METHOD 2: NETLIFY

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Initialize
```bash
netlify init
```

Follow prompts:
- Create new site
- Choose team
- Site name: `blueprint-buddy`

### Step 4: Configure Build Settings

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 5: Add Environment Variables
```bash
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "your-key"
```

### Step 6: Deploy
```bash
netlify deploy --prod
```

### Step 7: Add Custom Domain
1. Go to Netlify dashboard
2. Site settings → Domain management
3. Add custom domain
4. Follow DNS instructions

---

## 🔶 METHOD 3: GITHUB PAGES (Free but Limited)

### Step 1: Update vite.config.ts

Add base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Script to package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy
```bash
npm run deploy
```

### Step 5: Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

**Note:** GitHub Pages doesn't support environment variables well. Not recommended for this project.

---

## 🟢 METHOD 4: CUSTOM SERVER (Advanced)

### Using Your Own VPS/Server

**Requirements:**
- Node.js installed
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Steps:**
1. Build the app: `npm run build`
2. Copy `dist` folder to server
3. Configure Nginx to serve static files
4. Set up SSL with Certbot
5. Point domain to server IP

**Not recommended for non-technical users.**

---

## 🔧 BUILD CONFIGURATION

### Ensure Build Works Locally First

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

If build fails, check:
- All imports are correct
- No TypeScript errors
- Environment variables are set

---

## 🌍 DOMAIN CONFIGURATION

### DNS Records You'll Need

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Where to Add DNS Records

**GoDaddy:**
1. Go to DNS Management
2. Add records as shown above

**Namecheap:**
1. Domain List → Manage
2. Advanced DNS
3. Add records

**Cloudflare:**
1. DNS settings
2. Add records
3. Set proxy status to "Proxied" (orange cloud)

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deploying, test:

- [ ] Site loads at your domain
- [ ] HTTPS works (green padlock)
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms work (if backend is set up)
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] No console errors (F12)

---

## 🐛 COMMON DEPLOYMENT ISSUES

### Issue 1: "404 on Page Refresh"
**Solution:** Add redirect rules

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:** Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue 2: "Environment Variables Not Working"
**Solution:**
- Make sure they start with `VITE_`
- Redeploy after adding them
- Check they're set in production environment

### Issue 3: "Build Fails"
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue 4: "Images Not Loading"
**Solution:**
- Check image paths are relative
- Ensure images are in `public` folder
- Verify image URLs in production

### Issue 5: "API Calls Failing"
**Solution:**
- Check CORS settings
- Verify environment variables
- Check Supabase URL is correct

---

## 🚀 CONTINUOUS DEPLOYMENT

### Auto-Deploy on Git Push

**Vercel:**
1. Connect GitHub repo
2. Every push to `main` auto-deploys
3. Pull requests get preview URLs

**Netlify:**
1. Connect GitHub repo
2. Configure build settings
3. Auto-deploy on push

**Benefits:**
- No manual deployment
- Preview branches
- Rollback capability
- Build logs

---

## 💰 COST COMPARISON

| Platform | Free Tier | Custom Domain | SSL | Bandwidth |
|----------|-----------|---------------|-----|-----------|
| **Vercel** | ✅ Yes | ✅ Free | ✅ Free | 100GB/month |
| **Netlify** | ✅ Yes | ✅ Free | ✅ Free | 100GB/month |
| **GitHub Pages** | ✅ Yes | ✅ Free | ✅ Free | 100GB/month |
| **Custom Server** | ❌ $5-20/mo | ✅ Free | ✅ Free | Varies |

**Recommendation:** Start with Vercel free tier!

---

## 📞 NEED HELP?

### Quick Deploy Command (Vercel)
```bash
# One command to deploy
npm install -g vercel && vercel --prod
```

### Quick Deploy Command (Netlify)
```bash
# One command to deploy
npm install -g netlify-cli && netlify deploy --prod
```

---

## 🎯 RECOMMENDED WORKFLOW

1. **Develop Locally**
   ```bash
   npm run dev
   ```

2. **Test Build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy to Staging** (Vercel preview)
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

5. **Add Custom Domain** (through dashboard)

6. **Set Up Auto-Deploy** (connect GitHub)

---

## ✨ BONUS: PERFORMANCE OPTIMIZATION

### Before Deploying:

1. **Optimize Images:**
   - Use WebP format
   - Compress images
   - Use lazy loading

2. **Code Splitting:**
   - Already done with lazy loading in App.tsx ✅

3. **Minification:**
   - Vite does this automatically ✅

4. **Caching:**
   - Vercel/Netlify handle this ✅

---

## 🎉 YOU'RE READY TO DEPLOY!

**Easiest Path:**
```bash
# Install Vercel
npm install -g vercel

# Deploy
vercel

# Add environment variables through dashboard
# Add custom domain through dashboard
# Done! 🚀
```

**Questions? Tell me:**
1. Which platform do you prefer?
2. Do you already own a domain?
3. Any deployment errors?

I'll help you through every step! 🎯
