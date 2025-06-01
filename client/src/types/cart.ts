import { IProduct } from "../sections/Home/ProductCard";

export interface ICartItem {
  id: string;
  product: IProduct;
  variant?: {
    name: string;
    value: string;
    price?: number;
    stock?: number;
    sku?: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
  addedAt: Date;
}

export interface ICart {
  id: string;
  userId?: string;
  guestId?: string;
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartApiResponse {
  success: boolean;
  code: number;
  data: ICart;
  timestamp: string;
}

export interface CartState {
  cart: ICart | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
