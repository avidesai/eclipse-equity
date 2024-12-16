'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '../utils/api'; // Import the API utility
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleForm = () => {
    setError(null);
    setIsLogin((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login Request
        const res = await api.post('/auth/signin', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', res.data.token); // Save JWT token
        router.push('/models'); // Redirect after successful login
      } else {
        // Signup Request
        await api.post('/auth/signup', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        alert('Account created! Check your email to verify your account.');
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
            required
          />
          <button
            type="submit"
            className={`w-full py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={toggleForm}
              className="text-zinc-900 dark:text-zinc-100 underline hover:text-zinc-700 dark:hover:text-zinc-300 transition"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
