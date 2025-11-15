import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export interface FactoryCapacity {
  id: string;
  supplier_id: string;
  date: string;
  total_capacity: number;
  current_utilization: number;
  available_capacity: number;
  machines_count: number;
  workers_count: number;
  shift_hours: number;
  updated_at: string;
}

export interface CapacityUpdate {
  supplier_id: string;
  date: string;
  total_capacity: number;
  machines_count?: number;
  workers_count?: number;
  shift_hours?: number;
}

export const useFactoryCapacity = (supplierId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["factory-capacity", supplierId, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from("factory_capacity")
        .select("*")
        .order("date", { ascending: true });

      if (supplierId) {
        query = query.eq("supplier_id", supplierId);
      }
      
      if (startDate) {
        query = query.gte("date", startDate);
      }
      
      if (endDate) {
        query = query.lte("date", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FactoryCapacity[];
    },
    enabled: !!supplierId,
  });
};

export const useUpdateFactoryCapacity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: CapacityUpdate) => {
      const { data, error } = await supabase
        .from("factory_capacity")
        .upsert({
          supplier_id: update.supplier_id,
          date: update.date,
          total_capacity: update.total_capacity,
          machines_count: update.machines_count || 0,
          workers_count: update.workers_count || 0,
          shift_hours: update.shift_hours || 8,
          current_utilization: 0, // Will be auto-calculated by triggers
        }, {
          onConflict: "supplier_id,date"
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory-capacity"] });
      queryClient.invalidateQueries({ queryKey: ["my-supplier"] });
      toast.success("Capacity updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update capacity: ${error.message}`);
    },
  });
};

export const useAvailableFactories = (quantity: number, targetDate?: string) => {
  return useQuery({
    queryKey: ["available-factories", quantity, targetDate],
    queryFn: async () => {
      const date = targetDate || new Date().toISOString().split('T')[0];
      
      // Get all verified suppliers with their capacity
      const { data: suppliers, error: suppliersError } = await supabase
        .from("suppliers")
        .select(`
          *,
          factory_capacity!inner(*)
        `)
        .eq("verification_status", "verified")
        .eq("factory_capacity.date", date)
        .gte("factory_capacity.available_capacity", quantity);

      if (suppliersError) throw suppliersError;

      // Calculate match scores using the database function (optimized)
      const scoredSuppliers = await Promise.all(
        suppliers.map(async (supplier) => {
          const { data: score } = await supabase.rpc("calculate_factory_match_score", {
            p_supplier_id: supplier.id,
            p_quantity: quantity,
            p_target_date: date,
          });

          return {
            ...supplier,
            match_score: score || 0,
            capacity: supplier.factory_capacity[0],
          };
        })
      );

      // Sort by match score (highest first) - optimized comparison
      return scoredSuppliers.sort((a, b) => {
        const scoreDiff = b.match_score - a.match_score;
        // If scores are equal, secondary sort by available capacity
        return scoreDiff !== 0 ? scoreDiff : (b.capacity?.available_capacity || 0) - (a.capacity?.available_capacity || 0);
      });
    },
    enabled: quantity > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - capacity changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useCapacityUtilizationLogs = (supplierId: string, days: number = 30) => {
  return useQuery({
    queryKey: ["capacity-logs", supplierId, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("capacity_utilization_logs")
        .select("*")
        .eq("supplier_id", supplierId)
        .gte("date", startDate.toISOString().split('T')[0])
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supplierId,
  });
};
