import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const PaymentFailed = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const reason = params.get("reason");
  const orderId = params.get("orderId");
  const navigate = useNavigate();

  const messages = {
    declined: {
      title: "Payment Declined",
      description:
        "Your payment was declined by the bank. Please try a different payment method.",
    },
    gateway_error: {
      title: "Processing Error",
      description:
        "We encountered an error processing your payment. Please try again in a few minutes.",
    },
    unknown: {
      title: "Payment Failed",
      description: "We couldn't process your payment. Please contact support.",
    },
  };

  const currentMessage =
    messages[reason as keyof typeof messages] || messages.unknown;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{currentMessage.title}</AlertTitle>
        <AlertDescription>{currentMessage.description}</AlertDescription>
      </Alert>

      <div className="space-y-4">
        {orderId && (
          <p className="text-sm text-muted-foreground">
            Order Reference: {orderId}
          </p>
        )}

        <div className="flex gap-4">
          <Button onClick={() => navigate(`/checkout?orderId=${orderId}`)}>
            Try Payment Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Continue Shopping
          </Button>
        </div>

        <div className="pt-8 border-t mt-8">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            Contact our support team at support@example.com or call +1 (555)
            123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
