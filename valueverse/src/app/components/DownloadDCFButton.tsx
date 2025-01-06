// src/app/components/DownloadDCFButton.tsx

'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../utils/stripe';

export default function DownloadDCFButton() {
  const { isAuthenticated, user } = useAuth();
  const hasPremiumAccess = isAuthenticated && user?.isPremium;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadClick = async () => {
    if (!hasPremiumAccess) {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Starting upgrade process...');
        await createCheckoutSession();
      } catch (error) {
        console.error('Premium upgrade error:', error);
        setError(error instanceof Error ? error.message : 'Failed to initiate premium upgrade.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Premium user functionality (to be implemented later)
      console.log('Premium user download functionality to be implemented');
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownloadClick}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black
                  rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100
                  transition-all duration-200 font-bold
                  hover:translate-y-[-2px] active:translate-y-0
                  disabled:opacity-50 disabled:cursor-wait"
      >
        {isLoading ? 'Processing...' : 'Download Valuation Model'}
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}