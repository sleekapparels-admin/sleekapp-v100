import { supabase } from '@/integrations/supabase/client';
import { logError } from './sentry';

// Comprehensive audit action types
export type EnhancedAuditAction = 
  // Blog operations
  | 'blog_post_created'
  | 'blog_post_updated'
  | 'blog_post_deleted'
  | 'blog_post_published'
  | 'blog_post_unpublished'
  // User & role operations
  | 'user_role_assigned'
  | 'user_role_revoked'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'user_login'
  | 'user_logout'
  | 'user_password_reset'
  // Order operations
  | 'order_created'
  | 'order_updated'
  | 'order_status_changed'
  | 'order_assigned'
  | 'order_cancelled'
  // Payment operations
  | 'payment_initiated'
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_refunded'
  | 'invoice_generated'
  | 'invoice_sent'
  // Quote operations
  | 'quote_created'
  | 'quote_approved'
  | 'quote_rejected'
  | 'quote_converted'
  // Supplier operations
  | 'supplier_created'
  | 'supplier_updated'
  | 'supplier_verified'
  | 'supplier_suspended'
  | 'supplier_assigned'
  // Product operations
  | 'product_created'
  | 'product_updated'
  | 'product_deleted'
  | 'product_viewed'
  // Production operations
  | 'production_stage_updated'
  | 'work_order_generated'
  | 'quality_check_completed'
  // Security operations
  | 'security_breach_detected'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'unauthorized_access_attempt'
  // Data access operations
  | 'sensitive_data_accessed'
  | 'data_exported'
  | 'data_deleted'
  // System operations
  | 'backup_created'
  | 'backup_restored'
  | 'settings_changed'
  | 'automation_rule_triggered';

export type EnhancedAuditResourceType = 
  | 'blog_post'
  | 'user_role'
  | 'user'
  | 'order'
  | 'payment'
  | 'invoice'
  | 'quote'
  | 'supplier'
  | 'product'
  | 'production_stage'
  | 'work_order'
  | 'audit_log'
  | 'system'
  | 'backup';

export interface EnhancedAuditLogParams {
  action: EnhancedAuditAction;
  resourceType: EnhancedAuditResourceType;
  resourceId?: string;
  details?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Enhanced audit logging with IP capture and error tracking
 * Use this for all sensitive operations
 */
export const logEnhancedAudit = async ({
  action,
  resourceType,
  resourceId,
  details = {},
  severity = 'info',
}: EnhancedAuditLogParams): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // For security events, log even without session
    const userId = session?.user?.id || null;
    
    // Call edge function for server-side logging with IP capture
    const { error } = await supabase.functions.invoke('log-audit-action', {
      body: {
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        details: {
          ...details,
          severity,
          timestamp: new Date().toISOString(),
        },
        user_id: userId,
      },
    });

    if (error) {
      console.error('Failed to log audit action:', error);
      logError(new Error('Audit logging failed'), { action, resourceType, error });
    }
  } catch (error) {
    console.error('Error in audit logging:', error);
    logError(error as Error, { action, resourceType });
  }
};

/**
 * Log security events (unauthorized access, suspicious activity)
 */
export const logSecurityEvent = async (
  action: Extract<EnhancedAuditAction, 'security_breach_detected' | 'suspicious_activity' | 'unauthorized_access_attempt' | 'rate_limit_exceeded'>,
  details: Record<string, any>
) => {
  await logEnhancedAudit({
    action,
    resourceType: 'system',
    details,
    severity: 'critical',
  });
};

/**
 * Log data access for sensitive operations
 */
export const logDataAccess = async (
  resourceType: EnhancedAuditResourceType,
  resourceId: string,
  operation: 'read' | 'write' | 'delete' | 'export',
  details?: Record<string, any>
) => {
  await logEnhancedAudit({
    action: operation === 'export' ? 'data_exported' : 
            operation === 'delete' ? 'data_deleted' : 
            'sensitive_data_accessed',
    resourceType,
    resourceId,
    details: {
      operation,
      ...details,
    },
    severity: operation === 'delete' || operation === 'export' ? 'warning' : 'info',
  });
};

/**
 * Get audit logs with filtering
 */
export const getEnhancedAuditLogs = async (filters?: {
  action?: EnhancedAuditAction;
  resourceType?: EnhancedAuditResourceType;
  userId?: string;
  startDate?: string;
  endDate?: string;
  severity?: string;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }
    if (filters?.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }
    if (filters?.userId) {
      query = query.eq('admin_id', filters.userId);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters?.severity) {
      query = query.contains('details', { severity: filters.severity });
    }

    query = query.limit(filters?.limit || 100);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};
