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
};

export { API_ENDPOINTS };
