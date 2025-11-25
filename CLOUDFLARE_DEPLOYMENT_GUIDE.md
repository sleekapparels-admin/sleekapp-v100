# Cloudflare Pages Deployment Guide for sleekapparels.com

## Current Situation
✅ Domain: sleekapparels.com purchased from GoDaddy  
✅ Nameservers: Changed to Cloudflare  
✅ Lovable: Currently connected to domain  
✅ Next.js Site: Built and ready to deploy  

---

## What You Need to Do

### Step 1: Get Your Cloudflare API Token

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Navigate to**: My Profile → API Tokens
3. **Click**: "Create Token"
4. **Select**: "Edit Cloudflare Workers" template
5. **Permissions**: 
   - Account → Cloudflare Pages → Edit
   - Zone → DNS → Edit
   - Zone → Page Rules → Edit
6. **Zone Resources**: 
   - Include → Specific zone → sleekapparels.com
7. **Click**: "Continue to summary" → "Create Token"
8. **Copy the token** (you'll only see it once!)

---

### Step 2: Deploy Your Site to Cloudflare Pages

#### Option A: Using Wrangler CLI (Recommended)

```bash
# 1. Set your Cloudflare API token
export CLOUDFLARE_API_TOKEN="your-api-token-here"

# 2. Login to Cloudflare
npx wrangler login

# 3. Build your Next.js site
cd /home/user/webapp
npm run build

# 4. Create Cloudflare Pages project
npx wrangler pages project create sleek-apparels --production-branch main

# 5. Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name sleek-apparels --branch main

# You'll receive a URL like: https://sleek-apparels.pages.dev
```

#### Option B: Using Cloudflare Dashboard (Alternative)

1. **Go to**: https://dash.cloudflare.com
2. **Click**: "Workers & Pages" in left sidebar
3. **Click**: "Create application" → "Pages" → "Connect to Git"
4. **Connect GitHub**: Authorize Cloudflare to access your repository
5. **Select**: `sleekapparels-admin/sleekapp-v100`
6. **Configure**:
   - **Project name**: sleek-apparels
   - **Production branch**: main
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`
7. **Click**: "Save and Deploy"

---

### Step 3: Disconnect Domain from Lovable

1. **Go to Lovable Dashboard**: https://lovable.dev
2. **Open your project**: sleekapp-v100
3. **Navigate to**: Settings → Custom Domain
4. **Click**: "Remove custom domain" or "Disconnect"
5. **Confirm**: Yes, remove sleekapparels.com

⚠️ **Important**: Do this AFTER deploying to Cloudflare Pages

---

### Step 4: Connect Domain to Cloudflare Pages

#### Method 1: Using Cloudflare Dashboard (Easiest)

1. **In Cloudflare Dashboard**: Workers & Pages → sleek-apparels project
2. **Click**: "Custom domains" tab
3. **Click**: "Set up a custom domain"
4. **Enter**: `sleekapparels.com`
5. **Click**: "Continue"
6. **Cloudflare will automatically**:
   - Create DNS records
   - Configure SSL certificate
   - Set up redirects

7. **Add www subdomain**:
   - Click "Set up a custom domain" again
   - Enter: `www.sleekapparels.com`
   - Choose: Redirect to `sleekapparels.com`

#### Method 2: Manual DNS Configuration

If automatic setup doesn't work, manually add these DNS records:

**In Cloudflare DNS Settings**:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | sleekapparels.com | sleek-apparels.pages.dev | Proxied (orange cloud) |
| CNAME | www | sleek-apparels.pages.dev | Proxied (orange cloud) |

**Steps**:
1. **Go to**: Cloudflare Dashboard → sleekapparels.com → DNS → Records
2. **Delete old records** pointing to Lovable (if any)
3. **Click**: "Add record"
4. **Type**: CNAME
5. **Name**: @ (for root domain) or www
6. **Target**: sleek-apparels.pages.dev
7. **Proxy status**: Proxied (orange cloud icon)
8. **Click**: "Save"

---

### Step 5: Verify Deployment

After DNS propagation (usually 5-10 minutes), test your site:

```bash
# Test root domain
curl -I https://sleekapparels.com

# Test www subdomain
curl -I https://www.sleekapparels.com

# Expected response:
# HTTP/2 200 
# content-type: text/html
# server: cloudflare
```

**Check in browser**:
1. Visit: https://sleekapparels.com
2. Open DevTools → Network tab
3. Verify: 
   - ✅ Status: 200 OK
   - ✅ Server: Cloudflare
   - ✅ No redirects (or only HTTP→HTTPS)
   - ✅ SSL certificate valid

---

### Step 6: Configure Cloudflare Settings

#### A. SSL/TLS Configuration
1. **Go to**: Cloudflare Dashboard → SSL/TLS
2. **Set**: Full (strict) encryption mode
3. **Enable**: Always Use HTTPS
4. **Enable**: Automatic HTTPS Rewrites

#### B. Speed Optimization
1. **Go to**: Speed → Optimization
2. **Enable**:
   - Auto Minify (CSS, JavaScript, HTML)
   - Brotli compression
   - Early Hints
   - HTTP/3 (with QUIC)

#### C. Caching
1. **Go to**: Caching → Configuration
2. **Set**: Browser Cache TTL to "Respect Existing Headers"
3. **Enable**: Always Online

#### D. Page Rules (Optional but Recommended)
1. **Go to**: Rules → Page Rules
2. **Create rule**: `www.sleekapparels.com/*`
   - **Setting**: Forwarding URL (301 - Permanent Redirect)
   - **Destination**: `https://sleekapparels.com/$1`
   - **Effect**: Redirects www to non-www

---

### Step 7: Set Up Continuous Deployment

Every time you push to GitHub main branch, Cloudflare Pages will automatically rebuild and deploy.

**Enable GitHub Integration**:
1. **In Cloudflare Dashboard**: Workers & Pages → sleek-apparels → Settings
2. **Under "Builds & deployments"**: Connect to Git
3. **Authorize**: Cloudflare to access your GitHub
4. **Select**: sleekapparels-admin/sleekapp-v100
5. **Branch**: main
6. **Save**

Now every push to main triggers automatic deployment! ✨

---

## Troubleshooting

### Issue: DNS not resolving
**Solution**: DNS propagation can take up to 24-48 hours. Check status:
```bash
# Check DNS propagation
dig sleekapparels.com
nslookup sleekapparels.com

# Or use online tool:
# https://www.whatsmydns.net/#CNAME/sleekapparels.com
```

### Issue: SSL certificate error
**Solution**: 
1. Wait 15 minutes for Cloudflare to provision certificate
2. Ensure SSL mode is "Full (strict)" not "Flexible"
3. Check: Cloudflare Dashboard → SSL/TLS → Edge Certificates

### Issue: 502 Bad Gateway
**Solution**:
1. Verify build succeeded: Cloudflare Dashboard → Workers & Pages → sleek-apparels → Deployments
2. Check build logs for errors
3. Ensure `out` directory exists after build

### Issue: 404 on pages
**Solution**:
1. Verify all pages built: `ls -la /home/user/webapp/out`
2. Check Next.js config has `output: 'export'`
3. Rebuild: `npm run build`

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Test all pages load: /, /about, /services, /products, /contact, /blog
- [ ] Test sitemap: https://sleekapparels.com/sitemap.xml
- [ ] Test robots.txt: https://sleekapparels.com/robots.txt
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for priority pages
- [ ] Monitor Cloudflare Analytics
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

---

## What Happens to Lovable?

**Option 1: Keep Lovable for Backend/Dashboard**
- Deploy your admin panel/dashboard to Lovable at subdomain: `app.sleekapparels.com`
- Marketing site on main domain: `sleekapparels.com` (Cloudflare Pages)

**Option 2: Fully Migrate Away from Lovable**
- Keep your code on GitHub
- Deploy everything to Cloudflare Pages
- Cancel Lovable subscription (if desired)

**Option 3: Use Lovable as Staging Environment**
- Keep Lovable deployment as staging: `sleekapp-v100.lovable.app`
- Production on Cloudflare Pages: `sleekapparels.com`

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| GoDaddy Domain | $10-15/year (already paid) |
| Cloudflare DNS | Free |
| Cloudflare Pages | Free (unlimited bandwidth) |
| Cloudflare Pro (optional) | $20/month (for advanced features) |

**Total**: $0/month (just domain renewal once/year)

---

## Need Help?

If you encounter any issues:
1. Check Cloudflare build logs
2. Review deployment status in dashboard
3. Test DNS propagation
4. Verify GitHub integration is working

---

## Summary: Your Action Plan

1. ✅ Get Cloudflare API token
2. ✅ Deploy Next.js site to Cloudflare Pages
3. ✅ Disconnect domain from Lovable
4. ✅ Connect domain to Cloudflare Pages
5. ✅ Wait for DNS propagation (5-10 mins)
6. ✅ Test site thoroughly
7. ✅ Submit to Google Search Console
8. ✅ Monitor and optimize

**Estimated Time**: 30-60 minutes  
**Difficulty**: Moderate (following step-by-step)

---

**Ready to deploy? Let's do this!** 🚀
