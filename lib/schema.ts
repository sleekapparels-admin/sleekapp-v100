// JSON-LD Schema Markup Generators for SEO

export interface Organization {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed: string[];
    availableLanguage: string[];
  };
}

export function generateOrganizationSchema(org: Organization) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingManufacturer',
    name: org.name,
    alternateName: org.alternateName,
    description: org.description,
    url: org.url,
    logo: org.logo,
    address: {
      '@type': 'PostalAddress',
      ...org.address,
    },
    areaServed: ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'Europe'],
    hasCredential: [
      { '@type': 'Certification', name: 'OEKO-TEX Standard 100' },
      { '@type': 'Certification', name: 'BSCI Certification' },
      { '@type': 'Certification', name: 'WRAP Certification' },
    ],
    ...(org.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...org.contactPoint,
      },
    }),
  };
}

export interface Product {
  name: string;
  description: string;
  image?: string[];
  brand: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    ...(product.image && { image: product.image }),
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: product.offers.availability,
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'Organization',
        name: product.brand,
      },
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
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
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export const defaultOrganization: Organization = {
  name: 'Sleek Apparels Limited',
  alternateName: 'Sleek Apparels LLC',
  description: 'Low MOQ clothing manufacturer in Bangladesh. MOQ 50 pieces. OEKO-TEX, BSCI, WRAP certified.',
  url: 'https://sleekapparels.com',
  logo: 'https://sleekapparels.com/images/logo.png',
  address: {
    streetAddress: '01, Road 19A, Sector 04, Uttara',
    addressLocality: 'Dhaka',
    postalCode: '1230',
    addressCountry: 'BD',
  },
  contactPoint: {
    telephone: '+880-1700000000',
    contactType: 'Sales',
    areaServed: ['US', 'UK', 'EU', 'CA', 'AU'],
    availableLanguage: ['English', 'Bengali'],
  },
};
