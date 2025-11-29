import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Building2, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  message: string;
  sender_role: string;
  sender_id: string;
  order_id: string;
  created_at: string;
  attachments: string[] | null;
  read_by: string[] | null;
  translated_message: string | null;
  sender_name?: string;
}

interface Supplier {
  id: string;
  company_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}

interface SupplierCoordinationPanelProps {
  orderId: string;
  supplierId: string;
}

export const SupplierCoordinationPanel = ({ orderId, supplierId }: SupplierCoordinationPanelProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`order-messages-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Fetch supplier info
      const { data: supplierData } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();
      
      if (supplierData) setSupplier(supplierData);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      
      if (messagesData) setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      // Get user role to determine sender type
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      const senderType = roleData?.role === 'supplier' ? 'supplier' : 'buyer';

      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: orderId,
          message: newMessage,
          sender_role: senderType,
          sender_id: user.id
        });

      if (error) throw error;

      setNewMessage("");
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the supplier",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Supplier Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Supplier Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supplier ? (
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold">{supplier.company_name}</p>
              </div>
              
              <div className="space-y-2">
                {supplier.contact_email !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${supplier.contact_email}`} className="text-primary hover:underline">
                      {supplier.contact_email}
                    </a>
                  </div>
                )}
                
                {supplier.contact_phone !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${supplier.contact_phone}`} className="text-primary hover:underline">
                      {supplier.contact_phone}
                    </a>
                  </div>
                )}
                
                {supplier.address !== null && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{supplier.address}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading supplier information...</p>
          )}
        </CardContent>
      </Card>

      {/* Messages Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication
            <Badge variant="secondary">{messages.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages List */}
          <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start a conversation with your supplier.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.sender_role === 'supplier'
                      ? 'bg-muted ml-8'
                      : 'bg-primary/10 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <Badge variant={message.sender_role === 'supplier' ? 'secondary' : 'default'}>
                      {message.sender_role === 'supplier' ? 'Supplier' : 'You'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          {user && (
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
                disabled={sending}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
