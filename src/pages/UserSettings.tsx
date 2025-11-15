import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Bell, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

export default function UserSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_messages: true,
    email_production: true,
    email_payments: true,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch notification preferences
      const { data: notifData } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (notifData) {
        setNotifications({
          email_orders: notifData.email_orders,
          email_messages: notifData.email_messages,
          email_production: notifData.email_production,
          email_payments: notifData.email_payments,
        });
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          company_name: profile.company_name,
          phone: profile.phone,
          address: profile.address,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...notifications,
        });

      if (error) throw error;

      toast.success("Notification preferences updated");
    } catch (error: any) {
      console.error('Error updating notifications:', error);
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal and company information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile?.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={profile?.company_name || ''}
                      onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile?.address || ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>

                  <Button
                    onClick={handleProfileUpdate}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about order status changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_orders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email_orders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_messages}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email_messages: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Production Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Stay informed about production progress
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_production}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email_production: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts about payments and invoices
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_payments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email_payments: checked })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleNotificationUpdate}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Keep your account secure by using a strong password
                    </p>
                    <ChangePasswordDialog />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
