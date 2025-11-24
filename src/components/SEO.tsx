import { Helmet } from 'react-helmet-async';
import { SEOConfig } from '@/lib/seo';

interface SEOProps {
  // Support both direct props and config object
  config?: SEOConfig;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
  keywords?: string;
  noindex?: boolean;
  // Additional props for structured data
  includeOrganizationSchema?: boolean;
  includeLocalBusinessSchema?: boolean;
  includeServiceSchema?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  config,
  title: directTitle,
  description: directDescription,
  canonical: directCanonical,
  ogImage: directOgImage,
  ogType: directOgType,
  schema: directSchema,
  keywords: directKeywords,
  noindex = false,
  includeOrganizationSchema = false,
  includeLocalBusinessSchema = false,
  includeServiceSchema = false,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  // Use config values if provided, otherwise fall back to direct props
  const title = config?.title || directTitle || 'Sleek Apparels';
  const description = config?.description || directDescription || '';
  const canonical = config?.canonical || directCanonical;
  const ogImage = config?.ogImage || directOgImage || 'https://sleekapparels.com/sleek-logo.webp';
  const ogType = config?.ogType || directOgType || 'website';
  const keywords = config?.keywords || directKeywords;
  const ogTitle = config?.ogTitle;
  const ogDescription = config?.ogDescription;
  const twitterTitle = config?.twitterTitle;
  const twitterDescription = config?.twitterDescription;
  const twitterImage = config?.twitterImage;
  
  const fullTitle = title.includes('Sleek Apparels') ? title : `${title} | Sleek Apparels`;
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : 'https://sleekapparels.com');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Sleek Apparels" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={twitterTitle || ogTitle || fullTitle} />
      <meta property="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta property="twitter:image" content={twitterImage || ogImage} />
      
      {/* Schema.org JSON-LD */}
      {directSchema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(directSchema) ? directSchema : [directSchema])}
        </script>
      )}
      {includeOrganizationSchema && (
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      )}
      {includeLocalBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      {includeServiceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
}

// Import structured data schemas
import { localBusinessSchema, serviceSchema } from '@/lib/structuredData';

// Predefined schema objects for common use cases
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingManufacturer",
  "name": "Sleek Apparels Limited",
  "alternateName": "Sleek Apparels",
  "url": "https://sleekapparels.com",
  "logo": "https://sleekapparels.com/sleek-logo.webp",
  "description": "Low MOQ clothing manufacturer in Bangladesh. 50-piece minimum order. OEKO-TEX & BSCI certified. Fast 15-20 day production for fashion startups and DTC brands.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "01, Road 19A, Sector 04, Uttara",
    "addressLocality": "Dhaka",
    "postalCode": "1230",
    "addressCountry": "BD"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+880-186-1011-367",
    "contactType": "Customer Service",
    "areaServed": ["US", "GB", "DE", "CA", "AU"],
    "availableLanguage": ["English", "Bengali"]
  },
  "areaServed": ["United States", "United Kingdom", "Germany", "Canada", "Australia"],
  "hasCredential": [
    {
      "@type": "Certification",
      "name": "OEKO-TEX Standard 100",
      "credentialCategory": "Textile Safety"
    },
    {
      "@type": "Certification",
      "name": "BSCI Certification",
      "credentialCategory": "Ethical Production"
    },
    {
      "@type": "Certification",
      "name": "WRAP Certification",
      "credentialCategory": "Social Compliance"
    }
  ],
  "makesOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Product",
      "name": "Custom Apparel Manufacturing",
      "description": "T-shirts, hoodies, activewear, uniforms, knitwear with 50-piece minimum order"
    },
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "minPrice": "50",
      "priceCurrency": "USD"
    }
  },
  "sameAs": [
    "https://www.linkedin.com/company/sleek-apparels",
    "https://www.facebook.com/sleekapparels"
  ]
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const productSchema = (product: {
  name: string;
  description: string;
  image?: string;
  minPrice: string;
  maxPrice?: string;
  currency?: string;
  availability?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image || "https://sleekapparels.com/sleek-logo.webp",
  "brand": {
    "@type": "Brand",
    "name": "Sleek Apparels"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Sleek Apparels Limited"
  },
  "offers": {
    "@type": "Offer",
    "price": product.minPrice,
    "priceCurrency": product.currency || "USD",
    "availability": product.availability || "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "url": typeof window !== 'undefined' ? window.location.href : "https://sleekapparels.com"
  }
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const articleSchema = (article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "image": article.image || "https://sleekapparels.com/sleek-logo.webp",
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": article.author || "Sleek Apparels Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Sleek Apparels",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sleekapparels.com/sleek-logo.webp"
    }
  }
});
