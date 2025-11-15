import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

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
              Initialize test data for development and demonstration
            </p>
          </div>

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
