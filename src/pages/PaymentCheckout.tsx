import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package } from "lucide-react";

const stripePromise = loadStripe('pk_live_51RuOd84W76nzQIDC9qT7MvMrIpGTb1i8aygafh6Qa4l44E1xUYntfNrZ6weFRn9Jq49nc3k8VhD1uKVFrnlaF1Yb00fzcClw3T');

export default function PaymentCheckout() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const paymentType = (searchParams.get('type') || 'deposit') as 'deposit' | 'balance' | 'full';

  useEffect(() => {
    fetchOrderAndCreatePaymentIntent();
  }, [orderId, paymentType]);

  const fetchOrderAndCreatePaymentIntent = async () => {
    try {
      setLoading(true);

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Create payment intent
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { orderId, paymentType },
      });

      if (error) throw error;

      setClientSecret(data.clientSecret);
      setAmount(data.amount);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed. Redirecting...",
    });
    setTimeout(() => {
      navigate(`/orders/${orderId}`);
    }, 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="text-muted-foreground mt-2">
              Secure checkout powered by Stripe
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">Order #{order?.order_number}</h2>
                  <p className="text-sm text-muted-foreground">
                    {order?.product_type} • {order?.quantity} units
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-medium">${order?.buyer_price?.toFixed(2) || order?.total_price?.toFixed(2)}</span>
                </div>
                {paymentType === 'deposit' && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Deposit (30%):</span>
                      <span className="font-medium">${(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining Balance:</span>
                      <span className="font-medium">${((order?.buyer_price || order?.total_price) * 0.70).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {clientSecret && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <PaymentForm
                    amount={amount}
                    orderId={orderId!}
                    paymentType={paymentType}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}