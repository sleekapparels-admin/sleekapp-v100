import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Mail, Phone, ArrowRight, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get order details from URL params
    const orderNumber = searchParams.get("orderNumber");
    const productType = searchParams.get("productType");
    const quantity = searchParams.get("quantity");
    const totalPrice = searchParams.get("totalPrice");
    const deliveryDays = searchParams.get("deliveryDays");
    const trackingUrl = searchParams.get("trackingUrl");
    const email = searchParams.get("email");

    if (orderNumber) {
      setOrderDetails({
        orderNumber,
        productType,
        quantity,
        totalPrice,
        deliveryDays,
        trackingUrl,
        email,
      });
    }
  }, [searchParams]);

  if (!orderDetails) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No order information found.</p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Success Message */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                  <p className="text-lg text-muted-foreground">
                    Thank you for your order. We've received your request and will process it shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
              <CardDescription>Your order information and reference number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-lg font-semibold">{orderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product Type</p>
                  <p className="text-lg font-semibold capitalize">{orderDetails.productType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold">{orderDetails.quantity} pieces</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Total</p>
                  <p className="text-lg font-semibold">${Number(orderDetails.totalPrice).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="text-lg font-semibold">{orderDetails.deliveryDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmation Email</p>
                  <p className="text-lg font-semibold">{orderDetails.email}</p>
                </div>
              </div>

              <Separator />

              {orderDetails.trackingUrl && (
                <Button 
                  onClick={() => window.open(orderDetails.trackingUrl, '_blank')}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Track Your Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>Here's what you can expect from us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Order Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a detailed confirmation email to {orderDetails.email} with your order details and tracking link.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Team Review & Contact</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your order and reach out within 24 hours to discuss final specifications, pricing, and payment terms.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Sample Approval</p>
                    <p className="text-sm text-muted-foreground">
                      Before bulk production, we'll provide samples for your approval to ensure everything meets your expectations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Production & Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Once samples are approved, we'll begin production and keep you updated throughout the process via the tracking link.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Our team is here to assist you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@sleekapparels.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://wa.me/8801515693697" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp Chat
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate("/quote-generator")}
              variant="outline"
              className="w-full"
            >
              Request Another Quote
            </Button>
            <Button 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
