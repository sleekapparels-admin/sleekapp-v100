import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Shield } from "lucide-react";

export default function AdminBootstrap() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('bootstrap-admin', {
        body: { email, token }
      });

      if (error) throw error;

      if (data?.error) {
        setResult({ success: false, message: data.error });
      } else {
        setResult({ 
          success: true, 
          message: "Admin role assigned successfully! You can now log in with admin privileges." 
        });
      }
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      setResult({ 
        success: false, 
        message: error.message || "Failed to assign admin role. Please check your token and try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Admin Bootstrap</CardTitle>
          </div>
          <CardDescription>
            One-time setup to assign the first admin role. This page will be removed after use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || result?.success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Bootstrap Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your bootstrap token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={loading || result?.success}
              />
              <p className="text-xs text-muted-foreground">
                This is the ADMIN_BOOTSTRAP_TOKEN secret value you configured.
              </p>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 mt-0.5" />
                  )}
                  <AlertDescription>{result.message}</AlertDescription>
                </div>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || result?.success}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {result?.success ? "Admin Role Assigned ✓" : "Assign Admin Role"}
            </Button>

            {result?.success && (
              <p className="text-sm text-center text-muted-foreground">
                You can now close this page and log in at <a href="/auth" className="text-primary hover:underline">/auth</a>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
