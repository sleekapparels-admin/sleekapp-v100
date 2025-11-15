export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_quote_rate_limits: {
        Row: {
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string
          request_count: number | null
          updated_at: string | null
          window_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          request_count?: number | null
          updated_at?: string | null
          window_start?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          request_count?: number | null
          updated_at?: string | null
          window_start?: string
        }
        Relationships: []
      }
      ai_quotes: {
        Row: {
          additional_requirements: string | null
          admin_markup: number | null
          ai_suggestions: string | null
          alternative_options: Json | null
          bangladesh_cost: number | null
          complexity_level: string | null
          converted_to_order_id: string | null
          country: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          estimated_delivery_days: number
          fabric_type: string | null
          id: string
          lead_notes: string | null
          lead_status: string | null
          phone_number: string | null
          product_type: string
          production_route: string | null
          quantity: number
          quote_data: Json
          session_id: string | null
          specialty_cost: number | null
          specialty_notes: string | null
          specialty_sourcing_required: boolean | null
          status: string | null
          total_price: number
        }
        Insert: {
          additional_requirements?: string | null
          admin_markup?: number | null
          ai_suggestions?: string | null
          alternative_options?: Json | null
          bangladesh_cost?: number | null
          complexity_level?: string | null
          converted_to_order_id?: string | null
          country?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          estimated_delivery_days: number
          fabric_type?: string | null
          id?: string
          lead_notes?: string | null
          lead_status?: string | null
          phone_number?: string | null
          product_type: string
          production_route?: string | null
          quantity: number
          quote_data: Json
          session_id?: string | null
          specialty_cost?: number | null
          specialty_notes?: string | null
          specialty_sourcing_required?: boolean | null
          status?: string | null
          total_price: number
        }
        Update: {
          additional_requirements?: string | null
          admin_markup?: number | null
          ai_suggestions?: string | null
          alternative_options?: Json | null
          bangladesh_cost?: number | null
          complexity_level?: string | null
          converted_to_order_id?: string | null
          country?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          estimated_delivery_days?: number
          fabric_type?: string | null
          id?: string
          lead_notes?: string | null
          lead_status?: string | null
          phone_number?: string | null
          product_type?: string
          production_route?: string | null
          quantity?: number
          quote_data?: Json
          session_id?: string | null
          specialty_cost?: number | null
          specialty_notes?: string | null
          specialty_sourcing_required?: boolean | null
          status?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_quotes_converted_to_order_id_fkey"
            columns: ["converted_to_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          created_at: string | null
          estimated_cost: number | null
          function_name: string
          id: string
          request_data: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_cost?: number | null
          function_name: string
          id?: string
          request_data?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_cost?: number | null
          function_name?: string
          id?: string
          request_data?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      batch_contributions: {
        Row: {
          batch_id: string | null
          buyer_price_per_unit: number
          committed_at: string | null
          contribution_margin: number | null
          id: string
          order_id: string | null
          quantity: number
          style_details: Json
        }
        Insert: {
          batch_id?: string | null
          buyer_price_per_unit: number
          committed_at?: string | null
          contribution_margin?: number | null
          id?: string
          order_id?: string | null
          quantity: number
          style_details: Json
        }
        Update: {
          batch_id?: string | null
          buyer_price_per_unit?: number
          committed_at?: string | null
          contribution_margin?: number | null
          id?: string
          order_id?: string | null
          quantity?: number
          style_details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "batch_contributions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "production_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_contributions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          approved: boolean | null
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published: boolean | null
          published_at: string | null
          seo_data: Json | null
          shares_count: number | null
          slug: string
          tags: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          excerpt: string
          featured_image_url: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          seo_data?: Json | null
          shares_count?: number | null
          slug: string
          tags?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          seo_data?: Json | null
          shares_count?: number | null
          slug?: string
          tags?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      capacity_utilization_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          orders_count: number | null
          revenue_generated: number | null
          supplier_id: string
          utilization_percentage: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          orders_count?: number | null
          revenue_generated?: number | null
          supplier_id: string
          utilization_percentage: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          orders_count?: number | null
          revenue_generated?: number | null
          supplier_id?: string
          utilization_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "capacity_utilization_logs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          challenge: string
          client_name: string
          created_at: string | null
          featured: boolean | null
          hero_image_url: string | null
          id: string
          industry: string
          metrics: Json | null
          process_images: Json | null
          product_type: string
          published: boolean | null
          quantity: number
          results: string
          solution: string
          testimonial: string
          testimonial_author: string
          title: string
        }
        Insert: {
          challenge: string
          client_name: string
          created_at?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          id?: string
          industry: string
          metrics?: Json | null
          process_images?: Json | null
          product_type: string
          published?: boolean | null
          quantity: number
          results: string
          solution: string
          testimonial: string
          testimonial_author: string
          title: string
        }
        Update: {
          challenge?: string
          client_name?: string
          created_at?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          id?: string
          industry?: string
          metrics?: Json | null
          process_images?: Json | null
          product_type?: string
          published?: boolean | null
          quantity?: number
          results?: string
          solution?: string
          testimonial?: string
          testimonial_author?: string
          title?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          active: boolean | null
          bg_color_class: string
          certificate_number: string | null
          certificate_url: string | null
          color_class: string
          created_at: string | null
          description: string
          display_order: number | null
          expiry_date: string | null
          icon_name: string
          id: string
          issue_date: string | null
          issuing_body: string | null
          name: string
          status: string
        }
        Insert: {
          active?: boolean | null
          bg_color_class: string
          certificate_number?: string | null
          certificate_url?: string | null
          color_class: string
          created_at?: string | null
          description: string
          display_order?: number | null
          expiry_date?: string | null
          icon_name: string
          id?: string
          issue_date?: string | null
          issuing_body?: string | null
          name: string
          status: string
        }
        Update: {
          active?: boolean | null
          bg_color_class?: string
          certificate_number?: string | null
          certificate_url?: string | null
          color_class?: string
          created_at?: string | null
          description?: string
          display_order?: number | null
          expiry_date?: string | null
          icon_name?: string
          id?: string
          issue_date?: string | null
          issuing_body?: string | null
          name?: string
          status?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          active: boolean | null
          address: string
          city: string | null
          country: string
          created_at: string | null
          display_order: number | null
          entity_type: string
          id: string
          legal_name: string
          registration_number: string | null
          state: string | null
          tax_id: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          address: string
          city?: string | null
          country: string
          created_at?: string | null
          display_order?: number | null
          entity_type: string
          id?: string
          legal_name: string
          registration_number?: string | null
          state?: string | null
          tax_id?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string | null
          country?: string
          created_at?: string | null
          display_order?: number | null
          entity_type?: string
          id?: string
          legal_name?: string
          registration_number?: string | null
          state?: string | null
          tax_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      conversation_analytics: {
        Row: {
          avg_messages_per_conversation: number | null
          buyer_conversations: number | null
          common_questions: Json | null
          completed_conversations: number | null
          created_at: string | null
          date: string
          id: string
          quotes_generated: number | null
          supplier_conversations: number | null
          total_conversations: number | null
          updated_at: string | null
        }
        Insert: {
          avg_messages_per_conversation?: number | null
          buyer_conversations?: number | null
          common_questions?: Json | null
          completed_conversations?: number | null
          created_at?: string | null
          date?: string
          id?: string
          quotes_generated?: number | null
          supplier_conversations?: number | null
          total_conversations?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_messages_per_conversation?: number | null
          buyer_conversations?: number | null
          common_questions?: Json | null
          completed_conversations?: number | null
          created_at?: string | null
          date?: string
          id?: string
          quotes_generated?: number | null
          supplier_conversations?: number | null
          total_conversations?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_context: {
        Row: {
          budget_range: string | null
          conversation_path: string | null
          created_at: string
          decision_stage: string | null
          design_readiness: string | null
          email: string | null
          extracted_data: Json | null
          id: string
          intent: string | null
          lead_score: number | null
          metadata: Json | null
          phone: string | null
          session_id: string
          stage: string | null
          status: string | null
          style_preference: string | null
          target_market: string | null
          timeline_urgency: string | null
          transcript: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget_range?: string | null
          conversation_path?: string | null
          created_at?: string
          decision_stage?: string | null
          design_readiness?: string | null
          email?: string | null
          extracted_data?: Json | null
          id?: string
          intent?: string | null
          lead_score?: number | null
          metadata?: Json | null
          phone?: string | null
          session_id: string
          stage?: string | null
          status?: string | null
          style_preference?: string | null
          target_market?: string | null
          timeline_urgency?: string | null
          transcript?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget_range?: string | null
          conversation_path?: string | null
          created_at?: string
          decision_stage?: string | null
          design_readiness?: string | null
          email?: string | null
          extracted_data?: Json | null
          id?: string
          intent?: string | null
          lead_score?: number | null
          metadata?: Json | null
          phone?: string | null
          session_id?: string
          stage?: string | null
          status?: string | null
          style_preference?: string | null
          target_market?: string | null
          timeline_urgency?: string | null
          transcript?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          quick_replies: Json | null
          role: string
          sentiment: string | null
          topics: string[] | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          quick_replies?: Json | null
          role: string
          sentiment?: string | null
          topics?: string[] | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          quick_replies?: Json | null
          role?: string
          sentiment?: string | null
          topics?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversation_context"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_rate_limits: {
        Row: {
          created_at: string
          id: string
          identifier: string
          request_count: number
          updated_at: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      defects: {
        Row: {
          created_at: string | null
          defect_type: string
          description: string | null
          id: string
          photo_url: string | null
          qc_check_id: string
          quantity: number
          severity: string
        }
        Insert: {
          created_at?: string | null
          defect_type: string
          description?: string | null
          id?: string
          photo_url?: string | null
          qc_check_id: string
          quantity: number
          severity: string
        }
        Update: {
          created_at?: string | null
          defect_type?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          qc_check_id?: string
          quantity?: number
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "defects_qc_check_id_fkey"
            columns: ["qc_check_id"]
            isOneToOne: false
            referencedRelation: "qc_checks"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verification_otps: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          ip_address: string | null
          otp: string
          session_id: string | null
          verified: boolean | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          ip_address?: string | null
          otp: string
          session_id?: string | null
          verified?: boolean | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          otp?: string
          session_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          base_currency: string
          created_at: string
          fetched_at: string
          id: string
          rate: number
          target_currency: string
          valid_until: string
        }
        Insert: {
          base_currency?: string
          created_at?: string
          fetched_at?: string
          id?: string
          rate: number
          target_currency: string
          valid_until: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          fetched_at?: string
          id?: string
          rate?: number
          target_currency?: string
          valid_until?: string
        }
        Relationships: []
      }
      factory_capacity: {
        Row: {
          available_capacity: number | null
          created_at: string | null
          current_utilization: number
          date: string
          id: string
          machines_count: number | null
          shift_hours: number | null
          supplier_id: string
          total_capacity: number
          updated_at: string | null
          workers_count: number | null
        }
        Insert: {
          available_capacity?: number | null
          created_at?: string | null
          current_utilization?: number
          date?: string
          id?: string
          machines_count?: number | null
          shift_hours?: number | null
          supplier_id: string
          total_capacity?: number
          updated_at?: string | null
          workers_count?: number | null
        }
        Update: {
          available_capacity?: number | null
          created_at?: string | null
          current_utilization?: number
          date?: string
          id?: string
          machines_count?: number | null
          shift_hours?: number | null
          supplier_id?: string
          total_capacity?: number
          updated_at?: string | null
          workers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_capacity_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          subcategory: string | null
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          order_id: string | null
          paid_at: string | null
          payment_type: string
          pdf_url: string | null
          status: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          order_id?: string | null
          paid_at?: string | null
          payment_type: string
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          order_id?: string | null
          paid_at?: string | null
          payment_type?: string
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_messages: boolean
          email_orders: boolean
          email_payments: boolean
          email_production: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_messages?: boolean
          email_orders?: boolean
          email_payments?: boolean
          email_production?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_messages?: boolean
          email_orders?: boolean
          email_payments?: boolean
          email_production?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          link: string | null
          message: string
          metadata: Json | null
          notification_type: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          notification_type?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          notification_type?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          order_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_type?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          order_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          order_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      order_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          message: string
          order_id: string
          read_by: string[] | null
          sender_id: string
          sender_role: string
          translated_message: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message: string
          order_id: string
          read_by?: string[] | null
          sender_id: string
          sender_role: string
          translated_message?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message?: string
          order_id?: string
          read_by?: string[] | null
          sender_id?: string
          sender_role?: string
          translated_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["order_workflow_status"]
          notes: string | null
          old_status:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
          order_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["order_workflow_status"]
          notes?: string | null
          old_status?:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
          order_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["order_workflow_status"]
          notes?: string | null
          old_status?:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_updates: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          created_by: string
          id: string
          message: string | null
          order_id: string
          photos: string[] | null
          stage: Database["public"]["Enums"]["production_stage"]
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          created_by: string
          id?: string
          message?: string | null
          order_id: string
          photos?: string[] | null
          stage: Database["public"]["Enums"]["production_stage"]
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          created_by?: string
          id?: string
          message?: string | null
          order_id?: string
          photos?: string[] | null
          stage?: Database["public"]["Enums"]["production_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "order_updates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_date: string | null
          admin_margin: number | null
          admin_notes: string | null
          anonymized_client_name: string | null
          assigned_at: string | null
          assigned_by: string | null
          balance_amount: number | null
          balance_paid_at: string | null
          buyer_id: string
          buyer_price: number | null
          created_at: string | null
          current_stage: Database["public"]["Enums"]["production_stage"] | null
          deposit_amount: number | null
          deposit_paid_at: string | null
          display_publicly: boolean | null
          expected_delivery_date: string | null
          factory_id: string | null
          id: string
          is_demo_order: boolean | null
          margin_percentage: number | null
          milestone_tracker: Json | null
          notes: string | null
          order_number: string
          payment_status: string | null
          product_type: string
          production_status: string | null
          quantity: number
          quote_id: string | null
          stage_progress: Json | null
          status: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          supplier_id: string | null
          supplier_price: number | null
          target_date: string | null
          tracking_token: string | null
          updated_at: string | null
          workflow_status:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
        }
        Insert: {
          actual_delivery_date?: string | null
          admin_margin?: number | null
          admin_notes?: string | null
          anonymized_client_name?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          balance_amount?: number | null
          balance_paid_at?: string | null
          buyer_id: string
          buyer_price?: number | null
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["production_stage"] | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          display_publicly?: boolean | null
          expected_delivery_date?: string | null
          factory_id?: string | null
          id?: string
          is_demo_order?: boolean | null
          margin_percentage?: number | null
          milestone_tracker?: Json | null
          notes?: string | null
          order_number: string
          payment_status?: string | null
          product_type: string
          production_status?: string | null
          quantity: number
          quote_id?: string | null
          stage_progress?: Json | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          supplier_id?: string | null
          supplier_price?: number | null
          target_date?: string | null
          tracking_token?: string | null
          updated_at?: string | null
          workflow_status?:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
        }
        Update: {
          actual_delivery_date?: string | null
          admin_margin?: number | null
          admin_notes?: string | null
          anonymized_client_name?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          balance_amount?: number | null
          balance_paid_at?: string | null
          buyer_id?: string
          buyer_price?: number | null
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["production_stage"] | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          display_publicly?: boolean | null
          expected_delivery_date?: string | null
          factory_id?: string | null
          id?: string
          is_demo_order?: boolean | null
          margin_percentage?: number | null
          milestone_tracker?: Json | null
          notes?: string | null
          order_number?: string
          payment_status?: string | null
          product_type?: string
          production_status?: string | null
          quantity?: number
          quote_id?: string | null
          stage_progress?: Json | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          supplier_id?: string | null
          supplier_price?: number | null
          target_date?: string | null
          tracking_token?: string | null
          updated_at?: string | null
          workflow_status?:
            | Database["public"]["Enums"]["order_workflow_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_rate_limits: {
        Row: {
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      otp_verification_attempts: {
        Row: {
          attempt_time: string
          created_at: string
          id: string
          identifier: string
          identifier_type: string
          ip_address: string | null
          success: boolean
        }
        Insert: {
          attempt_time?: string
          created_at?: string
          id?: string
          identifier: string
          identifier_type: string
          ip_address?: string | null
          success?: boolean
        }
        Update: {
          attempt_time?: string
          created_at?: string
          id?: string
          identifier?: string
          identifier_type?: string
          ip_address?: string | null
          success?: boolean
        }
        Relationships: []
      }
      phone_verification_otps: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          otp: string
          phone: string
          session_id: string | null
          verified: boolean | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          otp: string
          phone: string
          session_id?: string | null
          verified?: boolean | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          otp?: string
          phone?: string
          session_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      production_batches: {
        Row: {
          actual_start_date: string | null
          batch_status: string | null
          complexity_multiplier: number | null
          created_at: string | null
          current_quantity: number | null
          current_style_count: number | null
          estimated_start_date: string | null
          id: string
          max_styles: number | null
          product_category: string
          product_variant_base: string
          supplier_id: string | null
          target_quantity: number
          unit_price_base: number
          updated_at: string | null
          window_closes_at: string | null
        }
        Insert: {
          actual_start_date?: string | null
          batch_status?: string | null
          complexity_multiplier?: number | null
          created_at?: string | null
          current_quantity?: number | null
          current_style_count?: number | null
          estimated_start_date?: string | null
          id?: string
          max_styles?: number | null
          product_category: string
          product_variant_base: string
          supplier_id?: string | null
          target_quantity?: number
          unit_price_base: number
          updated_at?: string | null
          window_closes_at?: string | null
        }
        Update: {
          actual_start_date?: string | null
          batch_status?: string | null
          complexity_multiplier?: number | null
          created_at?: string | null
          current_quantity?: number | null
          current_style_count?: number | null
          estimated_start_date?: string | null
          id?: string
          max_styles?: number | null
          product_category?: string
          product_variant_base?: string
          supplier_id?: string | null
          target_quantity?: number
          unit_price_base?: number
          updated_at?: string | null
          window_closes_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_batches_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      production_stages: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          description: string | null
          id: string
          notes: string | null
          photos: string[] | null
          stage_name: string
          stage_number: number
          started_at: string | null
          status: string
          supplier_order_id: string
          target_date: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          photos?: string[] | null
          stage_name: string
          stage_number: number
          started_at?: string | null
          status?: string
          supplier_order_id: string
          target_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          photos?: string[] | null
          stage_name?: string
          stage_number?: number
          started_at?: string | null
          status?: string
          supplier_order_id?: string
          target_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_stages_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ai_generated_image: boolean | null
          category: string
          colors: string[] | null
          created_at: string
          description: string | null
          featured: boolean | null
          gauge: string | null
          id: string
          image_approved_by_admin: boolean | null
          image_generation_date: string | null
          image_generation_prompt: string | null
          image_url: string
          title: string
          updated_at: string
          yarn: string | null
        }
        Insert: {
          ai_generated_image?: boolean | null
          category: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          gauge?: string | null
          id?: string
          image_approved_by_admin?: boolean | null
          image_generation_date?: string | null
          image_generation_prompt?: string | null
          image_url: string
          title: string
          updated_at?: string
          yarn?: string | null
        }
        Update: {
          ai_generated_image?: boolean | null
          category?: string
          colors?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          gauge?: string | null
          id?: string
          image_approved_by_admin?: boolean | null
          image_generation_date?: string | null
          image_generation_prompt?: string | null
          image_url?: string
          title?: string
          updated_at?: string
          yarn?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qc_checks: {
        Row: {
          check_date: string
          created_at: string | null
          failed_pieces: number
          id: string
          inspector_id: string
          notes: string | null
          order_id: string
          passed_pieces: number
          photos: string[] | null
          stage: Database["public"]["Enums"]["production_stage"]
          total_pieces_checked: number
        }
        Insert: {
          check_date?: string
          created_at?: string | null
          failed_pieces: number
          id?: string
          inspector_id: string
          notes?: string | null
          order_id: string
          passed_pieces: number
          photos?: string[] | null
          stage: Database["public"]["Enums"]["production_stage"]
          total_pieces_checked: number
        }
        Update: {
          check_date?: string
          created_at?: string | null
          failed_pieces?: number
          id?: string
          inspector_id?: string
          notes?: string | null
          order_id?: string
          passed_pieces?: number
          photos?: string[] | null
          stage?: Database["public"]["Enums"]["production_stage"]
          total_pieces_checked?: number
        }
        Relationships: [
          {
            foreignKeyName: "qc_checks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_configurations: {
        Row: {
          base_lead_time_days: number | null
          base_price_per_unit: number
          complexity_multiplier: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          material_cost_multipliers: Json | null
          moq_max: number
          moq_min: number
          product_category: string
          production_days_per_100_units: number | null
          sampling_days: number | null
          updated_at: string
        }
        Insert: {
          base_lead_time_days?: number | null
          base_price_per_unit: number
          complexity_multiplier?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          material_cost_multipliers?: Json | null
          moq_max: number
          moq_min: number
          product_category: string
          production_days_per_100_units?: number | null
          sampling_days?: number | null
          updated_at?: string
        }
        Update: {
          base_lead_time_days?: number | null
          base_price_per_unit?: number
          complexity_multiplier?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          material_cost_multipliers?: Json | null
          moq_max?: number
          moq_min?: number
          product_category?: string
          production_days_per_100_units?: number | null
          sampling_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          gauge: string | null
          id: string
          name: string
          notes: string
          product_type: string
          quantity: number
          session_id: string | null
          status: string
          target_date: string | null
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          gauge?: string | null
          id?: string
          name: string
          notes: string
          product_type: string
          quantity: number
          session_id?: string | null
          status?: string
          target_date?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          gauge?: string | null
          id?: string
          name?: string
          notes?: string
          product_type?: string
          quantity?: number
          session_id?: string | null
          status?: string
          target_date?: string | null
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      quote_usage_tracking: {
        Row: {
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          quote_count: number | null
          session_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          quote_count?: number | null
          session_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          quote_count?: number | null
          session_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          additional_requirements: string | null
          ai_estimation: Json | null
          buyer_id: string | null
          complexity_level: string | null
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          customization_details: string | null
          fabric_type: string | null
          id: string
          matched_supplier_ids: string[] | null
          product_type: string
          quantity: number
          reference_image_urls: string[] | null
          session_id: string | null
          status: string
          target_delivery_date: string | null
          target_moq: number | null
          target_price_per_unit: number | null
          tech_pack_urls: string[] | null
          updated_at: string
        }
        Insert: {
          additional_requirements?: string | null
          ai_estimation?: Json | null
          buyer_id?: string | null
          complexity_level?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customization_details?: string | null
          fabric_type?: string | null
          id?: string
          matched_supplier_ids?: string[] | null
          product_type: string
          quantity: number
          reference_image_urls?: string[] | null
          session_id?: string | null
          status?: string
          target_delivery_date?: string | null
          target_moq?: number | null
          target_price_per_unit?: number | null
          tech_pack_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          additional_requirements?: string | null
          ai_estimation?: Json | null
          buyer_id?: string | null
          complexity_level?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customization_details?: string | null
          fabric_type?: string | null
          id?: string
          matched_supplier_ids?: string[] | null
          product_type?: string
          quantity?: number
          reference_image_urls?: string[] | null
          session_id?: string | null
          status?: string
          target_delivery_date?: string | null
          target_moq?: number | null
          target_price_per_unit?: number | null
          tech_pack_urls?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      sample_requests: {
        Row: {
          approved_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          rejected_at: string | null
          requested_at: string | null
          requested_by: string | null
          sample_type: string
          specifications: Json | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          rejected_at?: string | null
          requested_at?: string | null
          requested_by?: string | null
          sample_type: string
          specifications?: Json | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          rejected_at?: string | null
          requested_at?: string | null
          requested_by?: string | null
          sample_type?: string
          specifications?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      sample_submissions: {
        Row: {
          approved: boolean | null
          created_at: string | null
          feedback: string | null
          id: string
          measurements: Json | null
          photos: string[] | null
          sample_request_id: string
          submitted_at: string | null
          submitted_by: string | null
          supplier_notes: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          measurements?: Json | null
          photos?: string[] | null
          sample_request_id: string
          submitted_at?: string | null
          submitted_by?: string | null
          supplier_notes?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          measurements?: Json | null
          photos?: string[] | null
          sample_request_id?: string
          submitted_at?: string | null
          submitted_by?: string | null
          supplier_notes?: string | null
        }
        Relationships: []
      }
      shipping_info: {
        Row: {
          actual_delivery: string | null
          carrier: string | null
          created_at: string
          current_location: string | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_id: string
          shipped_date: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string
          current_location?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id: string
          shipped_date?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          carrier?: string | null
          created_at?: string
          current_location?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          shipped_date?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          id: string
          platform: string
          post_id: string
          session_id: string | null
          shared_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          platform: string
          post_id: string
          session_id?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          platform?: string
          post_id?: string
          session_id?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_capabilities: {
        Row: {
          created_at: string | null
          gauge_range: string | null
          id: string
          materials: string[]
          product_category: string
          supplier_id: string
          techniques: string[]
        }
        Insert: {
          created_at?: string | null
          gauge_range?: string | null
          id?: string
          materials?: string[]
          product_category: string
          supplier_id: string
          techniques?: string[]
        }
        Update: {
          created_at?: string | null
          gauge_range?: string | null
          id?: string
          materials?: string[]
          product_category?: string
          supplier_id?: string
          techniques?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "supplier_capabilities_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_certifications: {
        Row: {
          certification_body: string | null
          certification_name: string
          created_at: string | null
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          supplier_id: string
          verified: boolean | null
        }
        Insert: {
          certification_body?: string | null
          certification_name: string
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          supplier_id: string
          verified?: boolean | null
        }
        Update: {
          certification_body?: string | null
          certification_name?: string
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          supplier_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_certifications_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_media: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          media_type: string
          supplier_id: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type: string
          supplier_id: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          media_type?: string
          supplier_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_media_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_messages: {
        Row: {
          attachments: string[] | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          sender_id: string
          supplier_order_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          sender_id: string
          supplier_order_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          sender_id?: string
          supplier_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_messages_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_mou_terms: {
        Row: {
          base_price: number
          complexity_premium_percent: number | null
          created_at: string | null
          extra_style_lead_time: number | null
          id: string
          lead_time_days: number | null
          max_styles_allowed: number | null
          monthly_batch_minimum: number | null
          moq_per_batch: number | null
          mou_document_url: string | null
          signed_at: string | null
          status: string | null
          supplier_id: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          complexity_premium_percent?: number | null
          created_at?: string | null
          extra_style_lead_time?: number | null
          id?: string
          lead_time_days?: number | null
          max_styles_allowed?: number | null
          monthly_batch_minimum?: number | null
          moq_per_batch?: number | null
          mou_document_url?: string | null
          signed_at?: string | null
          status?: string | null
          supplier_id?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          complexity_premium_percent?: number | null
          created_at?: string | null
          extra_style_lead_time?: number | null
          id?: string
          lead_time_days?: number | null
          max_styles_allowed?: number | null
          monthly_batch_minimum?: number | null
          moq_per_batch?: number | null
          mou_document_url?: string | null
          signed_at?: string | null
          status?: string | null
          supplier_id?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_mou_terms_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_orders: {
        Row: {
          acceptance_status: string | null
          accepted_at: string | null
          buyer_order_id: string | null
          buyer_price: number | null
          counter_offer_notes: string | null
          counter_offer_price: number | null
          created_at: string
          created_by: string
          id: string
          margin: number | null
          order_number: string
          product_type: string
          quantity: number
          reference_images: string[] | null
          rejected_at: string | null
          rejection_reason: string | null
          special_instructions: string | null
          status: string
          supplier_id: string | null
          supplier_price: number | null
          target_date: string | null
          tech_pack_urls: string[] | null
          updated_at: string
        }
        Insert: {
          acceptance_status?: string | null
          accepted_at?: string | null
          buyer_order_id?: string | null
          buyer_price?: number | null
          counter_offer_notes?: string | null
          counter_offer_price?: number | null
          created_at?: string
          created_by: string
          id?: string
          margin?: number | null
          order_number: string
          product_type: string
          quantity: number
          reference_images?: string[] | null
          rejected_at?: string | null
          rejection_reason?: string | null
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          supplier_price?: number | null
          target_date?: string | null
          tech_pack_urls?: string[] | null
          updated_at?: string
        }
        Update: {
          acceptance_status?: string | null
          accepted_at?: string | null
          buyer_order_id?: string | null
          buyer_price?: number | null
          counter_offer_notes?: string | null
          counter_offer_price?: number | null
          created_at?: string
          created_by?: string
          id?: string
          margin?: number | null
          order_number?: string
          product_type?: string
          quantity?: number
          reference_images?: string[] | null
          rejected_at?: string | null
          rejection_reason?: string | null
          special_instructions?: string | null
          status?: string
          supplier_id?: string | null
          supplier_price?: number | null
          target_date?: string | null
          tech_pack_urls?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_orders_buyer_order_id_fkey"
            columns: ["buyer_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_performance: {
        Row: {
          actual_delivery_date: string | null
          committed_delivery_date: string
          communication_score: number | null
          created_at: string
          id: string
          notes: string | null
          on_time: boolean | null
          overall_score: number | null
          quality_score: number | null
          supplier_id: string
          supplier_order_id: string
        }
        Insert: {
          actual_delivery_date?: string | null
          committed_delivery_date: string
          communication_score?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          on_time?: boolean | null
          overall_score?: number | null
          quality_score?: number | null
          supplier_id: string
          supplier_order_id: string
        }
        Update: {
          actual_delivery_date?: string | null
          committed_delivery_date?: string
          communication_score?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          on_time?: boolean | null
          overall_score?: number | null
          quality_score?: number | null
          supplier_id?: string
          supplier_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_performance_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_performance_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: true
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_quotes: {
        Row: {
          id: string
          lead_time_days: number
          materials_description: string | null
          moq_offered: number
          notes: string | null
          pricing_breakdown: Json | null
          quote_id: string
          status: string
          submitted_at: string | null
          supplier_id: string
          terms_conditions: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          id?: string
          lead_time_days: number
          materials_description?: string | null
          moq_offered: number
          notes?: string | null
          pricing_breakdown?: Json | null
          quote_id: string
          status?: string
          submitted_at?: string | null
          supplier_id: string
          terms_conditions?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          id?: string
          lead_time_days?: number
          materials_description?: string | null
          moq_offered?: number
          notes?: string | null
          pricing_breakdown?: Json | null
          quote_id?: string
          status?: string
          submitted_at?: string | null
          supplier_id?: string
          terms_conditions?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_quotes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_ratings: {
        Row: {
          buyer_id: string
          communication_score: number | null
          created_at: string | null
          delivery_score: number | null
          id: string
          on_time_delivery: boolean | null
          order_id: string | null
          overall_score: number | null
          quality_score: number | null
          review_text: string | null
          supplier_id: string
          would_recommend: boolean | null
        }
        Insert: {
          buyer_id: string
          communication_score?: number | null
          created_at?: string | null
          delivery_score?: number | null
          id?: string
          on_time_delivery?: boolean | null
          order_id?: string | null
          overall_score?: number | null
          quality_score?: number | null
          review_text?: string | null
          supplier_id: string
          would_recommend?: boolean | null
        }
        Update: {
          buyer_id?: string
          communication_score?: number | null
          created_at?: string | null
          delivery_score?: number | null
          id?: string
          on_time_delivery?: boolean | null
          order_id?: string | null
          overall_score?: number | null
          quality_score?: number | null
          review_text?: string | null
          supplier_id?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_ratings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          about: string | null
          address: string | null
          auto_accept_orders: boolean | null
          avg_capacity_utilization: number | null
          business_registration_number: string | null
          capacity_update_frequency: string | null
          company_name: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          factory_location: string
          id: string
          lead_time_days: number
          managed_by_sleek: boolean | null
          moq_maximum: number | null
          moq_minimum: number
          on_time_delivery_rate: number | null
          performance_score: number | null
          specializations: string[] | null
          tier: Database["public"]["Enums"]["supplier_tier"]
          total_capacity_monthly: number | null
          total_orders_completed: number | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website_url: string | null
          workforce_size: number | null
          year_established: number | null
        }
        Insert: {
          about?: string | null
          address?: string | null
          auto_accept_orders?: boolean | null
          avg_capacity_utilization?: number | null
          business_registration_number?: string | null
          capacity_update_frequency?: string | null
          company_name: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          factory_location: string
          id?: string
          lead_time_days?: number
          managed_by_sleek?: boolean | null
          moq_maximum?: number | null
          moq_minimum?: number
          on_time_delivery_rate?: number | null
          performance_score?: number | null
          specializations?: string[] | null
          tier?: Database["public"]["Enums"]["supplier_tier"]
          total_capacity_monthly?: number | null
          total_orders_completed?: number | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website_url?: string | null
          workforce_size?: number | null
          year_established?: number | null
        }
        Update: {
          about?: string | null
          address?: string | null
          auto_accept_orders?: boolean | null
          avg_capacity_utilization?: number | null
          business_registration_number?: string | null
          capacity_update_frequency?: string | null
          company_name?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          factory_location?: string
          id?: string
          lead_time_days?: number
          managed_by_sleek?: boolean | null
          moq_maximum?: number | null
          moq_minimum?: number
          on_time_delivery_rate?: number | null
          performance_score?: number | null
          specializations?: string[] | null
          tier?: Database["public"]["Enums"]["supplier_tier"]
          total_capacity_monthly?: number | null
          total_orders_completed?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website_url?: string | null
          workforce_size?: number | null
          year_established?: number | null
        }
        Relationships: []
      }
      timeline_predictions: {
        Row: {
          accuracy_score: number | null
          actual_completion_date: string | null
          confidence_score: number | null
          created_at: string
          estimated_completion_date: string
          id: string
          order_id: string | null
          quote_id: string | null
          stages: Json
          total_days: number
        }
        Insert: {
          accuracy_score?: number | null
          actual_completion_date?: string | null
          confidence_score?: number | null
          created_at?: string
          estimated_completion_date: string
          id?: string
          order_id?: string | null
          quote_id?: string | null
          stages: Json
          total_days: number
        }
        Update: {
          accuracy_score?: number | null
          actual_completion_date?: string | null
          confidence_score?: number | null
          created_at?: string
          estimated_completion_date?: string
          id?: string
          order_id?: string | null
          quote_id?: string | null
          stages?: Json
          total_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "timeline_predictions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_predictions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "ai_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      assign_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      calculate_factory_match_score: {
        Args: {
          p_quantity: number
          p_supplier_id: string
          p_target_date: string
        }
        Returns: number
      }
      check_otp_rate_limit: {
        Args: { p_identifier: string; p_identifier_type: string }
        Returns: Json
      }
      generate_invoice_number: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_blog_post_shares: {
        Args: { post_id_param: string }
        Returns: undefined
      }
      increment_blog_post_views: {
        Args: { post_id_param: string }
        Returns: undefined
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
        }
        Returns: string
      }
      log_otp_attempt: {
        Args: {
          p_identifier: string
          p_identifier_type: string
          p_ip_address?: string
          p_success: boolean
        }
        Returns: string
      }
      remove_user_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      update_order_status: {
        Args: {
          p_new_status: Database["public"]["Enums"]["order_workflow_status"]
          p_notes?: string
          p_order_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "retailer"
        | "wholesaler"
        | "educational"
        | "corporate"
        | "sports_team"
        | "factory"
        | "admin"
        | "supplier"
      order_workflow_status:
        | "quote_requested"
        | "quote_sent"
        | "admin_review"
        | "awaiting_payment"
        | "payment_received"
        | "assigned_to_supplier"
        | "sample_requested"
        | "sample_submitted"
        | "sample_approved"
        | "bulk_production"
        | "qc_inspection"
        | "ready_to_ship"
        | "shipped"
        | "delivered"
        | "completed"
        | "cancelled"
        | "on_hold"
      production_stage:
        | "yarn_received"
        | "knitting"
        | "linking"
        | "washing_finishing"
        | "final_qc"
        | "packing"
        | "ready_to_ship"
      supplier_tier: "bronze" | "silver" | "gold"
      verification_status: "pending" | "verified" | "rejected" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "retailer",
        "wholesaler",
        "educational",
        "corporate",
        "sports_team",
        "factory",
        "admin",
        "supplier",
      ],
      order_workflow_status: [
        "quote_requested",
        "quote_sent",
        "admin_review",
        "awaiting_payment",
        "payment_received",
        "assigned_to_supplier",
        "sample_requested",
        "sample_submitted",
        "sample_approved",
        "bulk_production",
        "qc_inspection",
        "ready_to_ship",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "on_hold",
      ],
      production_stage: [
        "yarn_received",
        "knitting",
        "linking",
        "washing_finishing",
        "final_qc",
        "packing",
        "ready_to_ship",
      ],
      supplier_tier: ["bronze", "silver", "gold"],
      verification_status: ["pending", "verified", "rejected", "suspended"],
    },
  },
} as const
