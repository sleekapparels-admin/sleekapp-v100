import { useState, useEffect, useCallback } from 'react';
import { syncQueue, QueuedSubmission } from '@/lib/syncQueue';
import { useToast } from '@/hooks/use-toast';

export const useSyncQueue = () => {
  const [queue, setQueue] = useState<QueuedSubmission[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Subscribe to queue changes
  useEffect(() => {
    const updateQueue = () => {
      setQueue(syncQueue.getQueue());
    };

    // Initial load
    updateQueue();

    // Subscribe to changes
    const unsubscribe = syncQueue.subscribe(updateQueue);

    return unsubscribe;
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    const handleOnline = async () => {
      const queueLength = syncQueue.getQueue().length;
      if (queueLength > 0) {
        toast({
          title: "Back online",
          description: `Syncing ${queueLength} pending ${queueLength === 1 ? 'submission' : 'submissions'}...`,
        });
        
        await processQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [toast]);

  const processQueue = useCallback(async () => {
    setIsProcessing(true);
    try {
      await syncQueue.processQueue();
      const remaining = syncQueue.getQueue().length;
      
      if (remaining === 0) {
        toast({
          title: "All synced",
          description: "All pending submissions have been synced successfully.",
        });
      } else {
        toast({
          title: "Partial sync",
          description: `${remaining} ${remaining === 1 ? 'submission' : 'submissions'} failed to sync. Will retry automatically.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync pending submissions. Will retry automatically.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const clearQueue = useCallback(() => {
    syncQueue.clearQueue();
    toast({
      title: "Queue cleared",
      description: "All pending submissions have been removed.",
    });
  }, [toast]);

  const removeSubmission = useCallback((id: string) => {
    syncQueue.removeSubmission(id);
    toast({
      title: "Submission removed",
      description: "The submission has been removed from the queue.",
    });
  }, [toast]);

  return {
    queue,
    isProcessing,
    processQueue,
    clearQueue,
    removeSubmission,
    stats: syncQueue.getStats(),
  };
};

/**
 * Hook to handle form submissions with offline support
 * 
 * @example
 * const { submitForm, isSubmitting } = useOfflineForm({
 *   endpoint: '/api/contact',
 *   type: 'contact',
 *   onSuccess: (data) => console.log('Success:', data),
 *   onError: (error) => console.error('Error:', error),
 * });
 * 
 * await submitForm({ name: 'John', email: 'john@example.com' });
 */
export const useOfflineForm = <T extends Record<string, any>>({
  endpoint,
  type,
  method = 'POST',
  onSuccess,
  onError,
}: {
  endpoint: string;
  type: 'contact' | 'quote' | 'order' | 'generic';
  method?: 'POST' | 'PUT' | 'PATCH';
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitForm = useCallback(async (data: T) => {
    setIsSubmitting(true);

    try {
      if (!navigator.onLine) {
        // Queue for later
        await syncQueue.enqueue({
          type,
          data,
          endpoint,
          method,
        });

        toast({
          title: "Saved for later",
          description: "You're offline. Your submission will be sent when you're back online.",
        });

        onSuccess?.({ queued: true });
        return;
      }

      // Online - submit immediately
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      onSuccess?.(result);

    } catch (error) {
      console.error('Form submission error:', error);
      
      // If failed, queue for later
      await syncQueue.enqueue({
        type,
        data,
        endpoint,
        method,
      });

      toast({
        title: "Submission queued",
        description: "Failed to submit immediately. Will retry automatically.",
        variant: "destructive",
      });

      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [endpoint, type, method, onSuccess, onError, toast]);

  return {
    submitForm,
    isSubmitting,
  };
};
