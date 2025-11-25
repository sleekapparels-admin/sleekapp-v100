import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Custom Hoodie Manufacturer Bangladesh | MOQ 50 | Bulk Sweatshirts - Sleek Apparels',
  description: 'Custom hoodie and sweatshirt manufacturing from Bangladesh. MOQ 50 pieces. 280-320 GSM fleece-lined. Perfect for streetwear and athleisure brands. Get quote today.',
  keywords: [
    'custom hoodie manufacturer bangladesh',
    'bulk sweatshirt manufacturer',
    'low moq hoodie factory',
    'private label hoodie manufacturer',
    'bangladesh hoodie export',
    'streetwear hoodie manufacturer',
  ],
});

export default function HoodiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Products', url: 'https://sleekapparels.com/products/' },
    { name: 'Hoodies', url: 'https://sleekapparels.com/products/hoodies/' },
  ]);

  const productSchema = generateProductSchema({
    name: 'Custom Hoodie Manufacturing',
    description: 'High-quality custom hoodie and sweatshirt manufacturing with MOQ 50 pieces. Fleece-lined, multiple styles, custom branding available.',
    brand: 'Sleek Apparels Limited',
    offers: {
      price: '12.00-18.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      
      <div className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-primary-600">Products</Link>
              <span className="mx-2">/</span>
              <span>Hoodies & Sweatshirts</span>
            </nav>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Custom Hoodie & Sweatshirt Manufacturer Bangladesh
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-8">
              Premium custom hoodie manufacturing with MOQ 50 pieces. 280-320 GSM fleece-lined 
              fabric. Pullover and zip-up styles. Perfect for streetwear brands, athleisure, 
              and custom apparel businesses.
            </p>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
              >
                Request Quote
              </Link>
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 font-semibold"
              >
                Get Free Sample
              </Link>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Basic Specifications</h3>
                <table className="w-full">
                  <tbody className="space-y-3">
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">MOQ:</td>
                      <td className="py-3">50 pieces per style per color</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Fabric Weight:</td>
                      <td className="py-3">280-320 GSM</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Lead Time:</td>
                      <td className="py-3">18-22 days bulk, 7-10 days samples</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Size Range:</td>
                      <td className="py-3">XS, S, M, L, XL, XXL, XXXL</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Price Range:</td>
                      <td className="py-3 text-primary-600 font-bold">$12.00 - $18.00/piece</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold">Certifications:</td>
                      <td className="py-3">OEKO-TEX, BSCI, WRAP</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Available Styles</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Pullover Hoodie</p>
                      <p className="text-sm text-gray-600">Classic pullover with kangaroo pocket, most popular style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Zip-Up Hoodie</p>
                      <p className="text-sm text-gray-600">Full-zip front, easier on/off, layering-friendly</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Crewneck Sweatshirt</p>
                      <p className="text-sm text-gray-600">No hood, round neckline, classic casual style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Oversized Hoodie</p>
                      <p className="text-sm text-gray-600">Relaxed fit, dropped shoulders, streetwear style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Cropped Hoodie</p>
                      <p className="text-sm text-gray-600">Shorter length, modern athleisure style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Tech Hoodie</p>
                      <p className="text-sm text-gray-600">Performance fabric, moisture-wicking, athletic</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fabrics */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center">Fabric Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'French Terry',
                  gsm: '280-300 GSM',
                  description: 'Soft looped back, breathable, lightweight. Perfect for spring/fall. Good for printing and embroidery.',
                  bestFor: 'Lightweight hoodies, casual wear',
                },
                {
                  name: 'Fleece (Standard)',
                  gsm: '300-320 GSM',
                  description: 'Soft brushed interior, warm, comfortable. Most popular choice. Excellent for cold weather.',
                  bestFor: 'Winter hoodies, streetwear',
                },
                {
                  name: 'Heavy Fleece',
                  gsm: '350-400 GSM',
                  description: 'Extra thick, maximum warmth, premium feel. Best for extreme cold climates.',
                  bestFor: 'Premium winter apparel',
                },
                {
                  name: 'Cotton-Polyester Blend',
                  gsm: '280-320 GSM',
                  description: 'Durable, low shrinkage, wrinkle-resistant. 80/20 or 65/35 blends available. Easy care.',
                  bestFor: 'Corporate wear, uniforms',
                },
                {
                  name: 'Performance Fleece',
                  gsm: '260-300 GSM',
                  description: 'Moisture-wicking, quick-dry, breathable. Polyester-based with athletic properties.',
                  bestFor: 'Athletic wear, gym apparel',
                },
                {
                  name: '100% Organic Cotton',
                  gsm: '300-320 GSM',
                  description: 'Eco-friendly, GOTS certified available. Soft, breathable, sustainable choice.',
                  bestFor: 'Sustainable brands, eco-conscious',
                },
              ].map((fabric) => (
                <div key={fabric.name} className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-2">{fabric.name}</h3>
                  <p className="text-primary-600 font-semibold text-sm mb-3">{fabric.gsm}</p>
                  <p className="text-gray-600 text-sm mb-3">{fabric.description}</p>
                  <p className="text-sm"><span className="font-semibold">Best For:</span> {fabric.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center">Standard Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Construction Details</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Kangaroo Pocket</p>
                      <p className="text-sm text-gray-600">Front pouch pocket (pullover style)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Ribbed Cuffs & Hem</p>
                      <p className="text-sm text-gray-600">1x1 rib knit for shape retention</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Lined Hood</p>
                      <p className="text-sm text-gray-600">Double-layer hood, adjustable drawstring</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Set-In Sleeves</p>
                      <p className="text-sm text-gray-600">Classic fit, comfortable movement</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Quality Stitching</p>
                      <p className="text-sm text-gray-600">Flat-lock seams, reinforced stress points</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Customization Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Screen Printing</p>
                      <p className="text-sm text-gray-600">Front, back, sleeves. Up to 12 colors</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Embroidery</p>
                      <p className="text-sm text-gray-600">Logo embroidery on chest, hood, sleeves</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Custom Labels</p>
                      <p className="text-sm text-gray-600">Woven labels, printed tags, inside hood print</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Color Matching</p>
                      <p className="text-sm text-gray-600">Pantone color matching, custom dyeing</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Special Finishes</p>
                      <p className="text-sm text-gray-600">Stone wash, garment dye, distressed look</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-8 text-center">Pricing Guide</h2>
            <div className="bg-white rounded-lg p-8 shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3">Quantity</th>
                    <th className="text-left py-3">Basic Fleece</th>
                    <th className="text-left py-3">Premium Fleece</th>
                    <th className="text-left py-3">With Printing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">50-100 pcs</td>
                    <td className="py-3">$16.00 - $18.00</td>
                    <td className="py-3">$18.00 - $20.00</td>
                    <td className="py-3">$20.00 - $23.00</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">101-500 pcs</td>
                    <td className="py-3">$14.00 - $16.00</td>
                    <td className="py-3">$16.00 - $18.00</td>
                    <td className="py-3">$18.00 - $21.00</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">501-1000 pcs</td>
                    <td className="py-3">$12.00 - $14.00</td>
                    <td className="py-3">$14.00 - $16.00</td>
                    <td className="py-3">$16.00 - $19.00</td>
                  </tr>
                  <tr>
                    <td className="py-3">1000+ pcs</td>
                    <td className="py-3">$10.00 - $12.00</td>
                    <td className="py-3">$12.00 - $14.00</td>
                    <td className="py-3">$14.00 - $17.00</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-4">
                * Prices are FOB Chittagong port. Actual pricing depends on fabric, specifications, 
                and customization requirements. Contact us for exact quote.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Start Your Custom Hoodie Order</h2>
            <p className="text-xl mb-8">
              Contact us today with your specifications. We'll provide a detailed quote and arrange 
              free samples to ensure your complete satisfaction.
            </p>
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
            >
              Get Quote & Free Samples
            </Link>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
            <h2>Custom Hoodie Manufacturing from Bangladesh</h2>
            <p>
              Sleek Apparels Limited specializes in custom hoodie and sweatshirt manufacturing for 
              streetwear brands, athleisure companies, and fashion startups worldwide. Our low MOQ 
              of just 50 pieces makes us the perfect manufacturing partner for brands testing new 
              designs or launching limited collections.
            </p>
            <h3>Why Our Hoodies Stand Out</h3>
            <p>
              We use premium fleece fabrics ranging from 280 GSM to 400 GSM, all OEKO-TEX certified 
              for safety and quality. Our hoodies feature quality construction with ribbed cuffs, 
              double-lined hoods, and reinforced stitching at stress points. Every garment undergoes 
              rigorous quality control to ensure it meets international standards.
            </p>
            <h3>Perfect for Streetwear and Athleisure Brands</h3>
            <p>
              Our custom hoodies are ideal for streetwear brands, athleisure companies, fashion 
              startups, Amazon FBA sellers, and Shopify stores. We offer various styles including 
              oversized fits, cropped hoodies, tech hoodies with performance fabrics, and classic 
              pullover styles. Customization options include screen printing, embroidery, custom 
              labels, and special finishes like stone wash or garment dye.
            </p>
            <h3>Fast Production, Global Shipping</h3>
            <p>
              Our standard lead time is 18-22 days for bulk orders and 7-10 days for samples. We 
              ship worldwide to USA, UK, Germany, Canada, and Australia. FOB Chittagong port with 
              full documentation support. Our team coordinates sea freight and air freight to ensure 
              smooth delivery to your destination.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
