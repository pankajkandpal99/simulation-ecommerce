/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../features/cart/cart.slice";
import { createOrder } from "../features/order/order.slice";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  checkoutFormSchema,
  CheckoutFormValues,
} from "../schema/checkout.schema";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { loading, order, error } = useAppSelector((state) => state.order);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      transactionType: "1", // Default to approved transaction
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!cart) return;

    const orderData = {
      customer: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: {
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
      },
      payment: {
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      },
      items: cart.items.map((item) => ({
        productId: item.product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
      transactionType: data.transactionType,
    };

    try {
      const result = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(result)) {
        const payload = result.payload;

        if (payload) {
          switch (payload.paymentStatus) {
            case "COMPLETED":
              dispatch(clearCart());
              navigate(`/thank-you?orderId=${payload._id}`);
              break;
            case "FAILED":
              navigate(
                `/payment-failed?reason=declined&orderId=${payload._id}`
              );
              break;
            case "PENDING":
              navigate(
                `/payment-failed?reason=gateway_error&orderId=${payload._id}`
              );
              break;
            default:
              navigate(`/payment-failed?reason=unknown`);
          }
        } else {
          navigate(`/payment-failed?reason=unknown`);
        }
      } else if (createOrder.rejected.match(result)) {
        navigate(`/payment-failed?reason=unknown`);
      }
    } catch {
      navigate(`/payment-failed?reason=unknown`);
    }
  };

  useEffect(() => {
    if (order) {
      dispatch(clearCart());
      navigate(`/thank-you?orderId=${order._id}`);
    }
  }, [order, navigate, dispatch, form]);

  if (!cart || cart.items.length === 0) {
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
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={`${item.product._id}-${
                      item.variant?.name || "default"
                    }-${item.variant?.value || "default"}`}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {item.product.title}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{cart.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{cart.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-medium text-lg">
                  <span>Total</span>
                  <span>₹{cart.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm text-center rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field, fieldState }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className={
                                fieldState.error ? "border-destructive" : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              className={
                                fieldState.error ? "border-destructive" : ""
                              }
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              {...field}
                              className={
                                fieldState.error ? "border-destructive" : ""
                              }
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field, fieldState }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your address"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your city"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your state"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your zip code"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field, fieldState }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234 5678 9012 3456"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM/YY"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123"
                                {...field}
                                className={
                                  fieldState.error ? "border-destructive" : ""
                                }
                                type="password"
                                maxLength={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transactionType"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Transaction Simulation</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    {...field}
                                    value="1"
                                    checked={field.value === "1"}
                                    className="h-4 w-4 text-primary border-border"
                                  />
                                  Approved
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    {...field}
                                    value="2"
                                    checked={field.value === "2"}
                                    className="h-4 w-4 text-primary border-border"
                                  />
                                  Declined
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    {...field}
                                    value="3"
                                    checked={field.value === "3"}
                                    className="h-4 w-4 text-primary border-border"
                                  />
                                  Gateway Error
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <CardFooter className="px-0 pb-0 pt-6">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Place Order
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
