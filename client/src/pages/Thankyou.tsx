import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearCart } from "../features/cart/cart.slice";

const ThankYou = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");
  const { order, loading } = useAppSelector((state) => state.order);

  const handleContinueShopping = () => {
    dispatch(clearCart());

    // Force full page refresh by using window.location
    window.location.href = "/";
  };

  useEffect(() => {
    if (!orderId && !order) {
      navigate("/");
    }
  }, [orderId, order, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!order && !orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No order found</h2>
        <Button onClick={handleContinueShopping}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-8 text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-lg mb-6">
          Your order has been placed successfully. We've sent a confirmation
          email with your order details.
        </p>
        <div className="bg-muted rounded-lg p-6 mb-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{order?._id || orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">
                {new Date(order?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">
                ₹{order?.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
