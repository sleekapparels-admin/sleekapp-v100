import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Package, Phone, FileQuestion } from "lucide-react";
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

  const quickLinks = [
    { name: "Home", href: "/", icon: Home, description: "Return to homepage" },
    { name: "Services", href: "/services", icon: Package, description: "Explore our services" },
    { name: "Contact", href: "/contact", icon: Phone, description: "Get in touch" },
    { name: "FAQ", href: "/faq", icon: FileQuestion, description: "Common questions" },
  ];

  return (
    <>
      <SEO 
        config={{
          title: "Page Not Found - 404 Error | Sleek Apparels",
          description: "The page you're looking for doesn't exist. Navigate back to our main site to explore our apparel manufacturing services.",
          canonical: `${typeof window !== 'undefined' ? window.location.origin : 'https://sleekapparels.com'}${location.pathname}`,
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold">404</CardTitle>
            <CardDescription className="text-lg">
              We couldn't find the page you're looking for
            </CardDescription>
            {import.meta.env.DEV && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <strong>Attempted path:</strong> {location.pathname}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                The page may have been moved, deleted, or the URL might be incorrect.
              </p>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Link to="/">
                <Button className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </div>

            {/* Quick links */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold mb-4 text-center">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link) => (
                  <Link key={link.href} to={link.href}>
                    <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                        <link.icon className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{link.name}</div>
                          <div className="text-xs text-muted-foreground">{link.description}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotFound;
