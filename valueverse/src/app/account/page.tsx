// src/app/account/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import PremiumButton from '../components/PremiumButton';
import { UserCircle, CreditCard, Shield, Trash2 } from 'lucide-react';

interface AccountSectionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  children: React.ReactNode;
}

interface InfoFieldProps {
  label: string;
  value: string;
}

export default function AccountPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      setStatusMessage({
        type: 'success',
        message: 'Successfully upgraded to premium! Welcome to ValueVerse Premium.'
      });
    } else if (status === 'cancelled') {
      setStatusMessage({
        type: 'error',
        message: 'Premium upgrade was cancelled. You can try again whenever you\'re ready.'
      });
    }

    // Clear the status parameter from URL after a delay
    if (status) {
      const timer = setTimeout(() => {
        router.replace('/account');
        setStatusMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

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

  if (!user) return null;

  const AccountSection = ({ icon: Icon, title, children }: AccountSectionProps) => (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
      <div className="pb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const InfoField = ({ label, value }: InfoFieldProps) => (
    <div className="space-y-1">
      <label className="text-sm text-zinc-500 dark:text-zinc-400">{label}</label>
      <p className="font-medium dark:text-white">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Navigation />
      <main className="container max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Account Settings</h1>
            {statusMessage && (
              <div 
                className={`mt-4 p-4 rounded-lg ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                    : 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                }`}
              >
                {statusMessage.message}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <AccountSection icon={UserCircle} title="Profile Information">
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoField label="First Name" value={user.firstName} />
                <InfoField label="Last Name" value={user.lastName} />
                <InfoField label="Email" value={user.email} />
              </div>
            </AccountSection>

            <AccountSection icon={CreditCard} title="Subscription">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.isPremium
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                    }`}
                  >
                    {user.isPremium ? 'Premium' : 'Free Plan'}
                  </span>
                </div>

                {!user.isPremium && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <PremiumButton />
                    <button className="px-4 py-2 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200">
                      Compare Plans
                    </button>
                  </div>
                )}
              </div>
            </AccountSection>

            <AccountSection icon={Shield} title="Security">
              <div className="space-y-4">
                <button className="px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all duration-200">
                  Change Password
                </button>
              </div>
            </AccountSection>

            <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-2" />

            <div className="flex justify-end">
              <button className="group flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}