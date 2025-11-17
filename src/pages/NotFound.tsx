import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Track 404 error in analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_not_found', {
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);


  return (
    <>
      <SEO 
        config={{
          title: "Page Not Found - 404 Error | Sleek Apparels",
          description: "The page you're looking for doesn't exist. Navigate back to our main site to explore our apparel manufacturing services.",
          canonical: `${typeof window !== 'undefined' ? window.location.origin : 'https://sleekapparels.com'}${location.pathname}`,
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-2xl w-full text-center">
          {/* Large 404 Icon */}
          <div className="flex justify-center mb-8">
            <FileQuestion 
              className="w-32 h-32" 
              style={{ color: '#2D5C4E' }}
              strokeWidth={1.5}
            />
          </div>

          {/* Heading */}
          <h1 
            className="font-bold mb-4"
            style={{ 
              fontSize: '40px', 
              color: '#2C2C2C',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Page Not Found
          </h1>

          {/* Subheading */}
          <p 
            className="mb-8"
            style={{ 
              fontSize: '18px', 
              color: '#666666',
              fontFamily: 'Open Sans, sans-serif'
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Three Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              asChild
              style={{
                backgroundColor: '#2D5C4E',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <Link to="/">Go to Homepage</Link>
            </Button>

            <Button 
              asChild
              style={{
                backgroundColor: '#C9846D',
                color: 'white',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <Link to="/quote-generator">Get a Quote</Link>
            </Button>

            <Button 
              asChild
              variant="outline"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #2D5C4E',
                color: '#2D5C4E',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Popular Pages */}
          <div className="pt-8 border-t" style={{ borderColor: '#E5E7EB' }}>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '12px' }}>
              Popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Link 
                to="/about" 
                className="hover:underline"
                style={{ color: '#2D5C4E' }}
              >
                About Us
              </Link>
              <span style={{ color: '#666666' }}>|</span>
              <Link 
                to="/casualwear" 
                className="hover:underline"
                style={{ color: '#2D5C4E' }}
              >
                Our Services
              </Link>
              <span style={{ color: '#666666' }}>|</span>
              <Link 
                to="/capabilities" 
                className="hover:underline"
                style={{ color: '#2D5C4E' }}
              >
                Capabilities
              </Link>
              <span style={{ color: '#666666' }}>|</span>
              <Link 
                to="/contact" 
                className="hover:underline"
                style={{ color: '#2D5C4E' }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
