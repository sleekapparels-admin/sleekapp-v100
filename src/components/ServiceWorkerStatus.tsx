import { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, Trash2, CheckCircle2, XCircle, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CACHE_CONFIG } from "@/lib/cacheConfig";
import { useSyncQueue } from "@/hooks/useSyncQueue";
import { Badge } from "@/components/ui/badge";

export const ServiceWorkerStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const [cacheSize, setCacheSize] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { queue, isProcessing, processQueue, clearQueue, removeSubmission, stats } = useSyncQueue();

  useEffect(() => {
    // Check if service worker is registered
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        setHasServiceWorker(!!registration);
      }
    };

    // Estimate cache size
    const estimateCacheSize = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          setCacheSize(Math.round(estimate.usage / 1024 / 1024)); // Convert to MB
        }
      }
    };

    checkServiceWorker();
    estimateCacheSize();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const clearCache = async () => {
    try {
      // Unregister service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      toast({
        title: "Cache cleared",
        description: "All cached data has been removed. The page will reload.",
      });

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error clearing cache",
        description: "Failed to clear cache. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasQueuedItems = stats.total > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all z-50 relative"
          aria-label="Service Worker Status"
        >
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-600" />
          )}
          {hasQueuedItems && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {stats.total}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Cache Status</h4>
            <span className="text-xs text-muted-foreground">v{CACHE_CONFIG.version}</span>
          </div>

          <div className="space-y-3">
            {/* Online Status */}
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-600" />
                )}
                <span className="text-sm">Connection</span>
              </div>
              <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-orange-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Service Worker Status */}
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm">Service Worker</span>
              </div>
              <div className="flex items-center gap-1">
                {hasServiceWorker ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Inactive</span>
                  </>
                )}
              </div>
            </div>

            {/* Cache Size */}
            {cacheSize !== null && (
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <span className="text-sm">Cache Size</span>
                <span className="text-xs font-medium">{cacheSize} MB</span>
              </div>
            )}
          </div>

          {/* Sync Queue Section */}
          {hasQueuedItems && (
            <>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Pending Sync</span>
                  </div>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {queue.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-xs">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize">{item.type}</p>
                        <p className="text-muted-foreground truncate">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeSubmission(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {queue.length > 5 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{queue.length - 5} more
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={processQueue}
                    variant="default"
                    size="sm"
                    className="flex-1"
                    disabled={isProcessing || !isOnline}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                    Sync Now
                  </Button>
                  <Button
                    onClick={clearQueue}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Clear Cache Button */}
          <div className={hasQueuedItems ? "border-t pt-3" : ""}>
            <Button
              onClick={clearCache}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!hasServiceWorker}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache & Reload
            </Button>

            <p className="text-xs text-muted-foreground mt-2">
              {hasQueuedItems 
                ? "Queued submissions will sync automatically when online."
                : "Clearing cache will remove all offline data and reload the page."}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
