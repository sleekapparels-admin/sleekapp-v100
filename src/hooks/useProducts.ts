import { useQuery } from "@tanstack/react-query";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { useMemo } from "react";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  featured?: boolean;
  gauge?: string | null;
  yarn?: string | null;
  colors?: string[] | null;
  ai_generated_image?: boolean | null;
  image_approved_by_admin?: boolean | null;
  image_generation_date?: string | null;
  image_generation_prompt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
}

export const useProducts = (filters?: ProductFilters) => {
  // Memoize the query function to prevent recreating on every render
  const queryFn = useMemo(() => async () => {
    let query = supabase
      .from("products")
      .select("*");

    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;

    return (data || []) as Product[];
  }, [filters?.category, filters?.search, filters?.featured]);

  return useQuery({
    queryKey: ["products", filters],
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes - products don't change often
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return (data || []) as any;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories rarely change
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
};

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID required");
      
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media(*),
          pricing_tiers(*),
          product_variants(*)
        `)
        .eq("id", productId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};
