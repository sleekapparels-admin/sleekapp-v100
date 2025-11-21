import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DesignEditorSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-56 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tabs skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          
          {/* Content area skeleton */}
          <div className="space-y-4 mt-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
