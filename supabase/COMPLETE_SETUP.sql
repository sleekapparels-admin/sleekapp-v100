-- ============================================================================
-- SLEEK APPARELS - COMPLETE DATABASE SETUP SCRIPT
-- ============================================================================
-- This script combines ALL migrations in chronological order
-- Run this ONCE in Supabase SQL Editor to set up the entire database
-- ============================================================================

-- Step 1: Set up session parameters
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================================
-- MIGRATION 1: Base Schema (remix_migration_from_pg_dump)
-- ============================================================================
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'retailer',
    'wholesaler',
    'educational',
    'corporate',
    'sports_team',
    'factory',
    'admin',
    'supplier'
);


--
-- Name: order_workflow_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_workflow_status AS ENUM (
    'quote_requested',
    'quote_sent',
    'admin_review',
    'awaiting_payment',
    'payment_received',
    'assigned_to_supplier',
    'sample_requested',
    'sample_submitted',
    'sample_approved',
    'bulk_production',
    'qc_inspection',
    'ready_to_ship',
    'shipped',
    'delivered',
    'completed',
    'cancelled',
    'on_hold'
);


--
-- Name: production_stage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.production_stage AS ENUM (
    'yarn_received',
    'knitting',
    'linking',
    'washing_finishing',
    'final_qc',
    'packing',
    'ready_to_ship'
);


--
-- Name: supplier_tier; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.supplier_tier AS ENUM (
    'bronze',
    'silver',
    'gold'
);


--
-- Name: verification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'verified',
    'rejected',
    'suspended'
);


--
-- Name: assign_admin_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_admin_role(target_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only existing admins can assign admin role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can assign admin role';
  END IF;
  
  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;


--
-- Name: assign_user_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_user_role(target_user_id uuid, target_role public.app_role) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only admins can assign roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can assign roles';
  END IF;
  
  -- Prevent assigning admin role through this function (use assign_admin_role instead)
  IF target_role = 'admin' THEN
    RAISE EXCEPTION 'Use assign_admin_role() function to assign admin role';
  END IF;
  
  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;


--
-- Name: calculate_factory_match_score(uuid, integer, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_factory_match_score(p_supplier_id uuid, p_quantity integer, p_target_date date) RETURNS numeric
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_score NUMERIC := 0;
  v_capacity_score NUMERIC := 0;
  v_quality_score NUMERIC := 0;
  v_speed_score NUMERIC := 0;
  v_available INTEGER;
  v_total INTEGER;
BEGIN
  -- Get factory capacity
  SELECT available_capacity, total_capacity
  INTO v_available, v_total
  FROM public.factory_capacity
  WHERE supplier_id = p_supplier_id
  AND date = COALESCE(p_target_date, CURRENT_DATE);
  
  -- If no capacity data, use default
  IF v_total IS NULL OR v_total = 0 THEN
    v_total := 1000;
    v_available := 500;
  END IF;
  
  -- Capacity score (higher available % = higher score)
  v_capacity_score := (v_available::NUMERIC / NULLIF(v_total, 0)) * 100;
  
  -- Quality score (performance_score from suppliers table)
  SELECT performance_score INTO v_quality_score
  FROM public.suppliers
  WHERE id = p_supplier_id;
  
  v_quality_score := COALESCE(v_quality_score, 50);
  
  -- Speed score (inverse of lead_time_days)
  SELECT (1.0 / NULLIF(lead_time_days, 0)) * 100 INTO v_speed_score
  FROM public.suppliers
  WHERE id = p_supplier_id;
  
  v_speed_score := COALESCE(v_speed_score, 50);
  
  -- Final score: weighted average
  v_score := (v_capacity_score * 0.5) + (v_quality_score * 0.3) + (v_speed_score * 0.2);
  
  RETURN ROUND(v_score, 2);
END;
$$;


--
-- Name: check_otp_rate_limit(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_otp_rate_limit(p_identifier text, p_identifier_type text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt_count INTEGER;
  v_time_window INTERVAL := '1 hour';
  v_max_attempts INTEGER := 3;
BEGIN
  -- Count attempts in the last hour
  SELECT COUNT(*)
  INTO v_attempt_count
  FROM public.otp_verification_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND attempt_time > (now() - v_time_window);
  
  -- Return rate limit info
  RETURN jsonb_build_object(
    'allowed', v_attempt_count < v_max_attempts,
    'attempts_used', v_attempt_count,
    'max_attempts', v_max_attempts,
    'attempts_remaining', GREATEST(0, v_max_attempts - v_attempt_count)
  );
END;
$$;


--
-- Name: create_update_notification(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_update_notification() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Notify the buyer
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT 
    orders.buyer_id,
    'Production Update: Order #' || orders.order_number,
    'New update at stage: ' || NEW.stage,
    'order_update',
    '/orders/' || NEW.order_id
  FROM public.orders
  WHERE orders.id = NEW.order_id;
  
  RETURN NEW;
END;
$$;


--
-- Name: generate_invoice_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_invoice_number() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the count of existing invoices + 1
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 9) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%';
  
  -- Format: INV-YYYY-XXXX
  invoice_num := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Insert profile data
  INSERT INTO public.profiles (id, full_name, company_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone'
  );
  
  -- SECURITY FIX: Always default to 'retailer', ignore client-supplied role
  -- Admin roles must be assigned through secure admin-only function
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'retailer'::public.app_role);
  
  RETURN new;
END;
$$;


--
-- Name: handle_new_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_role() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Extract role from signup metadata and insert into user_roles
  IF NEW.raw_user_meta_data ? 'role' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: has_any_role(uuid, public.app_role[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_any_role(_user_id uuid, _roles public.app_role[]) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = ANY(_roles)
  )
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: increment_blog_post_shares(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_blog_post_shares(post_id_param uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.blog_posts
  SET shares_count = shares_count + 1
  WHERE id = post_id_param;
END;
$$;


--
-- Name: increment_blog_post_views(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_blog_post_views(post_id_param uuid) RETURNS void
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE id = post_id_param;
END;
$$;


--
-- Name: link_quote_requests_to_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.link_quote_requests_to_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Link any quote requests with matching email to the new user
  UPDATE public.quote_requests
  SET user_id = NEW.id
  WHERE email = NEW.email AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;


--
-- Name: log_admin_action(text, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_admin_action(p_action text, p_resource_type text, p_resource_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    details,
    created_at
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    now()
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;


--
-- Name: log_otp_attempt(text, text, boolean, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_otp_attempt(p_identifier text, p_identifier_type text, p_success boolean, p_ip_address text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt_id UUID;
BEGIN
  INSERT INTO public.otp_verification_attempts (
    identifier,
    identifier_type,
    success,
    ip_address
  ) VALUES (
    p_identifier,
    p_identifier_type,
    p_success,
    p_ip_address
  )
  RETURNING id INTO v_attempt_id;
  
  RETURN v_attempt_id;
END;
$$;


--
-- Name: remove_user_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_user_role(target_user_id uuid, target_role public.app_role) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only admins can remove roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can remove roles';
  END IF;
  
  -- Delete the role
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = target_role;
END;
$$;


--
-- Name: update_blog_post_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_blog_post_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_factory_capacity_on_order(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_factory_capacity_on_order() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- When a supplier order is created, update capacity utilization
  IF TG_OP = 'INSERT' AND NEW.supplier_id IS NOT NULL THEN
    INSERT INTO public.factory_capacity (supplier_id, date, current_utilization)
    VALUES (NEW.supplier_id, COALESCE(NEW.target_date, CURRENT_DATE), NEW.quantity)
    ON CONFLICT (supplier_id, date)
    DO UPDATE SET 
      current_utilization = factory_capacity.current_utilization + NEW.quantity,
      updated_at = now();
  END IF;
  
  -- When status changes to completed, log it
  IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
    INSERT INTO public.capacity_utilization_logs (supplier_id, date, utilization_percentage, orders_count, revenue_generated)
    SELECT 
      NEW.supplier_id,
      CURRENT_DATE,
      (fc.current_utilization::NUMERIC / NULLIF(fc.total_capacity, 0)) * 100,
      1,
      NEW.supplier_price
    FROM public.factory_capacity fc
    WHERE fc.supplier_id = NEW.supplier_id 
    AND fc.date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_invoice_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_invoice_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_order_status(uuid, public.order_workflow_status, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_order_status(p_order_id uuid, p_new_status public.order_workflow_status, p_notes text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_old_status order_workflow_status;
BEGIN
  -- Get current status
  SELECT workflow_status INTO v_old_status
  FROM orders WHERE id = p_order_id;
  
  -- Update order status
  UPDATE orders
  SET workflow_status = p_new_status,
      updated_at = now()
  WHERE id = p_order_id;
  
  -- Log status change
  INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, notes)
  VALUES (p_order_id, v_old_status, p_new_status, auth.uid(), p_notes);
END;
$$;


--
-- Name: update_production_batches_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_production_batches_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_production_stage_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_production_stage_status() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set started_at when first update
  IF OLD.completion_percentage = 0 AND NEW.completion_percentage > 0 AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
    NEW.status = 'in_progress';
  END IF;
  
  -- Auto-set completed_at when 100%
  IF NEW.completion_percentage = 100 AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_supplier_orders_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_supplier_orders_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_supplier_performance_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_supplier_performance_metrics() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_supplier_id UUID;
  v_total_orders INTEGER;
  v_on_time_count INTEGER;
  v_avg_quality NUMERIC;
  v_avg_communication NUMERIC;
BEGIN
  -- Get supplier_id from the order
  SELECT supplier_id INTO v_supplier_id
  FROM public.supplier_orders
  WHERE id = NEW.supplier_order_id;
  
  -- Calculate metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE on_time = true),
    AVG(quality_score),
    AVG(communication_score)
  INTO v_total_orders, v_on_time_count, v_avg_quality, v_avg_communication
  FROM public.supplier_performance
  WHERE supplier_id = v_supplier_id;
  
  -- Update supplier table
  UPDATE public.suppliers
  SET 
    total_orders_completed = v_total_orders,
    on_time_delivery_rate = CASE WHEN v_total_orders > 0 THEN (v_on_time_count::NUMERIC / v_total_orders) * 100 ELSE 0 END,
    performance_score = (v_avg_quality + v_avg_communication) * 10
  WHERE id = v_supplier_id;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_quote_rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_quote_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    identifier_type text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT ai_quote_rate_limits_identifier_type_check CHECK ((identifier_type = ANY (ARRAY['session'::text, 'user'::text, 'ip'::text])))
);


--
-- Name: ai_quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_email text,
    customer_name text,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    complexity_level text,
    fabric_type text,
    additional_requirements text,
    quote_data jsonb NOT NULL,
    total_price numeric(10,2) NOT NULL,
    estimated_delivery_days integer NOT NULL,
    ai_suggestions text,
    alternative_options jsonb,
    status text DEFAULT 'draft'::text,
    converted_to_order_id uuid,
    session_id text,
    phone_number text,
    country text,
    lead_status text DEFAULT 'new'::text,
    lead_notes text,
    specialty_sourcing_required boolean DEFAULT false,
    production_route text,
    specialty_notes text,
    bangladesh_cost numeric(10,2),
    specialty_cost numeric(10,2),
    admin_markup numeric(10,2),
    CONSTRAINT ai_quotes_lead_status_check CHECK ((lead_status = ANY (ARRAY['new'::text, 'contacted'::text, 'hot'::text, 'warm'::text, 'cold'::text, 'lost'::text]))),
    CONSTRAINT ai_quotes_production_route_check CHECK ((production_route = ANY (ARRAY['bangladesh_only'::text, 'hybrid'::text, 'specialty_only'::text])))
);


--
-- Name: ai_usage_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text,
    user_id uuid,
    function_name text NOT NULL,
    estimated_cost numeric(10,4),
    request_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: batch_contributions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batch_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    batch_id uuid,
    order_id uuid,
    quantity integer NOT NULL,
    style_details jsonb NOT NULL,
    buyer_price_per_unit numeric(10,2) NOT NULL,
    contribution_margin numeric(10,2),
    committed_at timestamp without time zone DEFAULT now()
);


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    color text DEFAULT '#10b981'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid,
    author_name text NOT NULL,
    author_email text NOT NULL,
    content text NOT NULL,
    approved boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    author_id uuid,
    featured_image_url text NOT NULL,
    thumbnail_url text,
    meta_title text,
    meta_description text,
    meta_keywords text,
    published boolean DEFAULT false,
    published_at timestamp with time zone,
    views_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    tags jsonb DEFAULT '[]'::jsonb,
    seo_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: capacity_utilization_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capacity_utilization_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    date date NOT NULL,
    utilization_percentage numeric(5,2) NOT NULL,
    orders_count integer DEFAULT 0,
    revenue_generated numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: case_studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    client_name text NOT NULL,
    industry text NOT NULL,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    challenge text NOT NULL,
    solution text NOT NULL,
    results text NOT NULL,
    testimonial text NOT NULL,
    testimonial_author text NOT NULL,
    hero_image_url text,
    process_images jsonb DEFAULT '[]'::jsonb,
    metrics jsonb DEFAULT '{}'::jsonb,
    featured boolean DEFAULT false,
    published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon_name text NOT NULL,
    color_class text NOT NULL,
    bg_color_class text NOT NULL,
    status text NOT NULL,
    certificate_number text,
    issuing_body text,
    issue_date date,
    expiry_date date,
    certificate_url text,
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT certifications_status_check CHECK ((status = ANY (ARRAY['certified'::text, 'in_progress'::text, 'aspirational'::text])))
);


--
-- Name: company_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    legal_name text NOT NULL,
    registration_number text,
    tax_id text,
    address text NOT NULL,
    city text,
    state text,
    country text NOT NULL,
    zip_code text,
    display_order integer DEFAULT 0,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT company_info_entity_type_check CHECK ((entity_type = ANY (ARRAY['us_llc'::text, 'bangladesh'::text])))
);


--
-- Name: conversation_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    total_conversations integer DEFAULT 0,
    buyer_conversations integer DEFAULT 0,
    supplier_conversations integer DEFAULT 0,
    completed_conversations integer DEFAULT 0,
    quotes_generated integer DEFAULT 0,
    avg_messages_per_conversation numeric(10,2),
    common_questions jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: conversation_context; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_context (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    user_id uuid,
    email text,
    phone text,
    intent text,
    status text DEFAULT 'active'::text,
    transcript jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    stage text DEFAULT 'greeting'::text,
    extracted_data jsonb DEFAULT '{}'::jsonb,
    style_preference text,
    budget_range text,
    timeline_urgency text,
    design_readiness text,
    lead_score integer DEFAULT 0,
    conversation_path text,
    target_market text,
    decision_stage text,
    CONSTRAINT voice_conversations_intent_check CHECK ((intent = ANY (ARRAY['buyer'::text, 'supplier'::text, 'unknown'::text]))),
    CONSTRAINT voice_conversations_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'abandoned'::text])))
);


--
-- Name: conversation_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    audio_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sentiment text,
    topics text[],
    quick_replies jsonb,
    CONSTRAINT conversation_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text])))
);


--
-- Name: conversation_rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    request_count integer DEFAULT 1 NOT NULL,
    window_start timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: defects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    qc_check_id uuid NOT NULL,
    defect_type text NOT NULL,
    severity text NOT NULL,
    quantity integer NOT NULL,
    description text,
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT defects_severity_check CHECK ((severity = ANY (ARRAY['minor'::text, 'major'::text, 'critical'::text])))
);


--
-- Name: email_verification_otps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification_otps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    otp text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    ip_address text,
    session_id text,
    attempt_count integer DEFAULT 0
);


--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exchange_rates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    base_currency text DEFAULT 'USD'::text NOT NULL,
    target_currency text NOT NULL,
    rate numeric(10,6) NOT NULL,
    fetched_at timestamp with time zone DEFAULT now() NOT NULL,
    valid_until timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: factory_capacity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.factory_capacity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    total_capacity integer DEFAULT 0 NOT NULL,
    current_utilization integer DEFAULT 0 NOT NULL,
    available_capacity integer GENERATED ALWAYS AS ((total_capacity - current_utilization)) STORED,
    machines_count integer DEFAULT 0,
    workers_count integer DEFAULT 0,
    shift_hours integer DEFAULT 8,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: industry_knowledge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industry_knowledge (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    subcategory text,
    title text NOT NULL,
    content text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    version integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    invoice_number text NOT NULL,
    amount numeric NOT NULL,
    payment_type text NOT NULL,
    status text DEFAULT 'pending'::text,
    due_date date,
    paid_at timestamp with time zone,
    pdf_url text,
    stripe_invoice_id text,
    stripe_payment_intent_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT invoices_payment_type_check CHECK ((payment_type = ANY (ARRAY['deposit'::text, 'balance'::text, 'full'::text]))),
    CONSTRAINT invoices_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'cancelled'::text, 'refunded'::text])))
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email_orders boolean DEFAULT true NOT NULL,
    email_messages boolean DEFAULT true NOT NULL,
    email_production boolean DEFAULT true NOT NULL,
    email_payments boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    read boolean DEFAULT false,
    link text,
    created_at timestamp with time zone DEFAULT now(),
    notification_type text,
    metadata jsonb,
    read_at timestamp with time zone,
    action_url text,
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['order_update'::text, 'qc_alert'::text, 'system'::text, 'shipment'::text])))
);


--
-- Name: order_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text NOT NULL,
    uploaded_by uuid NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    document_type text DEFAULT 'general'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    sender_role text NOT NULL,
    message text NOT NULL,
    attachments text[],
    translated_message text,
    read_by uuid[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    old_status public.order_workflow_status,
    new_status public.order_workflow_status NOT NULL,
    changed_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: order_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    stage public.production_stage NOT NULL,
    message text,
    photos text[],
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    completion_percentage integer DEFAULT 0,
    CONSTRAINT order_updates_completion_percentage_check CHECK (((completion_percentage >= 0) AND (completion_percentage <= 100)))
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_number text NOT NULL,
    buyer_id uuid NOT NULL,
    factory_id uuid,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    status text DEFAULT 'pending'::text,
    target_date date,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    current_stage public.production_stage DEFAULT 'yarn_received'::public.production_stage,
    stage_progress jsonb DEFAULT '{"linking": 0, "packing": 0, "final_qc": 0, "knitting": 0, "ready_to_ship": 0, "yarn_received": 0, "washing_finishing": 0}'::jsonb,
    supplier_id uuid,
    quote_id uuid,
    production_status text DEFAULT 'pending'::text,
    milestone_tracker jsonb DEFAULT '{"production": {"status": "pending", "completion_date": null}, "packing_shipping": {"status": "pending", "completion_date": null}, "quality_inspection": {"status": "pending", "completion_date": null}, "cutting_preparation": {"status": "pending", "completion_date": null}, "material_procurement": {"status": "pending", "completion_date": null}}'::jsonb,
    expected_delivery_date date,
    actual_delivery_date date,
    tracking_token text,
    payment_status text DEFAULT 'pending'::text,
    deposit_amount numeric,
    balance_amount numeric,
    deposit_paid_at timestamp with time zone,
    balance_paid_at timestamp with time zone,
    stripe_payment_intent_id text,
    stripe_customer_id text,
    workflow_status public.order_workflow_status DEFAULT 'quote_requested'::public.order_workflow_status,
    admin_notes text,
    buyer_price numeric,
    supplier_price numeric,
    admin_margin numeric,
    margin_percentage numeric,
    assigned_by uuid,
    assigned_at timestamp with time zone,
    is_demo_order boolean DEFAULT false,
    display_publicly boolean DEFAULT false,
    anonymized_client_name text,
    CONSTRAINT orders_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'in_production'::text, 'quality_check'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])))
);


--
-- Name: otp_rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    identifier_type text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: otp_verification_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_verification_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    identifier_type text NOT NULL,
    attempt_time timestamp with time zone DEFAULT now() NOT NULL,
    success boolean DEFAULT false NOT NULL,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: phone_verification_otps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.phone_verification_otps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    otp text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    attempt_count integer DEFAULT 0,
    ip_address text,
    session_id text
);


--
-- Name: production_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_batches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_category text NOT NULL,
    product_variant_base text NOT NULL,
    target_quantity integer DEFAULT 200 NOT NULL,
    current_quantity integer DEFAULT 0,
    current_style_count integer DEFAULT 0,
    max_styles integer DEFAULT 4,
    supplier_id uuid,
    batch_status text DEFAULT 'filling'::text,
    unit_price_base numeric(10,2) NOT NULL,
    complexity_multiplier numeric(3,2) DEFAULT 1.0,
    estimated_start_date date,
    actual_start_date date,
    window_closes_at timestamp without time zone DEFAULT (now() + '7 days'::interval),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT production_batches_batch_status_check CHECK ((batch_status = ANY (ARRAY['filling'::text, 'confirmed'::text, 'in_production'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: production_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.production_stages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_order_id uuid NOT NULL,
    stage_number integer NOT NULL,
    stage_name text NOT NULL,
    description text,
    target_date date,
    completion_percentage integer DEFAULT 0,
    status text DEFAULT 'pending'::text NOT NULL,
    photos text[],
    notes text,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    updated_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT production_stages_completion_percentage_check CHECK (((completion_percentage >= 0) AND (completion_percentage <= 100)))
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    gauge text,
    yarn text,
    colors text[],
    image_url text NOT NULL,
    description text,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ai_generated_image boolean DEFAULT false,
    image_generation_prompt text,
    image_generation_date timestamp with time zone,
    image_approved_by_admin boolean DEFAULT false
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    company_name text,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    address text,
    bio text,
    email text,
    phone_verified boolean DEFAULT false,
    phone_verified_at timestamp with time zone,
    role text DEFAULT 'user'::text,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text, 'super_admin'::text])))
);


--
-- Name: qc_checks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qc_checks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    inspector_id uuid NOT NULL,
    check_date timestamp with time zone DEFAULT now() NOT NULL,
    stage public.production_stage NOT NULL,
    total_pieces_checked integer NOT NULL,
    passed_pieces integer NOT NULL,
    failed_pieces integer NOT NULL,
    notes text,
    photos text[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: quote_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_configurations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    product_category text NOT NULL,
    base_price_per_unit numeric(10,2) NOT NULL,
    moq_min integer NOT NULL,
    moq_max integer NOT NULL,
    complexity_multiplier jsonb DEFAULT '{"medium": 1.3, "simple": 1.0, "complex": 1.6}'::jsonb,
    sampling_days integer DEFAULT 7,
    production_days_per_100_units integer DEFAULT 5,
    base_lead_time_days integer DEFAULT 30,
    material_cost_multipliers jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true
);


--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    whatsapp text,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    gauge text,
    target_date date,
    notes text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    session_id text,
    user_id uuid,
    CONSTRAINT valid_email CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT valid_quantity CHECK (((quantity > 0) AND (quantity <= 10000000)))
);


--
-- Name: quote_usage_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_usage_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    ip_address text,
    session_id text,
    quote_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    buyer_id uuid,
    session_id text,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    target_moq integer,
    complexity_level text,
    fabric_type text,
    customization_details text,
    additional_requirements text,
    tech_pack_urls text[],
    reference_image_urls text[],
    target_price_per_unit numeric,
    target_delivery_date date,
    matched_supplier_ids uuid[],
    status text DEFAULT 'draft'::text NOT NULL,
    ai_estimation jsonb,
    customer_name text,
    customer_email text,
    customer_phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sample_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    requested_by uuid,
    requested_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone,
    rejected_at timestamp with time zone,
    sample_type text NOT NULL,
    specifications jsonb,
    status text DEFAULT 'pending'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: sample_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sample_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sample_request_id uuid NOT NULL,
    submitted_by uuid,
    submitted_at timestamp with time zone DEFAULT now(),
    photos text[],
    measurements jsonb,
    supplier_notes text,
    feedback text,
    approved boolean,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: shipping_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    tracking_number text,
    carrier text,
    status text DEFAULT 'preparing'::text NOT NULL,
    shipped_date timestamp with time zone,
    estimated_delivery date,
    actual_delivery date,
    current_location text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: social_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    platform text NOT NULL,
    shared_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    session_id text
);


--
-- Name: supplier_capabilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_capabilities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    product_category text NOT NULL,
    materials text[] DEFAULT '{}'::text[] NOT NULL,
    techniques text[] DEFAULT '{}'::text[] NOT NULL,
    gauge_range text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: supplier_certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    certification_name text NOT NULL,
    certification_body text,
    issue_date date,
    expiry_date date,
    document_url text,
    verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: supplier_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    media_type text NOT NULL,
    url text NOT NULL,
    caption text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: supplier_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_order_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    message text NOT NULL,
    attachments text[],
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: supplier_mou_terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_mou_terms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid,
    tier text DEFAULT 'standard'::text,
    moq_per_batch integer DEFAULT 200,
    max_styles_allowed integer DEFAULT 4,
    base_price numeric(10,2) NOT NULL,
    complexity_premium_percent numeric(4,2) DEFAULT 5.0,
    lead_time_days integer DEFAULT 14,
    extra_style_lead_time integer DEFAULT 2,
    monthly_batch_minimum integer DEFAULT 3,
    signed_at timestamp without time zone,
    mou_document_url text,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT supplier_mou_terms_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'suspended'::text, 'terminated'::text]))),
    CONSTRAINT supplier_mou_terms_tier_check CHECK ((tier = ANY (ARRAY['standard'::text, 'premium'::text, 'specialty'::text])))
);


--
-- Name: supplier_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_number text NOT NULL,
    supplier_id uuid,
    buyer_order_id uuid,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    buyer_price numeric,
    supplier_price numeric,
    margin numeric GENERATED ALWAYS AS ((buyer_price - supplier_price)) STORED,
    target_date date,
    status text DEFAULT 'pending'::text NOT NULL,
    tech_pack_urls text[],
    reference_images text[],
    special_instructions text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    acceptance_status text DEFAULT 'pending'::text,
    accepted_at timestamp with time zone,
    rejected_at timestamp with time zone,
    rejection_reason text,
    counter_offer_price numeric,
    counter_offer_notes text,
    CONSTRAINT supplier_orders_acceptance_status_check CHECK ((acceptance_status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'counter_offered'::text])))
);


--
-- Name: supplier_performance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_performance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    supplier_order_id uuid NOT NULL,
    committed_delivery_date date NOT NULL,
    actual_delivery_date date,
    on_time boolean,
    quality_score integer,
    communication_score integer,
    overall_score numeric GENERATED ALWAYS AS ((((quality_score + communication_score))::numeric / 2.0)) STORED,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_performance_communication_score_check CHECK (((communication_score >= 1) AND (communication_score <= 5))),
    CONSTRAINT supplier_performance_quality_score_check CHECK (((quality_score >= 1) AND (quality_score <= 5)))
);


--
-- Name: supplier_quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    lead_time_days integer NOT NULL,
    moq_offered integer NOT NULL,
    pricing_breakdown jsonb,
    materials_description text,
    terms_conditions text,
    valid_until date,
    notes text,
    status text DEFAULT 'pending'::text NOT NULL,
    submitted_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: supplier_ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_ratings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    order_id uuid,
    buyer_id uuid NOT NULL,
    quality_score integer,
    communication_score integer,
    delivery_score integer,
    overall_score numeric GENERATED ALWAYS AS (((((quality_score + communication_score) + delivery_score))::numeric / 3.0)) STORED,
    review_text text,
    on_time_delivery boolean,
    would_recommend boolean,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT supplier_ratings_communication_score_check CHECK (((communication_score >= 1) AND (communication_score <= 5))),
    CONSTRAINT supplier_ratings_delivery_score_check CHECK (((delivery_score >= 1) AND (delivery_score <= 5))),
    CONSTRAINT supplier_ratings_quality_score_check CHECK (((quality_score >= 1) AND (quality_score <= 5)))
);


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    company_name text NOT NULL,
    factory_location text NOT NULL,
    address text,
    workforce_size integer,
    moq_minimum integer DEFAULT 50 NOT NULL,
    moq_maximum integer,
    lead_time_days integer DEFAULT 45 NOT NULL,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status NOT NULL,
    tier public.supplier_tier DEFAULT 'bronze'::public.supplier_tier NOT NULL,
    about text,
    specializations text[],
    website_url text,
    contact_person text,
    contact_phone text,
    contact_email text,
    business_registration_number text,
    year_established integer,
    total_capacity_monthly integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    managed_by_sleek boolean DEFAULT true,
    performance_score numeric DEFAULT 0,
    total_orders_completed integer DEFAULT 0,
    on_time_delivery_rate numeric DEFAULT 0,
    avg_capacity_utilization numeric(5,2) DEFAULT 0,
    capacity_update_frequency text DEFAULT 'daily'::text,
    auto_accept_orders boolean DEFAULT false
);


--
-- Name: timeline_predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timeline_predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    quote_id uuid,
    order_id uuid,
    stages jsonb NOT NULL,
    total_days integer NOT NULL,
    estimated_completion_date date NOT NULL,
    confidence_score numeric(3,2),
    actual_completion_date date,
    accuracy_score numeric(3,2)
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    role public.app_role DEFAULT 'retailer'::public.app_role NOT NULL
);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: ai_quote_rate_limits ai_quote_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_quote_rate_limits
    ADD CONSTRAINT ai_quote_rate_limits_pkey PRIMARY KEY (id);


--
-- Name: ai_quotes ai_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_quotes
    ADD CONSTRAINT ai_quotes_pkey PRIMARY KEY (id);


--
-- Name: ai_usage_logs ai_usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage_logs
    ADD CONSTRAINT ai_usage_logs_pkey PRIMARY KEY (id);


--
-- Name: batch_contributions batch_contributions_batch_id_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batch_contributions
    ADD CONSTRAINT batch_contributions_batch_id_order_id_key UNIQUE (batch_id, order_id);


--
-- Name: batch_contributions batch_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batch_contributions
    ADD CONSTRAINT batch_contributions_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_name_key UNIQUE (name);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);


--
-- Name: blog_comments blog_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: capacity_utilization_logs capacity_utilization_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capacity_utilization_logs
    ADD CONSTRAINT capacity_utilization_logs_pkey PRIMARY KEY (id);


--
-- Name: case_studies case_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: company_info company_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_pkey PRIMARY KEY (id);


--
-- Name: conversation_analytics conversation_analytics_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_analytics
    ADD CONSTRAINT conversation_analytics_date_key UNIQUE (date);


--
-- Name: conversation_analytics conversation_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_analytics
    ADD CONSTRAINT conversation_analytics_pkey PRIMARY KEY (id);


--
-- Name: conversation_messages conversation_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_messages
    ADD CONSTRAINT conversation_messages_pkey PRIMARY KEY (id);


--
-- Name: conversation_rate_limits conversation_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_rate_limits
    ADD CONSTRAINT conversation_rate_limits_pkey PRIMARY KEY (id);


--
-- Name: defects defects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_pkey PRIMARY KEY (id);


--
-- Name: email_verification_otps email_verification_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_otps
    ADD CONSTRAINT email_verification_otps_pkey PRIMARY KEY (id);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (id);


--
-- Name: factory_capacity factory_capacity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factory_capacity
    ADD CONSTRAINT factory_capacity_pkey PRIMARY KEY (id);


--
-- Name: factory_capacity factory_capacity_supplier_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factory_capacity
    ADD CONSTRAINT factory_capacity_supplier_id_date_key UNIQUE (supplier_id, date);


--
-- Name: industry_knowledge industry_knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industry_knowledge
    ADD CONSTRAINT industry_knowledge_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_documents order_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_documents
    ADD CONSTRAINT order_documents_pkey PRIMARY KEY (id);


--
-- Name: order_messages order_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_messages
    ADD CONSTRAINT order_messages_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: order_updates order_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_updates
    ADD CONSTRAINT order_updates_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders orders_tracking_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tracking_token_key UNIQUE (tracking_token);


--
-- Name: otp_rate_limits otp_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_rate_limits
    ADD CONSTRAINT otp_rate_limits_pkey PRIMARY KEY (id);


--
-- Name: otp_verification_attempts otp_verification_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verification_attempts
    ADD CONSTRAINT otp_verification_attempts_pkey PRIMARY KEY (id);


--
-- Name: phone_verification_otps phone_verification_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.phone_verification_otps
    ADD CONSTRAINT phone_verification_otps_pkey PRIMARY KEY (id);


--
-- Name: production_batches production_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_batches
    ADD CONSTRAINT production_batches_pkey PRIMARY KEY (id);


--
-- Name: production_stages production_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_stages
    ADD CONSTRAINT production_stages_pkey PRIMARY KEY (id);


--
-- Name: production_stages production_stages_supplier_order_id_stage_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_stages
    ADD CONSTRAINT production_stages_supplier_order_id_stage_number_key UNIQUE (supplier_order_id, stage_number);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: qc_checks qc_checks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qc_checks
    ADD CONSTRAINT qc_checks_pkey PRIMARY KEY (id);


--
-- Name: quote_configurations quote_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_configurations
    ADD CONSTRAINT quote_configurations_pkey PRIMARY KEY (id);


--
-- Name: quote_requests quote_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);


--
-- Name: quote_usage_tracking quote_usage_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_usage_tracking
    ADD CONSTRAINT quote_usage_tracking_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: sample_requests sample_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_requests
    ADD CONSTRAINT sample_requests_pkey PRIMARY KEY (id);


--
-- Name: sample_submissions sample_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sample_submissions
    ADD CONSTRAINT sample_submissions_pkey PRIMARY KEY (id);


--
-- Name: shipping_info shipping_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_info
    ADD CONSTRAINT shipping_info_pkey PRIMARY KEY (id);


--
-- Name: social_shares social_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_pkey PRIMARY KEY (id);


--
-- Name: supplier_capabilities supplier_capabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_capabilities
    ADD CONSTRAINT supplier_capabilities_pkey PRIMARY KEY (id);


--
-- Name: supplier_certifications supplier_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_certifications
    ADD CONSTRAINT supplier_certifications_pkey PRIMARY KEY (id);


--
-- Name: supplier_media supplier_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_media
    ADD CONSTRAINT supplier_media_pkey PRIMARY KEY (id);


--
-- Name: supplier_messages supplier_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_messages
    ADD CONSTRAINT supplier_messages_pkey PRIMARY KEY (id);


--
-- Name: supplier_mou_terms supplier_mou_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_mou_terms
    ADD CONSTRAINT supplier_mou_terms_pkey PRIMARY KEY (id);


--
-- Name: supplier_mou_terms supplier_mou_terms_supplier_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_mou_terms
    ADD CONSTRAINT supplier_mou_terms_supplier_id_key UNIQUE (supplier_id);


--
-- Name: supplier_orders supplier_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_orders
    ADD CONSTRAINT supplier_orders_order_number_key UNIQUE (order_number);


--
-- Name: supplier_orders supplier_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_orders
    ADD CONSTRAINT supplier_orders_pkey PRIMARY KEY (id);


--
-- Name: supplier_performance supplier_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_performance
    ADD CONSTRAINT supplier_performance_pkey PRIMARY KEY (id);


--
-- Name: supplier_performance supplier_performance_supplier_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_performance
    ADD CONSTRAINT supplier_performance_supplier_order_id_key UNIQUE (supplier_order_id);


--
-- Name: supplier_quotes supplier_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_quotes
    ADD CONSTRAINT supplier_quotes_pkey PRIMARY KEY (id);


--
-- Name: supplier_ratings supplier_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_ratings
    ADD CONSTRAINT supplier_ratings_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: timeline_predictions timeline_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeline_predictions
    ADD CONSTRAINT timeline_predictions_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: conversation_context voice_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_context
    ADD CONSTRAINT voice_conversations_pkey PRIMARY KEY (id);


--
-- Name: conversation_context voice_conversations_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_context
    ADD CONSTRAINT voice_conversations_session_id_key UNIQUE (session_id);


--
-- Name: idx_admin_audit_logs_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_audit_logs_admin_id ON public.admin_audit_logs USING btree (admin_id);


--
-- Name: idx_admin_audit_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs USING btree (created_at DESC);


--
-- Name: idx_admin_audit_logs_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_audit_logs_resource ON public.admin_audit_logs USING btree (resource_type, resource_id);


--
-- Name: idx_ai_quotes_lead_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_quotes_lead_status ON public.ai_quotes USING btree (lead_status);


--
-- Name: idx_ai_quotes_session_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_quotes_session_created ON public.ai_quotes USING btree (session_id, created_at) WHERE (session_id IS NOT NULL);


--
-- Name: idx_ai_quotes_specialty_sourcing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_quotes_specialty_sourcing ON public.ai_quotes USING btree (specialty_sourcing_required) WHERE (specialty_sourcing_required = true);


--
-- Name: idx_ai_quotes_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_quotes_status ON public.ai_quotes USING btree (status);


--
-- Name: idx_batch_contributions_batch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_batch_contributions_batch ON public.batch_contributions USING btree (batch_id);


--
-- Name: idx_batch_contributions_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_batch_contributions_order ON public.batch_contributions USING btree (order_id);


--
-- Name: idx_capacity_logs_supplier_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_capacity_logs_supplier_date ON public.capacity_utilization_logs USING btree (supplier_id, date);


--
-- Name: idx_conversation_context_decision_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_context_decision_stage ON public.conversation_context USING btree (decision_stage);


--
-- Name: idx_conversation_context_intent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_context_intent ON public.conversation_context USING btree (intent);


--
-- Name: idx_conversation_context_lead_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_context_lead_score ON public.conversation_context USING btree (lead_score DESC);


--
-- Name: idx_conversation_context_stage; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_context_stage ON public.conversation_context USING btree (stage);


--
-- Name: idx_conversation_messages_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages USING btree (conversation_id);


--
-- Name: idx_conversation_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages USING btree (created_at);


--
-- Name: idx_conversation_rate_limits_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_rate_limits_identifier ON public.conversation_rate_limits USING btree (identifier);


--
-- Name: idx_conversation_rate_limits_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_rate_limits_window ON public.conversation_rate_limits USING btree (window_start);


--
-- Name: idx_defects_qc_check_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_defects_qc_check_id ON public.defects USING btree (qc_check_id);


--
-- Name: idx_email_verification_otps_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_otps_email ON public.email_verification_otps USING btree (email);


--
-- Name: idx_email_verification_otps_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_otps_expires_at ON public.email_verification_otps USING btree (expires_at);


--
-- Name: idx_exchange_rates_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exchange_rates_lookup ON public.exchange_rates USING btree (base_currency, target_currency, valid_until);


--
-- Name: idx_factory_capacity_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factory_capacity_date ON public.factory_capacity USING btree (date);


--
-- Name: idx_factory_capacity_supplier_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factory_capacity_supplier_date ON public.factory_capacity USING btree (supplier_id, date);


--
-- Name: idx_industry_knowledge_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_industry_knowledge_category ON public.industry_knowledge USING btree (category);


--
-- Name: idx_industry_knowledge_subcategory; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_industry_knowledge_subcategory ON public.industry_knowledge USING btree (subcategory);


--
-- Name: idx_notification_preferences_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences USING btree (user_id);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (read);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_order_documents_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_documents_order_id ON public.order_documents USING btree (order_id);


--
-- Name: idx_order_messages_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_order_messages_order_id ON public.order_messages USING btree (order_id);


--
-- Name: idx_orders_quote_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_quote_id ON public.orders USING btree (quote_id);


--
-- Name: idx_orders_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_supplier_id ON public.orders USING btree (supplier_id);


--
-- Name: idx_orders_tracking_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_tracking_token ON public.orders USING btree (tracking_token);


--
-- Name: idx_otp_attempts_identifier_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_otp_attempts_identifier_time ON public.otp_verification_attempts USING btree (identifier, attempt_time DESC);


--
-- Name: idx_otp_rate_limits_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_otp_rate_limits_identifier ON public.otp_rate_limits USING btree (identifier);


--
-- Name: idx_phone_verification_otps_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_phone_verification_otps_expires ON public.phone_verification_otps USING btree (expires_at);


--
-- Name: idx_phone_verification_otps_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_phone_verification_otps_phone ON public.phone_verification_otps USING btree (phone);


--
-- Name: idx_production_batches_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_batches_category ON public.production_batches USING btree (product_category);


--
-- Name: idx_production_batches_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_batches_status ON public.production_batches USING btree (batch_status);


--
-- Name: idx_production_batches_supplier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_batches_supplier ON public.production_batches USING btree (supplier_id);


--
-- Name: idx_production_stages_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_stages_order_id ON public.production_stages USING btree (supplier_order_id);


--
-- Name: idx_production_stages_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_production_stages_status ON public.production_stages USING btree (status);


--
-- Name: idx_products_ai_generated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_ai_generated ON public.products USING btree (ai_generated_image);


--
-- Name: idx_products_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_approved ON public.products USING btree (image_approved_by_admin);


--
-- Name: idx_profiles_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);


--
-- Name: idx_qc_checks_inspector_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qc_checks_inspector_id ON public.qc_checks USING btree (inspector_id);


--
-- Name: idx_qc_checks_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qc_checks_order_id ON public.qc_checks USING btree (order_id);


--
-- Name: idx_quote_requests_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_created_at ON public.quote_requests USING btree (created_at DESC);


--
-- Name: idx_quote_requests_session_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_session_created ON public.quote_requests USING btree (session_id, created_at) WHERE (session_id IS NOT NULL);


--
-- Name: idx_quote_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_requests_status ON public.quote_requests USING btree (status);


--
-- Name: idx_quote_usage_tracking_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_usage_tracking_email ON public.quote_usage_tracking USING btree (email);


--
-- Name: idx_quote_usage_tracking_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quote_usage_tracking_window ON public.quote_usage_tracking USING btree (window_start);


--
-- Name: idx_quotes_buyer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quotes_buyer_id ON public.quotes USING btree (buyer_id);


--
-- Name: idx_quotes_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quotes_status ON public.quotes USING btree (status);


--
-- Name: idx_rate_limits_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limits_identifier ON public.ai_quote_rate_limits USING btree (identifier, window_start);


--
-- Name: idx_shipping_info_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipping_info_order_id ON public.shipping_info USING btree (order_id);


--
-- Name: idx_supplier_capabilities_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_capabilities_supplier_id ON public.supplier_capabilities USING btree (supplier_id);


--
-- Name: idx_supplier_messages_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_messages_order_id ON public.supplier_messages USING btree (supplier_order_id);


--
-- Name: idx_supplier_messages_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_messages_read ON public.supplier_messages USING btree (read);


--
-- Name: idx_supplier_mou_supplier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_mou_supplier ON public.supplier_mou_terms USING btree (supplier_id);


--
-- Name: idx_supplier_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_orders_status ON public.supplier_orders USING btree (status);


--
-- Name: idx_supplier_orders_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_orders_supplier_id ON public.supplier_orders USING btree (supplier_id);


--
-- Name: idx_supplier_performance_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_performance_supplier_id ON public.supplier_performance USING btree (supplier_id);


--
-- Name: idx_supplier_quotes_quote_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_quotes_quote_id ON public.supplier_quotes USING btree (quote_id);


--
-- Name: idx_supplier_quotes_supplier_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_quotes_supplier_id ON public.supplier_quotes USING btree (supplier_id);


--
-- Name: idx_suppliers_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suppliers_user_id ON public.suppliers USING btree (user_id);


--
-- Name: idx_suppliers_verification_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suppliers_verification_status ON public.suppliers USING btree (verification_status);


--
-- Name: idx_usage_logs_function_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_logs_function_date ON public.ai_usage_logs USING btree (function_name, created_at);


--
-- Name: idx_usage_logs_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usage_logs_session ON public.ai_usage_logs USING btree (session_id);


--
-- Name: idx_voice_conversations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_voice_conversations_email ON public.conversation_context USING btree (email);


--
-- Name: idx_voice_conversations_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_voice_conversations_session_id ON public.conversation_context USING btree (session_id);


--
-- Name: idx_voice_conversations_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_voice_conversations_status ON public.conversation_context USING btree (status);


--
-- Name: order_updates on_order_update_created; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_order_update_created AFTER INSERT ON public.order_updates FOR EACH ROW EXECUTE FUNCTION public.create_update_notification();


--
-- Name: supplier_orders trigger_update_capacity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_capacity AFTER INSERT OR UPDATE ON public.supplier_orders FOR EACH ROW EXECUTE FUNCTION public.update_factory_capacity_on_order();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_blog_post_updated_at();


--
-- Name: invoices update_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_invoice_updated_at();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: production_batches update_production_batches_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_production_batches_updated_at BEFORE UPDATE ON public.production_batches FOR EACH ROW EXECUTE FUNCTION public.update_production_batches_updated_at();


--
-- Name: production_stages update_production_stage_status; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_production_stage_status BEFORE UPDATE ON public.production_stages FOR EACH ROW EXECUTE FUNCTION public.update_production_stage_status();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quote_configurations update_quote_configurations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quote_configurations_updated_at BEFORE UPDATE ON public.quote_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: quotes update_quotes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: supplier_performance update_supplier_metrics; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_supplier_metrics AFTER INSERT OR UPDATE ON public.supplier_performance FOR EACH ROW EXECUTE FUNCTION public.update_supplier_performance_metrics();


--
-- Name: supplier_mou_terms update_supplier_mou_terms_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_supplier_mou_terms_updated_at BEFORE UPDATE ON public.supplier_mou_terms FOR EACH ROW EXECUTE FUNCTION public.update_production_batches_updated_at();


--
-- Name: supplier_orders update_supplier_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_supplier_orders_updated_at BEFORE UPDATE ON public.supplier_orders FOR EACH ROW EXECUTE FUNCTION public.update_supplier_orders_updated_at();


--
-- Name: supplier_quotes update_supplier_quotes_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_supplier_quotes_updated_at BEFORE UPDATE ON public.supplier_quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: suppliers update_suppliers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: conversation_context update_voice_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_voice_conversations_updated_at BEFORE UPDATE ON public.conversation_context FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: admin_audit_logs admin_audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: ai_quotes ai_quotes_converted_to_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_quotes
    ADD CONSTRAINT ai_quotes_converted_to_order_id_fkey FOREIGN KEY (converted_to_order_id) REFERENCES public.orders(id);


--
-- Name: batch_contributions batch_contributions_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batch_contributions
    ADD CONSTRAINT batch_contributions_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.production_batches(id) ON DELETE CASCADE;


--
-- Name: batch_contributions batch_contributions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batch_contributions
    ADD CONSTRAINT batch_contributions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: blog_comments blog_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: blog_comments blog_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comments
    ADD CONSTRAINT blog_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id);


--
-- Name: capacity_utilization_logs capacity_utilization_logs_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capacity_utilization_logs
    ADD CONSTRAINT capacity_utilization_logs_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: conversation_messages conversation_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_messages
    ADD CONSTRAINT conversation_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversation_context(id) ON DELETE CASCADE;


--
-- Name: defects defects_qc_check_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defects
    ADD CONSTRAINT defects_qc_check_id_fkey FOREIGN KEY (qc_check_id) REFERENCES public.qc_checks(id) ON DELETE CASCADE;


--
-- Name: factory_capacity factory_capacity_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factory_capacity
    ADD CONSTRAINT factory_capacity_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: order_messages order_messages_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_messages
    ADD CONSTRAINT order_messages_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_messages order_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_messages
    ADD CONSTRAINT order_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: order_status_history order_status_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id);


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_updates order_updates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_updates
    ADD CONSTRAINT order_updates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: order_updates order_updates_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_updates
    ADD CONSTRAINT order_updates_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES auth.users(id);


--
-- Name: orders orders_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES auth.users(id);


--
-- Name: orders orders_factory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_factory_id_fkey FOREIGN KEY (factory_id) REFERENCES auth.users(id);


--
-- Name: orders orders_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE SET NULL;


--
-- Name: orders orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;


--
-- Name: production_batches production_batches_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_batches
    ADD CONSTRAINT production_batches_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: production_stages production_stages_supplier_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_stages
    ADD CONSTRAINT production_stages_supplier_order_id_fkey FOREIGN KEY (supplier_order_id) REFERENCES public.supplier_orders(id) ON DELETE CASCADE;


--
-- Name: production_stages production_stages_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.production_stages
    ADD CONSTRAINT production_stages_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: qc_checks qc_checks_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qc_checks
    ADD CONSTRAINT qc_checks_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES auth.users(id);


--
-- Name: qc_checks qc_checks_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qc_checks
    ADD CONSTRAINT qc_checks_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: quote_requests quote_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: quotes quotes_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: social_shares social_shares_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: social_shares social_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: supplier_capabilities supplier_capabilities_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_capabilities
    ADD CONSTRAINT supplier_capabilities_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_certifications supplier_certifications_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_certifications
    ADD CONSTRAINT supplier_certifications_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_media supplier_media_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_media
    ADD CONSTRAINT supplier_media_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_messages supplier_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_messages
    ADD CONSTRAINT supplier_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id);


--
-- Name: supplier_messages supplier_messages_supplier_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_messages
    ADD CONSTRAINT supplier_messages_supplier_order_id_fkey FOREIGN KEY (supplier_order_id) REFERENCES public.supplier_orders(id) ON DELETE CASCADE;


--
-- Name: supplier_mou_terms supplier_mou_terms_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_mou_terms
    ADD CONSTRAINT supplier_mou_terms_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: supplier_orders supplier_orders_buyer_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_orders
    ADD CONSTRAINT supplier_orders_buyer_order_id_fkey FOREIGN KEY (buyer_order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: supplier_orders supplier_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_orders
    ADD CONSTRAINT supplier_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: supplier_orders supplier_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_orders
    ADD CONSTRAINT supplier_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;


--
-- Name: supplier_performance supplier_performance_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_performance
    ADD CONSTRAINT supplier_performance_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_performance supplier_performance_supplier_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_performance
    ADD CONSTRAINT supplier_performance_supplier_order_id_fkey FOREIGN KEY (supplier_order_id) REFERENCES public.supplier_orders(id) ON DELETE CASCADE;


--
-- Name: supplier_quotes supplier_quotes_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_quotes
    ADD CONSTRAINT supplier_quotes_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;


--
-- Name: supplier_quotes supplier_quotes_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_quotes
    ADD CONSTRAINT supplier_quotes_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_ratings supplier_ratings_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_ratings
    ADD CONSTRAINT supplier_ratings_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: supplier_ratings supplier_ratings_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_ratings
    ADD CONSTRAINT supplier_ratings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: supplier_ratings supplier_ratings_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_ratings
    ADD CONSTRAINT supplier_ratings_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: suppliers suppliers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: timeline_predictions timeline_predictions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeline_predictions
    ADD CONSTRAINT timeline_predictions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: timeline_predictions timeline_predictions_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeline_predictions
    ADD CONSTRAINT timeline_predictions_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.ai_quotes(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: conversation_context voice_conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_context
    ADD CONSTRAINT voice_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: order_status_history Admins and suppliers can insert status changes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and suppliers can insert status changes" ON public.order_status_history FOR INSERT WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin'::public.app_role, 'factory'::public.app_role, 'supplier'::public.app_role]));


--
-- Name: user_roles Admins can assign roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can assign roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (role <> 'admin'::public.app_role)));


--
-- Name: supplier_mou_terms Admins can manage MOUs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage MOUs" ON public.supplier_mou_terms USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: factory_capacity Admins can manage all capacity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all capacity" ON public.factory_capacity USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: invoices Admins can manage all invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all invoices" ON public.invoices USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: supplier_performance Admins can manage all performance records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all performance records" ON public.supplier_performance TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: production_stages Admins can manage all production stages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all production stages" ON public.production_stages TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: supplier_orders Admins can manage all supplier orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all supplier orders" ON public.supplier_orders TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: production_batches Admins can manage batches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage batches" ON public.production_batches USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_categories Admins can manage blog categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: blog_posts Admins can manage blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: case_studies Admins can manage case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage case studies" ON public.case_studies USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: certifications Admins can manage certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage certifications" ON public.certifications USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: company_info Admins can manage company info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage company info" ON public.company_info USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: batch_contributions Admins can manage contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage contributions" ON public.batch_contributions USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: products Admins can manage products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage products" ON public.products USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can revoke roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can revoke roles" ON public.user_roles FOR DELETE TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) AND (NOT ((user_id = auth.uid()) AND (role = 'admin'::public.app_role)))));


--
-- Name: orders Admins can update all orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can update all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: suppliers Admins can update supplier verification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update supplier verification" ON public.suppliers FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: qc_checks Admins can view all QC checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all QC checks" ON public.qc_checks FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: production_batches Admins can view all batches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all batches" ON public.production_batches FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: defects Admins can view all defects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all defects" ON public.defects FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: capacity_utilization_logs Admins can view all logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all logs" ON public.capacity_utilization_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: orders Admins can view all orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ai_quotes Admins can view all quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all quotes" ON public.ai_quotes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: quotes Admins can view all quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all quotes" ON public.quotes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: shipping_info Admins can view all shipping; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all shipping" ON public.shipping_info FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: supplier_quotes Admins can view all supplier quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all supplier quotes" ON public.supplier_quotes FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: suppliers Admins can view all suppliers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all suppliers" ON public.suppliers FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: conversation_analytics Admins can view analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view analytics" ON public.conversation_analytics FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: admin_audit_logs Admins can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: conversation_context Admins manage all conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage all conversations" ON public.conversation_context USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: conversation_messages Admins manage all messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage all messages" ON public.conversation_messages USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: social_shares Anyone can create shares; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create shares" ON public.social_shares FOR INSERT WITH CHECK (true);


--
-- Name: blog_comments Anyone can submit comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit comments" ON public.blog_comments FOR INSERT WITH CHECK (true);


--
-- Name: quote_requests Anyone can submit quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit quote requests" ON public.quote_requests FOR INSERT WITH CHECK (true);


--
-- Name: certifications Anyone can view active certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active certifications" ON public.certifications FOR SELECT USING ((active = true));


--
-- Name: company_info Anyone can view active company info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active company info" ON public.company_info FOR SELECT USING ((active = true));


--
-- Name: quote_configurations Anyone can view active quote configurations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active quote configurations" ON public.quote_configurations FOR SELECT USING ((is_active = true));


--
-- Name: blog_comments Anyone can view approved comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING ((approved = true));


--
-- Name: supplier_capabilities Anyone can view capabilities of verified suppliers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view capabilities of verified suppliers" ON public.supplier_capabilities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_capabilities.supplier_id) AND (suppliers.verification_status = 'verified'::public.verification_status)))));


--
-- Name: blog_categories Anyone can view categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view categories" ON public.blog_categories FOR SELECT USING (true);


--
-- Name: supplier_certifications Anyone can view certifications of verified suppliers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view certifications of verified suppliers" ON public.supplier_certifications FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_certifications.supplier_id) AND (suppliers.verification_status = 'verified'::public.verification_status)))));


--
-- Name: industry_knowledge Anyone can view industry knowledge; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view industry knowledge" ON public.industry_knowledge FOR SELECT USING (true);


--
-- Name: supplier_media Anyone can view media of verified suppliers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view media of verified suppliers" ON public.supplier_media FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_media.supplier_id) AND (suppliers.verification_status = 'verified'::public.verification_status)))));


--
-- Name: blog_posts Anyone can view published blog posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING ((published = true));


--
-- Name: case_studies Anyone can view published case studies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view published case studies" ON public.case_studies FOR SELECT USING ((published = true));


--
-- Name: supplier_ratings Anyone can view ratings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view ratings" ON public.supplier_ratings FOR SELECT USING (true);


--
-- Name: factory_capacity Anyone can view verified supplier capacity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view verified supplier capacity" ON public.factory_capacity FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = factory_capacity.supplier_id) AND (suppliers.verification_status = 'verified'::public.verification_status)))));


--
-- Name: suppliers Anyone can view verified suppliers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view verified suppliers" ON public.suppliers FOR SELECT USING ((verification_status = 'verified'::public.verification_status));


--
-- Name: quote_requests Authenticated users can create quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create quote requests" ON public.quote_requests FOR INSERT WITH CHECK (((auth.uid() IS NOT NULL) OR (auth.role() = 'service_role'::text)));


--
-- Name: ai_quotes Authenticated users can create quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create quotes" ON public.ai_quotes FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- Name: suppliers Authenticated users can create supplier profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create supplier profile" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (((user_id = auth.uid()) AND (NOT (EXISTS ( SELECT 1
   FROM public.suppliers suppliers_1
  WHERE (suppliers_1.user_id = auth.uid()))))));


--
-- Name: shipping_info Authenticated users can manage shipping info; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can manage shipping info" ON public.shipping_info USING ((auth.uid() IS NOT NULL));


--
-- Name: ai_quotes Authenticated users can update their quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update their quotes" ON public.ai_quotes FOR UPDATE USING (((auth.uid() IS NOT NULL) AND (customer_email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: order_documents Authenticated users can upload documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can upload documents" ON public.order_documents FOR INSERT WITH CHECK ((auth.uid() = uploaded_by));


--
-- Name: ai_quotes Authenticated users can view their quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view their quotes" ON public.ai_quotes FOR SELECT USING (((auth.uid() IS NOT NULL) AND (customer_email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: supplier_ratings Buyers can create ratings for their completed orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can create ratings for their completed orders" ON public.supplier_ratings FOR INSERT WITH CHECK (((buyer_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = supplier_ratings.order_id) AND (orders.buyer_id = auth.uid()) AND (orders.status = 'completed'::text))))));


--
-- Name: orders Buyers can update their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can update their own orders" ON public.orders FOR UPDATE TO authenticated USING ((buyer_id = auth.uid()));


--
-- Name: qc_checks Buyers can view QC checks for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view QC checks for their orders" ON public.qc_checks FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = qc_checks.order_id) AND (orders.buyer_id = auth.uid())))));


--
-- Name: production_batches Buyers can view batches with their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view batches with their orders" ON public.production_batches FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.batch_contributions bc
     JOIN public.orders o ON ((o.id = bc.order_id)))
  WHERE ((bc.batch_id = production_batches.id) AND (o.buyer_id = auth.uid())))));


--
-- Name: defects Buyers can view defects for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view defects for their orders" ON public.defects FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.qc_checks
     JOIN public.orders ON ((orders.id = qc_checks.order_id)))
  WHERE ((qc_checks.id = defects.qc_check_id) AND (orders.buyer_id = auth.uid())))));


--
-- Name: invoices Buyers can view their invoices; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view their invoices" ON public.invoices FOR SELECT USING ((order_id IN ( SELECT orders.id
   FROM public.orders
  WHERE (orders.buyer_id = auth.uid()))));


--
-- Name: shipping_info Buyers can view their order shipping; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view their order shipping" ON public.shipping_info FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = shipping_info.order_id) AND (orders.buyer_id = auth.uid())))));


--
-- Name: orders Buyers can view their own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Buyers can view their own orders" ON public.orders FOR SELECT TO authenticated USING ((buyer_id = auth.uid()));


--
-- Name: ai_quote_rate_limits Edge functions can manage rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Edge functions can manage rate limits" ON public.ai_quote_rate_limits USING (true) WITH CHECK (true);


--
-- Name: exchange_rates Exchange rates are publicly readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Exchange rates are publicly readable" ON public.exchange_rates FOR SELECT USING (true);


--
-- Name: orders Factories can update assigned orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can update assigned orders" ON public.orders FOR UPDATE TO authenticated USING ((factory_id = auth.uid()));


--
-- Name: qc_checks Factories can update their QC checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can update their QC checks" ON public.qc_checks FOR UPDATE USING ((inspector_id = auth.uid()));


--
-- Name: shipping_info Factories can view assigned order shipping; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can view assigned order shipping" ON public.shipping_info FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = shipping_info.order_id) AND (orders.factory_id = auth.uid())))));


--
-- Name: orders Factories can view assigned orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can view assigned orders" ON public.orders FOR SELECT TO authenticated USING ((factory_id = auth.uid()));


--
-- Name: defects Factories can view defects for their QC checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can view defects for their QC checks" ON public.defects FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.qc_checks
  WHERE ((qc_checks.id = defects.qc_check_id) AND (qc_checks.inspector_id = auth.uid())))));


--
-- Name: qc_checks Factories can view their QC checks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factories can view their QC checks" ON public.qc_checks FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = qc_checks.order_id) AND (orders.factory_id = auth.uid())))));


--
-- Name: qc_checks Factory users can create QC checks for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factory users can create QC checks for their orders" ON public.qc_checks FOR INSERT TO authenticated WITH CHECK (((inspector_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = qc_checks.order_id) AND (orders.factory_id = auth.uid()))))));


--
-- Name: defects Factory users can create defects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factory users can create defects" ON public.defects FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.qc_checks
  WHERE ((qc_checks.id = defects.qc_check_id) AND (qc_checks.inspector_id = auth.uid())))));


--
-- Name: order_updates Factory users can create updates for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Factory users can create updates for their orders" ON public.order_updates FOR INSERT TO authenticated WITH CHECK (((created_by = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_updates.order_id) AND (orders.factory_id = auth.uid()))))));


--
-- Name: industry_knowledge Only admins can manage industry knowledge; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can manage industry knowledge" ON public.industry_knowledge USING (false);


--
-- Name: products Products are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);


--
-- Name: conversation_context Service role can create conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can create conversations" ON public.conversation_context FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: conversation_messages Service role can create messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can create messages" ON public.conversation_messages FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: ai_quotes Service role can create quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can create quotes" ON public.ai_quotes FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: quotes Service role can create quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can create quotes" ON public.quotes FOR INSERT WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: email_verification_otps Service role can manage OTPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage OTPs" ON public.email_verification_otps TO service_role USING (true) WITH CHECK (true);


--
-- Name: user_roles Service role can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage all roles" ON public.user_roles USING ((auth.role() = 'service_role'::text));


--
-- Name: otp_verification_attempts Service role can manage attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage attempts" ON public.otp_verification_attempts TO service_role USING (true) WITH CHECK (true);


--
-- Name: exchange_rates Service role can manage exchange rates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage exchange rates" ON public.exchange_rates USING ((auth.role() = 'service_role'::text));


--
-- Name: phone_verification_otps Service role can manage phone OTPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage phone OTPs" ON public.phone_verification_otps USING (true) WITH CHECK (true);


--
-- Name: supplier_quotes Suppliers can create their quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can create their quotes" ON public.supplier_quotes FOR INSERT WITH CHECK ((supplier_id IN ( SELECT s.id
   FROM public.suppliers s
  WHERE (s.user_id = auth.uid()))));


--
-- Name: supplier_capabilities Suppliers can manage their capabilities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can manage their capabilities" ON public.supplier_capabilities USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_capabilities.supplier_id) AND (suppliers.user_id = auth.uid())))));


--
-- Name: factory_capacity Suppliers can manage their capacity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can manage their capacity" ON public.factory_capacity USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = factory_capacity.supplier_id) AND (suppliers.user_id = auth.uid())))));


--
-- Name: supplier_certifications Suppliers can manage their certifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can manage their certifications" ON public.supplier_certifications USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_certifications.supplier_id) AND (suppliers.user_id = auth.uid())))));


--
-- Name: supplier_media Suppliers can manage their media; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can manage their media" ON public.supplier_media USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = supplier_media.supplier_id) AND (suppliers.user_id = auth.uid())))));


--
-- Name: production_stages Suppliers can update stages for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can update stages for their orders" ON public.production_stages FOR UPDATE TO authenticated USING ((supplier_order_id IN ( SELECT so.id
   FROM public.supplier_orders so
  WHERE (so.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid()))))));


--
-- Name: supplier_orders Suppliers can update their assigned orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can update their assigned orders" ON public.supplier_orders FOR UPDATE TO authenticated USING ((supplier_id IN ( SELECT suppliers.id
   FROM public.suppliers
  WHERE (suppliers.user_id = auth.uid()))));


--
-- Name: suppliers Suppliers can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can update their own profile" ON public.suppliers FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: supplier_quotes Suppliers can update their quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can update their quotes" ON public.supplier_quotes FOR UPDATE USING ((supplier_id IN ( SELECT s.id
   FROM public.suppliers s
  WHERE (s.user_id = auth.uid()))));


--
-- Name: shipping_info Suppliers can view assigned order shipping; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view assigned order shipping" ON public.shipping_info FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = shipping_info.order_id) AND (orders.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid())))))));


--
-- Name: supplier_quotes Suppliers can view quotes where they are matched; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view quotes where they are matched" ON public.supplier_quotes FOR SELECT USING (((supplier_id IN ( SELECT s.id
   FROM public.suppliers s
  WHERE (s.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM public.quotes q
  WHERE ((q.id = supplier_quotes.quote_id) AND (q.buyer_id = auth.uid()))))));


--
-- Name: production_stages Suppliers can view stages for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view stages for their orders" ON public.production_stages FOR SELECT TO authenticated USING ((supplier_order_id IN ( SELECT so.id
   FROM public.supplier_orders so
  WHERE (so.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid()))))));


--
-- Name: supplier_mou_terms Suppliers can view their MOU; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their MOU" ON public.supplier_mou_terms FOR SELECT USING (((supplier_id IN ( SELECT suppliers.id
   FROM public.suppliers
  WHERE (suppliers.user_id = auth.uid()))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: production_batches Suppliers can view their assigned batches; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their assigned batches" ON public.production_batches FOR SELECT USING ((supplier_id IN ( SELECT suppliers.id
   FROM public.suppliers
  WHERE (suppliers.user_id = auth.uid()))));


--
-- Name: supplier_orders Suppliers can view their assigned orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their assigned orders" ON public.supplier_orders FOR SELECT TO authenticated USING ((supplier_id IN ( SELECT suppliers.id
   FROM public.suppliers
  WHERE (suppliers.user_id = auth.uid()))));


--
-- Name: capacity_utilization_logs Suppliers can view their logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their logs" ON public.capacity_utilization_logs FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.suppliers
  WHERE ((suppliers.id = capacity_utilization_logs.supplier_id) AND (suppliers.user_id = auth.uid())))));


--
-- Name: supplier_performance Suppliers can view their own performance; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their own performance" ON public.supplier_performance FOR SELECT TO authenticated USING ((supplier_id IN ( SELECT suppliers.id
   FROM public.suppliers
  WHERE (suppliers.user_id = auth.uid()))));


--
-- Name: suppliers Suppliers can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Suppliers can view their own profile" ON public.suppliers FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: admin_audit_logs System can create audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (true);


--
-- Name: batch_contributions System can create contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create contributions" ON public.batch_contributions FOR INSERT WITH CHECK (true);


--
-- Name: notifications System can create notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: timeline_predictions System can create predictions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create predictions" ON public.timeline_predictions FOR INSERT WITH CHECK (true);


--
-- Name: ai_usage_logs System can create usage logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create usage logs" ON public.ai_usage_logs FOR INSERT WITH CHECK (true);


--
-- Name: capacity_utilization_logs System can insert logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert logs" ON public.capacity_utilization_logs FOR INSERT WITH CHECK (true);


--
-- Name: otp_rate_limits System can manage OTP rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage OTP rate limits" ON public.otp_rate_limits USING (true);


--
-- Name: quote_usage_tracking System can manage quote usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage quote usage" ON public.quote_usage_tracking USING (true);


--
-- Name: timeline_predictions System can update timeline predictions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can update timeline predictions" ON public.timeline_predictions FOR UPDATE USING (true);


--
-- Name: conversation_analytics System manages analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System manages analytics" ON public.conversation_analytics FOR INSERT WITH CHECK (true);


--
-- Name: conversation_rate_limits System manages rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System manages rate limits" ON public.conversation_rate_limits WITH CHECK (true);


--
-- Name: conversation_analytics System updates analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System updates analytics" ON public.conversation_analytics FOR UPDATE USING (true);


--
-- Name: ai_quotes Time-limited session access to quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Time-limited session access to quotes" ON public.ai_quotes FOR SELECT USING (((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text)) AND (created_at > (now() - '02:00:00'::interval))));


--
-- Name: conversation_messages Users and anonymous view conversation messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users and anonymous view conversation messages" ON public.conversation_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.conversation_context cc
  WHERE ((cc.id = conversation_messages.conversation_id) AND (((auth.uid() IS NOT NULL) AND ((cc.user_id = auth.uid()) OR (cc.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))) OR ((auth.uid() IS NULL) AND (cc.session_id IS NOT NULL) AND (cc.created_at > (now() - '02:00:00'::interval))) OR public.has_role(auth.uid(), 'admin'::public.app_role))))));


--
-- Name: order_messages Users can create messages for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create messages for their orders" ON public.order_messages FOR INSERT WITH CHECK (((sender_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_messages.order_id) AND ((o.buyer_id = auth.uid()) OR (o.supplier_id IN ( SELECT s.id
           FROM public.suppliers s
          WHERE (s.user_id = auth.uid())))))))));


--
-- Name: order_documents Users can delete their own documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own documents" ON public.order_documents FOR DELETE USING ((auth.uid() = uploaded_by));


--
-- Name: notifications Users can delete their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((id = auth.uid()));


--
-- Name: supplier_messages Users can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can send messages" ON public.supplier_messages FOR INSERT TO authenticated WITH CHECK (((sender_id = auth.uid()) AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR (supplier_order_id IN ( SELECT so.id
   FROM public.supplier_orders so
  WHERE (so.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid()))))))));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: notifications Users can update their notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING ((user_id = auth.uid()));


--
-- Name: conversation_context Users can update their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own conversations" ON public.conversation_context FOR UPDATE USING (((auth.uid() = user_id) OR (email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: notification_preferences Users can update their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own preferences" ON public.notification_preferences USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((id = auth.uid()));


--
-- Name: quotes Users can update their own quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own quotes" ON public.quotes FOR UPDATE USING (((buyer_id = auth.uid()) OR (session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text))));


--
-- Name: email_verification_otps Users can verify their own OTPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can verify their own OTPs" ON public.email_verification_otps FOR SELECT TO authenticated, anon USING (true);


--
-- Name: phone_verification_otps Users can verify their own phone OTPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can verify their own phone OTPs" ON public.phone_verification_otps FOR SELECT USING (true);


--
-- Name: order_documents Users can view documents for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view documents for their orders" ON public.order_documents FOR SELECT USING (true);


--
-- Name: order_messages Users can view messages for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view messages for their orders" ON public.order_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_messages.order_id) AND ((o.buyer_id = auth.uid()) OR (o.supplier_id IN ( SELECT s.id
           FROM public.suppliers s
          WHERE (s.user_id = auth.uid()))))))));


--
-- Name: supplier_messages Users can view messages for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view messages for their orders" ON public.supplier_messages FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (supplier_order_id IN ( SELECT so.id
   FROM public.supplier_orders so
  WHERE (so.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid())))))));


--
-- Name: order_status_history Users can view order history for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view order history for their orders" ON public.order_status_history FOR SELECT USING (((order_id IN ( SELECT orders.id
   FROM public.orders
  WHERE ((orders.buyer_id = auth.uid()) OR (orders.supplier_id IN ( SELECT suppliers.id
           FROM public.suppliers
          WHERE (suppliers.user_id = auth.uid())))))) OR (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.app_role))))));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: batch_contributions Users can view their contributions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their contributions" ON public.batch_contributions FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = batch_contributions.order_id) AND (o.buyer_id = auth.uid())))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: notifications Users can view their notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: notification_preferences Users can view their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((id = auth.uid()));


--
-- Name: quotes Users can view their own quotes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own quotes" ON public.quotes FOR SELECT USING (((buyer_id = auth.uid()) OR (session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text))));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: timeline_predictions Users can view timelines for their quotes and orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view timelines for their quotes and orders" ON public.timeline_predictions FOR SELECT USING ((((quote_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.quotes
  WHERE ((quotes.id = timeline_predictions.quote_id) AND ((quotes.buyer_id = auth.uid()) OR (quotes.session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text))))))) OR ((order_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = timeline_predictions.order_id) AND ((orders.buyer_id = auth.uid()) OR (orders.factory_id = auth.uid())))))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: order_updates Users can view updates for their orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view updates for their orders" ON public.order_updates FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.id = order_updates.order_id) AND ((orders.buyer_id = auth.uid()) OR (orders.factory_id = auth.uid()))))));


--
-- Name: conversation_context Users view conversations with session support; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view conversations with session support" ON public.conversation_context FOR SELECT USING ((((auth.uid() IS NOT NULL) AND ((user_id = auth.uid()) OR (email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text))) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (created_at > (now() - '02:00:00'::interval))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: admin_audit_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_quote_rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_quote_rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_quotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_usage_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: batch_contributions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.batch_contributions ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: capacity_utilization_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.capacity_utilization_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: case_studies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: company_info; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

--
-- Name: conversation_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversation_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: conversation_context; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversation_context ENABLE ROW LEVEL SECURITY;

--
-- Name: conversation_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: conversation_rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversation_rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: defects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.defects ENABLE ROW LEVEL SECURITY;

--
-- Name: email_verification_otps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;

--
-- Name: exchange_rates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

--
-- Name: factory_capacity; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.factory_capacity ENABLE ROW LEVEL SECURITY;

--
-- Name: industry_knowledge; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.industry_knowledge ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: order_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: order_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: order_status_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

--
-- Name: order_updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: otp_rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: otp_verification_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.otp_verification_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: phone_verification_otps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.phone_verification_otps ENABLE ROW LEVEL SECURITY;

--
-- Name: production_batches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.production_batches ENABLE ROW LEVEL SECURITY;

--
-- Name: production_stages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.production_stages ENABLE ROW LEVEL SECURITY;

--
-- Name: production_stages production_stages_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY production_stages_delete_policy ON public.production_stages FOR DELETE USING (true);


--
-- Name: production_stages production_stages_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY production_stages_insert_policy ON public.production_stages FOR INSERT WITH CHECK (true);


--
-- Name: production_stages production_stages_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY production_stages_select_policy ON public.production_stages FOR SELECT USING (true);


--
-- Name: production_stages production_stages_update_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY production_stages_update_policy ON public.production_stages FOR UPDATE USING (true);


--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: qc_checks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.qc_checks ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_configurations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_configurations ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_usage_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_usage_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: quotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: sample_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sample_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: sample_requests sample_requests_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_requests_insert_policy ON public.sample_requests FOR INSERT WITH CHECK (true);


--
-- Name: sample_requests sample_requests_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_requests_select_policy ON public.sample_requests FOR SELECT USING (true);


--
-- Name: sample_requests sample_requests_update_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_requests_update_policy ON public.sample_requests FOR UPDATE USING (true);


--
-- Name: sample_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sample_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: sample_submissions sample_submissions_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_submissions_insert_policy ON public.sample_submissions FOR INSERT WITH CHECK (true);


--
-- Name: sample_submissions sample_submissions_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_submissions_select_policy ON public.sample_submissions FOR SELECT USING (true);


--
-- Name: sample_submissions sample_submissions_update_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY sample_submissions_update_policy ON public.sample_submissions FOR UPDATE USING (true);


--
-- Name: shipping_info; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.shipping_info ENABLE ROW LEVEL SECURITY;

--
-- Name: social_shares; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_capabilities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_capabilities ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_media ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_mou_terms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_mou_terms ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_performance; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_performance ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_quotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: supplier_ratings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.supplier_ratings ENABLE ROW LEVEL SECURITY;

--
-- Name: suppliers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

--
-- Name: timeline_predictions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.timeline_predictions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--



-- ============================================================================
-- MIGRATION 2: Create Marketplace System
-- ============================================================================
-- =====================================================
-- LOOPTRACE™ MARKETPLACE SYSTEM
-- Complete B2B Marketplace with Product Listings
-- =====================================================

-- =====================================================
-- 1. SUPPLIER CATEGORIES & SUBCATEGORIES
-- =====================================================

-- Add supplier type and subcategories to existing suppliers table
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS supplier_type TEXT DEFAULT 'manufacturer',
ADD COLUMN IF NOT EXISTS subcategories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS can_list_products BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS product_listing_tier TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS approval_rating DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS total_products_listed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active_products INTEGER DEFAULT 0;

-- Create supplier subcategories enum
CREATE TYPE supplier_subcategory AS ENUM (
  'knit_manufacturer',
  'woven_manufacturer', 
  'denim_specialist',
  'activewear_sportswear',
  'uniforms_corporate',
  'textile_mill',
  'dyeing_mill',
  'yarn_supplier',
  'trim_accessories',
  'printing_services',
  'stock_lot_seller',
  'sample_collection',
  'wholesale_reseller',
  'retail_ready_products'
);

-- =====================================================
-- 2. MARKETPLACE PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Supplier Info
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  
  -- Basic Info
  product_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  slug TEXT UNIQUE,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL, -- Supplier's price
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
  platform_fee_amount DECIMAL(10,2) GENERATED ALWAYS AS (base_price * platform_fee_percentage / 100) STORED,
  final_price DECIMAL(10,2) GENERATED ALWAYS AS (base_price + (base_price * platform_fee_percentage / 100)) STORED,
  
  -- Inventory
  available_quantity INTEGER NOT NULL DEFAULT 0,
  moq INTEGER NOT NULL DEFAULT 50,
  unit TEXT DEFAULT 'pieces',
  reserved_quantity INTEGER DEFAULT 0,
  
  -- Media
  images TEXT[] DEFAULT '{}',
  primary_image TEXT,
  video_url TEXT,
  
  -- Specifications
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  material TEXT,
  gsm INTEGER,
  fabric_composition TEXT,
  
  -- Additional Specs (JSONB for flexibility)
  specifications JSONB DEFAULT '{}',
  
  -- Logistics
  lead_time_days INTEGER DEFAULT 0,
  shipping_from TEXT,
  shipping_weight_kg DECIMAL(10,2),
  
  -- Status & Quality
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'sold_out', 'archived')),
  rejection_reason TEXT,
  admin_feedback TEXT,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  approval_date TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Engagement Metrics
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- SEO
  meta_keywords TEXT[] DEFAULT '{}',
  meta_description TEXT,
  
  -- Featured/Premium
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Indexes for performance
  CONSTRAINT positive_price CHECK (base_price > 0),
  CONSTRAINT positive_quantity CHECK (available_quantity >= 0)
);

-- Create indexes for fast queries
CREATE INDEX idx_marketplace_products_supplier ON marketplace_products(supplier_id);
CREATE INDEX idx_marketplace_products_status ON marketplace_products(status);
CREATE INDEX idx_marketplace_products_category ON marketplace_products(category);
CREATE INDEX idx_marketplace_products_approved ON marketplace_products(status, approval_date DESC) WHERE status = 'approved';
CREATE INDEX idx_marketplace_products_featured ON marketplace_products(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX idx_marketplace_products_price ON marketplace_products(final_price);
CREATE INDEX idx_marketplace_products_search ON marketplace_products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_marketplace_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_products_updated_at
  BEFORE UPDATE ON marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_product_timestamp();

-- =====================================================
-- 3. PRODUCT APPROVAL LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS product_approval_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'revision_requested', 'archived')),
  reason TEXT,
  feedback TEXT,
  previous_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_approval_log_product ON product_approval_log(product_id);
CREATE INDEX idx_product_approval_log_admin ON product_approval_log(admin_id);

-- =====================================================
-- 4. PRODUCT INQUIRIES
-- =====================================================

CREATE TABLE IF NOT EXISTS product_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  quantity INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'converted_to_order', 'declined', 'expired')),
  quoted_price DECIMAL(10,2),
  quote_notes TEXT,
  supplier_response TEXT,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_inquiries_product ON product_inquiries(product_id);
CREATE INDEX idx_product_inquiries_buyer ON product_inquiries(buyer_id);
CREATE INDEX idx_product_inquiries_status ON product_inquiries(status);

-- =====================================================
-- 5. PRODUCT ANALYTICS
-- =====================================================

CREATE TABLE IF NOT EXISTS product_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  add_to_wishlist INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, date)
);

CREATE INDEX idx_product_analytics_product ON product_analytics(product_id);
CREATE INDEX idx_product_analytics_date ON product_analytics(date);

-- =====================================================
-- 6. PRODUCT CATEGORIES REFERENCE
-- =====================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES product_categories(id),
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO product_categories (name, slug, description, display_order) VALUES
  ('Stock Lots', 'stock-lots', 'Ready-to-ship surplus inventory and canceled orders', 1),
  ('Sample Collections', 'sample-collections', 'Sample pieces and prototypes available for immediate purchase', 2),
  ('Textile & Fabrics', 'textile-fabrics', 'Fabric rolls, yarn, and textile materials', 3),
  ('Finished Garments', 'finished-garments', 'Ready-made apparel and clothing', 4),
  ('Trims & Accessories', 'trims-accessories', 'Buttons, zippers, labels, and garment accessories', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 7. PRODUCT WISHLIST
-- =====================================================

CREATE TABLE IF NOT EXISTS product_wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_product_wishlist_user ON product_wishlist(user_id);
CREATE INDEX idx_product_wishlist_product ON product_wishlist(product_id);

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_approval_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_wishlist ENABLE ROW LEVEL SECURITY;

-- Marketplace Products Policies
CREATE POLICY "Anyone can view approved products" ON marketplace_products
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Suppliers can view their own products" ON marketplace_products
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can create products" ON marketplace_products
  FOR INSERT WITH CHECK (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid() AND can_list_products = true
    )
  );

CREATE POLICY "Suppliers can update their own products" ON marketplace_products
  FOR UPDATE USING (
    supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all products" ON marketplace_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products" ON marketplace_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Product Inquiries Policies
CREATE POLICY "Buyers can create inquiries" ON product_inquiries
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can view their own inquiries" ON product_inquiries
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Suppliers can view inquiries for their products" ON product_inquiries
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM marketplace_products 
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Suppliers can respond to inquiries" ON product_inquiries
  FOR UPDATE USING (
    product_id IN (
      SELECT id FROM marketplace_products 
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

-- Wishlist Policies
CREATE POLICY "Users can manage their own wishlist" ON product_wishlist
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- 9. HELPER FUNCTIONS
-- =====================================================

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE marketplace_products 
  SET views = views + 1 
  WHERE id = product_uuid;
  
  -- Also update analytics
  INSERT INTO product_analytics (product_id, date, views, unique_viewers)
  VALUES (product_uuid, CURRENT_DATE, 1, 1)
  ON CONFLICT (product_id, date) 
  DO UPDATE SET views = product_analytics.views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update supplier product counts
CREATE OR REPLACE FUNCTION update_supplier_product_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE suppliers 
    SET total_products_listed = total_products_listed + 1,
        active_products = active_products + CASE WHEN NEW.status = 'approved' THEN 1 ELSE 0 END
    WHERE id = NEW.supplier_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      UPDATE suppliers 
      SET active_products = active_products + 
        CASE 
          WHEN NEW.status = 'approved' AND OLD.status != 'approved' THEN 1
          WHEN NEW.status != 'approved' AND OLD.status = 'approved' THEN -1
          ELSE 0
        END
      WHERE id = NEW.supplier_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE suppliers 
    SET total_products_listed = total_products_listed - 1,
        active_products = active_products - CASE WHEN OLD.status = 'approved' THEN 1 ELSE 0 END
    WHERE id = OLD.supplier_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplier_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION update_supplier_product_counts();

-- Function to calculate supplier approval rating
CREATE OR REPLACE FUNCTION calculate_supplier_approval_rating(supplier_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_submitted INTEGER;
  total_approved INTEGER;
  rating DECIMAL;
BEGIN
  SELECT COUNT(*) INTO total_submitted
  FROM marketplace_products
  WHERE supplier_id = supplier_uuid 
  AND status IN ('approved', 'rejected');
  
  IF total_submitted = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO total_approved
  FROM marketplace_products
  WHERE supplier_id = supplier_uuid 
  AND status = 'approved';
  
  rating := (total_approved::DECIMAL / total_submitted::DECIMAL) * 100;
  
  UPDATE suppliers 
  SET approval_rating = rating 
  WHERE id = supplier_uuid;
  
  RETURN rating;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. SEARCH FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION search_marketplace_products(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  final_price DECIMAL,
  primary_image TEXT,
  supplier_name TEXT,
  available_quantity INTEGER,
  moq INTEGER,
  rating DECIMAL,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.id,
    mp.title,
    mp.description,
    mp.category,
    mp.final_price,
    mp.primary_image,
    s.company_name as supplier_name,
    mp.available_quantity,
    mp.moq,
    mp.rating,
    ts_rank(
      to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')),
      plainto_tsquery('english', search_query)
    ) as relevance
  FROM marketplace_products mp
  JOIN suppliers s ON mp.supplier_id = s.id
  WHERE mp.status = 'approved'
    AND (search_query IS NULL OR 
         to_tsvector('english', mp.title || ' ' || COALESCE(mp.description, '')) @@ plainto_tsquery('english', search_query))
    AND (category_filter IS NULL OR mp.category = category_filter)
    AND (min_price IS NULL OR mp.final_price >= min_price)
    AND (max_price IS NULL OR mp.final_price <= max_price)
  ORDER BY relevance DESC, mp.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. NOTIFICATION TRIGGERS
-- =====================================================

-- Notify supplier when product is approved/rejected
CREATE OR REPLACE FUNCTION notify_supplier_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO notifications (user_id, title, message, type, link, data)
    SELECT 
      s.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Product Approved! 🎉'
        ELSE 'Product Needs Revision'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your product "' || NEW.title || '" is now live on the marketplace!'
        ELSE 'Your product "' || NEW.title || '" needs some changes. ' || COALESCE(NEW.rejection_reason, 'Please review admin feedback.')
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'warning'
      END,
      '/supplier-dashboard?tab=products&product=' || NEW.id,
      jsonb_build_object(
        'product_id', NEW.id,
        'product_title', NEW.title,
        'status', NEW.status,
        'feedback', NEW.admin_feedback
      )
    FROM suppliers s
    WHERE s.id = NEW.supplier_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_product_status_change
  AFTER UPDATE ON marketplace_products
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_supplier_product_status();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON marketplace_products TO authenticated;
GRANT SELECT ON product_categories TO authenticated;
GRANT ALL ON product_inquiries TO authenticated;
GRANT ALL ON product_wishlist TO authenticated;

-- Grant to service role for admin operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- END OF MIGRATION
-- =====================================================

-- ============================================================================
-- MIGRATION 3: Setup Product Images Storage
-- ============================================================================
-- =================================================================
-- SUPABASE STORAGE SETUP FOR MARKETPLACE PRODUCT IMAGES
-- =================================================================
-- This migration creates storage buckets and policies for product images
-- Version: 1.0.0
-- Date: 2025-01-22

-- =================================================================
-- 1. CREATE STORAGE BUCKETS
-- =================================================================

-- Create product-images bucket for marketplace product photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true, -- Public bucket for product images
  5242880, -- 5MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 2. STORAGE POLICIES FOR PRODUCT IMAGES
-- =================================================================

-- Policy: Anyone can view product images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Authenticated suppliers can upload product images
CREATE POLICY "Suppliers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers
    WHERE user_id = auth.uid()
  )
);

-- Policy: Suppliers can update their own product images
CREATE POLICY "Suppliers can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers s
    INNER JOIN marketplace_products p ON p.supplier_id = s.id
    WHERE s.user_id = auth.uid()
    AND storage.objects.name LIKE p.id || '/%'
  )
);

-- Policy: Suppliers can delete their own product images
CREATE POLICY "Suppliers can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM suppliers s
    INNER JOIN marketplace_products p ON p.supplier_id = s.id
    WHERE s.user_id = auth.uid()
    AND storage.objects.name LIKE p.id || '/%'
  )
);

-- Policy: Admins can manage all product images
CREATE POLICY "Admins can manage all product images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- =================================================================
-- 3. HELPER FUNCTIONS FOR IMAGE MANAGEMENT
-- =================================================================

-- Function to get product image URLs
CREATE OR REPLACE FUNCTION get_product_image_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_project_ref', true) || 
         '.supabase.co/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$;

-- Function to validate image file size and type
CREATE OR REPLACE FUNCTION validate_product_image(
  file_size BIGINT,
  mime_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check file size (max 5MB)
  IF file_size > 5242880 THEN
    RAISE EXCEPTION 'File size exceeds 5MB limit';
  END IF;
  
  -- Check mime type
  IF mime_type NOT IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif') THEN
    RAISE EXCEPTION 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed';
  END IF;
  
  RETURN TRUE;
END;
$$;

-- =================================================================
-- 4. TRIGGER TO AUTO-DELETE IMAGES WHEN PRODUCT DELETED
-- =================================================================

-- Function to clean up product images when product is deleted
CREATE OR REPLACE FUNCTION cleanup_product_images()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  image_url TEXT;
  file_path TEXT;
BEGIN
  -- Loop through all images and delete from storage
  FOREACH image_url IN ARRAY OLD.images
  LOOP
    -- Extract file path from URL
    file_path := regexp_replace(image_url, '^.*/product-images/', '');
    
    -- Delete from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'product-images'
    AND name = file_path;
  END LOOP;
  
  RETURN OLD;
END;
$$;

-- Trigger to clean up images when product is deleted
DROP TRIGGER IF EXISTS trigger_cleanup_product_images ON marketplace_products;
CREATE TRIGGER trigger_cleanup_product_images
AFTER DELETE ON marketplace_products
FOR EACH ROW
EXECUTE FUNCTION cleanup_product_images();

-- =================================================================
-- NOTES
-- =================================================================
-- 1. Product images are stored in format: {product_id}/{timestamp}_{filename}
-- 2. Maximum 10 images per product (enforced in application)
-- 3. Recommended image dimensions: 1200x1200px minimum
-- 4. Images are automatically cleaned up when product is deleted
-- 5. Public bucket allows direct CDN access to images
-- ============================================================================
-- Additional migrations applied chronologically...
-- ============================================================================

-- Migration: 20251116120215_71189c74-c2d3-4f3e-a1af-87d7e6b5f8fa.sql
-- Fix search_path in database functions for security compliance
-- This ensures all functions operate within the public schema explicitly

-- Update update_production_batches_updated_at
CREATE OR REPLACE FUNCTION public.update_production_batches_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Update update_blog_post_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update create_update_notification
CREATE OR REPLACE FUNCTION public.create_update_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Notify the buyer
  INSERT INTO public.notifications (user_id, title, message, type, link)
  SELECT 
    orders.buyer_id,
    'Production Update: Order #' || orders.order_number,
    'New update at stage: ' || NEW.stage,
    'order_update',
    '/orders/' || NEW.order_id
  FROM public.orders
  WHERE orders.id = NEW.order_id;
  
  RETURN NEW;
END;
$function$;

-- Update update_production_stage_status
CREATE OR REPLACE FUNCTION public.update_production_stage_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set started_at when first update
  IF OLD.completion_percentage = 0 AND NEW.completion_percentage > 0 AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
    NEW.status = 'in_progress';
  END IF;
  
  -- Auto-set completed_at when 100%
  IF NEW.completion_percentage = 100 AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$function$;
-- Migration: 20251116151325_f86b3dc7-7db0-47f7-9ded-5e38d31a360a.sql
-- 1) Harden OTP tables: remove public SELECT access and restrict to service role only

-- Email OTPs
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verification_otps FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can verify their own OTPs" ON public.email_verification_otps;
-- Ensure service role policy exists and is correct
DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.email_verification_otps;
CREATE POLICY "Service role can manage OTPs"
ON public.email_verification_otps
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Phone OTPs
ALTER TABLE public.phone_verification_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_verification_otps FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can verify their own phone OTPs" ON public.phone_verification_otps;
DROP POLICY IF EXISTS "Service role can manage phone OTPs" ON public.phone_verification_otps;
CREATE POLICY "Service role can manage phone OTPs"
ON public.phone_verification_otps
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- 2) Tighten ai_quotes anonymous access window to 15 minutes (keeps session_id binding)
DROP POLICY IF EXISTS "Time-limited session access to quotes" ON public.ai_quotes;
CREATE POLICY "Time-limited session access to quotes"
ON public.ai_quotes
FOR SELECT TO anon
USING (
  auth.uid() IS NULL
  AND session_id IS NOT NULL
  AND session_id = (current_setting('request.jwt.claims', true))::json->>'session_id'
  AND created_at > (now() - interval '15 minutes')
);

-- Keep existing authenticated/admin policies as-is

-- Migration: 20251116162502_313dcba7-bfcf-494c-a64e-cf71fbf50750.sql
-- Security Hardening: Remove public OTP access and enable password breach protection

-- 1. Remove public access to phone verification OTPs (only service role should access)
DROP POLICY IF EXISTS "Users can verify their own phone OTPs" ON phone_verification_otps;
DROP POLICY IF EXISTS "Allow public to insert phone OTPs" ON phone_verification_otps;

-- 2. Remove public access to email verification OTPs (only service role should access)
DROP POLICY IF EXISTS "Users can verify their own email OTPs" ON email_verification_otps;
DROP POLICY IF EXISTS "Allow public to insert email OTPs" ON email_verification_otps;

-- 3. OTP tables should only be accessible via edge functions using service role
-- No RLS policies needed - edge functions will handle all OTP operations

-- Note: Leaked password protection is now enforced client-side via password-breach-check edge function
-- The ChangePasswordDialog component now validates passwords against HaveIBeenPwned before allowing changes
-- Migration: 20251116162906_3f25464d-5887-4c7d-8b37-5b07b75794a6.sql
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
-- Migration: 20251116171705_54ddacc9-3b19-4039-bee0-08ef16d43884.sql
-- Phase 1: Add missing auth trigger for profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Migration: 20251116180254_4d7502b1-7ec7-403a-800e-fd69215ce1fd.sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update product images
CREATE POLICY "Admins can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public read access to product images
CREATE POLICY "Anyone can view product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');
-- Migration: 20251116232824_64c73c67-138e-4857-8c99-0a5a41b33bd8.sql
-- Part 1: Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 30;
ALTER TABLE products ADD COLUMN IF NOT EXISTS moq INTEGER DEFAULT 50;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Part 2: Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_active ON product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON product_categories(display_order);

-- Part 3: Seed product categories
INSERT INTO product_categories (name, slug, display_order, is_active) VALUES
  ('Knitwear', 'knitwear', 1, true),
  ('Activewear', 'activewear', 2, true),
  ('Swimwear', 'swimwear', 3, true),
  ('Cut & Sew', 'cut-and-sew', 4, true),
  ('Uniforms & Teamwear', 'uniforms-teamwear', 5, true),
  ('Casual Wear', 'casual-wear', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Part 4: Add full-text search column and function
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_trigger() 
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS products_search_update ON products;
CREATE TRIGGER products_search_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_trigger();

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN(search_vector);

-- Update existing products with search vectors
UPDATE products SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C');

-- Part 5: Update existing products with sample data for new fields
UPDATE products 
SET 
  price = CASE 
    WHEN price IS NULL THEN (RANDOM() * 80 + 20)::DECIMAL(10,2)
    ELSE price 
  END,
  materials = CASE
    WHEN materials IS NULL THEN ARRAY['Cotton', 'Polyester']::TEXT[]
    ELSE materials
  END,
  lead_time_days = COALESCE(lead_time_days, 30),
  moq = COALESCE(moq, 100),
  popularity_score = COALESCE(popularity_score, FLOOR(RANDOM() * 100)::INTEGER)
WHERE id IS NOT NULL;

-- Part 6: Enable RLS on product_categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON product_categories;
CREATE POLICY "Public categories are viewable by everyone"
  ON product_categories FOR SELECT
  USING (true);

-- Ensure products RLS allows public read
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);
-- Migration: 20251116234043_f67b0d03-5c6e-474c-9fbc-c8e28e28a664.sql
-- SECURITY FIX: Add SET search_path = public to all SECURITY DEFINER functions
-- This prevents privilege escalation attacks via search path manipulation

-- Fix update_production_batches_updated_at
CREATE OR REPLACE FUNCTION public.update_production_batches_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Fix update_blog_post_updated_at
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_production_stage_status
CREATE OR REPLACE FUNCTION public.update_production_stage_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set started_at when first update
  IF OLD.completion_percentage = 0 AND NEW.completion_percentage > 0 AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
    NEW.status = 'in_progress';
  END IF;
  
  -- Auto-set completed_at when 100%
  IF NEW.completion_percentage = 100 AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix products_search_trigger
CREATE OR REPLACE FUNCTION public.products_search_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$function$;

-- Fix increment_blog_post_shares
CREATE OR REPLACE FUNCTION public.increment_blog_post_shares(post_id_param uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.blog_posts
  SET shares_count = shares_count + 1
  WHERE id = post_id_param;
END;
$function$;

-- Fix increment_blog_post_views
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id_param uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE id = post_id_param;
END;
$function$;
-- Migration: 20251117014619_cdf47967-5c53-4ac8-8d0d-ce2cc055fa87.sql
-- Create table for exit-intent popup sample requests (different from order-related samples)
CREATE TABLE IF NOT EXISTS public.exit_intent_sample_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'sent', 'fulfilled')),
  source TEXT DEFAULT 'exit_intent_popup' NOT NULL,
  notes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exit_intent_sample_email ON public.exit_intent_sample_requests(email);
CREATE INDEX IF NOT EXISTS idx_exit_intent_sample_created ON public.exit_intent_sample_requests(created_at);

-- Enable RLS
ALTER TABLE public.exit_intent_sample_requests ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to insert
CREATE POLICY "Edge functions can insert sample requests"
  ON public.exit_intent_sample_requests
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view sample requests"
  ON public.exit_intent_sample_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

COMMENT ON TABLE public.exit_intent_sample_requests IS 'Stores sample pack requests from exit-intent popup';
-- Migration: 20251117015024_d47b7ef9-be84-43eb-9ec4-b93c55d353e8.sql
-- Create enum for product interaction types
CREATE TYPE product_interaction_type AS ENUM (
  'hover',
  'quick_view_click',
  'wishlist_click',
  'color_swatch_click',
  'design_click',
  'quote_click',
  'add_to_cart',
  'view_details'
);

-- Create product_interactions table for analytics
CREATE TABLE public.product_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT NOT NULL,
  product_id UUID NOT NULL,
  interaction_type product_interaction_type NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  additional_data JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Create indexes for faster analytics queries
CREATE INDEX idx_product_interactions_product_id ON public.product_interactions(product_id);
CREATE INDEX idx_product_interactions_session_id ON public.product_interactions(session_id);
CREATE INDEX idx_product_interactions_user_id ON public.product_interactions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_product_interactions_timestamp ON public.product_interactions(timestamp DESC);
CREATE INDEX idx_product_interactions_type ON public.product_interactions(interaction_type);
CREATE INDEX idx_product_interactions_composite ON public.product_interactions(product_id, interaction_type, timestamp DESC);

-- Enable RLS
ALTER TABLE public.product_interactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert interactions (for anonymous tracking)
CREATE POLICY "Anyone can insert product interactions"
  ON public.product_interactions
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view interactions
CREATE POLICY "Admins can view all interactions"
  ON public.product_interactions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own interactions
CREATE POLICY "Users can view their own interactions"
  ON public.product_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create materialized view for product engagement metrics
CREATE MATERIALIZED VIEW public.product_engagement_metrics AS
SELECT 
  p.id as product_id,
  p.title as product_name,
  p.category,
  COUNT(DISTINCT pi.session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'hover') as hover_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'quick_view_click') as quick_view_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'wishlist_click') as wishlist_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'color_swatch_click') as color_swatch_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'design_click') as design_click_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'quote_click') as quote_click_count,
  COUNT(*) FILTER (WHERE pi.interaction_type = 'view_details') as view_details_count,
  MAX(pi.timestamp) as last_interaction,
  COUNT(*) as total_interactions
FROM public.products p
LEFT JOIN public.product_interactions pi ON p.id = pi.product_id
WHERE pi.timestamp > NOW() - INTERVAL '30 days' OR pi.timestamp IS NULL
GROUP BY p.id, p.title, p.category;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_product_engagement_metrics_product_id ON public.product_engagement_metrics(product_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_product_engagement_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.product_engagement_metrics;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION refresh_product_engagement_metrics() TO service_role;

COMMENT ON TABLE public.product_interactions IS 'Tracks all user interactions with product cards for analytics';
COMMENT ON MATERIALIZED VIEW public.product_engagement_metrics IS 'Aggregated product engagement metrics for the last 30 days';
COMMENT ON FUNCTION refresh_product_engagement_metrics() IS 'Refreshes the product engagement metrics materialized view';
-- Migration: 20251117020514_e6a1c666-2b44-4cb6-ae66-ddf46a3d8814.sql
-- Create wishlists table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX idx_wishlists_created_at ON wishlists(created_at DESC);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist"
  ON wishlists FOR UPDATE
  USING (auth.uid() = user_id);

-- Create rate limiting table
CREATE TABLE wishlist_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, window_start)
);

CREATE INDEX idx_wishlist_rate_limits_user ON wishlist_rate_limits(user_id, window_start);

-- Enable RLS for rate limits
ALTER TABLE wishlist_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage rate limits"
  ON wishlist_rate_limits FOR ALL
  USING (true)
  WITH CHECK (true);
-- Migration: 20251119000211_9226dde4-e684-42c1-82f5-ece2d376a236.sql
-- Revoke direct access to the materialized view from anon and authenticated
REVOKE ALL ON public.product_engagement_metrics FROM anon, authenticated;

-- Grant access only to service_role
GRANT SELECT ON public.product_engagement_metrics TO service_role;

-- Create a security definer function that wraps access
CREATE OR REPLACE FUNCTION public.get_product_engagement_metrics()
RETURNS SETOF public.product_engagement_metrics
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow admins to access this data
  SELECT *
  FROM public.product_engagement_metrics
  WHERE public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_product_engagement_metrics() TO authenticated;
-- Migration: 20251119005557_d0e64af9-ad20-4d7c-b2be-501eb80476de.sql
-- CRITICAL SECURITY FIX: Remove public DELETE, UPDATE, INSERT, and SELECT policies on production_stages
-- This prevents attackers from deleting, modifying, or viewing production data without authentication

-- Drop the dangerous public DELETE policy
DROP POLICY IF EXISTS "production_stages_delete_policy" ON public.production_stages;

-- Drop the public UPDATE policy
DROP POLICY IF EXISTS "production_stages_update_policy" ON public.production_stages;

-- Drop the public INSERT policy
DROP POLICY IF EXISTS "production_stages_insert_policy" ON public.production_stages;

-- Drop the public SELECT policy
DROP POLICY IF EXISTS "production_stages_select_policy" ON public.production_stages;

-- Note: The following properly restrictive policies are KEPT and remain active:
-- - "Admins can manage all production stages" (authenticated role)
-- - "Suppliers manage production stages" (authenticated role)  
-- - "Order participants view production stages" (authenticated role)
-- - "Suppliers can view stages for their orders" (authenticated role)
-- - "Suppliers can update stages for their orders" (authenticated role)

-- These restrictive policies properly scope access to authenticated users with appropriate permissions
-- Migration: 20251119010413_442cc18c-60e2-4ddd-9a24-fdd07d75fe79.sql
-- COMPREHENSIVE SECURITY FIX: Address all remaining RLS policy issues
-- This migration fixes 5 critical security vulnerabilities by removing overly permissive policies
-- and adding proper service_role restrictions where needed

-- ============================================================================
-- ISSUE 1 & 2: Remove overly permissive policies on sample_requests and sample_submissions
-- These tables had public SELECT/INSERT/UPDATE policies that exposed business-sensitive data
-- ============================================================================

-- Fix sample_requests table
DROP POLICY IF EXISTS "sample_requests_select_policy" ON public.sample_requests;
DROP POLICY IF EXISTS "sample_requests_insert_policy" ON public.sample_requests;
DROP POLICY IF EXISTS "sample_requests_update_policy" ON public.sample_requests;

-- Fix sample_submissions table
DROP POLICY IF EXISTS "sample_submissions_select_policy" ON public.sample_submissions;
DROP POLICY IF EXISTS "sample_submissions_insert_policy" ON public.sample_submissions;
DROP POLICY IF EXISTS "sample_submissions_update_policy" ON public.sample_submissions;

-- Note: Keeping the existing restrictive policies that properly scope access:
-- - "Order participants view sample requests/submissions"
-- - "Buyers manage sample requests"
-- - "Suppliers create/update sample submissions"

-- ============================================================================
-- ISSUE 3: Fix quote_usage_tracking - CRITICAL PII EXPOSURE
-- This table exposed user emails and IP addresses with public ALL access
-- ============================================================================

DROP POLICY IF EXISTS "System can manage quote usage" ON public.quote_usage_tracking;

-- Restrict to service_role only (for edge functions)
CREATE POLICY "Service role manages quote usage"
ON public.quote_usage_tracking
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: If authenticated users need to view their own data, uncomment below:
-- CREATE POLICY "Users view their own usage"
-- ON public.quote_usage_tracking
-- FOR SELECT
-- TO authenticated
-- USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================================================
-- ISSUE 4: Fix timeline_predictions - Public write access
-- Anyone could create/modify timeline predictions, affecting business intelligence
-- ============================================================================

DROP POLICY IF EXISTS "System can create predictions" ON public.timeline_predictions;
DROP POLICY IF EXISTS "System can update timeline predictions" ON public.timeline_predictions;

-- Restrict write operations to service_role only
CREATE POLICY "Service role manages predictions"
ON public.timeline_predictions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Keep the existing read policy "Users can view timelines for their quotes and orders"
-- which properly restricts SELECT to authenticated users viewing their own data

-- ============================================================================
-- ISSUE 5: Fix rate limiting tables - Security mechanism bypass risk
-- Four tables used public role instead of service_role, allowing manipulation
-- ============================================================================

-- Fix ai_quote_rate_limits
DROP POLICY IF EXISTS "Edge functions can manage rate limits" ON public.ai_quote_rate_limits;
CREATE POLICY "Service role manages AI quote rate limits"
ON public.ai_quote_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix conversation_rate_limits
DROP POLICY IF EXISTS "System manages rate limits" ON public.conversation_rate_limits;
CREATE POLICY "Service role manages conversation rate limits"
ON public.conversation_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix otp_rate_limits
DROP POLICY IF EXISTS "System can manage OTP rate limits" ON public.otp_rate_limits;
CREATE POLICY "Service role manages OTP rate limits"
ON public.otp_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix wishlist_rate_limits
DROP POLICY IF EXISTS "System can manage rate limits" ON public.wishlist_rate_limits;
CREATE POLICY "Service role manages wishlist rate limits"
ON public.wishlist_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- SECURITY FIX SUMMARY
-- ============================================================================
-- ✅ Removed 6 overly permissive policies (3 from sample_requests, 3 from sample_submissions)
-- ✅ Fixed PII exposure in quote_usage_tracking (emails, IPs)
-- ✅ Secured timeline_predictions against unauthorized writes
-- ✅ Protected 4 rate limiting tables from bypass attacks
-- ✅ All edge function operations now properly restricted to service_role
-- ============================================================================
-- Migration: 20251119140029_887f03c6-bdb2-46d4-ac7b-4b4868f9a169.sql
-- Add email delivery tracking fields to email_verification_otps table
ALTER TABLE email_verification_otps 
ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'bounced', 'delivered')),
ADD COLUMN IF NOT EXISTS delivery_error TEXT;

-- Add indexes for querying by delivery status
CREATE INDEX IF NOT EXISTS idx_email_verification_delivery_status 
ON email_verification_otps(delivery_status, created_at);

-- Add index for Resend email ID lookups (webhook updates)
CREATE INDEX IF NOT EXISTS idx_email_verification_resend_id 
ON email_verification_otps(resend_email_id) 
WHERE resend_email_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN email_verification_otps.resend_email_id IS 'Resend API email ID for tracking delivery status';
COMMENT ON COLUMN email_verification_otps.email_sent_at IS 'Timestamp when email was successfully sent via Resend';
COMMENT ON COLUMN email_verification_otps.delivery_status IS 'Email delivery status: pending, sent, failed, bounced, delivered';
COMMENT ON COLUMN email_verification_otps.delivery_error IS 'Error message if email delivery failed';
-- Migration: 20251120131648_76091c3c-ec15-4a1a-a0bc-3d265c494103.sql
-- Security Fix: Restrict social_shares table to service role only
-- Remove the overly permissive "Anyone can create shares" policy

DROP POLICY IF EXISTS "Anyone can create shares" ON public.social_shares;

-- Add ip_address column for rate limiting if it doesn't exist
ALTER TABLE public.social_shares 
ADD COLUMN IF NOT EXISTS ip_address text;

-- Add user_id column to email_verification_otps for efficient user lookup
ALTER TABLE public.email_verification_otps
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_user_id 
ON public.email_verification_otps(user_id);

-- Service role can manage social shares (for edge function)
CREATE POLICY "Service role can manage social shares"
ON public.social_shares
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow users to view share counts (read-only for analytics)
CREATE POLICY "Anyone can view social shares"
ON public.social_shares
FOR SELECT
USING (true);

-- Migration: 20251120233928_2016afb8-d720-4858-9e12-7fb4ebbd5de0.sql
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
-- Migration: 20251121001333_f0e74faa-4a90-4b82-a0ae-86267b97afb3.sql
-- Fix overly permissive RLS policies identified in security audit

-- Fix payment_history table
DROP POLICY IF EXISTS "System can create payments" ON public.payment_history;

CREATE POLICY "Service role can create payments" ON public.payment_history
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Fix admin_actions table  
DROP POLICY IF EXISTS "System can log admin actions" ON public.admin_actions;

CREATE POLICY "Service role can log actions" ON public.admin_actions
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
-- Migration: 20251121004548_412ae5d9-7426-4e57-a6d0-4e35e860ef95.sql
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
-- Migration: 20251121004736_fddceea9-b0a0-472e-a19e-b918c065f4ec.sql
-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message-attachments bucket
-- Users can upload files to their own folder
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view files from their conversations
CREATE POLICY "Users can view their conversation attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (
    -- Can view their own uploads
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- Or files from messages they're part of (sender or recipient)
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.attachments @> ARRAY[storage.objects.name]::text[]
      AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  )
);

-- Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
-- Migration: 20251121014007_e1ea3a7e-b3b2-4082-a10a-c5eff6b1135b.sql
-- Fix Critical Security Issue: production_stages overly permissive RLS policies
-- Remove existing public access policies that allow anyone to view/modify/delete production data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS production_stages_select_policy ON public.production_stages;
DROP POLICY IF EXISTS production_stages_update_policy ON public.production_stages;
DROP POLICY IF EXISTS production_stages_delete_policy ON public.production_stages;
DROP POLICY IF EXISTS "Allow public read access to production_stages" ON public.production_stages;
DROP POLICY IF EXISTS "Allow public insert access to production_stages" ON public.production_stages;

-- Buyers can view production stages for their own orders
CREATE POLICY "Buyers can view stages for their orders"
  ON public.production_stages FOR SELECT
  USING (
    supplier_order_id IN (
      SELECT so.id FROM supplier_orders so
      WHERE so.buyer_order_id IN (
        SELECT id FROM orders WHERE buyer_id = auth.uid()
      )
    )
  );

-- Suppliers can view and update stages for orders assigned to them
CREATE POLICY "Suppliers can view their assigned order stages"
  ON public.production_stages FOR SELECT
  USING (
    supplier_order_id IN (
      SELECT id FROM supplier_orders
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Suppliers can update their assigned order stages"
  ON public.production_stages FOR UPDATE
  USING (
    supplier_order_id IN (
      SELECT id FROM supplier_orders
      WHERE supplier_id IN (
        SELECT id FROM suppliers WHERE user_id = auth.uid()
      )
    )
  );

-- Admins have full access to all production stages
CREATE POLICY "Admins can view all production stages"
  ON public.production_stages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all production stages"
  ON public.production_stages FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete production stages"
  ON public.production_stages FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access to production stages"
  ON public.production_stages FOR ALL
  USING (auth.role() = 'service_role');
-- Migration: 20251121033912_261eea9c-4366-46d4-bb30-fed5b5f232a6.sql
-- Enable realtime for production_stages table
ALTER TABLE public.production_stages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.production_stages;

-- Enable realtime for order_updates table  
ALTER TABLE public.order_updates REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_updates;
-- Migration: 20251121034427_39244037-33e1-4348-ad98-cd88176e844f.sql
-- Strengthen B2B data access policies - Ensure buyers can only see their own data

-- =============================================================================
-- ORDERS TABLE - Add missing INSERT policy for buyers
-- =============================================================================

-- Allow buyers to create their own orders
CREATE POLICY "Buyers can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- =============================================================================
-- AI_QUOTES TABLE - Add user_id column for better security
-- =============================================================================

-- Add user_id column to ai_quotes if not exists (for better security than email matching)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ai_quotes' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.ai_quotes 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Drop old email-based policies and create user_id-based policies
DROP POLICY IF EXISTS "Authenticated users can view their quotes" ON public.ai_quotes;
DROP POLICY IF EXISTS "Authenticated users can update their quotes" ON public.ai_quotes;

-- New secure policy: Users can only view quotes they created
CREATE POLICY "Users can view their own quotes"
ON public.ai_quotes
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  -- Fallback for legacy quotes without user_id (match by email)
  (user_id IS NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
);

-- New secure policy: Users can only update quotes they created
CREATE POLICY "Users can update their own quotes"
ON public.ai_quotes
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR
  -- Fallback for legacy quotes without user_id (match by email)
  (user_id IS NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
);

-- Allow authenticated users to create quotes (user_id will be set by edge function or client)
DROP POLICY IF EXISTS "Authenticated users can create quotes" ON public.ai_quotes;
CREATE POLICY "Authenticated users can create quotes"
ON public.ai_quotes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR user_id IS NULL)
);

-- =============================================================================
-- ORDER_DOCUMENTS TABLE - Ensure strict access control
-- =============================================================================

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Users can view documents for their orders" ON public.order_documents;

-- Only order participants can view documents (buyers and suppliers)
CREATE POLICY "Order participants can view documents"
ON public.order_documents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_documents.order_id
    AND (orders.buyer_id = auth.uid() OR orders.supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    ))
  )
);

-- =============================================================================
-- INVOICES TABLE - Add DELETE protection
-- =============================================================================

-- Prevent anyone from deleting invoices (only service role should be able to)
CREATE POLICY "No one can delete invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (false);

-- =============================================================================
-- ORDERS TABLE - Add DELETE protection
-- =============================================================================

-- Prevent buyers from deleting orders (only admins should be able to)
CREATE POLICY "Only admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================================================
-- PAYMENT_HISTORY TABLE - Add DELETE protection
-- =============================================================================

-- Prevent anyone from deleting payment records (immutable audit trail)
CREATE POLICY "No one can delete payment records"
ON public.payment_history
FOR DELETE
TO authenticated
USING (false);

COMMENT ON POLICY "Buyers can create their own orders" ON public.orders IS 'Allows buyers to create orders but only if they set themselves as the buyer';
COMMENT ON POLICY "Users can view their own quotes" ON public.ai_quotes IS 'Users can only see quotes they created (by user_id or fallback to email for legacy data)';
COMMENT ON POLICY "Order participants can view documents" ON public.order_documents IS 'Only buyers and suppliers involved in an order can view its documents';
COMMENT ON POLICY "No one can delete invoices" ON public.invoices IS 'Invoices are immutable financial records - cannot be deleted by users';
COMMENT ON POLICY "Only admins can delete orders" ON public.orders IS 'Only admins can delete orders to prevent accidental data loss';
COMMENT ON POLICY "No one can delete payment records" ON public.payment_history IS 'Payment history is an immutable audit trail';
-- Migration: 20251121040812_6c4fea3b-d195-422d-83c9-ade0c9dc73db.sql
-- Add admin SELECT policies to rate limit tables for monitoring dashboard

CREATE POLICY "Admins can view AI quote rate limits"
ON public.ai_quote_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view conversation rate limits"
ON public.conversation_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view OTP rate limits"
ON public.otp_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can view wishlist rate limits"
ON public.wishlist_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
-- Migration: 20251121102811_6b971a85-8ab8-4ae6-bbab-87fe1caebacb.sql
-- Phase 2: Security Vulnerability Fixes

-- Step 2.1: Restrict Profile Data Access
-- Drop overly permissive policy and add restrictive policy
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;

CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- Step 2.2: Strengthen Session Token Security
-- Reduce ai_quotes session access from 15 minutes to 5 minutes
DROP POLICY IF EXISTS "Time-limited session access to quotes" ON public.ai_quotes;

CREATE POLICY "Time-limited session access to quotes"
ON public.ai_quotes
FOR SELECT
TO public
USING (
  (auth.uid() IS NOT NULL AND ((user_id = auth.uid()) OR ((user_id IS NULL) AND (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text))))
  OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (session_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'session_id'::text)) AND (created_at > (now() - interval '5 minutes')))
);

-- Reduce conversation_context session from 2 hours to 15 minutes
DROP POLICY IF EXISTS "Users view conversations with session support" ON public.conversation_context;

CREATE POLICY "Users view conversations with session support"
ON public.conversation_context
FOR SELECT
TO public
USING (
  ((auth.uid() IS NOT NULL) AND ((user_id = auth.uid()) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)))
  OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL) AND (created_at > (now() - interval '15 minutes')))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Step 2.3: Add SELECT Restrictions to Quote Requests
-- Ensure proper access control on quote_requests
CREATE POLICY "Admins can view all quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users view own quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- Step 2.4: Add Message Recipient Validation
-- Validate recipient exists before allowing message insert
CREATE OR REPLACE FUNCTION public.validate_message_recipient()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if recipient exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.recipient_id
  ) THEN
    RAISE EXCEPTION 'Invalid recipient';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_message_recipient_trigger
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_message_recipient();

-- Step 2.5: Restrict OTP Table Access
-- Block all authenticated user access to OTP tables (service_role only)
CREATE POLICY "Authenticated users cannot access email OTPs"
ON public.email_verification_otps
FOR ALL
TO authenticated
USING (false);

CREATE POLICY "Authenticated users cannot access phone OTPs"
ON public.phone_verification_otps
FOR ALL
TO authenticated
USING (false);

-- Step 2.6: Add Order Display Validation
-- Sanitize sensitive data when display_publicly is true
CREATE OR REPLACE FUNCTION public.sanitize_public_orders()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If order is marked for public display, clear sensitive pricing
  IF NEW.display_publicly = true THEN
    NEW.buyer_price := NULL;
    NEW.supplier_price := NULL;
    NEW.admin_margin := NULL;
    NEW.anonymized_client_name := COALESCE(NEW.anonymized_client_name, 'Anonymous Client');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER sanitize_public_orders_trigger
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
WHEN (NEW.display_publicly = true)
EXECUTE FUNCTION public.sanitize_public_orders();
-- Migration: 20251121151938_f8ef64fa-2788-4f5f-97ae-0cc88e97b4dc.sql
-- ============================================================================
-- Fix Critical Rate Limit and Public INSERT Security Issues
-- ============================================================================

-- 1. Fix ai_quote_rate_limits table - restrict to service_role only
-- ============================================================================

DROP POLICY IF EXISTS "Edge functions can manage rate limits" ON public.ai_quote_rate_limits;
DROP POLICY IF EXISTS "Service role manages AI quote rate limits" ON public.ai_quote_rate_limits;
DROP POLICY IF EXISTS "Admins can view AI quote rate limits" ON public.ai_quote_rate_limits;

-- Only service_role (edge functions) can manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.ai_quote_rate_limits 
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- 2. Fix blog_comments - remove public INSERT, require edge function
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;

-- Only admins can view all comments (for moderation)
CREATE POLICY "Admins can manage comments" 
ON public.blog_comments 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments" 
ON public.blog_comments 
FOR SELECT
USING (approved = true);

-- Only service_role can insert comments (via edge function)
CREATE POLICY "Service role can insert comments" 
ON public.blog_comments 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');


-- 3. Fix social_shares - remove public INSERT, require edge function
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can create shares" ON public.social_shares;
DROP POLICY IF EXISTS "Anyone can view shares" ON public.social_shares;

-- Only admins can view share data for analytics
CREATE POLICY "Admins can view shares" 
ON public.social_shares 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only service_role can insert shares (via edge function)
CREATE POLICY "Service role can track shares" 
ON public.social_shares 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');


-- 4. Fix quote_requests - tighten INSERT policy
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Authenticated users can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view their own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;

-- Only service_role can insert quote requests (via edge function)
CREATE POLICY "Service role can insert quote requests" 
ON public.quote_requests 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Users can view their own quote requests
CREATE POLICY "Users can view their own quote requests" 
ON public.quote_requests 
FOR SELECT
USING ((auth.uid() = user_id) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- Admins can view all quote requests
CREATE POLICY "Admins can view all quote requests" 
ON public.quote_requests 
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update quote requests
CREATE POLICY "Admins can update quote requests" 
ON public.quote_requests 
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migration: 20251121152921_c535d0b2-b802-4dec-a8a5-e41029b44e99.sql
-- =====================================================
-- Security Fix Migration: Remaining System Tables RLS
-- Fixes remaining overly permissive INSERT policies
-- =====================================================

-- Create bootstrap_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS public.bootstrap_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on bootstrap_attempts
ALTER TABLE public.bootstrap_attempts ENABLE ROW LEVEL SECURITY;

-- Only service_role can access bootstrap_attempts
CREATE POLICY "Service role manages bootstrap attempts"
ON public.bootstrap_attempts FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_bootstrap_attempts_ip_time 
ON public.bootstrap_attempts(ip_address, created_at DESC);

-- =====================================================
-- Fix notifications table
-- =====================================================
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Service role can create notifications" 
ON public.notifications FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix production_stages table
-- =====================================================
DROP POLICY IF EXISTS "production_stages_insert_policy" ON public.production_stages;
CREATE POLICY "Service role can insert production stages" 
ON public.production_stages FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix ai_usage_logs table
-- =====================================================
DROP POLICY IF EXISTS "System can create usage logs" ON public.ai_usage_logs;
CREATE POLICY "Service role can create usage logs" 
ON public.ai_usage_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix batch_contributions table
-- =====================================================
DROP POLICY IF EXISTS "System can create contributions" ON public.batch_contributions;
CREATE POLICY "Service role can create contributions" 
ON public.batch_contributions FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix timeline_predictions table
-- =====================================================
DROP POLICY IF EXISTS "System can create predictions" ON public.timeline_predictions;
CREATE POLICY "Service role can create predictions" 
ON public.timeline_predictions FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix capacity_utilization_logs table
-- =====================================================
DROP POLICY IF EXISTS "System can insert logs" ON public.capacity_utilization_logs;
CREATE POLICY "Service role can insert capacity logs" 
ON public.capacity_utilization_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- Fix conversation_analytics table
-- =====================================================
DROP POLICY IF EXISTS "System manages analytics" ON public.conversation_analytics;
CREATE POLICY "Service role manages analytics" 
ON public.conversation_analytics FOR INSERT
WITH CHECK (auth.role() = 'service_role');
-- Migration: 20251123052149_create_lead_capture_system.sql
-- Lead Capture System for MVP Data Collection
-- Purpose: Collect early interest before full signup to train AI models

-- Lead capture table for pre-signup data collection
CREATE TABLE IF NOT EXISTS public.lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Basic contact info
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  
  -- Lead qualification
  user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'supplier', 'both', 'not_sure')),
  interest_level TEXT CHECK (interest_level IN ('high', 'medium', 'low')),
  
  -- Additional context
  monthly_volume_range TEXT, -- e.g., "0-500", "500-2000", "2000+"
  primary_product_categories TEXT[], -- Array of product types they're interested in
  geographical_region TEXT, -- Where they operate
  source TEXT, -- How they found us (utm_source or manual entry)
  message TEXT, -- Any additional message/notes
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'disqualified')),
  qualified_by UUID REFERENCES auth.users(id),
  qualified_at TIMESTAMPTZ,
  converted_to_user_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  referral_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  browser_info JSONB,
  
  -- Admin notes
  admin_notes TEXT,
  follow_up_date DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_status ON public.lead_captures(status);
CREATE INDEX IF NOT EXISTS idx_lead_captures_user_type ON public.lead_captures(user_type);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON public.lead_captures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_captures_converted_to ON public.lead_captures(converted_to_user_id);

-- Event tracking table for analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event details
  event_name TEXT NOT NULL, -- e.g., 'homepage_cta_clicked', 'signup_completed', 'lead_form_submitted'
  event_category TEXT, -- e.g., 'engagement', 'conversion', 'navigation'
  
  -- User identification (nullable for anonymous events)
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  anonymous_id TEXT,
  
  -- Event context
  page_url TEXT,
  referrer TEXT,
  event_properties JSONB, -- Additional data about the event
  
  -- Technical metadata
  user_agent TEXT,
  ip_address INET,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);

-- RLS Policies

-- Lead captures: Public can insert, only admins can read/update
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead capture form"
  ON public.lead_captures
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all lead captures"
  ON public.lead_captures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lead captures"
  ON public.lead_captures
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Analytics events: Authenticated users can insert their own, admins can view all
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Update timestamp trigger for lead_captures
CREATE OR REPLACE FUNCTION public.update_lead_capture_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_captures_updated_at
  BEFORE UPDATE ON public.lead_captures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_capture_updated_at();

-- Helper function to track conversion from lead to user
CREATE OR REPLACE FUNCTION public.convert_lead_to_user(
  lead_email TEXT,
  new_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.lead_captures
  SET 
    status = 'converted',
    converted_to_user_id = new_user_id,
    updated_at = NOW()
  WHERE email = lead_email
  AND status != 'converted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.lead_captures TO anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT, UPDATE ON public.lead_captures TO authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;

COMMENT ON TABLE public.lead_captures IS 'Stores lead information from homepage form submissions before full signup - used for AI training data collection and lead qualification';
COMMENT ON TABLE public.analytics_events IS 'Tracks user events across the platform for analytics and behavior analysis';

-- ============================================================================
-- FINAL MIGRATION: Lead Capture System
-- ============================================================================
-- Lead Capture System for MVP Data Collection
-- Purpose: Collect early interest before full signup to train AI models

-- Lead capture table for pre-signup data collection
CREATE TABLE IF NOT EXISTS public.lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Basic contact info
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  
  -- Lead qualification
  user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'supplier', 'both', 'not_sure')),
  interest_level TEXT CHECK (interest_level IN ('high', 'medium', 'low')),
  
  -- Additional context
  monthly_volume_range TEXT, -- e.g., "0-500", "500-2000", "2000+"
  primary_product_categories TEXT[], -- Array of product types they're interested in
  geographical_region TEXT, -- Where they operate
  source TEXT, -- How they found us (utm_source or manual entry)
  message TEXT, -- Any additional message/notes
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'disqualified')),
  qualified_by UUID REFERENCES auth.users(id),
  qualified_at TIMESTAMPTZ,
  converted_to_user_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  referral_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  browser_info JSONB,
  
  -- Admin notes
  admin_notes TEXT,
  follow_up_date DATE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_status ON public.lead_captures(status);
CREATE INDEX IF NOT EXISTS idx_lead_captures_user_type ON public.lead_captures(user_type);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON public.lead_captures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_captures_converted_to ON public.lead_captures(converted_to_user_id);

-- Event tracking table for analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Event details
  event_name TEXT NOT NULL, -- e.g., 'homepage_cta_clicked', 'signup_completed', 'lead_form_submitted'
  event_category TEXT, -- e.g., 'engagement', 'conversion', 'navigation'
  
  -- User identification (nullable for anonymous events)
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  anonymous_id TEXT,
  
  -- Event context
  page_url TEXT,
  referrer TEXT,
  event_properties JSONB, -- Additional data about the event
  
  -- Technical metadata
  user_agent TEXT,
  ip_address INET,
  device_type TEXT,
  browser TEXT,
  os TEXT
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);

-- RLS Policies

-- Lead captures: Public can insert, only admins can read/update
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit lead capture form"
  ON public.lead_captures
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all lead captures"
  ON public.lead_captures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update lead captures"
  ON public.lead_captures
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Analytics events: Authenticated users can insert their own, admins can view all
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Update timestamp trigger for lead_captures
CREATE OR REPLACE FUNCTION public.update_lead_capture_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_captures_updated_at
  BEFORE UPDATE ON public.lead_captures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_capture_updated_at();

-- Helper function to track conversion from lead to user
CREATE OR REPLACE FUNCTION public.convert_lead_to_user(
  lead_email TEXT,
  new_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.lead_captures
  SET 
    status = 'converted',
    converted_to_user_id = new_user_id,
    updated_at = NOW()
  WHERE email = lead_email
  AND status != 'converted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.lead_captures TO anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT, UPDATE ON public.lead_captures TO authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;

COMMENT ON TABLE public.lead_captures IS 'Stores lead information from homepage form submissions before full signup - used for AI training data collection and lead qualification';
COMMENT ON TABLE public.analytics_events IS 'Tracks user events across the platform for analytics and behavior analysis';

-- ============================================================================
-- DATABASE SETUP COMPLETE!
-- ============================================================================
-- Next step: Run seed_READY_TO_RUN.sql to populate sample data
-- ============================================================================
