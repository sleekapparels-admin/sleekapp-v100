# Quick Start Guide - Sleek Apparels Development

## 🚀 Running the Project

### Development Server

```bash
npm run dev
```

Visit: <http://localhost:8080>

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npx vitest run
```

### Run Specific Test

```bash
npx vitest run src/hooks/__tests__/useAdminAuth.test.ts
```

---

## 🎨 New Components Usage

### 1. Enhanced AI Assistant

```tsx
import { EnhancedAIAssistant } from "@/components/EnhancedAIAssistant";

// In your page/component:
<EnhancedAIAssistant />
```

### 2. Pain Point Selector

```tsx
import { PainPointSelector } from "@/components/quote/PainPointSelector";

const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);

<PainPointSelector
  onSelect={(id) => setSelectedPainPoints(prev => [...prev, id])}
  selectedPainPoints={selectedPainPoints}
  multiSelect={true}
/>
```

### 3. MOQ Comparison Chart

```tsx
import { MOQComparisonChart } from "@/components/infographics/MOQComparisonChart";

<MOQComparisonChart
  quantity={100}
  productType="t-shirts"
  unitPrice={8.50}
/>
```

### 4. Timeline Comparison

```tsx
import { TimelineComparisonChart } from "@/components/infographics/TimelineComparisonChart";

<TimelineComparisonChart showLoopTraceIndicators={true} />
```

### 5. Supplier Profile Cards

```tsx
import { SupplierProfileCard, SampleSupplierProfiles } from "@/components/supplier/SupplierProfileCard";

{SampleSupplierProfiles.map(supplier => (
  <SupplierProfileCard
    key={supplier.id}
    supplier={supplier}
    showImpactMetrics={true}
    showBeforeAfter={true}
    onViewDetails={(id) => console.log('View:', id)}
  />
))}
```

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Tests Fail

```bash
# Clear test cache
npx vitest run --no-cache
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```

---

## 📁 Key Directories

- `/src/components/` - UI components
- `/src/pages/` - Page components
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions
- `/supabase/functions/` - Edge functions (AI, automation)
- `/src/test/` - Test utilities and mocks

---

## 🎯 Quick Tasks

### Add New Page

1. Create file in `/src/pages/YourPage.tsx`
2. Add route in `/src/App.tsx`
3. Import and add to router config

### Add New Component

1. Create file in `/src/components/YourComponent.tsx`
2. Export from component
3. Import where needed

### Add New Supabase Function

```bash
cd supabase/functions
supabase functions new your-function-name
```

---

## 📚 Documentation

- Full Summary: `IMPLEMENTATION_SUMMARY_2025-11-27.md`
- AI Guide: `AI_VISUAL_ENHANCEMENT_IMPLEMENTATION.md`
- README: `README.md`

---

## ✅ What's Working

- ✅ All dependencies installed
- ✅ TypeScript compilation (0 errors)
- ✅ Admin auth tests (13/13 passing)
- ✅ 6 new AI/UX components
- ✅ 40 Supabase edge functions
- ✅ Development server

## ⚠️ Known Issues

- Image optimizer plugin disabled (build issue)
- Auth.test.tsx needs mocking fix
- Occasional build failures (re-run fixes it)

---

**Need Help?**
Check `IMPLEMENTATION_SUMMARY_2025-11-27.md` for detailed information.
