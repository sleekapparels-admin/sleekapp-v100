import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Camera,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, scaleUp } from '@/lib/animations';

interface TimelineStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  completedDate?: string;
  estimatedDate?: string;
  photos?: string[];
  notes?: string;
  delay?: {
    days: number;
    reason: string;
  };
}

interface LoopTraceTimelineProps {
  orderId: string;
  productName: string;
  quantity: number;
  supplier: string;
  stages: TimelineStage[];
  overallProgress: number;
}

export const LoopTraceTimeline = ({
  orderId,
  productName,
  quantity,
  supplier,
  stages,
  overallProgress,
}: LoopTraceTimelineProps) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const currentStageIndex = stages.findIndex(s => s.status === 'in-progress');
  const completedStages = stages.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Order #{orderId}
                </h2>
                <Badge className="bg-primary text-primary-foreground">
                  LoopTrace™ Active
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {productName} • {quantity} pieces • {supplier}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                {overallProgress}%
              </div>
              <p className="text-sm text-muted-foreground">
                {completedStages} of {stages.length} stages
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="absolute h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
              style={{
                animation: 'shimmer 2s linear infinite',
              }}
            />
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative"
      >
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(completedStages / stages.length) * 100}%` }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary to-accent"
        />

        <div className="space-y-8">
          {stages.map((stage, index) => {
            const isExpanded = expandedStage === stage.id;
            const StatusIcon = stage.status === 'completed' ? CheckCircle2 : 
                             stage.status === 'in-progress' ? Circle : 
                             Circle;

            return (
              <motion.div
                key={stage.id}
                variants={staggerItem}
                className="relative pl-16"
              >
                {/* Status Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  className={cn(
                    "absolute left-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-background",
                    stage.status === 'completed' && "bg-green-500 text-white",
                    stage.status === 'in-progress' && "bg-primary text-white animate-pulse",
                    stage.status === 'pending' && "bg-gray-200 text-gray-400"
                  )}
                >
                  {stage.status === 'in-progress' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Clock className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <StatusIcon className="h-6 w-6" />
                  )}
                </motion.div>

                {/* Stage Card */}
                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    stage.status === 'in-progress' && "border-primary shadow-md",
                    stage.status === 'completed' && "border-green-200",
                    isExpanded && "shadow-lg"
                  )}
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {stage.name}
                        </h3>
                        {stage.status === 'completed' && (
                          <Badge variant="secondary" className="bg-green-50 text-green-700">
                            Completed
                          </Badge>
                        )}
                        {stage.status === 'in-progress' && (
                          <Badge className="bg-primary text-primary-foreground">
                            In Progress
                          </Badge>
                        )}
                        {stage.delay && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {stage.delay.days}d delay
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {stage.completedDate && (
                          <span>Completed: {stage.completedDate}</span>
                        )}
                        {stage.estimatedDate && (
                          <span>Estimated: {stage.estimatedDate}</span>
                        )}
                        {stage.photos && stage.photos.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Camera className="h-4 w-4" />
                            {stage.photos.length} photos
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      {stage.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Update Notes:</h4>
                          <p className="text-sm text-muted-foreground">
                            {stage.notes}
                          </p>
                        </div>
                      )}

                      {stage.delay && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-red-900">
                                Delay Detected
                              </h4>
                              <p className="text-sm text-red-700">
                                {stage.delay.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {stage.photos && stage.photos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3">Production Photos:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {stage.photos.map((photo, photoIndex) => (
                              <motion.div
                                key={photoIndex}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: photoIndex * 0.05 }}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPhoto(photo);
                                }}
                              >
                                <img
                                  src={photo}
                                  alt={`${stage.name} photo ${photoIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Prediction Card */}
      {currentStageIndex >= 0 && currentStageIndex < stages.length - 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  AI Prediction: On Track for Early Delivery
                </h4>
                <p className="text-sm text-blue-700">
                  Based on current progress, your order is likely to arrive 2-3 days earlier than estimated (85% confidence).
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.img
            {...scaleUp}
            src={selectedPhoto}
            alt="Production photo"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedPhoto(null)}
          >
            Close
          </Button>
        </motion.div>
      )}
    </div>
  );
};
