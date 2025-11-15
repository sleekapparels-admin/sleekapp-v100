// Structured Data (Schema.org) Utilities for SEO

const BASE_URL = 'https://sleekapparels.com';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
};

export interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  category?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}

export const generateProductSchema = (product: ProductSchema) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    ...(product.sku && { sku: product.sku }),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Sleek Apparels',
    },
    ...(product.category && { category: product.category }),
    ...(product.offers && {
      offers: {
        '@type': 'Offer',
        priceCurrency: product.offers.priceCurrency || 'USD',
        price: product.offers.price,
        availability:
          product.offers.availability || 'https://schema.org/InStock',
        url: BASE_URL,
      },
    }),
  };
};

export interface ArticleSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

export const generateArticleSchema = (article: ArticleSchema) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'Kh Raj Rahman',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sleek Apparels',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/sleek-logo.webp`,
      },
    },
  };
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Sleek Apparels',
  description: 'Ethical garment manufacturer in Bangladesh specializing in low-MOQ knitwear, cut & sew, and sustainable apparel production',
  url: BASE_URL,
  telephone: '+880-186-1011-367',
  email: 'inquiry@sleekapparels.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '01, Road 19A, Sector 04, Uttara',
    addressLocality: 'Dhaka',
    addressRegion: 'Dhaka Division',
    postalCode: '1230',
    addressCountry: 'BD',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.8759',
    longitude: '90.3795',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  priceRange: '$$',
  image: `${BASE_URL}/og-image.jpg`,
  sameAs: [
    'https://www.linkedin.com/company/sleek-apparels',
    'https://www.instagram.com/sleekapparels',
  ],
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Apparel Manufacturing',
  provider: {
    '@type': 'Organization',
    name: 'Sleek Apparels',
    url: BASE_URL,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Manufacturing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Knitwear Manufacturing',
          description: 'Low MOQ knitwear production from 50-300 pieces. Sweaters, polos, cardigans with organic and sustainable materials.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Cut & Sew Manufacturing',
          description: 'Full-package woven garment production. Shirts, jackets, trousers with MOQ 100-500 pieces.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Uniform & Teamwear Production',
          description: 'Corporate, school, and sports uniform manufacturing from 50-200 pieces.',
        },
      },
    ],
  },
};
