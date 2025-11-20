import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).max(255),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password too long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  fullName: z.string().trim().min(1, { message: "Name is required" }).max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  companyName: z.string().max(100).optional().or(z.literal("")),
});

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("login");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { type: 'phone', phone: phoneNumber },
      });

      if (error) throw error;

      setPhoneOtpSent(true);
      setOtpExpiry(new Date(data.expiresAt));
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { type: 'phone', phone: phoneNumber, otp: phoneOtp },
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Phone verified successfully!");
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordBreach = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('password-breach-check', {
        body: { password }
      });
      
      if (error) {
        console.warn('Password breach check failed:', error);
        return false;
      }
      
      return data?.pwned || false;
    } catch (err) {
      console.warn('Password breach check error:', err);
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordErrors([]);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get("signup-email") as string,
      password: formData.get("signup-password") as string,
      fullName: formData.get("full-name") as string,
      companyName: formData.get("company-name") as string,
      phone: phoneNumber || "",
      role: formData.get("role") as string,
    };

    try {
      // Phone verification is optional but recommended
      if (phoneOtpSent && phoneOtp) {
        const verified = await verifyPhoneOtp();
        if (!verified) {
          setIsLoading(false);
          return;
        }
      }

      // Client-side validation
      const validationResult = signupSchema.safeParse(rawData);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message);
        setPasswordErrors(errors);
        toast.error("Please fix the validation errors");
        return;
      }

      const { email, password, fullName, companyName, phone } = validationResult.data;

      // Check for password breach
      const isBreached = await checkPasswordBreach(password);
      if (isBreached) {
        setPasswordErrors(["This password has been found in data breaches. Please choose a different password."]);
        toast.error("Password compromised. Please choose a stronger password.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            company_name: companyName,
            phone: phone || null,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created! Please check your email and click the verification link to activate your account.", {
        duration: 8000,
      });
      
      setActiveTab("login");
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        toast.error("Network error. Please check your connection or ensure this app's URL is added to allowed URLs in backend settings.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("login-email") as string;
    const password = formData.get("login-password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please verify your email address. Check your inbox for the verification link.", {
            duration: 6000,
            action: {
              label: "Resend Email",
              onClick: async () => {
                try {
                  const { error: resendError } = await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                  });
                  if (resendError) throw resendError;
                  toast.success("Verification email sent! Check your inbox.");
                } catch (err: any) {
                  toast.error(err.message || "Failed to resend email");
                }
              }
            }
          });
        } else {
          throw error;
        }
        return;
      }

      toast.success("Signed in successfully");
      navigate("/dashboard-router");
    } catch (error: any) {
      if (error.message === "Failed to fetch" || error.message?.includes('fetch')) {
        toast.error(
          "Network error: Unable to reach authentication service. Check your connection and ensure this app's URL is in the allowed URLs list. Visit /admin-setup to run diagnostics.",
          { duration: 7000 }
        );
      } else {
        toast.error(error.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="text-center">
            <CardTitle className="text-2xl">Sleek Apparels</CardTitle>
            <CardDescription className="text-base">
              Manufacturer & Sourcing Partner
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 h-11 border-2 hover:bg-accent"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="login-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="login-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    name="company-name"
                    type="text"
                    placeholder="Your Company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={phoneOtpSent}
                      className="h-11"
                    />
                    {!phoneOtpSent && phoneNumber && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendPhoneOtp}
                        disabled={isLoading}
                        className="whitespace-nowrap"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                      </Button>
                    )}
                  </div>
                  {phoneOtpSent && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="phone-otp" className="text-sm text-muted-foreground">
                        Enter 6-digit code sent to your phone
                      </Label>
                      <InputOTP
                        maxLength={6}
                        value={phoneOtp}
                        onChange={setPhoneOtp}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {otpExpiry && (
                        <p className="text-xs text-muted-foreground">
                          Code expires in {Math.max(0, Math.floor((otpExpiry.getTime() - Date.now()) / 60000))} minutes
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPhoneOtpSent(false);
                          setPhoneOtp("");
                        }}
                        className="text-xs"
                      >
                        Change phone number
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Verify your phone for faster communication
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Must be at least 8 characters with uppercase, lowercase, and number</p>
                    {passwordErrors.length > 0 && (
                      <div className="text-destructive space-y-1">
                        {passwordErrors.map((error, index) => (
                          <p key={index}>{error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
