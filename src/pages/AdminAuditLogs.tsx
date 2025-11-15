import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { getAuditLogs } from '@/lib/auditLog';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const AdminAuditLogs = () => {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingLogs(true);
      const data = await getAuditLogs(100);
      setLogs(data);
      setLoadingLogs(false);
    };

    if (isAdmin) {
      fetchLogs();
    }
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return null;
  }

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      created: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      updated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      deleted: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      published: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      unpublished: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };

    const type = action.split('_').pop() || 'default';
    const colorClass = colors[type] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {action.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Audit Logs</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              Complete log of all administrative actions performed on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading audit logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No audit logs found
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getActionBadge(log.action)}
                          <span className="text-sm font-medium">
                            {log.resource_type.replace(/_/g, ' ')}
                          </span>
                          {log.resource_id && (
                            <span className="text-xs text-muted-foreground font-mono">
                              ID: {log.resource_id.slice(0, 8)}
                            </span>
                          )}
                        </div>
                        
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {log.details.title && (
                              <div>Title: <span className="font-medium">{log.details.title}</span></div>
                            )}
                            {log.details.slug && (
                              <div>Slug: <span className="font-mono text-xs">{log.details.slug}</span></div>
                            )}
                          </div>
                        )}
                        
                        {log.user_agent && (
                          <div className="text-xs text-muted-foreground">
                            Device: {log.user_agent.slice(0, 80)}...
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        <div>{format(new Date(log.created_at), 'MMM dd, yyyy')}</div>
                        <div className="text-xs">{format(new Date(log.created_at), 'HH:mm:ss')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
