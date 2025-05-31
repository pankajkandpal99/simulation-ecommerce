import { Types } from "mongoose";
import { PaymentStatus } from "../i-payment-status.js";
import { OrderStatus } from "../i-order-status.js";

export interface IOrderItem {
  product: Types.ObjectId;
  productSnapshot: {
    title: string;
    price: number;
    image: string;
    sku: string;
  };
  variant?: {
    name: string;
    value: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentDetails?: {
    cardLast4?: string;
    transactionId?: string;
    gatewayResponse?: any;
  };
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
