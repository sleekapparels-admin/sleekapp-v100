import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuotesManagementSection } from "@/components/buyer/QuotesManagementSection";
import { LoopTraceOrderTracking } from "@/components/buyer/LoopTraceOrderTracking";
import { InvoicesPaymentsSection } from "@/components/buyer/InvoicesPaymentsSection";
import { CommunicationCenter } from "@/components/shared/CommunicationCenter";
import { Package, FileText, CreditCard, MessageSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Manage your orders, quotes, and communications</p>
          </div>

          <Tabs defaultValue="tracking" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Tracking
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Quotes
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Invoices & Payments
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <LoopTraceOrderTracking />
            </TabsContent>

            <TabsContent value="quotes">
              <QuotesManagementSection />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesPaymentsSection />
            </TabsContent>

            <TabsContent value="messages">
              <CommunicationCenter />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
