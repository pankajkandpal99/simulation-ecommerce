/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOrderItem {
  product: {
    _id: string;
    title: string;
    images: string[];
    sku: string;
  };
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

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
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
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
