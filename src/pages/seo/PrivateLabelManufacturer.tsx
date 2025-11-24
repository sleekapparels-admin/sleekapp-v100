import { SEO, organizationSchema, productSchema, faqSchema, breadcrumbSchema } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Package, Palette, Tag, Truck, Users, Shield, Zap, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CertificationBadges } from '@/components/CertificationBadges';

export default function PrivateLabelManufacturer() {
  const faqs = [
    {
      question: "What exactly is private label clothing manufacturing?",
      answer: "Private label manufacturing means we produce clothing according to your specifications and brand it exclusively for you. You provide the designs, we manufacture the products, and they're sold under your brand name. Unlike wholesale (buying existing products), private label gives you full control over design, fabrics, colors, sizing, and branding. You own the designs, we handle production."
    },
    {
      question: "What's the minimum order for private label clothing?",
      answer: "Our private label MOQ is 50 pieces per style per color. This is significantly lower than traditional private label manufacturers who typically require 500-1,000 pieces. Our low MOQ is perfect for fashion startups testing new designs, DTC brands launching limited collections, or established brands adding new product lines with minimal risk."
    },
    {
      question: "Do you help with design and tech pack development?",
      answer: "Yes! Many of our private label clients are first-time brand owners. We offer tech pack development support ($50-150 per design) where our team converts your sketches or ideas into professional specifications. We'll help with pattern making, grading, fabric selection, trim specifications, and construction details. This service ensures your vision becomes production-ready."
    },
    {
      question: "Can you create custom woven or printed labels for my brand?",
      answer: "Absolutely! We produce custom woven labels (damask, taffeta, satin), printed labels (care labels, size labels), hang tags, and packaging. Woven labels start at $0.15-0.30 per label with 50-piece minimums. We can also source custom buttons, zippers, drawcords, and other branded trims. Complete branding solutions available."
    },
    {
      question: "How much does private label clothing manufacturing cost?",
      answer: "Costs depend on product complexity, fabric choice, and order volume. Basic private label t-shirts: $4.50-$6.00/piece (50 pcs). Premium hoodies: $15.00-$20.00/piece (50 pcs). Activewear: $10.00-$15.00/piece (50 pcs). These prices include fabric, labor, standard printing/embroidery, custom labels, and poly bags. Additional costs: custom hang tags ($0.10-0.25), special packaging, and shipping."
    },
    {
      question: "What's the difference between private label and cut & sew manufacturing?",
      answer: "Private label typically uses our existing patterns with your custom fabrics, colors, and branding—faster and more cost-effective. Cut & sew (fully custom) means we create patterns from scratch based on your unique designs—more expensive and longer lead times but unlimited design freedom. For startups, we recommend starting with private label then transitioning to cut & sew as you scale."
    },
    {
      question: "Can I use my own fabrics or must I use yours?",
      answer: "Both options available! Most clients use our fabric sourcing (faster, better pricing through our suppliers). However, if you want specific fabrics, you can provide them or we can source them for you. If shipping your own fabric to Bangladesh, expect 2-3 week delays for customs clearance. We recommend fabric samples first to ensure quality meets standards."
    },
    {
      question: "How long does private label production take?",
      answer: "Timeline: Tech pack finalization (3-5 days) → Sample production (5-7 days) → Sample shipping (3-5 days) → Your approval (your timeline) → Bulk production (15-20 days for 50-500 pcs) → Shipping (7-10 days air or 18-25 days sea). Total: 35-50 days from start to delivery. Rush production available for 20% surcharge (10-12 day production)."
    },
    {
      question: "Do you offer packaging and fulfillment services?",
      answer: "Yes! We offer poly bagging, custom packaging boxes, hang tags, stickers, and inserts. For Amazon FBA sellers, we provide FBA prep: FNSKU labeling, suffocation warnings, carton requirements. We can also arrange fulfillment partnerships in USA if you need warehousing and order processing. Let us know your requirements and we'll quote accordingly."
    },
    {
      question: "What if I want to switch manufacturers later—do I own the patterns?",
      answer: "Yes, you own all patterns, tech packs, and designs we create for you. If you switch manufacturers, we'll provide digital pattern files and spec sheets. We hope you won't leave (our service is great!), but we believe in transparency. Many clients start with us for small batches and continue as they scale because of our quality and flexibility."
    }
  ];

  const schemas = [
    organizationSchema,
    productSchema({
      name: "Private Label Clothing Manufacturing Service",
      description: "Custom private label apparel production with 50-piece MOQ. Full branding services including custom labels, tags, and packaging for fashion brands.",
      minPrice: "4.50",
      maxPrice: "20.00"
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://sleekapparels.com" },
      { name: "Private Label Manufacturer", url: "https://sleekapparels.com/private-label-clothing-manufacturer" }
    ])
  ];

  return (
    <>
      <SEO
        title="Private Label Clothing Manufacturer Bangladesh | MOQ 50 | Custom Branding"
        description="Private label clothing manufacturer in Bangladesh with 50-piece MOQ. Complete branding services: custom labels, tags, packaging. OEKO-TEX certified. Perfect for fashion startups and DTC brands."
        canonical="https://sleekapparels.com/private-label-clothing-manufacturer"
        keywords="private label clothing manufacturer, private label apparel Bangladesh, custom clothing brand manufacturing, white label clothing, fashion brand manufacturer"
        schema={schemas}
        ogImage="https://sleekapparels.com/images/private-label-manufacturing.jpg"
      />

      <div className="min-h-screen bg-white">
        <Navigation />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-sm mb-4 opacity-90">
                <Link to="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <span>Private Label Clothing Manufacturer</span>
              </nav>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Private Label Clothing Manufacturer Bangladesh: Launch Your Brand with 50-Piece MOQ
              </h1>
              
              <p className="text-xl mb-8 opacity-95 leading-relaxed">
                Complete private label apparel solutions with <strong>50-piece minimum orders.</strong> Custom labels, 
                tags, packaging, and OEKO-TEX certified production. Perfect for fashion startups and DTC brands.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/quote-generator">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
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
                  <Package className="w-5 h-5" />
                  <span>MOQ: 50 pieces</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  <span>Custom Labels & Tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>OEKO-TEX Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>15-20 day production</span>
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
                  Building a successful fashion brand requires more than great designs—you need a manufacturing partner 
                  who understands <strong>private label production</strong> and can bring your vision to life without requiring 
                  massive minimum orders. At <strong>Sleek Apparels</strong>, we specialize in <strong>private label clothing 
                  manufacturing</strong> with just <strong>50 pieces per style</strong>, making professional brand building 
                  accessible to startups, entrepreneurs, and growing DTC brands.
                </p>
                
                <p className="text-gray-700 mb-6">
                  As a <strong>OEKO-TEX Standard 100</strong> and <strong>BSCI certified manufacturer in Bangladesh</strong>, 
                  we provide complete private label solutions including custom fabric sourcing, pattern development, sampling, 
                  bulk production, custom labeling, branded packaging, and quality control. Whether you're launching a sustainable 
                  streetwear brand, creating premium activewear, or building a DTC fashion empire on Shopify, we handle every 
                  aspect of your private label manufacturing needs.
                </p>

                <p className="text-gray-700 mb-6">
                  What makes us different? We're not just a factory—we're a <strong>brand-building partner</strong>. We've helped 
                  200+ fashion startups launch with low MOQs, providing guidance on everything from tech pack creation to Amazon 
                  FBA compliance. Our flexible approach lets you start small, test markets, and scale gradually without the financial 
                  strain of traditional 500-1,000 piece minimums.
                </p>
              </div>

              {/* What is Private Label Section */}
              <div className="bg-blue-50 rounded-xl p-8 mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  What is Private Label Clothing Manufacturing?
                </h2>
                
                <p className="text-gray-700 mb-6">
                  <strong>Private label</strong> means we manufacture clothing products specifically for your brand. Unlike buying 
                  wholesale (existing products) or generic white-label items, private label gives you <strong>complete control</strong> 
                  over every aspect of your product:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      Design Control
                    </h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Choose fabrics, colors, patterns</li>
                      <li>• Custom sizing and fit</li>
                      <li>• Unique style details</li>
                      <li>• Your specifications, not ours</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      Brand Ownership
                    </h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Your brand name and logo</li>
                      <li>• Custom woven/printed labels</li>
                      <li>• Branded hang tags</li>
                      <li>• Exclusive to your brand</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Packaging & Presentation
                    </h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Custom poly bags with logo</li>
                      <li>• Branded packaging boxes</li>
                      <li>• Inserts and thank you cards</li>
                      <li>• Professional presentation</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Market Exclusivity
                    </h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• Products exclusive to you</li>
                      <li>• We don't sell to competitors</li>
                      <li>• Build unique brand identity</li>
                      <li>• No marketplace saturation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                  <p className="font-semibold mb-2">Private Label vs Wholesale vs Custom:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li><strong>Private Label:</strong> Our existing styles + your custom fabrics/colors/branding (Fastest, cost-effective)</li>
                    <li><strong>Wholesale:</strong> Buy existing products and resell (No customization, lowest cost)</li>
                    <li><strong>Cut & Sew (Fully Custom):</strong> Patterns from scratch (Unlimited design freedom, highest cost)</li>
                  </ul>
                </div>
              </div>

              {/* Why Choose Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  Why Choose Sleek Apparels for Private Label Manufacturing?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Check className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">True 50-Piece Private Label MOQ</h3>
                      <p className="text-gray-600">
                        Most private label manufacturers require 500-1,000 pieces per style. We accept 50 pieces, 
                        letting you test designs and build inventory gradually. Perfect for startups validating product-market fit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Tech Pack Development Support</h3>
                      <p className="text-gray-600">
                        No tech pack? No problem! Our design team converts sketches into production-ready specifications. 
                        We'll help with pattern making, grading, fabric selection, and trim details. $50-150 per design.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Complete Branding Services</h3>
                      <p className="text-gray-600">
                        Custom woven labels ($0.15-0.30), printed care labels, hang tags ($0.10-0.25), branded poly bags, 
                        custom buttons, zippers, drawcords. We source all branded trims with low minimums (50 pcs).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fast Private Label Production</h3>
                      <p className="text-gray-600">
                        Samples in 5-7 days. Bulk production 15-20 days for 50-500 pieces. Industry average is 30-45 days. 
                        Get products to market faster, test seasonal trends, and respond to customer demand quickly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Ethical & Certified Production</h3>
                      <p className="text-gray-600">
                        OEKO-TEX Standard 100 (no harmful chemicals), BSCI (ethical working conditions), WRAP (social compliance). 
                        Perfect for sustainable brands and conscious consumers. Full supply chain transparency available.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Amazon FBA & DTC Fulfillment Ready</h3>
                      <p className="text-gray-600">
                        FNSKU labeling, poly bags with suffocation warnings, carton requirements, prep center coordination. 
                        Ship directly to Amazon warehouses. Also partner with US 3PL providers for Shopify fulfillment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Palette className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fabric Sourcing Expertise</h3>
                      <p className="text-gray-600">
                        Access to 500+ fabric suppliers in Bangladesh. Organic cotton, recycled polyester, bamboo, modal, 
                        performance fabrics, premium knits. We get better pricing than you can individually. Fabric samples provided.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Quality Guarantee (AQL 2.5)</h3>
                      <p className="text-gray-600">
                        Every garment inspected using AQL 2.5 standard. Defect rate <2.5%. Third-party inspection available. 
                        We stand behind our quality—if issues arise, we'll remake garments at no charge (within reason).
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
                <h2 className="text-3xl font-bold mb-6">Private Label Product Categories (50-Piece MOQ)</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">T-Shirts & Tops</h3>
                    <p className="text-gray-600 mb-4">
                      Basic tees, premium tees, V-necks, long sleeves, crop tops, oversized styles
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: 150-220 GSM cotton, blends, organic</li>
                      <li>• Branding: Screen print, heat transfer, embroidery</li>
                      <li>• Custom: Neckline, hem, sleeve styles</li>
                      <li>• Labels: Woven neck label, printed care label</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$4.50-$7.00/piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Hoodies & Sweatshirts</h3>
                    <p className="text-gray-600 mb-4">
                      Pullover hoodies, zip hoodies, crewneck sweatshirts, oversized styles
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: 280-400 GSM fleece, French terry</li>
                      <li>• Branding: Embroidery, chenille patches, prints</li>
                      <li>• Custom: Hood lining, drawcords, pockets</li>
                      <li>• Trims: Custom zippers, metal eyelets, cord ends</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$15.00-$22.00/piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Activewear & Athleisure</h3>
                    <p className="text-gray-600 mb-4">
                      Leggings, sports bras, performance tees, joggers, shorts
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: Moisture-wicking, 4-way stretch, compression</li>
                      <li>• Branding: Heat transfer, sublimation, silicone prints</li>
                      <li>• Custom: Mesh panels, reflective details, pockets</li>
                      <li>• Features: Flat-lock seams, elastic waistbands</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$10.00-$16.00/piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Dresses & Skirts</h3>
                    <p className="text-gray-600 mb-4">
                      Casual dresses, mini skirts, midi skirts, wrap styles
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: Jersey, rib knit, woven cotton, viscose</li>
                      <li>• Branding: Woven labels, printed tags</li>
                      <li>• Custom: Length, fit, neckline, sleeves</li>
                      <li>• Details: Buttons, zippers, belt loops, pockets</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$12.00-$20.00/piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Outerwear & Jackets</h3>
                    <p className="text-gray-600 mb-4">
                      Bomber jackets, denim jackets, windbreakers, puffer vests
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: Denim, nylon, polyester, canvas</li>
                      <li>• Branding: Embroidery, patches, metal labels</li>
                      <li>• Custom: Lining, pockets, closures, cuffs</li>
                      <li>• Trims: YKK zippers, snap buttons, D-rings</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$20.00-$35.00/piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-xl mb-3">Loungewear & Sleepwear</h3>
                    <p className="text-gray-600 mb-4">
                      Sweatpants, joggers, lounge sets, sleep tees, shorts
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li>• Fabrics: Soft fleece, jersey, modal, bamboo</li>
                      <li>• Branding: Embroidered logo, woven labels</li>
                      <li>• Custom: Waistband styles, pockets, cuffs</li>
                      <li>• Sets: Matching top & bottom packaging</li>
                    </ul>
                    <p className="font-semibold text-purple-600">$15.00-$25.00/set (50 pcs)</p>
                  </div>
                </div>
              </div>

              {/* Process Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Our Private Label Manufacturing Process</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Brand Consultation & Vision Alignment</h3>
                      <p className="text-gray-600">
                        Share your brand story, target customer, design inspiration, and budget. We'll discuss product categories, 
                        fabric options, and manufacturing feasibility. We want to understand your brand DNA to ensure products 
                        align with your vision.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Design & Tech Pack Development</h3>
                      <p className="text-gray-600">
                        If you have tech packs, great! If not, we'll create them from your sketches. We'll develop detailed 
                        specifications including measurements, fabric details, construction methods, trim specifications, and 
                        branding placement. Fabric swatches and color options provided.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Fabric Sourcing & Custom Labels</h3>
                      <p className="text-gray-600">
                        We source fabrics from our network of 500+ Bangladesh suppliers. Organic cotton, recycled materials, 
                        performance fabrics—all available. Simultaneously, we produce your custom woven labels, care labels, 
                        and hang tags. Lead time: 7-10 days for labels.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        4
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Sample Production (5-7 days)</h3>
                      <p className="text-gray-600">
                        We produce 1-3 samples with actual fabrics, labels, and finishes. Ship via DHL/FedEx (3-5 days). 
                        Review fit, quality, colors, branding placement. Request adjustments if needed. We iterate until 
                        you're 100% satisfied before bulk production.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        5
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Bulk Production (15-20 days)</h3>
                      <p className="text-gray-600">
                        After sample approval and 50% deposit, production begins. We cut fabric, sew garments, attach labels, 
                        apply prints/embroidery, and perform quality control. Weekly photo updates show progress. For 50-500 
                        piece orders, we complete in 15-20 days.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        6
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Quality Control & Branding</h3>
                      <p className="text-gray-600">
                        AQL 2.5 inspection: Check stitching, fabric defects, measurements, colors, label placement. Every garment 
                        inspected individually. Then we add hang tags, fold garments, insert into branded poly bags, and pack into 
                        export cartons with your branding.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        7
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Packaging & Shipment</h3>
                      <p className="text-gray-600">
                        Custom packaging if requested. Ship FOB Chittagong (you arrange freight) or we arrange air/sea shipping. 
                        For Amazon FBA: FNSKU labeling, poly bags with warnings, prep center coordination. Provide all export 
                        documentation: commercial invoice, packing list, certificate of origin.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        8
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Ongoing Support & Reorders</h3>
                      <p className="text-gray-600">
                        Once you receive products, we stay in touch. Need adjustments for next order? Want to add new styles? 
                        We maintain all your patterns, specs, and label designs for easy reordering. Many clients start with 
                        50 pieces and grow to 500+ piece reorders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  Private Label vs Wholesale vs Cut & Sew
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-4 text-left font-semibold">Feature</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold bg-purple-50">Private Label (Sleek)</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">Wholesale</th>
                        <th className="border border-gray-300 p-4 text-left font-semibold">Cut & Sew</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">MOQ</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">50 pieces</span>
                        </td>
                        <td className="border border-gray-300 p-4">6-12 pieces</td>
                        <td className="border border-gray-300 p-4">300-500 pieces</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Design Control</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">High (your fabrics/colors)</span>
                        </td>
                        <td className="border border-gray-300 p-4">None (buy existing)</td>
                        <td className="border border-gray-300 p-4">Complete (from scratch)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Branding</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">Full custom labels/tags</span>
                        </td>
                        <td className="border border-gray-300 p-4">Limited (relabeling only)</td>
                        <td className="border border-gray-300 p-4">Full custom branding</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Lead Time</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">25-35 days total</span>
                        </td>
                        <td className="border border-gray-300 p-4">3-7 days</td>
                        <td className="border border-gray-300 p-4">45-60 days</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Cost per Unit</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">$4.50-$22 (50 pcs)</span>
                        </td>
                        <td className="border border-gray-300 p-4">$8-$25 (retail markup)</td>
                        <td className="border border-gray-300 p-4">$3-$15 (high volume)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Exclusivity</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">Exclusive to you</span>
                        </td>
                        <td className="border border-gray-300 p-4">Non-exclusive</td>
                        <td className="border border-gray-300 p-4">Exclusive to you</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-4 font-semibold">Pattern Development</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">Modify existing ($50-150)</span>
                        </td>
                        <td className="border border-gray-300 p-4">N/A</td>
                        <td className="border border-gray-300 p-4">Create new ($300-800)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-4 font-semibold">Best For</td>
                        <td className="border border-gray-300 p-4 bg-purple-50">
                          <span className="text-purple-700 font-bold">Startups testing market</span>
                        </td>
                        <td className="border border-gray-300 p-4">Resellers, boutiques</td>
                        <td className="border border-gray-300 p-4">Established brands scaling</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Private Label Pricing (Transparent & Fair)</h2>
                
                <p className="text-gray-700 mb-6">
                  Unlike many manufacturers who hide costs, we believe in transparency. Here's our private label pricing 
                  structure:
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-xl mb-4">What's Included in Our Prices:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Fabric (your choice from our suppliers)</li>
                      <li>✓ Pattern making & grading</li>
                      <li>✓ Cutting & sewing labor</li>
                      <li>✓ Standard printing or embroidery (1 location)</li>
                    </ul>
                    <ul className="space-y-2 text-gray-700">
                      <li>✓ Custom woven neck labels</li>
                      <li>✓ Printed care labels</li>
                      <li>✓ Basic poly bag packaging</li>
                      <li>✓ Quality control (AQL 2.5)</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Basic T-Shirts</h4>
                    <p className="text-gray-600 text-sm mb-3">150-180 GSM cotton</p>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$4.50-$5.50</p>
                    <p className="text-sm text-gray-600">per piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Premium Hoodies</h4>
                    <p className="text-gray-600 text-sm mb-3">320 GSM fleece</p>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$15.00-$18.00</p>
                    <p className="text-sm text-gray-600">per piece (50 pcs)</p>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Activewear Leggings</h4>
                    <p className="text-gray-600 text-sm mb-3">Performance fabric</p>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$10.00-$13.00</p>
                    <p className="text-sm text-gray-600">per piece (50 pcs)</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-semibold mb-2">Additional Costs:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Samples:</strong> $30-60 per piece (refundable with order >100 pcs)</li>
                    <li>• <strong>Tech Pack Development:</strong> $50-150 per design</li>
                    <li>• <strong>Custom Hang Tags:</strong> $0.10-0.25 per tag (50 pc minimum)</li>
                    <li>• <strong>Custom Packaging:</strong> $0.50-2.00 per unit (depends on complexity)</li>
                    <li>• <strong>Extra Printing Locations:</strong> $0.50-1.50 per location</li>
                    <li>• <strong>Premium Fabrics:</strong> $1-3 more per garment (organic, bamboo, etc.)</li>
                  </ul>
                </div>
              </div>

              {/* Case Study */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Case Study: LA Streetwear Brand</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-purple-600">Challenge</h3>
                    <p className="text-gray-700 text-sm">
                      First-time brand owner wanted to launch with 3 hoodie designs. Other manufacturers required 500 
                      pieces per style (1,500 total). Budget: $8,000. Needed to test market first.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-purple-600">Solution</h3>
                    <p className="text-gray-700 text-sm">
                      We accepted 50 pieces per style (150 total). Helped develop tech packs from sketches. Produced custom 
                      woven labels and hang tags. Created samples in 7 days, bulk production in 18 days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-purple-600">Results</h3>
                    <p className="text-gray-700 text-sm">
                      All 150 hoodies sold out in 3 weeks through Instagram. Brand validated market demand. Reordered 300 
                      pieces 6 weeks later. Now orders 500+ pieces quarterly. Total investment: $2,700 initial vs $25,000 
                      if went with 500pc MOQ.
                    </p>
                  </div>
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

              {/* Final CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Launch Your Private Label Clothing Brand?
                </h2>
                <p className="text-xl mb-6 opacity-95">
                  Start with just 50 pieces. Get free quote, tech pack support, and samples.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Link to="/quote-generator">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
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
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
                <p className="text-sm opacity-90">
                  Join 200+ fashion brands who built their business with our private label services.
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
