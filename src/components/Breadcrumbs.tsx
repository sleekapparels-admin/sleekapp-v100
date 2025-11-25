import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbSchema, BreadcrumbItem } from "@/lib/structuredData";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const schema = generateBreadcrumbSchema(items);
  
  return (
    <>
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      
      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link 
              to="/" 
              className="flex items-center hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4" />
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.url} 
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
