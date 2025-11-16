import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle2, AlertCircle, Wifi, Database, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [connectivityResults, setConnectivityResults] = useState<any>(null);
  const [testingConnectivity, setTestingConnectivity] = useState(false);
  const [bootstrapEmail, setBootstrapEmail] = useState("");
  const [bootstrapToken, setBootstrapToken] = useState("");
  const [bootstrapLoading, setBootstrapLoading] = useState(false);

  const testConnectivity = async () => {
    setTestingConnectivity(true);
    setConnectivityResults(null);

    const results: any = {
      auth: { status: 'testing', message: '', url: '' },
      functions: { status: 'testing', message: '', url: '' },
      timestamp: new Date().toISOString()
    };

    try {
      // Test Auth connectivity
      const authUrl = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/health`;
      results.auth.url = authUrl;
      
      try {
        const authResponse = await fetch(authUrl);
        if (authResponse.ok) {
          results.auth.status = 'success';
          results.auth.message = `✓ Auth service reachable (${authResponse.status})`;
        } else {
          results.auth.status = 'error';
          results.auth.message = `✗ Auth returned status ${authResponse.status}`;
        }
      } catch (authError: any) {
        results.auth.status = 'error';
        results.auth.message = `✗ ${authError.message || 'Network error'}`;
      }

      // Test Functions connectivity
      try {
        const { data, error } = await supabase.functions.invoke('health');
        results.functions.url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health`;
        
        if (error) {
          results.functions.status = 'error';
          results.functions.message = `✗ ${error.message}`;
        } else if (data?.ok) {
          results.functions.status = 'success';
          results.functions.message = `✓ Functions reachable (response: ${JSON.stringify(data)})`;
        } else {
          results.functions.status = 'warning';
          results.functions.message = `⚠ Unexpected response: ${JSON.stringify(data)}`;
        }
      } catch (funcError: any) {
        results.functions.status = 'error';
        results.functions.message = `✗ ${funcError.message || 'Network error'}`;
      }

      setConnectivityResults(results);

      if (results.auth.status === 'success' && results.functions.status === 'success') {
        toast.success("All services reachable!");
      } else {
        toast.error("Some connectivity issues detected");
      }
    } catch (error: any) {
      console.error('Connectivity test error:', error);
      toast.error("Failed to run connectivity test");
    } finally {
      setTestingConnectivity(false);
    }
  };

  const handleBootstrap = async () => {
    if (!bootstrapEmail || !bootstrapToken) {
      toast.error("Please enter both email and bootstrap token");
      return;
    }

    setBootstrapLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bootstrap-admin', {
        body: { email: bootstrapEmail, token: bootstrapToken }
      });

      if (error) throw error;

      toast.success(data.message || "Admin role granted successfully!");
      setBootstrapEmail("");
      setBootstrapToken("");
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      toast.error(error.message || "Failed to grant admin role");
    } finally {
      setBootstrapLoading(false);
    }
  };

  const seedTestUsers = async () => {
    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('seed-test-users');

      if (error) throw error;

      setResults(data);
      toast.success("Test users created successfully!");
    } catch (error: any) {
      console.error('Error seeding users:', error);
      toast.error(error.message || "Failed to seed test users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Admin Setup</h1>
            <p className="text-muted-foreground">
              Initialize test data, verify connectivity, and grant admin access
            </p>
          </div>

          {/* Connectivity Check */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Connectivity Diagnostics
              </CardTitle>
              <CardDescription>
                Verify that your browser can reach backend services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Current App URL:</strong> {window.location.origin}</p>
                <p className="text-muted-foreground">
                  Make sure this URL is listed in your backend's allowed URLs under Auth settings.
                </p>
              </div>

              <Button 
                onClick={testConnectivity} 
                disabled={testingConnectivity}
                className="w-full"
              >
                {testingConnectivity ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connectivity...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Run Connectivity Test
                  </>
                )}
              </Button>

              {connectivityResults && (
                <div className="space-y-3 mt-4">
                  <div className={`rounded-lg p-3 ${
                    connectivityResults.auth.status === 'success' 
                      ? 'bg-green-50 dark:bg-green-950' 
                      : 'bg-red-50 dark:bg-red-950'
                  }`}>
                    <div className="flex items-start gap-2">
                      {connectivityResults.auth.status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Auth Service</div>
                        <div className="text-sm mt-1">{connectivityResults.auth.message}</div>
                        <div className="text-xs text-muted-foreground mt-1 break-all">
                          {connectivityResults.auth.url}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${
                    connectivityResults.functions.status === 'success' 
                      ? 'bg-green-50 dark:bg-green-950' 
                      : 'bg-red-50 dark:bg-red-950'
                  }`}>
                    <div className="flex items-start gap-2">
                      {connectivityResults.functions.status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Backend Functions</div>
                        <div className="text-sm mt-1">{connectivityResults.functions.message}</div>
                        <div className="text-xs text-muted-foreground mt-1 break-all">
                          {connectivityResults.functions.url}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Bootstrap */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Grant Admin Access
              </CardTitle>
              <CardDescription>
                Use the bootstrap token to grant admin role to an existing account (works only once when no admin exists)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-semibold">⚠️ Security Note</p>
                <ul className="text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>The bootstrap token is NOT a password - it's a one-time setup token</li>
                  <li>This only works if NO admin exists yet</li>
                  <li>The email must belong to an existing registered account</li>
                  <li>Once an admin exists, this function is disabled for security</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="bootstrap-email">Account Email</Label>
                  <Input
                    id="bootstrap-email"
                    type="email"
                    placeholder="user@example.com"
                    value={bootstrapEmail}
                    onChange={(e) => setBootstrapEmail(e.target.value)}
                    disabled={bootstrapLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="bootstrap-token">Admin Bootstrap Token</Label>
                  <Input
                    id="bootstrap-token"
                    type="password"
                    placeholder="Your bootstrap token"
                    value={bootstrapToken}
                    onChange={(e) => setBootstrapToken(e.target.value)}
                    disabled={bootstrapLoading}
                  />
                </div>
              </div>

              <Button 
                onClick={handleBootstrap} 
                disabled={bootstrapLoading}
                className="w-full"
              >
                {bootstrapLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting Admin Role...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Grant Admin Role
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Seed Test Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Seed Test User Accounts
              </CardTitle>
              <CardDescription>
                Create admin, buyer, and supplier test accounts with proper role assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-sm">This will create:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 1 Admin account (admin@sleekapparels.com)</li>
                  <li>• 3 Buyer accounts (fashion brand, wholesaler, school)</li>
                  <li>• 2 Verified supplier accounts (knitwear, cut & sew)</li>
                </ul>
              </div>

              <Button 
                onClick={seedTestUsers} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Test Users...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Create Test User Accounts
                  </>
                )}
              </Button>

              {results && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">{results.message}</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3">Test Account Credentials:</h4>
                    <div className="space-y-3">
                      {results.credentials?.map((cred: any, index: number) => (
                        <div key={index} className="bg-background rounded p-3 space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{cred.role.toUpperCase()}</span>
                            {results.results[index]?.status === 'already_exists' && (
                              <span className="text-xs text-muted-foreground">(existing)</span>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            <div>Email: <code className="bg-muted px-2 py-0.5 rounded">{cred.email}</code></div>
                            <div>Password: <code className="bg-muted px-2 py-0.5 rounded">{cred.password}</code></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {results.results?.some((r: any) => r.status === 'error') && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm text-destructive mb-2">Some errors occurred:</h4>
                          {results.results
                            .filter((r: any) => r.status === 'error')
                            .map((r: any, idx: number) => (
                              <div key={idx} className="text-sm text-destructive/90">
                                {r.email}: {r.error}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                After seeding test users, continue with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Seed product portfolio (25 sample products)</li>
                <li>Create sample orders at different lifecycle stages</li>
                <li>Add order updates, messages, and documents</li>
                <li>Generate sample invoices and payment records</li>
                <li>Populate QC checks and defect reports</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
