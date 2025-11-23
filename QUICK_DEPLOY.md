# 🚀 Quick Deploy Commands

Copy and paste these commands to deploy your app to Firebase!

---

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

---

## Step 2: Initialize Firebase (First Time Only)

```bash
cd /home/user/webapp
firebase init
```

**Select:**
- Firestore (use existing `firestore.rules` and `firestore.indexes.json`)
- Hosting (use existing `firebase.json`, public directory: `dist`)
- Storage (use existing `storage.rules`)

**Choose project:** `sleek-ai-project`

---

## Step 3: Deploy Security Rules (CRITICAL!)

```bash
firebase deploy --only firestore:rules,storage:rules
```

✅ This must be done BEFORE seeding data!

---

## Step 4: Build Production App

```bash
npm install
npm run build
```

✅ Creates optimized build in `dist/` folder

---

## Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

✅ Your app is now live at:
- https://sleek-ai-project.web.app
- https://sleek-ai-project.firebaseapp.com

---

## Step 6: Enable Authentication

Go to: https://console.firebase.google.com/project/sleek-ai-project/authentication

1. Click "Get Started"
2. Enable "Email/Password"
3. Enable "Google" (optional)
4. Add authorized domains:
   - `sleekapparels.com`
   - `www.sleekapparels.com`
   - `localhost`

---

## Step 7: Seed Database

Visit: https://sleek-ai-project.web.app/firebase-seed

Click "Seed Database Now"

✅ Creates 3 users + 7 products

---

## Step 8: Connect Custom Domain

In Firebase Console → Hosting → "Add custom domain"

1. Enter: `sleekapparels.com`
2. Get DNS records from Firebase
3. Update your domain registrar:
   - Remove Lovable DNS records
   - Add Firebase A records
4. Wait 24-48 hours for DNS propagation
5. Firebase auto-provisions SSL

---

## All-in-One Deploy (After Initial Setup)

```bash
# Build and deploy everything
npm run build && firebase deploy
```

---

## Troubleshooting

### "Permission denied" errors:
```bash
firebase deploy --only firestore:rules,storage:rules
```

### Build fails:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Can't login:
Check Firebase Console → Authentication → Settings → Authorized domains

---

## Test Credentials (After Seeding)

**Buyer:**
- sara.buyer@example.com / Test123!@#

**Supplier:**
- ahmed.supplier@example.com / Test123!@#

**Admin:**
- admin@sleekapparels.com / Admin123!@#

---

## Useful Commands

```bash
# View project info
firebase projects:list

# Open Firebase Console
firebase open

# View hosting URL
firebase hosting:channel:list

# View logs
firebase functions:log

# Test locally
npm run dev
```

---

## 🎉 That's It!

Your app is now running on Firebase with:
- ✅ Full Google ecosystem integration
- ✅ Auto-scaling infrastructure
- ✅ Global CDN
- ✅ Custom domain support
- ✅ No vendor lock-in

**Total time: ~30 minutes** ⏱️

---

Need help? Check:
- `FIREBASE_MIGRATION_GUIDE.md` (detailed instructions)
- `FIREBASE_MIGRATION_SUMMARY.md` (overview)
- Firebase Docs: https://firebase.google.com/docs
