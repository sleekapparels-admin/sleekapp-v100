import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Sleek Apparels Limited</h3>
            <p className="text-sm mb-4">
              Low MOQ clothing manufacturer in Bangladesh. OEKO-TEX & BSCI certified.
              MOQ 50 pieces, 15-20 day production.
            </p>
            <div className="flex space-x-4">
              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">OEKO-TEX</span>
              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">BSCI</span>
              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">WRAP</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/products" className="hover:text-white">Products</Link></li>
              <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
              <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/t-shirts" className="hover:text-white">Custom T-Shirts</Link></li>
              <li><Link href="/products/hoodies" className="hover:text-white">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/products/activewear" className="hover:text-white">Activewear</Link></li>
              <li><Link href="/products/knitwear" className="hover:text-white">Knitwear</Link></li>
              <li><Link href="/products/uniforms" className="hover:text-white">Uniforms</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>01, Road 19A, Sector 04, Uttara</li>
              <li>Dhaka 1230, Bangladesh</li>
              <li className="pt-2">
                <Link href="/contact" className="text-primary-400 hover:text-primary-300">
                  Get in Touch →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Sleek Apparels Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
