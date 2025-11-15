import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { roleHelpers } from "@/lib/supabaseHelpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Users, MousePointerClick, TrendingUp, Globe, ShoppingCart, FileText, Shield, Building2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { AIQuote } from "@/types/database";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roleData } = await roleHelpers.getUserRole(session.user.id);

      if (roleData?.role !== 'admin') {
        toast.error("Access denied. Admin only.");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchAnalytics();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch various analytics data using type assertions
      const [eventsResult, interactionsResult, negotiationsResult, quotesResult] = await Promise.all([
        supabase.from('user_analytics' as any).select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('product_interactions' as any).select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('quote_negotiations' as any).select('*, ai_quotes(*)').order('created_at', { ascending: false }),
        supabase.from('ai_quotes').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      // Process data
      const events: any[] = eventsResult.data || [];
      const interactions: any[] = interactionsResult.data || [];
      const negotiations: any[] = negotiationsResult.data || [];
      const quotes = (quotesResult.data || []) as AIQuote[];

      // Calculate metrics
      const uniqueVisitors = new Set(events.map((e: any) => e.session_id)).size;
      const pageViews = events.filter((e: any) => e.event_type === 'page_view').length;
      const bounceRate = events.filter((e: any) => e.event_type === 'bounce').length / (pageViews || 1) * 100;
      const quoteAttempts = events.filter((e: any) => e.event_type === 'quote_attempt').length;
      const successfulQuotes = events.filter((e: any) => e.event_type === 'quote_attempt' && e.event_data?.success).length;
      
      // Country breakdown
      const countryMap = events.reduce((acc: any, e: any) => {
        if (e.country_code) {
          acc[e.country_code] = (acc[e.country_code] || 0) + 1;
        }
        return acc;
      }, {});

      // Product interest
      const categoryInterest = interactions.reduce((acc: any, i: any) => {
        if (i.product_category) {
          acc[i.product_category] = (acc[i.product_category] || 0) + 1;
        }
        return acc;
      }, {});

      setAnalytics({
        uniqueVisitors,
        pageViews,
        bounceRate: bounceRate.toFixed(1),
        quoteAttempts: quoteAttempts || 0,
        successfulQuotes: successfulQuotes || 0,
        conversionRate: quoteAttempts > 0 ? ((successfulQuotes / quoteAttempts) * 100).toFixed(1) : '0',
        countries: countryMap,
        categoryInterest,
        recentEvents: events.slice(0, 20),
        recentInteractions: interactions.slice(0, 20),
        negotiations,
        quotes,
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error("Failed to fetch analytics data");
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into user behavior and lead generation</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => navigate("/admin/leads")}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                View Leads
              </button>
              <button
                onClick={() => navigate("/admin/blog")}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Manage Blog
              </button>
              <button
                onClick={() => navigate("/admin/audit-logs")}
                className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Audit Logs
              </button>
              <button
                onClick={() => navigate("/admin/suppliers")}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Supplier Verification
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.pageViews || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.bounceRate || 0}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quote Conversion</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.conversionRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.successfulQuotes || 0} / {analytics?.quoteAttempts || 0} attempts
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="products">Product Interest</TabsTrigger>
              <TabsTrigger value="negotiations">Quote Negotiations</TabsTrigger>
              <TabsTrigger value="events">Recent Events</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Behavior Overview</CardTitle>
                  <CardDescription>Understanding how users interact with your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Top Issues Affecting Conversion:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Bounce rate of {analytics?.bounceRate}% suggests users may be leaving too quickly</li>
                        <li>Quote conversion at {analytics?.conversionRate}% - {parseFloat(analytics?.conversionRate) < 50 ? 'needs improvement' : 'performing well'}</li>
                        <li>{analytics?.uniqueVisitors} unique visitors tracked</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics?.countries || {}).map(([country, count]: any) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{country}</span>
                        </div>
                        <span className="font-semibold">{count} visits</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Category Interest</CardTitle>
                  <CardDescription>Which products are getting the most attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics?.categoryInterest || {}).map(([category, count]: any) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize">{category}</span>
                        <span className="font-semibold">{count} interactions</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="negotiations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Quote Negotiations</CardTitle>
                  <CardDescription>Leads showing interest in quotes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.negotiations?.map((neg: any) => (
                      <div key={neg.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{neg.customer_email}</p>
                            <p className="text-sm text-muted-foreground">Status: {neg.status}</p>
                            {neg.customer_message && (
                              <p className="text-sm mt-1">{neg.customer_message}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(neg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Events</CardTitle>
                  <CardDescription>Live feed of user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analytics?.recentEvents?.map((event: any) => (
                      <div key={event.id} className="text-sm border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">{event.event_type}</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{event.page_url}</p>
                        {event.country_code && (
                          <span className="text-xs text-muted-foreground">From: {event.country_code}</span>
                        )}
                      </div>
                    ))}
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
