import { format } from "date-fns";
import { CheckCircle, Circle } from "lucide-react";

interface TimelineEvent {
  status: string;
  timestamp?: string;
  notes?: string;
}

interface OrderStatusTimelineProps {
  currentStatus: string;
  history?: TimelineEvent[];
}

export const OrderStatusTimeline = ({ currentStatus, history = [] }: OrderStatusTimelineProps) => {
  const stages = [
    'quote_requested',
    'quote_sent',
    'admin_review',
    'awaiting_payment',
    'payment_received',
    'assigned_to_supplier',
    'sample_requested',
    'sample_approved',
    'bulk_production',
    'qc_inspection',
    'ready_to_ship',
    'shipped',
    'delivered',
    'completed',
  ];

  const currentIndex = stages.indexOf(currentStatus);

  const getEventFromHistory = (stage: string) => {
    return history.find(h => h.status === stage);
  };

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const event = getEventFromHistory(stage);

        return (
          <div key={stage} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isCompleted || isCurrent ? (
                <CheckCircle className={`h-6 w-6 ${isCurrent ? 'text-primary' : 'text-green-600'}`} />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
              {index < stages.length - 1 && (
                <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-600' : 'bg-muted'}`} />
              )}
            </div>
            <div className="flex-1 pb-8">
              <p className={`font-medium ${isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              {event?.timestamp && (
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
              )}
              {event?.notes && (
                <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};