// src/app/components/DownloadDCFButton.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../utils/stripe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface DownloadDCFButtonProps {
  symbol?: string;
}

export default function DownloadDCFButton({ symbol }: DownloadDCFButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const hasPremiumAccess = isAuthenticated && user?.isPremium;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!symbol) {
      setError('No stock selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (hasPremiumAccess) {
        const response = await fetch(`${API_BASE_URL}/stocks/download-model/${symbol}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to download model');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${symbol}_DCF_Model.xlsx`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        await createCheckoutSession();
      }
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download model');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={isLoading || !symbol}
        className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black
          rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100
          transition-all duration-200 font-bold
          hover:translate-y-[-2px] active:translate-y-0
          disabled:opacity-50 disabled:cursor-wait"
      >
        {isLoading ? 'Downloading...' : 'Download Valuation Model'}
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}