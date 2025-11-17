# Product Analytics System

## Overview

The Product Analytics System tracks user interactions with product cards throughout the Sleek Apparels website. This data-driven approach helps optimize the user experience and understand customer behavior.

## Features

### Tracked Interactions

1. **Hover Events** (debounced, once per session per product)
   - Triggered when user hovers over a product card
   - Helps identify products that attract visual attention

2. **Quick View Clicks**
   - Triggered when user clicks the Eye icon for quick preview
   - Indicates strong interest in product details

3. **Wishlist Clicks**
   - Triggered when user clicks the Heart icon
   - Shows products users want to save for later

4. **Color Swatch Interactions**
   - Triggered when user clicks on color options
   - Tracks which colors are most popular

5. **Design Button Clicks**
   - Triggered when user clicks "Quick Customize" or "Design Now"
   - Indicates intent to customize the product

6. **Quote Button Clicks**
   - Triggered when user clicks "Get Quote"
   - Shows products with highest purchase intent

7. **View Details**
   - Triggered when user navigates to product detail page
   - Measures product page engagement

## Technical Architecture

### Database Schema

#### `product_interactions` Table
```sql
CREATE TABLE public.product_interactions (
  id UUID PRIMARY KEY,
  user_id UUID,                        -- Authenticated user (nullable for anonymous)
  session_id TEXT NOT NULL,            -- Anonymous session tracking
  product_id UUID NOT NULL,            -- Reference to product
  interaction_type product_interaction_type NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  additional_data JSONB,               -- Extra context (e.g., color selected)
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);
```

#### `product_engagement_metrics` Materialized View
Pre-aggregated metrics for fast dashboard queries:
- Unique sessions per product
- Count of each interaction type
- Total interactions
- Last interaction timestamp

### Edge Function: `track-product-interaction`

**Endpoint:** `POST /track-product-interaction`

**Request Body:**
```json
{
  "productId": "uuid",
  "interactionType": "hover",
  "sessionId": "session_xyz",
  "additionalData": { "color": "#FF5733" }
}
```

**Features:**
- Non-blocking (returns 204 immediately)
- Validates interaction types
- Deduplicates hover events per session
- Supports anonymous tracking
- Captures metadata (IP, user agent, referrer)

**Security:**
- Public endpoint (no JWT required)
- RLS policies protect data access
- Rate limiting via backend logic

### Frontend Hook: `useProductAnalytics`

**Usage:**
```typescript
import { useProductAnalytics } from '@/hooks/useProductAnalytics';

function MyComponent() {
  const {
    trackHover,
    trackQuickView,
    trackWishlist,
    trackColorSwatch,
    trackDesignClick,
    trackQuoteClick,
    trackViewDetails
  } = useProductAnalytics();

  return (
    <div onMouseEnter={() => trackHover(productId)}>
      <button onClick={() => trackQuickView(productId)}>
        Quick View
      </button>
    </div>
  );
}
```

**Features:**
- Session-based tracking (auto-generates session ID)
- Debounced hover tracking (once per product per session)
- Silent failure (doesn't block user experience)
- Stores tracked hovers in memory to prevent duplicates

## Integration Guide

### 1. ProductCard Component

The `ProductCard` component automatically tracks:
- Hover on card container
- Quick view button clicks
- Wishlist button clicks
- Color swatch interactions
- Design button clicks
- Quote button clicks

```typescript
export const ProductCard = ({ product }: ProductCardProps) => {
  const { trackHover, trackQuickView, ... } = useProductAnalytics();

  return (
    <Card onMouseEnter={() => trackHover(product.id)}>
      {/* ... */}
      <Button onClick={() => trackQuickView(product.id)}>
        Quick View
      </Button>
    </Card>
  );
};
```

### 2. Admin Dashboard

View engagement metrics using the `ProductEngagementMetrics` component:

```typescript
import { ProductEngagementMetrics } from '@/components/admin/ProductEngagementMetrics';

function AdminDashboard() {
  return (
    <div>
      <ProductEngagementMetrics />
    </div>
  );
}
```

**Displays:**
- Top 10 products by engagement (last 30 days)
- Breakdown of interaction types
- Unique sessions per product
- Engagement score (interactions per session)

## Performance Considerations

1. **Non-Blocking Tracking**
   - Edge function returns 204 immediately
   - Database insert happens asynchronously
   - No impact on user experience

2. **Debounced Hover Events**
   - Only tracked once per session per product
   - Prevents excessive database writes
   - Reduces storage costs

3. **Materialized View**
   - Pre-aggregated metrics for fast queries
   - Refresh scheduled (can be automated with pg_cron)
   - Reduces load on `product_interactions` table

4. **Indexed Queries**
   - Composite indexes on common query patterns
   - Fast filtering by product, type, timestamp
   - Efficient session-based lookups

## Refresh Materialized View

The materialized view should be refreshed periodically to show up-to-date metrics:

### Manual Refresh (via Supabase SQL Editor)
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY product_engagement_metrics;
```

### Automated Refresh (using pg_cron extension)
```sql
-- Create cron job to refresh every hour
SELECT cron.schedule(
  'refresh-product-metrics',
  '0 * * * *',  -- Every hour at minute 0
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY product_engagement_metrics$$
);
```

### Via Edge Function
```typescript
const { data, error } = await supabase.rpc('refresh_product_engagement_metrics');
```

## Analytics Queries

### Top Products by Interaction Type
```sql
SELECT 
  product_name,
  category,
  hover_count,
  quick_view_count,
  quote_click_count,
  total_interactions
FROM product_engagement_metrics
ORDER BY total_interactions DESC
LIMIT 10;
```

### Engagement Funnel Analysis
```sql
SELECT 
  product_name,
  hover_count as step_1_hover,
  quick_view_count as step_2_quick_view,
  design_click_count as step_3_design,
  quote_click_count as step_4_quote,
  ROUND(
    (quick_view_count::numeric / NULLIF(hover_count, 0)) * 100, 2
  ) as hover_to_view_rate,
  ROUND(
    (quote_click_count::numeric / NULLIF(hover_count, 0)) * 100, 2
  ) as hover_to_quote_rate
FROM product_engagement_metrics
WHERE hover_count > 10
ORDER BY hover_to_quote_rate DESC;
```

### Popular Colors
```sql
SELECT 
  additional_data->>'color' as color,
  COUNT(*) as clicks,
  COUNT(DISTINCT session_id) as unique_users
FROM product_interactions
WHERE interaction_type = 'color_swatch_click'
  AND additional_data->>'color' IS NOT NULL
GROUP BY additional_data->>'color'
ORDER BY clicks DESC
LIMIT 10;
```

### Time-Based Trends
```sql
SELECT 
  DATE(timestamp) as date,
  interaction_type,
  COUNT(*) as interaction_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM product_interactions
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp), interaction_type
ORDER BY date DESC, interaction_count DESC;
```

## Privacy & Security

1. **Anonymous Tracking**
   - Session ID stored in sessionStorage (client-side)
   - No PII collected without user authentication
   - IP and user agent captured for fraud detection

2. **Data Access**
   - RLS policies restrict viewing to admins only
   - Users can view their own interactions if authenticated
   - Public insert allowed (for anonymous tracking)

3. **Data Retention**
   - Materialized view focuses on last 30 days
   - Consider implementing data archival for older records
   - GDPR compliance: allow users to request data deletion

## Future Enhancements

### Planned Features

1. **Heat Map Visualization**
   - Visual representation of popular products
   - Category-based engagement comparison
   - Time-based heatmaps

2. **A/B Testing Framework**
   - Test different card layouts
   - Compare CTA button variants
   - Measure conversion impact

3. **Conversion Funnel**
   - Track complete journey: hover → click → quote → order
   - Identify drop-off points
   - Calculate conversion rates

4. **Real-Time Dashboard**
   - Live metrics updates
   - Real-time visitor tracking
   - Alert on unusual patterns

5. **Predictive Analytics**
   - ML models to predict popular products
   - Recommend products based on interaction patterns
   - Forecast demand based on engagement

6. **Export & Reporting**
   - CSV/Excel export functionality
   - Automated weekly/monthly reports
   - Integration with Google Analytics

## Troubleshooting

### No Data Appearing in Dashboard

1. Check if edge function is deployed:
   ```bash
   # Via Lovable Cloud: edge functions auto-deploy
   ```

2. Verify database connection:
   ```sql
   SELECT COUNT(*) FROM product_interactions;
   ```

3. Refresh materialized view:
   ```sql
   REFRESH MATERIALIZED VIEW product_engagement_metrics;
   ```

### Tracking Not Working

1. Check browser console for errors
2. Verify `useProductAnalytics` hook is imported
3. Ensure product ID is valid UUID
4. Check network tab for edge function calls

### Performance Issues

1. Add more indexes if needed
2. Implement data archival for old records
3. Increase materialized view refresh interval
4. Consider read replicas for analytics queries

## Support

For questions or issues:
- Check logs in Supabase dashboard
- Review edge function logs
- Contact development team

---

**Last Updated:** 2025-01-17  
**Version:** 1.0.0
