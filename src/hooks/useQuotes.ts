import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface Quote {
  id: string;
  buyer_id?: string;
  session_id?: string;
  product_type: string;
  quantity: number;
  target_moq?: number;
  complexity_level?: string;
  fabric_type?: string;
  customization_details?: string;
  additional_requirements?: string;
  tech_pack_urls?: string[];
  reference_image_urls?: string[];
  target_price_per_unit?: number;
  target_delivery_date?: string;
  matched_supplier_ids?: string[];
  status: string;
  ai_estimation?: any;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  created_at: string;
  updated_at: string;
  // Specialty sourcing fields
  specialty_sourcing_required?: boolean;
  production_route?: 'bangladesh_only' | 'hybrid' | 'specialty_only';
  specialty_notes?: string;
  bangladesh_cost?: number;
  specialty_cost?: number;
  admin_markup?: number;
}

export interface SupplierQuote {
  id: string;
  quote_id: string;
  supplier_id: string;
  unit_price: number;
  total_price: number;
  lead_time_days: number;
  moq_offered: number;
  pricing_breakdown?: any;
  materials_description?: string;
  terms_conditions?: string;
  valid_until?: string;
  notes?: string;
  status: string;
  submitted_at: string;
  updated_at: string;
}

export const useQuotes = () => {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from("quotes")
        .select("*, supplier_quotes(*, suppliers(company_name))");

      if (user) {
        query = query.eq("buyer_id", user.id);
      } else {
        const sessionId = localStorage.getItem("quote_session_id");
        if (sessionId) {
          query = query.eq("session_id", sessionId);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useQuote = (quoteId: string | undefined) => {
  return useQuery({
    queryKey: ["quote", quoteId],
    queryFn: async () => {
      if (!quoteId) throw new Error("Quote ID required");

      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          supplier_quotes(
            *,
            suppliers(
              company_name,
              factory_location,
              tier,
              supplier_ratings(overall_score)
            )
          )
        `)
        .eq("id", quoteId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!quoteId,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: {
      product_type: string;
      quantity: number;
      target_moq?: number;
      complexity_level?: string;
      fabric_type?: string;
      customization_details?: string;
      additional_requirements?: string;
      tech_pack_urls?: string[];
      reference_image_urls?: string[];
      target_price_per_unit?: number;
      target_delivery_date?: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let sessionId = localStorage.getItem("quote_session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("quote_session_id", sessionId);
      }

      const { data, error } = await supabase
        .from("quotes")
        .insert([{
          ...quoteData,
          buyer_id: user?.id || null,
          session_id: !user ? sessionId : null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote request created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quote: ${error.message}`);
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Quote> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("quotes")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update quote: ${error.message}`);
    },
  });
};

export const useSupplierQuotes = () => {
  return useQuery({
    queryKey: ["supplier-quotes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get supplier ID
      const { data: supplier } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!supplier) return [];

      const { data, error } = await supabase
        .from("supplier_quotes")
        .select(`
          *,
          quotes(
            product_type,
            quantity,
            customer_name,
            customer_email,
            additional_requirements
          )
        `)
        .eq("supplier_id", supplier.id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSupplierQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: {
      quote_id: string;
      supplier_id: string;
      unit_price: number;
      total_price: number;
      lead_time_days: number;
      moq_offered: number;
      pricing_breakdown?: any;
      materials_description?: string;
      terms_conditions?: string;
      valid_until?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("supplier_quotes")
        .insert([quoteData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit quote: ${error.message}`);
    },
  });
};
