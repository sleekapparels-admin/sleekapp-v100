-- Enable realtime for messages table
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Create database trigger to auto-generate invoice when order is completed
CREATE OR REPLACE FUNCTION public.trigger_invoice_generation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.workflow_status = 'completed' AND NEW.deposit_paid_at IS NOT NULL 
     AND (OLD.workflow_status IS NULL OR OLD.workflow_status != 'completed') THEN
    
    IF NOT EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE order_id = NEW.id AND payment_type = 'full'
    ) THEN
      PERFORM pg_notify('invoice_generation', json_build_object('order_id', NEW.id)::text);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_generate_invoice_on_completion ON public.orders;
CREATE TRIGGER trigger_generate_invoice_on_completion
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_invoice_generation();

-- Create supplier_payables table
CREATE TABLE IF NOT EXISTS public.supplier_payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  order_id UUID REFERENCES public.orders(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid')),
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.supplier_payables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers can view their own payables"
  ON public.supplier_payables FOR SELECT
  USING (supplier_id IN (SELECT id FROM public.suppliers WHERE user_id = auth.uid()));

CREATE POLICY "Only service role can insert payables"
  ON public.supplier_payables FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all payables"
  ON public.supplier_payables FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_supplier_payables_updated_at
  BEFORE UPDATE ON public.supplier_payables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();