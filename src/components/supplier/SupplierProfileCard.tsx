import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SupplierProfile {
  id: string;
  factoryName: string;
  location: string;
  workerCount: number;
  specializations: string[];
  certifications: string[];
  ordersCompleted: number;
  marginImprovement?: string;
  workerBenefits: string[];
  quote?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  profilePhoto?: string;
  factoryPhoto?: string;
}

interface SupplierProfileCardProps {
  supplier: SupplierProfile;
  showImpactMetrics?: boolean;
  showBeforeAfter?: boolean;
  onViewDetails?: (supplierId: string) => void;
  className?: string;
}

export const SupplierProfileCard = ({
  supplier,
  showImpactMetrics = true,
  showBeforeAfter = true,
  onViewDetails,
  className
}: SupplierProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden border-2 hover:border-primary/50 transition-all', className)}>
        {/* Factory Photo Header */}
        {supplier.factoryPhoto && (
          <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <img
              src={supplier.factoryPhoto}
              alt={`${supplier.factoryName} factory`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-xl mb-1">{supplier.factoryName}</h3>
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{supplier.location}</span>
              </div>
            </div>
          </div>
        )}

        <CardHeader className={!supplier.factoryPhoto ? 'pb-4' : 'pt-4 pb-4'}>
          {!supplier.factoryPhoto && (
            <div>
              <h3 className="text-xl font-bold mb-1">{supplier.factoryName}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{supplier.location}</span>
              </div>
            </div>
          )}
          
          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mt-3">
            {supplier.specializations.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {supplier.specializations.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{supplier.specializations.length - 3} more
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Team Size</span>
              </div>
              <div className="text-lg font-bold text-blue-600">{supplier.workerCount}</div>
              <div className="text-xs text-muted-foreground">Workers</div>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Orders Done</span>
              </div>
              <div className="text-lg font-bold text-green-600">{supplier.ordersCompleted}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>

          {/* Certifications */}
          {supplier.certifications.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Award className="h-4 w-4 text-primary" />
                <span>Certifications</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert) => (
                  <Badge key={cert} className="bg-primary/10 text-primary border-primary/20">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Worker Benefits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Worker Benefits</span>
            </div>
            <div className="space-y-1">
              {supplier.workerBenefits.slice(0, 3).map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          {showImpactMetrics && supplier.marginImprovement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Impact Through Sleek</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {supplier.marginImprovement}
              </div>
              <div className="text-xs text-green-800">
                Margin improvement vs. traditional buyers
              </div>
            </motion.div>
          )}

          {/* Before/After Story */}
          {showBeforeAfter && supplier.beforeAfter && (
            <div className="space-y-3 pt-3 border-t">
              <h4 className="font-semibold text-sm">Transformation Story</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="font-semibold text-red-900 mb-1">Before</div>
                  <p className="text-red-800">{supplier.beforeAfter.before}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="font-semibold text-green-900 mb-1">After</div>
                  <p className="text-green-800">{supplier.beforeAfter.after}</p>
                </div>
              </div>
            </div>
          )}

          {/* Testimonial Quote */}
          {supplier.quote && (
            <div className="bg-slate-50 border-l-4 border-primary rounded p-3">
              <p className="text-sm italic text-muted-foreground">"{supplier.quote}"</p>
            </div>
          )}

          {/* Actions */}
          {onViewDetails && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewDetails(supplier.id)}
            >
              View Full Profile
            </Button>
          )}
        </CardContent>

        {/* Fair Pricing Badge */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 px-4 py-3 text-center border-t">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="font-semibold">
              Your orders support fair wages & ethical manufacturing
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Example usage with sample data
export const SampleSupplierProfiles: SupplierProfile[] = [
  {
    id: 'supplier-001',
    factoryName: 'Dhaka Knitwear Excellence',
    location: 'Dhaka, Bangladesh',
    workerCount: 85,
    specializations: ['Organic Cotton', 'Quick Turnaround', 'Custom Dyeing'],
    certifications: ['WRAP', 'OEKO-TEX', 'GOTS'],
    ordersCompleted: 247,
    marginImprovement: '+30% margin',
    workerBenefits: [
      '25% above minimum wage',
      'Health insurance coverage',
      'Paid overtime & holidays',
      'Skills training programs'
    ],
    quote: 'Working with Sleek Apparels changed our business. Direct relationships mean better margins and the ability to invest in our workers.',
    beforeAfter: {
      before: 'Dependent on middlemen taking 25% commission',
      after: 'Direct buyer relationships, 30% margin improvement'
    }
  },
  {
    id: 'supplier-002',
    factoryName: 'Chittagong Quality Textiles',
    location: 'Chittagong, Bangladesh',
    workerCount: 120,
    specializations: ['Premium Quality', 'Technical Fabrics', 'Athletic Wear'],
    certifications: ['WRAP', 'ISO 9001'],
    ordersCompleted: 189,
    marginImprovement: '+25% margin',
    workerBenefits: [
      'Above industry wages',
      'Healthcare & benefits',
      'Safe working conditions'
    ],
    quote: 'Sleek platform gave us access to quality-focused Western buyers who value our craftsmanship.',
    beforeAfter: {
      before: 'Inconsistent orders, thin margins',
      after: 'Steady workflow, invested in new machinery'
    }
  },
  {
    id: 'supplier-003',
    factoryName: 'Green Threads Manufacturing',
    location: 'Gazipur, Bangladesh',
    workerCount: 65,
    specializations: ['Sustainable Practices', 'Organic Materials', 'Small Batch'],
    certifications: ['GOTS', 'Fair Trade', 'OEKO-TEX'],
    ordersCompleted: 156,
    marginImprovement: '+28% margin',
    workerBenefits: [
      'Fair wages guaranteed',
      'Worker education programs',
      'Family healthcare'
    ],
    quote: 'Small factories like ours were always overlooked. Sleek Apparels gave us a voice and sustainable business.',
    beforeAfter: {
      before: 'Excluded by large buyers requiring 500+ workers',
      after: 'Specialized in sustainable production, growing steadily'
    }
  }
];
