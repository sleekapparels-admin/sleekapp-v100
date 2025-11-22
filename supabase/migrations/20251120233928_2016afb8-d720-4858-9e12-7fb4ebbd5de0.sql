-- Phase 5: Database Schema Extensions for Enhanced Dashboards

-- Quote Approval Workflow
CREATE TABLE IF NOT EXISTS public.quote_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.ai_quotes(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'adjusted', 'rejected')),
  adjusted_price NUMERIC,
  adjusted_delivery_days INTEGER,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Orders for Supplier-Admin Communication
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id),
  work_order_number TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'accepted', 'rejected', 'in_progress', 'completed')),
  rejection_reason TEXT,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages for Communication Centers
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subject TEXT,
  message TEXT NOT NULL,
  attachments TEXT[],
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS Content Management
CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- 'hero', 'banner', 'testimonial', 'certification', 'blog_post'
  content_type TEXT NOT NULL, -- 'text', 'image', 'video', 'html'
  content JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment History for Financial Management
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'balance', 'full', 'supplier_payment')),
  payment_method TEXT, -- 'stripe', 'bank_transfer', 'check'
  transaction_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_by UUID REFERENCES auth.users(id),
  paid_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier Payables Tracking
CREATE TABLE IF NOT EXISTS public.supplier_payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  amount_due NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  due_date DATE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'partial', 'paid', 'overdue')),
  payment_terms TEXT, -- '50% advance, 50% on delivery'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Stage Templates (flexible for different product types)
CREATE TABLE IF NOT EXISTS public.production_stage_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_category TEXT NOT NULL, -- 'knitwear', 'casualwear', 'activewear', 'uniforms'
  stage_name TEXT NOT NULL,
  stage_number INTEGER NOT NULL,
  description TEXT,
  estimated_days INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Rules Engine
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('order_assignment', 'email_trigger', 'invoice_generation', 'notification')),
  conditions JSONB NOT NULL, -- { "product_type": "T-shirt", "quantity_less_than": 500 }
  actions JSONB NOT NULL, -- { "assign_to_supplier": "supplier_id", "send_email": true }
  active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Preferences (already exists, but adding to tracking)
-- Admin Activity Audit Log (enhanced)
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'order_assigned', 'quote_approved', 'invoice_generated', 'supplier_verified'
  entity_type TEXT NOT NULL, -- 'order', 'quote', 'supplier', 'invoice'
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.quote_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_stage_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Quote Approvals
CREATE POLICY "Admins can manage quote approvals" ON public.quote_approvals
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can view approvals for their quotes" ON public.quote_approvals
  FOR SELECT USING (
    quote_id IN (
      SELECT id FROM public.ai_quotes WHERE customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- RLS Policies for Work Orders
CREATE POLICY "Admins can manage work orders" ON public.work_orders
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Suppliers can view and update their work orders" ON public.work_orders
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
  );

CREATE POLICY "Suppliers can update their work orders" ON public.work_orders
  FOR UPDATE USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
  );

-- RLS Policies for Messages
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages" ON public.messages
  FOR UPDATE USING (recipient_id = auth.uid());

-- RLS Policies for CMS Content
CREATE POLICY "Admins can manage CMS content" ON public.cms_content
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Anyone can view active CMS content" ON public.cms_content
  FOR SELECT USING (active = true);

-- RLS Policies for Payment History
CREATE POLICY "Admins can view all payments" ON public.payment_history
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can view their own payments" ON public.payment_history
  FOR SELECT USING (paid_by = auth.uid() OR paid_to = auth.uid());

CREATE POLICY "System can create payments" ON public.payment_history
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Supplier Payables
CREATE POLICY "Admins can manage supplier payables" ON public.supplier_payables
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Suppliers can view their payables" ON public.supplier_payables
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid())
  );

-- RLS Policies for Production Stage Templates
CREATE POLICY "Anyone can view active stage templates" ON public.production_stage_templates
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage stage templates" ON public.production_stage_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- RLS Policies for Automation Rules
CREATE POLICY "Admins can manage automation rules" ON public.automation_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- RLS Policies for Admin Actions
CREATE POLICY "Admins can view admin actions" ON public.admin_actions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "System can log admin actions" ON public.admin_actions
  FOR INSERT WITH CHECK (true);

-- Insert default production stage templates
INSERT INTO public.production_stage_templates (product_category, stage_name, stage_number, description, estimated_days) VALUES
  -- Knitwear stages
  ('knitwear', 'Yarn Received', 1, 'Yarn materials received and inspected', 2),
  ('knitwear', 'Knitting', 2, 'Knitting fabric on machines', 5),
  ('knitwear', 'Linking', 3, 'Linking knitted pieces together', 3),
  ('knitwear', 'Washing & Finishing', 4, 'Washing and finishing treatment', 2),
  ('knitwear', 'Final QC', 5, 'Quality control inspection', 1),
  ('knitwear', 'Packing', 6, 'Packaging for shipment', 1),
  ('knitwear', 'Ready to Ship', 7, 'Ready for pickup/delivery', 1),
  
  -- Casualwear stages (T-shirts, Hoodies, etc.)
  ('casualwear', 'Fabric Received', 1, 'Fabric materials received and inspected', 2),
  ('casualwear', 'Cutting', 2, 'Cutting fabric according to patterns', 2),
  ('casualwear', 'Sewing', 3, 'Sewing garment pieces together', 5),
  ('casualwear', 'Finishing', 4, 'Trimming, cleaning, and finishing touches', 2),
  ('casualwear', 'Ironing & Pressing', 5, 'Ironing and pressing garments', 1),
  ('casualwear', 'Final QC', 6, 'Quality control inspection', 1),
  ('casualwear', 'Packing', 7, 'Packaging for shipment', 1),
  ('casualwear', 'Ready to Ship', 8, 'Ready for pickup/delivery', 1),
  
  -- Activewear stages
  ('activewear', 'Fabric Received', 1, 'Technical fabric materials received', 2),
  ('activewear', 'Cutting', 2, 'Precision cutting for activewear', 2),
  ('activewear', 'Sewing', 3, 'Sewing with flatlock/coverstitch', 6),
  ('activewear', 'Heat Transfer/Printing', 4, 'Applying logos and designs', 2),
  ('activewear', 'Finishing', 5, 'Quality finishing and inspection', 2),
  ('activewear', 'Final QC', 6, 'Performance testing and QC', 1),
  ('activewear', 'Packing', 7, 'Packaging for shipment', 1),
  ('activewear', 'Ready to Ship', 8, 'Ready for pickup/delivery', 1),
  
  -- Uniforms stages
  ('uniforms', 'Fabric Received', 1, 'Uniform fabric materials received', 2),
  ('uniforms', 'Cutting', 2, 'Cutting uniform pieces', 2),
  ('uniforms', 'Embroidery/Printing', 3, 'Adding logos and branding', 3),
  ('uniforms', 'Sewing', 4, 'Sewing uniform pieces', 5),
  ('uniforms', 'Finishing', 5, 'Button attachment, finishing', 2),
  ('uniforms', 'Final QC', 6, 'Uniform compliance inspection', 1),
  ('uniforms', 'Packing', 7, 'Packaging with labeling', 1),
  ('uniforms', 'Ready to Ship', 8, 'Ready for delivery', 1);

-- Create indexes for better performance
CREATE INDEX idx_quote_approvals_quote_id ON public.quote_approvals(quote_id);
CREATE INDEX idx_quote_approvals_status ON public.quote_approvals(status);
CREATE INDEX idx_work_orders_order_id ON public.work_orders(order_id);
CREATE INDEX idx_work_orders_supplier_id ON public.work_orders(supplier_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_order_id ON public.messages(order_id);
CREATE INDEX idx_messages_read ON public.messages(read);
CREATE INDEX idx_cms_content_section ON public.cms_content(section);
CREATE INDEX idx_cms_content_active ON public.cms_content(active);
CREATE INDEX idx_payment_history_order_id ON public.payment_history(order_id);
CREATE INDEX idx_payment_history_status ON public.payment_history(status);
CREATE INDEX idx_supplier_payables_supplier_id ON public.supplier_payables(supplier_id);
CREATE INDEX idx_supplier_payables_status ON public.supplier_payables(status);
CREATE INDEX idx_production_stage_templates_category ON public.production_stage_templates(product_category);
CREATE INDEX idx_automation_rules_active ON public.automation_rules(active);
CREATE INDEX idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX idx_admin_actions_entity_type ON public.admin_actions(entity_type);

-- Trigger to update updated_at on work_orders
CREATE OR REPLACE FUNCTION public.update_work_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_work_orders_updated_at
  BEFORE UPDATE ON public.work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_work_orders_updated_at();

-- Trigger to update updated_at on cms_content
CREATE OR REPLACE FUNCTION public.update_cms_content_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_cms_content_updated_at
  BEFORE UPDATE ON public.cms_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cms_content_updated_at();

-- Function to generate work order number
CREATE OR REPLACE FUNCTION public.generate_work_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  wo_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(work_order_number FROM 8) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.work_orders
  WHERE work_order_number LIKE 'WO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%';
  
  wo_number := 'WO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN wo_number;
END;
$$;