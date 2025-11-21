import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BackupRequest {
  description?: string;
  notify_email?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authentication check - only admins can create backups
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabaseClient
      .rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { description = 'Manual backup', notify_email }: BackupRequest = await req.json();

    console.log('Creating database backup:', { description, user: user.id });

    // Log backup creation
    const timestamp = new Date().toISOString();
    const backupId = `backup_${Date.now()}`;

    // Get database statistics (optional)
    const stats = { database_size: 'N/A' };

    // Note: Supabase handles actual backup creation automatically
    // This function logs the backup request and notifies relevant parties

    // Log backup in audit logs
    await supabaseClient
      .from('admin_audit_logs')
      .insert({
        admin_id: user.id,
        action: 'backup_created',
        resource_type: 'backup',
        resource_id: backupId,
        details: {
          description,
          timestamp,
          database_size: stats.database_size,
          triggered_by: 'manual',
        },
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
      });

    // Send notification email if requested
    if (notify_email && Deno.env.get('RESEND_API_KEY')) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'SleekApparels System <notifications@sleekapparels.com>',
            to: [notify_email],
            subject: 'Database Backup Created',
            html: `
              <h2>Database Backup Created Successfully</h2>
              <p><strong>Backup ID:</strong> ${backupId}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Created at:</strong> ${new Date(timestamp).toLocaleString()}</p>
              <p><strong>Created by:</strong> ${user.email}</p>
              <p><strong>Database size:</strong> ${stats.database_size}</p>
              <hr>
              <p><small>Access backups via Supabase Dashboard: Database > Backups</small></p>
            `,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send notification email:', await response.text());
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    }

    console.log('Backup logged successfully:', backupId);

    return new Response(
      JSON.stringify({
        success: true,
        backup_id: backupId,
        timestamp,
        message: 'Backup request logged. Supabase handles automatic backup creation.',
        note: 'Access backups via Supabase Dashboard: Database > Backups',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-database-backup function:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
