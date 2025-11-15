import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Mail, Loader2 } from "lucide-react";
import { trackBusinessEvent } from "@/lib/analytics";

interface Props {
  quoteId: string;
  customerName: string;
}

export const LeadFollowupEmailDialog = ({ quoteId, customerName }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [templateType, setTemplateType] = useState<"gentle" | "discount" | "urgent">("gentle");
  const [customMessage, setCustomMessage] = useState("");

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("email-service", {
        body: {
          type: "lead-followup",
          data: {
            quoteId,
            templateType,
            customMessage: customMessage || undefined,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Track follow-up event
      trackBusinessEvent.contactFormSubmit("lead_followup");
      
      toast({
        title: "Email Sent!",
        description: `Follow-up email sent to ${customerName}`,
      });
      setOpen(false);
      setCustomMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const templateDescriptions = {
    gentle: "Friendly follow-up asking if they have questions",
    discount: "Special offer with 10% discount for quick response",
    urgent: "Final reminder about quote expiration",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Mail className="h-4 w-4 mr-1" />
          Follow Up
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Follow-up Email</DialogTitle>
          <DialogDescription>
            Send a follow-up email to {customerName} about their quote
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select value={templateType} onValueChange={(value: any) => setTemplateType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gentle">
                  <div>
                    <div className="font-medium">Gentle Follow-up</div>
                    <div className="text-xs text-muted-foreground">{templateDescriptions.gentle}</div>
                  </div>
                </SelectItem>
                <SelectItem value="discount">
                  <div>
                    <div className="font-medium">Special Discount Offer</div>
                    <div className="text-xs text-muted-foreground">{templateDescriptions.discount}</div>
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div>
                    <div className="font-medium">Urgent Reminder</div>
                    <div className="text-xs text-muted-foreground">{templateDescriptions.urgent}</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{templateDescriptions[templateType]}</p>
          </div>

          <div className="space-y-2">
            <Label>Custom Message (Optional)</Label>
            <Textarea
              placeholder="Add a custom message or leave empty to use the template..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              If provided, this will replace the default template content
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => sendEmailMutation.mutate()}
              disabled={sendEmailMutation.isPending}
              className="flex-1"
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
