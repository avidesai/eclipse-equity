// src/app/account/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AccountPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Account Settings</h1>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2 dark:text-white">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 dark:text-zinc-400">First Name</label>
                  <p className="text-black dark:text-white">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 dark:text-zinc-400">Last Name</label>
                  <p className="text-black dark:text-white">{user.lastName}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-zinc-500 dark:text-zinc-400">Email</label>
                  <p className="text-black dark:text-white">{user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 dark:text-white">Subscription Status</h2>
              <div className="flex items-center space-x-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  user.isPremium 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                }`}>
                  {user.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}