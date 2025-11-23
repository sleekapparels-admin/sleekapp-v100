# 🤖 Auto-Deploy Setup Instructions - Step by Step

## You'll Set Up "Lovable-Style" Auto-Deploy in 10 Minutes!

Follow these exact steps on **your local computer** or **your development machine**.

---

## ✅ **Step 1: Generate Firebase Service Account** (5 min)

### **Option A: Using Firebase CLI (Easiest)**

Open terminal and run:

```bash
# Login to Firebase
firebase login

# Go to your project directory (wherever you work locally)
cd /path/to/your/project

# Generate service account for GitHub Actions
firebase init hosting:github
```

**Follow the prompts:**
1. Select repository: `sleekapparels-admin/sleekapp-v100`
2. Set up workflow? **Yes**
3. Overwrite existing workflow? **Yes** (if asked)
4. Set up automatic deployment? **Yes**
5. Deploy on merge to main? **Yes**

**This will:**
- ✅ Create `.github/workflows/firebase-hosting-merge.yml`
- ✅ Automatically add `FIREBASE_SERVICE_ACCOUNT` secret to GitHub
- ✅ Configure everything for you!

**Done! Skip to Step 3!** 🎉

---

### **Option B: Manual Setup (If Option A doesn't work)**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/sleek-ai-project/settings/serviceaccounts/adminsdk

2. **Generate New Private Key:**
   - Click **"Generate new private key"**
   - Click **"Generate key"** in the confirmation dialog
   - A JSON file will download (e.g., `sleek-ai-project-firebase-adminsdk-xxxxx.json`)

3. **Open the JSON file** in a text editor

4. **Copy the ENTIRE content** (it looks like this):
   ```json
   {
     "type": "service_account",
     "project_id": "sleek-ai-project",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "...",
     "client_id": "...",
     "auth_uri": "...",
     "token_uri": "...",
     "auth_provider_x509_cert_url": "...",
     "client_x509_cert_url": "..."
   }
   ```

⚠️ **IMPORTANT:** Keep this file SECRET! Don't share it or commit it to Git!

---

## ✅ **Step 2: Add Secret to GitHub** (2 min)

1. **Go to your GitHub repository:**
   - Visit: https://github.com/sleekapparels-admin/sleekapp-v100

2. **Navigate to Settings:**
   - Click **"Settings"** tab (at the top)

3. **Go to Secrets:**
   - Click **"Secrets and variables"** in the left sidebar
   - Click **"Actions"**

4. **Add New Secret:**
   - Click **"New repository secret"** button

5. **Enter Secret Details:**
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Secret:** Paste the ENTIRE JSON content from Step 1
   - Click **"Add secret"**

✅ **Secret added!**

---

## ✅ **Step 3: Create GitHub Actions Workflow** (3 min)

Now create the workflow file **directly in GitHub**:

1. **Go to your repository:**
   - https://github.com/sleekapparels-admin/sleekapp-v100

2. **Create New File:**
   - Click **"Add file"** → **"Create new file"**

3. **Name the file:**
   - Type: `.github/workflows/firebase-deploy.yml`
   - (GitHub will auto-create the folders)

4. **Paste this content:**

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build Production App
        run: npm run build
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: sleek-ai-project
```

5. **Commit the file:**
   - Scroll down
   - Add commit message: `ci: Add Firebase auto-deploy workflow`
   - Click **"Commit new file"**

✅ **Workflow created!**

---

## ✅ **Step 4: Test Auto-Deploy** (2 min)

Now let's test if it works!

1. **Make a small change to trigger deploy:**
   - In GitHub, go to any file (e.g., `README.md`)
   - Click the pencil icon to edit
   - Add a line: `<!-- Test auto-deploy -->`
   - Commit the change

2. **Watch the magic happen:**
   - Go to **"Actions"** tab in your repo
   - You'll see **"Deploy to Firebase Hosting"** running
   - Click on it to watch the live logs

3. **Wait 2-3 minutes** for:
   - ✅ Install dependencies
   - ✅ Build production app
   - ✅ Deploy to Firebase

4. **Check your live site:**
   - Visit: https://sleek-ai-project.web.app
   - Your changes are live! 🎉

---

## 🎉 **Success! You're Done!**

### **From Now On:**

```
✅ Edit code locally or in GitHub
✅ Commit changes
✅ Push to main branch
✅ GitHub Actions automatically:
   - Builds your app
   - Deploys to Firebase
   - Updates your live site
```

**Just like Lovable!** No manual `firebase deploy` needed! 🚀

---

## 📊 **Monitoring Deployments**

### **View Deployment Status:**

1. **GitHub Actions:** 
   - https://github.com/sleekapparels-admin/sleekapp-v100/actions
   - See build logs, success/failure status

2. **Firebase Console:**
   - https://console.firebase.google.com/project/sleek-ai-project/hosting
   - See deployment history, rollback options

3. **Email Notifications:**
   - GitHub will email you on every deployment
   - Success ✅ or Failure ❌

### **Deployment Stats:**
- ⏱️ Average deploy time: 2-3 minutes
- 📦 Build size: ~2-5 MB
- 🚀 CDN propagation: Instant (global)

---

## 🛠️ **Troubleshooting**

### **Problem: Workflow fails with "Permission denied"**

**Solution:**
- Go to Firebase Console → IAM & Admin
- Find your service account email (from the JSON)
- Add role: **"Firebase Hosting Admin"**

### **Problem: Build fails with "Module not found"**

**Solution:**
- Check `package.json` has all dependencies
- Try locally: `npm ci && npm run build`
- Fix any errors, then push again

### **Problem: Secret not found**

**Solution:**
- Verify secret name is exactly: `FIREBASE_SERVICE_ACCOUNT`
- Verify it contains the full JSON (including `{` and `}`)
- Re-add the secret if needed

### **Problem: Workflow doesn't trigger**

**Solution:**
- Verify file is at: `.github/workflows/firebase-deploy.yml`
- Verify you pushed to `main` branch
- Check Actions tab is not disabled

---

## 🎯 **Advanced: Deploy Previews**

Want to preview changes before merging?

**Add this file:** `.github/workflows/firebase-preview.yml`

```yaml
name: Deploy Preview to Firebase Hosting

on:
  pull_request:
    branches:
      - main

jobs:
  build_and_preview:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: sleek-ai-project
          expires: 7d
```

Now every Pull Request gets a **temporary preview URL**! 🔗

---

## 💰 **Cost**

**GitHub Actions (Free Tier):**
- 2,000 minutes/month for private repos
- Unlimited for public repos

**Your Usage:**
- ~3 minutes per deployment
- Can deploy **400-600 times/month** for free

**Firebase (Free Spark Plan):**
- 10 GB hosting storage
- 360 MB/day bandwidth
- More than enough for testing!

---

## 📚 **What You Just Learned**

✅ How to set up CI/CD with GitHub Actions
✅ How to securely store secrets in GitHub
✅ How to automate Firebase deployments
✅ How to monitor deployment status
✅ How to troubleshoot common issues

**This is professional-grade DevOps!** 🎓

---

## 🔄 **Workflow Summary**

**Your New Workflow:**

```
Local Development:
1. Edit code
2. git add .
3. git commit -m "Your changes"
4. git push origin main
5. ☕ Relax - it auto-deploys!
```

**What Happens Automatically:**

```
GitHub → Receives push
   ↓
GitHub Actions → Starts workflow
   ↓
Build Server → npm ci && npm run build
   ↓
Deploy → Firebase Hosting
   ↓
Live Site → Updated! 🎉
```

---

## 🎉 **Congratulations!**

You now have:
- ✅ Automatic deployments on every push
- ✅ Professional CI/CD pipeline
- ✅ Firebase hosting with global CDN
- ✅ Deployment monitoring and logs
- ✅ Email notifications
- ✅ No manual `firebase deploy` needed

**Just like Lovable, but YOU control everything!** 🚀

---

## 📞 **Need Help?**

If you get stuck on any step:
1. Check the troubleshooting section above
2. Look at the Actions logs in GitHub
3. Ask me - I'm here to help!

---

**Ready to set this up?** 

Start with **Step 1** and follow along! 🎯
