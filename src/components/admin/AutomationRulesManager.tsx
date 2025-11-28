import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Zap, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  rule_name: string;
  rule_type: string;
  active: boolean;
  priority: number;
  conditions: any;
  actions: any;
  created_at: string;
}

export const AutomationRulesManager = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      if (data) {
        setRules(data.map(r => ({
          ...r,
          active: r.active ?? false,
          priority: r.priority ?? 0
        })));
      }
    } catch (error: any) {
      toast.error(`Failed to load rules: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({ active: !currentActive })
        .eq('id', ruleId);

      if (error) throw error;

      toast.success(`Rule ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchRules();
    } catch (error: any) {
      toast.error('Failed to toggle rule');
    }
  };

  const executeRulesNow = async () => {
    try {
      setExecuting(true);
      
      const { data, error } = await supabase.functions.invoke('execute-automation-rules');

      if (error) throw error;

      console.log('Automation results:', data);
      toast.success(`Executed ${data.results?.length || 0} rules`);
    } catch (error: any) {
      toast.error('Failed to execute rules');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automation Rules</h2>
          <p className="text-muted-foreground">Manage automated workflows</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={executeRulesNow} disabled={executing} variant="outline">
            {executing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            Execute Now
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Rule
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{rule.rule_name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{rule.rule_type}</Badge>
                    <Badge variant="secondary">Priority: {rule.priority}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{rule.active ? 'Active' : 'Inactive'}</span>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => toggleRule(rule.id, rule.active)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Conditions</h4>
                  <pre className="bg-secondary p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(rule.conditions, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Actions</h4>
                  <pre className="bg-secondary p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(rule.actions, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
              <p className="text-muted-foreground mb-4">Create rules to automate workflows</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};