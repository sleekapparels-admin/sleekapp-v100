import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function SmartDashboardRouter() {
  const navigate = useNavigate();
  const { user, role, userType, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If no user, redirect to auth
    if (!user) {
      console.log('No active session found, redirecting to auth...');
      navigate("/auth", { replace: true });
      return;
    }

    // Route based on user type/role
    console.log('User role determined:', role, 'User type:', userType);

    if (userType === 'admin' || role === 'admin') {
      console.log('Redirecting to admin dashboard...');
      navigate("/admin", { replace: true });
    } else if (userType === 'supplier' || role === 'supplier' || role === 'factory') {
      console.log('Redirecting to supplier dashboard...');
      navigate("/supplier-dashboard", { replace: true });
    } else {
      console.log('Redirecting to buyer dashboard...');
      // Buyer roles: retailer, wholesaler, educational, corporate, sports_team
      navigate("/dashboard", { replace: true });
    }
  }, [user, role, userType, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Redirecting to your dashboard...</p>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
