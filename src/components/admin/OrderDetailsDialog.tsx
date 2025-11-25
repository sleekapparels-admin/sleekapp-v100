import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  Factory,
  FileText,
  TrendingUp,
} from 'lucide-react';
import type { Order } from '@/types/database';
import { SupplierAssignmentDialog } from './SupplierAssignmentDialog';
import { formatDistanceToNow } from 'date-fns';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange, onUpdate }: OrderDetailsDialogProps) {
  const [showAssignment, setShowAssignment] = useState(false);

  if (!order) return null;

  const statusColor = order.workflow_status === 'completed' 
    ? 'bg-green-100 text-green-700'
    : order.workflow_status === 'in_production'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-orange-100 text-orange-700';

  return (
    <>
      <Dialog open={open && !showAssignment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">Order #{order.order_number}</DialogTitle>
                <DialogDescription>
                  Created {formatDistanceToNow(new Date(order.created_at || ''), { addSuffix: true })}
                </DialogDescription>
              </div>
              <Badge className={statusColor}>
                {order.workflow_status?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Package className="h-4 w-4" />
                          Product Details
                        </div>
                        <div className="font-semibold">{order.product_type}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {order.quantity} units</div>
                      </div>

                      {order.target_date && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            Target Delivery
                          </div>
                          <div className="font-semibold">
                            {new Date(order.target_date).toLocaleDateString()}
                          </div>
                        </div>
                      )}

                      {order.notes && (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <FileText className="h-4 w-4" />
                            Order Notes
                          </div>
                          <div className="text-sm">{order.notes}</div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <User className="h-4 w-4" />
                          Buyer Information
                        </div>
                        <div className="font-semibold">Buyer ID: {order.buyer_id.slice(0, 8)}...</div>
                      </div>

                      {order.supplier_id ? (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Factory className="h-4 w-4" />
                            Assigned Supplier
                          </div>
                          <div className="font-semibold">Supplier ID: {order.supplier_id.slice(0, 8)}...</div>
                          {order.assigned_at && (
                            <div className="text-xs text-muted-foreground">
                              Assigned {formatDistanceToNow(new Date(order.assigned_at), { addSuffix: true })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Factory className="h-4 w-4" />
                            Supplier Assignment
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setShowAssignment(true)}
                            className="mt-2"
                          >
                            Assign Supplier
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {order.buyer_price && (
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Buyer Price</span>
                        </div>
                        <span className="text-xl font-bold">${order.buyer_price.toLocaleString()}</span>
                      </div>
                    )}

                    {order.supplier_price && (
                      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Supplier Price</span>
                        </div>
                        <span className="text-xl font-bold">${order.supplier_price.toLocaleString()}</span>
                      </div>
                    )}

                    {order.admin_margin && (
                      <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-medium">Admin Margin</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">${order.admin_margin.toLocaleString()}</div>
                          {order.margin_percentage && (
                            <div className="text-sm text-muted-foreground">
                              {order.margin_percentage.toFixed(1)}% margin
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status</span>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status || 'Pending'}
                        </Badge>
                      </div>
                      {order.deposit_amount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deposit Amount</span>
                          <span className="font-medium">${order.deposit_amount.toLocaleString()}</span>
                        </div>
                      )}
                      {order.balance_amount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance Amount</span>
                          <span className="font-medium">${order.balance_amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <div className="font-medium">Order Created</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.created_at || '').toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {order.assigned_at && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div>
                          <div className="font-medium">Supplier Assigned</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.assigned_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {order.updated_at && order.updated_at !== order.created_at && (
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-muted mt-2" />
                        <div>
                          <div className="font-medium">Last Updated</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.updated_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {!order.assigned_at && !order.supplier_id && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No timeline updates yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Supplier Assignment Dialog */}
      {showAssignment && order && (
        <SupplierAssignmentDialog
          order={order}
          open={showAssignment}
          onOpenChange={(open) => {
            setShowAssignment(open);
            if (!open) {
              onUpdate?.();
            }
          }}
          onSuccess={() => {
            setShowAssignment(false);
            onUpdate?.();
            onOpenChange(false);
          }}
        />
      )}
    </>
  );
}
