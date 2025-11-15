import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Loader2, ArrowLeft, Package, DollarSign, Calendar, TrendingDown } from "lucide-react";

const QuoteDetails = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) {
        toast({
          title: "Invalid quote",
          description: "No quote ID provided",
          variant: "destructive",
        });
        navigate("/quote-history");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("ai_quotes")
          .select("*")
          .eq("id", quoteId)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error("Quote not found");
        }

        setQuote(data);
      } catch (error: any) {
        console.error("Error fetching quote:", error);
        toast({
          title: "Error loading quote",
          description: error.message || "Unable to load quote details",
          variant: "destructive",
        });
        navigate("/quote-history");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId, navigate, toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!quote) {
    return null;
  }

  const quoteData = quote.quote_data || {};
  const totalPrice = quote.total_price || 0;
  const unitPrice = totalPrice / quote.quantity || 0;

  return (
    <>
      <SEO 
        config={{
          title: `Quote Details - ${quote.product_type}`,
          description: "View your manufacturing quote details",
          canonical: `/quote-details/${quote.id}`,
        }} 
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/quote-history")}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>

            <div className="space-y-6">
              {/* Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{quote.product_type}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={quote.status === 'converted' ? 'default' : 'secondary'}>
                      {quote.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="text-2xl font-bold">{quote.quantity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Price</p>
                        <p className="text-2xl font-bold">${unitPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Time</p>
                        <p className="text-2xl font-bold">{quote.estimated_delivery_days}d</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quote.fabric_type && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fabric Type</p>
                      <p>{quote.fabric_type}</p>
                    </div>
                  )}
                  {quote.complexity_level && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Complexity Level</p>
                      <p className="capitalize">{quote.complexity_level}</p>
                    </div>
                  )}
                  {quote.additional_requirements && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Additional Requirements</p>
                      <p className="whitespace-pre-wrap">{quote.additional_requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Suggestions */}
              {quote.ai_suggestions && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{quote.ai_suggestions}</p>
                  </CardContent>
                </Card>
              )}

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{quote.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{quote.customer_email}</p>
                  </div>
                  {quote.phone_number && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p>{quote.phone_number}</p>
                    </div>
                  )}
                  {quote.country && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Country</p>
                      <p>{quote.country}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default QuoteDetails;
