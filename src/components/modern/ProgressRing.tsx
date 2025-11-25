import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

const colorClasses = {
  primary: 'stroke-blue-500',
  accent: 'stroke-orange-500',
  success: 'stroke-green-500',
  warning: 'stroke-amber-500',
  error: 'stroke-red-500',
};

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label,
  className,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className={cn(colorClasses[color])}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-2xl font-bold text-foreground"
          >
            {Math.round(progress)}%
          </motion.span>
        )}
        {label && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground text-center px-2"
          >
            {label}
          </motion.span>
        )}
      </div>
    </div>
  );
};
