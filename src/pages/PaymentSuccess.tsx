import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Celebrate with confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <>
      <Navbar />
      <RouteErrorBoundary
        fallbackTitle="Payment Page Error"
        fallbackDescription="Unable to display payment confirmation. Please check your dashboard."
      >
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-muted-foreground mb-8">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  size="lg"
                  className="w-full"
                >
                  View Order Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </RouteErrorBoundary>
    </>
  );
}