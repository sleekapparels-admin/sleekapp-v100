import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SupplierVerificationCard } from "@/components/admin/SupplierVerificationCard";
import { Database } from "@/integrations/supabase/types";

// TEMPORARY: Using 'any' due to backend types sync issue
type Supplier = any;

export default function SupplierVerification() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingSuppliers, setPendingSuppliers] = useState<Supplier[]>([]);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role !== 'admin') {
        toast.error("Access denied. Admin only.");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchSuppliers();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllSuppliers(data || []);
      setPendingSuppliers(data?.filter(s => s.verification_status === 'pending') || []);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      toast.error("Failed to fetch suppliers");
    }
  };

  const handleStatusUpdate = async (supplierId: string, status: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ verification_status: status as any })
        .eq('id', supplierId);

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke('email-service', {
        body: { 
          type: 'supplier-status',
          data: { supplierId, status, reason }
        }
      });

      toast.success(`Supplier ${status === 'verified' ? 'approved' : status} successfully`);
      await fetchSuppliers();
    } catch (error: any) {
      console.error('Error updating supplier:', error);
      toast.error("Failed to update supplier status");
    }
  };

  const filteredSuppliers = filterStatus === 'all' 
    ? allSuppliers 
    : allSuppliers.filter(s => s.verification_status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Supplier Verification</h1>
            <p className="text-muted-foreground">
              Review and approve supplier registrations
            </p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingSuppliers.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Suppliers ({allSuppliers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingSuppliers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No pending supplier applications</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingSuppliers.map((supplier) => (
                    <SupplierVerificationCard
                      key={supplier.id}
                      supplier={supplier}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="flex gap-2 mb-4">
                {['all', 'verified', 'pending', 'rejected', 'suspended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredSuppliers.map((supplier) => (
                  <SupplierVerificationCard
                    key={supplier.id}
                    supplier={supplier}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
