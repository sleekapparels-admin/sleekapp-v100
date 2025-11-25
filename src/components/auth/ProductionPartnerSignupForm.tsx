/**
 * Production Partner Signup Form
 * For manufacturers, fabric suppliers, trim suppliers
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface ProductionPartnerSignupFormProps {
  onSubmit: (data: ProductionPartnerSignupData) => Promise<void>;
  isLoading: boolean;
  passwordErrors: string[];
}

export interface ProductionPartnerSignupData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone: string;
  partnerType: string;
  location: string;
  capacity: string;
  certifications: string[];
  specialization: string;
}

export function ProductionPartnerSignupForm({ onSubmit, isLoading, passwordErrors }: ProductionPartnerSignupFormProps) {
  const [formData, setFormData] = useState<ProductionPartnerSignupData>({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    phone: '',
    partnerType: '',
    location: '',
    capacity: '',
    certifications: [],
    specialization: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="partner-name">Full Name (Contact Person) *</Label>
        <Input
          id="partner-name"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="partner-email">Business Email Address *</Label>
        <Input
          id="partner-email"
          type="email"
          placeholder="you@factory.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="partner-password">Password *</Label>
        <Input
          id="partner-password"
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

      {/* Partner Type */}
      <div className="space-y-2">
        <Label htmlFor="partner-type">What do you manufacture/provide? *</Label>
        <Select 
          value={formData.partnerType} 
          onValueChange={(value) => setFormData({ ...formData, partnerType: value })}
          required
        >
          <SelectTrigger id="partner-type">
            <SelectValue placeholder="Select your type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="garment_manufacturer">Garment Manufacturing (Finished Products)</SelectItem>
            <SelectItem value="fabric_supplier">Fabric / Textile Supply</SelectItem>
            <SelectItem value="trims_accessories">Trims & Accessories (Labels, Buttons, etc.)</SelectItem>
            <SelectItem value="raw_materials">Raw Materials Supply</SelectItem>
            <SelectItem value="other_services">Other Production Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="partner-company">Factory / Company Name *</Label>
        <Input
          id="partner-company"
          type="text"
          placeholder="Your Factory Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="partner-location">Factory / Business Location *</Label>
        <Input
          id="partner-location"
          type="text"
          placeholder="City, Country"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="partner-phone">Business Phone Number *</Label>
        <Input
          id="partner-phone"
          type="tel"
          placeholder="+880 1234 567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      {/* Production Capacity */}
      <div className="space-y-2">
        <Label htmlFor="partner-capacity">Monthly Production Capacity</Label>
        <Select 
          value={formData.capacity} 
          onValueChange={(value) => setFormData({ ...formData, capacity: value })}
        >
          <SelectTrigger id="partner-capacity">
            <SelectValue placeholder="Select capacity range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500-5000">500-5,000 pieces/month</SelectItem>
            <SelectItem value="5000-20000">5,000-20,000 pieces/month</SelectItem>
            <SelectItem value="20000-50000">20,000-50,000 pieces/month</SelectItem>
            <SelectItem value="50000+">50,000+ pieces/month</SelectItem>
            <SelectItem value="not_applicable">Not Applicable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Certifications */}
      <div className="space-y-2">
        <Label>Certifications (Select all that apply)</Label>
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cert-wrap"
              checked={formData.certifications.includes('WRAP')}
              onCheckedChange={() => toggleCertification('WRAP')}
            />
            <Label htmlFor="cert-wrap" className="font-normal cursor-pointer">
              WRAP (Worldwide Responsible Accredited Production)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cert-oeko"
              checked={formData.certifications.includes('OEKO-TEX')}
              onCheckedChange={() => toggleCertification('OEKO-TEX')}
            />
            <Label htmlFor="cert-oeko" className="font-normal cursor-pointer">
              OEKO-TEX Standard 100
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cert-gots"
              checked={formData.certifications.includes('GOTS')}
              onCheckedChange={() => toggleCertification('GOTS')}
            />
            <Label htmlFor="cert-gots" className="font-normal cursor-pointer">
              GOTS (Global Organic Textile Standard)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cert-bsci"
              checked={formData.certifications.includes('BSCI')}
              onCheckedChange={() => toggleCertification('BSCI')}
            />
            <Label htmlFor="cert-bsci" className="font-normal cursor-pointer">
              BSCI (Business Social Compliance Initiative)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cert-iso"
              checked={formData.certifications.includes('ISO')}
              onCheckedChange={() => toggleCertification('ISO')}
            />
            <Label htmlFor="cert-iso" className="font-normal cursor-pointer">
              ISO Certifications
            </Label>
          </div>
        </div>
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <Label htmlFor="partner-specialization">Product Specialization</Label>
        <Select 
          value={formData.specialization} 
          onValueChange={(value) => setFormData({ ...formData, specialization: value })}
        >
          <SelectTrigger id="partner-specialization">
            <SelectValue placeholder="What do you specialize in?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casualwear">Casualwear (T-shirts, Hoodies)</SelectItem>
            <SelectItem value="activewear">Activewear / Sportswear</SelectItem>
            <SelectItem value="uniforms">Uniforms (School/Corporate)</SelectItem>
            <SelectItem value="all_categories">All Categories</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating your account...
          </>
        ) : (
          'Create Production Partner Account'
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}
