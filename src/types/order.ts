/**
 * Type definitions for order-related data
 */

export interface OrderData {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  updated_at?: string;
  estimated_delivery?: string;
  quantity?: number;
  product_type?: string;
  notes?: string;
  [key: string]: any;
}

export interface OrderUpdate {
  id: string;
  order_id: string;
  stage: string;
  status: string;
  message: string;
  created_at: string;
  photo_url?: string;
  video_url?: string;
  [key: string]: any;
}

export interface QualityCheck {
  id: string;
  order_id: string;
  check_type: string;
  result: 'pass' | 'fail' | 'pending';
  notes?: string;
  checked_by?: string;
  checked_at: string;
  [key: string]: any;
}

export interface AIInsights {
  deliveryPrediction: string;
  qualityForecast: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}
