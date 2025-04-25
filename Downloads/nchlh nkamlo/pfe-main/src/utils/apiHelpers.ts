import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// GET request
export const get = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  try {
    const response = await api.get<T>(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST request
export const post = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT request
export const put = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const del = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
