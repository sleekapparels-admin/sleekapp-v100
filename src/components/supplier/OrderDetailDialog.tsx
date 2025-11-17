import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, FileText, Image as ImageIcon } from "lucide-react";

interface OrderDetailDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order #{order.order_number}</DialogTitle>
          <DialogDescription>Complete order details and specifications</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge>{order.status.replace('_', ' ')}</Badge>
            <p className="text-sm text-muted-foreground">
              Created {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Product Type</p>
              <p className="font-medium">{order.product_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Quantity</p>
              <p className="font-medium flex items-center gap-1">
                <Package className="h-4 w-4" />
                {order.quantity} units
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Price</p>
              <p className="font-medium flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${order.supplier_price?.toFixed(2) || 'TBD'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Delivery</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {order.target_date ? new Date(order.target_date).toLocaleDateString() : 'TBD'}
              </p>
            </div>
          </div>

          {order.special_instructions && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Special Instructions</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {order.special_instructions}
                </p>
              </div>
            </>
          )}

          {order.tech_pack_urls && order.tech_pack_urls.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tech Packs
                </p>
                <div className="space-y-2">
                  {order.tech_pack_urls.map((url: string, idx: number) => (
                    <Button key={idx} variant="outline" size="sm" asChild className="w-full">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        View Tech Pack {idx + 1}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {order.reference_images && order.reference_images.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Reference Images
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {order.reference_images.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-lg overflow-hidden border hover:opacity-80 transition"
                    >
                      <img
                        src={url}
                        alt={`Reference ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-2">
            <Button variant="default" className="flex-1">
              Accept Order
            </Button>
            <Button variant="outline" className="flex-1">
              Request Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
