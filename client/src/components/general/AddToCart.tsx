import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { addToCart } from "../../features/cart/cart.slice";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  price: number;
  className?: string;
  showPrice?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity,
  variant,
  price,
  className = "",
  showPrice = false,
}) => {
  const dispatch = useAppDispatch();
  const { authenticated } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.cart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!authenticated) {
      toast.warning("Please login to add items to cart", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId,
          quantity,
          variant,
        })
      ).unwrap();

      toast.success("Item added to cart successfully", {
        position: "top-right",
        duration: 2000,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add item to cart";
      toast.error(errorMessage, {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      <span>
        {loading
          ? "Adding..."
          : `Add to Cart${
              showPrice ? ` - ₹${(price * quantity).toLocaleString()}` : ""
            }`}
      </span>
    </Button>
  );
};
