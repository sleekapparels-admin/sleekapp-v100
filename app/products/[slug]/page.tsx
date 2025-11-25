import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema';
import { getProductBySlug, getProducts } from '@/lib/api';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} Manufacturer Bangladesh | Low MOQ | Sleek Apparels`,
        description: product.description,
        keywords: [
            `${product.name.toLowerCase()} manufacturer`,
            'bangladesh apparel manufacturer',
            'low moq clothing',
            'custom clothing factory'
        ],
    };
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: 'https://sleekapparels.com/' },
        { name: 'Products', url: 'https://sleekapparels.com/products/' },
        { name: product.name, url: `https://sleekapparels.com/products/${product.slug}/` },
    ]);

    const productSchema = generateProductSchema({
        name: product.name,
        description: product.description,
        brand: 'Sleek Apparels Limited',
        offers: {
            price: product.priceRange.replace(/[^0-9.-]/g, ''), // Extract numeric part roughly
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
    });

    return (
        <>
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={productSchema} />

            <div className="bg-white">
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary-50 to-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary-600">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/products" className="hover:text-primary-600">Products</Link>
                            <span className="mx-2">/</span>
                            <span className="capitalize">{product.name}</span>
                        </nav>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            {product.name} Manufacturer Bangladesh
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mb-8">
                            {product.description}
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/contact"
                                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
                            >
                                Request Quote
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 font-semibold"
                            >
                                Get Free Sample
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Specifications */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold mb-12">Product Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold mb-6">Key Details</h3>
                                <table className="w-full">
                                    <tbody className="space-y-3">
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold">MOQ:</td>
                                            <td className="py-3">{product.moq}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold">Lead Time:</td>
                                            <td className="py-3">{product.leadTime}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-3 font-semibold">Price Range:</td>
                                            <td className="py-3 text-primary-600 font-bold">{product.priceRange}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold">Category:</td>
                                            <td className="py-3 capitalize">{product.category}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-lg">
                                <h3 className="text-2xl font-bold mb-6">Available Fabrics</h3>
                                <ul className="space-y-4">
                                    {product.fabrics.map((fabric, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-primary-600 mr-3 text-xl">•</span>
                                            <span className="font-medium">{fabric}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-primary-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold mb-6">Ready to Order {product.name}?</h2>
                        <p className="text-xl mb-8">
                            Contact us today with your specifications. We'll provide a detailed quote and arrange
                            free samples to ensure your complete satisfaction.
                        </p>
                        <Link
                            href="/contact"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold inline-block hover:bg-gray-100 transition-colors"
                        >
                            Get Quote & Free Samples
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
