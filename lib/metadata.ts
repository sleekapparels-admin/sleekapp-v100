import { Metadata } from 'next';

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateMetadata(seo: PageSEO): Metadata {
  const siteName = 'Sleek Apparels Limited';
  const baseUrl = 'https://sleekapparels.com';
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    authors: [{ name: 'Sleek Apparels Limited' }],
    creator: 'Sleek Apparels Limited',
    publisher: 'Sleek Apparels Limited',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical || baseUrl,
      siteName: siteName,
      images: [
        {
          url: seo.ogImage || `${baseUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || `${baseUrl}/images/og-default.jpg`],
    },
    alternates: {
      canonical: seo.canonical || baseUrl,
    },
  };
}

export const defaultSEO: PageSEO = {
  title: 'Low MOQ Clothing Manufacturer Bangladesh | MOQ 50 | USA Export - Sleek Apparels',
  description: 'Private label clothing manufacturer in Bangladesh. MOQ 50 pieces, 15-20 day production. OEKO-TEX & BSCI certified. T-shirts, hoodies, activewear for USA brands.',
  keywords: [
    'low moq clothing manufacturer bangladesh',
    'private label clothing manufacturer',
    'bangladesh clothing manufacturer usa export',
    'custom t-shirt manufacturer bangladesh',
    'ethical clothing factory bangladesh',
    'oeko-tex certified manufacturer',
    'small batch clothing manufacturer',
    'startup clothing manufacturer',
    'knitwear manufacturer bangladesh',
  ],
};
