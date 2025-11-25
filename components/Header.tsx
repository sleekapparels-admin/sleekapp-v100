import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Sleek Apparels
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary-600 font-medium">
              Services
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              Products
            </Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-primary-600 font-medium">
              Portfolio
            </Link>
            <Link href="/certifications" className="text-gray-700 hover:text-primary-600 font-medium">
              Certifications
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 font-medium">
              Blog
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary-600 font-medium">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
