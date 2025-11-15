import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface ProductionBatch {
  id: string;
  product_category: string;
  product_variant_base: string;
  target_quantity: number;
  current_quantity: number;
  current_style_count: number;
  max_styles: number;
  supplier_id: string;
  batch_status: 'filling' | 'confirmed' | 'in_production' | 'completed' | 'cancelled';
  unit_price_base: number;
  complexity_multiplier: number;
  estimated_start_date: string;
  actual_start_date?: string;
  window_closes_at: string;
  created_at: string;
  updated_at: string;
}

export interface BatchContribution {
  id: string;
  batch_id: string;
  order_id: string;
  quantity: number;
  style_details: any;
  buyer_price_per_unit: number;
  contribution_margin: number;
  committed_at: string;
}

export const useActiveBatches = (productCategory?: string) => {
  return useQuery({
    queryKey: ["active-batches", productCategory],
    queryFn: async () => {
      let query = supabase
        .from("production_batches")
        .select("*, batch_contributions(*)")
        .in("batch_status", ["filling", "confirmed"]);

      if (productCategory) {
        query = query.eq("product_category", productCategory);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (ProductionBatch & { batch_contributions: BatchContribution[] })[];
    },
  });
};

export const useMyBatchContributions = () => {
  return useQuery({
    queryKey: ["my-batch-contributions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("batch_contributions")
        .select(`
          *,
          production_batches(*),
          orders(*)
        `)
        .eq("orders.buyer_id", user.id);

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAggregatedOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      productCategory: string;
      productVariantBase: string;
      quantity: number;
      styleDetails: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('batch-processor', {
        body: {
          jobType: 'process-order',
          data: {
            ...orderData,
            buyerId: user.id,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-batches"] });
      queryClient.invalidateQueries({ queryKey: ["my-batch-contributions"] });
      
      toast.success(
        data.isNewBatch 
          ? "Order placed! Starting new production batch." 
          : `Order added to batch (${data.fillPercentage.toFixed(0)}% filled)`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to place order: ${error.message}`);
    },
  });
};

export const useBatchStatistics = () => {
  return useQuery({
    queryKey: ["batch-statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("production_batches")
        .select("batch_status, current_quantity, target_quantity");

      if (error) throw error;

      const stats = {
        totalBatches: data.length,
        filling: data.filter(b => b.batch_status === 'filling').length,
        confirmed: data.filter(b => b.batch_status === 'confirmed').length,
        inProduction: data.filter(b => b.batch_status === 'in_production').length,
        completed: data.filter(b => b.batch_status === 'completed').length,
        avgFillRate: data.reduce((acc, b) => acc + (b.current_quantity / b.target_quantity), 0) / data.length * 100,
      };

      return stats;
    },
  });
};
