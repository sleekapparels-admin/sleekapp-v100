import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Image as ImageIcon, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { ProductionStage } from "./ProductionTimeline";

interface Update {
  id: string;
  created_at: string;
  stage: ProductionStage;
  message: string;
  completion_percentage: number;
  photos: string[];
  created_by: string;
  profiles: {
    full_name: string;
  };
}

interface ProductionUpdatesFeedProps {
  orderId: string;
  refreshTrigger?: number;
}

const stageLabels: Record<ProductionStage, string> = {
  yarn_received: "Yarn Received",
  knitting: "Knitting",
  linking: "Linking",
  washing_finishing: "Washing & Finishing",
  final_qc: "Final QC",
  packing: "Packing",
  ready_to_ship: "Ready to Ship",
};

export const ProductionUpdatesFeed = ({
  orderId,
  refreshTrigger = 0,
}: ProductionUpdatesFeedProps) => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, [orderId, refreshTrigger]);

  // Real-time subscription for order updates
  useEffect(() => {
    if (!orderId) return;

    // Subscribe to order_updates changes
    const channel = supabase
      .channel('order-updates-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_updates',
          filter: `order_id=eq.${orderId}`
        },
        async (payload) => {
          console.log('New order update received:', payload);
          
          const newUpdate = payload.new as Update;
          
          // Fetch profile data for the new update
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", newUpdate.created_by)
            .single();

          const updateWithProfile = {
            ...newUpdate,
            profiles: profile || { full_name: "Unknown User" },
          };
          
          // Show toast notification
          toast.success('New Production Update', {
            description: `${stageLabels[newUpdate.stage]}: ${newUpdate.message || `${newUpdate.completion_percentage}% complete`}`,
            duration: 5000,
          });
          
          // Add new update to the beginning of the list
          setUpdates(prev => [updateWithProfile as Update, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_updates',
          filter: `order_id=eq.${orderId}`
        },
        async (payload) => {
          console.log('Order update modified:', payload);
          
          const updatedUpdate = payload.new as Update;
          
          // Fetch profile data
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", updatedUpdate.created_by)
            .single();

          const updateWithProfile = {
            ...updatedUpdate,
            profiles: profile || { full_name: "Unknown User" },
          };
          
          // Update the existing update in the list
          setUpdates(prev => 
            prev.map(update => 
              update.id === updatedUpdate.id ? updateWithProfile as Update : update
            )
          );
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("order_updates")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch profile data separately
      const updatesWithProfiles = await Promise.all(
        (data || []).map(async (update) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", update.created_by)
            .single();
          
          return {
            ...update,
            profiles: profile || { full_name: "Unknown User" },
          };
        })
      );
      
      setUpdates(updatesWithProfiles as Update[]);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = async (path: string) => {
    const { data } = supabase.storage
      .from("production-photos")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading updates...</p>
      </Card>
    );
  }

  if (updates.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No production updates yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Production Updates</h3>
      {updates.map((update) => (
        <Card key={update.id} className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{update.profiles?.full_name || "Factory User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(update.created_at), "PPp")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{stageLabels[update.stage]}</Badge>
                  <Badge>{update.completion_percentage}% Complete</Badge>
                </div>
              </div>
              {update.message && (
                <div className="flex items-start gap-2 mt-3 p-3 bg-muted rounded-lg">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{update.message}</p>
                </div>
              )}
              {update.photos && update.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {update.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border bg-muted flex items-center justify-center overflow-hidden"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      {/* In a real implementation, you'd display the actual image here */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
