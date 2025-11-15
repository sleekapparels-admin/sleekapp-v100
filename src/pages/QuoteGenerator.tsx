import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { AIQuoteGeneratorWithOTP } from "@/components/AIQuoteGeneratorWithOTP";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

const QuoteGenerator = () => {
  return (
    <>
      <SEO config={getPageSEO('quote')} />

      <div className="min-h-screen bg-background">
        <Navbar />
        <RouteErrorBoundary
          fallbackTitle="Quote Generator Error"
          fallbackDescription="The quote generator encountered an issue. Please try again."
        >
          <div className="pt-20 relative">
            {/* Subtle Logo Watermark */}
            <div className="absolute top-8 right-8 opacity-5 pointer-events-none hidden lg:block">
              <img 
                src="/sleek-logo.webp" 
                alt="" 
                className="w-48 h-48 object-contain"
                aria-hidden="true"
              />
            </div>
            <AIQuoteGeneratorWithOTP />
          </div>
        </RouteErrorBoundary>
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default QuoteGenerator;