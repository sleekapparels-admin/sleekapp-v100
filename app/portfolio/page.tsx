import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Portfolio | Past Projects & Client Success Stories - Sleek Apparels',
  description: 'View our portfolio of custom clothing manufacturing projects. Success stories from USA, UK, and European brands. Real examples of our work.',
  keywords: ['clothing portfolio', 'manufacturing projects', 'client success stories', 'past work examples'],
});

export default function PortfolioPage() {
  const projects = [
    {
      title: 'US Streetwear Brand - Premium T-Shirts',
      category: 'T-Shirts',
      description: '1,200 pieces premium tri-blend t-shirts with screen printing. 3 colorways, 5 sizes. Delivered to Los Angeles in 18 days.',
      specs: 'Tri-blend 145 GSM, 3-color screen print, custom woven labels',
    },
    {
      title: 'UK Sustainable Fashion - Organic Cotton Line',
      category: 'Eco-Friendly',
      description: '500 pieces GOTS certified organic cotton t-shirts and hoodies for UK sustainable brand. Complete private labeling.',
      specs: 'Organic cotton, GOTS certified, biodegradable packaging',
    },
    {
      title: 'Amazon FBA - Private Label Activewear',
      category: 'Activewear',
      description: '800 pieces moisture-wicking performance t-shirts for Amazon FBA seller. MOQ-friendly for first launch.',
      specs: 'Polyester-spandex blend, moisture-wicking, 4-way stretch',
    },
    {
      title: 'Corporate Uniforms - Tech Company',
      category: 'Uniforms',
      description: '2,000 pieces polo shirts with embroidered logos for European tech company. Bulk pricing applied.',
      specs: '220 GSM pique cotton, chest embroidery, custom packaging',
    },
    {
      title: 'Fitness Brand - Gym Apparel Collection',
      category: 'Activewear',
      description: '1,500 pieces athletic wear including tank tops, shorts, and leggings. Fast turnaround for seasonal launch.',
      specs: 'Performance fabrics, sublimation printing, athletic fit',
    },
    {
      title: 'Boutique Collection - Limited Edition Hoodies',
      category: 'Hoodies',
      description: '300 pieces custom hoodies with complex embroidery and appliqué. Premium fleece, low MOQ order.',
      specs: '320 GSM fleece, multi-color embroidery, custom hangtags',
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Real projects from real clients. See how we've helped brands worldwide bring their 
            clothing visions to life.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <span className="text-sm text-primary-600 font-semibold">{project.category}</span>
                <h2 className="text-2xl font-bold mt-2 mb-4">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <p className="font-semibold mb-1">Specifications:</p>
                  <p className="text-gray-600">{project.specs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Project</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to see your brand featured in our portfolio? Let's discuss your project.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
