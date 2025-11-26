import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, CheckCircle2 } from "lucide-react";

interface ResourceDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: 'buyers_guide' | 'material_chart';
  resourceTitle: string;
}

export const ResourceDownloadModal = ({
  open,
  onOpenChange,
  resourceType,
  resourceTitle,
}: ResourceDownloadModalProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-resource-email', {
        body: {
          email: email.trim().toLowerCase(),
          fullName: fullName.trim() || undefined,
          companyName: companyName.trim() || undefined,
          resourceType,
          source: 'homepage',
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Check your inbox! We've sent you the download link.");

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setEmail("");
        setFullName("");
        setCompanyName("");
        setIsSuccess(false);
        onOpenChange(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error requesting resource:', error);
      
      if (error.message?.includes('Rate limit')) {
        toast.error("You've reached the download limit. Please try again tomorrow.");
      } else if (error.message?.includes('Disposable email')) {
        toast.error("Please use a permanent email address.");
      } else {
        toast.error("Failed to send resource. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl mb-2">Check Your Inbox!</DialogTitle>
            <DialogDescription className="text-base">
              We've sent the download link to <strong>{email}</strong>
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                (Check your spam folder if you don't see it)
              </span>
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Download {resourceTitle}</DialogTitle>
              <DialogDescription>
                Enter your email to receive the free resource instantly.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your Company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Send Me the Resource
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By downloading, you agree to receive occasional emails about our services.
                  <br />
                  You can unsubscribe anytime.
                </p>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
