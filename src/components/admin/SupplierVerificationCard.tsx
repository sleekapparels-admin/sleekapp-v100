import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Users, 
  Package, 
  Calendar,
  Info
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { SupplierDetailModal } from "./SupplierDetailModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

// TEMPORARY: Using 'any' due to backend types sync issue
type Supplier = any;

interface SupplierVerificationCardProps {
  supplier: Supplier;
  onStatusUpdate: (supplierId: string, status: string, reason?: string) => void;
}

export function SupplierVerificationCard({ supplier, onStatusUpdate }: SupplierVerificationCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'suspended': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleApprove = () => {
    onStatusUpdate(supplier.id, 'verified');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onStatusUpdate(supplier.id, 'rejected', rejectReason);
    setShowRejectDialog(false);
    setRejectReason("");
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-1">{supplier.company_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{supplier.contact_person}</p>
            </div>
            <Badge className={getStatusColor(supplier.verification_status)}>
              {supplier.verification_status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.factory_location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.workforce_size || 'N/A'} workers</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>MOQ: {supplier.moq_minimum}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.lead_time_days} days lead</span>
            </div>
          </div>

          {/* Specializations */}
          {supplier.specializations && supplier.specializations.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {supplier.specializations.slice(0, 3).map((spec: string) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {supplier.specializations.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{supplier.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Registration Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>Registered: {new Date(supplier.created_at).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetail(true)}
              className="flex-1"
            >
              <Info className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            {supplier.verification_status === 'pending' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowRejectDialog(true)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            {supplier.verification_status === 'verified' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(supplier.id, 'suspended')}
                className="flex-1 text-orange-600 hover:text-orange-700"
              >
                Suspend
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <SupplierDetailModal
        supplier={supplier}
        open={showDetail}
        onOpenChange={setShowDetail}
      />

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Supplier Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this supplier application.
              This will be sent to the supplier via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
