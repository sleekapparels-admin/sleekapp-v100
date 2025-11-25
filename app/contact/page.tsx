import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
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
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Request a Quote</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Company Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="Your Brand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Product Type *</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600" required>
                      <option value="">Select Product</option>
                      <option value="t-shirts">T-Shirts</option>
                      <option value="hoodies">Hoodies & Sweatshirts</option>
                      <option value="activewear">Activewear</option>
                      <option value="knitwear">Knitwear</option>
                      <option value="uniforms">Uniforms</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Quantity *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="100"
                      min="50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message / Requirements *</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      rows={5}
                      placeholder="Please describe your requirements in detail..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold transition-colors"
                  >
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
