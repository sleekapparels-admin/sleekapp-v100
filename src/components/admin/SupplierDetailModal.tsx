import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/integrations/supabase/types";
import { 
  MapPin, 
  Users, 
  Package, 
  Clock, 
  Calendar,
  Mail,
  Phone,
  Globe,
  Building,
  FileText
} from "lucide-react";

// TEMPORARY: Using 'any' due to backend types sync issue
type Supplier = any;

interface SupplierDetailModalProps {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDetailModal({ supplier, open, onOpenChange }: SupplierDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{supplier.company_name}</DialogTitle>
          <DialogDescription>Complete supplier profile and registration details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Contact Person</p>
                <p className="font-medium">{supplier.contact_person || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{supplier.contact_email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{supplier.contact_phone || 'N/A'}</p>
              </div>
              {supplier.website_url && (
                <div>
                  <p className="text-muted-foreground">Website</p>
                  <a 
                    href={supplier.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    {supplier.website_url}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Factory Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Factory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {supplier.factory_location}
                </p>
              </div>
              {supplier.address && (
                <div>
                  <p className="text-muted-foreground">Full Address</p>
                  <p className="font-medium">{supplier.address}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Workforce Size</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {supplier.workforce_size || 'N/A'} workers
                </p>
              </div>
              {supplier.year_established && (
                <div>
                  <p className="text-muted-foreground">Year Established</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {supplier.year_established}
                  </p>
                </div>
              )}
              {supplier.business_registration_number && (
                <div>
                  <p className="text-muted-foreground">Business Registration</p>
                  <p className="font-medium flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {supplier.business_registration_number}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Production Capabilities */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Production Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Minimum Order</p>
                <p className="font-medium">{supplier.moq_minimum} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Maximum Order</p>
                <p className="font-medium">{supplier.moq_maximum || 'No limit'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lead Time</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {supplier.lead_time_days} days
                </p>
              </div>
              {supplier.total_capacity_monthly && (
                <div>
                  <p className="text-muted-foreground">Monthly Capacity</p>
                  <p className="font-medium">{supplier.total_capacity_monthly.toLocaleString()} units</p>
                </div>
              )}
            </div>
          </div>

          {/* Specializations */}
          {supplier.specializations && supplier.specializations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Product Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.specializations.map((spec: string) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* About */}
          {supplier.about && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">About Company</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {supplier.about}
                </p>
              </div>
            </>
          )}

          {/* Performance Metrics */}
          <Separator />
          <div>
            <h3 className="font-semibold mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold">{supplier.performance_score || 0}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Orders Completed</p>
                <p className="text-2xl font-bold">{supplier.total_orders_completed}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold">{supplier.on_time_delivery_rate?.toFixed(0) || 0}%</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Tier</p>
                <p className="text-2xl font-bold capitalize">{supplier.tier}</p>
              </div>
            </div>
          </div>

          {/* Registration Info */}
          <Separator />
          <div className="text-xs text-muted-foreground">
            <p>Registered: {new Date(supplier.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(supplier.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
