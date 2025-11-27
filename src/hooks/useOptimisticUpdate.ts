import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Custom hook for optimistic updates with automatic rollback on failure
 * Provides better UX by immediately showing changes before server confirmation
 */
export function useOptimisticUpdate<T>(
  initialState: T,
  updateFn: (newValue: T) => Promise<void>,
  options: OptimisticUpdateOptions<T> = {}
) {
  const [value, setValue] = useState<T>(initialState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousValue, setPreviousValue] = useState<T>(initialState);
  const { toast } = useToast();

  const update = async (newValue: T) => {
    // Store the current value for potential rollback
    setPreviousValue(value);

    // Optimistically update the UI
    setValue(newValue);
    setIsUpdating(true);

    try {
      // Attempt the actual update
      await updateFn(newValue);

      // Success
      if (options.successMessage) {
        toast({
          title: 'Success',
          description: options.successMessage,
        });
      }

      if (options.onSuccess) {
        options.onSuccess(newValue);
      }
    } catch (error: any) {
      // Rollback on error
      console.error('Optimistic update failed, rolling back:', error);
      setValue(previousValue);

      toast({
        title: 'Update Failed',
        description: options.errorMessage || error.message || 'Failed to update. Changes have been reverted.',
        variant: 'destructive',
      });

      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    value,
    isUpdating,
    update,
    reset: () => setValue(initialState),
  };
}

/**
 * Hook specifically for production stage updates with optimistic UI
 */
export function useOptimisticStageUpdate(stageId: string, initialData: any) {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStage = async (updates: Partial<any>) => {
    const previousData = { ...data };
    
    // Optimistically update UI
    setData({ ...data, ...updates });
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('production_stages')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', stageId);

      if (error) throw error;

      toast({
        title: 'Updated',
        description: 'Production stage updated successfully',
      });
    } catch (error: any) {
      // Rollback on failure
      console.error('Stage update failed:', error);
      setData(previousData);

      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update stage. Changes reverted.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    data,
    isUpdating,
    updateStage,
  };
}

/**
 * Hook for optimistic order updates
 */
export function useOptimisticOrderUpdate(orderId: string, initialOrder: any) {
  const { toast } = useToast();
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOrder = async (updates: Partial<any>) => {
    const previousOrder = { ...order };
    
    // Optimistically update UI
    setOrder({ ...order, ...updates });
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('supplier_orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Updated',
        description: 'Order updated successfully',
      });
    } catch (error: any) {
      // Rollback on failure
      console.error('Order update failed:', error);
      setOrder(previousOrder);

      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update order. Changes reverted.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    order,
    isUpdating,
    updateOrder,
  };
}
