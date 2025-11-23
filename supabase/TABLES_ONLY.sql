-- ============================================================================
-- TABLES ONLY - NO FUNCTIONS
-- ============================================================================
-- This creates all tables and types WITHOUT functions that might fail
-- Run this first, then we'll add functions separately if needed
-- ============================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET client_min_messages = warning;
SET row_security = off;

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
CREATE TYPE public.production_stage AS ENUM (
    'yarn_received',
    'knitting',
    'linking',
    'washing_finishing',
    'final_qc',
    'packing',
    'ready_to_ship'
);
CREATE TYPE public.supplier_tier AS ENUM (
    'bronze',
    'silver',
    'gold'
);
CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'verified',
    'rejected',
    'suspended'
);

-- TABLES --
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
CREATE TABLE public.ai_usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text,
    user_id uuid,
    function_name text NOT NULL,
    estimated_cost numeric(10,4),
    request_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.blog_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    color text DEFAULT '#10b981'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.capacity_utilization_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    date date NOT NULL,
    utilization_percentage numeric(5,2) NOT NULL,
    orders_count integer DEFAULT 0,
    revenue_generated numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.conversation_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    request_count integer DEFAULT 1 NOT NULL,
    window_start timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.exchange_rates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    base_currency text DEFAULT 'USD'::text NOT NULL,
    target_currency text NOT NULL,
    rate numeric(10,6) NOT NULL,
    fetched_at timestamp with time zone DEFAULT now() NOT NULL,
    valid_until timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.order_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    old_status public.order_workflow_status,
    new_status public.order_workflow_status NOT NULL,
    changed_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.otp_rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    identifier_type text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.otp_verification_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    identifier_type text NOT NULL,
    attempt_time timestamp with time zone DEFAULT now() NOT NULL,
    success boolean DEFAULT false NOT NULL,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.quote_usage_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    ip_address text,
    session_id text,
    quote_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.social_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    platform text NOT NULL,
    shared_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    session_id text
);
CREATE TABLE public.supplier_capabilities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    product_category text NOT NULL,
    materials text[] DEFAULT '{}'::text[] NOT NULL,
    techniques text[] DEFAULT '{}'::text[] NOT NULL,
    gauge_range text,
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.supplier_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_id uuid NOT NULL,
    media_type text NOT NULL,
    url text NOT NULL,
    caption text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.supplier_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_order_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    message text NOT NULL,
    attachments text[],
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    role public.app_role DEFAULT 'retailer'::public.app_role NOT NULL
);

-- ============================================================================
-- Tables created! Now you can run seed_READY_TO_RUN.sql
-- ============================================================================
