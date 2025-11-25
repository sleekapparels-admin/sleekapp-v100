import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async (
    orderId: string,
    paymentType: 'deposit' | 'balance' | 'full'
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { orderId, paymentType },
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (orderId?: string) => {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderId) {
        query = query.eq('order_id', orderId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load invoices",
      });
      return [];
    }
  };

  return {
    loading,
    createPaymentIntent,
    fetchInvoices,
  };
};