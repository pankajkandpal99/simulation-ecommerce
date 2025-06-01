import axios from "axios";
import { API_ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../utils/axiosConfig";
import { ICart } from "../types/cart";

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

export const CartService = {
  async getCart(): Promise<ICart> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch cart");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async addToCart(payload: AddToCartPayload): Promise<ICart> {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CART.ADD,
        payload
      );

      console.log("response data from add to cart : ", response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to add item to cart");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async updateCartItem(payload: UpdateCartItemPayload): Promise<ICart> {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.CART.UPDATE}/${payload.productId}`,
        { quantity: payload.quantity }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to update cart item");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async removeFromCart(itemId: string): Promise<ICart> {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.CART.REMOVE}/${itemId}`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to remove item from cart");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async clearCart(): Promise<ICart> {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to clear cart");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};
