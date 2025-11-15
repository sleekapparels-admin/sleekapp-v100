import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderHelpers, supplierHelpers } from '@/lib/supabaseHelpers';
import { toast } from 'sonner';
import type { Order, OrderWithRelations } from '@/types/database';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  withRelations: (id: string) => [...orderKeys.detail(id), 'relations'] as const,
  byBuyer: (buyerId: string) => [...orderKeys.lists(), 'buyer', buyerId] as const,
  byFactory: (factoryId: string) => [...orderKeys.lists(), 'factory', factoryId] as const,
  new: () => [...orderKeys.lists(), 'new'] as const,
  adminStats: () => [...orderKeys.all, 'admin-stats'] as const,
};

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getById(orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useOrderWithRelations(orderId: string) {
  return useQuery({
    queryKey: orderKeys.withRelations(orderId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getWithRelations(orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useOrdersByBuyer(buyerId: string) {
  return useQuery({
    queryKey: orderKeys.byBuyer(buyerId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getByBuyerId(buyerId);
      if (error) throw error;
      return data;
    },
    enabled: !!buyerId,
  });
}

export function useOrdersByFactory(factoryId: string) {
  return useQuery({
    queryKey: orderKeys.byFactory(factoryId),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getByFactoryId(factoryId);
      if (error) throw error;
      return data;
    },
    enabled: !!factoryId,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getAll();
      if (error) throw error;
      return data;
    },
  });
}

export function useNewOrders() {
  return useQuery({
    queryKey: orderKeys.new(),
    queryFn: async () => {
      const { data, error } = await orderHelpers.getNewOrders();
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: orderKeys.adminStats(),
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await orderHelpers.getAll();
      const { data: suppliersData, error: suppliersError } = await supplierHelpers.getVerified();
      
      if (ordersError) throw ordersError;
      if (suppliersError) throw suppliersError;
      
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (Number(order.buyer_price) || 0), 0) || 0;
      
      return {
        totalOrders: ordersData?.length || 0,
        verifiedSuppliers: suppliersData?.length || 0,
        totalRevenue,
      };
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, notes }: { orderId: string; status: string; notes?: string }) => {
      const { data, error } = await orderHelpers.updateStatus(orderId, status, notes);
      if (error) throw error;
      return data;
    },
    onMutate: async ({ orderId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

      // Snapshot previous value
      const previousOrder = queryClient.getQueryData<Order>(orderKeys.detail(orderId));

      // Optimistically update
      if (previousOrder) {
        queryClient.setQueryData<Order>(orderKeys.detail(orderId), {
          ...previousOrder,
          status,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousOrder };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderKeys.detail(variables.orderId), context.previousOrder);
      }
      toast.error('Failed to update order status');
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order status updated');
    },
  });
}
