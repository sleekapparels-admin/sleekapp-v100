import { motion } from 'framer-motion';
import { Clock, Zap, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TimelineStage {
  name: string;
  sleekDays: number;
  traditionalDays: number;
  description: string;
  loopTraceCheckpoint?: boolean;
}

const timelineStages: TimelineStage[] = [
  {
    name: 'Sampling',
    sleekDays: 5,
    traditionalDays: 14,
    description: 'Sample development and approval',
    loopTraceCheckpoint: true
  },
  {
    name: 'Fabric Sourcing',
    sleekDays: 3,
    traditionalDays: 21,
    description: 'Material procurement and inspection',
    loopTraceCheckpoint: true
  },
  {
    name: 'Production',
    sleekDays: 12,
    traditionalDays: 35,
    description: 'Cutting, sewing, and assembly',
    loopTraceCheckpoint: true
  },
  {
    name: 'Quality Control',
    sleekDays: 2,
    traditionalDays: 7,
    description: 'Inspection and defect checking',
    loopTraceCheckpoint: true
  },
  {
    name: 'Finishing',
    sleekDays: 2,
    traditionalDays: 5,
    description: 'Washing, pressing, and packaging',
    loopTraceCheckpoint: true
  },
  {
    name: 'Shipping',
    sleekDays: 1,
    traditionalDays: 8,
    description: 'Logistics and documentation'
  }
];

interface TimelineComparisonChartProps {
  className?: string;
  showLoopTraceIndicators?: boolean;
}

export const TimelineComparisonChart = ({ 
  className,
  showLoopTraceIndicators = true
}: TimelineComparisonChartProps) => {
  const sleekTotal = timelineStages.reduce((sum, stage) => sum + stage.sleekDays, 0);
  const traditionalTotal = timelineStages.reduce((sum, stage) => sum + stage.traditionalDays, 0);
  const timeSaved = traditionalTotal - sleekTotal;
  const speedImprovement = ((timeSaved / traditionalTotal) * 100).toFixed(0);

  // Calculate cumulative days for timeline visualization
  const getSleekCumulativeDays = (index: number) => {
    return timelineStages.slice(0, index + 1).reduce((sum, stage) => sum + stage.sleekDays, 0);
  };

  const getTraditionalCumulativeDays = (index: number) => {
    return timelineStages.slice(0, index + 1).reduce((sum, stage) => sum + stage.traditionalDays, 0);
  };

  return (
    <Card className={cn('border-2 border-primary/20', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Production Timeline Comparison</CardTitle>
          <Badge className="bg-gradient-to-r from-primary to-purple-600">
            {speedImprovement}% Faster
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Get to market 3x faster • Real-time LoopTrace™ tracking • Transparent process
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Sleek Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-50 border-2 border-green-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-green-600" />
                <h3 className="font-bold text-lg text-green-900">Sleek Apparels</h3>
              </div>
              {showLoopTraceIndicators && (
                <Badge variant="outline" className="text-xs border-green-600 text-green-700">
                  LoopTrace™
                </Badge>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">
                {sleekTotal}
              </div>
              <div className="text-sm text-green-800">Days Total</div>
            </div>

            <div className="mt-4 pt-4 border-t border-green-200 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>10-20 day production window</span>
              </div>
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>Real-time photo updates</span>
              </div>
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>AI delay prediction</span>
              </div>
            </div>
          </motion.div>

          {/* Traditional Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h3 className="font-bold text-lg text-red-900">Traditional Manufacturers</h3>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">
                {traditionalTotal}
              </div>
              <div className="text-sm text-red-800">Days Total</div>
            </div>

            <div className="mt-4 pt-4 border-t border-red-200 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>45-90 day typical timeline</span>
              </div>
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>Limited status updates</span>
              </div>
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>Frequent unexpected delays</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gantt-Style Timeline Visualization */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Stage-by-Stage Breakdown
          </h3>

          <div className="space-y-6">
            {timelineStages.map((stage, index) => {
              const sleekCumulative = getSleekCumulativeDays(index);
              const traditionalCumulative = getTraditionalCumulativeDays(index);
              const maxDays = traditionalTotal;
              const sleekWidth = (stage.sleekDays / maxDays) * 100;
              const traditionalWidth = (stage.traditionalDays / maxDays) * 100;

              return (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{stage.name}</h4>
                      {showLoopTraceIndicators && stage.loopTraceCheckpoint && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          📸 Photo Update
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{stage.description}</span>
                  </div>

                  {/* Sleek Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <span className="w-20">Sleek</span>
                      <div className="flex-1 bg-green-100 rounded-full h-8 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sleekWidth}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                          className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full flex items-center justify-center text-white font-semibold text-xs"
                        >
                          {stage.sleekDays} days
                        </motion.div>
                      </div>
                      <span className="w-24 text-right text-muted-foreground">
                        Day {sleekCumulative}
                      </span>
                    </div>

                    {/* Traditional Bar */}
                    <div className="flex items-center gap-2 text-xs text-red-700">
                      <span className="w-20">Traditional</span>
                      <div className="flex-1 bg-red-100 rounded-full h-8 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${traditionalWidth}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                          className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full flex items-center justify-center text-white font-semibold text-xs"
                        >
                          {stage.traditionalDays} days
                        </motion.div>
                      </div>
                      <span className="w-24 text-right text-muted-foreground">
                        Day {traditionalCumulative}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Time Saved Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-2 border-primary rounded-lg p-6"
        >
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Time Saved</h3>
            </div>
            
            <div className="text-6xl font-bold text-primary">
              {timeSaved} Days
            </div>
            
            <p className="text-lg text-muted-foreground">
              That's <strong>{speedImprovement}% faster</strong> than traditional manufacturing
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <div className="text-2xl font-bold text-green-600">3x</div>
                <div className="text-xs text-muted-foreground">Faster to market</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-xs text-muted-foreground">LoopTrace™ updates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-xs text-muted-foreground">Surprises</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Explanation */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            ⚡ <strong>Speed Advantage:</strong> Our streamlined process and efficient factory network 
            get you to market 3x faster than traditional sourcing.
          </p>
          <p className="text-xs">
            Plus, LoopTrace™ gives you real-time photo updates at every stage, 
            so you always know exactly where your order is.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
