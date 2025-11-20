import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SmartDashboardRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast.error("Please sign in to access your dashboard");
          navigate("/auth");
          return;
        }

        // Get user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          // Default to buyer dashboard if role fetch fails
          navigate("/dashboard");
          return;
        }

        const role = roleData?.role;

        // Route based on role
        if (role === 'admin') {
          navigate("/admin");
        } else if (role === 'supplier') {
          navigate("/supplier-dashboard");
        } else {
          // Buyer roles: retailer, wholesaler, educational, corporate, sports_team
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error in smart router:", error);
        // Fallback to buyer dashboard
        navigate("/dashboard");
      }
    };

    redirectToDashboard();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
