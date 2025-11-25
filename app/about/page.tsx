import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'About Us | Factory & Manufacturing Capabilities - Sleek Apparels Bangladesh',
  description: 'Learn about Sleek Apparels Limited. Factory location in Dhaka, Bangladesh. 50,000-80,000 pcs/month capacity. OEKO-TEX & BSCI certified. Serving brands worldwide since [year].',
  keywords: ['about sleek apparels', 'bangladesh clothing factory', 'manufacturing capabilities', 'factory details'],
});

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Sleek Apparels Limited</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Leading clothing manufacturer in Bangladesh specializing in low MOQ production for 
            fashion brands worldwide.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Sleek Apparels Limited is a premium clothing manufacturer based in Dhaka, Bangladesh, 
                dedicated to serving fashion startups, DTC brands, and small businesses with flexible 
                low MOQ manufacturing solutions.
              </p>
              <p className="text-gray-600 mb-4">
                Founded with the vision to make high-quality apparel manufacturing accessible to 
                emerging brands, we combine modern technology with ethical manufacturing practices 
                to deliver exceptional products.
              </p>
              <p className="text-gray-600">
                Our facility in Uttara, Dhaka is equipped with computerized flat knitting machines, 
                modern sewing lines, and comprehensive quality control systems that ensure every 
                garment meets international standards.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="font-semibold">Location:</span>
                  <span>Dhaka, Bangladesh</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="font-semibold">Capacity:</span>
                  <span>50,000-80,000 pcs/month</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="font-semibold">MOQ:</span>
                  <span>50 pieces per style</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="font-semibold">Lead Time:</span>
                  <span>15-22 days</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-3">
                  <span className="font-semibold">Certifications:</span>
                  <span>OEKO-TEX, BSCI, WRAP</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Export Markets:</span>
                  <span>USA, UK, EU, CA, AU</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Manufacturing Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Equipment</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Computerized Flat Knitting Machines</li>
                <li>• Industrial Sewing Machines</li>
                <li>• Embroidery Machines</li>
                <li>• Screen Printing Equipment</li>
                <li>• Quality Control Lab</li>
                <li>• Steam Pressing Facilities</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Quality Control</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Pre-Production Inspection</li>
                <li>• Inline Quality Checks (AQL 2.5)</li>
                <li>• Final Audit Before Packing</li>
                <li>• Fabric Testing Lab</li>
                <li>• Third-Party Inspection Welcome</li>
                <li>• Photo Documentation</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Services</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Custom Design & Tech Packs</li>
                <li>• Sample Development</li>
                <li>• Fabric Sourcing</li>
                <li>• Bulk Manufacturing</li>
                <li>• Private Label Services</li>
                <li>• Packaging & Logistics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Low MOQ', desc: 'Start with just 50 pieces per style' },
              { title: 'Fast Production', desc: '15-22 day turnaround time' },
              { title: 'Certified Quality', desc: 'OEKO-TEX, BSCI, WRAP certified' },
              { title: 'Flexible Services', desc: 'From design to delivery' },
              { title: 'Competitive Pricing', desc: 'Best value for quality' },
              { title: 'Global Shipping', desc: 'Export to 50+ countries' },
              { title: 'Expert Team', desc: '50+ skilled professionals' },
              { title: 'Ethical Manufacturing', desc: 'Fair labor practices' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8">
            Join hundreds of brands worldwide who trust Sleek Apparels for their manufacturing needs.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
