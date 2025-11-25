/**
 * Lead Capture Form
 * Collects early interest data before full signup for AI training
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackDatabaseEvent as trackEvent, trackFormSubmit, getUTMParameters } from '@/lib/analyticsTracking';

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  compact?: boolean;
  source?: string;
}

export function LeadCaptureForm({ onSuccess, compact = false, source = 'homepage' }: LeadCaptureFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    phone: '',
    user_type: 'not_sure' as 'buyer' | 'supplier' | 'both' | 'not_sure',
    monthly_volume_range: '',
    geographical_region: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get UTM parameters for tracking
      const utmParams = getUTMParameters();

      // Prepare lead data
      const leadData = {
        ...formData,
        source,
        referral_url: document.referrer || null,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        browser_info: {
          user_agent: navigator.userAgent,
          language: navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
        },
      };

      // Insert lead into database
      const { error } = await supabase
        .from('lead_captures' as any)
        .insert(leadData);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation (duplicate email)
          toast.error('This email is already registered. Please sign in or use a different email.');
        } else {
          throw error;
        }
        trackFormSubmit('lead_capture', false);
        return;
      }

      // Track successful lead capture
      trackFormSubmit('lead_capture', true);
      trackEvent({
        event_name: 'lead_captured',
        event_category: 'conversion',
        event_properties: {
          user_type: formData.user_type,
          source,
          has_company: !!formData.company_name,
          has_phone: !!formData.phone,
        },
      });

      // Show success state
      setIsSuccess(true);
      toast.success('Thank you! We\'ll be in touch soon to get you started.');

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err: any) {
      console.error('Lead capture error:', err);
      toast.error(err.message || 'Failed to submit. Please try again.');
      trackFormSubmit('lead_capture', false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">You're on the list! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              We'll reach out soon to get you started with early access.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? '' : 'border-primary/20'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {compact ? 'Get Early Access' : 'Join Our Beta Program'}
        </CardTitle>
        <CardDescription>
          {compact 
            ? 'Help us build the future of apparel sourcing'
            : 'Help us improve by providing feedback on our AI-powered platform. Limited spots available for buyers and suppliers.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="lead-email">Email Address *</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="lead-name">Full Name</Label>
            <Input
              id="lead-name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          {/* User Type - Required */}
          <div className="space-y-2">
            <Label>I am a... *</Label>
            <RadioGroup
              value={formData.user_type}
              onValueChange={(value: any) => setFormData({ ...formData, user_type: value })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label htmlFor="buyer" className="font-normal cursor-pointer">
                  Buyer - Looking to source apparel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplier" id="supplier" />
                <Label htmlFor="supplier" className="font-normal cursor-pointer">
                  Supplier/Manufacturer - Want to get more orders
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="font-normal cursor-pointer">
                  Both - Buy and supply apparel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_sure" id="not_sure" />
                <Label htmlFor="not_sure" className="font-normal cursor-pointer">
                  Just exploring
                </Label>
              </div>
            </RadioGroup>
          </div>

          {!compact && (
            <>
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="lead-company">Company Name</Label>
                <Input
                  id="lead-company"
                  type="text"
                  placeholder="Your Company Inc."
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="lead-phone">Phone Number (Optional)</Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Monthly Volume - For buyers/suppliers */}
              {(formData.user_type === 'buyer' || formData.user_type === 'supplier' || formData.user_type === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="lead-volume">Expected Monthly Volume</Label>
                  <Select
                    value={formData.monthly_volume_range}
                    onValueChange={(value) => setFormData({ ...formData, monthly_volume_range: value })}
                  >
                    <SelectTrigger id="lead-volume">
                      <SelectValue placeholder="Select volume range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500">0-500 pieces</SelectItem>
                      <SelectItem value="500-2000">500-2,000 pieces</SelectItem>
                      <SelectItem value="2000-5000">2,000-5,000 pieces</SelectItem>
                      <SelectItem value="5000+">5,000+ pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="lead-region">Your Region/Country</Label>
                <Input
                  id="lead-region"
                  type="text"
                  placeholder="e.g., USA, Bangladesh, India"
                  value={formData.geographical_region}
                  onChange={(e) => setFormData({ ...formData, geographical_region: e.target.value })}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="lead-message">What are you looking for? (Optional)</Label>
                <Textarea
                  id="lead-message"
                  placeholder="Tell us about your needs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Get Early Access'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to help us improve our platform. We'll never spam you.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
