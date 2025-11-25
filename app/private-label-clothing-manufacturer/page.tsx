import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema, generateFAQSchema, FAQItem } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Private Label Clothing Manufacturer Bangladesh | MOQ 50 | Custom Branding | Sleek Apparels',
  description: 'Private label clothing manufacturer in Bangladesh with 50-piece MOQ. Complete branding services: custom labels, tags, packaging. OEKO-TEX certified. Perfect for fashion startups and DTC brands.',
  keywords: [
    'private label clothing manufacturer',
    'private label apparel Bangladesh',
    'custom clothing brand manufacturing',
    'white label clothing manufacturer',
    'fashion brand manufacturer',
    'private label fashion Bangladesh',
    'custom label clothing factory',
    'brand clothing manufacturer',
    'DTC clothing manufacturer',
    'Shopify clothing supplier',
  ],
  canonical: 'https://sleekapparels.com/private-label-clothing-manufacturer',
});

export default function PrivateLabelManufacturerPage() {
  const faqs: FAQItem[] = [
    {
      question: 'What exactly is private label clothing manufacturing?',
      answer: 'Private label manufacturing means we produce clothing according to your specifications and brand it exclusively for you. You provide the designs, we manufacture the products, and they\'re sold under your brand name. Unlike wholesale (buying existing products), private label gives you full control over design, fabrics, colors, sizing, and branding. You own the designs, we handle production.',
    },
    {
      question: "What's the minimum order for private label clothing?",
      answer: 'Our private label MOQ is 50 pieces per style per color. This is significantly lower than traditional private label manufacturers who typically require 500-1,000 pieces. Our low MOQ is perfect for fashion startups testing new designs, DTC brands launching limited collections, or established brands adding new product lines with minimal risk.',
    },
    {
      question: 'Do you help with design and tech pack development?',
      answer: 'Yes! Many of our private label clients are first-time brand owners. We offer tech pack development support ($50-150 per design) where our team converts your sketches or ideas into professional specifications. We\'ll help with pattern making, grading, fabric selection, trim specifications, and construction details. This service ensures your vision becomes production-ready.',
    },
    {
      question: 'Can you create custom woven or printed labels for my brand?',
      answer: 'Absolutely! We produce custom woven labels (damask, taffeta, satin), printed labels (care labels, size labels), hang tags, and packaging. Woven labels start at $0.15-0.30 per label with 50-piece minimums. We can also source custom buttons, zippers, drawcords, and other branded trims. Complete branding solutions available.',
    },
    {
      question: 'How much does private label clothing manufacturing cost?',
      answer: 'Costs depend on product complexity, fabric choice, and order volume. Basic private label t-shirts: $4.50-$6.00/piece (50 pcs). Premium hoodies: $15.00-$20.00/piece (50 pcs). Activewear: $10.00-$15.00/piece (50 pcs). These prices include fabric, labor, standard printing/embroidery, custom labels, and poly bags. Additional costs: custom hang tags ($0.10-0.25), special packaging, and shipping.',
    },
    {
      question: "What's the difference between private label and cut & sew manufacturing?",
      answer: 'Private label typically uses our existing patterns with your custom fabrics, colors, and branding—faster and more cost-effective. Cut & sew (fully custom) means we create patterns from scratch based on your unique designs—more expensive and longer lead times but unlimited design freedom. For startups, we recommend starting with private label then transitioning to cut & sew as you scale.',
    },
    {
      question: 'Can I use my own fabrics or must I use yours?',
      answer: 'Both options available! Most clients use our fabric sourcing (faster, better pricing through our suppliers). However, if you want specific fabrics, you can provide them or we can source them for you. If shipping your own fabric to Bangladesh, expect 2-3 week delays for customs clearance. We recommend fabric samples first to ensure quality meets standards.',
    },
    {
      question: 'How long does private label production take?',
      answer: 'Timeline: Tech pack finalization (3-5 days) → Sample production (5-7 days) → Sample shipping (3-5 days) → Your approval (your timeline) → Bulk production (15-20 days for 50-500 pcs) → Shipping (7-10 days air or 18-25 days sea). Total: 35-50 days from start to delivery. Rush production available for 20% surcharge (10-12 day production).',
    },
    {
      question: 'Do you offer packaging and fulfillment services?',
      answer: 'Yes! We offer poly bagging, custom packaging boxes, hang tags, stickers, and inserts. For Amazon FBA sellers, we provide FBA prep: FNSKU labeling, suffocation warnings, carton requirements. We can also arrange fulfillment partnerships in USA if you need warehousing and order processing. Let us know your requirements and we\'ll quote accordingly.',
    },
    {
      question: 'What if I want to switch manufacturers later—do I own the patterns?',
      answer: 'Yes, you own all patterns, tech packs, and designs we create for you. If you switch manufacturers, we\'ll provide digital pattern files and spec sheets. We hope you won\'t leave (our service is great!), but we believe in transparency. Many clients start with us for small batches and continue as they scale because of our quality and flexibility.',
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Private Label Manufacturer', url: 'https://sleekapparels.com/private-label-clothing-manufacturer/' },
  ]);

  const productSchema = generateProductSchema({
    name: 'Private Label Clothing Manufacturing Service',
    description: 'Custom private label apparel production with 50-piece MOQ. Full branding services including custom labels, tags, and packaging for fashion brands.',
    brand: 'Sleek Apparels Limited',
    offers: {
      price: '4.50-20.00',
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
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-sm mb-6 opacity-90">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>Private Label Clothing Manufacturer</span>
              </nav>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Private Label Clothing Manufacturer Bangladesh: Launch Your Brand with 50-Piece MOQ
              </h1>

              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Complete private label apparel solutions with <strong>50-piece minimum orders.</strong> Custom labels, tags,
                packaging, and OEKO-TEX certified production. Perfect for fashion startups and DTC brands.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/contact"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
                  <span className="text-2xl">📦</span>
                  <span>MOQ: 50 pieces</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏷️</span>
                  <span>Custom Labels & Tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span>OEKO-TEX Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>15-20 day production</span>
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
                Building a successful fashion brand requires more than great designs—you need a manufacturing partner who
                understands <strong>private label production</strong> and can bring your vision to life without requiring massive
                minimum orders. At <strong>Sleek Apparels</strong>, we specialize in{' '}
                <strong>private label clothing manufacturing</strong> with just <strong>50 pieces per style</strong>, making
                professional brand building accessible to startups, entrepreneurs, and growing DTC brands.
              </p>

              <p className="text-gray-700 mb-6">
                As a <strong>OEKO-TEX Standard 100</strong> and <strong>BSCI certified manufacturer in Bangladesh</strong>, we
                provide complete private label solutions including custom fabric sourcing, pattern development, sampling, bulk
                production, custom labeling, branded packaging, and quality control. Whether you're launching a sustainable
                streetwear brand, creating premium activewear, or building a DTC fashion empire on Shopify, we handle every aspect
                of your private label manufacturing needs.
              </p>

              <p className="text-gray-700 mb-6">
                What makes us different? We're not just a factory—we're a <strong>brand-building partner</strong>. We've helped
                200+ fashion startups launch with low MOQs, providing guidance on everything from tech pack creation to Amazon FBA
                compliance. Our flexible approach lets you start small, test markets, and scale gradually without the financial
                strain of traditional 500-1,000 piece minimums.
              </p>
            </div>
          </div>
        </section>

        {/* What is Private Label Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What is Private Label Clothing Manufacturing?</h2>

            <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
              <strong>Private label</strong> means we manufacture clothing products specifically for your brand. Unlike buying
              wholesale (existing products) or generic white-label items, private label gives you <strong>complete control</strong>{' '}
              over every aspect of your product:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-bold text-lg mb-3">Design Control</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Choose fabrics, colors, patterns</li>
                  <li>• Custom sizing and fit</li>
                  <li>• Unique style details</li>
                  <li>• Your specifications, not ours</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-4">🏷️</div>
                <h3 className="font-bold text-lg mb-3">Brand Ownership</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Your brand name and logo</li>
                  <li>• Custom woven/printed labels</li>
                  <li>• Branded hang tags</li>
                  <li>• Exclusive to your brand</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold text-lg mb-3">Packaging & Presentation</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Custom poly bags with logo</li>
                  <li>• Branded packaging boxes</li>
                  <li>• Inserts and thank you cards</li>
                  <li>• Professional presentation</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="font-bold text-lg mb-3">Market Exclusivity</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Products exclusive to you</li>
                  <li>• We don't sell to competitors</li>
                  <li>• Build unique brand identity</li>
                  <li>• No marketplace saturation</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-100 border-l-4 border-purple-600 p-6 rounded">
              <p className="font-bold mb-3 text-lg">Private Label vs Wholesale vs Cut & Sew:</p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong className="text-purple-700">• Private Label:</strong> Our existing styles + your custom
                  fabrics/colors/branding (Fastest, cost-effective)
                </p>
                <p>
                  <strong className="text-gray-600">• Wholesale:</strong> Buy existing products and resell (No customization, lowest
                  cost)
                </p>
                <p>
                  <strong className="text-blue-700">• Cut & Sew (Fully Custom):</strong> Patterns from scratch (Unlimited design
                  freedom, highest cost)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Why Choose Sleek Apparels for Private Label Manufacturing?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">True 50-Piece MOQ for Private Label</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Most private label manufacturers require 500-1,000 pieces. We accept 50-piece orders, making private label
                      accessible to startups. Test your brand without massive investment. Launch limited editions and exclusive drops.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">🏷️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">Complete Branding Services</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Custom woven labels ($0.15-0.30 each), printed care labels, hang tags, branded poly bags, custom packaging boxes.
                      We handle all branding elements so your products look professional from day one. Full-service brand setup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">📐</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">Tech Pack Development Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                      No tech pack? No problem! Our design team creates professional specifications from your sketches or ideas
                      ($50-150 per design). Includes pattern making, grading, fabric recommendations, and construction details. Perfect
                      for first-time brand owners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">Fast Sample & Production</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Samples in 5-7 days, bulk production in 15-20 days (50-500 pieces). Rush orders available with 10-12 day timeline.
                      We understand fashion brands need speed. Dedicated production lines for private label ensure no delays.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">OEKO-TEX & BSCI Certified</h3>
                    <p className="text-gray-600 leading-relaxed">
                      All fabrics tested for harmful chemicals (OEKO-TEX Standard 100). Ethical production practices (BSCI certified).
                      Safe, sustainable manufacturing your customers will appreciate. Perfect for brands targeting conscious consumers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">USA/EU Export Expertise</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Experience with USA/EU customs and compliance. Amazon FBA prep available (poly bagging, FNSKU labeling). Direct
                      shipping to fulfillment centers or your warehouse. We handle international logistics complexities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">You Own All Designs & Patterns</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Complete intellectual property ownership. All patterns, tech packs, and designs are yours. Digital files provided
                      if you ever switch manufacturers. No lock-in contracts. We earn your business through quality and service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3">Transparent Pricing Structure</h3>
                    <p className="text-gray-600 leading-relaxed">
                      No hidden fees. All-inclusive pricing: fabric, labor, QC, basic labels, poly bags. Volume discounts for 200+
                      pieces (5-15% savings). Payment terms: 30% deposit, 70% before shipping. Credit terms after establishing
                      relationship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Private Label Product Categories</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'T-Shirts & Tops',
                  desc: 'Crew neck, V-neck, scoop neck, long sleeve styles',
                  price: '$4.50-$7.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Screen printing', 'Embroidery', 'Custom labels', 'All-over print (sublimation)'],
                },
                {
                  name: 'Hoodies & Sweatshirts',
                  desc: 'Pullover, zip-up, oversized, cropped styles',
                  price: '$15.00-$20.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Embroidered logo', 'Custom zipper pulls', 'Interior branding', 'Lined hood options'],
                },
                {
                  name: 'Activewear & Athleisure',
                  desc: 'Leggings, sports bras, shorts, joggers',
                  price: '$10.00-$15.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Sublimation printing', 'Mesh panels', 'Moisture-wicking fabrics', 'Custom waistbands'],
                },
                {
                  name: 'Dresses & Skirts',
                  desc: 'Maxi, mini, midi, bodycon, A-line styles',
                  price: '$12.00-$18.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Custom prints', 'Lining options', 'Zipper or button details', 'Belt loops/ties'],
                },
                {
                  name: 'Outerwear & Jackets',
                  desc: 'Bomber jackets, windbreakers, puffer vests',
                  price: '$18.00-$28.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Custom zippers', 'Interior pockets', 'Logo embroidery', 'Water-resistant coatings'],
                },
                {
                  name: 'Loungewear & Sleepwear',
                  desc: 'Pajama sets, lounge pants, sleep shirts',
                  price: '$8.00-$14.00/piece',
                  moq: '50 pcs per style/color',
                  options: ['Soft fabrics (modal, bamboo)', 'Custom prints', 'Elastic waistbands', 'Matching sets'],
                },
              ].map((product, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.desc}</p>
                  <div className="mb-4">
                    <p className="text-purple-600 font-bold text-lg">{product.price}</p>
                    <p className="text-sm text-gray-500">{product.moq}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold text-sm mb-2">Options Available:</p>
                    <ul className="space-y-1">
                      {product.options.map((option, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-purple-600">✓</span>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our 8-Step Private Label Process</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Brand Consultation',
                  desc: 'Discuss your vision, target market, and product ideas. We provide fabric suggestions, pricing estimates, and feasibility analysis.',
                },
                {
                  step: '2',
                  title: 'Tech Pack Development',
                  desc: 'Create or refine technical specifications. Includes pattern making, grading (XS-XXL), fabric selection, trim details, and construction methods.',
                },
                {
                  step: '3',
                  title: 'Sample Production',
                  desc: '5-7 days to produce physical samples with your custom labels and branding. Revisions included until you approve fit and quality.',
                },
                {
                  step: '4',
                  title: 'Branding Setup',
                  desc: 'Design and produce custom woven labels, care labels, hang tags, packaging. You approve all branding elements before bulk production.',
                },
                {
                  step: '5',
                  title: 'Order Confirmation',
                  desc: '30% deposit secures production slot. Final spec sheet, timeline, and shipping method confirmed. Pre-production meeting via video call.',
                },
                {
                  step: '6',
                  title: 'Bulk Production',
                  desc: '15-20 days for 50-500 pieces. Daily production updates. In-line quality checks at cutting, sewing, and finishing stages.',
                },
                {
                  step: '7',
                  title: 'Final QC & Packaging',
                  desc: 'AQL 2.5 inspection standard. Each piece checked for stitching, measurements, print quality. Custom packaging applied. Photos sent for approval.',
                },
                {
                  step: '8',
                  title: 'Shipping & Delivery',
                  desc: 'Air freight (7-10 days) or sea (18-25 days). Full tracking provided. Amazon FBA prep if needed. Customs support included.',
                },
              ].map((item) => (
                <div key={item.step} className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-3">Step {item.step}</div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Private Label vs Wholesale vs Cut & Sew</h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Feature</th>
                    <th className="px-6 py-4 text-left font-bold text-purple-600">Private Label (Our Specialty)</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-500">Wholesale</th>
                    <th className="px-6 py-4 text-left font-bold text-blue-600">Cut & Sew (Custom)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-semibold">Design Freedom</td>
                    <td className="px-6 py-4 text-purple-600">High (use our patterns)</td>
                    <td className="px-6 py-4 text-gray-600">None (buy as-is)</td>
                    <td className="px-6 py-4 text-blue-600">Complete (100% custom)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Minimum Order</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">50 pieces</td>
                    <td className="px-6 py-4 text-gray-600">1-10 pieces</td>
                    <td className="px-6 py-4 text-blue-600">200-500 pieces</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Cost per Piece</td>
                    <td className="px-6 py-4 text-purple-600">$$ (Mid-range)</td>
                    <td className="px-6 py-4 text-gray-600">$ (Lowest)</td>
                    <td className="px-6 py-4 text-blue-600">$$$ (Highest)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Custom Branding</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">Yes (full branding)</td>
                    <td className="px-6 py-4 text-gray-600">Limited or none</td>
                    <td className="px-6 py-4 text-blue-600">Yes (full branding)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Production Time</td>
                    <td className="px-6 py-4 text-purple-600">15-20 days</td>
                    <td className="px-6 py-4 text-gray-600">Immediate (in stock)</td>
                    <td className="px-6 py-4 text-blue-600">30-45 days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Brand Exclusivity</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">Yes (exclusive to you)</td>
                    <td className="px-6 py-4 text-gray-600">No (shared products)</td>
                    <td className="px-6 py-4 text-blue-600">Yes (exclusive)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Fabric/Color Choice</td>
                    <td className="px-6 py-4 text-purple-600">Full control</td>
                    <td className="px-6 py-4 text-gray-600">Pre-selected only</td>
                    <td className="px-6 py-4 text-blue-600">Full control</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">Best For</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">Fashion startups, DTC brands</td>
                    <td className="px-6 py-4 text-gray-600">Resellers, boutiques</td>
                    <td className="px-6 py-4 text-blue-600">Established brands</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                <strong>Recommendation:</strong> Start with Private Label for low risk and fast launch. Scale to Cut & Sew as your
                brand grows.
              </p>
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="py-16 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-4">Success Story</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How "Urban Threads LA" Launched Their Brand with Us</h2>
              <p className="text-xl opacity-90">From concept to $250K revenue in 8 months</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">The Challenge</h3>
                <p className="leading-relaxed opacity-90">
                  Sarah, a fashion designer from Los Angeles, wanted to launch her streetwear brand but couldn't afford $30,000+ for
                  traditional manufacturer minimums. She needed a partner who understood private label and could work with her
                  $5,000 startup budget.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">Our Solution</h3>
                <ul className="space-y-2 opacity-90">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      <strong>Started with 100 pieces total</strong> (2 designs x 50 pieces) - investment of only $800
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      <strong>Created custom tech packs</strong> from her sketches ($150 for both designs)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      <strong>Produced custom woven labels and hang tags</strong> with her brand identity
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>
                      <strong>Delivered to LA in 35 days</strong> via air freight for quick market testing
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3">The Results</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold mb-2">100</div>
                    <div className="text-sm">Units sold in 2 weeks</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold mb-2">500+</div>
                    <div className="text-sm">Units after 6 months</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold mb-2">$250K</div>
                    <div className="text-sm">Revenue in 8 months</div>
                  </div>
                </div>
                <p className="mt-6 opacity-90">
                  Urban Threads LA now orders 300-500 pieces per design and has expanded to 8 product styles. They continue to work
                  with us exclusively for all private label manufacturing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Transparent Private Label Pricing</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              All prices include fabric, labor, basic branding (1 woven label + care label), QC, and poly bags. FOB Chittagong.
              Volume discounts for 200+ pieces.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  tier: 'Starter Package',
                  qty: '50-100 Pieces',
                  recommended: false,
                  products: [
                    { name: 'Basic T-Shirts', price: '$5.00-6.00' },
                    { name: 'Premium T-Shirts', price: '$6.50-8.00' },
                    { name: 'Hoodies', price: '$17.00-20.00' },
                    { name: 'Activewear', price: '$12.00-15.00' },
                  ],
                },
                {
                  tier: 'Growth Package',
                  qty: '100-200 Pieces',
                  recommended: true,
                  products: [
                    { name: 'Basic T-Shirts', price: '$4.50-5.50' },
                    { name: 'Premium T-Shirts', price: '$6.00-7.50' },
                    { name: 'Hoodies', price: '$15.00-18.00' },
                    { name: 'Activewear', price: '$11.00-13.50' },
                  ],
                },
                {
                  tier: 'Scale Package',
                  qty: '200-500 Pieces',
                  recommended: false,
                  products: [
                    { name: 'Basic T-Shirts', price: '$4.00-5.00' },
                    { name: 'Premium T-Shirts', price: '$5.50-7.00' },
                    { name: 'Hoodies', price: '$13.50-16.00' },
                    { name: 'Activewear', price: '$10.00-12.00' },
                  ],
                },
              ].map((tier, index) => (
                <div
                  key={index}
                  className={`relative bg-white border-2 rounded-xl p-8 ${
                    tier.recommended ? 'border-purple-600 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.tier}</h3>
                    <p className="text-gray-600">{tier.qty}</p>
                  </div>
                  <div className="space-y-4">
                    {tier.products.map((product, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="font-bold text-purple-600">{product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Additional Services (Optional):</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2">
                    <strong>Branding & Packaging:</strong>
                  </p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Custom woven labels: $0.15-0.30 each</li>
                    <li>• Hang tags with string: $0.10-0.25 each</li>
                    <li>• Custom poly bags with logo: $0.30-0.50 each</li>
                    <li>• Branded boxes: $0.80-1.50 each</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2">
                    <strong>Production & Services:</strong>
                  </p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Tech pack development: $50-150 per design</li>
                    <li>• Rush production (10-12 days): +20% surcharge</li>
                    <li>• Amazon FBA prep: $0.50-1.00 per unit</li>
                    <li>• Air freight to USA: $4-7 per kg</li>
                  </ul>
                </div>
              </div>
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
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Private Label Brand?</h2>
            <p className="text-xl mb-8 opacity-95">
              Get a free quote within 24 hours. Share your ideas, we'll provide pricing and timeline. No commitment required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
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
              📧 Email: info@sleekapparels.com | 🏭 Factory: Uttara, Dhaka, Bangladesh | 🌍 Shipping: Worldwide | 🏷️ Your Brand,
              Our Expertise
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
