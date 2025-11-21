import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

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

export const useRealtimeMessages = (userId: string | undefined, onNewMessage?: (message: Message) => void) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const messagesChannel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          if (onNewMessage && payload.new) {
            onNewMessage(payload.new as Message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Message updated:', payload);
        }
      )
      .subscribe();

    setChannel(messagesChannel);

    return () => {
      messagesChannel.unsubscribe();
    };
  }, [userId, onNewMessage]);

  return { channel };
};