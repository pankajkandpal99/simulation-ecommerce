import { Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  variant?: {
    name: string;
    value: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  guestId?: string;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
