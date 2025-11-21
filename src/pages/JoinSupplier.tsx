import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function JoinSupplier() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  
  // Form state - email is now part of formData
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    factoryLocation: "",
    address: "",
    about: "",
    workforceSize: "",
    moqMinimum: "",
    moqMaximum: "",
    leadTimeDays: "",
    totalCapacityMonthly: "",
    yearEstablished: "",
    businessRegistrationNumber: "",
    websiteUrl: "",
    specializations: [] as string[],
    password: "",
    confirmPassword: ""
  });

  const specializationOptions = [
    "T-Shirts", "Polo Shirts", "Hoodies", "Sweatshirts",
    "Activewear", "Sportswear", "Uniforms", "Workwear",
    "Jerseys", "Jackets", "Pants", "Shorts"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Send OTP after form validation with timeout
    setIsLoading(true);
    
    try {
      // Add timeout to prevent indefinite waiting
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please check your connection and try again.')), 30000)
      );
      
      const otpPromise = supabase.functions.invoke('send-otp', {
        body: { type: 'email-supplier', email: formData.email }
      });

      const { data, error } = await Promise.race([otpPromise, timeoutPromise]) as any;

      if (error) throw error;

      if (data?.error) {
        // Handle specific error cases
        if (data.error.includes('wait 5 minutes')) {
          toast.error("Please wait 5 minutes before requesting another code");
        } else if (data.error.includes('already exists')) {
          toast.error("A supplier with this email already exists. Please sign in instead.");
        } else if (data.error.includes('Disposable email')) {
          toast.error("Please use a permanent business email address");
        } else {
          toast.error(data.error);
        }
        return;
      }

      toast.success(`Verification code sent to ${formData.email}!`);
      setStep('verify');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      if (error.message?.includes('timed out')) {
        toast.error("Request timed out. The system may be under load. Please try again.");
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(error.message || "Failed to send verification code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndComplete = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Verify OTP
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: { type: 'email-supplier', email: formData.email, otp }
      });

      if (verifyError) throw verifyError;

      if (!verifyData?.verified) {
        toast.error(verifyData?.error || "Invalid verification code");
        setIsLoading(false);
        return;
      }

      toast.success("Email verified! Creating your account...");

      // Step 2: Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'supplier',
            full_name: formData.contactPerson,
            company_name: formData.companyName,
          },
          emailRedirectTo: `${window.location.origin}/supplier-dashboard`
        }
      });

      if (authError) {
        // Handle rate limiting specifically
        if (authError.message.includes('429') || authError.message.includes('rate limit')) {
          toast.error('Too many signup attempts. Please wait 1-2 minutes and try again.');
          setIsLoading(false);
          return;
        }
        
        // Handle user already exists
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          toast.error('This email is already registered. Please sign in instead.');
          setIsLoading(false);
          return;
        }
        
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Step 3: Generate one-time confirmation token and auto-confirm
      const confirmationToken = crypto.randomUUID();
      
      const { error: tokenError } = await supabase
        .from('email_verification_otps')
        .insert({ 
          email: formData.email,
          otp: 'CONFIRMATION_TOKEN',
          session_id: confirmationToken,
          user_id: authData.user.id,
          verified: false,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          ip_address: null
        });

      if (tokenError) {
        console.error('Token generation failed:', tokenError);
        throw new Error('Registration succeeded but confirmation token generation failed.');
      }

      const { error: confirmError } = await supabase.functions.invoke('auto-confirm-supplier', {
        body: {
          email: formData.email,
          token: confirmationToken
        }
      });

      if (confirmError) {
        console.error('Email confirmation failed:', confirmError);
        
        if (confirmError.message?.includes('Invalid or expired')) {
          toast.error('Email confirmation token expired. Please contact support.');
        } else if (confirmError.message?.includes('Rate limit')) {
          toast.error('Too many confirmation attempts. Please wait and try again.');
        } else if (confirmError.message?.includes('User not found')) {
          toast.error('Account created but confirmation failed. Please contact support with your email.');
        } else {
          toast.error('Registration succeeded but email confirmation failed. Please contact support.');
        }
        
        setIsLoading(false);
        return;
      }

      // Step 4: Ensure session is established
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Session not established after signup");
      }

      // Step 5: Create supplier profile
      const { error: supplierError } = await supabase
        .from('suppliers')
        .insert({
          user_id: authData.user.id,
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          contact_email: formData.email,
          contact_phone: formData.contactPhone,
          factory_location: formData.factoryLocation,
          address: formData.address,
          about: formData.about,
          workforce_size: formData.workforceSize ? parseInt(formData.workforceSize) : null,
          moq_minimum: parseInt(formData.moqMinimum) || 50,
          moq_maximum: formData.moqMaximum ? parseInt(formData.moqMaximum) : null,
          lead_time_days: parseInt(formData.leadTimeDays) || 45,
          total_capacity_monthly: formData.totalCapacityMonthly ? parseInt(formData.totalCapacityMonthly) : null,
          year_established: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
          business_registration_number: formData.businessRegistrationNumber || null,
          website_url: formData.websiteUrl || null,
          specializations: formData.specializations,
          verification_status: 'pending',
          managed_by_sleek: true
        });

      if (supplierError) throw supplierError;

      toast.success("Registration successful! Awaiting admin approval.");
      navigate("/supplier-dashboard");
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        toast.error('This email or company is already registered. Please sign in or use a different email.');
      } else if (error.message?.includes('Token generation failed')) {
        toast.error('Registration successful but confirmation setup failed. Please contact support.');
      } else if (error.message?.includes('Session not established')) {
        toast.error('Registration completed but session setup failed. Please try signing in.');
      } else if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        toast.error('Too many attempts. Please wait a few minutes and try again.');
      } else {
        toast.error(error.message || "Failed to complete registration. Please try again or contact support.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { type: 'email-supplier', email: formData.email }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Verification code resent!");
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      toast.error(error.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Step 1: OTP Verification */}
          {step === 'verify' && (
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">Verify Your Email</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to <strong>{formData.email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Label>Enter Verification Code</Label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
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
                </div>

                <Button 
                  onClick={handleVerifyAndComplete} 
                  disabled={isLoading || otp.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify & Complete Registration
                    </>
                  )}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => setStep('details')}
                    className="text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to form
                  </button>
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary hover:underline"
                  >
                    Resend code
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Supplier Details Form */}
          {step === 'details' && (
            <form onSubmit={handleSubmit}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl">Join as a Supplier</CardTitle>
                  <CardDescription>
                    Complete the registration form to join our supplier network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="your.email@company.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          required
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number *</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          required
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearEstablished">Year Established</Label>
                        <Input
                          id="yearEstablished"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={formData.yearEstablished}
                          onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Factory Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Factory Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="factoryLocation">Factory Location *</Label>
                        <Input
                          id="factoryLocation"
                          placeholder="City, Country"
                          required
                          value={formData.factoryLocation}
                          onChange={(e) => handleInputChange('factoryLocation', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workforceSize">Workforce Size</Label>
                        <Input
                          id="workforceSize"
                          type="number"
                          min="1"
                          value={formData.workforceSize}
                          onChange={(e) => handleInputChange('workforceSize', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea
                        id="address"
                        rows={2}
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Production Capabilities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Production Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="moqMinimum">Minimum Order Qty *</Label>
                        <Input
                          id="moqMinimum"
                          type="number"
                          required
                          min="1"
                          value={formData.moqMinimum}
                          onChange={(e) => handleInputChange('moqMinimum', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moqMaximum">Maximum Order Qty</Label>
                        <Input
                          id="moqMaximum"
                          type="number"
                          min="1"
                          value={formData.moqMaximum}
                          onChange={(e) => handleInputChange('moqMaximum', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leadTimeDays">Lead Time (Days) *</Label>
                        <Input
                          id="leadTimeDays"
                          type="number"
                          required
                          min="1"
                          value={formData.leadTimeDays}
                          onChange={(e) => handleInputChange('leadTimeDays', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalCapacityMonthly">Monthly Capacity (Units)</Label>
                      <Input
                        id="totalCapacityMonthly"
                        type="number"
                        min="1"
                        value={formData.totalCapacityMonthly}
                        onChange={(e) => handleInputChange('totalCapacityMonthly', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Product Specializations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {specializationOptions.map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={spec}
                            checked={formData.specializations.includes(spec)}
                            onCheckedChange={() => toggleSpecialization(spec)}
                          />
                          <Label htmlFor={spec} className="cursor-pointer text-sm">
                            {spec}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* About */}
                  <div className="space-y-2">
                    <Label htmlFor="about">About Your Company</Label>
                    <Textarea
                      id="about"
                      rows={4}
                      placeholder="Tell us about your manufacturing capabilities, experience, and what makes your company unique..."
                      value={formData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                    />
                  </div>

                  {/* Account Security */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          required
                          minLength={6}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          minLength={6}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                    Your application will be reviewed by our team.
                  </p>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
