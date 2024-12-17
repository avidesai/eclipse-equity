// /src/app/components/AuthForm.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? '/auth/signin' : '/auth/signup';
      const res = await api.post(endpoint, formData);
      
      await login(res.data.token);
      router.push('/models');
      router.refresh(); // Refresh the page to update navigation state
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.msg ||
                          'An error occurred. Please try again.';
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        
        {errors.submit && (
          <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                    text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                    focus:ring-zinc-500 ${errors.firstName ? 'border-red-500' : 'border-zinc-300'}`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                    text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                    focus:ring-zinc-500 ${errors.lastName ? 'border-red-500' : 'border-zinc-300'}`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                focus:ring-zinc-500 ${errors.email ? 'border-red-500' : 'border-zinc-300'}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                focus:ring-zinc-500 ${errors.password ? 'border-red-500' : 'border-zinc-300'}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
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
                Processing...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
              });
            }}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 
              dark:hover:text-zinc-100 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}