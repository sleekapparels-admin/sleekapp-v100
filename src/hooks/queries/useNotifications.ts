import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationHelpers } from '@/lib/supabaseHelpers';
import { toast } from 'sonner';
import type { UserNotification } from '@/types/database';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  byUser: (userId: string) => [...notificationKeys.lists(), 'user', userId] as const,
};

export function useNotificationsByUser(userId: string) {
  return useQuery({
    queryKey: notificationKeys.byUser(userId),
    queryFn: async () => {
      const { data, error } = await notificationHelpers.getByUserId(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await notificationHelpers.markAsRead(notificationId);
      if (error) throw error;
      return data;
    },
    onMutate: async (notificationId) => {
      // Get all notification queries
      const queries = queryClient.getQueriesData<UserNotification[]>({ 
        queryKey: notificationKeys.lists() 
      });

      const previousData: Array<{ queryKey: any; data: UserNotification[] | undefined }> = [];

      // Optimistically update all matching queries
      queries.forEach(([queryKey, oldData]) => {
        if (oldData) {
          previousData.push({ queryKey, data: oldData });
          
          const updatedData = oldData.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true, read_at: new Date().toISOString() }
              : notification
          );
          
          queryClient.setQueryData<UserNotification[]>(queryKey, updatedData);
        }
      });

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to mark notification as read');
    },
    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await notificationHelpers.markAllAsRead(userId);
      if (error) throw error;
      return data;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.byUser(userId) });

      const previousNotifications = queryClient.getQueryData<UserNotification[]>(
        notificationKeys.byUser(userId)
      );

      // Optimistically update all to read
      if (previousNotifications) {
        const updatedNotifications = previousNotifications.map(notification => ({
          ...notification,
          read: true,
          read_at: new Date().toISOString(),
        }));
        
        queryClient.setQueryData<UserNotification[]>(
          notificationKeys.byUser(userId),
          updatedNotifications
        );
      }

      return { previousNotifications };
    },
    onError: (error, userId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.byUser(userId), context.previousNotifications);
      }
      toast.error('Failed to mark all notifications as read');
    },
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.byUser(userId) });
      toast.success('All notifications marked as read');
    },
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Parameters<typeof notificationHelpers.create>[0]) => {
      const { data, error } = await notificationHelpers.create(notification);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.user_id) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.byUser(data.user_id) });
      }
    },
  });
}
