import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SmartDashboardRouter() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const redirectToDashboard = async () => {
      // Prevent multiple simultaneous redirects
      if (isRedirecting) {
        console.log('Redirect already in progress, skipping...');
        return;
      }

      setIsRedirecting(true);

      // Set a timeout to prevent infinite loading (fallback after 10 seconds)
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('Dashboard router timeout - redirecting to buyer dashboard');
          toast.error("Taking longer than expected. Redirecting to dashboard...");
          navigate("/dashboard", { replace: true });
        }
      }, 10000);

      try {
        console.log('SmartDashboardRouter: Starting authentication check...');
        
        // Wait for session to be ready
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast.error("Session error. Please sign in again.");
          if (isMounted) navigate("/auth", { replace: true });
          return;
        }

        if (!session || !session.user) {
          console.log('No active session found, redirecting to auth...');
          toast.info("Please sign in to access your dashboard");
          if (isMounted) navigate("/auth", { replace: true });
          return;
        }

        const user = session.user;
        console.log('User authenticated:', user.id);

        // Small delay to ensure database trigger has created role
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get user role with retry logic
        let roleData = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !roleData) {
          console.log(`Fetching user role (attempt ${attempts + 1}/${maxAttempts})...`);
          
          const { data, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

          if (roleError) {
            console.error("Error fetching user role:", roleError);
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            roleData = data;
            break;
          }
        }

        const role = roleData?.role || 'buyer'; // Default to buyer if no role found
        console.log('User role determined:', role);

        // Clear timeout since we're about to redirect
        clearTimeout(timeoutId);

        // Route based on role with replace to prevent back button issues
        if (isMounted) {
          if (role === 'admin') {
            console.log('Redirecting to admin dashboard...');
            navigate("/admin", { replace: true });
          } else if (role === 'supplier') {
            console.log('Redirecting to supplier dashboard...');
            navigate("/supplier-dashboard", { replace: true });
          } else {
            console.log('Redirecting to buyer dashboard...');
            // Buyer roles: retailer, wholesaler, educational, corporate, sports_team, buyer
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error in smart router:", error);
        clearTimeout(timeoutId);
        toast.error("An error occurred. Redirecting to dashboard...");
        // Fallback to buyer dashboard
        if (isMounted) navigate("/dashboard", { replace: true });
      } finally {
        if (isMounted) setIsRedirecting(false);
      }
    };

    redirectToDashboard();

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]); // Remove isRedirecting from dependencies to prevent re-runs

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Redirecting to your dashboard...</p>
          <p className="text-sm text-muted-foreground">
            {isRedirecting ? "Please wait while we verify your account" : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
