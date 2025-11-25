import { SEO, organizationSchema, productSchema, faqSchema, breadcrumbSchema } from '@/components/SEO';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Factory, Shield, Clock, TrendingUp, Users, Package, Zap, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CertificationBadges } from '@/components/CertificationBadges';

export default function LowMOQManufacturer() {
  const faqs = [
    {
      question: "What is your absolute minimum order quantity?",
      answer: "Our true minimum order is 50 pieces per style per color. Unlike many factories that claim 'low MOQ' but require 500+ pieces, we genuinely accept orders as small as 50 units. This allows fashion startups and DTC brands to test markets without massive inventory risk."
    },
    {
      question: "Can I split 50 pieces across different sizes?",
      answer: "Yes! You can split your 50-piece minimum across standard sizes (XS, S, M, L, XL, XXL). For example, 5 XS, 10 S, 15 M, 15 L, 5 XL = 50 total pieces. This flexibility helps you match customer demand patterns."
    },
    {
      question: "How much do samples cost and how long do they take?",
      answer: "Sample costs range from $25-50 per piece depending on complexity. We produce samples in 5-7 days including shipping time. Once approved, bulk production takes 15-20 days for orders of 50-500 pieces."
    },
    {
      question: "What's the price range for 50-piece orders?",
      answer: "Pricing depends on product complexity and fabric. Basic t-shirts: $3.50-$5.00/piece, Premium t-shirts: $5.00-$7.00/piece, Hoodies: $12.00-$18.00/piece, Activewear: $8.00-$14.00/piece. These prices include fabric, labor, printing/embroidery, and packaging (FOB Chittagong)."
    },
    {
      question: "Do you accept multi-color orders at 50-piece MOQ?",
      answer: "Yes, but the 50-piece minimum applies per style per color. So if you want 2 colors, that's 50 pieces x 2 = 100 total. However, for established clients, we offer some flexibility on color minimums after the first order."
    },
    {
      question: "What certifications do you have?",
      answer: "We are OEKO-TEX Standard 100 certified (textile safety), BSCI certified (ethical production), and WRAP certified (social compliance). All certifications are current and can be verified. We also comply with USA import requirements."
    },
    {
      question: "Can you help with tech pack development?",
      answer: "Yes! We offer tech pack development support for startups. If you have sketches or ideas but no professional tech packs, our design team can help create detailed specifications. This service costs $50-150 per design depending on complexity."
    },
    {
      question: "Do you ship directly to USA and handle Amazon FBA prep?",
      answer: "Absolutely! We ship to USA via air freight (7-10 days) or sea freight (18-25 days). We offer Amazon FBA prep services including poly bagging, labeling with FNSKU barcodes, and carton requirements. FBA prep adds $0.50-1.00 per unit."
    },
    {
      question: "What's your production capacity for small orders?",
      answer: "We have dedicated production lines for small-batch orders (50-500 pieces). Our facility produces 50,000-80,000 pieces monthly, but we allocate 20% capacity specifically for startup and small brands. This ensures fast turnaround without quality compromise."
    },
    {
      question: "Can I visit your factory before placing an order?",
      answer: "Yes, factory visits are welcome! We're located in Uttara, Dhaka, Bangladesh. Many clients visit during the sampling phase. We can also arrange video factory tours via WhatsApp or Zoom if you prefer to see operations before traveling."
    }
  ];

  const schemas = [
    organizationSchema,
    productSchema({
      name: "Low MOQ Clothing Manufacturing Service",
      description: "Custom clothing manufacturing with 50-piece minimum order. OEKO-TEX certified factory in Bangladesh for t-shirts, hoodies, activewear.",
      minPrice: "3.50",
      maxPrice: "18.00"
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://sleekapparels.com" },
      { name: "Low MOQ Manufacturer", url: "https://sleekapparels.com/low-moq-clothing-manufacturer-bangladesh" }
    ])
  ];

  return (
    <>
      <SEO
        title="Low MOQ Clothing Manufacturer Bangladesh | MOQ 50 Pieces"
        description="Bangladesh clothing manufacturer with 50-piece MOQ. OEKO-TEX & BSCI certified. Fast 15-20 day production. Perfect for fashion startups, DTC brands & Amazon FBA sellers. Get quote today."
        canonical="https://sleekapparels.com/low-moq-clothing-manufacturer-bangladesh"
        keywords="low MOQ clothing manufacturer Bangladesh, 50 piece minimum clothing, small batch apparel factory, startup clothing manufacturer, low minimum order quantity"
        schema={schemas}
        ogImage="https://sleekapparels.com/images/factory-overview.jpg"
      />

      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-sm mb-4 opacity-90">
                <Link to="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <span>Low MOQ Clothing Manufacturer</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Low MOQ Clothing Manufacturer Bangladesh: Start Your Brand with Just 50 Pieces
              </h1>
              
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                <strong>OEKO-TEX & BSCI certified factory.</strong> 50-piece minimum order. 15-20 day production. 
                Perfect for fashion startups, DTC brands, and Amazon FBA sellers.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/quote-generator">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Get Free Quote →
                  </Button>
                </Link>
                <a href="https://wa.me/8801861011367" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    WhatsApp Us
                  </Button>
                </a>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>OEKO-TEX Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5" />
                  <span>50,000+ pcs/month capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>15-20 day production</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <span>MOQ: 50 pieces</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  Starting a clothing brand shouldn't require thousands of pieces and tens of thousands of dollars. 
                  At <strong>Sleek Apparels</strong>, we specialize in <strong>low minimum order quantity (MOQ) manufacturing</strong> with 
                  just <strong>50 pieces per style per color</strong> — making us the ideal partner for fashion startups, 
                  DTC brands, and small businesses testing new markets.
                </p>
                
                <p className="text-gray-700 mb-6">
                  As an <strong>OEKO-TEX Standard 100</strong> and <strong>BSCI certified clothing manufacturer in Bangladesh</strong>, we combine 
                  ethical production practices with flexible MOQs and fast turnaround times. Whether you're launching 
                  a sustainable streetwear brand on Shopify, sourcing private label apparel for Amazon FBA, or creating 
                  custom uniforms for your team, we have the capability and experience to bring your vision to life.
                </p>

                <p className="text-gray-700 mb-6">
                  Unlike traditional Bangladesh clothing factories that require <strong>500-1,000 piece minimums</strong>, 
                  we've built our business model around serving <strong>emerging brands and entrepreneurs</strong> who need 
                  production flexibility. This allows you to test designs, validate markets, and scale gradually without 
                  massive inventory risk or cash flow strain.
                </p>
              </div>

              {/* Why Choose Section */}
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  Why Choose Sleek Apparels as Your Low MOQ Clothing Manufacturer?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">True 50-Piece MOQ (Not 500 Disguised)</h3>
                      <p className="text-gray-600">
                        Most Bangladesh factories claim "low MOQ" but require 500-1,000 pieces. We accept genuine 
                        50-piece orders, letting you test markets without massive inventory risk. Perfect for startups 
                        validating product-market fit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">OEKO-TEX & BSCI Certified</h3>
                      <p className="text-gray-600">
                        OEKO-TEX Standard 100 ensures no harmful chemicals. BSCI certification guarantees ethical 
                        working conditions, fair wages, and safe factories. Perfect for conscious brands targeting 
                        sustainable fashion consumers.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fast 15-20 Day Production</h3>
                      <p className="text-gray-600">
                        Industry average is 30-45 days. We complete 50-500 piece orders in 15-20 days from sample 
                        approval to shipping. Samples ready in 5-7 days. Get products to market faster than competitors.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Factory className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">In-House Knitwear Facility</h3>
                      <p className="text-gray-600">
                        We own our knitting machines and fabric production. No outsourcing delays. Full control over 
                        quality, lead times, and custom fabric development. Rare capability for low-MOQ manufacturers.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">USA Export Experience</h3>
                      <p className="text-gray-600">
                        We understand US market requirements: sizing standards, labeling regulations, customs documentation, 
                        FOB shipping terms. We've shipped to 200+ US brands. Smooth imports, no surprises.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Amazon FBA Prep Available</h3>
                      <p className="text-gray-600">
                        Poly bagging, FNSKU labeling, carton requirements, suffocation warnings—we handle all Amazon 
                        FBA prep. Ship directly from our factory to Amazon warehouses. Adds $0.50-1.00 per unit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Tech Pack Development Support</h3>
                      <p className="text-gray-600">
                        First-time brand owners welcome! Don't have a tech pack? We'll help create detailed specifications 
                        from your sketches. $50-150 per design. We guide startups through the entire process.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Transparent Pricing</h3>
                      <p className="text-gray-600">
                        No hidden fees. Clear quotes including fabric, labor, printing/embroidery, packaging. FOB pricing 
                        means you know exact costs. We'll even explain duty rates and landed costs to USA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certification Badges */}
              <div className="mb-12">
                <CertificationBadges />
              </div>

              {/* Products Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Products We Manufacture (50-Piece MOQ)</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">T-Shirts</h3>
                    <p className="text-gray-600 mb-4">
                      150-220 GSM, ringspun cotton, organic options, all neck styles
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Basic crew neck</li>
                      <li>✓ V-neck</li>
                      <li>✓ Long sleeve</li>
                      <li>✓ Pocket tees</li>
                    </ul>
                    <p className="font-semibold text-primary">$3.50-$7.00/piece</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Hoodies & Sweatshirts</h3>
                    <p className="text-gray-600 mb-4">
                      280-400 GSM fleece, French terry, zip or pullover
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Pullover hoodies</li>
                      <li>✓ Zip-up hoodies</li>
                      <li>✓ Crewneck sweatshirts</li>
                      <li>✓ Oversized styles</li>
                    </ul>
                    <p className="font-semibold text-primary">$12.00-$18.00/piece</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Activewear</h3>
                    <p className="text-gray-600 mb-4">
                      Moisture-wicking, 4-way stretch, compression options
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Leggings & tights</li>
                      <li>✓ Sports bras</li>
                      <li>✓ Performance tees</li>
                      <li>✓ Joggers</li>
                    </ul>
                    <p className="font-semibold text-primary">$8.00-$14.00/piece</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Polo Shirts</h3>
                    <p className="text-gray-600 mb-4">
                      180-220 GSM pique knit, professional or casual styles
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Classic pique polo</li>
                      <li>✓ Performance polo</li>
                      <li>✓ Long sleeve polo</li>
                      <li>✓ Custom embroidery</li>
                    </ul>
                    <p className="font-semibold text-primary">$6.00-$10.00/piece</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Tank Tops</h3>
                    <p className="text-gray-600 mb-4">
                      150-180 GSM, various strap widths and cuts
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Athletic tanks</li>
                      <li>✓ Racerback</li>
                      <li>✓ Stringer tanks</li>
                      <li>✓ Muscle tanks</li>
                    </ul>
                    <p className="font-semibold text-primary">$3.00-$5.50/piece</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Sweatpants & Joggers</h3>
                    <p className="text-gray-600 mb-4">
                      280 GSM fleece, tapered or straight fit
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>✓ Classic sweatpants</li>
                      <li>✓ Tapered joggers</li>
                      <li>✓ Shorts</li>
                      <li>✓ Custom pockets</li>
                    </ul>
                    <p className="font-semibold text-primary">$10.00-$16.00/piece</p>
                  </div>
                </div>

                <p className="mt-6 text-gray-600 italic">
                  All products customizable with: Screen printing, embroidery, heat transfer, custom labels, 
                  hang tags, poly bags, and custom packaging.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  Sleek Apparels vs. Traditional Manufacturers
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-4 text-left font-semibold">Feature</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold bg-green-50">Sleek Apparels</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">Traditional Factories</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">MOQ</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold text-lg">50 pieces</span>
                        </td>
                        <td className="border border-gray-300 p-4">500-1,000 pieces</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Sampling Time</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">5-7 days</span>
                        </td>
                        <td className="border border-gray-300 p-4">10-15 days</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Bulk Production</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">15-20 days</span>
                        </td>
                        <td className="border border-gray-300 p-4">30-45 days</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Target Customer</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">Startups & DTC brands</span>
                        </td>
                        <td className="border border-gray-300 p-4">Large retailers</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Knitwear</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">In-house facility</span>
                        </td>
                        <td className="border border-gray-300 p-4">Outsourced</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Certifications</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">OEKO-TEX, BSCI, WRAP</span>
                        </td>
                        <td className="border border-gray-300 p-4">Varies (often none)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">US Export</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">✓ 200+ US brands</span>
                        </td>
                        <td className="border border-gray-300 p-4">Limited experience</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Amazon FBA Support</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">✓ Labeling & prep</span>
                        </td>
                        <td className="border border-gray-300 p-4">No</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Tech Pack Support</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">✓ Yes ($50-150)</span>
                        </td>
                        <td className="border border-gray-300 p-4">No (must provide)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Price Premium</td>
                        <td className="border border-gray-300 p-4 bg-green-50">
                          <span className="text-green-700 font-bold">10-15% vs high MOQ</span>
                        </td>
                        <td className="border border-gray-300 p-4">Lower if 1,000+ pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-gray-600 italic">
                  Note: Yes, our prices are 10-15% higher than factories requiring 1,000+ pieces. But you save thousands 
                  on inventory costs and reduce risk dramatically. Most startups find this trade-off very worthwhile.
                </p>
              </div>

              {/* Perfect For Section */}
              <div className="bg-blue-50 rounded-xl p-8 mb-12">
                <h2 className="text-3xl font-bold mb-6">Perfect For:</h2>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Fashion Startups (0-3 years old):</strong> Testing market with 100-500 pieces before scaling to larger production runs. Validate product-market fit without massive upfront investment.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>DTC Brands on Shopify/WooCommerce:</strong> Direct-to-consumer brands needing flexibility for seasonal collections, limited drops, and customer-driven design testing.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Amazon FBA Private Label Sellers:</strong> Launching private label apparel on Amazon with low risk. Test multiple styles before committing to large inventory.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Sustainable Fashion Entrepreneurs:</strong> Conscious brands needing ethical, OEKO-TEX certified manufacturing with transparent supply chains and fair wages.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Streetwear & Athleisure Micro-Brands:</strong> Small brands building hype with limited releases, exclusive drops, and community-driven designs.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Corporate Uniform Buyers:</strong> Schools, sports teams, small companies needing 50-200 piece custom uniform orders without paying for 500+ pieces.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Print-on-Demand Businesses Scaling Up:</strong> POD sellers on Printful/Printify wanting to transition to bulk production for better margins while maintaining inventory flexibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Influencer & Celebrity Brands:</strong> Social media personalities launching merch lines with controlled inventory and fast turnaround for trend-driven designs.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Process Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Our 50-Piece MOQ Manufacturing Process</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Inquiry & Quote (24-48 hours)</h3>
                      <p className="text-gray-600">
                        Contact us via WhatsApp, email, or quote form. Provide tech pack or detailed description. 
                        We respond within 24-48 hours with detailed quote including fabric options, pricing breakdown, 
                        lead times, and MOQ clarification.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Sample Development (5-7 days)</h3>
                      <p className="text-gray-600">
                        Once quote approved, we produce physical samples. Cost: $25-50 per sample depending on complexity. 
                        We ship via DHL/FedEx (3-5 days globally). Review fit, fabric quality, construction, and finishing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Sample Approval & Adjustments (Your timeline)</h3>
                      <p className="text-gray-600">
                        Review samples and provide feedback. If adjustments needed, we make them (usually 2-3 days). 
                        Once you approve, we finalize production specifications and create purchase order.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Bulk Production (15-20 days)</h3>
                      <p className="text-gray-600">
                        Production begins after 50% deposit. For 50-500 piece orders, we complete in 15-20 days. 
                        Weekly progress updates with photos. Includes fabric sourcing, cutting, sewing, printing/embroidery, 
                        and quality control.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        5
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Quality Control (AQL 2.5 Inspection)</h3>
                      <p className="text-gray-600">
                        Every garment inspected using AQL 2.5 standard. Check stitching, fabric defects, measurements, 
                        colors, prints/embroidery alignment. Defect rate {'<'}2.5%. Third-party inspection available on request.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        6
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Finishing & Packaging (2-3 days)</h3>
                      <p className="text-gray-600">
                        Final ironing, folding, inserting labels/hang tags. Poly bag packaging if requested. 
                        Amazon FBA prep (FNSKU labels, suffocation warnings). Export carton packing with proper documentation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        7
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Shipment (FOB Chittagong or Air/Sea)</h3>
                      <p className="text-gray-600">
                        FOB terms: We deliver to Chittagong port, you arrange freight. Or we arrange: Air freight (7-10 days, 
                        $5-8/kg) or Sea freight (18-25 days, cheaper for bulk). Full documentation: Invoice, packing list, 
                        certificate of origin.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Total Timeline:</strong> From initial contact to delivery at your warehouse: 
                    <strong className="text-primary"> 35-45 days</strong> (includes sampling, production, and international shipping). 
                    Rush orders available with expedited timelines.
                  </p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Transparent Pricing for 50-Piece MOQ</h2>
                
                <p className="text-gray-700 mb-6">
                  Unlike traditional manufacturers with hidden fees, we provide clear, transparent pricing. 
                  All prices below are FOB Chittagong and include fabric, labor, printing/embroidery (standard), 
                  and basic packaging. <strong>No surprise charges.</strong>
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-xl mb-4">Basic T-Shirts (150-180 GSM)</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">50 pieces:</span>
                        <span className="font-semibold">$4.50-$5.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">100 pieces:</span>
                        <span className="font-semibold">$4.00-$4.50/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">300 pieces:</span>
                        <span className="font-semibold">$3.50-$4.00/pc</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Includes: 100% cotton, standard printing (1 location, 1 color), poly bag
                    </p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-xl mb-4">Premium T-Shirts (200-220 GSM)</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">50 pieces:</span>
                        <span className="font-semibold">$6.50-$7.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">100 pieces:</span>
                        <span className="font-semibold">$6.00-$6.50/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">300 pieces:</span>
                        <span className="font-semibold">$5.50-$6.00/pc</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Includes: Organic cotton or premium blend, printing, custom labels
                    </p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-xl mb-4">Hoodies (320 GSM Fleece)</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">50 pieces:</span>
                        <span className="font-semibold">$16.00-$18.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">100 pieces:</span>
                        <span className="font-semibold">$14.00-$16.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">300 pieces:</span>
                        <span className="font-semibold">$12.00-$14.00/pc</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Includes: Fleece fabric, embroidery or printing, custom trims
                    </p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-xl mb-4">Activewear (Performance Fabric)</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">50 pieces:</span>
                        <span className="font-semibold">$12.00-$14.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">100 pieces:</span>
                        <span className="font-semibold">$10.00-$12.00/pc</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">300 pieces:</span>
                        <span className="font-semibold">$8.00-$10.00/pc</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Includes: Moisture-wicking fabric, heat transfer prints, elastic trims
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-semibold mb-2">Additional Costs to Consider:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Samples:</strong> $25-50 per piece (refundable with bulk order)</li>
                    <li>• <strong>Custom Labels:</strong> $0.15-0.30 per label (woven or printed)</li>
                    <li>• <strong>Hang Tags:</strong> $0.10-0.25 per tag</li>
                    <li>• <strong>Amazon FBA Prep:</strong> $0.50-1.00 per unit</li>
                    <li>• <strong>Air Freight:</strong> $5-8 per kg (DHL/FedEx)</li>
                    <li>• <strong>Sea Freight:</strong> ~$500-800 per cubic meter (18-25 days)</li>
                  </ul>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="border rounded-lg">
                      <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold">
                        {faq.question}
                      </summary>
                      <div className="p-4 pt-0 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* Final CTA Section */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Launch Your Fashion Brand with 50-Piece MOQ?
                </h2>
                <p className="text-xl mb-6 opacity-95">
                  Get a free quote and sample in 48 hours. No commitment required.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Link to="/quote-generator">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                      Get Free Quote →
                    </Button>
                  </Link>
                  <Link to="/samples">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Request Samples
                    </Button>
                  </Link>
                  <a href="https://wa.me/8801861011367" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      WhatsApp Chat
                    </Button>
                  </a>
                </div>
                <p className="text-sm opacity-90">
                  Join 200+ fashion brands who started with just 50 pieces and scaled to thousands.
                </p>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
