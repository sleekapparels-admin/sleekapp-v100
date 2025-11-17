import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SupplierOrdersList } from "@/components/supplier/SupplierOrdersList";
import { SupplierPerformanceMetrics } from "@/components/supplier/SupplierPerformanceMetrics";
import { SupplierProfile } from "@/components/supplier/SupplierProfile";
import { FactoryCapacityManager } from "@/components/supplier/FactoryCapacityManager";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to access supplier dashboard");
        navigate("/auth?redirect=/supplier-dashboard");
        return;
      }

      // Check if user has supplier role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!roleData || (roleData.role as string) !== 'supplier') {
        // User is authenticated but not a supplier
        toast.error("Access denied. This dashboard is for suppliers only.");
        navigate("/");
        return;
      }

      // User has supplier role - fetch their profile
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching supplier:", error);
        throw error;
      }

      if (!data) {
        // Supplier role exists but profile incomplete
        toast.info("Please complete your supplier profile");
        navigate("/join-supplier");
        return;
      }

      setSupplier(data);
    } catch (error: any) {
      console.error("Error fetching supplier data:", error);
      toast.error("Failed to load supplier data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!supplier) {
    return null;
  }

  return (
    <>
      <Navbar />
      <RouteErrorBoundary
        fallbackTitle="Supplier Dashboard Error"
        fallbackDescription="Unable to load supplier dashboard. Please try refreshing."
      >
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{supplier.company_name}</h1>
                  <p className="text-muted-foreground">{supplier.factory_location}</p>
                </div>
                <Badge 
                  variant={supplier.verification_status === "verified" ? "default" : "secondary"}
                >
                  {supplier.verification_status === "verified" ? "✓ Verified" : "Pending Verification"}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="capacity">Factory Capacity</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <SupplierOrdersList supplierId={supplier.id} />
              </TabsContent>

              <TabsContent value="capacity">
                <FactoryCapacityManager supplierId={supplier.id} />
              </TabsContent>

              <TabsContent value="performance">
                <SupplierPerformanceMetrics supplierId={supplier.id} />
              </TabsContent>

              <TabsContent value="profile">
                <SupplierProfile supplier={supplier} onUpdate={fetchSupplierData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </RouteErrorBoundary>
      <Footer />
    </>
  );
}