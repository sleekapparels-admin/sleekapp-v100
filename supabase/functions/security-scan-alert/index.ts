import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface SecurityFinding {
  id: string;
  level: 'error' | 'warn' | 'info';
  name: string;
  description: string;
  details?: string;
}

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all critical and high-severity security findings
    const { data: findings, error } = await supabase
      .from('security_findings')
      .select('*')
      .in('level', ['error', 'warn'])
      .eq('ignore', false)
      .order('level', { ascending: true });

    if (error) throw error;

    // Only send alert if there are critical/high findings
    if (!findings || findings.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No critical security findings to report' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Group findings by severity
    const criticalFindings = findings.filter(f => f.level === 'error');
    const highFindings = findings.filter(f => f.level === 'warn');

    // Format email content
    const emailHtml = `
      <h2>🚨 Security Scan Alert - Action Required</h2>
      <p>Security vulnerabilities have been detected in your Sleek Apparels application.</p>
      
      ${criticalFindings.length > 0 ? `
        <h3 style="color: #dc2626;">Critical Severity (${criticalFindings.length})</h3>
        <ul>
          ${criticalFindings.map(f => `
            <li>
              <strong>${f.name}</strong><br/>
              ${f.description}<br/>
              ${f.details ? `<em style="color: #666;">${f.details}</em>` : ''}
            </li>
          `).join('')}
        </ul>
      ` : ''}
      
      ${highFindings.length > 0 ? `
        <h3 style="color: #ea580c;">High Severity (${highFindings.length})</h3>
        <ul>
          ${highFindings.map(f => `
            <li>
              <strong>${f.name}</strong><br/>
              ${f.description}<br/>
              ${f.details ? `<em style="color: #666;">${f.details}</em>` : ''}
            </li>
          `).join('')}
        </ul>
      ` : ''}
      
      <p><strong>Recommended Actions:</strong></p>
      <ol>
        <li>Review all findings in your Cloud Backend security dashboard</li>
        <li>Prioritize critical severity issues for immediate remediation</li>
        <li>Address high severity issues within 24-48 hours</li>
        <li>Update your security playbook if new threat patterns emerge</li>
      </ol>
      
      <p style="color: #666; font-size: 12px;">
        This is an automated security alert from your Sleek Apparels security monitoring system.
      </p>
    `;

    // Send alert email via Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Security Alerts <notifications@sleekapparels.com>',
        to: ['inquiry@sleekapparels.com'],
        subject: `🚨 Security Alert: ${criticalFindings.length} Critical, ${highFindings.length} High Severity Issues`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Email failed: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Security alert sent successfully',
        emailId: emailData.id,
        findings: {
          critical: criticalFindings.length,
          high: highFindings.length,
          total: findings.length
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security alert error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
