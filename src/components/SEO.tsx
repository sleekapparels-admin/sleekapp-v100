import { Helmet } from 'react-helmet';
import { SEOConfig, organizationSchema } from '@/lib/seo';
import { localBusinessSchema, serviceSchema } from '@/lib/structuredData';

interface SEOProps {
  config: SEOConfig;
  includeOrganizationSchema?: boolean;
  includeLocalBusinessSchema?: boolean;
  includeServiceSchema?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO = ({ 
  config, 
  includeOrganizationSchema = false,
  includeLocalBusinessSchema = false,
  includeServiceSchema = false,
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const {
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType = 'website',
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = config;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Sleek Apparels" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:secure_url" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {(twitterImage || ogImage) && <meta name="twitter:image" content={twitterImage || ogImage} />}

      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="bingbot" content="index, follow, max-image-preview:large" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      <meta property="og:locale" content="en_US" />
      <meta name="language" content="English" />

      <meta name="author" content="Sleek Apparels Limited & Sleek Apparels LLC" />
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Dhaka, Bangladesh" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

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
};
