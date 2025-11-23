/**
 * Leads Management - Admin Interface
 * View and qualify leads captured from homepage form
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, TrendingUp, Mail, Phone, Building, Globe, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface LeadCapture {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  user_type: 'buyer' | 'supplier' | 'both' | 'not_sure';
  interest_level: 'high' | 'medium' | 'low' | null;
  monthly_volume_range: string | null;
  geographical_region: string | null;
  source: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified';
  admin_notes: string | null;
  follow_up_date: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<LeadCapture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadCapture | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUserType, setFilterUserType] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, [filterStatus, filterUserType]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('lead_captures' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterUserType !== 'all') {
        query = query.eq('user_type', filterUserType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLeads((data as any) || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lead_captures' as any)
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Lead status updated');
      fetchLeads();
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const updateLeadNotes = async (leadId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('lead_captures' as any)
        .update({ admin_notes: notes })
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Notes saved');
      fetchLeads();
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      new: { variant: 'default', label: 'New' },
      contacted: { variant: 'secondary', label: 'Contacted' },
      qualified: { variant: 'default', label: 'Qualified' },
      converted: { variant: 'default', label: 'Converted' },
      disqualified: { variant: 'destructive', label: 'Disqualified' },
    };

    const { variant, label } = variants[status] || { variant: 'default', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getUserTypeBadge = (userType: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      buyer: { color: 'bg-blue-500', label: 'Buyer' },
      supplier: { color: 'bg-green-500', label: 'Supplier' },
      both: { color: 'bg-purple-500', label: 'Both' },
      not_sure: { color: 'bg-gray-500', label: 'Exploring' },
    };

    const { color, label } = variants[userType] || { color: 'bg-gray-500', label: userType };
    return <Badge className={color}>{label}</Badge>;
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    buyers: leads.filter(l => l.user_type === 'buyer').length,
    suppliers: leads.filter(l => l.user_type === 'supplier').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <p className="text-muted-foreground">View and qualify leads from beta signup forms</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.buyers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.suppliers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="disqualified">Disqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>User Type</Label>
            <Select value={filterUserType} onValueChange={setFilterUserType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="not_sure">Exploring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button onClick={fetchLeads}>Refresh</Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({leads.length})</CardTitle>
          <CardDescription>Click on a row to view details and take action</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{lead.email}</TableCell>
                  <TableCell>{lead.full_name || '-'}</TableCell>
                  <TableCell>{getUserTypeBadge(lead.user_type)}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{lead.company_name || '-'}</TableCell>
                  <TableCell>{lead.geographical_region || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Lead Details</DialogTitle>
                          <DialogDescription>
                            Review and qualify this lead
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedLead && selectedLead.id === lead.id && (
                          <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="grid gap-4">
                              <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <div className="text-sm font-medium">Email</div>
                                  <div className="text-sm">{selectedLead.email}</div>
                                </div>
                              </div>
                              
                              {selectedLead.phone && (
                                <div className="flex items-start gap-3">
                                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium">Phone</div>
                                    <div className="text-sm">{selectedLead.phone}</div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedLead.company_name && (
                                <div className="flex items-start gap-3">
                                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium">Company</div>
                                    <div className="text-sm">{selectedLead.company_name}</div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedLead.geographical_region && (
                                <div className="flex items-start gap-3">
                                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium">Region</div>
                                    <div className="text-sm">{selectedLead.geographical_region}</div>
                                  </div>
                                </div>
                              )}

                              {selectedLead.message && (
                                <div className="flex items-start gap-3">
                                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium">Message</div>
                                    <div className="text-sm">{selectedLead.message}</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="space-y-2">
                              <Label>Update Status</Label>
                              <Select 
                                value={selectedLead.status} 
                                onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="qualified">Qualified</SelectItem>
                                  <SelectItem value="converted">Converted</SelectItem>
                                  <SelectItem value="disqualified">Disqualified</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Admin Notes */}
                            <div className="space-y-2">
                              <Label>Admin Notes</Label>
                              <Textarea 
                                placeholder="Add notes about this lead..."
                                defaultValue={selectedLead.admin_notes || ''}
                                onBlur={(e) => updateLeadNotes(selectedLead.id, e.target.value)}
                                rows={4}
                              />
                            </div>

                            {/* UTM Data */}
                            {(selectedLead.utm_source || selectedLead.utm_medium || selectedLead.utm_campaign) && (
                              <div className="space-y-2">
                                <Label>UTM Parameters</Label>
                                <div className="text-sm space-y-1">
                                  {selectedLead.utm_source && <div>Source: {selectedLead.utm_source}</div>}
                                  {selectedLead.utm_medium && <div>Medium: {selectedLead.utm_medium}</div>}
                                  {selectedLead.utm_campaign && <div>Campaign: {selectedLead.utm_campaign}</div>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {leads.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No leads found. Adjust filters or wait for new signups.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
