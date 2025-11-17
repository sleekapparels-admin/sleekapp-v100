import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  niche: z.string().min(1, "Please select a niche"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export default function QuoteForm() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    niche: '', 
    quantity: 50,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      quoteSchema.parse(formData);
      setErrors({});
      setLoading(true);
      
      // Get or create session ID for anonymous users
      let sessionId = localStorage.getItem('quote_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('quote_session_id', sessionId);
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      // Use the edge function for consistency
      const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          productType: formData.niche,
          quantity: formData.quantity,
          notes: formData.message || `Interested in ${formData.niche} for ${formData.quantity} pieces`,
          sessionId
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      // Store session ID for tracking
      if (data?.sessionId) {
        localStorage.setItem('quote_session_id', data.sessionId);
      }

      setSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({ name: '', email: '', niche: '', quantity: 50, message: '' });
      
      // Reset after 3s
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit your request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Your Custom Quote</h2>
          <p className="text-muted-foreground">
            Fill out the form below and our team will provide a detailed quotation within 24 hours.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8 shadow-card">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We've received your request and will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    maxLength={100}
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    maxLength={255}
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    required 
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="niche">Product Type *</Label>
                  <Select 
                    value={formData.niche} 
                    onValueChange={(value) => setFormData({ ...formData, niche: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knitwear">Knitwear</SelectItem>
                      <SelectItem value="cut_sew">Cut & Sew</SelectItem>
                      <SelectItem value="uniforms">Uniforms</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.niche && <p className="text-sm text-destructive">{errors.niche}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    value={formData.quantity} 
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) || 0 })} 
                    required 
                    placeholder="50"
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Additional Details</Label>
                <Textarea 
                  id="message"
                  maxLength={500}
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  placeholder="Tell us more about your project, including colors, sizes, and any special requirements..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.message.length}/500 characters
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get Quote"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}