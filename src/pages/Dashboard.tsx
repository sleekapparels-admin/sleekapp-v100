import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { profileHelpers, roleHelpers } from "@/lib/supabaseHelpers";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { OrderIcon, FactoryIcon, TeamIcon } from "@/components/CustomIcons";
import { ProductManagement } from "@/components/ProductManagement";
import { OrdersList } from "@/components/OrdersList";
import { BuyerOrdersOverview } from "@/components/BuyerOrdersOverview";
import { ActiveOrdersMap } from "@/components/ActiveOrdersMap";
import { NotificationBell } from "@/components/NotificationBell";
import { CreateOrderDialog } from "@/components/CreateOrderDialog";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";
import { DashboardStats } from "@/components/DashboardStats";
import { User as UserIcon } from "lucide-react";
import factoryFloorImg from "@/assets/factory-floor.webp";
import qualityControlImg from "@/assets/quality-control.webp";
import warehouseImg from "@/assets/textile-warehouse.webp";
import type { Profile } from "@/types/database";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchUserData(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      if (event === 'SIGNED_IN') {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await profileHelpers.getByUserId(userId);

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch role
      const { data: roleData, error: roleError } = await roleHelpers.getUserRole(userId);

      if (roleError) throw roleError;
      setRole(roleData?.role || null);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // UI helpers
  const getRoleIcon = () => {
    switch (role) {
      case 'retailer':
      case 'wholesaler':
        return <OrderIcon className="h-6 w-6" />;
      case 'educational':
      case 'corporate':
      case 'sports_team':
        return <TeamIcon className="h-6 w-6" />;
      case 'factory':
        return <FactoryIcon className="h-6 w-6" />;
      case 'admin':
        return <TeamIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'retailer':
      case 'wholesaler':
        return 'text-blue-500';
      case 'educational':
      case 'corporate':
      case 'sports_team':
        return 'text-indigo-500';
      case 'factory':
        return 'text-green-500';
      case 'admin':
        return 'text-purple-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const dashboardBg = (role === 'retailer' || role === 'wholesaler' || role === 'educational' || role === 'corporate' || role === 'sports_team')
    ? qualityControlImg
    : role === 'factory'
      ? factoryFloorImg
      : warehouseImg;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img src={dashboardBg} alt="Dashboard background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold text-foreground">Sleek Apparels Dashboard</h1>
            <p className="text-muted-foreground mt-1 capitalize">{role} Portal</p>
          </div>
        </div>
          <div className="absolute top-4 right-6 flex items-center gap-2">
          <NotificationBell />
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Key Metrics */}
        <DashboardStats role={role || ''} />

        {/* Customer-specific overview */}
        {(role === 'retailer' || role === 'wholesaler' || role === 'educational' || role === 'corporate' || role === 'sports_team') && (
          <div className="mb-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ActiveOrdersMap />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon()}
                <span className="capitalize">{role} Account</span>
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              {profile?.company_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{profile.company_name}</p>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className={`font-medium capitalize ${getRoleColor()}`}>{role}</p>
              </div>
              <div className="pt-4">
                <ChangePasswordDialog />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                {(role === 'retailer' || role === 'wholesaler' || role === 'educational' || role === 'corporate' || role === 'sports_team') ? 'Your orders' : role === 'factory' ? 'Assigned orders' : 'All orders'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && <OrdersList role={role || ''} userId={user.id} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(role === 'retailer' || role === 'wholesaler' || role === 'educational' || role === 'corporate' || role === 'sports_team') && user && (
                <CreateOrderDialog userId={user.id} />
              )}
              {role === 'factory' && (
                <Button className="w-full" variant="outline" onClick={() => navigate("/orders")}>
                  View Assigned Orders
                </Button>
              )}
              {role === 'admin' && (
                <>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/orders")}>
                    View All Orders
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard")}>
                    Manage Products
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/dashboard")}>
                    View Reports
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Product Management */}
        {role === 'admin' && (
          <div className="mt-8">
            <ProductManagement />
          </div>
        )}
      </div>
    </div>
  );
}
