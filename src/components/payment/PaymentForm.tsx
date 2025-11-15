import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  amount: number;
  orderId: string;
  paymentType: 'deposit' | 'balance' | 'full';
  onSuccess: () => void;
}

export const PaymentForm = ({ amount, orderId, paymentType, onSuccess }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message,
        });
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Type:</span>
          <span className="font-medium capitalize">{paymentType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-bold text-lg">${amount.toFixed(2)}</span>
        </div>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
};