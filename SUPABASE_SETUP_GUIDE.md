# Supabase Database Schema Setup Guide

## 📊 Products Table Schema

Follow these steps to create the `products` table in your Supabase dashboard:

### **Step 1: Access Supabase SQL Editor**

1. Go to <https://supabase.com/dashboard>
2. Select your project: `eqpftggctumujhutomom`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### **Step 2: Run This SQL**

Copy and paste the following SQL into the editor and click **Run**:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  moq TEXT NOT NULL DEFAULT '50 pieces',
  lead_time TEXT NOT NULL DEFAULT '15-20 days',
  fabrics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  price_range TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, slug, description, moq, lead_time, fabrics, price_range, category) VALUES
  (
    'Custom T-Shirts',
    't-shirts',
    '180-240 GSM premium t-shirts. 100% cotton, cotton-polyester blends. Round neck, V-neck, polo styles. Screen printing and embroidery available.',
    '50 pieces',
    '15-20 days',
    ARRAY['100% Cotton', 'Cotton-Polyester', 'Organic Cotton', 'Performance Jersey'],
    '$3.00-$6.00',
    't-shirts'
  ),
  (
    'Hoodies & Sweatshirts',
    'hoodies',
    '280-320 GSM fleece-lined hoodies. Pullover and zip-up styles. Kangaroo pocket, ribbed cuffs. Perfect for streetwear and athleisure brands.',
    '50 pieces',
    '18-22 days',
    ARRAY['French Terry', 'Fleece', 'Cotton-Polyester Blend'],
    '$12.00-$18.00',
    'hoodies'
  ),
  (
    'Activewear',
    'activewear',
    'Performance fabrics with moisture-wicking properties. Leggings, sports bras, athletic tops, joggers. 4-way stretch for maximum comfort.',
    '50 pieces',
    '20-25 days',
    ARRAY['Polyester-Spandex', 'Nylon-Spandex', 'Moisture-Wicking'],
    '$8.00-$15.00',
    'activewear'
  ),
  (
    'Knitwear',
    'knitwear',
    'Computerized flat knitting technology. Sweaters, cardigans, pullovers. Jacquard patterns, cable knit, ribbed designs. Premium yarns.',
    '50 pieces',
    '25-30 days',
    ARRAY['Acrylic', 'Cotton Blend', 'Wool Blend', 'Cashmere Blend'],
    '$15.00-$30.00',
    'knitwear'
  ),
  (
    'Uniforms',
    'uniforms',
    'Corporate uniforms, school uniforms, sports team apparel. Durable fabrics, custom embroidery, bulk discounts available.',
    '100 pieces',
    '15-20 days',
    ARRAY['Polyester-Cotton', 'Twill', 'Oxford'],
    '$6.00-$12.00',
    'uniforms'
  ),
  (
    'Custom Polo Shirts',
    'polo-shirts',
    '200-220 GSM pique fabric. Classic collar design. Perfect for corporate wear, golf apparel, casual wear. Custom embroidery logo.',
    '50 pieces',
    '15-20 days',
    ARRAY['Pique Cotton', 'Cotton-Polyester', 'Performance Pique'],
    '$5.00-$9.00',
    'polo-shirts'
  )
ON CONFLICT (slug) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### **Step 3: Verify the Table**

After running the SQL, verify it worked:

1. Click on **Table Editor** in the left sidebar
2. You should see the `products` table
3. Click on it to see the 6 sample products

---

## 🎨 Managing Products via Lovable Dashboard

### **Adding a New Product**

1. Go to **Table Editor** → `products`
2. Click **Insert** → **Insert row**
3. Fill in the fields:
   - **name**: "Custom Jackets"
   - **slug**: "jackets" (must be unique, URL-friendly)
   - **description**: Your product description
   - **moq**: "50 pieces"
   - **lead_time**: "20-25 days"
   - **fabrics**: Click "Edit" → Add array items like `["Nylon", "Polyester"]`
   - **price_range**: "$15.00-$25.00"
   - **category**: "jackets"
4. Click **Save**

### **Editing a Product**

1. Find the product in the table
2. Click on any cell to edit
3. Changes save automatically
4. Your website will fetch the updated data on next page load

### **Deleting a Product**

1. Click the checkbox next to the product
2. Click **Delete** button
3. Confirm deletion

---

## 🔄 How It Works

```
User visits /products/activewear
         ↓
Next.js calls getProductBySlug('activewear')
         ↓
Supabase query: SELECT * FROM products WHERE slug = 'activewear'
         ↓
Returns product data OR fallback to static data
         ↓
Page renders with product info
```

---

## 📝 TypeScript Interface (Already Created)

The `Product` interface in `lib/types.ts` matches this schema:

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  moq: string;
  leadTime: string;
  fabrics: string[];
  priceRange: string;
  category: string;
  imageUrl?: string;
}
```

---

## 🎯 Next Steps

1. **Run the SQL** in Supabase SQL Editor
2. **Verify** the table was created
3. **Test** by visiting `/products/activewear` on your site
4. **Add custom products** as your business grows

---

## 🔐 Security Notes

- ✅ **Public Read**: Anyone can view products (good for SEO)
- ✅ **Authenticated Write**: Only logged-in users can add/edit products
- ✅ **RLS Enabled**: Row Level Security protects your data
- ✅ **Fallback**: If Supabase is down, static data ensures site never breaks

---

## 💡 Pro Tips

### **Bulk Import Products**

If you have many products, create a CSV and use Supabase's import feature:

1. Table Editor → `products` → **Import data via spreadsheet**
2. Upload your CSV with columns: name, slug, description, moq, lead_time, price_range, category
3. Map the columns
4. Import

### **Add Images Later**

When you have product images:

1. Upload to Supabase Storage
2. Get the public URL
3. Update the `image_url` column
4. Modify the product page template to display images

---

**Your database is now ready for dynamic product management!** 🎉
