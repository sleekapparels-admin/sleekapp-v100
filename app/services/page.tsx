import Link from 'next/link';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Manufacturing Services | Low MOQ Clothing Production Bangladesh - Sleek Apparels',
  description: 'Complete clothing manufacturing services: custom design, sampling, bulk production, quality control, packaging. MOQ 50 pieces. Private label and OEM services for global brands.',
  keywords: [
    'clothing manufacturing services',
    'private label clothing manufacturer',
    'oem clothing production bangladesh',
    'custom apparel manufacturing',
    'low moq manufacturing services',
  ],
});

export default function ServicesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Services', url: 'https://sleekapparels.com/services/' },
  ]);

  const services = [
    {
      title: 'Custom Design & Development',
      description: 'Work with our design team to create unique apparel. We provide tech packs, patterns, and prototypes based on your specifications. CAD design services available.',
      features: ['Tech Pack Creation', 'Pattern Making', 'Prototype Development', 'Fabric Sourcing'],
    },
    {
      title: 'Sample Production',
      description: '7-10 day sample turnaround. Up to 3 revisions included. Sample approval before bulk production ensures your vision is perfectly executed.',
      features: ['Fast 7-10 Day Turnaround', '3 Revisions Included', 'Multiple Size Samples', 'Quality Validation'],
    },
    {
      title: 'Bulk Manufacturing',
      description: 'MOQ 50 pieces per style per color. Production capacity 50,000-80,000 pcs/month. Computerized flat knitting for precision and consistency.',
      features: ['Low MOQ 50 Pieces', '15-20 Day Production', 'High Volume Capacity', 'Consistent Quality'],
    },
    {
      title: 'Private Label Services',
      description: 'Complete white-label solution. Custom woven labels, printed tags, care instructions, barcode labels, and branded packaging.',
      features: ['Custom Labels & Tags', 'Branded Packaging', 'Barcode Integration', 'Poly Bag Packing'],
    },
    {
      title: 'Quality Control & Inspection',
      description: 'Three-stage quality control: pre-production, inline inspection, and final audit. AQL 2.5 standard. Third-party inspection available.',
      features: ['Pre-Production Inspection', 'Inline Quality Checks', 'Final Audit', 'AQL 2.5 Standard'],
    },
    {
      title: 'Customization Services',
      description: 'Screen printing, embroidery, heat transfer, appliqué, stone wash, garment dyeing, and special finishes.',
      features: ['Screen Printing', 'Embroidery', 'Heat Transfer', 'Special Washing'],
    },
    {
      title: 'Packaging & Logistics',
      description: 'Individual poly bag packing, carton packing, custom boxes. FOB Chittagong port. Air freight and sea freight coordination.',
      features: ['Custom Packaging', 'FOB Chittagong', 'Freight Coordination', 'Documentation Support'],
    },
    {
      title: 'Compliance & Certifications',
      description: 'OEKO-TEX Standard 100, BSCI, WRAP certified facility. All products meet USA and EU safety standards.',
      features: ['OEKO-TEX Certified', 'BSCI Compliant', 'WRAP Certified', 'EU/USA Standards'],
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
              Comprehensive Clothing Manufacturing Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              From concept to delivery, we provide end-to-end manufacturing services for fashion 
              startups and established brands. Low MOQ, fast turnaround, certified quality.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div key={service.title} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="text-primary-600 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12">Our Manufacturing Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: '01', title: 'Inquiry & Quote', desc: 'Share requirements, receive quote within 24 hours' },
                { step: '02', title: 'Sample Making', desc: '7-10 days sample production with revisions' },
                { step: '03', title: 'Bulk Order', desc: 'Confirm order, 30% deposit, start production' },
                { step: '04', title: 'Production', desc: '15-20 days manufacturing with QC checks' },
                { step: '05', title: 'Shipping', desc: 'Final inspection, packing, shipping to destination' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Need a Manufacturing Partner?</h2>
            <p className="text-xl mb-8">
              Contact us today to discuss your project. We'll provide expert guidance and a 
              detailed quote tailored to your needs.
            </p>
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
            <h2>Why Choose Sleek Apparels for Manufacturing?</h2>
            <p>
              As a leading clothing manufacturer in Bangladesh, we specialize in serving fashion 
              startups, DTC brands, and Amazon FBA sellers who need a reliable manufacturing partner 
              with low minimum order quantities. Our MOQ of just 50 pieces makes us ideal for brands 
              testing new designs or launching limited collections.
            </p>
            <h3>Private Label Manufacturing Expertise</h3>
            <p>
              We offer complete private label services including custom branding, labeling, and 
              packaging. Your products arrive ready to sell with your brand identity. We handle 
              everything from fabric sourcing to final packaging, allowing you to focus on marketing 
              and sales.
            </p>
            <h3>Fast Turnaround Times</h3>
            <p>
              Time to market is critical for fashion brands. Our streamlined production process 
              ensures 7-10 day sample turnaround and 15-20 day bulk production. Rush orders available 
              for urgent requirements. We maintain buffer inventory of popular fabrics for faster execution.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
