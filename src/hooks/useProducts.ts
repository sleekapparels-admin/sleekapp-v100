import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  price?: number | null;
  compare_at_price?: number | null;
  materials?: string[] | null;
  popularity_score?: number | null;
  lead_time_days?: number | null;
  moq?: number | null;
  search_vector?: string | null;
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
  minPrice?: number;
  maxPrice?: number;
  minMOQ?: number;
  materials?: string[];
  colors?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

export const useProducts = (filters?: ProductFilters) => {
  // Memoize the query function to prevent recreating on every render
  const queryFn = useMemo(() => async () => {
    let query = supabase
      .from("products")
      .select("*");

    // Category filter
    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    // Text search using full-text search
    if (filters?.search) {
      query = query.textSearch('search_vector', filters.search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Featured filter
    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    // Price range filters
    if (filters?.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    // MOQ filter
    if (filters?.minMOQ !== undefined) {
      query = query.gte("moq", filters.minMOQ);
    }

    // Materials filter
    if (filters?.materials && filters.materials.length > 0) {
      query = query.overlaps("materials", filters.materials);
    }

    // Colors filter
    if (filters?.colors && filters.colors.length > 0) {
      query = query.overlaps("colors", filters.colors);
    }

    // Sorting
    switch (filters?.sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "popular":
        query = query
          .order("featured", { ascending: false })
          .order("popularity_score", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Add fallback for missing images
    const productsWithFallback = (data || []).map(product => ({
      ...product,
      image_url: product.image_url || '/placeholder.svg'
    }));

    return productsWithFallback as Product[];
  }, [
    filters?.category, 
    filters?.search, 
    filters?.featured, 
    filters?.minPrice, 
    filters?.maxPrice, 
    filters?.minMOQ,
    filters?.materials,
    filters?.colors,
    filters?.sortBy
  ]);

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
