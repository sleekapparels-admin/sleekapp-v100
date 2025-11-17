import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { BusinessHours } from "@/components/BusinessHours";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Download } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SmartReplyButtons } from "@/components/SmartReplyButtons";
import { BrochureDownload } from "@/components/BrochureDownload";

const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  whatsapp: z.string()
    .trim()
    .regex(/^(\+?[1-9]\d{0,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  productType: z.enum(["knitwear", "cutsew", "uniforms", "mixed"], {
    required_error: "Please select a product type"
  }),
  quantity: z.number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(1000000, "Quantity exceeds maximum limit"),
  gauge: z.string()
    .trim()
    .max(100, "Gauge/Fabric must be less than 100 characters")
    .optional(),
  targetDate: z.string().optional(),
  notes: z.string()
    .trim()
    .min(10, "Please provide at least 10 characters describing your project")
    .max(2000, "Project details must be less than 2000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  const handleSmartReplySelect = (reply: string) => {
    setNotes((prevNotes) => (prevNotes ? `${prevNotes}\n${reply}` : reply));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      productType: formData.get("productType") as string,
      quantity: parseInt(formData.get("quantity") as string, 10),
      gauge: formData.get("gauge") as string,
      targetDate: formData.get("targetDate") as string,
      notes: notes,
    };

    try {
      contactFormSchema.parse(formValues);
      
      // Get or create session ID for anonymous users
      let sessionId = localStorage.getItem('quote_session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('quote_session_id', sessionId);
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('submit-quote', {
        body: {
          ...formValues,
          sessionId
        },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit quote request');
      }

      // Store session ID for tracking
      if (data?.sessionId) {
        localStorage.setItem('quote_session_id', data.sessionId);
      }

      toast({
        title: "Thank you!",
        description: "Our merchandising team will respond within 24 hours.",
      });
      
      (e.target as HTMLFormElement).reset();
      setNotes("");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Validation Error",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission failed",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <SEO config={getPageSEO('contact')} />

      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Sleek Apparels | Request Quote & Samples</h1>
              <p className="text-xl text-muted-foreground">
                Fill out the form below and our team will provide a detailed quotation within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="space-y-8 animate-fade-up">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-6">
                    Our merchandising team is ready to assist you with quotes, technical specifications, and production planning.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="space-y-1">
                        <a href="mailto:inquiry@sleekapparels.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                          inquiry@sleekapparels.com
                        </a>
                        <a href="mailto:hello@sleekapparels.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                          hello@sleekapparels.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Phone / WhatsApp</div>
                      <a href="tel:+8801861011367" className="block text-muted-foreground hover:text-primary transition-colors">
                        +880-186-1011-367
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Locations</div>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <div>
                          <div className="font-medium">Head Office:</div>
                          <div>01, Road 19A, Sector 04, Uttara, Dhaka 1230, Bangladesh</div>
                        </div>
                        <div>
                          <div className="font-medium">Manufacturing Plant:</div>
                          <div>114/3, Khapara Road, Tongi, Gazipur 1712, Bangladesh</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <BusinessHours />
                </div>

                <div className="bg-card border border-border rounded-lg p-6 mt-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Company Brochure
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Download our comprehensive overview for detailed information about our capabilities.</p>
                  <BrochureDownload variant="minimal" />
                </div>
              </div>

              <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: "150ms" }}>
                <div className="bg-card border border-border rounded-lg p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" required placeholder="John Doe" maxLength={100} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" name="company" placeholder="Your Brand Name" maxLength={100} />
                        {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" maxLength={255} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+1 234 567 8900" />
                        {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select name="productType" required>
                          <SelectTrigger id="productType">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="knitwear">Knitwear</SelectItem>
                            <SelectItem value="cutsew">Cut & Sew</SelectItem>
                            <SelectItem value="uniforms">Uniforms</SelectItem>
                            <SelectItem value="mixed">Mixed Order</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.productType && <p className="text-sm text-destructive">{errors.productType}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input id="quantity" name="quantity" type="number" required placeholder="e.g., 200" min={1} max={1000000} />
                        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gauge">Gauge / Fabric Type</Label>
                        <Input id="gauge" name="gauge" placeholder="e.g., 12GG, Cotton Oxford" maxLength={100} />
                        {errors.gauge && <p className="text-sm text-destructive">{errors.gauge}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetDate">Target Delivery Date</Label>
                        <Input id="targetDate" name="targetDate" type="date" />
                        {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Project Details *</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        required
                        placeholder="Please describe your project, including style references, size range, colors, and any special requirements..."
                        className="min-h-[120px]"
                        maxLength={2000}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                      <SmartReplyButtons onSelect={handleSmartReplySelect} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Reference Files (Optional)</Label>
                      <Input id="file" type="file" accept=".jpg,.jpeg,.png,.pdf" multiple />
                      <p className="text-xs text-muted-foreground">Upload reference images or tech packs (JPG, PNG, PDF)</p>
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Submit Quote Request
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default Contact;