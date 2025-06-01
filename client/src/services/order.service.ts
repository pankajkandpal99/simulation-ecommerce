import axios from "axios";
import { API_ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../utils/axiosConfig";
import { IOrder } from "../types/order";

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  items: Array<{
    productId: string;
    variant?: {
      name: string;
      value: string;
    };
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  transactionType: string;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  orderStatus?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
}

export const OrderService = {
  async createOrder(payload: CreateOrderPayload): Promise<IOrder> {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ORDERS.CREATE,
        payload
      );

      console.log("response data from create order : ", response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to create order");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getOrders(): Promise<IOrder[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.GET_ALL);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch orders");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getUserOrders(): Promise<IOrder[]> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.ORDERS.GET_USER_ORDERS
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch user orders");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getOrderById(orderId: string): Promise<IOrder> {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ORDERS.GET_BY_ID}/${orderId}`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch order");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async updateOrderStatus(payload: UpdateOrderStatusPayload): Promise<IOrder> {
    try {
      const { orderId, ...updateData } = payload;
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.ORDERS.UPDATE_STATUS}/${orderId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to update order status");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async cancelOrder(orderId: string): Promise<IOrder> {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.ORDERS.CANCEL}/${orderId}/cancel`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to cancel order");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};
