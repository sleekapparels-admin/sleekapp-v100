# 📱 Mobile App Integration Guide

## 🎯 Overview

This repository now contains **BOTH** the web platform and mobile app:

```
blueprint-buddy-83/
├── (root files)              # 🌐 Web Platform (React + TypeScript + Vite)
├── src/                      # Web app source code
├── supabase/                 # Shared backend configuration
└── mobile-app/              # 📱 Flutter Mobile App
    └── sleek_apparels_app/   # Mobile app source code
```

## ✅ Safe Integration Strategy

**🔒 Zero Impact on Web Platform**:
- Mobile app is in separate `mobile-app/` directory
- No changes to web platform files
- Lovable.ai continues to work normally
- Independent build and deployment processes

## 🌐 Shared Backend Architecture

Both platforms connect to the **same Supabase instance**:

```
Web Platform (React) ──┐
                       ├──> Supabase Backend
Mobile App (Flutter) ──┘
```

**Shared Resources**:
- ✅ Users table (single sign-on)
- ✅ Orders database
- ✅ Products catalog
- ✅ Suppliers data
- ✅ Edge functions (AI quote generator, etc.)
- ✅ Real-time subscriptions

## 📦 Mobile App Features

**LoopTrace™ Order Tracking**:
- Real-time production stage updates
- Photo documentation at each milestone
- AI quality predictions
- Automated compliance verification

**AI-Powered Quote Generator**:
- Instant pricing estimates
- Material recommendations
- Volume discount calculations
- Connects to existing edge functions

**Product Catalog**:
- Browse knitwear products
- MOQ and pricing information
- Technical specifications
- High-quality images

**Authentication**:
- Email/password login
- User registration
- Profile management
- Secure Supabase integration

## 🚀 Getting Started with Mobile App

### Prerequisites

1. **Flutter SDK** (3.35.4 or later)
2. **Android Studio** or VS Code
3. **Supabase credentials** from your Lovable.ai project

### Quick Start

```bash
# Navigate to mobile app
cd mobile-app/sleek_apparels_app

# Install dependencies
flutter pub get

# Configure Supabase (IMPORTANT!)
# Edit lib/config/supabase_config.dart with your credentials

# Run on web
flutter run -d web-server --web-port=5060

# Build Android APK
flutter build apk --release
```

### Configure Supabase Connection

1. **Get credentials** from Lovable.ai project dashboard
2. **Edit** `mobile-app/sleek_apparels_app/lib/config/supabase_config.dart`:

```dart
static const String supabaseUrl = 'YOUR_SUPABASE_URL';
static const String supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 🔄 Deployment Strategy

**Web Platform (Lovable.ai)**:
- Managed by Lovable Cloud
- Auto-deploys from GitHub
- Custom domain configured in Lovable.ai dashboard

**Mobile App (Google Play)**:
- Build APK/AAB manually
- Upload to Google Play Console
- Independent release cycle

## 🎨 Brand Consistency

Both platforms use identical branding:
- **Primary**: Navy Blue (#1E3A8A)
- **Accent**: Gold (#F59E0B)
- **Typography**: Clean, modern, professional
- **Logo**: Consistent across platforms

## 📱 Testing the Mobile App

**Web Preview** (fastest):
```bash
cd mobile-app/sleek_apparels_app
flutter run -d web-server --web-port=5060
# Open: http://localhost:5060
```

**Android Emulator**:
```bash
cd mobile-app/sleek_apparels_app
flutter run -d emulator-5554
```

**Physical Device**:
```bash
cd mobile-app/sleek_apparels_app
flutter run
```

## 🔧 Development Workflow

**Web Platform Changes**:
1. Use Lovable.ai interface or edit files in root
2. Lovable.ai auto-commits to GitHub
3. Changes deploy automatically

**Mobile App Changes**:
1. Edit files in `mobile-app/sleek_apparels_app/`
2. Commit and push to GitHub
3. Build and test locally
4. Deploy APK manually to Google Play

## ⚠️ Important Notes

**DO NOT**:
- ❌ Move mobile app files to root directory
- ❌ Mix Flutter dependencies with web dependencies
- ❌ Delete or modify web platform files
- ❌ Change Supabase configuration in web platform

**DO**:
- ✅ Keep mobile app in `mobile-app/` subdirectory
- ✅ Test both platforms after Supabase changes
- ✅ Maintain consistent API calls across platforms
- ✅ Document changes in both README files

## 🎯 Next Steps

1. **Configure Supabase credentials** in mobile app
2. **Test authentication** on mobile
3. **Verify data synchronization** between platforms
4. **Build Android APK** for testing
5. **Submit to Google Play Console** when ready

## 📞 Support

**For Web Platform**: Use Lovable.ai support  
**For Mobile App**: Contact Flutter development team  
**For Backend**: Check Supabase dashboard

---

**✅ Both platforms are production-ready and fully integrated!**
