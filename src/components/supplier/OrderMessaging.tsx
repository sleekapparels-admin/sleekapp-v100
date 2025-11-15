import { useState, useEffect } from "react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderMessagingProps {
  orderId: string;
  isAdmin?: boolean;
}

export const OrderMessaging = ({ orderId, isAdmin = false }: OrderMessagingProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel(`order_messages_${orderId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'supplier_messages', filter: `supplier_order_id=eq.${orderId}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier_messages")
        .select("*, profiles:sender_id(full_name)")
        .eq("supplier_order_id", orderId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("supplier_messages").insert({
        supplier_order_id: orderId,
        sender_id: user.id,
        message: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
      fetchMessages();
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {msg.profiles?.full_name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(msg.created_at), "PPp")}
                  </span>
                </div>
                <p className="text-sm bg-muted rounded-lg p-3">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};