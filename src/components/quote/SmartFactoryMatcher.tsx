import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, TrendingUp, Clock, MapPin, Star } from "lucide-react";
import { useAvailableFactories } from "@/hooks/useFactoryCapacity";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface SmartFactoryMatcherProps {
  quantity: number;
  targetDate?: string;
  onSelectFactory?: (factoryId: string) => void;
}

export const SmartFactoryMatcher = ({ 
  quantity, 
  targetDate,
  onSelectFactory 
}: SmartFactoryMatcherProps) => {
  const [showAll, setShowAll] = useState(false);
  const { data: factories, isLoading } = useAvailableFactories(quantity, targetDate);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  if (!factories || factories.length === 0) {
    return (
      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex items-start gap-3">
          <Factory className="h-5 w-5 text-orange-600 mt-1" />
          <div>
            <h3 className="font-semibold text-orange-900">No Available Capacity</h3>
            <p className="text-sm text-orange-700 mt-1">
              No factories currently have capacity for {quantity} pieces on your target date.
              Our team will manually source the best options for you.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const displayedFactories = showAll ? factories : factories.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Smart Factory Matches
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {factories.length} factories available with capacity for your order
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {displayedFactories.map((factory: any) => (
          <Card key={factory.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">{factory.company_name}</h4>
                  {factory.tier && (
                    <Badge variant="secondary" className="capitalize">
                      {factory.tier} Tier
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {factory.factory_location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {factory.performance_score?.toFixed(1) || "N/A"}/100
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {factory.lead_time_days} days lead time
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge variant="default" className="bg-green-600">
                  {factory.match_score?.toFixed(0)}% Match
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Available Capacity</p>
                <p className="text-lg font-bold text-green-600">
                  {factory.capacity?.available_capacity || 0} pcs
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Utilization</p>
                <p className="text-lg font-bold">
                  {factory.capacity?.current_utilization || 0} pcs
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Capacity</p>
                <p className="text-lg font-bold">
                  {factory.capacity?.total_capacity || 0} pcs
                </p>
              </div>
            </div>

            {factory.capacity?.available_capacity < quantity && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Optimization Available:</strong> This factory can handle {factory.capacity?.available_capacity} pieces.
                  We can split your order across multiple factories to ensure faster delivery.
                </p>
              </div>
            )}

            {factory.avg_capacity_utilization && factory.avg_capacity_utilization < 60 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ⚡ <strong>High Availability:</strong> This factory currently has low utilization and can start immediately.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => onSelectFactory?.(factory.id)}
              >
                Select Factory
              </Button>
              <Button variant="outline">View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {factories.length > 3 && !showAll && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAll(true)}
        >
          Show {factories.length - 3} More Factories
        </Button>
      )}

      {showAll && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAll(false)}
        >
          Show Less
        </Button>
      )}
    </div>
  );
};
