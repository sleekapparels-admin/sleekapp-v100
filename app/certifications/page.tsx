import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Certifications | OEKO-TEX, BSCI, WRAP Certified - Sleek Apparels',
  description: 'International certifications: OEKO-TEX Standard 100, BSCI, WRAP. Ethical manufacturing, safe fabrics, compliance with USA and EU standards.',
  keywords: ['oeko-tex certification', 'bsci certified factory', 'wrap certification', 'ethical manufacturer'],
});

export default function CertificationsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Certifications</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Internationally recognized certifications ensuring quality, safety, and ethical manufacturing standards.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-primary-600">OEKO-TEX</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">OEKO-TEX Standard 100</h2>
              <p className="text-gray-600 mb-4">
                Our fabrics are tested and certified free from harmful substances. Safe for human contact, 
                including babies and children.
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Tested for 300+ harmful substances</li>
                <li>• Exceeds legal requirements</li>
                <li>• Annual audits</li>
                <li>• Verification available</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-primary-600">BSCI</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">BSCI Certification</h2>
              <p className="text-gray-600 mb-4">
                Business Social Compliance Initiative. Ethical workplace standards including fair wages, 
                safe conditions, and workers' rights.
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Fair labor practices</li>
                <li>• Safe working conditions</li>
                <li>• No child labor</li>
                <li>• Regular social audits</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="bg-primary-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-primary-600">WRAP</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">WRAP Certification</h2>
              <p className="text-gray-600 mb-4">
                Worldwide Responsible Accredited Production. Global social compliance certification 
                for apparel manufacturing.
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• 12 Principles compliance</li>
                <li>• Environmental responsibility</li>
                <li>• Health and safety</li>
                <li>• Independent verification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Certifications Matter</h2>
          <div className="prose prose-lg max-w-none">
            <p>
              International certifications demonstrate our commitment to quality, safety, and ethical 
              manufacturing. For brands selling in USA and Europe, these certifications are increasingly 
              important for market access and consumer trust.
            </p>
            <h3>For Your Brand</h3>
            <ul>
              <li>Build consumer trust with verified ethical practices</li>
              <li>Meet retailer requirements (many require OEKO-TEX/BSCI)</li>
              <li>Ensure product safety and quality</li>
              <li>Differentiate from uncertified competitors</li>
            </ul>
            <h3>For Your Customers</h3>
            <ul>
              <li>Safe products free from harmful chemicals</li>
              <li>Ethically manufactured by fairly treated workers</li>
              <li>Environmentally responsible production</li>
              <li>Third-party verified standards</li>
            </ul>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/contact"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Request Certificate Verification
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
