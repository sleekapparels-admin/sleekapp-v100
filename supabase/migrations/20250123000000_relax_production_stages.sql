-- Migration to relax production stage constraints and seed industry standard stages

-- 1. Alter tables to remove dependency on production_stage enum
ALTER TABLE "orders" ALTER COLUMN "current_stage" TYPE text;
ALTER TABLE "order_updates" ALTER COLUMN "stage" TYPE text;
ALTER TABLE "qc_checks" ALTER COLUMN "stage" TYPE text;

-- 2. Clear existing production_stage_templates
DELETE FROM "production_stage_templates";

-- 3. Insert new Industry Standard stages
-- Assuming 'Apparel' as the default product_category
INSERT INTO "production_stage_templates" (product_category, stage_name, stage_number, estimated_days, description) VALUES
('Apparel', 'Order Confirmation', 1, 2, 'Initial order review and confirmation'),
('Apparel', 'Fabric & Trim Sourcing', 2, 10, 'Sourcing of all necessary materials'),
('Apparel', 'Pattern & Grading', 3, 5, 'Creating patterns and grading sizes'),
('Apparel', 'Cutting', 4, 3, 'Cutting fabric according to patterns'),
('Apparel', 'Printing / Embroidery', 5, 5, 'Applying prints or embroidery if applicable'),
('Apparel', 'Sewing & Assembly', 6, 14, 'Main production phase'),
('Apparel', 'Washing & Finishing', 7, 3, 'Washing, ironing, and finishing touches'),
('Apparel', 'Quality Control (Internal)', 8, 2, 'Factory internal quality inspection'),
('Apparel', 'Final Inspection', 9, 2, 'Third-party or final quality check'),
('Apparel', 'Packaging', 10, 2, 'Packing items for shipment'),
('Apparel', 'Logistics & Shipment', 11, 7, 'Shipping to the destination');

-- 4. Reset existing orders to 'Order Confirmation' to avoid stage mismatch (Optional but recommended by user)
UPDATE "orders"
SET "current_stage" = 'Order Confirmation'
WHERE "current_stage" NOT IN (
    'Order Confirmation',
    'Fabric & Trim Sourcing',
    'Pattern & Grading',
    'Cutting',
    'Printing / Embroidery',
    'Sewing & Assembly',
    'Washing & Finishing',
    'Quality Control (Internal)',
    'Final Inspection',
    'Packaging',
    'Logistics & Shipment'
);
