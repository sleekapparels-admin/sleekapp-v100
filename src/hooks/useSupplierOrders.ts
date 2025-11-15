import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export const useSupplierOrders = (supplierId: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching supplier orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string, notes?: string) => {
    try {
      setLoading(true);

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

      toast({
        title: "Order Accepted",
        description: "You have successfully accepted this order",
      });

      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error accepting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to accept order",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (orderId: string, reason: string) => {
    try {
      setLoading(true);

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

      toast({
        title: "Order Rejected",
        description: "Order has been rejected",
      });

      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject order",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitCounterOffer = async (
    orderId: string,
    counterPrice: number,
    notes: string
  ) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('supplier_orders')
        .update({
          acceptance_status: 'counter_offered',
          counter_offer_price: counterPrice,
          counter_offer_notes: notes,
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Counter Offer Submitted",
        description: "Your counter offer has been sent to admin for review",
      });

      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error submitting counter offer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit counter offer",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('supplier_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Order status has been updated",
      });

      await fetchOrders();
      return true;
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update status",
      });
      return false;
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchOrders();
    }
  }, [supplierId]);

  return {
    orders,
    loading,
    fetchOrders,
    acceptOrder,
    rejectOrder,
    submitCounterOffer,
    updateOrderStatus,
  };
};
