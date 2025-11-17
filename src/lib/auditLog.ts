import { supabase } from '@/integrations/supabase/client';

export type AuditAction = 
  | 'blog_post_created'
  | 'blog_post_updated'
  | 'blog_post_deleted'
  | 'blog_post_published'
  | 'blog_post_unpublished'
  | 'user_role_assigned'
  | 'user_role_revoked';

export type AuditResourceType = 
  | 'blog_post'
  | 'user_role'
  | 'user';

interface LogAdminActionParams {
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details?: Record<string, any>;
}

export const logAdminAction = async ({
  action,
  resourceType,
  resourceId,
  details = {},
}: LogAdminActionParams): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('Cannot log action: No authenticated user');
      return;
    }

    // Get IP address and user agent from browser
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: session.user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        details: details,
        user_agent: userAgent,
        // IP address will be captured by edge functions or database triggers
      });

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

export const getAuditLogs = async (limit = 50) => {
  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }

  return data || [];
};
