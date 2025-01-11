// src/app/components/ChangePasswordForm.tsx
'use client';
import { useState } from 'react';
import api from '../utils/api';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'An error occurred. Please try again.'
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 bg-black dark:bg-white text-white dark:text-black 
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
    </form>
  );
}