import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ContactForm from '@/components/ContactForm';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Contact Us | Get Quote | Sleek Apparels Bangladesh',
  description: 'Contact Sleek Apparels for custom clothing manufacturing quote. Email, phone, WhatsApp. 24-hour response time. Located in Dhaka, Bangladesh.',
  keywords: ['contact clothing manufacturer', 'get quote', 'bangladesh apparel contact', 'manufacturing inquiry'],
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://sleekapparels.com/' },
    { name: 'Contact', url: 'https://sleekapparels.com/contact/' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="bg-white">
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Get in touch for quotes, samples, or inquiries. We respond within 24 hours.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Company Address</h3>
                    <p className="text-gray-600">
                      Sleek Apparels Limited<br />
                      01, Road 19A, Sector 04<br />
                      Uttara, Dhaka 1230<br />
                      Bangladesh
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">Email</h3>
                    <p className="text-gray-600">
                      info@sleekapparels.com<br />
                      sales@sleekapparels.com
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">Phone</h3>
                    <p className="text-gray-600">
                      +880 1700-000000
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Sunday - Thursday: 9:00 AM - 6:00 PM (GMT+6)<br />
                      Friday - Saturday: Closed
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">What to Include in Your Inquiry</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Product type (t-shirts, hoodies, etc.)</li>
                    <li>• Quantity required</li>
                    <li>• Fabric preference</li>
                    <li>• Customization needs (printing, embroidery)</li>
                    <li>• Target delivery date</li>
                    <li>• Shipping destination</li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
