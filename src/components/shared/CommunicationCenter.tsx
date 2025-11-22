import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Paperclip, Search, X, FileText } from "lucide-react";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    const setupRealtimeSubscriptions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Subscribe to messages where user is the sender
      const senderChannel = supabase
        .channel('messages-sent')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      // Subscribe to messages where user is the recipient
      const recipientChannel = supabase
        .channel('messages-received')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        senderChannel.unsubscribe();
        recipientChannel.unsubscribe();
      };
    };

    const cleanup = setupRealtimeSubscriptions();

    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (userId: string): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    setUploadingFiles(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: error.message || "Failed to upload files",
      });
      return [];
    } finally {
      setUploadingFiles(false);
    }
  };

  const sendMessage = async () => {
    // Input validation
    if (!newMessage.message.trim() || !newMessage.recipient_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    if (newMessage.message.length > 5000) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Message too long (max 5000 characters)"
      });
      return;
    }

    if (newMessage.subject && newMessage.subject.length > 200) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subject too long (max 200 characters)"
      });
      return;
    }

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const attachmentUrls = await uploadFiles(user.id);

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: newMessage.recipient_id,
          subject: newMessage.subject,
          message: newMessage.message,
          order_id: newMessage.order_id,
          attachments: attachmentUrls.length > 0 ? attachmentUrls : null
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
      setSelectedFiles([]);

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
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Attachments:</p>
                    <div className="flex flex-col gap-2">
                      {selectedMessage.attachments.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          Attachment {i + 1}
                        </a>
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
                
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs max-w-[150px] truncate">{file.name}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeFile(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  id="file-upload"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.xls"
                />

                <div className="flex gap-2">
                  <Button onClick={sendMessage} disabled={sending || uploadingFiles}>
                    <Send className="h-4 w-4 mr-2" />
                    {sending || uploadingFiles ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={selectedFiles.length >= 5}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File {selectedFiles.length > 0 && `(${selectedFiles.length}/5)`}
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
