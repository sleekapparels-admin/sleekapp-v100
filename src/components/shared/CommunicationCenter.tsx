import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Paperclip, Search } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  subject: string;
  message: string;
  sender_id: string;
  recipient_id: string;
  order_id: string | null;
  read: boolean;
  created_at: string;
  attachments: string[];
}

interface CommunicationCenterProps {
  orderFilter?: string | null;
}

export const CommunicationCenter = ({ orderFilter }: CommunicationCenterProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient_id: '',
    subject: '',
    message: '',
    order_id: orderFilter || null
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time message updates
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      let query = supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (orderFilter) {
        query = query.eq('order_id', orderFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.message.trim() || !newMessage.recipient_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: newMessage.recipient_id,
          subject: newMessage.subject,
          message: newMessage.message,
          order_id: newMessage.order_id
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });

      setNewMessage({
        recipient_id: '',
        subject: '',
        message: '',
        order_id: orderFilter || null
      });

      fetchMessages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) throw error;
      fetchMessages();
    } catch (error: any) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Communication Center</h2>
        <p className="text-muted-foreground">Send and receive messages about your orders</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages found</p>
              ) : (
                filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) markAsRead(message.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-primary text-primary-foreground'
                        : !message.read
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold truncate">{message.subject || 'No Subject'}</div>
                      {!message.read && <Badge className="ml-2">New</Badge>}
                    </div>
                    <div className="text-sm opacity-90 truncate">{message.message}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {format(new Date(message.created_at), 'MMM dd, yyyy')}
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail / New Message */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedMessage.subject || 'No Subject'}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedMessage.created_at), 'MMM dd, yyyy • h:mm a')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Attachments:</p>
                    <div className="flex gap-2">
                      {selectedMessage.attachments.map((att, i) => (
                        <Button key={i} size="sm" variant="outline">
                          <Paperclip className="h-4 w-4 mr-2" />
                          File {i + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="mt-4" onClick={() => setSelectedMessage(null)}>
                  Reply
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>New Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Recipient (Admin/Supplier)</label>
                  <Input
                    placeholder="Enter recipient ID"
                    value={newMessage.recipient_id}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient_id: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Message subject"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                    rows={8}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={sendMessage} disabled={sending}>
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button variant="outline">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
