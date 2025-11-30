import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { orderHelpers } from "@/lib/supabaseHelpers";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/database";

export const useOrderManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateOrderStatus = async (
    orderId: string,
    newStatus: any,
    notes?: string
  ) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_new_status: newStatus,
        p_notes: notes,
      });

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update order status",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculateMargin = (buyerPrice: number, supplierPrice: number) => {
    const margin = buyerPrice - supplierPrice;
    const marginPercentage = buyerPrice > 0 ? (margin / buyerPrice) * 100 : 0;
    return { margin, marginPercentage };
  };

  const assignSupplierToOrder = async (
    orderId: string,
    supplierId: string,
    supplierPrice: number,
    instructions?: string
  ) => {
    try {
      setLoading(true);

      // Get order details
      const { data: order, error: orderError } = await orderHelpers.getById(orderId);

      if (orderError || !order) throw orderError || new Error('Order not found');

      const { margin, marginPercentage } = calculateMargin(
        order.buyer_price || 0,
        supplierPrice
      );

      // Create supplier order
      const currentUser = await supabase.auth.getUser();
      const { error: supplierOrderError } = await supabase
        .from('supplier_orders')
        .insert({
          supplier_id: supplierId,
          buyer_order_id: orderId,
          product_type: order.product_type,
          quantity: order.quantity,
          supplier_price: supplierPrice,
          target_date: order.target_date,
          special_instructions: instructions,
          status: 'pending',
          created_by: currentUser.data.user?.id || '',
        });

      if (supplierOrderError) throw supplierOrderError;

      // Update main order
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          supplier_id: supplierId,
          supplier_price: supplierPrice,
          admin_margin: margin,
          margin_percentage: marginPercentage,
          workflow_status: 'assigned_to_supplier',
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
          assigned_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Supplier assigned successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error assigning supplier:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign supplier",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateOrderStatus,
    calculateMargin,
    assignSupplierToOrder,
  };
};