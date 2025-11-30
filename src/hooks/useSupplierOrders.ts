import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSupplierOrders = (supplierId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: loading, error } = useQuery({
    queryKey: ['supplier_orders', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_orders')
        .select(`
          *,
          supplier:suppliers(company_name),
          buyer_order:orders(
            order_number,
            buyer_id,
            buyer:profiles(full_name, company_name)
          )
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supplierId,
  });

  const acceptOrderMutation = useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes?: string }) => {
      const { error } = await supabase
        .from('supplier_orders')
        .update({
          acceptance_status: 'accepted',
          accepted_at: new Date().toISOString(),
          status: 'in_progress',
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update main order status
      const { data: supplierOrder } = await supabase
        .from('supplier_orders')
        .select('buyer_order_id')
        .eq('id', orderId)
        .single();

      if (supplierOrder?.buyer_order_id) {
        await supabase
          .from('orders')
          .update({ workflow_status: 'bulk_production' })
          .eq('id', supplierOrder.buyer_order_id);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders', supplierId] });
      toast({
        title: "Order Accepted",
        description: "You have successfully accepted this order",
      });
    },
    onError: (error: any) => {
      console.error('Error accepting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to accept order",
      });
    },
  });

  const rejectOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      const { error } = await supabase
        .from('supplier_orders')
        .update({
          acceptance_status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
          status: 'rejected',
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders', supplierId] });
      toast({
        title: "Order Rejected",
        description: "Order has been rejected",
      });
    },
    onError: (error: any) => {
      console.error('Error rejecting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject order",
      });
    },
  });

  const submitCounterOfferMutation = useMutation({
    mutationFn: async ({ orderId, counterPrice, notes }: { orderId: string; counterPrice: number; notes: string }) => {
      const { error } = await supabase
        .from('supplier_orders')
        .update({
          acceptance_status: 'counter_offered',
          counter_offer_price: counterPrice,
          counter_offer_notes: notes,
        })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders', supplierId] });
      toast({
        title: "Counter Offer Submitted",
        description: "Your counter offer has been sent to admin for review",
      });
    },
    onError: (error: any) => {
      console.error('Error submitting counter offer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit counter offer",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('supplier_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier_orders', supplierId] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated",
      });
    },
    onError: (error: any) => {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update status",
      });
    },
  });

  return {
    orders,
    loading,
    error,
    acceptOrder: (orderId: string, notes?: string) => acceptOrderMutation.mutateAsync({ orderId, notes }),
    rejectOrder: (orderId: string, reason: string) => rejectOrderMutation.mutateAsync({ orderId, reason }),
    submitCounterOffer: (orderId: string, counterPrice: number, notes: string) => submitCounterOfferMutation.mutateAsync({ orderId, counterPrice, notes }),
    updateOrderStatus: (orderId: string, status: string) => updateStatusMutation.mutateAsync({ orderId, status }),
  };
};
