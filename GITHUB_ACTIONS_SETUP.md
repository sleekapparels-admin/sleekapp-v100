# 🤖 GitHub Actions Auto-Deploy Setup

## Make Firebase Deploy Automatically Like Lovable!

---

## 🎯 What This Does

Once configured, **every push to main branch** will:
1. ✅ Auto-build your app
2. ✅ Auto-deploy to Firebase
3. ✅ No manual commands needed
4. ✅ Just like Lovable workflow!

---

## 📋 Setup Steps (10 minutes)

### **Step 1: Get Firebase Service Account Key**

```bash
# Login to Firebase CLI
firebase login

# Generate service account key
firebase init hosting:github
```

**OR manually:**

1. Go to: https://console.firebase.google.com/project/sleek-ai-project/settings/serviceaccounts

2. Click **"Generate new private key"**

3. Download the JSON file (keep it secret!)

4. Copy the entire JSON content

---

### **Step 2: Add Secret to GitHub**

1. Go to your GitHub repo: https://github.com/sleekapparels-admin/sleekapp-v100

2. Go to **Settings** → **Secrets and variables** → **Actions**

3. Click **"New repository secret"**

4. Add these secrets:

#### **Secret 1: FIREBASE_SERVICE_ACCOUNT**
```
Name: FIREBASE_SERVICE_ACCOUNT
Value: [Paste the entire JSON content from Step 1]
```

#### **Secret 2: VITE_SUPABASE_URL** (Optional - for env vars)
```
Name: VITE_SUPABASE_URL
Value: https://xcafrsphhnlssuzuatuo.supabase.co
```

#### **Secret 3: VITE_SUPABASE_PUBLISHABLE_KEY** (Optional)
```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Step 3: Commit GitHub Actions Workflow**

The workflow file is already created at:
```
.github/workflows/firebase-deploy.yml
```

Commit and push it:

```bash
cd /home/user/webapp
git add .github/workflows/firebase-deploy.yml
git commit -m "ci: Add GitHub Actions auto-deploy to Firebase"
git push origin main
```

---

### **Step 4: Watch the Magic! ✨**

1. Go to GitHub repo → **Actions** tab

2. You'll see "Deploy to Firebase Hosting" workflow running

3. Wait 2-3 minutes

4. Your site is auto-deployed! 🎉

---

## 🔄 New Workflow

### **After Setup:**

```
✅ Make changes in code
✅ Commit to GitHub
✅ Push to main branch
✅ GitHub Actions automatically:
   - Builds your app
   - Deploys to Firebase
   - Updates your live site
```

**Just like Lovable!** No manual deploy commands needed!

---

## 📊 Monitoring Deployments

### **Check Deployment Status:**

1. **GitHub:** Go to Actions tab to see build logs

2. **Firebase Console:** https://console.firebase.google.com/project/sleek-ai-project/hosting

3. **Get Email Notifications:** GitHub will email you on success/failure

---

## 🛠️ Customizing the Workflow

### **Deploy Only on Specific Branches:**

Edit `.github/workflows/firebase-deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - production  # Add more branches
```

### **Add Tests Before Deploy:**

```yaml
- name: Run tests
  run: npm test
  
- name: Lint code
  run: npm run lint
```

### **Deploy to Staging First:**

```yaml
- name: Deploy to staging
  if: github.ref != 'refs/heads/main'
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    channelId: staging
```

---

## 🚨 Troubleshooting

### **Deployment Fails?**

1. Check GitHub Actions logs
2. Verify Firebase service account is valid
3. Check if build succeeds locally: `npm run build`

### **"Permission Denied" Error?**

- Service account needs Hosting Admin role
- Go to Firebase Console → IAM → Add "Firebase Hosting Admin" role

### **Environment Variables Not Working?**

- Add them as GitHub Secrets (Step 2)
- Reference them in workflow YAML

---

## 💰 Cost

**GitHub Actions Free Tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos

**Each deployment uses ~3-5 minutes**

You can deploy 400-600 times per month for free!

---

## 🎓 Alternative: Firebase CLI in CI/CD

If you don't want GitHub Actions, you can also use:

1. **GitLab CI/CD**
2. **CircleCI**
3. **Travis CI**
4. **Jenkins**

All work similarly - just need Firebase token.

---

## 📝 Manual Deploy (Still Available)

Even with auto-deploy, you can still deploy manually:

```bash
npm run build
firebase deploy
```

Useful for:
- Emergency hotfixes
- Testing before pushing to main
- Deploying from local machine

---

## ✅ Summary

**Option A: GitHub Actions (Recommended)**
- ✅ Auto-deploy on every push
- ✅ Just like Lovable workflow
- ✅ No manual commands
- ✅ Setup takes 10 minutes

**Option B: Manual Deploy**
- ✅ Full control over when to deploy
- ✅ No secrets configuration needed
- ✅ Simpler setup
- ❌ Requires manual commands

---

## 🎉 Which Should You Choose?

**Choose GitHub Actions if:**
- You want "set it and forget it"
- You deploy often
- You want the Lovable experience

**Choose Manual if:**
- You want more control
- You deploy rarely
- You don't want to configure secrets

---

**I recommend GitHub Actions!** It's the closest to Lovable's workflow.

Ready to set it up? Let me know if you need help with the secrets! 🚀
