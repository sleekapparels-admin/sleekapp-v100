import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { hoverLift, counterAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

const colorClasses = {
  primary: 'bg-blue-500/10 text-blue-600',
  accent: 'bg-orange-500/10 text-orange-600',
  success: 'bg-green-500/10 text-green-600',
  warning: 'bg-amber-500/10 text-amber-600',
  error: 'bg-red-500/10 text-red-600',
};

const trendClasses = {
  up: 'text-green-600 bg-green-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-gray-600 bg-gray-50',
};

export const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  color = 'primary',
  onClick,
}: StatCardProps) => {
  return (
    <motion.div
      {...hoverLift}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={cn(
          "p-6 cursor-pointer transition-all",
          "hover:border-primary/50",
          onClick && "hover:shadow-lg"
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <motion.div
              key={value}
              {...counterAnimation}
              className="text-3xl font-bold text-foreground mb-2"
            >
              {value}
            </motion.div>
            
            {change && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  trendClasses[trend]
                )}
              >
                <span className="font-semibold">
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trend === 'neutral' && '→'}
                  {' '}
                  {Math.abs(change.value)}%
                </span>
                <span className="text-muted-foreground">
                  {change.label}
                </span>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className={cn(
              "p-3 rounded-xl",
              colorClasses[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
