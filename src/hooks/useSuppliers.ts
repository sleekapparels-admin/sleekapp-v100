import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMemo } from "react";

export interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  factory_location: string;
  address?: string;
  workforce_size?: number;
  moq_minimum: number;
  moq_maximum?: number;
  lead_time_days: number;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  tier: 'bronze' | 'silver' | 'gold';
  about?: string;
  specializations?: string[];
  website_url?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  business_registration_number?: string;
  year_established?: number;
  total_capacity_monthly?: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierCapability {
  id: string;
  supplier_id: string;
  product_category: string;
  materials: string[];
  techniques: string[];
  gauge_range?: string;
}

export interface SupplierFilters {
  product_category?: string;
  min_moq?: number;
  max_moq?: number;
  location?: string;
  tier?: string;
}

export const useSuppliers = (filters?: SupplierFilters) => {
  // Memoize expensive filtering logic
  const queryFn = useMemo(() => async () => {
    let query = supabase
      .from("suppliers")
      .select("*, supplier_capabilities(*), supplier_ratings(*)")
      .eq("verification_status", "verified");

    if (filters?.location) {
      query = query.ilike("factory_location", `%${filters.location}%`);
    }

    if (filters?.tier && (filters.tier === 'bronze' || filters.tier === 'silver' || filters.tier === 'gold')) {
      query = query.eq("tier", filters.tier);
    }

    const { data, error } = await query.order("tier", { ascending: false });

    if (error) throw error;

    // Optimized client-side filtering with single pass
    let filteredData = data || [];
    
    if (filters?.min_moq || filters?.max_moq || filters?.product_category) {
      filteredData = filteredData.filter(s => {
        // MOQ filters
        if (filters.min_moq && s.moq_minimum > filters.min_moq) return false;
        if (filters.max_moq && s.moq_minimum < filters.max_moq) return false;
        
        // Product category filter
        if (filters.product_category) {
          const hasCategory = s.supplier_capabilities?.some((cap: any) => 
            cap.product_category === filters.product_category
          );
          if (!hasCategory) return false;
        }
        
        return true;
      });
    }

    return filteredData as Supplier[];
  }, [filters?.location, filters?.tier, filters?.min_moq, filters?.max_moq, filters?.product_category]);

  return useQuery({
    queryKey: ["suppliers", filters],
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};

export const useSupplier = (supplierId: string | undefined) => {
  return useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: async () => {
      if (!supplierId) throw new Error("Supplier ID required");

      const { data, error } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_capabilities(*),
          supplier_certifications(*),
          supplier_media(*),
          supplier_ratings(*)
        `)
        .eq("id", supplierId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!supplierId,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierData: {
      company_name: string;
      factory_location: string;
      moq_minimum: number;
      lead_time_days: number;
      address?: string;
      workforce_size?: number;
      moq_maximum?: number;
      about?: string;
      contact_person?: string;
      contact_phone?: string;
      contact_email?: string;
      business_registration_number?: string;
      year_established?: number;
      total_capacity_monthly?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("suppliers")
        .insert([{ ...supplierData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier profile created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create supplier: ${error.message}`);
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Supplier> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("suppliers")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update supplier: ${error.message}`);
    },
  });
};

export const useMySupplier = () => {
  return useQuery({
    queryKey: ["my-supplier"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("suppliers")
        .select(`
          *,
          supplier_capabilities(*),
          supplier_certifications(*),
          supplier_media(*)
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};
