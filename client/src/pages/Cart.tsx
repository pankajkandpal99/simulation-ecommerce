/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  clearCart,
  removeFromCart,
  updateCartItem,
} from "../features/cart/cart.slice";
import { Button } from "../components/ui/button";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const {
    items = [],
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
  } = cart || {};

  // Updated to use productId and variant instead of itemId
  const handleQuantityChange = async (
    productId: string,
    newQuantity: number,
    variant?: { name: string; value: string }
  ) => {
    console.log("product Id : ", productId);
    console.log("new quantity : ", newQuantity);

    if (newQuantity < 1) return;
    await dispatch(
      updateCartItem({
        productId: productId,
        quantity: newQuantity,
        variant,
      })
    );
  };

  // Updated to use productId
  const handleRemoveItem = async (
    productId: string,
    variant?: { name: string; value: string }
  ) => {
    await dispatch(removeFromCart(productId));
  };

  const handleClearCart = async () => {
    await dispatch(clearCart());
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Looks like you haven't added anything to your cart yet
        </p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {items.reduce((sum, item) => sum + item.quantity, 0)} Items
              </h2>
              <Button
                variant="ghost"
                onClick={handleClearCart}
                disabled={loading}
                className="text-destructive hover:text-destructive"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear Cart
              </Button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${
                    item.variant?.name || "default"
                  }-${item.variant?.value || "default"}`}
                  className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border last:border-b-0"
                >
                  <div className="w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product.title}</h3>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveItem(item.product._id, item.variant)
                        }
                        disabled={loading}
                        className="text-destructive hover:text-destructive"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2"
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.quantity - 1,
                              item.variant
                            )
                          }
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "-"
                          )}
                        </Button>
                        <span className="px-4">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2"
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.quantity + 1,
                              item.variant
                            )
                          }
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "+"
                          )}
                        </Button>
                      </div>

                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-border font-medium text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              className="w-full mt-8"
              size="lg"
              asChild
              disabled={loading}
            >
              <Link to="/checkout">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
