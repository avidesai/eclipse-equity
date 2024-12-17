// src/app/account/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Navigation />
        <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <div className="pt-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 mt-8 dark:text-white">Account Settings</h1>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Profile Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-500 dark:text-zinc-400">First Name</label>
                    <p className="mt-1 text-black dark:text-white">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-500 dark:text-zinc-400">Last Name</label>
                    <p className="mt-1 text-black dark:text-white">{user.lastName}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-zinc-500 dark:text-zinc-400">Email</label>
                    <p className="mt-1 text-black dark:text-white">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Subscription Status</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        user.isPremium
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                      }`}
                    >
                      {user.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  
                  {!user.isPremium && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        className="inline-flex items-center justify-center px-6 py-2 
                                 bg-black dark:bg-white text-white dark:text-black rounded-lg
                                 hover:bg-zinc-800 dark:hover:bg-zinc-100 
                                 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        Upgrade to Premium
                      </button>
                      <button
                        className="inline-flex items-center justify-center px-6 py-2
                                 border-2 border-black dark:border-white
                                 text-black dark:text-white rounded-lg
                                 hover:bg-black hover:text-white 
                                 dark:hover:bg-white dark:hover:text-black
                                 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        View Plans
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Account Security</h2>
                <button
                  className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-600
                           text-zinc-700 dark:text-zinc-300 rounded-lg
                           hover:border-zinc-400 dark:hover:border-zinc-500
                           hover:bg-zinc-50 dark:hover:bg-zinc-700/50
                           transition-all duration-200"
                >
                  Change Password
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400
                           hover:text-red-700 dark:hover:text-red-300
                           transition-colors duration-200"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}