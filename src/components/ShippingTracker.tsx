import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { Truck, Package, MapPin, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ShippingInfo {
  id: string;
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: string;
  shipped_date?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  current_location?: string;
  notes?: string;
}

interface ShippingTrackerProps {
  orderId: string;
  canEdit: boolean;
}

export const ShippingTracker = ({ orderId, canEdit }: ShippingTrackerProps) => {
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tracking_number: '',
    carrier: '',
    status: 'preparing',
    estimated_delivery: '',
    current_location: '',
    notes: '',
  });

  useEffect(() => {
    fetchShippingInfo();
  }, [orderId]);

  const fetchShippingInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_info')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setShipping(data);
        setFormData({
          tracking_number: data.tracking_number || '',
          carrier: data.carrier || '',
          status: data.status || 'preparing',
          estimated_delivery: data.estimated_delivery || '',
          current_location: data.current_location || '',
          notes: data.notes || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching shipping info:', error);
      toast.error("Failed to load shipping information");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (shipping) {
        // Update existing
        const { error } = await supabase
          .from('shipping_info')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', shipping.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('shipping_info')
          .insert({
            order_id: orderId,
            ...formData,
            shipped_date: new Date().toISOString(),
          });

        if (error) throw error;
      }

      toast.success("Shipping information updated");
      setEditing(false);
      fetchShippingInfo();
    } catch (error: any) {
      console.error('Error saving shipping info:', error);
      toast.error("Failed to update shipping information");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'in_transit': return 'outline';
      case 'out_for_delivery': return 'secondary';
      case 'preparing': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!shipping && !canEdit) {
    return (
      <Card>
        <CardContent className="text-center p-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No shipping information available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </CardTitle>
        {canEdit && !editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={formData.tracking_number}
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                placeholder="e.g., DHL, FedEx, UPS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="preparing">Preparing</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated">Estimated Delivery</Label>
              <Input
                id="estimated"
                type="date"
                value={formData.estimated_delivery}
                onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                value={formData.current_location}
                onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  if (shipping) {
                    setFormData({
                      tracking_number: shipping.tracking_number || '',
                      carrier: shipping.carrier || '',
                      status: shipping.status || 'preparing',
                      estimated_delivery: shipping.estimated_delivery || '',
                      current_location: shipping.current_location || '',
                      notes: shipping.notes || '',
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : shipping ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(shipping.status)}>
                  {shipping.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="text-sm text-muted-foreground">{shipping.tracking_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Carrier</p>
                  <p className="text-sm text-muted-foreground">{shipping.carrier}</p>
                </div>
              </div>

              {shipping.current_location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-sm text-muted-foreground">{shipping.current_location}</p>
                  </div>
                </div>
              )}

              {shipping.estimated_delivery && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(shipping.estimated_delivery), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}

              {shipping.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm text-muted-foreground">{shipping.notes}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <Button onClick={() => setEditing(true)} className="w-full">
            Add Shipping Information
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
