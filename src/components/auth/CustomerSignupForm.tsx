/**
 * Customer Signup Form
 * For brands, schools, corporates, teams ordering custom apparel
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface CustomerSignupFormProps {
  onSubmit: (data: CustomerSignupData) => Promise<void>;
  isLoading: boolean;
  passwordErrors: string[];
}

export interface CustomerSignupData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone: string;
  customerType: string;
  expectedVolume: string;
  productInterest: string;
}

export function CustomerSignupForm({ onSubmit, isLoading, passwordErrors }: CustomerSignupFormProps) {
  const [formData, setFormData] = useState<CustomerSignupData>({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    phone: '',
    customerType: '',
    expectedVolume: '',
    productInterest: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="customer-name">Full Name *</Label>
        <Input
          id="customer-name"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="customer-email">Email Address *</Label>
        <Input
          id="customer-email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="customer-password">Password *</Label>
        <Input
          id="customer-password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

      {/* Customer Type */}
      <div className="space-y-2">
        <Label htmlFor="customer-type">What type of customer are you? *</Label>
        <Select 
          value={formData.customerType} 
          onValueChange={(value) => setFormData({ ...formData, customerType: value })}
          required
        >
          <SelectTrigger id="customer-type">
            <SelectValue placeholder="Select your type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fashion_brand">Fashion Brand / Clothing Line</SelectItem>
            <SelectItem value="retail">Retail Business / E-commerce</SelectItem>
            <SelectItem value="school">School / Educational Institution</SelectItem>
            <SelectItem value="corporate">Corporate / Business (Uniforms)</SelectItem>
            <SelectItem value="sports_team">Sports Team / Club</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Brand/Company Name */}
      <div className="space-y-2">
        <Label htmlFor="customer-company">Brand / Company / Organization Name</Label>
        <Input
          id="customer-company"
          type="text"
          placeholder="Your Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="customer-phone">Phone Number (Optional)</Label>
        <Input
          id="customer-phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      {/* Expected Monthly Volume */}
      <div className="space-y-2">
        <Label htmlFor="customer-volume">Expected Monthly Order Volume</Label>
        <Select 
          value={formData.expectedVolume} 
          onValueChange={(value) => setFormData({ ...formData, expectedVolume: value })}
        >
          <SelectTrigger id="customer-volume">
            <SelectValue placeholder="Select volume range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50-500">50-500 pieces</SelectItem>
            <SelectItem value="500-2000">500-2,000 pieces</SelectItem>
            <SelectItem value="2000-5000">2,000-5,000 pieces</SelectItem>
            <SelectItem value="5000+">5,000+ pieces</SelectItem>
            <SelectItem value="not_sure">Not sure yet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Interest */}
      <div className="space-y-2">
        <Label htmlFor="customer-interest">Primary Product Interest</Label>
        <Select 
          value={formData.productInterest} 
          onValueChange={(value) => setFormData({ ...formData, productInterest: value })}
        >
          <SelectTrigger id="customer-interest">
            <SelectValue placeholder="What are you looking to produce?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tshirts">T-Shirts</SelectItem>
            <SelectItem value="hoodies">Hoodies & Sweatshirts</SelectItem>
            <SelectItem value="activewear">Activewear / Sportswear</SelectItem>
            <SelectItem value="uniforms">Uniforms (School/Corporate)</SelectItem>
            <SelectItem value="custom">Custom / Multiple Categories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}
