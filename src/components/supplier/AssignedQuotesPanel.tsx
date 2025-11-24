import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface AssignedQuote {
  id: string;
  buyer_id: string;
  product_type: string;
  quantity: number;
  target_price_per_unit: number;
  fabric_type: string;
  additional_requirements: string;
  target_delivery_date: string;
  status: string;
  assigned_at: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  profiles?: {
    full_name: string;
    email: string;
    company_name: string;
  };
}

interface SupplierProps {
  supplierId: string;
}

export function AssignedQuotesPanel({ supplierId }: SupplierProps) {
  const queryClient = useQueryClient();
  const [selectedQuote, setSelectedQuote] = useState<AssignedQuote | null>(null);
  const [supplierPrice, setSupplierPrice] = useState('');
  const [supplierNotes, setSupplierNotes] = useState('');
  const [responseAction, setResponseAction] = useState<'accept' | 'reject' | null>(null);

  // Fetch assigned quotes for this supplier
  const { data: assignedQuotes = [], isLoading } = useQuery({
    queryKey: ['supplier-assigned-quotes', supplierId],
    queryFn: async (): Promise<AssignedQuote[]> => {
      const { data, error } = await (supabase as any)
        .from('quotes')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch buyer profiles separately
      const buyerIds = [...new Set(data?.map((q: any) => q.buyer_id).filter(Boolean))] as string[];
      if (buyerIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name')
        .in('id', buyerIds);

      return (data || []).map((quote: any) => ({
        ...quote,
        assigned_at: quote.created_at,
        profiles: profiles?.find(p => p.id === quote.buyer_id) || {
          full_name: '',
          email: '',
          company_name: ''
        }
      }));
    },
    enabled: !!supplierId,
  });

  // Respond to quote mutation
  const respondToQuoteMutation = useMutation({
    mutationFn: async ({
      quoteId,
      action,
      price,
      notes,
    }: {
      quoteId: string;
      action: 'accept' | 'reject';
      price?: string;
      notes?: string;
    }) => {
      const updateData: any = {
        status: action === 'accept' ? 'supplier_accepted' : 'supplier_rejected',
        updated_at: new Date().toISOString(),
      };

      // If accepting, save supplier pricing info in additional_requirements (or create a new field)
      if (action === 'accept' && price) {
        updateData.additional_requirements = JSON.stringify({
          supplier_price: parseFloat(price),
          supplier_notes: notes || '',
          response_date: new Date().toISOString(),
        });
      }

      const { error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.action === 'accept'
          ? 'Quote accepted successfully!'
          : 'Quote declined'
      );
      queryClient.invalidateQueries({ queryKey: ['supplier-assigned-quotes'] });
      setSelectedQuote(null);
      setSupplierPrice('');
      setSupplierNotes('');
      setResponseAction(null);
    },
    onError: (error) => {
      toast.error('Failed to respond to quote');
      console.error('Response error:', error);
    },
  });

  const handleRespond = () => {
    if (!selectedQuote || !responseAction) return;

    if (responseAction === 'accept' && !supplierPrice) {
      toast.error('Please enter your price');
      return;
    }

    respondToQuoteMutation.mutate({
      quoteId: selectedQuote.id,
      action: responseAction,
      price: supplierPrice,
      notes: supplierNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { variant: 'default' as const, label: 'Pending Response', color: 'bg-yellow-100 text-yellow-800' },
      supplier_accepted: { variant: 'default' as const, label: 'Accepted', color: 'bg-green-100 text-green-800' },
      supplier_rejected: { variant: 'destructive' as const, label: 'Declined', color: 'bg-red-100 text-red-800' },
      completed: { variant: 'secondary' as const, label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {assignedQuotes.filter(q => q.status === 'assigned').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {assignedQuotes.filter(q => q.status === 'supplier_accepted').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Total Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {assignedQuotes.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Assigned Quotes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Quotes assigned to you by Sleek Apparels admin
          </p>
        </CardHeader>
        <CardContent>
          {assignedQuotes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Target Price</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedQuotes.map((quote, index) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.product_type}</div>
                          {quote.fabric_type && (
                            <div className="text-sm text-muted-foreground">{quote.fabric_type}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{quote.quantity.toLocaleString()}</TableCell>
                      <TableCell>${quote.target_price_per_unit?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(quote.assigned_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assigned Quotes</h3>
              <p className="text-muted-foreground">
                You don't have any quotes assigned to you yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Details Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>
              Review the quote details and provide your response
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Quote Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quote Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Product Type</Label>
                    <p className="font-medium">{selectedQuote.product_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Quantity</Label>
                    <p className="font-medium">{selectedQuote.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Fabric Type</Label>
                    <p className="font-medium">{selectedQuote.fabric_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Target Price/Unit</Label>
                    <p className="font-medium">${selectedQuote.target_price_per_unit?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Target Delivery</Label>
                    <p className="font-medium">
                      {selectedQuote.target_delivery_date
                        ? format(new Date(selectedQuote.target_delivery_date), 'MMM dd, yyyy')
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedQuote.status)}</div>
                  </div>
                  {selectedQuote.additional_requirements && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Additional Requirements</Label>
                      <p className="font-medium text-sm mt-1">{selectedQuote.additional_requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Response Form (only if pending) */}
              {selectedQuote.status === 'assigned' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="supplier-price">Your Price per Unit *</Label>
                      <Input
                        id="supplier-price"
                        type="number"
                        step="0.01"
                        placeholder="Enter your price"
                        value={supplierPrice}
                        onChange={(e) => setSupplierPrice(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="supplier-notes">Notes (Optional)</Label>
                      <Textarea
                        id="supplier-notes"
                        placeholder="Add any notes or comments..."
                        value={supplierNotes}
                        onChange={(e) => setSupplierNotes(e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => {
                          setResponseAction('accept');
                          handleRespond();
                        }}
                        disabled={respondToQuoteMutation.isPending || !supplierPrice}
                        className="flex-1 gap-2"
                      >
                        {respondToQuoteMutation.isPending && responseAction === 'accept' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Accept Quote
                      </Button>
                      <Button
                        onClick={() => {
                          setResponseAction('reject');
                          handleRespond();
                        }}
                        disabled={respondToQuoteMutation.isPending}
                        variant="destructive"
                        className="flex-1 gap-2"
                      >
                        {respondToQuoteMutation.isPending && responseAction === 'reject' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Decline Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
