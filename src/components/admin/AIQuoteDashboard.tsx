import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Sparkles,
  User,
  Calendar,
  Package,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AIQuote {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string;
  product_type: string;
  quantity: number;
  target_price: number;
  specifications: any;
  ai_suggested_price: number;
  status: 'pending' | 'interested' | 'assigned' | 'declined';
  created_at: string;
  interest_level?: 'high' | 'medium' | 'low';
  notes?: string;
}

export function AIQuoteDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<AIQuote | null>(null);
  const queryClient = useQueryClient();

  // Fetch AI quotes
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['ai-quotes', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          profiles:buyer_id (
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((quote: any) => ({
        id: quote.id,
        buyer_id: quote.buyer_id,
        buyer_name: quote.profiles?.full_name || 'Unknown',
        buyer_email: quote.profiles?.email || '',
        buyer_company: quote.profiles?.company_name || 'N/A',
        product_type: quote.product_type || 'Custom Product',
        quantity: quote.quantity || 0,
        target_price: quote.target_price || 0,
        specifications: quote.specifications || {},
        ai_suggested_price: quote.ai_suggested_price || 0,
        status: quote.status || 'pending',
        created_at: quote.created_at,
        interest_level: quote.interest_level,
        notes: quote.notes,
      })) as AIQuote[];
    },
  });

  // Update quote status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ quoteId, status, notes }: { quoteId: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('quotes')
        .update({ status, notes, updated_at: new Date().toISOString() })
        .eq('id', quoteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-quotes'] });
      toast.success('Quote status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update quote status');
    },
  });

  // Filter quotes by search query
  const filteredQuotes = quotes.filter(quote =>
    quote.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.buyer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.product_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    interested: quotes.filter(q => q.status === 'interested').length,
    assigned: quotes.filter(q => q.status === 'assigned').length,
    declined: quotes.filter(q => q.status === 'declined').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
      interested: { variant: 'default', icon: TrendingUp, label: 'Interested' },
      assigned: { variant: 'default', icon: CheckCircle, label: 'Assigned' },
      declined: { variant: 'destructive', icon: XCircle, label: 'Declined' },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Quote Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and manage AI-generated quotes from buyers
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Interested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.interested}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by buyer name, email, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quotes Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Target Price</TableHead>
                <TableHead>AI Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quote.buyer_name}</div>
                      <div className="text-sm text-muted-foreground">{quote.buyer_company}</div>
                    </div>
                  </TableCell>
                  <TableCell>{quote.product_type}</TableCell>
                  <TableCell>{quote.quantity.toLocaleString()}</TableCell>
                  <TableCell>${quote.target_price.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${quote.ai_suggested_price.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>{format(new Date(quote.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedQuote(quote)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Quote Details</DialogTitle>
                            <DialogDescription>
                              Manage this AI-generated quote
                            </DialogDescription>
                          </DialogHeader>
                          {selectedQuote && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Buyer Name</label>
                                  <p>{selectedQuote.buyer_name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Company</label>
                                  <p>{selectedQuote.buyer_company}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p>{selectedQuote.buyer_email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Product Type</label>
                                  <p>{selectedQuote.product_type}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Quantity</label>
                                  <p>{selectedQuote.quantity.toLocaleString()} units</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Target Price</label>
                                  <p>${selectedQuote.target_price.toFixed(2)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">AI Suggested Price</label>
                                  <p className="font-bold text-green-600">
                                    ${selectedQuote.ai_suggested_price.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Current Status</label>
                                  <div className="mt-1">{getStatusBadge(selectedQuote.status)}</div>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  onClick={() => {
                                    updateStatusMutation.mutate({
                                      quoteId: selectedQuote.id,
                                      status: 'interested',
                                      notes: 'Marked as interested by admin',
                                    });
                                  }}
                                  variant="default"
                                  className="flex-1"
                                >
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Mark Interested
                                </Button>
                                <Button
                                  onClick={() => {
                                    updateStatusMutation.mutate({
                                      quoteId: selectedQuote.id,
                                      status: 'declined',
                                      notes: 'Declined by admin',
                                    });
                                  }}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                                <Button
                                  onClick={() => {
                                    // Navigate to supplier assignment
                                    window.location.href = `/admin/quotes/${selectedQuote.id}/assign`;
                                  }}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Assign to Supplier
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quotes found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
