-- Fix remaining overly permissive RLS policies (FINAL - with correct column names)

-- 1. Fix production_stages
DROP POLICY IF EXISTS "Enable read access for all users" ON production_stages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON production_stages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON production_stages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON production_stages;

CREATE POLICY "Order participants view production stages" ON production_stages FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM supplier_orders so JOIN orders o ON so.buyer_order_id = o.id 
WHERE so.id = production_stages.supplier_order_id AND (o.supplier_id = auth.uid() OR o.buyer_id = auth.uid())));

CREATE POLICY "Suppliers manage production stages" ON production_stages FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM supplier_orders so JOIN orders o ON so.buyer_order_id = o.id 
WHERE so.id = production_stages.supplier_order_id AND o.supplier_id = auth.uid()));

-- 2. Fix sample_requests
DROP POLICY IF EXISTS "Enable read access for all users" ON sample_requests;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON sample_requests;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON sample_requests;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON sample_requests;

CREATE POLICY "Order participants view sample requests" ON sample_requests FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = sample_requests.order_id 
AND (orders.buyer_id = auth.uid() OR orders.supplier_id = auth.uid())));

CREATE POLICY "Buyers manage sample requests" ON sample_requests FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = sample_requests.order_id AND orders.buyer_id = auth.uid()));

-- 3. Fix sample_submissions (using sample_request_id)
DROP POLICY IF EXISTS "Enable read access for all users" ON sample_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON sample_submissions;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON sample_submissions;

CREATE POLICY "Order participants view sample submissions" ON sample_submissions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM sample_requests sr JOIN orders o ON sr.order_id = o.id 
WHERE sr.id = sample_submissions.sample_request_id AND (o.buyer_id = auth.uid() OR o.supplier_id = auth.uid())));

CREATE POLICY "Suppliers create sample submissions" ON sample_submissions FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM sample_requests sr JOIN orders o ON sr.order_id = o.id 
WHERE sr.id = sample_submissions.sample_request_id AND o.supplier_id = auth.uid()));

CREATE POLICY "Suppliers update sample submissions" ON sample_submissions FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM sample_requests sr JOIN orders o ON sr.order_id = o.id 
WHERE sr.id = sample_submissions.sample_request_id AND o.supplier_id = auth.uid()));

-- 4. Fix shipping_info
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON shipping_info;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON shipping_info;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON shipping_info;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON shipping_info;

CREATE POLICY "Order participants view shipping" ON shipping_info FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = shipping_info.order_id 
AND (orders.buyer_id = auth.uid() OR orders.supplier_id = auth.uid())));

CREATE POLICY "Buyers manage shipping" ON shipping_info FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = shipping_info.order_id AND orders.buyer_id = auth.uid()));

-- 5. Fix order_documents
DROP POLICY IF EXISTS "Enable read access for all users" ON order_documents;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON order_documents;

CREATE POLICY "Order participants view documents" ON order_documents FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_documents.order_id 
AND (orders.buyer_id = auth.uid() OR orders.supplier_id = auth.uid())));

CREATE POLICY "Order participants upload documents" ON order_documents FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_documents.order_id 
AND (orders.buyer_id = auth.uid() OR orders.supplier_id = auth.uid())) AND uploaded_by = auth.uid());