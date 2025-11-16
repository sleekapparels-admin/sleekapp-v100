import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote } from "@/hooks/useQuotes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calculator, Globe } from "lucide-react";

interface SpecialtySourcingPanelProps {
  quote: Quote;
  onUpdate: () => void;
}

export const SpecialtySourcingPanel = ({ quote, onUpdate }: SpecialtySourcingPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialty_sourcing_required: quote.specialty_sourcing_required || false,
    production_route: quote.production_route || 'bangladesh_only',
    specialty_notes: quote.specialty_notes || '',
    bangladesh_cost: quote.bangladesh_cost || 0,
    specialty_cost: quote.specialty_cost || 0,
    admin_markup: quote.admin_markup || 0,
  });

  const calculateTotalQuote = () => {
    const route = formData.production_route;
    if (route === 'bangladesh_only') {
      return (formData.bangladesh_cost + formData.admin_markup).toFixed(2);
    } else if (route === 'specialty_only') {
      return (formData.specialty_cost + formData.admin_markup).toFixed(2);
    } else {
      // hybrid: average of both
      return ((formData.bangladesh_cost + formData.specialty_cost) / 2 + formData.admin_markup).toFixed(2);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('ai_quotes')
        .update({
          specialty_sourcing_required: formData.specialty_sourcing_required,
          production_route: formData.production_route,
          specialty_notes: formData.specialty_notes,
          bangladesh_cost: formData.bangladesh_cost,
          specialty_cost: formData.specialty_cost,
          admin_markup: formData.admin_markup,
        })
        .eq('id', quote.id);

      if (error) throw error;
      
      toast.success("Specialty sourcing updated");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating specialty sourcing:", error);
      toast.error("Failed to update specialty sourcing");
    }
  };

  return (
    <Card className="border-amber-200 dark:border-amber-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-600" />
          Specialty Sourcing Management
          <Badge variant={formData.specialty_sourcing_required ? "default" : "secondary"}>
            {formData.specialty_sourcing_required ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Specialty Sourcing</p>
                <p className="text-sm">{formData.specialty_sourcing_required ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Production Route</p>
                <p className="text-sm capitalize">{formData.production_route?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bangladesh Cost</p>
                <p className="text-sm">${formData.bangladesh_cost || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Specialty Cost</p>
                <p className="text-sm">${formData.specialty_cost || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admin Markup</p>
                <p className="text-sm">${formData.admin_markup || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quote</p>
                <p className="text-sm font-bold text-primary">${calculateTotalQuote()}</p>
              </div>
            </div>
            {formData.specialty_notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Internal Notes</p>
                <p className="text-sm">{formData.specialty_notes}</p>
              </div>
            )}
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Specialty Sourcing
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specialty-sourcing"
                checked={formData.specialty_sourcing_required}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, specialty_sourcing_required: checked as boolean })
                }
              />
              <Label htmlFor="specialty-sourcing">
                Specialty sourcing required (non-Bangladesh)
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Production Route</Label>
              <Select
                value={formData.production_route}
                onValueChange={(value) => setFormData({ ...formData, production_route: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh_only">Bangladesh Only</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Bangladesh + Specialty)</SelectItem>
                  <SelectItem value="specialty_only">Specialty Partner Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Internal Notes (Not visible to buyer)</Label>
              <Textarea
                placeholder="Why specialty sourcing needed, supplier details, etc."
                value={formData.specialty_notes}
                onChange={(e) => setFormData({ ...formData, specialty_notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bangladesh Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.bangladesh_cost}
                  onChange={(e) => setFormData({ ...formData, bangladesh_cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Specialty Partner Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.specialty_cost}
                  onChange={(e) => setFormData({ ...formData, specialty_cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Markup/Commission ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.admin_markup}
                onChange={(e) => setFormData({ ...formData, admin_markup: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium">Total Quote to Buyer:</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">${calculateTotalQuote()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on {formData.production_route?.replace('_', ' ')} route
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
