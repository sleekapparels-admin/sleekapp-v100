import { supabase } from './supabase';
import { Product } from './types';

const FALLBACK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Custom T-Shirts',
        slug: 't-shirts',
        description: '180-240 GSM premium t-shirts. 100% cotton, cotton-polyester blends. Round neck, V-neck, polo styles. Screen printing and embroidery available.',
        moq: '50 pieces',
        leadTime: '15-20 days',
        fabrics: ['100% Cotton', 'Cotton-Polyester', 'Organic Cotton', 'Performance Jersey'],
        priceRange: '$3.00-$6.00',
        category: 't-shirts'
    },
    {
        id: '2',
        name: 'Hoodies & Sweatshirts',
        slug: 'hoodies',
        description: '280-320 GSM fleece-lined hoodies. Pullover and zip-up styles. Kangaroo pocket, ribbed cuffs. Perfect for streetwear and athleisure brands.',
        moq: '50 pieces',
        leadTime: '18-22 days',
        fabrics: ['French Terry', 'Fleece', 'Cotton-Polyester Blend'],
        priceRange: '$12.00-$18.00',
        category: 'hoodies'
    },
    {
        id: '3',
        name: 'Activewear',
        slug: 'activewear',
        description: 'Performance fabrics with moisture-wicking properties. Leggings, sports bras, athletic tops, joggers. 4-way stretch for maximum comfort.',
        moq: '50 pieces',
        leadTime: '20-25 days',
        fabrics: ['Polyester-Spandex', 'Nylon-Spandex', 'Moisture-Wicking'],
        priceRange: '$8.00-$15.00',
        category: 'activewear'
    },
    {
        id: '4',
        name: 'Knitwear',
        slug: 'knitwear',
        description: 'Computerized flat knitting technology. Sweaters, cardigans, pullovers. Jacquard patterns, cable knit, ribbed designs. Premium yarns.',
        moq: '50 pieces',
        leadTime: '25-30 days',
        fabrics: ['Acrylic', 'Cotton Blend', 'Wool Blend', 'Cashmere Blend'],
        priceRange: '$15.00-$30.00',
        category: 'knitwear'
    },
    {
        id: '5',
        name: 'Uniforms',
        slug: 'uniforms',
        description: 'Corporate uniforms, school uniforms, sports team apparel. Durable fabrics, custom embroidery, bulk discounts available.',
        moq: '100 pieces',
        leadTime: '15-20 days',
        fabrics: ['Polyester-Cotton', 'Twill', 'Oxford'],
        priceRange: '$6.00-$12.00',
        category: 'uniforms'
    },
    {
        id: '6',
        name: 'Custom Polo Shirts',
        slug: 'polo-shirts',
        description: '200-220 GSM pique fabric. Classic collar design. Perfect for corporate wear, golf apparel, casual wear. Custom embroidery logo.',
        moq: '50 pieces',
        leadTime: '15-20 days',
        fabrics: ['Pique Cotton', 'Cotton-Polyester', 'Performance Pique'],
        priceRange: '$5.00-$9.00',
        category: 'polo-shirts'
    },
];

export async function getProducts(): Promise<Product[]> {
    try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.warn('Supabase fetch error:', error.message);
            return FALLBACK_PRODUCTS;
        }

        if (data && data.length > 0) {
            // Map Supabase data to Product interface if needed
            // Assuming the table columns match the interface for now
            return data as Product[];
        }

        // If data is empty, return fallback
        return FALLBACK_PRODUCTS;

    } catch (error) {
        console.error('Failed to fetch products:', error);
        return FALLBACK_PRODUCTS;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            // Fallback to local data if not found in DB
            return FALLBACK_PRODUCTS.find(p => p.slug === slug);
        }

        return data as Product;
    } catch (error) {
        console.error(`Failed to fetch product ${slug}:`, error);
        return FALLBACK_PRODUCTS.find(p => p.slug === slug);
    }
}
