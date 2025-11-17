import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, Calendar, MapPin, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["track-order", orderId, token],
    queryFn: async () => {
      if (!orderId || !token) {
        throw new Error("Order ID and tracking token are required");
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_updates (
            id,
            stage,
            message,
            completion_percentage,
            photos,
            created_at,
            created_by
          ),
          suppliers:supplier_id (
            company_name,
            factory_location,
            contact_person
          )
        `)
        .eq("id", orderId)
        .eq("tracking_token", token)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Order not found or invalid tracking token");

      return data;
    },
    enabled: !!orderId && !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
      case "in_production":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProductionStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      yarn_received: "Yarn Received",
      knitting: "Knitting",
      linking: "Linking",
      washing_finishing: "Washing & Finishing",
      final_qc: "Final Quality Check",
      packing: "Packing",
      ready_to_ship: "Ready to Ship",
    };
    return labels[stage] || stage;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" />
                Order Not Found
              </CardTitle>
              <CardDescription>
                The tracking link you're using is invalid or has expired. Please check your email for the correct tracking link.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = order.stage_progress?.[order.current_stage] || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Track Your Order</h1>
            <p className="text-muted-foreground">Order #{order.order_number}</p>
          </div>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {order.status?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Product</div>
                    <div className="font-medium">{order.product_type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Quantity</div>
                    <div className="font-medium">{order.quantity} pieces</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Order Date</div>
                    <div className="font-medium">{format(new Date(order.created_at), "MMM d, yyyy")}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Supplier Information */}
              {order.suppliers && (
                <div className="p-4 bg-secondary/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="font-semibold">Manufacturing Partner</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Factory:</span> {order.suppliers.company_name}</div>
                    <div><span className="text-muted-foreground">Location:</span> {order.suppliers.factory_location}</div>
                    {order.suppliers.contact_person && (
                      <div><span className="text-muted-foreground">Contact:</span> {order.suppliers.contact_person}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Production Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Production Progress</div>
                  <div className="text-sm text-muted-foreground">{progressPercentage}% Complete</div>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  Current Stage: {getProductionStageLabel(order.current_stage)}
                </div>
              </div>

              {/* Expected Delivery */}
              {order.target_date && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Expected Delivery</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(order.target_date), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Production Updates */}
          {order.order_updates && order.order_updates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Production Updates</CardTitle>
                <CardDescription>Latest updates from the factory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_updates
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((update: any) => (
                      <div key={update.id} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{getProductionStageLabel(update.stage)}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(update.created_at), "MMM d, h:mm a")}
                            </div>
                          </div>
                          {update.message && (
                            <p className="text-sm text-muted-foreground">{update.message}</p>
                          )}
                          {update.completion_percentage > 0 && (
                            <div className="flex items-center gap-2">
                              <Progress value={update.completion_percentage} className="h-2" />
                              <span className="text-xs text-muted-foreground">{update.completion_percentage}%</span>
                            </div>
                          )}
                          {update.photos && update.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {update.photos.map((photo: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`Production update ${idx + 1}`}
                                  className="rounded border object-cover aspect-square"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
