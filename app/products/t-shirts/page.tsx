import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Custom T-Shirt Manufacturer Bangladesh | MOQ 50 | Private Label - Sleek Apparels',
  description: 'Custom t-shirt manufacturing from Bangladesh. MOQ 50 pieces. 180-240 GSM premium cotton. Screen printing, embroidery available. Perfect for startups & DTC brands. Get quote today.',
  keywords: [
    'custom t-shirt manufacturer bangladesh',
    'low moq t-shirt manufacturer',
    'private label t-shirt factory',
    'bangladesh t-shirt export',
    'bulk t-shirt manufacturer',
    'custom printed t-shirts manufacturer',
  ],
});

export default function TShirtsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Products', url: 'https://sleekapparels.com/products/' },
    { name: 'T-Shirts', url: 'https://sleekapparels.com/products/t-shirts/' },
  ]);

  const productSchema = generateProductSchema({
    name: 'Custom T-Shirt Manufacturing',
    description: 'High-quality custom t-shirt manufacturing with MOQ 50 pieces. Premium cotton fabrics, multiple styles, custom branding available.',
    brand: 'Sleek Apparels Limited',
    offers: {
      price: '3.00-6.00',
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
              <span>T-Shirts</span>
            </nav>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Custom T-Shirt Manufacturer Bangladesh
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-8">
              Premium custom t-shirt manufacturing with MOQ 50 pieces. 180-240 GSM fabrics. 
              100% cotton and blends. Screen printing and embroidery available. Perfect for 
              fashion startups, DTC brands, and Amazon FBA sellers.
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
                      <td className="py-3">160-240 GSM</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Lead Time:</td>
                      <td className="py-3">15-20 days bulk, 7-10 days samples</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Size Range:</td>
                      <td className="py-3">XS, S, M, L, XL, XXL, XXXL</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-semibold">Price Range:</td>
                      <td className="py-3 text-primary-600 font-bold">$3.00 - $6.00/piece</td>
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
                      <p className="font-semibold">Classic Round Neck</p>
                      <p className="text-sm text-gray-600">Standard crew neck, most popular style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">V-Neck</p>
                      <p className="text-sm text-gray-600">V-shaped neckline, modern look</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Long Sleeve</p>
                      <p className="text-sm text-gray-600">Full sleeve for cooler weather</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Henley</p>
                      <p className="text-sm text-gray-600">Button placket, casual style</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Pocket T-Shirt</p>
                      <p className="text-sm text-gray-600">Chest pocket detail</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-3 text-xl">•</span>
                    <div>
                      <p className="font-semibold">Oversized Fit</p>
                      <p className="text-sm text-gray-600">Relaxed, streetwear style</p>
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
                  name: '100% Combed Cotton',
                  gsm: '160-220 GSM',
                  description: 'Soft, breathable, durable. Perfect for everyday wear. Available in ring-spun for premium feel.',
                  bestFor: 'Premium basics, casual wear',
                },
                {
                  name: 'Cotton-Polyester 65/35',
                  gsm: '180-200 GSM',
                  description: 'Low shrinkage, wrinkle-resistant, easy care. Best for active lifestyle and frequent washing.',
                  bestFor: 'Sports teams, corporate wear',
                },
                {
                  name: 'Cotton-Polyester 50/50',
                  gsm: '180-220 GSM',
                  description: 'Balanced comfort and durability. Cost-effective option with good printability.',
                  bestFor: 'Promotional items, uniforms',
                },
                {
                  name: 'Organic Cotton',
                  gsm: '180-220 GSM',
                  description: 'Eco-friendly, GOTS certified available. Sustainable option for conscious brands.',
                  bestFor: 'Sustainable fashion brands',
                },
                {
                  name: 'Tri-Blend (Cotton-Poly-Rayon)',
                  gsm: '145-160 GSM',
                  description: 'Ultra-soft hand feel, excellent drape, vintage look. Premium retail quality.',
                  bestFor: 'High-end retail, DTC brands',
                },
                {
                  name: 'Performance Jersey',
                  gsm: '140-180 GSM',
                  description: 'Moisture-wicking, quick-dry, breathable. Polyester-based for athletic performance.',
                  bestFor: 'Athletic wear, gym apparel',
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

        {/* Customization */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-center">Customization Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Printing Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Screen Printing</p>
                      <p className="text-sm text-gray-600">Up to 12 colors, durable, cost-effective for bulk</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Heat Transfer</p>
                      <p className="text-sm text-gray-600">Full-color designs, photo quality</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Sublimation Printing</p>
                      <p className="text-sm text-gray-600">All-over prints, vibrant colors on polyester</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Discharge Printing</p>
                      <p className="text-sm text-gray-600">Soft hand feel, vintage look on dark fabrics</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Other Customizations</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Embroidery</p>
                      <p className="text-sm text-gray-600">Logo embroidery on chest, sleeve, or back</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Custom Labels & Tags</p>
                      <p className="text-sm text-gray-600">Woven labels, printed tags, care instructions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Garment Dyeing</p>
                      <p className="text-sm text-gray-600">Custom color matching, vintage wash</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <div>
                      <p className="font-semibold">Packaging</p>
                      <p className="text-sm text-gray-600">Individual poly bags, custom boxes, hangtags</p>
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
                    <th className="text-left py-3">Basic T-Shirt</th>
                    <th className="text-left py-3">Premium Cotton</th>
                    <th className="text-left py-3">With Printing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">50-100 pcs</td>
                    <td className="py-3">$5.50 - $6.00</td>
                    <td className="py-3">$6.50 - $7.00</td>
                    <td className="py-3">$7.50 - $8.50</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">101-500 pcs</td>
                    <td className="py-3">$4.50 - $5.50</td>
                    <td className="py-3">$5.50 - $6.50</td>
                    <td className="py-3">$6.50 - $7.50</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">501-1000 pcs</td>
                    <td className="py-3">$3.50 - $4.50</td>
                    <td className="py-3">$4.50 - $5.50</td>
                    <td className="py-3">$5.50 - $6.50</td>
                  </tr>
                  <tr>
                    <td className="py-3">1000+ pcs</td>
                    <td className="py-3">$3.00 - $3.50</td>
                    <td className="py-3">$4.00 - $4.50</td>
                    <td className="py-3">$5.00 - $5.50</td>
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
            <h2 className="text-4xl font-bold mb-6">Start Your Custom T-Shirt Order</h2>
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
            <h2>Why Choose Our Custom T-Shirt Manufacturing?</h2>
            <p>
              As a leading t-shirt manufacturer in Bangladesh, Sleek Apparels Limited specializes 
              in low MOQ custom t-shirt production for fashion startups, DTC brands, Amazon FBA 
              sellers, and Shopify stores worldwide. Our minimum order quantity of just 50 pieces 
              makes us ideal for brands testing new designs or launching limited collections.
            </p>
            <h3>Premium Quality at Competitive Prices</h3>
            <p>
              We use only OEKO-TEX certified fabrics that are tested for harmful substances. Our 
              t-shirts are made with high-quality cotton and cotton-blend fabrics ranging from 
              160 GSM to 240 GSM. All fabrics undergo rigorous quality checks before production. 
              Our pricing is highly competitive due to Bangladesh's favorable manufacturing costs 
              while maintaining international quality standards.
            </p>
            <h3>Fast Production and Reliable Delivery</h3>
            <p>
              Our streamlined production process ensures 15-20 day turnaround for bulk orders and 
              7-10 days for samples. We maintain buffer inventory of popular fabric colors for 
              faster execution. Our facility is equipped with modern sewing machines, quality 
              control systems, and experienced workforce capable of producing 80,000+ pieces per month.
            </p>
            <h3>Perfect for All Business Types</h3>
            <p>
              Whether you're a fashion startup testing your first design, an Amazon FBA seller 
              looking for private label products, a Shopify store owner needing custom merchandise, 
              or an established brand scaling production, our flexible MOQ and scalable capacity 
              make us the perfect manufacturing partner. We've worked with hundreds of brands across 
              USA, UK, Germany, Canada, and Australia.
            </p>
            <h3>Complete Private Label Solution</h3>
            <p>
              We offer comprehensive private label services including custom woven labels, printed 
              neck tags, care instruction labels, barcode labels, and branded packaging. Your 
              t-shirts arrive ready to sell with your brand identity. We handle fabric sourcing, 
              pattern making, sampling, bulk production, printing/embroidery, quality control, and 
              shipping - allowing you to focus on marketing and sales.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
