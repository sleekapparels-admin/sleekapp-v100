import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Package, Clock, CheckCircle, XCircle, ArrowRight, Globe } from "lucide-react";
import { CreateSupplierOrderDialog } from "@/components/admin/CreateSupplierOrderDialog";
import { SpecialtySourcingPanel } from "@/components/admin/SpecialtySourcingPanel";
import { toast } from "sonner";
import { Quote } from "@/hooks/useQuotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSpecialtyDialog, setShowSpecialtyDialog] = useState(false);
  const [specialtyQuote, setSpecialtyQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes((data as Quote[]) || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToOrder = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowCreateDialog(true);
  };

  const handleManageSpecialty = (quote: Quote) => {
    setSpecialtyQuote(quote);
    setShowSpecialtyDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "matched":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "quoted":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "converted":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "matched":
      case "quoted":
        return <Package className="h-4 w-4" />;
      case "converted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filterQuotesByStatus = (status: string) => {
    if (status === "all") return quotes;
    return quotes.filter((q) => q.status === status);
  };

  const QuoteCard = ({ quote }: { quote: Quote }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{quote.product_type}</h3>
            <Badge className={getStatusColor(quote.status)}>
              {getStatusIcon(quote.status)}
              <span className="ml-1">{quote.status}</span>
            </Badge>
            {quote.specialty_sourcing_required && (
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                <Globe className="h-3 w-3 mr-1" />
                Specialty
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Quantity: {quote.quantity} units
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleManageSpecialty(quote)} size="sm" variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Specialty
          </Button>
          {quote.status === "pending" && (
            <Button onClick={() => handleConvertToOrder(quote)} size="sm">
              Create Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Customer</p>
          <p className="text-sm">{quote.customer_name || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{quote.customer_email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Contact</p>
          <p className="text-sm">{quote.customer_phone || "N/A"}</p>
        </div>
      </div>

      {quote.target_price_per_unit && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">Target Price</p>
          <p className="text-sm">${quote.target_price_per_unit}/unit</p>
        </div>
      )}

      {quote.fabric_type && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">Fabric Type</p>
          <p className="text-sm">{quote.fabric_type}</p>
        </div>
      )}

      {quote.customization_details && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">Customization</p>
          <p className="text-sm">{quote.customization_details}</p>
        </div>
      )}

      {quote.additional_requirements && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">Requirements</p>
          <p className="text-sm">{quote.additional_requirements}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Submitted: {new Date(quote.created_at).toLocaleDateString()}
      </p>
    </Card>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading quotes...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Quote Management</h1>
            <p className="text-muted-foreground">
              View and manage buyer quote requests
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({quotes.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filterQuotesByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger value="matched">
                Matched ({filterQuotesByStatus("matched").length})
              </TabsTrigger>
              <TabsTrigger value="quoted">
                Quoted ({filterQuotesByStatus("quoted").length})
              </TabsTrigger>
              <TabsTrigger value="converted">
                Converted ({filterQuotesByStatus("converted").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {quotes.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No quote requests yet</p>
                </Card>
              ) : (
                quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterQuotesByStatus("pending").map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </TabsContent>

            <TabsContent value="matched" className="space-y-4">
              {filterQuotesByStatus("matched").map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </TabsContent>

            <TabsContent value="quoted" className="space-y-4">
              {filterQuotesByStatus("quoted").map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </TabsContent>

            <TabsContent value="converted" className="space-y-4">
              {filterQuotesByStatus("converted").map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateSupplierOrderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchQuotes();
          toast.success("Order created from quote!");
        }}
        prefilledData={selectedQuote ? {
          buyerEmail: selectedQuote.customer_email,
          buyerName: selectedQuote.customer_name,
          productType: selectedQuote.product_type,
          quantity: selectedQuote.quantity,
        } : undefined}
      />

      <Dialog open={showSpecialtyDialog} onOpenChange={setShowSpecialtyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Specialty Sourcing Required</DialogTitle>
            <DialogDescription>
              Review and manage specialty sourcing requirements for this quote
            </DialogDescription>
            <DialogTitle>Specialty Sourcing Management</DialogTitle>
          </DialogHeader>
          {specialtyQuote && (
            <SpecialtySourcingPanel 
              quote={specialtyQuote} 
              onUpdate={() => {
                fetchQuotes();
                setShowSpecialtyDialog(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
