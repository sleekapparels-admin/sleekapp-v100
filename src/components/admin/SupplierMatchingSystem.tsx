import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Users, 
  Search, 
  Zap, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UnassignedQuote {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string;
  product_type: string;
  quantity: number;
  target_price: number;
  specifications: any;
  created_at: string;
  urgency: 'high' | 'medium' | 'low';
}

interface SupplierProfile {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  specialization: string[];
  location: string;
  capacity: number;
  current_workload: number;
  rating: number;
  total_orders: number;
  on_time_delivery: number;
  average_response_time: number;
  price_competitiveness: number;
  match_score?: number;
}

interface MatchingRecommendation {
  quote_id: string;
  supplier_id: string;
  match_score: number;
  reasons: string[];
}

export function SupplierMatchingSystem() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<UnassignedQuote | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Fetch unassigned quotes
  const { data: unassignedQuotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ['unassigned-quotes', urgencyFilter],
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
        .is('supplier_id', null)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((quote: any) => {
        // Calculate urgency based on created_at and quantity
        const daysOld = Math.floor(
          (Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        let urgency: 'high' | 'medium' | 'low' = 'low';
        if (daysOld > 3 || quote.quantity > 1000) {
          urgency = 'high';
        } else if (daysOld > 1 || quote.quantity > 500) {
          urgency = 'medium';
        }

        return {
          id: quote.id,
          buyer_id: quote.buyer_id,
          buyer_name: quote.profiles?.full_name || 'Unknown',
          buyer_email: quote.profiles?.email || '',
          buyer_company: quote.profiles?.company_name || 'Unknown',
          product_type: quote.product_type,
          quantity: quote.quantity,
          target_price: quote.target_price || 0,
          specifications: quote.specifications,
          created_at: quote.created_at,
          urgency,
        } as UnassignedQuote;
      }).filter((quote: UnassignedQuote) => 
        urgencyFilter === 'all' || quote.urgency === urgencyFilter
      );
    },
  });

  // Fetch all verified suppliers
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['verified-suppliers'],
    queryFn: async () => {
      const { data: supplierProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'supplier')
        .eq('is_verified', true);

      if (profileError) throw profileError;

      // Get supplier stats
      const { data: orders } = await supabase
        .from('orders')
        .select('supplier_id, status, total_amount');

      const supplierStats = new Map<string, any>();
      
      supplierProfiles?.forEach((supplier: any) => {
        const supplierOrders = orders?.filter(o => o.supplier_id === supplier.id) || [];
        const completedOrders = supplierOrders.filter(o => o.status === 'delivered').length;
        const totalOrders = supplierOrders.length;
        
        supplierStats.set(supplier.id, {
          id: supplier.id,
          full_name: supplier.full_name || 'Unknown',
          email: supplier.email,
          company_name: supplier.company_name || 'Unknown',
          specialization: supplier.specialization || [],
          location: supplier.location || 'Unknown',
          capacity: supplier.capacity || 1000,
          current_workload: totalOrders,
          rating: supplier.rating || 4.0,
          total_orders: totalOrders,
          on_time_delivery: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 100,
          average_response_time: supplier.average_response_time || 24,
          price_competitiveness: supplier.price_competitiveness || 75,
        } as SupplierProfile);
      });

      return Array.from(supplierStats.values());
    },
  });

  // Calculate match score for a quote and supplier
  const calculateMatchScore = (quote: UnassignedQuote, supplier: SupplierProfile): number => {
    let score = 0;

    // Specialization match (40 points)
    if (supplier.specialization.includes(quote.product_type)) {
      score += 40;
    } else if (supplier.specialization.some(s => 
      quote.product_type.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(quote.product_type.toLowerCase())
    )) {
      score += 20;
    }

    // Capacity match (25 points)
    const workloadPercentage = (supplier.current_workload / supplier.capacity) * 100;
    if (workloadPercentage < 50) {
      score += 25;
    } else if (workloadPercentage < 75) {
      score += 15;
    } else if (workloadPercentage < 90) {
      score += 5;
    }

    // Rating (20 points)
    score += (supplier.rating / 5) * 20;

    // On-time delivery (15 points)
    score += (supplier.on_time_delivery / 100) * 15;

    return Math.round(score);
  };

  // Get recommended suppliers for a quote
  const getRecommendedSuppliers = (quote: UnassignedQuote): SupplierProfile[] => {
    return suppliers
      .map(supplier => ({
        ...supplier,
        match_score: calculateMatchScore(quote, supplier),
      }))
      .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
      .slice(0, 5);
  };

  // Assign supplier mutation
  const assignSupplierMutation = useMutation({
    mutationFn: async ({ quoteId, supplierId }: { quoteId: string; supplierId: string }) => {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          supplier_id: supplierId,
          status: 'assigned',
          assigned_at: new Date().toISOString(),
        })
        .eq('id', quoteId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Supplier assigned successfully!');
      queryClient.invalidateQueries({ queryKey: ['unassigned-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['verified-suppliers'] });
      setSelectedQuote(null);
      setSelectedSupplier('');
    },
    onError: (error) => {
      toast.error('Failed to assign supplier');
      console.error('Assignment error:', error);
    },
  });

  const handleQuickAssign = (quote: UnassignedQuote) => {
    const recommendedSuppliers = getRecommendedSuppliers(quote);
    if (recommendedSuppliers.length > 0) {
      const topSupplier = recommendedSuppliers[0];
      assignSupplierMutation.mutate({
        quoteId: quote.id,
        supplierId: topSupplier.id,
      });
    } else {
      toast.error('No suitable suppliers found');
    }
  };

  const handleManualAssign = () => {
    if (!selectedQuote || !selectedSupplier) {
      toast.error('Please select a supplier');
      return;
    }

    assignSupplierMutation.mutate({
      quoteId: selectedQuote.id,
      supplierId: selectedSupplier,
    });
  };

  const filteredQuotes = unassignedQuotes.filter(quote =>
    quote.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.buyer_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.product_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const urgencyColors = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary',
  } as const;

  const urgencyIcons = {
    high: <AlertCircle className="h-3 w-3" />,
    medium: <Clock className="h-3 w-3" />,
    low: <CheckCircle className="h-3 w-3" />,
  };

  if (quotesLoading || suppliersLoading) {
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
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-600" />
                Unassigned Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{unassignedQuotes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                High Urgency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {unassignedQuotes.filter(q => q.urgency === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Needs immediate action</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Available Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {suppliers.filter(s => (s.current_workload / s.capacity) < 0.8).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to take orders</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Avg Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {unassignedQuotes.length > 0 && suppliers.length > 0
                  ? Math.round(
                      unassignedQuotes.reduce((sum, quote) => {
                        const recommended = getRecommendedSuppliers(quote);
                        return sum + (recommended[0]?.match_score || 0);
                      }, 0) / unassignedQuotes.length
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">AI matching quality</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-primary" />
                Supplier Matching System
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered supplier matching for unassigned quotes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={urgencyFilter} onValueChange={(v: any) => setUrgencyFilter(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by buyer name, company, or product type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Quotes Table */}
          {filteredQuotes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Target Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Top Match</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote, index) => {
                    const recommendedSuppliers = getRecommendedSuppliers(quote);
                    const topMatch = recommendedSuppliers[0];
                    const daysOld = Math.floor(
                      (Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <Badge variant={urgencyColors[quote.urgency]} className="flex items-center gap-1 w-fit">
                            {urgencyIcons[quote.urgency]}
                            {quote.urgency.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.buyer_name}</div>
                            <div className="text-sm text-muted-foreground">{quote.buyer_company}</div>
                          </div>
                        </TableCell>
                        <TableCell>{quote.product_type}</TableCell>
                        <TableCell>{quote.quantity.toLocaleString()}</TableCell>
                        <TableCell>${quote.target_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {daysOld === 0 ? 'Today' : `${daysOld}d ago`}
                          </div>
                        </TableCell>
                        <TableCell>
                          {topMatch ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">{topMatch.match_score}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {topMatch.company_name}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No match</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                              variant="outline"
                            >
                              View Details
                            </Button>
                            {topMatch && (
                              <Button
                                size="sm"
                                onClick={() => handleQuickAssign(quote)}
                                disabled={assignSupplierMutation.isPending}
                                className="gap-1"
                              >
                                {assignSupplierMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Zap className="h-3 w-3" />
                                    Quick Assign
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Quotes Assigned!</h3>
              <p className="text-muted-foreground">
                {urgencyFilter !== 'all' 
                  ? `No ${urgencyFilter} urgency quotes awaiting assignment`
                  : 'No quotes awaiting supplier assignment'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Details & Supplier Selection Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quote Details & Supplier Matching
            </DialogTitle>
            <DialogDescription>
              Review quote details and select the best supplier
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
                    <p className="text-sm text-muted-foreground">Buyer</p>
                    <p className="font-medium">{selectedQuote.buyer_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedQuote.buyer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedQuote.buyer_company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product Type</p>
                    <p className="font-medium">{selectedQuote.product_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedQuote.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target Price</p>
                    <p className="font-medium">${selectedQuote.target_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency</p>
                    <Badge variant={urgencyColors[selectedQuote.urgency]}>
                      {selectedQuote.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Suppliers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Recommended Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getRecommendedSuppliers(selectedQuote).map((supplier, index) => (
                      <motion.div
                        key={supplier.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedSupplier === supplier.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedSupplier(supplier.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-semibold">{supplier.company_name}</div>
                              <div className="text-sm text-muted-foreground">{supplier.full_name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              <span className="text-2xl font-bold">{supplier.match_score}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Orders</p>
                            <p className="font-medium">{supplier.total_orders}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Capacity</p>
                            <p className="font-medium">
                              {Math.round((supplier.current_workload / supplier.capacity) * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">On-Time</p>
                            <p className="font-medium">{Math.round(supplier.on_time_delivery)}%</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {supplier.location}
                        </div>
                      </motion.div>
                    ))}

                    {getRecommendedSuppliers(selectedQuote).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No suppliers available for this quote
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedQuote(null);
                        setSelectedSupplier('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleManualAssign}
                      disabled={!selectedSupplier || assignSupplierMutation.isPending}
                      className="gap-2"
                    >
                      {assignSupplierMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          Assign Supplier
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
