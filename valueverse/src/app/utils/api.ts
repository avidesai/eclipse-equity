// src/app/utils/api.ts

import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export interface ApiError {
  message?: string;
  errors?: Array<{ msg: string }>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/auth';
    }
    
    // Handle specific error responses
    const errorMessage = error.response?.data?.message || 'An error occurred';
    error.message = errorMessage;
    
    return Promise.reject(error);
  }
);

export default api;