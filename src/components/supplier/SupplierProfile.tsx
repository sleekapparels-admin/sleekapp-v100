import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Building, MapPin, Mail, Phone, Globe } from "lucide-react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface SupplierProfileProps {
  supplier: any; // Using any due to extended fields not in base Supplier type
  onUpdate: () => void;
}

export const SupplierProfile = ({ supplier, onUpdate }: SupplierProfileProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: '',
    factory_location: '',
    address: '',
    about: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    moq_minimum: 50,
    lead_time_days: 45,
    workforce_size: 0,
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        company_name: supplier.company_name || '',
        factory_location: supplier.factory_location || '',
        address: supplier.address || '',
        about: supplier.about || '',
        contact_person: supplier.contact_person || '',
        contact_email: supplier.contact_email || '',
        contact_phone: supplier.contact_phone || '',
        website_url: supplier.website_url || '',
        moq_minimum: supplier.moq_minimum || 50,
        lead_time_days: supplier.lead_time_days || 45,
        workforce_size: supplier.workforce_size || 0,
      });
    }
  }, [supplier]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('suppliers')
        .update(formData)
        .eq('id', supplier.id);

      if (error) throw error;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "🎉 Success!",
        description: "Profile updated successfully",
      });

      setEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-muted-foreground">Verification Status</Label>
              <div className="mt-2">
                <Badge 
                  variant={
                    supplier?.verification_status === 'verified' ? 'default' :
                    supplier?.verification_status === 'pending' ? 'secondary' :
                    'destructive'
                  }
                  className={supplier?.verification_status === 'verified' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-scale-in' : supplier?.verification_status === 'pending' ? 'animate-pulse' : ''}
                >
                  {supplier?.verification_status === 'verified' ? '✓ ' : ''}{supplier?.verification_status || 'pending'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Tier</Label>
              <div className="mt-2">
                <Badge variant="outline">
                  {supplier?.tier || 'bronze'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
            >
              {editing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                'Edit'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <Label htmlFor="factory-location">Factory Location *</Label>
            <Input
              id="factory-location"
              value={formData.factory_location}
              onChange={(e) => setFormData({ ...formData, factory_location: e.target.value })}
              disabled={!editing}
              placeholder="City, Country"
            />
          </div>

          <div>
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!editing}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="about">About Company</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              disabled={!editing}
              rows={4}
              placeholder="Describe your company, capabilities, and specializations..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input
              id="contact-person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <Label htmlFor="contact-email">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <Label htmlFor="contact-phone">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone
            </Label>
            <Input
              id="contact-phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <Label htmlFor="website">
              <Globe className="h-4 w-4 inline mr-1" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              disabled={!editing}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Production Capabilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="moq">Minimum Order Quantity (pieces)</Label>
              <Input
                id="moq"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 500"
                value={formData.moq_minimum || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, moq_minimum: value ? parseInt(value) : 50 });
                }}
                disabled={!editing}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="lead-time">Lead Time (days)</Label>
              <Input
                id="lead-time"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 45"
                value={formData.lead_time_days || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, lead_time_days: value ? parseInt(value) : 45 });
                }}
                disabled={!editing}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="workforce">Workforce Size (workers)</Label>
              <Input
                id="workforce"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 150"
                value={formData.workforce_size || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, workforce_size: value ? parseInt(value) : 0 });
                }}
                disabled={!editing}
                className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      )}
    </div>
  );
};
