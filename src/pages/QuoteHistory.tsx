import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useQuotes } from "@/hooks/useQuotes";
import { QuoteHistoryCard } from "@/components/quote/QuoteHistoryCard";
import { QuoteComparison } from "@/components/quote/QuoteComparison";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { History, Plus, Scale, Package } from "lucide-react";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export default function QuoteHistory() {
  const { data: quotes, isLoading } = useQuotes();
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : prev.length < 3 
          ? [...prev, quoteId]
          : prev
    );
  };

  const selectedQuoteData = quotes?.filter(q => selectedQuotes.includes(q.id)) || [];

  return (
    <>
      <SEO 
        config={{
          title: "Quote History | Sleek Apparels",
          description: "View and compare your past manufacturing quotes",
          canonical: "https://sleekapparels.com/quote-history"
        }} 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <RouteErrorBoundary
          fallbackTitle="Quote History Error"
          fallbackDescription="Unable to load your quote history. Please try again."
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <History className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">Quote History</h1>
              </div>
              <p className="text-muted-foreground mb-6">
                View your past quotes, track status, and compare pricing
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/quote-generator">
                    <Plus className="w-4 h-4 mr-2" />
                    Get New Quote
                  </Link>
                </Button>
                
                {selectedQuotes.length > 1 && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowComparison(true)}
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Compare Selected ({selectedQuotes.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!quotes || quotes.length === 0) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Quotes Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by creating your first manufacturing quote
                  </p>
                  <Button asChild>
                    <Link to="/quote-generator">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Quote
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quotes Grid */}
            {!isLoading && quotes && quotes.length > 0 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <Badge variant="secondary">
                      {quotes.length} {quotes.length === 1 ? 'Quote' : 'Quotes'}
                    </Badge>
                  </div>
                  {selectedQuotes.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedQuotes.length}/3 selected for comparison
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {quotes.map(quote => (
                    <QuoteHistoryCard
                      key={quote.id}
                      quote={quote}
                      isSelected={selectedQuotes.includes(quote.id)}
                      onToggleSelect={toggleQuoteSelection}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </RouteErrorBoundary>

        <Footer />
      </div>

      {/* Comparison Modal */}
      {showComparison && selectedQuoteData.length > 1 && (
        <QuoteComparison
          quotes={selectedQuoteData}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  );
}
