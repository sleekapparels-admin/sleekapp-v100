import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SupplierRecommendation {
  supplier_id: string;
  supplier_name: string;
  rank: number;
  confidence_score: number;
  reasoning: string;
  supplier_details: any;
}

export const useSmartSupplierAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SupplierRecommendation[]>([]);

  const getRecommendations = async (orderId: string, productType: string, quantity: number, requirements?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('ai-supplier-assignment', {
        body: {
          order_id: orderId,
          product_type: productType,
          quantity,
          requirements: requirements || 'Standard quality'
        }
      });

      if (error) throw error;

      console.log('AI recommendations:', data);
      
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        return data.recommendations;
      }

      return [];
    } catch (error: any) {
      console.error('Error getting AI recommendations:', error);
      toast.error(`Failed to get supplier recommendations: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recommendations,
    getRecommendations
  };
};