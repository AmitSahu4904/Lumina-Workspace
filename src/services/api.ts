import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions to manage token in memory / storage
export const getStoredToken = (): string | null => {
  return sessionStorage.getItem('lumina_auth_token');
};

export const setStoredToken = (token: string) => {
  sessionStorage.setItem('lumina_auth_token', token);
};

export const removeStoredToken = () => {
  sessionStorage.removeItem('lumina_auth_token');
};

// Request Interceptor: attach Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle 401 and redirect to logout
let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Logging out...');
      removeStoredToken();
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
