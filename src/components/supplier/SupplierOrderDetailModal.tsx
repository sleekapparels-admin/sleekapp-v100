import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, DollarSign, Package, FileText } from "lucide-react";
import { useSupplierOrders } from "@/hooks/useSupplierOrders";

interface SupplierOrderDetailModalProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const SupplierOrderDetailModal = ({
  order,
  open,
  onOpenChange,
  onUpdate,
}: SupplierOrderDetailModalProps) => {
  const [counterPrice, setCounterPrice] = useState(order.supplier_price || 0);
  const [counterNotes, setCounterNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  
  const { acceptOrder, rejectOrder, submitCounterOffer } = useSupplierOrders(
    order.supplier_id
  );

  const handleAccept = async () => {
    setProcessing(true);
    const success = await acceptOrder(order.id);
    setProcessing(false);
    
    if (success) {
      onUpdate();
      onOpenChange(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return;
    }
    
    setProcessing(true);
    const success = await rejectOrder(order.id, rejectionReason);
    setProcessing(false);
    
    if (success) {
      onUpdate();
      onOpenChange(false);
    }
  };

  const handleCounterOffer = async () => {
    if (!counterNotes.trim() || counterPrice <= 0) {
      return;
    }
    
    setProcessing(true);
    const success = await submitCounterOffer(order.id, counterPrice, counterNotes);
    setProcessing(false);
    
    if (success) {
      onUpdate();
      onOpenChange(false);
    }
  };

  const isPending = order.acceptance_status === 'pending';
  const isAccepted = order.acceptance_status === 'accepted';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_number}</DialogTitle>
          <DialogDescription>
            Review order details and take action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={
                isPending ? 'secondary' : 
                isAccepted ? 'default' : 
                'destructive'
              }>
                {order.acceptance_status?.replace(/_/g, ' ')}
              </Badge>
            </div>
            {order.created_at && (
              <p className="text-sm text-muted-foreground">
                Assigned {new Date(order.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          <Separator />

          {/* Order Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Product Type</Label>
                <p className="font-medium">{order.product_type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantity</Label>
                <p className="font-medium">{order.quantity} units</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Target Date</Label>
                <p className="font-medium">{order.target_date || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Offered Price</Label>
                <p className="font-medium text-green-600">
                  ${order.supplier_price?.toFixed(2) || 'TBD'}
                </p>
              </div>
            </div>

            {order.special_instructions && (
              <div className="mt-4">
                <Label className="text-muted-foreground">Special Instructions</Label>
                <p className="mt-1 p-3 bg-muted/30 rounded-md text-sm">
                  {order.special_instructions}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Buyer Information */}
          {order.buyer_order?.buyer && (
            <div>
              <h3 className="font-semibold mb-3">Buyer Information</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">
                  {order.buyer_order.buyer.company_name || order.buyer_order.buyer.full_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Order #{order.buyer_order.order_number}
                </p>
              </div>
            </div>
          )}

          {isPending && (
            <>
              <Separator />

              {/* Action Tabs */}
              <Tabs defaultValue="accept" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accept">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </TabsTrigger>
                  <TabsTrigger value="counter">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Counter Offer
                  </TabsTrigger>
                  <TabsTrigger value="reject">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="accept" className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Accept Order</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      By accepting this order, you commit to delivering {order.quantity} units
                      of {order.product_type} at ${order.supplier_price?.toFixed(2)} per unit
                      by {order.target_date || 'the agreed date'}.
                    </p>
                    <Button 
                      onClick={handleAccept}
                      disabled={processing}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Order
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="counter" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="counter-price">Counter Offer Price (USD)</Label>
                      <Input
                        id="counter-price"
                        type="number"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Current offer: ${order.supplier_price?.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="counter-notes">Explanation</Label>
                      <Textarea
                        id="counter-notes"
                        value={counterNotes}
                        onChange={(e) => setCounterNotes(e.target.value)}
                        placeholder="Explain why you're proposing a different price..."
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleCounterOffer}
                      disabled={processing || counterPrice <= 0 || !counterNotes.trim()}
                      className="w-full"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Submit Counter Offer
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reject" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                      <Textarea
                        id="rejection-reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please explain why you cannot accept this order..."
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleReject}
                      disabled={processing || !rejectionReason.trim()}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Order
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          {!isPending && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
