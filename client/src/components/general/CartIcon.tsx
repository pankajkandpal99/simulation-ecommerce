import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCart } from "../../features/cart/cart.slice";

const CartIcon: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="p-2 hover:bg-muted rounded-lg transition-all duration-300 relative hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
      style={{
        filter:
          itemCount > 0
            ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))"
            : "none",
      }}
      aria-label="Cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-lg shadow-primary/30">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
