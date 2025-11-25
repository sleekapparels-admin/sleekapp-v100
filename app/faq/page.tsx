import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'FAQ | Frequently Asked Questions - Sleek Apparels Bangladesh',
  description: 'Common questions about MOQ, pricing, lead times, customization, certifications, shipping. Get answers about our clothing manufacturing services.',
  keywords: ['clothing manufacturer faq', 'moq questions', 'manufacturing process', 'pricing questions'],
});

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is your minimum order quantity (MOQ)?',
      answer: 'Our MOQ is 50 pieces per style per color. Size splits are allowed across 5 sizes. For example, you can order 10 Small + 20 Medium + 12 Large + 8 XL = 50 units total.',
    },
    {
      question: 'What is the lead time for production?',
      answer: 'Bulk orders: 15-20 days after sample approval. Samples: 7-10 days. Rush orders available for urgent requirements with additional charges. Timeline starts after payment confirmation and final approval.',
    },
    {
      question: 'Do you provide samples before bulk production?',
      answer: 'Yes, we always provide samples before bulk production. Sample cost is $30-50 per piece depending on complexity. Sample fee is refundable with bulk orders. We allow up to 3 revisions to ensure your complete satisfaction.',
    },
    {
      question: 'What certifications do you have?',
      answer: 'We are certified with OEKO-TEX Standard 100 (textile safety), BSCI (ethical workplace), and WRAP (responsible production). All our products meet USA and EU safety standards. Certificate numbers available upon request.',
    },
    {
      question: 'What are your payment terms?',
      answer: 'Standard terms: 30% deposit to start production, 70% balance before shipping. We accept bank transfer (T/T), PayPal (for samples), and Western Union. LC (Letter of Credit) available for large orders.',
    },
    {
      question: 'Can you match my custom colors (PMS/Pantone)?',
      answer: 'Yes, we can match Pantone colors for fabric dyeing. Please provide PMS/Pantone reference codes. Lab dip samples provided for color approval before bulk production. Some colors may require higher MOQ.',
    },
    {
      question: 'What printing and embroidery options do you offer?',
      answer: 'Printing: Screen printing (up to 12 colors), heat transfer, sublimation, discharge printing. Embroidery: Flat embroidery, 3D puff, appliqué. We handle logo placement on chest, back, sleeve, or custom positions.',
    },
    {
      question: 'Do you provide tech pack and pattern making services?',
      answer: 'Yes, our design team can create tech packs and patterns based on your sketches or reference images. Service fee: $50-150 depending on complexity. Free for bulk orders over 500 pieces.',
    },
    {
      question: 'What fabrics do you work with?',
      answer: '100% cotton (combed, carded, organic), cotton-polyester blends (65/35, 50/50), tri-blend, French terry, fleece, jersey knit, pique, performance fabrics. Fabric weight: 160-320 GSM depending on product type.',
    },
    {
      question: 'How much does custom clothing manufacturing cost?',
      answer: 'T-shirts: $3-6/piece, Hoodies: $12-18/piece, Activewear: $8-15/piece. Final pricing depends on fabric, quantity, customization, and specifications. Contact us for exact quote based on your requirements.',
    },
    {
      question: 'Can you ship to USA/UK/Europe?',
      answer: 'Yes, we ship worldwide. Main markets: USA, UK, Germany, Canada, Australia. Shipping: FOB Chittagong port (Bangladesh). We coordinate sea freight and air freight. Express shipping available for samples.',
    },
    {
      question: 'Do you handle customs and import documentation?',
      answer: 'We provide all export documentation: commercial invoice, packing list, certificate of origin, inspection certificates. Import customs clearance is buyer\'s responsibility. We can recommend freight forwarders who handle door-to-door delivery.',
    },
    {
      question: 'What is your quality control process?',
      answer: 'Three-stage QC: (1) Pre-production inspection of fabrics and trims, (2) Inline inspection during production (AQL 2.5 standard), (3) Final audit before packing. Third-party inspection welcome (SGS, BV, ITS).',
    },
    {
      question: 'Can you add custom labels and tags to my products?',
      answer: 'Yes, complete private label service available. Custom woven labels, printed neck tags, care instruction labels, barcode labels, size stickers. We also offer branded packaging: poly bags, boxes, hangtags.',
    },
    {
      question: 'Do you work with fashion startups and small businesses?',
      answer: 'Absolutely! Our low MOQ of 50 pieces is perfect for startups, DTC brands, Amazon FBA sellers, Shopify stores, and boutiques. We\'ve helped hundreds of new brands launch their clothing lines.',
    },
    {
      question: 'Can I visit your factory?',
      answer: 'Yes, factory visits welcome! Schedule appointment in advance. Location: Uttara, Dhaka, Bangladesh. We can arrange airport pickup. Virtual factory tours available via video call for international clients.',
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'FAQ', url: 'https://sleekapparels.com/faq/' },
  ]);

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      
      <div className="bg-white">
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Find answers to common questions about our clothing manufacturing services, 
              MOQ, pricing, lead times, and more.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Can't find the answer you're looking for? Contact our team for personalized assistance.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
