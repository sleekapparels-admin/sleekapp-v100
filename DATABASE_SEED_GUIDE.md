SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'quote_configurations',
  'ai_quotes', 
  'timeline_predictions',
  'ai_quote_rate_limits',
  'ai_usage_logs'
);
```

Expected result: 5 rows returned with the table names listed above.

### Check Table Structure

To verify a specific table structure, run:

```sql
\d public.quote_configurations
```

This will show the table schema including columns, types, and constraints.

### Verify Data Exists

Check if tables have data:

```sql
-- Check quote configurations
SELECT COUNT(*) as config_count FROM public.quote_configurations;

-- Check AI quotes (should be 0 initially)
SELECT COUNT(*) as quotes_count FROM public.ai_quotes;

-- Check timeline predictions (should be 0 initially)  
SELECT COUNT(*) as predictions_count FROM public.timeline_predictions;
```

## 2. Verify Quote Configurations

### Check Current Configurations

Run this query to see what product categories are configured:

```sql
SELECT 
  product_category,
  base_price_per_unit,
  moq_min,
  moq_max,
  sampling_days,
  production_days_per_100_units,
  base_lead_time_days,
  is_active
FROM public.quote_configurations 
ORDER BY product_category;
```

### Expected Data

Based on the migration file `20251006035054_0d34d898-a7a0-44c8-9905-db12856f802e.sql`, you should have at least these configurations:

- **knitwear**: Base price $8.50, MOQ 50-300, 35 days lead time
- **cut_and_sew**: Base price $12.00, MOQ 100-500, 40 days lead time  
- **uniforms**: Base price $15.00, MOQ 100-1000, 45 days lead time

### Add Missing Configurations

If configurations are missing, use the seed script below to add them.

## 3. Seed Data Script

Run this SQL script in your Supabase SQL Editor to insert default quote configurations for all product categories:

```sql
-- Insert comprehensive quote configurations for Bangladesh garment manufacturing
INSERT INTO public.quote_configurations (
  product_category, 
  base_price_per_unit, 
  moq_min, 
  moq_max, 
  sampling_days, 
  production_days_per_100_units, 
  base_lead_time_days
) VALUES
-- Existing categories (from migration)
('knitwear', 8.50, 50, 300, 7, 5, 35),
('cut_and_sew', 12.00, 100, 500, 10, 6, 40),
('uniforms', 15.00, 100, 1000, 10, 7, 45),

-- Additional categories
('polo_shirt', 9.50, 100, 500, 8, 5, 30),
('t_shirt', 7.00, 100, 1000, 7, 4, 25),
('hoodie', 14.00, 50, 300, 10, 6, 35),
('sweatshirt', 11.00, 100, 500, 9, 5, 32),
('jacket', 18.00, 50, 200, 12, 8, 45),
('pants', 13.00, 100, 500, 10, 7, 40),
('shorts', 8.00, 200, 1000, 8, 5, 28),
('dress', 16.00, 50, 300, 11, 6, 38),
('skirt', 10.00, 100, 500, 9, 5, 30),
('blouse', 9.00, 100, 500, 8, 5, 28),
('shirt', 10.50, 100, 500, 9, 5, 32),
('leggings', 9.50, 200, 1000, 8, 5, 30),
('underwear', 6.00, 500, 5000, 7, 3, 25),
('socks', 3.50, 1000, 10000, 6, 2, 20),
('hat', 5.50, 200, 1000, 7, 4, 22),
('scarf', 7.50, 100, 500, 8, 4, 25),
('gloves', 8.50, 200, 1000, 9, 4, 28),
('bag', 12.00, 50, 200, 10, 6, 35),
('towel', 4.50, 300, 2000, 7, 3, 20),
('bedding', 15.00, 50, 200, 12, 8, 40)
ON CONFLICT (product_category) DO NOTHING;
```

**Notes:**
- Prices are in USD per unit
- MOQ = Minimum Order Quantity
- Sampling days = Time to create samples
- Production days per 100 units = Manufacturing time scaling factor
- Base lead time = Total days from order to delivery (including sampling)

## 4. Verify RLS Policies

### Check RLS Status

Run this query to see which tables have RLS enabled:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'quote_configurations',
  'ai_quotes',
  'timeline_predictions', 
  'ai_quote_rate_limits',
  'ai_usage_logs'
);
```

All tables should show `rowsecurity = t` (true).

### View RLS Policies

To see policies for a specific table:

```sql
SELECT * FROM pg_policies WHERE tablename = 'quote_configurations';
```

### Common RLS Issues and Fixes

**Issue: Edge functions can't access tables**
- **Cause**: Service role key not being used or RLS policies too restrictive
- **Fix**: Ensure edge functions use `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS

**Issue: Anonymous users can't create quotes**
- **Cause**: Missing policy for INSERT on ai_quotes
- **Fix**: The migration includes `CREATE POLICY "Anyone can create quotes"` which should allow anonymous inserts

**Issue: Users can't view their quotes**
- **Cause**: Policy logic issue with session_id vs user authentication
- **Fix**: Check that the policy allows access when `auth.uid() IS NULL` for anonymous sessions

### Verify Service Role Bypass

Test that the service role can access all data (run this as a service role query):

```sql
-- This should return all configurations regardless of is_active
SELECT COUNT(*) FROM public.quote_configurations;
```

## 5. Test Database Access

### Simple SQL Queries

Test basic database connectivity:

```sql
-- Test select
SELECT 1 as test;

-- Test table access
SELECT id, product_category FROM public.quote_configurations LIMIT 5;

-- Test insert (will be rolled back)
BEGIN;
INSERT INTO public.ai_quotes (product_type, quantity, quote_data, total_price, estimated_delivery_days) 
VALUES ('test', 100, '{}', 1000.00, 30);
ROLLBACK;
```

### Test Edge Function Database Access

To test if edge functions can access the database:

1. Deploy the `ai-quote-generator` function (see EDGE_FUNCTION_DEPLOYMENT_GUIDE.md)
2. Call it with test data and check if it can query `quote_configurations`
3. Check function logs in Supabase dashboard for any database errors

Example test call (using curl or Postman):

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ai-quote-generator' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "productType": "t_shirt",
    "quantity": 500,
    "complexityLevel": "simple"
  }'