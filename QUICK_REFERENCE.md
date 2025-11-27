# Quick Reference - AI Visual Enhancement Components

## 🚀 Quick Start

```bash
# View live demo
npm run dev
# Navigate to: http://localhost:5173/ai-visual-showcase
```

---

## 📦 5 New Components

### 1. PainPointSelector
```tsx
import { PainPointSelector } from '@/components/quote/PainPointSelector';

<PainPointSelector
  onSelect={(id) => console.log(id)}
  selectedPainPoints={[]}
  multiSelect={false}
/>
```

### 2. MOQComparisonChart
```tsx
import { MOQComparisonChart } from '@/components/infographics/MOQComparisonChart';

<MOQComparisonChart
  quantity={100}
  productType="t-shirts"
  unitPrice={8.50}
/>
```

### 3. TimelineComparisonChart
```tsx
import { TimelineComparisonChart } from '@/components/infographics/TimelineComparisonChart';

<TimelineComparisonChart showLoopTraceIndicators={true} />
```

### 4. SupplierProfileCard
```tsx
import { SupplierProfileCard, SampleSupplierProfiles } from '@/components/supplier/SupplierProfileCard';

<SupplierProfileCard
  supplier={SampleSupplierProfiles[0]}
  showImpactMetrics={true}
  showBeforeAfter={true}
/>
```

### 5. EnhancedAIAssistant
```tsx
import { EnhancedAIAssistant } from '@/components/EnhancedAIAssistant';

<EnhancedAIAssistant />
```

---

## 🎯 Common Integration Patterns

### Homepage Hero
```tsx
<section className="py-16">
  <div className="container">
    <MOQComparisonChart />
  </div>
</section>

<section className="py-16 bg-muted">
  <div className="container">
    <TimelineComparisonChart />
  </div>
</section>
```

### Quote Flow Enhancement
```tsx
// Step 1: Pain Point
<PainPointSelector onSelect={setPainPoint} />

// Step 2: Form with visual comparison
{quantity && <MOQComparisonChart quantity={quantity} />}

// Step 3: Supplier matching
{quoteResult && (
  <SupplierProfileCard supplier={matchedSupplier} />
)}
```

### Supplier Page
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {SampleSupplierProfiles.map(supplier => (
    <SupplierProfileCard key={supplier.id} supplier={supplier} />
  ))}
</div>
```

---

## 📁 Content Asset Locations

```
/public/content/
├── infographics/
│   ├── pain-points/
│   │   ├── moq-comparison.svg ❌ CREATE
│   │   ├── timeline-comparison.svg ❌ CREATE
│   │   ├── cost-transparency.svg ❌ CREATE
│   │   ├── quality-process.svg ❌ CREATE
│   │   └── sustainability-scorecard.svg ❌ CREATE
│   └── education/
│       ├── manufacturing-101.svg ❌ CREATE
│       ├── fabric-comparison.svg ❌ CREATE
│       └── defect-standards.svg ❌ CREATE
├── photos/
│   ├── factory/ ❌ POPULATE
│   ├── suppliers/ ❌ POPULATE
│   └── products/ ❌ POPULATE
└── videos/ ❌ PRODUCE
```

---

## 🔧 Customization Quick Tips

### Add Pain Point
Edit `PainPointSelector.tsx`:
```tsx
const painPoints: PainPoint[] = [
  {
    id: 'my-pain-point',
    icon: MyIcon,
    title: 'My Pain Point',
    description: '...',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    impact: 'high'
  }
];
```

### Add Supplier Profile
Edit `SupplierProfileCard.tsx`:
```tsx
export const SampleSupplierProfiles: SupplierProfile[] = [
  {
    id: 'new-supplier',
    factoryName: 'Factory Name',
    location: 'City, Bangladesh',
    workerCount: 100,
    specializations: ['Spec1', 'Spec2'],
    certifications: ['WRAP', 'GOTS'],
    ordersCompleted: 200,
    marginImprovement: '+30%',
    workerBenefits: ['Benefit1', 'Benefit2'],
    quote: 'Testimonial...',
    beforeAfter: { before: '...', after: '...' }
  }
];
```

### Customize AI Responses
Edit `EnhancedAIAssistant.tsx`:
```tsx
const PAIN_POINT_RESPONSES: Record<string, {...}> = {
  'my-pain-point': {
    text: "Response with **bold** and bullets...",
    visualContent: {
      type: 'infographic',
      src: '/path/to/image.svg',
      caption: '...'
    },
    followUpQuestions: [...]
  }
};
```

---

## 📊 Key Metrics to Track

```tsx
// In analytics setup
trackEvent('pain_point_selected', { painPointId });
trackEvent('moq_comparison_viewed', { quantity });
trackEvent('supplier_profile_clicked', { supplierId });
trackEvent('timeline_chart_viewed');
trackEvent('ai_conversation_completed', { leadScore });
```

---

## ⚡ Performance Tips

- ✅ Components use lazy loading built-in
- ✅ Animations use framer-motion (GPU accelerated)
- ✅ SVGs preferred over PNGs for infographics
- ✅ Images should use WebP with JPEG fallback
- ✅ Videos should be optimized (H.264, max 1080p)

---

## 🐛 Common Issues & Fixes

### Issue: Infographic not displaying
```tsx
// Check file path is correct
src="/content/infographics/pain-points/moq-comparison.svg"

// Ensure file exists in /public/content/...
// Component looks in /public automatically
```

### Issue: Supplier photos missing
```tsx
// Add placeholder images temporarily
factoryPhoto="/placeholder-factory.jpg"

// Or hide photo section
{supplier.factoryPhoto && <img src={supplier.factoryPhoto} />}
```

### Issue: AI assistant not showing visual content
```tsx
// Ensure pain point is in PAIN_POINT_RESPONSES
// Check visualContent object structure
visualContent: {
  type: 'infographic' | 'photo-carousel' | 'video',
  src: '...',  // for infographic/video
  sources: [...] // for carousel
}
```

---

## 📚 Documentation Links

- **Full Implementation**: `AI_VISUAL_ENHANCEMENT_IMPLEMENTATION.md`
- **Design Strategy**: `/data/.task/design.md`
- **Completion Summary**: `PHASE1_COMPLETION_SUMMARY.md`
- **Live Demo**: `/ai-visual-showcase`

---

## ✅ Pre-Deployment Checklist

- [ ] All 5 infographics created and placed in `/public/content/`
- [ ] Factory photos gathered (15-20 images)
- [ ] Supplier photos captured (5-10 images)
- [ ] Videos produced (3 minimum)
- [ ] Components integrated into target pages
- [ ] EnhancedAIAssistant replaces SmartAIAssistant
- [ ] Analytics tracking configured
- [ ] Mobile responsiveness tested
- [ ] Accessibility validated (screen reader)
- [ ] Performance tested (Lighthouse score >90)

---

## 🎨 Design Tools Recommended

- **Infographics**: Figma, Canva Pro, Adobe Illustrator
- **Photo Editing**: Adobe Lightroom, GIMP
- **Video Editing**: DaVinci Resolve, Adobe Premiere
- **Compression**: TinyPNG, Squoosh, HandBrake

---

**Quick Access**: Bookmark this page for fast reference during development!

*Last Updated: November 27, 2024*
