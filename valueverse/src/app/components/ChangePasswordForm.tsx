// src/app/components/ChangePasswordForm.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { AxiosError } from 'axios';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ msg: string }>;
}

interface ChangePasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordForm({ isOpen, onClose }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle escape key press
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Close the modal after a delay when successful
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setErrors({
        submit: axiosError.response?.data?.message || 'An error occurred. Please try again.'
      });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold dark:text-white">Change Password</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter your current password and choose a new one.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="p-3 rounded bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
                Password updated successfully!
              </div>
            )}
            
            {errors.submit && (
              <div className="p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <div>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                  text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                  focus:ring-zinc-500 ${errors.currentPassword ? 'border-red-500' : 'border-zinc-300'}`}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                  text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                  focus:ring-zinc-500 ${errors.newPassword ? 'border-red-500' : 'border-zinc-300'}`}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 
                  text-zinc-900 dark:text-white focus:outline-none focus:ring-2 
                  focus:ring-zinc-500 ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-300'}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 
                  text-zinc-700 dark:text-zinc-300 rounded-lg hover:border-zinc-300 
                  dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 
                  transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-black dark:bg-white text-white dark:text-black 
                  rounded-lg transition-all duration-200
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 dark:hover:bg-zinc-100'}`}
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
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}