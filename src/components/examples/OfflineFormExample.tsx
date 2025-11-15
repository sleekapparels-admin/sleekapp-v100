/**
 * Example implementation of offline form with sync queue
 * This demonstrates how to integrate the offline sync queue with any form
 */

import { useState } from "react";
import { useOfflineForm } from "@/hooks/useSyncQueue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const OfflineFormExample = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { toast } = useToast();

  const { submitForm, isSubmitting } = useOfflineForm({
    endpoint: '/api/contact',
    type: 'contact',
    method: 'POST',
    onSuccess: (data) => {
      if (data.queued) {
        // Form was queued for offline sync
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Form was submitted successfully
        toast({
          title: "Message sent",
          description: "Thank you for your message. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      }
    },
    onError: (error) => {
      console.error("Form error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          placeholder="Your message"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Send Message"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Works offline - your submission will be sent when you're back online.
      </p>
    </form>
  );
};
