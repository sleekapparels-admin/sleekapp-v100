/**
 * Type-safe helper functions for Supabase operations
 * Use these helpers to get better type inference with the loosely-typed client
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  Order,
  OrderWithRelations,
  UserNotification,
  Invoice,
  OrderDocument,
  AIQuote,
  Supplier,
  Profile,
  UserRole,
  BlogPost,
  InsertData,
  UpdateData,
} from '@/types/database';

/**
 * Generic type-safe query builder
 * Usage: const { data, error } = await queryTable<Order>('orders').select('*').eq('buyer_id', userId);
 */
export const queryTable = <T>(tableName: string): any => {
  return (supabase as any).from(tableName) as any;
};

/**
 * Orders helpers
 */
export const orderHelpers = {
  async getById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    return { data: data as Order | null, error };
  },

  async getByBuyerId(buyerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    return { data: data as Order[] | null, error };
  },

  async getWithRelations(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        order_documents(*),
        order_messages(*),
        order_updates(*)
      `)
      .eq('id', orderId)
      .maybeSingle();
    return { data: data as any as OrderWithRelations | null, error };
  },

  async updateStatus(orderId: string, status: string, notes?: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    return { data: data as Order | null, error };
  },

  async getByFactoryId(factoryId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('factory_id', factoryId)
      .order('created_at', { ascending: false });
    return { data: data as Order[] | null, error };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Order[] | null, error };
  },

  async getNewOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:buyer_id (full_name, company_name, email)
      `)
      .eq('workflow_status', 'quote_requested')
      .order('created_at', { ascending: false })
      .limit(10);
    return { data: data as any[] | null, error };
  },
};

/**
 * Notifications helpers
 */
export const notificationHelpers = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data: data as UserNotification[] | null, error };
  },

  async markAsRead(notificationId: string) {
    const { data, error} = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .select()
      .single();
    return { data: data as UserNotification | null, error };
  },

  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)
      .select();
    return { data: data as UserNotification[] | null, error };
  },

  async create(notification: InsertData<UserNotification>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification as any)
      .select()
      .single();
    return { data: data as UserNotification | null, error };
  },
};

/**
 * AI Quotes helpers
 */
export const quoteHelpers = {
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });
    return { data: data as AIQuote[] | null, error };
  },

  async getById(quoteId: string) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .select('*')
      .eq('id', quoteId)
      .maybeSingle();
    return { data: data as AIQuote | null, error };
  },

  async updateStatus(quoteId: string, status: string) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .update({ status })
      .eq('id', quoteId)
      .select()
      .single();
    return { data: data as AIQuote | null, error };
  },

  async create(quote: InsertData<AIQuote>) {
    const { data, error } = await supabase
      .from('ai_quotes')
      .insert(quote as any)
      .select()
      .single();
    return { data: data as AIQuote | null, error };
  },
};

/**
 * Suppliers helpers
 */
export const supplierHelpers = {
  async getVerified() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('verification_status', 'verified')
      .order('rating', { ascending: false });
    return { data: data as any as Supplier[] | null, error };
  },

  async getById(supplierId: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .maybeSingle();
    return { data: data as any as Supplier | null, error };
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return { data: data as any as Supplier | null, error };
  },
};

/**
 * User roles helpers
 */
export const roleHelpers = {
  async getUserRole(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return { data: data as UserRole | null, error };
  },

  async hasRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', role as any)
      .maybeSingle();
    return { hasRole: !!data, error };
  },

  async assignRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: role as any } as any)
      .select()
      .single();
    return { data: data as UserRole | null, error };
  },
};

/**
 * Profile helpers
 */
export const profileHelpers = {
  async getByUserId(userId: string): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return { data: data as any as Profile | null, error };
  },

  async update(userId: string, updates: UpdateData<Profile>): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single();
    return { data: data as any as Profile | null, error };
  },
};

/**
 * Invoice helpers
 */
export const invoiceHelpers = {
  async getByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    return { data: data as Invoice[] | null, error };
  },

  async getById(invoiceId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .maybeSingle();
    return { data: data as Invoice | null, error };
  },

  async updateStatus(invoiceId: string, status: string) {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
      .select()
      .single();
    return { data: data as Invoice | null, error };
  },
};

/**
 * Document helpers
 */
export const documentHelpers = {
  async getByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from('order_documents')
      .select('*')
      .eq('order_id', orderId)
      .order('uploaded_at', { ascending: false });
    return { data: data as OrderDocument[] | null, error };
  },

  async upload(document: InsertData<OrderDocument>) {
    const { data, error } = await supabase
      .from('order_documents')
      .insert(document as any)
      .select()
      .single();
    return { data: data as OrderDocument | null, error };
  },

  async delete(documentId: string) {
    const { error } = await supabase
      .from('order_documents')
      .delete()
      .eq('id', documentId);
    return { error };
  },
};

/**
 * Blog helpers
 */
export const blogHelpers = {
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    return { data: data as BlogPost[] | null, error };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    return { data: data as BlogPost | null, error };
  },

  async incrementViews(postId: string) {
    const { error } = await supabase.rpc('increment_blog_views' as any, {
      post_id: postId,
    });
    return { error };
  },
};
