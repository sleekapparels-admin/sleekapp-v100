import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Factory, Users, Clock, Save } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface FactoryCapacityManagerProps {
  supplierId: string;
}

export const FactoryCapacityManager = ({ supplierId }: FactoryCapacityManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [capacity, setCapacity] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    total_capacity: 0,
    machines_count: 0,
    workers_count: 0,
    shift_hours: 8,
  });

  useEffect(() => {
    fetchCapacity();
  }, [supplierId, selectedDate]);

  const fetchCapacity = async () => {
    try {
      setLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('factory_capacity')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('date', dateString)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setCapacity(data);
        setFormData({
          total_capacity: data.total_capacity,
          machines_count: data.machines_count || 0,
          workers_count: data.workers_count || 0,
          shift_hours: data.shift_hours || 8,
        });
      } else {
        setCapacity(null);
        setFormData({
          total_capacity: 0,
          machines_count: 0,
          workers_count: 0,
          shift_hours: 8,
        });
      }
    } catch (error) {
      console.error('Error fetching capacity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');

      const dataToSave = {
        supplier_id: supplierId,
        date: dateString,
        ...formData,
        available_capacity: formData.total_capacity - (capacity?.current_utilization || 0),
      };

      const { error } = capacity
        ? await supabase
            .from('factory_capacity')
            .update(dataToSave)
            .eq('id', capacity.id)
        : await supabase
            .from('factory_capacity')
            .insert(dataToSave);

      if (error) throw error;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "🎉 Success!",
        description: "Factory capacity updated successfully",
      });

      setEditing(false);
      await fetchCapacity();
    } catch (error: any) {
      console.error('Error saving capacity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update capacity",
      });
    } finally {
      setLoading(false);
    }
  };

  const utilizationPercentage = capacity?.total_capacity > 0
    ? (capacity.current_utilization / capacity.total_capacity) * 100
    : 0;

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Capacity Overview */}
      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Capacity Overview
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
          ) : (
            <>
              {/* Current Utilization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Current Utilization</Label>
                  <span className={cn("text-2xl font-bold", getUtilizationColor(utilizationPercentage))}>
                    {utilizationPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={utilizationPercentage}
                  className="transition-all duration-500 ease-in-out"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{capacity?.current_utilization || 0} units used</span>
                  <span>{capacity?.available_capacity || 0} units available</span>
                </div>
              </div>

              {/* Capacity Details */}
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="total-capacity">Total Capacity (units/day)</Label>
                  <Input
                    id="total-capacity"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g., 5000"
                    value={formData.total_capacity || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, total_capacity: value ? parseInt(value) : 0 });
                    }}
                    disabled={!editing}
                    className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="machines">
                      <Factory className="h-4 w-4 inline mr-1 transition-transform duration-200 group-hover:scale-110" />
                      Machines
                    </Label>
                    <Input
                      id="machines"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g., 25"
                      value={formData.machines_count || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, machines_count: value ? parseInt(value) : 0 });
                      }}
                      disabled={!editing}
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="workers">
                      <Users className="h-4 w-4 inline mr-1 transition-transform duration-200 group-hover:scale-110" />
                      Workers
                    </Label>
                    <Input
                      id="workers"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g., 150"
                      value={formData.workers_count || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, workers_count: value ? parseInt(value) : 0 });
                      }}
                      disabled={!editing}
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shift-hours">
                      <Clock className="h-4 w-4 inline mr-1 transition-transform duration-200 group-hover:scale-110" />
                      Shift Hours
                    </Label>
                    <Input
                      id="shift-hours"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g., 8"
                      value={formData.shift_hours || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, shift_hours: value ? parseInt(value) : 8 });
                      }}
                      disabled={!editing}
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Capacity Tips */}
      <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Capacity Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Keep your capacity updated daily for accurate order matching</li>
            <li>• Aim for 70-85% utilization for optimal efficiency</li>
            <li>• Plan ahead for holidays and maintenance downtime</li>
            <li>• Update machine and worker counts as your factory scales</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
