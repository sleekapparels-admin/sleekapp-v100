import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateMeta } from '@/lib/metadata';

export const metadata: Metadata = generateMeta({
  title: 'Blog | Clothing Manufacturing Guides & Industry Insights - Sleek Apparels',
  description: 'Expert guides on clothing manufacturing, sourcing from Bangladesh, starting a fashion brand, MOQ explained, and industry best practices.',
  keywords: ['clothing manufacturing blog', 'fashion startup guide', 'bangladesh sourcing', 'moq guide'],
});

export default function BlogPage() {
  const posts = [
    {
      title: 'How to Start a Clothing Brand with Low MOQ (2024 Guide)',
      excerpt: 'Complete step-by-step guide for fashion entrepreneurs. Learn how to launch your clothing line with minimal investment using low MOQ manufacturers.',
      date: '2024-01-15',
      category: 'Startup Guide',
      readTime: '12 min read',
    },
    {
      title: 'Bangladesh vs China: Which is Better for Clothing Manufacturing?',
      excerpt: 'Comprehensive comparison of costs, quality, lead times, and compliance. Why Bangladesh is becoming the preferred choice for fashion startups.',
      date: '2024-01-10',
      category: 'Industry Insights',
      readTime: '8 min read',
    },
    {
      title: 'Understanding MOQ in Clothing Manufacturing',
      excerpt: 'What is MOQ? How it affects pricing? How to negotiate lower MOQ? Essential knowledge for new brands working with manufacturers.',
      date: '2024-01-05',
      category: 'Manufacturing 101',
      readTime: '6 min read',
    },
    {
      title: 'T-Shirt Fabric Guide: Cotton vs Polyester vs Blends',
      excerpt: 'Detailed guide to t-shirt fabrics including GSM, shrinkage, breathability, durability, and best uses. Make informed fabric choices.',
      date: '2023-12-28',
      category: 'Product Guide',
      readTime: '10 min read',
    },
    {
      title: 'How to Import Clothing from Bangladesh to USA',
      excerpt: 'Step-by-step import guide covering customs, duties, documentation, shipping methods, and compliance with USA textile regulations.',
      date: '2023-12-20',
      category: 'Import/Export',
      readTime: '15 min read',
    },
    {
      title: 'OEKO-TEX Certification Explained: Why It Matters for Your Brand',
      excerpt: 'What is OEKO-TEX Standard 100? Why consumers care? How it affects your market access? Complete certification guide for fashion brands.',
      date: '2023-12-15',
      category: 'Certifications',
      readTime: '7 min read',
    },
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Manufacturing Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Expert guides, industry insights, and practical advice for fashion entrepreneurs and brands.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-primary-600 font-semibold">{post.category}</span>
                    <span className="text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 hover:text-primary-600">
                    <Link href="/blog/slug">{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{post.date}</span>
                    <Link href="/blog/slug" className="text-primary-600 font-semibold hover:text-primary-700">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Manufacturing Advice?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? Contact our team for personalized guidance.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
