import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const QuoteSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quote Summary Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-secondary rounded w-48 animate-pulse" />
          <div className="h-4 bg-secondary rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Display Skeleton */}
          <div className="text-center space-y-2">
            <div className="h-4 bg-secondary rounded w-32 mx-auto animate-pulse" />
            <div className="h-12 bg-primary/10 rounded w-48 mx-auto animate-pulse" />
            <div className="h-3 bg-secondary rounded w-40 mx-auto animate-pulse" />
          </div>

          <Separator />

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                <div className="h-3 bg-secondary rounded w-16 animate-pulse" />
                <div className="h-5 bg-secondary rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 bg-secondary rounded w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-secondary rounded w-32 animate-pulse" />
              <div className="h-4 bg-secondary rounded w-20 animate-pulse" />
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-secondary rounded w-24 animate-pulse" />
            <div className="h-6 bg-primary/20 rounded w-28 animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Timeline Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 bg-secondary rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                {i < 4 && <div className="w-0.5 h-12 bg-secondary animate-pulse" />}
              </div>
              <div className="flex-1 space-y-2 pb-4">
                <div className="h-4 bg-secondary rounded w-32 animate-pulse" />
                <div className="h-3 bg-secondary rounded w-48 animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 bg-secondary rounded w-36 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-secondary rounded w-full animate-pulse" />
          <div className="h-4 bg-secondary rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-secondary rounded w-4/6 animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
};
