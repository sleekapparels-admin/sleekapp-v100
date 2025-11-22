import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  MarketplaceProduct, 
  ProductFormData,
  ProductInquiry,
  ProductSearchFilters,
  ApprovalAction
} from '@/types/marketplace';

// =====================================================
// QUERY KEYS
// =====================================================

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  products: () => [...marketplaceKeys.all, 'products'] as const,
  product: (id: string) => [...marketplaceKeys.products(), id] as const,
  supplierProducts: (supplierId: string) => [...marketplaceKeys.products(), 'supplier', supplierId] as const,
  pendingApproval: () => [...marketplaceKeys.products(), 'pending-approval'] as const,
  featured: () => [...marketplaceKeys.products(), 'featured'] as const,
  search: (filters: ProductSearchFilters) => [...marketplaceKeys.products(), 'search', filters] as const,
  inquiries: () => [...marketplaceKeys.all, 'inquiries'] as const,
  inquiry: (id: string) => [...marketplaceKeys.inquiries(), id] as const,
  categories: () => [...marketplaceKeys.all, 'categories'] as const,
};

// =====================================================
// FETCH PRODUCTS
// =====================================================

export function useMarketplaceProducts(filters?: ProductSearchFilters) {
  return useQuery({
    queryKey: marketplaceKeys.search(filters || {}),
    queryFn: async () => {
      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
          suppliers (
            company_name,
            tier,
            factory_location,
            supplier_ratings (overall_score)
          )
        `)
        .eq('status', 'approved');

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.minPrice) {
        query = query.gte('final_price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('final_price', filters.maxPrice);
      }
      if (filters?.minMoq) {
        query = query.gte('moq', filters.minMoq);
      }
      if (filters?.maxMoq) {
        query = query.lte('moq', filters.maxMoq);
      }
      if (filters?.inStock) {
        query = query.gt('available_quantity', 0);
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'price_asc':
          query = query.order('final_price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('final_price', { ascending: false });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const limit = filters?.limit || 20;
      const offset = ((filters?.page || 1) - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketplaceProduct[];
    },
  });
}

// =====================================================
// FETCH SINGLE PRODUCT
// =====================================================

export function useMarketplaceProduct(productId: string) {
  return useQuery({
    queryKey: marketplaceKeys.product(productId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select(`
          *,
          suppliers (
            company_name,
            tier,
            factory_location,
            moq_minimum,
            lead_time_days,
            supplier_ratings (overall_score, on_time_delivery, quality_rating)
          )
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase.rpc('increment_product_views', { product_uuid: productId });

      return data as MarketplaceProduct;
    },
    enabled: !!productId,
  });
}

// =====================================================
// FETCH SUPPLIER'S PRODUCTS
// =====================================================

export function useSupplierProducts(supplierId: string) {
  return useQuery({
    queryKey: marketplaceKeys.supplierProducts(supplierId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketplaceProduct[];
    },
    enabled: !!supplierId,
  });
}

// =====================================================
// FETCH PENDING APPROVAL PRODUCTS (ADMIN)
// =====================================================

export function usePendingApprovalProducts() {
  return useQuery({
    queryKey: marketplaceKeys.pendingApproval(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .select(`
          *,
          suppliers (
            company_name,
            tier,
            factory_location,
            approval_rating
          )
        `)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as MarketplaceProduct[];
    },
  });
}

// =====================================================
// CREATE PRODUCT
// =====================================================

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<MarketplaceProduct>) => {
      // Get current user's supplier ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!supplier) throw new Error('Supplier profile not found');

      const { data, error } = await supabase
        .from('marketplace_products')
        .insert([{
          ...productData,
          supplier_id: supplier.id,
          status: 'draft',
        }])
        .select()
        .single();

      if (error) throw error;
      return data as MarketplaceProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      toast.success('Product created successfully! You can now add images and submit for approval.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
}

// =====================================================
// UPDATE PRODUCT
// =====================================================

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketplaceProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as MarketplaceProduct;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.product(data.id) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      toast.success('Product updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
}

// =====================================================
// SUBMIT FOR APPROVAL
// =====================================================

export function useSubmitForApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .update({ status: 'pending_approval' })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data as MarketplaceProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      toast.success('Product submitted for approval! You\'ll be notified once it\'s reviewed.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit product: ${error.message}`);
    },
  });
}

// =====================================================
// APPROVE/REJECT PRODUCT (ADMIN)
// =====================================================

export function useApproveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      action, 
      reason, 
      feedback 
    }: { 
      productId: string; 
      action: ApprovalAction; 
      reason?: string;
      feedback?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update product status
      const newStatus = action === 'approved' ? 'approved' : 'rejected';
      const { data: product, error: updateError } = await supabase
        .from('marketplace_products')
        .update({
          status: newStatus,
          rejection_reason: reason,
          admin_feedback: feedback,
          approval_date: action === 'approved' ? new Date().toISOString() : null,
          approved_by: action === 'approved' ? user.id : null,
        })
        .eq('id', productId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log the approval action
      const { error: logError } = await supabase
        .from('product_approval_log')
        .insert([{
          product_id: productId,
          admin_id: user.id,
          action,
          reason,
          feedback,
          new_status: newStatus,
        }]);

      if (logError) throw logError;

      return product as MarketplaceProduct;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.pendingApproval() });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.product(variables.productId) });
      
      if (variables.action === 'approved') {
        toast.success('Product approved and published to marketplace!');
      } else {
        toast.success('Product rejected. Supplier has been notified with feedback.');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to process approval: ${error.message}`);
    },
  });
}

// =====================================================
// CREATE INQUIRY
// =====================================================

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiryData: Partial<ProductInquiry>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to send inquiries');

      const { data, error } = await supabase
        .from('product_inquiries')
        .insert([{
          ...inquiryData,
          buyer_id: user.id,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      // Increment inquiry count
      await supabase
        .from('marketplace_products')
        .update({ inquiries: supabase.sql`inquiries + 1` })
        .eq('id', inquiryData.product_id);

      return data as ProductInquiry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.inquiries() });
      toast.success('Inquiry sent! The supplier will respond shortly.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send inquiry: ${error.message}`);
    },
  });
}

// =====================================================
// FETCH CATEGORIES
// =====================================================

export function useProductCategories() {
  return useQuery({
    queryKey: marketplaceKeys.categories(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.products() });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
}
