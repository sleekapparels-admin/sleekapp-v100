import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Products | Custom Apparel Manufacturing Bangladesh - Sleek Apparels',
  description: 'Custom t-shirts, hoodies, activewear, knitwear, uniforms. MOQ 50 pieces. 180-320 GSM fabrics. OEKO-TEX certified. Private label manufacturing for global brands.',
  keywords: [
    'custom t-shirt manufacturer bangladesh',
    'hoodie manufacturer low moq',
    'activewear manufacturer bangladesh',
    'knitwear factory bangladesh',
    'custom clothing products',
  ],
});

export default function ProductsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Products', url: 'https://sleekapparels.com/products/' },
  ]);

  const products = [
    {
      name: 'Custom T-Shirts',
      url: '/products/t-shirts',
      description: '180-240 GSM premium t-shirts. 100% cotton, cotton-polyester blends. Round neck, V-neck, polo styles. Screen printing and embroidery available.',
      moq: '50 pieces',
      leadTime: '15-20 days',
      fabrics: ['100% Cotton', 'Cotton-Polyester', 'Organic Cotton', 'Performance Jersey'],
      price: '$3.00-$6.00',
    },
    {
      name: 'Hoodies & Sweatshirts',
      url: '/products/hoodies',
      description: '280-320 GSM fleece-lined hoodies. Pullover and zip-up styles. Kangaroo pocket, ribbed cuffs. Perfect for streetwear and athleisure brands.',
      moq: '50 pieces',
      leadTime: '18-22 days',
      fabrics: ['French Terry', 'Fleece', 'Cotton-Polyester Blend'],
      price: '$12.00-$18.00',
    },
    {
      name: 'Activewear',
      url: '/products/activewear',
      description: 'Performance fabrics with moisture-wicking properties. Leggings, sports bras, athletic tops, joggers. 4-way stretch for maximum comfort.',
      moq: '50 pieces',
      leadTime: '20-25 days',
      fabrics: ['Polyester-Spandex', 'Nylon-Spandex', 'Moisture-Wicking'],
      price: '$8.00-$15.00',
    },
    {
      name: 'Knitwear',
      url: '/products/knitwear',
      description: 'Computerized flat knitting technology. Sweaters, cardigans, pullovers. Jacquard patterns, cable knit, ribbed designs. Premium yarns.',
      moq: '50 pieces',
      leadTime: '25-30 days',
      fabrics: ['Acrylic', 'Cotton Blend', 'Wool Blend', 'Cashmere Blend'],
      price: '$15.00-$30.00',
    },
    {
      name: 'Uniforms',
      url: '/products/uniforms',
      description: 'Corporate uniforms, school uniforms, sports team apparel. Durable fabrics, custom embroidery, bulk discounts available.',
      moq: '100 pieces',
      leadTime: '15-20 days',
      fabrics: ['Polyester-Cotton', 'Twill', 'Oxford'],
      price: '$6.00-$12.00',
    },
    {
      name: 'Custom Polo Shirts',
      url: '/products/polo-shirts',
      description: '200-220 GSM pique fabric. Classic collar design. Perfect for corporate wear, golf apparel, casual wear. Custom embroidery logo.',
      moq: '50 pieces',
      leadTime: '15-20 days',
      fabrics: ['Pique Cotton', 'Cotton-Polyester', 'Performance Pique'],
      price: '$5.00-$9.00',
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      
      <div className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Custom Apparel Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              High-quality custom clothing manufacturing with low MOQ. From basic t-shirts to 
              premium knitwear, we deliver excellence in every stitch. OEKO-TEX certified fabrics.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.name} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600">{product.name.split(' ')[0]}</span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">MOQ:</span>
                        <span>{product.moq}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Lead Time:</span>
                        <span>{product.leadTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Price Range:</span>
                        <span className="text-primary-600 font-bold">{product.price}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Available Fabrics:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.fabrics.map((fabric) => (
                          <span key={fabric} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {fabric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={product.url}
                      className="block w-full text-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fabric Options */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">Fabric Options & Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Cotton Fabrics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 100% Combed Cotton (160-240 GSM)</li>
                  <li>• Organic Cotton (180-220 GSM)</li>
                  <li>• Pima Cotton (Premium)</li>
                  <li>• Slub Cotton (Textured)</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Blends</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cotton-Polyester 65/35</li>
                  <li>• Cotton-Polyester 50/50</li>
                  <li>• Tri-blend (Cotton-Poly-Rayon)</li>
                  <li>• Cotton-Spandex (Stretch)</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Moisture-Wicking Polyester</li>
                  <li>• Polyester-Spandex (4-way stretch)</li>
                  <li>• Nylon-Spandex (Athletic)</li>
                  <li>• Anti-microbial Fabrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Customization */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">Customization Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'Screen Printing',
                'Embroidery',
                'Heat Transfer',
                'Sublimation Printing',
                'Appliqué',
                'Garment Dyeing',
                'Stone Wash',
                'Custom Labels & Tags',
              ].map((option) => (
                <div key={option} className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="font-semibold">{option}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Order Custom Apparel?</h2>
            <p className="text-xl mb-8">
              Contact us with your specifications. We'll provide a detailed quote and free samples 
              to help you make the right decision.
            </p>
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
            >
              Request Quote & Samples
            </Link>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
            <h2>Custom Apparel Manufacturing from Bangladesh</h2>
            <p>
              Sleek Apparels Limited manufactures a wide range of custom apparel products for 
              brands worldwide. Our state-of-the-art facility in Dhaka, Bangladesh is equipped 
              with computerized flat knitting machines, modern sewing lines, and quality control 
              systems to ensure consistent, high-quality production.
            </p>
            <h3>Why Our Products Stand Out</h3>
            <p>
              We use only OEKO-TEX certified fabrics that are tested for harmful substances and 
              safe for human contact. Our quality control process includes pre-production sampling, 
              inline inspection during production, and final audit before shipping. Every garment 
              meets international quality standards for USA and European markets.
            </p>
            <h3>Perfect for Fashion Startups and DTC Brands</h3>
            <p>
              Our low MOQ of 50 pieces per style makes us ideal for fashion startups, direct-to-consumer 
              brands, Amazon FBA sellers, and Shopify stores. Test your designs without huge inventory 
              commitments. As your business grows, we scale with you - our monthly production capacity 
              exceeds 80,000 pieces.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
