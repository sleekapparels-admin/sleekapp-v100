import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const GarmentPreviewSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-secondary/20 to-background">
          {/* Main preview skeleton */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Skeleton className="w-full h-full max-w-2xl" />
          </div>

          {/* Info badges skeleton */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Footer info skeleton */}
        <div className="p-4 bg-secondary/20 border-t">
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
};
