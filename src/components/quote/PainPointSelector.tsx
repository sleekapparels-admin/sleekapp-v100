import { motion } from 'framer-motion';
import { DollarSign, Clock, Shield, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PainPoint {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  impact: 'high' | 'medium';
}

const painPoints: PainPoint[] = [
  {
    id: 'high-moq',
    icon: DollarSign,
    title: 'High Minimums & Capital Risk',
    description: 'Traditional 1,000+ piece minimums require $15K-$50K upfront investment for untested products',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
    impact: 'high'
  },
  {
    id: 'long-timelines',
    icon: Clock,
    title: 'Long Production Times',
    description: '45-90 day lead times causing you to miss market trends and seasonal opportunities',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    impact: 'high'
  },
  {
    id: 'trust-quality',
    icon: Shield,
    title: 'Trust & Quality Concerns',
    description: 'Worried about factory reliability, quality issues, or losing money on unresponsive suppliers',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    impact: 'high'
  },
  {
    id: 'lack-knowledge',
    icon: BookOpen,
    title: "I'm New to Manufacturing",
    description: "Don't understand tech packs, fabric types, AQL standards, or manufacturing terminology",
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    impact: 'medium'
  },
  {
    id: 'sustainability',
    icon: TrendingUp,
    title: 'Ethical & Sustainable Production',
    description: 'Need verified ethical manufacturing, fair wages, and transparency in the supply chain',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
    impact: 'medium'
  }
];

interface PainPointSelectorProps {
  onSelect: (painPointId: string) => void;
  selectedPainPoints?: string[];
  multiSelect?: boolean;
  className?: string;
}

export const PainPointSelector = ({ 
  onSelect, 
  selectedPainPoints = [], 
  multiSelect = false,
  className 
}: PainPointSelectorProps) => {
  const isSelected = (id: string) => selectedPainPoints.includes(id);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center space-y-3">
        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
          Tell Us Your Biggest Challenge
        </Badge>
        <h2 className="text-3xl font-bold">What's Your Main Concern?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We've helped hundreds of buyers overcome these challenges. 
          {multiSelect ? ' Select all that apply.' : ' Choose your primary concern.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {painPoints.map((painPoint, index) => (
          <motion.div
            key={painPoint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all duration-300 border-2',
                painPoint.bgColor,
                isSelected(painPoint.id) 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md',
                painPoint.impact === 'high' && 'relative'
              )}
              onClick={() => handleSelect(painPoint.id)}
            >
              {painPoint.impact === 'high' && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="destructive" className="text-xs">
                    Most Common
                  </Badge>
                </div>
              )}
              
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={cn(
                    'p-4 rounded-full bg-white shadow-sm',
                    isSelected(painPoint.id) && 'ring-2 ring-primary'
                  )}>
                    <painPoint.icon className={cn('h-8 w-8', painPoint.color)} />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {painPoint.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {painPoint.description}
                    </p>
                  </div>

                  {isSelected(painPoint.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <Badge className="bg-primary">
                        ✓ Selected
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          💡 <strong>Did you know?</strong> Sleek Apparels was specifically designed to solve these exact pain points for small-batch buyers.
        </p>
      </div>
    </div>
  );
};
