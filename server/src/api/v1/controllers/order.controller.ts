import { RequestContext } from "../../../middleware/context.js";
import { HttpResponse } from "../../../utils/service-response.js";
import { Order } from "../../../models/order.model.js";
import { Cart } from "../../../models/cart.model.js";
import { Product } from "../../../models/product.model.js";
import {
  NotFoundError,
  ValidationError,
} from "../../../error-handler/index.js";
import { literal, z } from "zod";
import { OrderStatus } from "../../../types/i-order-status.js";
import { simulatePayment } from "@/services/payment.service.js";
import { PaymentStatus } from "@/types/i-payment-status.js";
import { sendOrderConfirmationEmail } from "@/services/email.service.js";
import { flatCheckoutSchema } from "@/schema/checkout.schema.js";

export const OrderController = {
  createOrder: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;
        let orderData = context.req.body;

        const flatOrderData = {
          fullName: orderData.customer?.fullName,
          email: orderData.customer?.email,
          phoneNumber: orderData.customer?.phoneNumber,
          address: orderData.customer?.address?.street,
          city: orderData.customer?.address?.city,
          state: orderData.customer?.address?.state,
          zipCode: orderData.customer?.address?.zipCode,
          cardNumber: orderData.payment?.cardNumber,
          expiryDate: orderData.payment?.expiryDate,
          cvv: orderData.payment?.cvv,
          transactionType: orderData.transactionType,
        };

        // console.log("enter after flat order data creation block");

        try {
          const validatedData = flatCheckoutSchema.parse(flatOrderData);
          orderData.customer = {
            ...orderData.customer,
            fullName: validatedData.fullName,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
            address: {
              ...orderData.customer?.address,
              street: validatedData.address,
              city: validatedData.city,
              state: validatedData.state,
              zipCode: validatedData.zipCode,
            },
          };
          orderData.payment = {
            ...orderData.payment,
            cardNumber: validatedData.cardNumber,
            expiryDate: validatedData.expiryDate,
            cvv: validatedData.cvv,
          };
          orderData.transactionType = validatedData.transactionType;
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            throw new ValidationError(
              "Invalid checkout data",
              validationError.errors
            );
          }
          throw validationError;
        }

        // console.log("enter after order data validation block");

        const cart = await Cart.findOne({ user: userId })
          .populate({
            path: "items.product",
            model: "Product",
          })
          .session(session);

        if (!cart || cart.items.length === 0) {
          throw new NotFoundError("Cart is empty");
        }

        // console.log("enter after cart retrieval block");

        const paymentResult = await simulatePayment(orderData.transactionType); // Simulate payment

        // console.log("enter after payment simulation block");

        const orderNumber = `ORD-${Date.now().toString().slice(-8)}`; // Generate order number

        // console.log("enter after order number generation block");

        const orderItems = cart.items.map((item) => {
          const product = item.product as typeof Product.prototype;
          return {
            product: product._id,
            productSnapshot: {
              title: product.title,
              price: item.price,
              image: product.images[0],
              sku: product.sku,
            },
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          };
        });

        // console.log("enter after order items creation block");

        let orderStatus = OrderStatus.PENDING;
        let paymentStatus = PaymentStatus.PENDING;

        if (paymentResult.success) {
          orderStatus = OrderStatus.PROCESSING;
          paymentStatus = PaymentStatus.APPROVED;
        } else {
          orderStatus = OrderStatus.CANCELLED;
          paymentStatus = PaymentStatus.FAILED;
        }

        // console.log("enter after order and payment status determination block");

        const order = new Order({
          orderNumber,
          user: userId,
          items: orderItems,
          shippingAddress: {
            fullName: orderData.customer.fullName,
            phoneNumber: orderData.customer.phoneNumber,
            addressLine1: orderData.customer.address.street,
            city: orderData.customer.address.city,
            state: orderData.customer.address.state,
            zipCode: orderData.customer.address.zipCode,
            country: "India",
          },
          billingAddress: {
            fullName: orderData.customer.fullName,
            phoneNumber: orderData.customer.phoneNumber,
            addressLine1: orderData.customer.address.street,
            city: orderData.customer.address.city,
            state: orderData.customer.address.state,
            zipCode: orderData.customer.address.zipCode,
            country: "India",
          },
          subtotal: cart.subtotal,
          tax: cart.tax,
          shipping: cart.shipping,
          total: cart.total,
          paymentMethod: "card",
          paymentDetails: {
            cardLast4: orderData.payment.cardNumber.slice(-4),
            transactionId: `TXN-${Date.now().toString().slice(-8)}`,
            gatewayResponse: paymentResult,
          },
          paymentStatus,
          orderStatus,
        });

        // console.log("enter after order creation block");

        for (const item of cart.items) {
          await Product.findByIdAndUpdate(
            item.product._id,
            { $inc: { stock: -item.quantity } },
            { session }
          );
        }

        await Cart.findByIdAndDelete(cart._id, { session }); // delete the cart after order creation

        // console.log("enter order save block");

        await order.save({ session });

        await sendOrderConfirmationEmail(
          order,
          paymentResult.success,
          orderData.customer.email
        ); // Send confirmation email using validated email

        return order;
      });

      return HttpResponse.send(context.res, result, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Validation failed", error.errors);
      }
      throw error;
    }
  },

  getOrders: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const userId = context.user?.id;
        const orders = await Order.find({ user: userId })
          .sort({ createdAt: -1 })
          .session(session);
        return orders;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { orderId } = context.params;
        const userId = context.user?.id;

        const order = await Order.findOne({
          _id: orderId,
          user: userId,
        }).session(session);

        if (!order) {
          throw new NotFoundError("Order not found");
        }

        return order;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { orderId } = context.params;
        const { orderStatus, paymentStatus, trackingNumber, notes } =
          context.req.body;
        const userId = context.user?.id;

        const order = await Order.findOne({
          _id: orderId,
          user: userId,
        }).session(session);

        if (!order) {
          throw new NotFoundError("Order not found");
        }

        // Update fields if provided
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (notes) order.notes = notes;

        await order.save({ session });

        return order;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (context: RequestContext) => {
    try {
      const result = await context.withTransaction(async (session) => {
        const { orderId } = context.params;
        const userId = context.user?.id;

        const order = await Order.findOne({
          _id: orderId,
          user: userId,
        }).session(session);

        if (!order) {
          throw new NotFoundError("Order not found");
        }

        // Check if order can be cancelled
        if (
          ![
            OrderStatus.PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
          ].includes(order.orderStatus as OrderStatus)
        ) {
          throw new ValidationError(
            "Order cannot be cancelled at this stage",
            []
          );
        }

        // Update order status
        order.orderStatus = OrderStatus.CANCELLED;
        order.paymentStatus = PaymentStatus.REFUNDED;
        order.notes = "Order cancelled by user";

        // Restore product inventory
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } },
            { session }
          );
        }

        await order.save({ session });

        return order;
      });

      return HttpResponse.send(context.res, result, 200);
    } catch (error) {
      throw error;
    }
  },
};
