import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SupplierCapabilityInput {
  supplier_id: string;
  product_category: string;
  materials: string[];
  techniques: string[];
  gauge_range?: string;
}

export const useCreateSupplierCapabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (capabilities: SupplierCapabilityInput[]) => {
      const { data, error } = await supabase
        .from("supplier_capabilities")
        .insert(capabilities)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["my-supplier"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add capabilities: ${error.message}`);
    },
  });
};
