import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { ConversationalQuoteBuilder } from "@/components/quote/ConversationalQuoteBuilder";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

const QuoteGenerator = () => {
  return (
    <>
      <SEO 
        config={getPageSEO('quote')} 
        includeServiceSchema 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <RouteErrorBoundary
          fallbackTitle="Quote Generator Error"
          fallbackDescription="The quote generator encountered an issue. Please try again."
        >
          <div className="container mx-auto px-4 py-12 pt-24">
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold text-foreground">
                AI-Powered Quote Generator
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get instant, market-researched quotes backed by real-time pricing data from verified sources
              </p>
            </div>
            <ConversationalQuoteBuilder />
          </div>
        </RouteErrorBoundary>
        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default QuoteGenerator;