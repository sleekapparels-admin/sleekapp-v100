import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionStatusIndicatorProps {
  className?: string;
}

export const ConnectionStatusIndicator = ({ className = "" }: ConnectionStatusIndicatorProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Check initial connection status
    const checkConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        setIsConnected(!error);
      } catch (e) {
        setIsConnected(false);
      }
    };

    checkConnection();

    // Monitor Supabase real-time connection status
    const channel = supabase.channel('connection-monitor')
      .on('system', { event: 'CHANNEL_ERROR' }, () => {
        setIsConnected(false);
        setIsReconnecting(true);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setIsReconnecting(false);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
        }
      });

    // Periodic connection check
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (isReconnecting) {
    return (
      <Badge variant="outline" className={`${className} border-yellow-500 text-yellow-700`}>
        <Wifi className="h-3 w-3 mr-1 animate-pulse" />
        Reconnecting...
      </Badge>
    );
  }

  if (!isConnected) {
    return (
      <Badge variant="destructive" className={className}>
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`${className} border-green-500 text-green-700`}>
      <Wifi className="h-3 w-3 mr-1" />
      Live
    </Badge>
  );
};
