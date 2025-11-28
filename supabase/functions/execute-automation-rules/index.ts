import { serve } from "https://deno.land/std@0.207.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AutomationAction {
  type: string;
  params: {
    table?: string;
    new_status?: string;
    id?: string;
    [key: string]: unknown;
  };
}

interface ActionResult {
  action: string;
  success: boolean;
  error?: unknown;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authentication check - only admins can execute automation rules
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Executing automation rules...");

    // Fetch all active automation rules
    const { data: rules, error: rulesError } = await supabaseClient
      .from('automation_rules')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });

    if (rulesError) throw rulesError;

    console.log(`Found ${rules?.length || 0} active rules`);

    const results = [];

    for (const rule of rules || []) {
      try {
        console.log(`Executing rule: ${rule.rule_name}`);

        // Check conditions
        const conditionsMet = await evaluateConditions(supabaseClient, rule.conditions);

        if (conditionsMet) {
          // Execute actions
          const actionResults = await executeActions(supabaseClient, rule.actions);
          
          results.push({
            rule_id: rule.id,
            rule_name: rule.rule_name,
            executed: true,
            actions: actionResults
          });

          // Log execution
          await supabaseClient.from('admin_actions').insert({
            action_type: 'automation_rule_executed',
            entity_type: 'automation_rule',
            entity_id: rule.id,
            details: { rule_name: rule.rule_name, actions: actionResults }
          });
        } else {
          results.push({
            rule_id: rule.id,
            rule_name: rule.rule_name,
            executed: false,
            reason: 'Conditions not met'
          });
        }
      } catch (error: unknown) {
        console.error(`Error executing rule ${rule.rule_name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          rule_id: rule.id,
          rule_name: rule.rule_name,
          executed: false,
          error: errorMessage
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in execute-automation-rules:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function evaluateConditions(_client: SupabaseClient, _conditions: unknown): Promise<boolean> {
  // Simplified condition evaluation
  // In production, implement full condition logic
  console.log("Evaluating conditions:", _conditions);
  return true; // Placeholder
}

async function executeActions(client: SupabaseClient, actions: AutomationAction[]): Promise<ActionResult[]> {
  const results: ActionResult[] = [];

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'send_email':
          // Call send-notification-email function
          console.log("Sending email:", action.params);
          results.push({ action: 'send_email', success: true });
          break;

        case 'update_status': {
          const { error } = await client
            .from(action.params.table)
            .update({ status: action.params.new_status })
            .eq('id', action.params.id);
          
          results.push({ action: 'update_status', success: !error, error });
          break;
        }

        case 'assign_supplier':
          // Call AI supplier assignment
          console.log("Assigning supplier:", action.params);
          results.push({ action: 'assign_supplier', success: true });
          break;

        default:
          console.log("Unknown action type:", action.type);
      }
    } catch (error: unknown) {
      console.error("Action error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ action: action.type, success: false, error: errorMessage });
    }
  }

  return results;
}