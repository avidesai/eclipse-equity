// src/app/utils/api.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export interface ApiError {
  message?: string;
  errors?: Array<{ msg: string }>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://valueverse-bwrk.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;