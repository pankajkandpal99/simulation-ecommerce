import { OrderStatus } from "../types/i-order-status.js";
import { PaymentStatus } from "../types/i-payment-status.js";
import { IOrder, IOrderItem } from "../types/model/i-order.model.js";
import { Schema } from "mongoose";
import { model } from "mongoose";
import { AddressSubSchema } from "./address.model.js";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSnapshot: {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      sku: { type: String, required: true },
    },
    variant: {
      name: String,
      value: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestEmail: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    items: [OrderItemSchema],
    shippingAddress: {
      type: AddressSubSchema,
      required: true,
    },
    billingAddress: AddressSubSchema,
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "card",
    },
    paymentDetails: {
      cardLast4: String,
      transactionId: String,
      gatewayResponse: Schema.Types.Mixed,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ guestEmail: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = model<IOrder>("Order", OrderSchema);
