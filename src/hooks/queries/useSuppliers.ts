import { useQuery } from '@tanstack/react-query';
import { supplierHelpers } from '@/lib/supabaseHelpers';
import type { Supplier } from '@/types/database';

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...supplierKeys.lists(), filters] as const,
  verified: () => [...supplierKeys.lists(), 'verified'] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  byUser: (userId: string) => [...supplierKeys.all, 'user', userId] as const,
};

export function useVerifiedSuppliers() {
  return useQuery({
    queryKey: supplierKeys.verified(),
    queryFn: async () => {
      const { data, error } = await supplierHelpers.getVerified();
      if (error) throw error;
      return data || [];
    },
  });
}

export function useSupplier(supplierId: string) {
  return useQuery({
    queryKey: supplierKeys.detail(supplierId),
    queryFn: async () => {
      const { data, error } = await supplierHelpers.getById(supplierId);
      if (error) throw error;
      return data;
    },
    enabled: !!supplierId,
  });
}

export function useSupplierByUser(userId: string) {
  return useQuery({
    queryKey: supplierKeys.byUser(userId),
    queryFn: async () => {
      const { data, error } = await supplierHelpers.getByUserId(userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
