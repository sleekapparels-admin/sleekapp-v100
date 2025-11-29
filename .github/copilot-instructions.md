# Sleek Apparels - AI Coding Agent Instructions

## Project Overview
Sleek Apparels is a knitwear manufacturing and supply chain platform featuring **LoopTrace™ Production Tracking** and AI-powered quote generation. Built with React 18, TypeScript, Vite, and Supabase (PostgreSQL + Edge Functions).

**Core Domain**: B2B apparel manufacturing with real-time production visibility across 8 manufacturing stages (Order → Fabric → Cutting → Sewing → QC → Finishing → Shipment).

## Critical Architecture Patterns

### 1. Role-Based Access Control (RBAC)
**Three primary user types** determine dashboard and data access:
- **Buyer** (`retailer`, `wholesaler`, `educational`, `corporate`, `sports_team`) → `ModernBuyerDashboard`
- **Supplier** (`supplier`, `factory`) → `ModernSupplierDashboard`  
- **Admin** (`admin`) → `ModernAdminDashboard`

**Implementation**:
- `src/contexts/AuthContext.tsx` provides `useAuth()` with `user`, `role`, `userType`, `isAdmin`, `isSupplier`, `isBuyer`
- Routes use `<RoleBasedRoute allowedRoles={['admin']} />` or `<ProtectedRoute />`
- Database enforces RLS policies using `has_role(auth.uid(), 'admin'::app_role)` function
- User roles stored in `user_roles` table with `app_role` enum type

**Example**:
```tsx
// Protect admin route
<RoleBasedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</RoleBasedRoute>

// Check permissions in component
const { isAdmin, userType } = useAuth();
if (isAdmin) { /* show admin controls */ }
```

### 2. Supabase Integration
**Single source of truth**: All data operations go through Supabase client at `src/integrations/supabase/client.ts`.

**Key patterns**:
- Import client: `import { supabase } from "@/integrations/supabase/client"`
- Environment validation happens automatically via `src/lib/env-validator.ts`
- React Query handles all async operations (see Data Fetching below)
- Edge Functions (Deno runtime) in `supabase/functions/` for AI, payments, webhooks
- Types auto-generated from database schema in `src/integrations/supabase/types.ts`

**Never** create new Supabase clients. Always use the singleton instance.

### 3. Data Fetching with React Query
**All data operations use custom hooks** that wrap React Query:
- `src/hooks/useQuotes.ts` - Quote management
- `src/hooks/useMarketplace.ts` - Product catalog operations
- `src/hooks/useAggregation.ts` - Analytics aggregations
- Pattern: `useQuery` for reads, `useMutation` for writes with automatic cache invalidation

**Standard pattern**:
```tsx
// In custom hook (src/hooks/useOrders.ts)
export const useOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    }
  });
};

// In component
const { data: orders, isLoading } = useOrders(user.id);
```

**Query configuration** (see `App.tsx`):
- `staleTime: 5 minutes` - Data stays fresh
- `gcTime: 10 minutes` - Cache cleanup
- `refetchOnWindowFocus: false` - Prevents excessive refetches

### 4. Production Tracking System (LoopTrace™)
**8-stage workflow** managed via `production_stages` table:
1. Order Confirmation → 2. Fabric Sourcing → 3. Accessories → 4. Cutting → 5. Sewing → 6. QC → 7. Finishing → 8. Shipment

**Key components** (all in `src/components/production/`):
- `ProductionStageTimeline` - Visual timeline with icons per stage
- `ProductionStageCard` - Individual stage management with progress updates
- `PredictiveDelayAlert` - AI-powered delay detection
- `SupplierCoordinationPanel` - Real-time messaging between roles
- `ProductionAnalytics` - Metrics dashboard

**Critical**: Stages link to `supplier_orders` table. Updates trigger real-time subscriptions for live UI updates.

### 5. Component Organization
```
src/components/
├── production/       # LoopTrace™ stage management
├── supplier/         # Supplier-specific panels (orders, financials, QC)
├── buyer/            # Buyer-specific components
├── admin/            # Admin tools (verification, analytics)
├── marketplace/      # Product catalog, search, filters
├── quote/            # Quote generation and history
├── routes/           # ProtectedRoute, RoleBasedRoute guards
└── ui/               # shadcn/ui primitives (never edit directly)
```

**Do NOT modify** `src/components/ui/*` - These are shadcn/ui components. Create custom components that wrap them.

## Development Workflows

### Running the Project
```bash
npm run dev          # Start dev server at localhost:8080
npm run build        # Production build (minified, optimized chunks)
npm run test         # Run Vitest tests
npm run lint         # ESLint check
```

### Database Migrations
- **Do not modify** `supabase/COMPLETE_SETUP.sql` or `BASE_MIGRATION_SAFE.sql` - These are full schema snapshots
- New migrations go in `supabase/migrations/` with timestamp prefix
- Apply via Supabase CLI: `supabase db push`
- Naming: `YYYYMMDDHHMMSS_descriptive_name.sql`

### Edge Functions (Supabase Functions)
- Located in `supabase/functions/[function-name]/index.ts`
- **Deno runtime** (not Node.js): Use `Deno.serve()`, import from `https://` or `npm:`
- Config in `supabase/config.toml` controls JWT verification
- Deploy: `supabase functions deploy [function-name]`
- Example: `ai-quote-generator`, `admin-check`, `create-payment-intent`

**Critical functions**:
- `admin-check` - Validates admin role for protected operations
- `ai-quote-generator` - Generates quotes using OpenAI (or similar)
- `initialize-production-stages` - Creates 8 stages when order is created
- `log-audit-action` - Tracks admin actions for compliance

### Testing
- **Vitest** for unit tests (not Jest)
- Test files: `src/**/__tests__/*.test.ts` or `*.test.tsx`
- Mocks in `src/test/` directory
- Example: `src/hooks/__tests__/useAdminAuth.test.ts` (13 passing tests)
- Run specific test: `npx vitest run src/path/to/test.test.ts`

## Project-Specific Conventions

### 1. Import Aliases
Use `@/` prefix for all internal imports:
```tsx
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
```

### 2. TypeScript Strictness
- **No `any` types** - Use proper types from `src/types/database.ts` or `src/integrations/supabase/types.ts`
- Database types auto-generated - reference them as `Database['public']['Tables']['orders']['Row']`
- Enums for status fields: `app_role`, `production_stage`, `verification_status`

### 3. Lazy Loading Strategy
**Critical pages loaded immediately** (Index, Contact, Health).  
**Secondary pages lazy-loaded** via `React.lazy()`:
```tsx
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
```
See `src/App.tsx` for complete routing setup with `Suspense` boundaries.

### 4. Environment Variables
- Validated on app startup via `src/lib/env-validator.ts`
- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Accessed via: `import.meta.env.VITE_*`
- **Never commit** `.env` files - defaults baked into `vite.config.ts` for Lovable Cloud

### 5. Build Optimization
**Manual chunk splitting** in `vite.config.ts`:
- `react-core`, `react-dom`, `router` - Critical bundles
- `supabase-auth`, `supabase-client` - Backend split by usage
- `forms`, `charts`, `pdf-lib` - Lazy-loaded features
- Target: `<500KB` initial bundle, `<20KB` minimum chunk size

**Performance features**:
- Brotli/Gzip compression
- CSS preload with async loading (non-blocking)
- Image optimizer (currently disabled due to build issues)
- LightningCSS for faster minification

## Common Gotchas

1. **Admin routes require both route guard AND database RLS** - Check both `src/App.tsx` route config and Supabase policies
2. **Edge functions use Deno, not Node** - No `require()`, use `import` and Deno APIs
3. **React Query cache can mask bugs** - Clear with `queryClient.invalidateQueries(['key'])`
4. **Production stages must be initialized** - Call `initialize-production-stages` edge function when creating `supplier_order`
5. **User roles vs user types** - `role` is granular (`retailer`), `userType` is simplified (`buyer`)
6. **Image paths** - Public assets in `/public/`, imported assets in `/src/assets/`
7. **Auth state is async** - Always check `loading` from `useAuth()` before rendering protected content

## Key Files for Context
- `src/App.tsx` - Router config, lazy loading, role-based route setup
- `src/contexts/AuthContext.tsx` - Authentication state and role logic
- `src/integrations/supabase/client.ts` - Supabase client singleton
- `vite.config.ts` - Build config, chunk splitting, optimizations
- `supabase/config.toml` - Edge function JWT settings
- `README.md` - Feature documentation, LoopTrace™ overview

## Integration Points
- **Stripe**: Payment processing via `@stripe/stripe-js`, `create-payment-intent` edge function
- **OpenAI/AI**: Quote generation, blog assistant, market research (edge functions)
- **Firebase**: Legacy auth (being phased out, prefer Supabase auth)
- **Analytics**: GA4 + GTM via `src/components/AnalyticsProvider.tsx`
- **Email**: Resend webhook for notifications

## Questions to Ask Before Implementing
1. Which user role(s) should access this feature? (Impacts route guards and RLS policies)
2. Is this a read or write operation? (Determines `useQuery` vs `useMutation`)
3. Should this be real-time? (Requires Supabase subscriptions via `.on('postgres_changes')`)
4. Does this need an edge function? (Complex logic, third-party APIs, auth validation)
5. Which dashboard(s) need this component? (Buyer/Supplier/Admin have different layouts)

---

**Last Updated**: November 30, 2025  
**Lovable Project**: https://lovable.dev/projects/ef7f6ef1-09a5-4126-a41c-4351a354e52f
