import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema, generateFAQSchema, FAQItem } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Low MOQ Clothing Manufacturer Bangladesh | MOQ 50 Pieces | Sleek Apparels',
  description: 'Bangladesh clothing manufacturer with 50-piece MOQ. OEKO-TEX & BSCI certified. Fast 15-20 day production. Perfect for fashion startups, DTC brands & Amazon FBA sellers. Get quote today.',
  keywords: [
    'low MOQ clothing manufacturer Bangladesh',
    '50 piece minimum clothing',
    'small batch apparel factory',
    'startup clothing manufacturer',
    'low minimum order quantity',
    'Bangladesh garment factory low moq',
    'ethical clothing manufacturer',
    'fashion startup manufacturer',
    'DTC brand clothing supplier',
    'Amazon FBA apparel manufacturer',
  ],
  canonical: 'https://sleekapparels.com/low-moq-clothing-manufacturer-bangladesh',
});

export default function LowMOQManufacturerPage() {
  const faqs: FAQItem[] = [
    {
      question: 'What is your absolute minimum order quantity?',
      answer: 'Our true minimum order is 50 pieces per style per color. Unlike many factories that claim "low MOQ" but require 500+ pieces, we genuinely accept orders as small as 50 units. This allows fashion startups and DTC brands to test markets without massive inventory risk.',
    },
    {
      question: 'Can I split 50 pieces across different sizes?',
      answer: 'Yes! You can split your 50-piece minimum across standard sizes (XS, S, M, L, XL, XXL). For example, 5 XS, 10 S, 15 M, 15 L, 5 XL = 50 total pieces. This flexibility helps you match customer demand patterns.',
    },
    {
      question: 'How much do samples cost and how long do they take?',
      answer: 'Sample costs range from $25-50 per piece depending on complexity. We produce samples in 5-7 days including shipping time. Once approved, bulk production takes 15-20 days for orders of 50-500 pieces.',
    },
    {
      question: "What's the price range for 50-piece orders?",
      answer: 'Pricing depends on product complexity and fabric. Basic t-shirts: $3.50-$5.00/piece, Premium t-shirts: $5.00-$7.00/piece, Hoodies: $12.00-$18.00/piece, Activewear: $8.00-$14.00/piece. These prices include fabric, labor, printing/embroidery, and packaging (FOB Chittagong).',
    },
    {
      question: 'Do you accept multi-color orders at 50-piece MOQ?',
      answer: 'Yes, but the 50-piece minimum applies per style per color. So if you want 2 colors, that\'s 50 pieces x 2 = 100 total. However, for established clients, we offer some flexibility on color minimums after the first order.',
    },
    {
      question: 'What certifications do you have?',
      answer: 'We are OEKO-TEX Standard 100 certified (textile safety), BSCI certified (ethical production), and WRAP certified (social compliance). All certifications are current and can be verified. We also comply with USA import requirements.',
    },
    {
      question: 'Can you help with tech pack development?',
      answer: 'Yes! We offer tech pack development support for startups. If you have sketches or ideas but no professional tech packs, our design team can help create detailed specifications. This service costs $50-150 per design depending on complexity.',
    },
    {
      question: 'Do you ship directly to USA and handle Amazon FBA prep?',
      answer: 'Absolutely! We ship to USA via air freight (7-10 days) or sea freight (18-25 days). We offer Amazon FBA prep services including poly bagging, labeling with FNSKU barcodes, and carton requirements. FBA prep adds $0.50-1.00 per unit.',
    },
    {
      question: "What's your production capacity for small orders?",
      answer: 'We have dedicated production lines for small-batch orders (50-500 pieces). Our facility produces 50,000-80,000 pieces monthly, but we allocate 20% capacity specifically for startup and small brands. This ensures fast turnaround without quality compromise.',
    },
    {
      question: 'Can I visit your factory before placing an order?',
      answer: 'Yes, factory visits are welcome! We\'re located in Uttara, Dhaka, Bangladesh. Many clients visit during the sampling phase. We can also arrange video factory tours via WhatsApp or Zoom if you prefer to see operations before traveling.',
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Low MOQ Manufacturer', url: 'https://sleekapparels.com/low-moq-clothing-manufacturer-bangladesh/' },
  ]);

  const productSchema = generateProductSchema({
    name: 'Low MOQ Clothing Manufacturing Service',
    description: 'Custom clothing manufacturing with 50-piece minimum order. OEKO-TEX certified factory in Bangladesh for t-shirts, hoodies, activewear.',
    brand: 'Sleek Apparels Limited',
    offers: {
      price: '3.50-18.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  });

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-sm mb-6 opacity-90">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>Low MOQ Clothing Manufacturer</span>
              </nav>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Low MOQ Clothing Manufacturer Bangladesh: Start Your Brand with Just 50 Pieces
              </h1>

              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                <strong>OEKO-TEX & BSCI certified factory.</strong> 50-piece minimum order. 15-20 day production. Perfect
                for fashion startups, DTC brands, and Amazon FBA sellers.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/contact"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Free Quote →
                </Link>
                <a
                  href="https://wa.me/8801861011367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span>OEKO-TEX Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏭</span>
                  <span>50,000+ pcs/month capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>15-20 day production</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span>MOQ: 50 pieces</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Starting a clothing brand shouldn't require thousands of pieces and tens of thousands of dollars. At{' '}
                <strong>Sleek Apparels</strong>, we specialize in <strong>low minimum order quantity (MOQ) manufacturing</strong>{' '}
                with just <strong>50 pieces per style per color</strong> — making us the ideal partner for fashion startups,
                DTC brands, and small businesses testing new markets.
              </p>

              <p className="text-gray-700 mb-6">
                As an <strong>OEKO-TEX Standard 100</strong> and <strong>BSCI certified clothing manufacturer in Bangladesh</strong>, we
                combine ethical production practices with flexible MOQs and fast turnaround times. Whether you're launching a
                sustainable streetwear brand on Shopify, sourcing private label apparel for Amazon FBA, or creating custom
                uniforms for your team, we have the capability and experience to bring your vision to life.
              </p>

              <p className="text-gray-700 mb-6">
                Unlike traditional Bangladesh clothing factories that require <strong>500-1,000 piece minimums</strong>, we've built
                our business model around serving <strong>emerging brands and entrepreneurs</strong> who need production flexibility.
                This allows you to test designs, validate markets, and scale gradually without massive inventory risk or cash flow
                strain.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 text-center">
              Why Choose Sleek Apparels as Your Low MOQ Clothing Manufacturer?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">True 50-Piece MOQ (Not 500 Disguised)</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Most Bangladesh factories claim "low MOQ" but require 500-1,000 pieces. We accept genuine 50-piece orders,
                      letting you test markets without massive inventory risk. Perfect for startups validating product-market fit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">OEKO-TEX & BSCI Certified</h3>
                    <p className="text-gray-600 leading-relaxed">
                      OEKO-TEX Standard 100 ensures no harmful chemicals. BSCI certification guarantees ethical working conditions,
                      fair wages, and safe factories. Perfect for conscious brands targeting USA and EU markets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Fast 15-20 Day Production</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Quick turnaround for small orders. Samples in 5-7 days, bulk production in 15-20 days. Rush orders available
                      with 10-12 day timeline. Dedicated production lines for low MOQ orders ensure no delays.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Size Split Flexibility</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Split 50 pieces across XS-XXL sizes. Example: 5 XS, 10 S, 15 M, 15 L, 5 XL = 50 total. Match your customer
                      demographics without overstock or stock-outs. Data-driven size allocation guidance available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Startup-Friendly Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tech pack development, fabric sourcing guidance, quality control support, and shipping coordination. We
                      understand startups need more than just manufacturing — we're your production partner.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">USA Export Expertise</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Experience with USA customs, shipping documentation, and compliance. Amazon FBA prep services available
                      (poly bagging, labeling, FNSKU). Direct shipping to USA fulfillment centers or your warehouse.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Full Customization Options</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Screen printing, embroidery, sublimation, heat transfer, woven labels, hang tags, custom packaging. Your
                      brand, your way. Design support available for branding elements and packaging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">Transparent Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      No hidden fees. Prices include fabric, labor, quality control, and basic packaging. Payment terms: 30%
                      deposit, 70% before shipping. Volume discounts for 200+ pieces (5-15% savings).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Products We Manufacture at 50-Piece MOQ</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Custom T-Shirts',
                  desc: '180-240 GSM, 100% cotton or blends, crew/V-neck styles',
                  price: '$3.50-$6.00/piece',
                  features: ['Screen printing', 'Embroidery', 'DTG printing', 'Custom labels'],
                },
                {
                  name: 'Hoodies & Sweatshirts',
                  desc: '280-320 GSM fleece, pullover or zip-up styles',
                  price: '$12.00-$18.00/piece',
                  features: ['Lined hood', 'Kangaroo pocket', 'Custom embroidery', 'Metal zippers'],
                },
                {
                  name: 'Activewear',
                  desc: 'Moisture-wicking polyester blends, 4-way stretch',
                  price: '$8.00-$14.00/piece',
                  features: ['Sublimation printing', 'Flatlock seams', 'Mesh panels', 'UPF protection'],
                },
                {
                  name: 'Polo Shirts',
                  desc: '180-220 GSM pique knit, classic collar',
                  price: '$4.50-$7.00/piece',
                  features: ['Button placket', 'Side vents', 'Embroidered logo', 'Custom buttons'],
                },
                {
                  name: 'Sweatpants & Joggers',
                  desc: '280-320 GSM fleece, elastic waistband with drawstring',
                  price: '$9.00-$14.00/piece',
                  features: ['Side pockets', 'Elastic cuffs', 'Custom printing', 'Tapered fit'],
                },
                {
                  name: 'Tank Tops & Singlets',
                  desc: '160-200 GSM, racerback or regular styles',
                  price: '$3.00-$5.50/piece',
                  features: ['Ribbed knit', 'Binding finish', 'Screen printing', 'Lightweight fabric'],
                },
              ].map((product, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.desc}</p>
                  <p className="text-primary-600 font-bold text-lg mb-4">{product.price}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-primary-600">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Sleek Apparels vs. Traditional Factories</h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Feature</th>
                    <th className="px-6 py-4 text-left font-bold text-primary-600">Sleek Apparels</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-500">Traditional Factory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-semibold">Minimum Order Quantity</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">50 pieces</td>
                    <td className="px-6 py-4 text-gray-600">500-1,000 pieces</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Production Time</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">15-20 days</td>
                    <td className="px-6 py-4 text-gray-600">30-45 days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Sample Time</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">5-7 days</td>
                    <td className="px-6 py-4 text-gray-600">10-15 days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Size Split Flexibility</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">Yes, across XS-XXL</td>
                    <td className="px-6 py-4 text-gray-600">Limited or no splits</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Tech Pack Support</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">Yes, $50-150/design</td>
                    <td className="px-6 py-4 text-gray-600">Not provided</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Amazon FBA Prep</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">Yes, +$0.50-1.00/unit</td>
                    <td className="px-6 py-4 text-gray-600">Not offered</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Startup Support</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">Full guidance</td>
                    <td className="px-6 py-4 text-gray-600">Self-service only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Certifications</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">OEKO-TEX, BSCI, WRAP</td>
                    <td className="px-6 py-4 text-gray-600">May not have</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Payment Terms</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">30% deposit, 70% before ship</td>
                    <td className="px-6 py-4 text-gray-600">50% deposit, 50% before ship</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Communication</td>
                    <td className="px-6 py-4 text-primary-600 font-bold">English, WhatsApp, Email</td>
                    <td className="px-6 py-4 text-gray-600">Language barriers common</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Perfect For These Business Models</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🚀',
                  title: 'Fashion Startups',
                  desc: 'Launch your brand with minimal risk. Test designs with 50-piece orders before scaling.',
                },
                {
                  icon: '🛒',
                  title: 'DTC Brands (Shopify)',
                  desc: 'Exclusive designs for your online store. Private label with your branding from day one.',
                },
                {
                  icon: '📦',
                  title: 'Amazon FBA Sellers',
                  desc: 'Custom apparel for Amazon listings. FBA prep services available for seamless fulfillment.',
                },
                {
                  icon: '🎨',
                  title: 'Print-on-Demand Plus',
                  desc: 'Better margins than POD. Bulk orders at $3.50-5/piece vs $8-12/piece from Printful.',
                },
                {
                  icon: '🏃',
                  title: 'Activewear Brands',
                  desc: 'Performance fabrics, moisture-wicking tech. Perfect for yoga, gym, and athleisure brands.',
                },
                {
                  icon: '🎤',
                  title: 'Influencer Merch',
                  desc: 'Launch merchandise for your community. Limited drops with quick turnaround times.',
                },
                {
                  icon: '🏢',
                  title: 'Corporate Uniforms',
                  desc: 'Small to mid-size companies. Custom branded apparel for teams without huge minimums.',
                },
                {
                  icon: '🎪',
                  title: 'Event Merchandise',
                  desc: 'Festivals, conferences, sports events. Fast production for time-sensitive orders.',
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Process */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our 7-Step Manufacturing Process</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Design Consultation',
                  desc: 'Share your vision, sketches, or tech packs. We review feasibility, suggest fabrics, estimate costs.',
                },
                {
                  step: '2',
                  title: 'Sample Development',
                  desc: '5-7 days to produce physical samples. Revisions included. Approve fit, fabric, and branding.',
                },
                {
                  step: '3',
                  title: 'Order Confirmation',
                  desc: '30% deposit to begin bulk production. Detailed spec sheet and timeline provided.',
                },
                {
                  step: '4',
                  title: 'Fabric Sourcing',
                  desc: 'We source certified fabrics from trusted mills. OEKO-TEX tested for safety compliance.',
                },
                {
                  step: '5',
                  title: 'Production (15-20 days)',
                  desc: 'Cutting, sewing, quality checks at multiple stages. Daily production updates available.',
                },
                {
                  step: '6',
                  title: 'Quality Control',
                  desc: 'AQL 2.5 inspection standard. Each piece checked for stitching, print quality, measurements.',
                },
                {
                  step: '7',
                  title: 'Shipping & Delivery',
                  desc: 'Air freight (7-10 days) or sea (18-25 days). Track shipment from factory to your door.',
                },
              ].map((item) => (
                <div key={item.step} className="bg-white/10 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-primary-400 mb-3">Step {item.step}</div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparent Pricing */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Transparent Pricing (No Hidden Fees)</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              All prices FOB Chittagong. Includes fabric, labor, quality control, and basic packaging. Volume discounts available
              for 200+ pieces.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  tier: '50-100 Pieces',
                  recommended: false,
                  products: [
                    { name: 'Basic T-Shirts', price: '$4.50-5.50' },
                    { name: 'Premium T-Shirts', price: '$6.00-7.50' },
                    { name: 'Hoodies', price: '$15.00-18.00' },
                    { name: 'Activewear', price: '$11.00-14.00' },
                  ],
                },
                {
                  tier: '100-200 Pieces',
                  recommended: true,
                  products: [
                    { name: 'Basic T-Shirts', price: '$4.00-5.00' },
                    { name: 'Premium T-Shirts', price: '$5.50-7.00' },
                    { name: 'Hoodies', price: '$13.50-16.00' },
                    { name: 'Activewear', price: '$10.00-12.50' },
                  ],
                },
                {
                  tier: '200-300 Pieces',
                  recommended: false,
                  products: [
                    { name: 'Basic T-Shirts', price: '$3.50-4.50' },
                    { name: 'Premium T-Shirts', price: '$5.00-6.50' },
                    { name: 'Hoodies', price: '$12.00-14.50' },
                    { name: 'Activewear', price: '$9.00-11.00' },
                  ],
                },
              ].map((tier, index) => (
                <div
                  key={index}
                  className={`relative bg-gray-50 p-8 rounded-xl ${
                    tier.recommended ? 'ring-2 ring-primary-600 shadow-lg' : ''
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-6 text-center">{tier.tier}</h3>
                  <div className="space-y-4">
                    {tier.products.map((product, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="font-bold text-primary-600">{product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-gray-700">
                <strong>Add-Ons:</strong> Screen printing +$0.50-1.50/piece • Embroidery +$1.00-2.50/piece • Custom labels
                +$0.20-0.50/piece • Hang tags +$0.15-0.30/piece • Amazon FBA prep +$0.50-1.00/unit
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Clothing Brand?</h2>
            <p className="text-xl mb-8 opacity-95">
              Get a free quote within 24 hours. No commitment required. Let's bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Free Quote →
              </Link>
              <a
                href="https://wa.me/8801861011367"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors inline-block"
              >
                WhatsApp: +880 186 101 1367
              </a>
            </div>

            <p className="text-sm opacity-90">
              📧 Email: info@sleekapparels.com | 🏭 Factory: Uttara, Dhaka, Bangladesh | 🌍 Shipping: Worldwide
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
