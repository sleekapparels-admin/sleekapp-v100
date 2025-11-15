/**
 * Offline Sync Queue Manager
 * Handles queuing form submissions when offline and syncing when online
 */

export interface QueuedSubmission {
  id: string;
  type: 'contact' | 'quote' | 'order' | 'generic';
  data: Record<string, any>;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'offline_sync_queue';
const MAX_RETRIES = 3;

export class SyncQueue {
  private static instance: SyncQueue;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.processQueue());
    }
  }

  static getInstance(): SyncQueue {
    if (!SyncQueue.instance) {
      SyncQueue.instance = new SyncQueue();
    }
    return SyncQueue.instance;
  }

  /**
   * Add a submission to the queue
   */
  async enqueue(submission: Omit<QueuedSubmission, 'id' | 'timestamp' | 'retries'>): Promise<string> {
    const queue = this.getQueue();
    const id = `${submission.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const queuedSubmission: QueuedSubmission = {
      ...submission,
      id,
      timestamp: Date.now(),
      retries: 0,
    };

    queue.push(queuedSubmission);
    this.saveQueue(queue);
    this.notifyListeners();
    
    console.log('[SyncQueue] Enqueued submission:', id);
    return id;
  }

  /**
   * Process all queued submissions
   */
  async processQueue(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[SyncQueue] Offline, skipping queue processing');
      return;
    }

    const queue = this.getQueue();
    if (queue.length === 0) {
      return;
    }

    console.log(`[SyncQueue] Processing ${queue.length} queued submissions`);

    const results = await Promise.allSettled(
      queue.map(submission => this.processSubmission(submission))
    );

    // Remove successful submissions and update failed ones
    const newQueue: QueuedSubmission[] = [];
    
    results.forEach((result, index) => {
      const submission = queue[index];
      
      if (result.status === 'rejected') {
        // Increment retry count
        if (submission.retries < MAX_RETRIES) {
          newQueue.push({
            ...submission,
            retries: submission.retries + 1,
          });
        } else {
          console.error('[SyncQueue] Max retries reached for:', submission.id);
        }
      }
    });

    this.saveQueue(newQueue);
    this.notifyListeners();
  }

  /**
   * Process a single submission
   */
  private async processSubmission(submission: QueuedSubmission): Promise<void> {
    try {
      const response = await fetch(submission.endpoint, {
        method: submission.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission.data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('[SyncQueue] Successfully synced:', submission.id);
    } catch (error) {
      console.error('[SyncQueue] Failed to sync:', submission.id, error);
      throw error;
    }
  }

  /**
   * Get all queued submissions
   */
  getQueue(): QueuedSubmission[] {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('[SyncQueue] Error reading queue:', error);
      return [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(queue: QueuedSubmission[]): void {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('[SyncQueue] Error saving queue:', error);
    }
  }

  /**
   * Clear the entire queue
   */
  clearQueue(): void {
    localStorage.removeItem(QUEUE_KEY);
    this.notifyListeners();
  }

  /**
   * Remove a specific submission by ID
   */
  removeSubmission(id: string): void {
    const queue = this.getQueue().filter(item => item.id !== id);
    this.saveQueue(queue);
    this.notifyListeners();
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Get queue statistics
   */
  getStats(): { total: number; byType: Record<string, number> } {
    const queue = this.getQueue();
    const byType: Record<string, number> = {};
    
    queue.forEach(item => {
      byType[item.type] = (byType[item.type] || 0) + 1;
    });

    return {
      total: queue.length,
      byType,
    };
  }
}

// Export singleton instance
export const syncQueue = SyncQueue.getInstance();
