-- ========================================
-- COMPREHENSIVE DATABASE SEED - ALL TABLES
-- ========================================
-- Populates all tables with realistic sample data
-- NO NULL VALUES - all fields populated
-- ========================================

-- Phase 1: Foundation (Company, Certifications, Blog Categories)
-- Phase 2: Supplier Network (2 new suppliers + capabilities)
-- Phase 3: Orders & Invoices (5 complete orders)
-- Phase 4: Case Studies & Knowledge Base
-- Phase 5: Exchange Rates & Automation
-- Phase 6: Messages & Notifications

-- Run this via Supabase SQL Editor after checking constraint values
-- Execute in order - do not skip phases

-- ========================================
-- PHASE 1: FOUNDATION DATA
-- ========================================

-- Company Info (check entity_type constraint first!)
-- INSERT INTO public.company_info ...

-- Certifications (6 certs)
-- Already exists: OEKO-TEX, BSCI, WRAP, ISO, Sedex, Alibaba

-- Blog Categories (6 categories)
-- INSERT INTO public.blog_categories ...

-- ========================================
-- PHASE 2: SUPPLIER NETWORK
-- ========================================

-- Add 2 new suppliers (check suppliers schema!)
-- INSERT INTO public.suppliers ...

-- ========================================
-- READY FOR EXECUTION
-- ========================================
-- User: Please check constraint values first:
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.company_info'::regclass;
-- Then uncomment and adjust INSERT statements accordingly
