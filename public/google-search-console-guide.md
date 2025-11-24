# Google Search Console Setup Guide

## Critical Actions Required for Indexation

### 1. Verify Google Search Console Ownership
1. Go to https://search.google.com/search-console
2. Add property: `sleekapparels.com`
3. Verification method: **HTML tag** (already in index.html line 61)
   - Current placeholder: `YOUR_VERIFICATION_CODE`
   - Replace with actual code from Google Search Console
4. Alternative: DNS TXT record verification

### 2. Submit XML Sitemap
1. In Google Search Console, go to **Sitemaps**
2. Submit URL: `https://sleekapparels.com/sitemap.xml`
3. Wait 24-48 hours for Google to crawl all URLs

### 3. Request Indexing for Priority Pages
Use **URL Inspection Tool** to manually request indexing:

**High Priority (Request First):**
- https://sleekapparels.com/
- https://sleekapparels.com/services
- https://sleekapparels.com/about
- https://sleekapparels.com/blog
- https://sleekapparels.com/t-shirts-manufacturer
- https://sleekapparels.com/hoodies-manufacturer
- https://sleekapparels.com/usa-buyers
- https://sleekapparels.com/european-brands

**Steps:**
1. Paste URL in URL Inspection search bar
2. Click "Request Indexing"
3. Wait for confirmation
4. Repeat for each priority URL

### 4. Verify Canonical Tags
All pages now have proper canonical tags pointing to themselves.
Check in Google Search Console → Coverage → Valid pages

### 5. Monitor Index Coverage
- Go to **Coverage** report
- Check for errors or warnings
- Common issues to fix:
  - 404 errors
  - Redirect chains
  - Blocked by robots.txt
  - Soft 404s

### 6. Check robots.txt
Current robots.txt configuration:
- ✅ Homepage allowed
- ✅ All service pages allowed
- ✅ Blog allowed
- ✅ Sitemap declared
- ✅ No accidental blocks

### 7. Enable Rich Results
Structured data is now implemented:
- Organization schema ✅
- Product schema ✅
- FAQ schema ✅
- Breadcrumb schema ✅

Test with:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

### 8. Internal Linking Strategy
✅ Breadcrumbs added to all pages
✅ Footer links to all major pages
✅ Cross-linking from blog posts
✅ Related services sections

## Expected Timeline

- **Week 1:** Homepage, /about, /services indexed
- **Week 2-3:** Product pages indexed
- **Week 4-6:** Blog posts indexed
- **Month 2-3:** Full site indexed with improved rankings

## Monitoring

Check Google Search Console weekly for:
1. Coverage errors
2. Index status
3. Search queries
4. Click-through rate (CTR)
5. Average position

## Next Steps After Indexation

1. Build backlinks from:
   - Alibaba.com supplier profile
   - Sewport.com directory
   - BGMEA member listing
   - Industry directories

2. Create Google Business Profile:
   - Complete all sections
   - Add photos
   - Verify location
   - Respond to reviews

3. Monitor Core Web Vitals:
   - Target LCP < 2.5s
   - Target INP < 200ms
   - Target CLS < 0.1

## Troubleshooting

**If pages not indexing after 2 weeks:**
1. Check for JavaScript rendering issues
2. Verify server response codes (should be 200)
3. Check for meta noindex tags
4. Verify sitemap is accessible
5. Check for crawl errors in Search Console
