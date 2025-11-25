import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

export default function HomePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Low MOQ Clothing Manufacturer in Bangladesh
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              MOQ 50 Pieces | 15-20 Day Production | OEKO-TEX & BSCI Certified
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Private label clothing manufacturer specializing in t-shirts, hoodies, activewear, 
              and knitwear for USA, UK, and European brands. Perfect for startups and DTC brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Request Quote Now
              </Link>
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Sleek Apparels?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Low MOQ - 50 Pieces</h3>
              <p className="text-gray-600">
                Perfect for startups and small brands. MOQ 50 pieces per style per color. 
                Size splits allowed across 5 sizes. Test your designs without huge commitments.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4">Fast Production</h3>
              <p className="text-gray-600">
                15-20 day production time for bulk orders. 7-10 days for samples. 
                Quick turnaround without compromising quality. Rush orders available.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-4">Certified Quality</h3>
              <p className="text-gray-600">
                OEKO-TEX Standard 100, BSCI, and WRAP certified. Ethical manufacturing 
                with strict quality control. Trusted by brands in USA, UK, and Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Product Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Custom T-Shirts', url: '/products/t-shirts', desc: '180-240 GSM, 100% cotton or blends' },
              { name: 'Hoodies & Sweatshirts', url: '/products/hoodies', desc: '280-320 GSM, fleece lined' },
              { name: 'Activewear', url: '/products/activewear', desc: 'Performance fabrics, moisture-wicking' },
              { name: 'Knitwear', url: '/products/knitwear', desc: 'Sweaters, cardigans, pullovers' },
            ].map((product) => (
              <Link
                key={product.name}
                href={product.url}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.desc}</p>
                <span className="text-primary-600 font-semibold">Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">International Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-primary-600">OEKO-TEX</span>
              </div>
              <h3 className="text-xl font-bold mb-2">OEKO-TEX Standard 100</h3>
              <p className="text-gray-600">
                Tested for harmful substances. Safe for human contact. Certificate verified.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-primary-600">BSCI</span>
              </div>
              <h3 className="text-xl font-bold mb-2">BSCI Certification</h3>
              <p className="text-gray-600">
                Ethical workplace standards. Fair labor practices. Regular audits.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-primary-600">WRAP</span>
              </div>
              <h3 className="text-xl font-bold mb-2">WRAP Certification</h3>
              <p className="text-gray-600">
                Worldwide Responsible Accredited Production. Global compliance standards.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/certifications"
              className="text-primary-600 font-semibold text-lg hover:text-primary-700"
            >
              View All Certifications →
            </Link>
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Fashion Startups',
              'DTC Brands',
              'Amazon FBA Sellers',
              'Shopify Stores',
              'Boutique Owners',
              'Corporate Buyers',
              'Print-on-Demand',
              'Sustainable Brands',
            ].map((customer) => (
              <div key={customer} className="bg-white p-6 rounded-lg text-center">
                <p className="font-semibold text-lg">{customer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Clothing Line?</h2>
          <p className="text-xl mb-8">
            Get a free quote today. Share your requirements and receive a detailed estimate 
            within 24 hours. No obligations.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
          >
            Request Free Quote
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <h2>Bangladesh's Leading Low MOQ Clothing Manufacturer</h2>
          <p>
            Sleek Apparels Limited is a premium clothing manufacturer based in Dhaka, Bangladesh, 
            specializing in low minimum order quantities (MOQ 50 pieces) for fashion startups, 
            DTC brands, and small businesses worldwide. We export custom apparel to the United States, 
            United Kingdom, Germany, and other European markets.
          </p>
          <h3>Why Bangladesh for Clothing Manufacturing?</h3>
          <p>
            Bangladesh is the world's second-largest apparel exporter, known for competitive pricing, 
            skilled workforce, and ethical manufacturing practices. Our facility combines modern 
            computerized flat knitting technology with traditional craftsmanship to deliver 
            high-quality garments at affordable prices.
          </p>
          <h3>Our Manufacturing Capabilities</h3>
          <ul>
            <li><strong>Production Capacity:</strong> 50,000-80,000 pieces per month</li>
            <li><strong>Lead Time:</strong> 15-20 days for bulk orders, 7-10 days for samples</li>
            <li><strong>MOQ:</strong> 50 pieces per style per color with size splits</li>
            <li><strong>Customization:</strong> Custom labels, tags, packaging, embroidery, screen printing</li>
            <li><strong>Quality Control:</strong> Pre-production, inline, and final inspections</li>
          </ul>
          <h3>Fabric Options & Specifications</h3>
          <p>
            We work with various fabric types including 100% cotton (combed, carded, organic), 
            cotton-polyester blends (65/35, 50/50, 35/65), French terry, fleece, jersey knit, 
            pique, and performance fabrics. Fabric weights range from 160 GSM to 320 GSM 
            depending on product type.
          </p>
        </div>
      </section>
    </>
  );
}
