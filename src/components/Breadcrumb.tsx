import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { generateBreadcrumbSchema } from '@/lib/structuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

const routeNameMap: Record<string, string> = {
  services: 'Services',
  knitwear: 'Knitwear',
  'cut-and-sew': 'Cut & Sew',
  'uniforms-teamwear': 'Uniforms & Teamwear',
  portfolio: 'Portfolio',
  about: 'About Us',
  sustainability: 'Sustainability',
  contact: 'Contact',
  'quote-generator': 'Quote Generator',
  'design-studio': 'Design Studio',
  blog: 'Blog',
  faq: 'FAQ',
  orders: 'Orders',
  dashboard: 'Dashboard',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
  ];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbItems.push({
      name,
      url: currentPath,
    });
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <nav aria-label="Breadcrumb" className="bg-muted/30 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {breadcrumbItems.slice(1).map((item, index) => {
              const isLast = index === breadcrumbItems.length - 2;
              return (
                <li key={item.url} className="flex items-center space-x-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {isLast ? (
                    <span className="text-foreground font-medium" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.url}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};
