import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QualityAssessment {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  recommendations: string[];
}

export const useQualityPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<QualityAssessment | null>(null);

  const predictQualityRisks = async (supplierOrderId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('predict-quality-risks', {
        body: { supplier_order_id: supplierOrderId }
      });

      if (error) throw error;

      console.log('Quality risk assessment:', data);
      
      if (data.assessment) {
        setAssessment(data.assessment);
        
        // Show toast for high risks
        if (data.assessment.risk_level === 'high' || data.assessment.risk_level === 'critical') {
          toast.error(`Quality risk detected: ${data.assessment.risk_level}`, {
            description: data.assessment.risk_factors[0]
          });
        }
        
        return data.assessment;
      }

      return null;
    } catch (error: any) {
      console.error('Error predicting quality risks:', error);
      toast.error(`Failed to analyze quality risks: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    assessment,
    predictQualityRisks
  };
};