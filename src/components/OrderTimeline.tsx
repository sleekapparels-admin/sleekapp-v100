import { CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

interface TimelineItem {
  status: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

interface OrderTimelineProps {
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusFlow = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_production", label: "In Production" },
  { key: "quality_check", label: "Quality Check" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export const OrderTimeline = ({ status, createdAt, updatedAt }: OrderTimelineProps) => {
  const currentIndex = statusFlow.findIndex(s => s.key === status);

  const timelineItems: TimelineItem[] = statusFlow.map((item, index) => ({
    status: item.label,
    timestamp: index === 0 ? createdAt : index === currentIndex ? updatedAt : undefined,
    completed: index < currentIndex,
    current: index === currentIndex,
  }));

  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            {item.completed ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
            ) : item.current ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border-2 border-primary">
                <Clock className="h-6 w-6 text-primary animate-pulse" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border-2 border-border">
                <Circle className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            {index < timelineItems.length - 1 && (
              <div className={`w-0.5 h-12 ${item.completed ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
          <div className="flex-1 pb-8">
            <p className={`font-medium ${item.current ? 'text-primary' : item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.status}
            </p>
            {item.timestamp && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
