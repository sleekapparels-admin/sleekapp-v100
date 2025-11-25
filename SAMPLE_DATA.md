# Sample Data Documentation

## Overview

This document explains the sample/test data system for Sleek Apparels platform. Sample data allows you to test and iterate on features without manually creating data each time.

## 🔒 Security & Safety

### Safe to Use
- ✅ All test accounts use `@test.sleekapp.com` domain for easy identification
- ✅ No real payment information is stored
- ✅ No real customer emails or data
- ✅ RLS (Row Level Security) policies remain fully functional
- ✅ Can be completely removed with cleanup script

### What's Included
- **10 User Profiles**: 5 buyers + 5 suppliers + 1 admin
- **20 Portfolio Products**: Diverse product categories with realistic data
- **7 Marketplace Listings**: Ready-to-display products from suppliers
- **5 Sample Orders**: Showing buyer-supplier relationships and workflows
- **4 Blog Posts**: Industry insights and educational content
- **Certifications**: Supplier certifications (WRAP, OEKO-TEX, GOTS, BSCI)
- **Analytics Events**: Sample page views and CTA clicks
- **Lead Captures**: Sample leads for testing conversion flows

## 📁 Files

### `supabase/seed.sql`
Main seed file that populates the database with sample data.

**Important**: Before running, you must create test users in Supabase Auth dashboard and update the UUIDs in the seed file.

### `supabase/cleanup_sample_data.sql`
Removes all sample data from the database. Safe to run - only deletes records with `@test.sleekapp.com` emails.

## 🚀 How to Use Sample Data

### Step 1: Create Test Users in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user** (or use email invites)
4. Create the following test accounts:

#### Buyer Accounts (5 users)
```
Email: sarah.johnson@test.sleekapp.com
Password: TestBuyer123!
```

```
Email: michael.chen@test.sleekapp.com
Password: TestBuyer123!
```

```
Email: emily.rodriguez@test.sleekapp.com
Password: TestBuyer123!
```

```
Email: james.williams@test.sleekapp.com
Password: TestBuyer123!
```

```
Email: lisa.anderson@test.sleekapp.com
Password: TestBuyer123!
```

#### Supplier Accounts (5 users)
```
Email: ahmed.hassan@test.sleekapp.com
Password: TestSupplier123!
```

```
Email: fatima.rahman@test.sleekapp.com
Password: TestSupplier123!
```

```
Email: karim.textile@test.sleekapp.com
Password: TestSupplier123!
```

```
Email: nazma.begum@test.sleekapp.com
Password: TestSupplier123!
```

```
Email: rashid.ahmed@test.sleekapp.com
Password: TestSupplier123!
```

#### Admin Account (1 user)
```
Email: admin@test.sleekapp.com
Password: TestAdmin123!
```

### Step 2: Get User UUIDs

After creating users in Supabase Auth, note their UUIDs from the Users table.

### Step 3: Update seed.sql with Real UUIDs

Open `supabase/seed.sql` and replace the placeholder UUIDs with your actual user IDs:

```sql
-- Replace these placeholder UUIDs:
'00000000-0000-0000-0000-000000000001'::uuid  -- sarah.johnson
'00000000-0000-0000-0000-000000000002'::uuid  -- michael.chen
'00000000-0000-0000-0000-000000000003'::uuid  -- emily.rodriguez
'00000000-0000-0000-0000-000000000004'::uuid  -- james.williams
'00000000-0000-0000-0000-000000000005'::uuid  -- lisa.anderson
'00000000-0000-0000-0000-000000000101'::uuid  -- ahmed.hassan
'00000000-0000-0000-0000-000000000102'::uuid  -- fatima.rahman
'00000000-0000-0000-0000-000000000103'::uuid  -- karim.textile
'00000000-0000-0000-0000-000000000104'::uuid  -- nazma.begum
'00000000-0000-0000-0000-000000000105'::uuid  -- rashid.ahmed
'00000000-0000-0000-0000-000000000999'::uuid  -- admin
```

### Step 4: Run the Seed Script

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to Supabase Dashboard > SQL Editor
2. Click **New Query**
3. Copy the entire contents of `supabase/seed.sql`
4. Paste into the query editor
5. Click **Run**

**Option B: Via Supabase CLI**

```bash
# Make sure you're in the project root
cd /home/user/webapp

# Run the seed file
supabase db reset --db-url "your-database-url"
# OR
psql "your-database-url" < supabase/seed.sql
```

### Step 5: Verify Data

1. Log in with any test account
2. Navigate to dashboards to see sample data
3. Check marketplace for product listings
4. View blog posts and portfolio items

## 📊 Sample Data Details

### User Profiles

#### Buyers (Customers)
1. **Sarah Johnson** - Fashion Brand Owner (Urban Fashion Co)
2. **Michael Chen** - School Administrator (Green Valley High School)
3. **Emily Rodriguez** - Corporate Buyer (TechCorp Inc)
4. **James Williams** - Sports Team Manager (City United FC)
5. **Lisa Anderson** - Wholesaler (Wholesale Apparel Distributors)

#### Suppliers (Production Partners)
1. **Ahmed Hassan** - Knitwear Manufacturer (Dhaka Knitwear Ltd)
   - Specializations: T-Shirts, Polo Shirts, Hoodies, Sweatshirts
   - Capacity: 50,000 pieces/month
   - Tier: Gold

2. **Fatima Rahman** - Activewear Specialist (Active Sports Textiles)
   - Specializations: Sports Jerseys, Track Pants, Athletic Tops
   - Capacity: 35,000 pieces/month
   - Tier: Gold

3. **Karim Textile** - Uniform Manufacturer (Bengal Uniforms Manufacturing)
   - Specializations: School Uniforms, Corporate Uniforms, Workwear
   - Capacity: 25,000 pieces/month
   - Tier: Silver

4. **Nazma Begum** - Fabric Supplier (Premium Fabric Mills)
   - Specializations: Cotton Fabric, Polyester Blend, Jersey Knit
   - Capacity: 100,000 meters/month
   - Tier: Gold

5. **Rashid Ahmed** - Trims & Accessories (Dhaka Trims & Accessories)
   - Specializations: Buttons, Zippers, Labels, Packaging
   - Capacity: 200,000 units/month
   - Tier: Silver

### Products (20 items)

Portfolio includes diverse product categories:
- **T-Shirts**: Crew neck, V-neck, Oversized streetwear
- **Polo Shirts**: Classic pique, Performance polo
- **Hoodies**: Pullover fleece, Zip-up, Tech fleece
- **Sweatshirts**: Crew neck, French terry
- **Activewear**: Sports jerseys, Track pants, Compression tops
- **Uniforms**: School uniforms, Corporate uniforms, Industrial workwear
- **Tank Tops**: Athletic tank tops
- **Long Sleeve**: Performance shirts, Henley shirts

Each product includes:
- Realistic descriptions
- Competitive pricing
- Available colors and sizes
- Lead times
- MOQ requirements

### Marketplace Listings (7 items)

Ready-to-purchase products from suppliers:
- Classic Cotton T-Shirt (Dhaka Knitwear Ltd)
- Premium Polo Shirt (Dhaka Knitwear Ltd)
- Heavyweight Hoodie (Dhaka Knitwear Ltd)
- Performance Athletic Jersey (Active Sports Textiles)
- Track Suit Set (Active Sports Textiles)
- School Uniform Set (Bengal Uniforms)
- Corporate Uniform Package (Bengal Uniforms)

### Sample Orders (5 orders)

Demonstrates various order statuses and workflows:
1. **Fashion Brand → T-Shirts** (Status: Bulk Production)
2. **School → Uniforms** (Status: Sample Approved)
3. **Sports Team → Jerseys** (Status: Shipped)
4. **Corporate → Polos** (Status: Delivered)
5. **Wholesaler → Hoodies** (Status: QC Inspection)

### Blog Posts (4 posts)

Educational content covering:
1. "Why Bangladesh is the World's Second-Largest Apparel Exporter"
2. "10 Tips for Successful Apparel Sourcing from Bangladesh"
3. "How AI is Revolutionizing Apparel Sourcing"
4. "Sustainable Apparel Manufacturing: The Bangladesh Story"

Each post includes:
- Full markdown content
- Featured images (Unsplash)
- View counts
- Categories
- Author attribution

## 🧹 Cleaning Up Sample Data

When you're ready to remove all test data:

### Step 1: Run Cleanup Script

```bash
# Via Supabase Dashboard
# Copy contents of supabase/cleanup_sample_data.sql
# Paste into SQL Editor
# Run the script
```

### Step 2: Delete Auth Users

The cleanup script removes database records but **does not** delete users from Supabase Auth. You must manually delete test users:

1. Go to Supabase Dashboard > Authentication > Users
2. Find users with `@test.sleekapp.com` emails
3. Click on each user and select **Delete user**

### Step 3: Verify Cleanup

Check that all sample data is removed:
- No profiles with `@test.sleekapp.com` emails
- No sample orders or products
- No test blog posts

## 🎯 Testing Scenarios

### Buyer Testing
1. Log in as any buyer (e.g., sarah.johnson@test.sleekapp.com)
2. Browse marketplace products
3. View order history
4. Check quote history
5. Test dashboard features

### Supplier Testing
1. Log in as any supplier (e.g., ahmed.hassan@test.sleekapp.com)
2. View incoming orders
3. Check product listings
4. Test order management
5. Update production statuses

### Admin Testing
1. Log in as admin (admin@test.sleekapp.com)
2. View all orders
3. Manage users
4. Review supplier verification
5. Analyze platform analytics

## 🔄 Updating Sample Data

To modify or add sample data:

1. Edit `supabase/seed.sql`
2. Run cleanup script first (optional)
3. Run updated seed script
4. Test changes

## ⚠️ Important Notes

### RLS Compatibility
All sample data respects Row Level Security policies:
- Buyers can only see their own orders
- Suppliers can only see orders assigned to them
- Admins have full access
- Public data (products, blog posts) is visible to all

### Image URLs
Sample data uses photorealistic product images from:
- `src/lib/aiGeneratedProductImages.ts` (4K studio-quality images)
- `src/lib/portfolioImagesPhotorealistic.ts` (local WebP images)
- Unsplash (blog featured images)

### Data Relationships
Sample data maintains proper foreign key relationships:
- Orders link to buyers and suppliers
- Products link to suppliers
- User roles link to profiles
- Certifications link to suppliers

## 📞 Support

If you encounter issues with sample data:
1. Check that user UUIDs are correct
2. Verify RLS policies are enabled
3. Check Supabase logs for errors
4. Run cleanup script and try again

## 🎉 Benefits of Sample Data

1. **Faster Development**: Test features without manual data entry
2. **Realistic Testing**: Sample data mimics real-world scenarios
3. **Demo-Ready**: Show platform features to stakeholders
4. **QA Testing**: Verify workflows and user journeys
5. **UI/UX Testing**: See how pages look with real data
6. **Performance Testing**: Test with representative data volumes

## 🚀 Next Steps After Seeding

1. **Test User Flows**:
   - Complete buyer journey (browse → quote → order)
   - Complete supplier journey (receive order → update → deliver)
   - Admin workflows (manage orders, approve suppliers)

2. **Customize Data**:
   - Add more products relevant to your target market
   - Create additional order scenarios
   - Add more blog content

3. **Marketing Ready**:
   - Use sample data for screenshots
   - Create demo videos
   - Prepare marketing materials

4. **Development**:
   - Test new features with existing data
   - Verify database migrations
   - Check API endpoints

## 📋 Checklist

Before going live, ensure:
- [ ] All test accounts use `@test.sleekapp.com` domain
- [ ] No real customer data in sample data
- [ ] Sample data is clearly marked/documented
- [ ] Cleanup script is tested and works
- [ ] Production database does not contain test data
- [ ] All test users are deleted before launch

---

**Last Updated**: 2025-11-23

**Version**: 1.0.0
