import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { quoteHelpers } from "@/lib/supabaseHelpers";
import { Loader2, Mail, Phone, MapPin, DollarSign, Package, Calendar, TrendingUp, Search, Filter } from "lucide-react";
import { LeadFollowupEmailDialog } from "@/components/LeadFollowupEmailDialog";
import { format } from "date-fns";
import { trackBusinessEvent } from "@/lib/analytics";
import type { AIQuote } from "@/types/database";

const AdminLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");

  // Fetch leads
  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads", statusFilter, leadStatusFilter],
    queryFn: async () => {
      let query = supabase
        .from("ai_quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (leadStatusFilter !== "all") {
        query = query.eq("lead_status", leadStatusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AIQuote[];
    },
  });

  // Convert to order mutation
  const convertMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { data, error } = await supabase.functions.invoke("convert-quote-to-order", {
        body: { quoteId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Track conversion event
      trackBusinessEvent.quoteRequest("lead_converted", 1);
      
      toast({
        title: "Order Created!",
        description: `Order #${data.order.orderNumber} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const stats = {
    total: leads?.length || 0,
    converted: leads?.filter((l) => l.status === "converted").length || 0,
    pending: leads?.filter((l) => l.status === "draft").length || 0,
    totalValue: leads?.reduce((sum, l) => sum + Number(l.total_price), 0) || 0,
    conversionRate: leads?.length ? ((leads.filter((l) => l.status === "converted").length / leads.length) * 100).toFixed(1) : "0",
  };

  // Filter leads by search term
  const filteredLeads = leads?.filter((lead: AIQuote) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.customer_name?.toLowerCase().includes(searchLower) ||
      lead.customer_email?.toLowerCase().includes(searchLower) ||
      lead.product_type?.toLowerCase().includes(searchLower)
    );
  });

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-purple-500";
      case "hot":
        return "bg-red-500";
      case "warm":
        return "bg-orange-500";
      case "cold":
        return "bg-gray-500";
      case "lost":
        return "bg-black";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Leads Dashboard</h1>
            <p className="text-muted-foreground">Manage your quote requests and convert them to orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Leads</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Converted</CardDescription>
                <CardTitle className="text-3xl text-green-500">{stats.converted}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl text-yellow-500">{stats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Conversion Rate</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-1">
                  {stats.conversionRate}%
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Quote Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Pending</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={leadStatusFilter} onValueChange={setLeadStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Lead Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>
                {filteredLeads?.length || 0} leads found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredLeads && filteredLeads.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lead Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.customer_name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {lead.country}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.customer_email}
                              </div>
                              {lead.phone_number && (
                                <div className="text-sm flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone_number}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.product_type}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {lead.quantity} pcs
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-semibold flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {lead.total_price.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${(lead.total_price / lead.quantity).toFixed(2)}/pc
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status === "draft" ? "Pending" : "Converted"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getLeadStatusColor(lead.lead_status)}>
                              {lead.lead_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(lead.created_at), "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <LeadFollowupEmailDialog quoteId={lead.id} customerName={lead.customer_name} />
                              {lead.status !== "converted" && (
                                <Button
                                  size="sm"
                                  onClick={() => convertMutation.mutate(lead.id)}
                                  disabled={convertMutation.isPending}
                                >
                                  {convertMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Convert to Order"
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No leads found. Leads will appear here when customers request quotes.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
