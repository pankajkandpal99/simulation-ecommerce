import { API_BASE_URL } from "../config/config";

const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `auth/register`,
    LOGIN: `auth/login`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  },
  USER: {
    CURRENT_USER: `${API_BASE_URL}/api/v1/users/me`,
    PROFILE: `${API_BASE_URL}/api/v1/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/v1/users/update`,
  },
  ADMIN: {},
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/api/v1/products`,
    GET_BY_ID: `${API_BASE_URL}/api/v1/products`,
    SEARCH: `${API_BASE_URL}/api/v1/products/search`,
  },
  CART: {
    GET: `${API_BASE_URL}/api/v1/cart`,
    ADD: `${API_BASE_URL}/api/v1/cart/add`,
    UPDATE: `${API_BASE_URL}/api/v1/cart/update`,
    REMOVE: `${API_BASE_URL}/api/v1/cart/remove`,
    CLEAR: `${API_BASE_URL}/api/v1/cart/clear`,
  },
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/v1/orders`,
    GET_ALL: `${API_BASE_URL}/api/v1/orders`,
    GET_BY_ID: `${API_BASE_URL}/api/v1/orders`,
    UPDATE_STATUS: `${API_BASE_URL}/api/v1/orders`,
    CANCEL: `${API_BASE_URL}/api/v1/orders`,
    GET_USER_ORDERS: `${API_BASE_URL}/api/v1/orders/user`,
  },
};

export { API_ENDPOINTS };
