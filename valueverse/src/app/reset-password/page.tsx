// src/app/reset-password/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '../components/Navigation';
import api from '../utils/api';
import { AxiosError } from 'axios';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    }
  }, [token, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;
    
    setLoading(true);
    setMessage(null);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Password has been reset successfully. Redirecting to login...' 
      });
      
      setTimeout(() => router.push('/auth'), 2000);
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Invalid or expired reset link. Please try again.'
        : 'An unknown error occurred. Please try again.';
        
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Reset Your Password
        </h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          } text-sm`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 
                ${errors.password ? 'border-red-500' : 'border-zinc-300'}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 
                ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-300'}`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg 
              transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/auth')}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 
              dark:hover:text-zinc-100 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <div className="pt-16">
        <Suspense fallback={
          <div className="w-full h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}