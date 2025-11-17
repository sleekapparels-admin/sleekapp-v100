/**
 * Database type definitions for type-safe Supabase operations
 */

// Enums
export type AppRole = 'admin' | 'buyer' | 'supplier' | 'factory';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type OrderWorkflowStatus = 
  | 'quote_requested'
  | 'quote_provided'
  | 'quote_accepted'
  | 'assigned_to_supplier'
  | 'in_production'
  | 'quality_check'
  | 'shipped'
  | 'delivered'
  | 'completed';

export type ProductionStage = 
  | 'yarn_received'
  | 'knitting'
  | 'linking'
  | 'washing_finishing'
  | 'final_qc'
  | 'packing'
  | 'ready_to_ship';

export type BatchStatus = 'filling' | 'confirmed' | 'in_production' | 'completed' | 'cancelled';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

// Table Interfaces
export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any>;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface AIQuote {
  id: string;
  session_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  phone_number: string | null;
  country: string | null;
  product_type: string;
  quantity: number;
  fabric_type: string | null;
  complexity_level: string | null;
  additional_requirements: string | null;
  quote_data: Record<string, any>;
  total_price: number;
  estimated_delivery_days: number;
  ai_suggestions: string | null;
  status: string;
  lead_status: LeadStatus;
  lead_notes: string | null;
  production_route: string | null;
  specialty_sourcing_required: boolean;
  bangladesh_cost: number | null;
  specialty_cost: number | null;
  admin_markup: number | null;
  alternative_options: Record<string, any> | null;
  converted_to_order_id: string | null;
  created_at: string;
}

export interface AIUsageLog {
  id: string;
  user_id: string | null;
  session_id: string | null;
  function_name: string;
  request_data: Record<string, any> | null;
  estimated_cost: number | null;
  created_at: string;
}

export interface BatchContribution {
  id: string;
  batch_id: string;
  order_id: string;
  quantity: number;
  style_details: Record<string, any>;
  buyer_price_per_unit: number;
  contribution_margin: number | null;
  committed_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  user_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  thumbnail_url: string | null;
  category: string;
  tags: any[];
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  views_count: number;
  shares_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  seo_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CapacityUtilizationLog {
  id: string;
  supplier_id: string;
  date: string;
  utilization_percentage: number;
  orders_count: number;
  revenue_generated: number;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  industry: string;
  product_type: string;
  quantity: number;
  challenge: string;
  solution: string;
  results: string;
  testimonial: string;
  testimonial_author: string;
  hero_image_url: string | null;
  process_images: any[];
  metrics: Record<string, any>;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color_class: string;
  bg_color_class: string;
  status: string;
  issuing_body: string | null;
  certificate_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  certificate_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface CompanyInfo {
  id: string;
  entity_type: string;
  legal_name: string;
  registration_number: string | null;
  tax_id: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface ConversationAnalytics {
  id: string;
  date: string;
  total_conversations: number;
  buyer_conversations: number;
  supplier_conversations: number;
  completed_conversations: number;
  quotes_generated: number;
  avg_messages_per_conversation: number | null;
  common_questions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConversationContext {
  id: string;
  session_id: string;
  user_id: string | null;
  intent: string | null;
  stage: string;
  status: string;
  email: string | null;
  phone: string | null;
  extracted_data: Record<string, any>;
  lead_score: number;
  style_preference: string | null;
  budget_range: string | null;
  timeline_urgency: string | null;
  target_market: string | null;
  decision_stage: string | null;
  design_readiness: string | null;
  conversation_path: string | null;
  transcript: any[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  audio_url: string | null;
  sentiment: string | null;
  topics: string[] | null;
  quick_replies: any | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Defect {
  id: string;
  qc_check_id: string;
  defect_type: string;
  severity: string;
  quantity: number;
  description: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface EmailVerificationOTP {
  id: string;
  email: string;
  otp: string;
  session_id: string | null;
  expires_at: string;
  verified: boolean;
  attempt_count: number;
  ip_address: string | null;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  fetched_at: string;
  valid_until: string;
  created_at: string;
}

export interface FactoryCapacity {
  id: string;
  supplier_id: string;
  date: string;
  total_capacity: number;
  current_utilization: number;
  available_capacity: number | null;
  workers_count: number;
  machines_count: number;
  shift_hours: number;
  created_at: string;
  updated_at: string;
}

export interface IndustryKnowledge {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  content: string;
  metadata: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  order_id: string | null;
  invoice_number: string;
  amount: number;
  due_date: string | null;
  status: string;
  payment_type: string;
  stripe_invoice_id: string | null;
  stripe_payment_intent_id: string | null;
  pdf_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_orders: boolean;
  email_messages: boolean;
  email_production: boolean;
  email_payments: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: string;
  notification_type: string | null;
  title: string;
  message: string;
  action_url: string | null;
  link: string | null;
  metadata: Record<string, any> | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface OrderDocument {
  id: string;
  order_id: string;
  document_type: string;
  uploaded_by: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  created_at: string;
  file_type: string;
}

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  translated_message: string | null;
  attachments: string[] | null;
  read_by: string[] | null;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string | null;
  old_status: any | null;
  new_status: any;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderUpdate {
  id: string;
  order_id: string;
  stage: any;
  message: string | null;
  photos: string[] | null;
  completion_percentage: number;
  created_by: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string | null;
  factory_id: string | null;
  quote_id: string | null;
  product_type: string;
  quantity: number;
  buyer_price: number | null;
  supplier_price: number | null;
  admin_margin: number | null;
  margin_percentage: number | null;
  status: string;
  payment_status: PaymentStatus;
  workflow_status: OrderWorkflowStatus;
  production_status: string;
  current_stage: ProductionStage;
  stage_progress: Record<string, number>;
  milestone_tracker: Record<string, any>;
  target_date: string | null;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  deposit_amount: number | null;
  balance_amount: number | null;
  deposit_paid_at: string | null;
  balance_paid_at: string | null;
  assigned_by: string | null;
  assigned_at: string | null;
  tracking_token: string | null;
  display_publicly: boolean;
  is_demo_order: boolean;
  anonymized_client_name: string | null;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionBatch {
  id: string;
  product_category: string;
  product_variant_base: string;
  target_quantity: number;
  current_quantity: number;
  current_style_count: number;
  max_styles: number;
  supplier_id: string;
  batch_status: BatchStatus;
  unit_price_base: number;
  complexity_multiplier: number;
  estimated_start_date: string;
  actual_start_date: string | null;
  window_closes_at: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface QCCheck {
  id: string;
  order_id: string;
  stage: ProductionStage;
  inspector_id: string;
  inspection_date: string;
  pass_fail: string;
  aql_level: string | null;
  sample_size: number | null;
  defects_found: number;
  notes: string | null;
  photos: string[] | null;
  created_at: string;
}

export interface SampleRequest {
  id: string;
  order_id: string;
  sample_type: string;
  requested_by: string;
  approved_by: string | null;
  status: string;
  notes: string | null;
  specifications: Record<string, any>;
  tracking_number: string | null;
  shipped_at: string | null;
  received_at: string | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  user_id: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  specialties: string[] | null;
  certifications: string[] | null;
  verification_status: VerificationStatus;
  rating: number | null;
  total_orders: number;
  on_time_delivery_rate: number | null;
  quality_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierCapability {
  id: string;
  supplier_id: string;
  product_category: string;
  min_order_quantity: number;
  max_order_quantity: number;
  lead_time_days: number;
  unit_price_range_min: number;
  unit_price_range_max: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierOrder {
  id: string;
  order_number: string;
  supplier_id: string;
  buyer_order_id: string;
  product_type: string;
  quantity: number;
  supplier_price: number;
  status: string;
  target_date: string | null;
  special_instructions: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// Helper types for inserts and updates
export type InsertData<T> = Partial<Omit<T, 'id'>> & {
  id?: string;
};

export type UpdateData<T> = Partial<Omit<T, 'id' | 'created_at'>>;

// Query result types with relations
export interface OrderWithRelations extends Order {
  supplier?: Supplier;
  order_documents?: OrderDocument[];
  order_messages?: OrderMessage[];
  order_updates?: OrderUpdate[];
}

export interface ProductionBatchWithContributions extends ProductionBatch {
  batch_contributions?: BatchContribution[];
}

export interface BlogPostWithCategory extends BlogPost {
  blog_categories?: BlogCategory;
}
