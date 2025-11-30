import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductionStage {
    id: string;
    stage_name: string;
    stage_number: number;
    description: string | null;
    status: string;
    completion_percentage: number;
    started_at: string | null;
    completed_at: string | null;
    target_date: string | null;
    photos: string[] | null;
    notes: string | null;
}

export const useProductionStages = (buyerOrderId: string | null) => {
    const queryClient = useQueryClient();

    // First, get the supplier_order_id associated with this buyer order
    const { data: supplierOrder } = useQuery({
        queryKey: ['supplier_order_id', buyerOrderId],
        queryFn: async () => {
            if (!buyerOrderId) return null;
            const { data, error } = await supabase
                .from('supplier_orders')
                .select('id')
                .eq('buyer_order_id', buyerOrderId)
                .maybeSingle();

            if (error) throw error;
            return data;
        },
        enabled: !!buyerOrderId,
    });

    const supplierOrderId = supplierOrder?.id;

    // Then fetch production stages for that supplier order
    const { data: stages = [], isLoading } = useQuery({
        queryKey: ['production_stages', supplierOrderId],
        queryFn: async () => {
            if (!supplierOrderId) return [];
            const { data, error } = await supabase
                .from('production_stages')
                .select('*')
                .eq('supplier_order_id', supplierOrderId)
                .order('stage_number', { ascending: true });

            if (error) throw error;

            return (data || []).map(s => ({
                ...s,
                description: s.description ?? '',
                photos: s.photos ?? [],
                completion_percentage: s.completion_percentage ?? 0
            })) as ProductionStage[];
        },
        enabled: !!supplierOrderId,
    });

    // Setup real-time subscription
    useEffect(() => {
        if (!supplierOrderId) return;

        const channel = supabase
            .channel(`production-stages-${supplierOrderId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'production_stages',
                    filter: `supplier_order_id=eq.${supplierOrderId}`
                },
                (payload) => {
                    // Invalidate cache to trigger a refetch
                    queryClient.invalidateQueries({ queryKey: ['production_stages', supplierOrderId] });

                    // Show notifications for updates
                    if (payload.eventType === 'UPDATE') {
                        const stage = payload.new as ProductionStage;
                        toast.success('Production Update', {
                            description: `${stage.stage_name}: ${stage.completion_percentage}% complete`,
                            duration: 5000,
                        });
                    } else if (payload.eventType === 'INSERT') {
                        const stage = payload.new as ProductionStage;
                        toast.info('New Production Stage', {
                            description: `${stage.stage_name} has started`,
                            duration: 5000,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supplierOrderId, queryClient]);

    return { stages, isLoading, supplierOrderId };
};

/**
 * Hook for starting a new production stage
 */
export const useStartProductionStage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ supplierOrderId, stageNumber, stageName }: {
            supplierOrderId: string;
            stageNumber: number;
            stageName: string;
        }) => {
            const { data, error } = await supabase
                .from('production_stages')
                .insert({
                    supplier_order_id: supplierOrderId,
                    stage_number: stageNumber,
                    stage_name: stageName,
                    status: 'in_progress',
                    started_at: new Date().toISOString(),
                    completion_percentage: 0
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['production_stages', variables.supplierOrderId] });
            toast.success('Stage Started', {
                description: `${variables.stageName} has been marked as in progress`,
            });
        },
        onError: (error: Error) => {
            toast.error('Error Starting Stage', {
                description: error.message || 'Failed to start production stage. Please try again.',
            });
        },
    });
};

/**
 * Hook for updating a production stage
 */
export const useUpdateProductionStage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ stageId, updates }: {
            stageId: string;
            updates: Partial<ProductionStage>;
        }) => {
            const updateData: any = {
                ...updates,
                updated_at: new Date().toISOString()
            };

            // Auto-complete if percentage reaches 100%
            if (updates.completion_percentage === 100 && updates.status !== 'completed') {
                updateData.status = 'completed';
                updateData.completed_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('production_stages')
                .update(updateData)
                .eq('id', stageId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onMutate: async ({ stageId, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['production_stages'] });

            // Snapshot previous value
            const previousStages = queryClient.getQueriesData({ queryKey: ['production_stages'] });

            // Optimistically update
            queryClient.setQueriesData(
                { queryKey: ['production_stages'] },
                (old: ProductionStage[] | undefined) => {
                    if (!old) return old;
                    return old.map(stage =>
                        stage.id === stageId ? { ...stage, ...updates } : stage
                    );
                }
            );

            return { previousStages };
        },
        onError: (error: Error, _variables, context) => {
            // Rollback on error
            if (context?.previousStages) {
                context.previousStages.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            toast.error('Update Failed', {
                description: error.message || 'Failed to update production stage. Please try again.',
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['production_stages'] });
            toast.success('Updated', {
                description: 'Production stage updated successfully',
            });
        },
    });
};

/**
 * Hook for completing a production stage
 */
export const useCompleteProductionStage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ stageId, stageName }: { stageId: string; stageName: string }) => {
            const { data, error } = await supabase
                .from('production_stages')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    completion_percentage: 100,
                    updated_at: new Date().toISOString()
                })
                .eq('id', stageId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['production_stages'] });
            toast.success('Stage Completed', {
                description: `${variables.stageName} has been marked as completed`,
            });
        },
        onError: (error: Error) => {
            toast.error('Completion Failed', {
                description: error.message || 'Failed to complete production stage. Please try again.',
            });
        },
    });
};
