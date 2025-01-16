// src/app/forgot-password/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import api from '../utils/api';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ msg: string }>;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage({
        type: 'success',
        text: 'If an account exists with this email, a password reset link will be sent.'
      });
      // Clear the form
      setEmail('');
    } catch (err: unknown) {
      console.error('Password reset request error:', err);
      if (err instanceof AxiosError) {
        const error = err as AxiosError<ApiErrorResponse>;
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'An error occurred. Please try again.'
        });
      } else {
        setMessage({
          type: 'error',
          text: 'An error occurred. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <div className="w-full min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
            Reset Password
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                  text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                  focus:ring-zinc-500 border-zinc-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-black dark:bg-white text-white dark:text-black 
                rounded-lg transition-all duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
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
    </div>
  );
}