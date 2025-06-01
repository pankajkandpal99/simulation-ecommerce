import axios from "axios";
import { API_ENDPOINTS } from "../api/apiConfig";
import { API_BASE_URL } from "../config/config";
import { IProduct } from "../sections/Home/ProductCard";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const ProductService = {
  async getAllProducts() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
      return response.data.data.products as IProduct[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch products");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async getProductById(id: string) {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`
      );
      return response.data.data as IProduct;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Failed to fetch product");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },

  async searchProducts(query: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
        params: { q: query },
      });
      return response.data.data as IProduct[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.error || "Search failed");
      }
      throw new Error("Network error occurred. Please try again.");
    }
  },
};
